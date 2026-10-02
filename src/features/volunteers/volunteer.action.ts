"use server";

import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";
import bcryptjs from "bcryptjs";

import { auth } from "@/lib/auth";
import { canCreate, canManageRole, isRole } from "@/lib/rbac";

import type {
  ListVolunteersParams,
  RoleCounts,
  Volunteer,
  VolunteerListResult,
} from "./volunteer.entity";
import {
  type UpdateVolunteerRow,
  volunteerRepository,
} from "./volunteer.repository";
import {
  type CreateVolunteerInput,
  createVolunteerSchema,
  type SetStatutInput,
  setStatutSchema,
  type UpdateVolunteerData,
  type UpdateVolunteerInput,
  updateVolunteerSchema,
} from "./volunteer.schema";

export type ActionResult<T> =
  { success: true; data: T } | { success: false; error: string };

type Actor = { id: number; role: Role };

const UNAUTHENTICATED = "Vous devez être connecté pour effectuer cette action.";

async function getActor(): Promise<Actor | null> {
  const session = await auth();
  const rawId = session?.user?.id;
  const rawRole = session?.user?.role;
  if (!rawId || !isRole(rawRole) || rawRole === "USER") return null;
  const id = Number.parseInt(rawId, 10);
  if (!Number.isFinite(id)) return null;
  return { id, role: rawRole };
}

function buildUpdateRow(
  data: UpdateVolunteerData,
  hashedPassword: string | undefined
): UpdateVolunteerRow {
  const row: UpdateVolunteerRow = {};
  if (data.nom !== undefined) row.nom = data.nom;
  if (data.prenom !== undefined) row.prenom = data.prenom;
  if (data.email !== undefined) row.email = data.email.toLowerCase();
  if (hashedPassword !== undefined) row.password = hashedPassword;
  if (data.role !== undefined) row.role = data.role;
  if (data.statut !== undefined) row.statut = data.statut;
  if (data.dateEntree !== undefined) row.dateEntree = data.dateEntree;
  return row;
}

export async function listVolunteersAction(
  params: ListVolunteersParams = {}
): Promise<ActionResult<VolunteerListResult>> {
  const actor = await getActor();
  if (!actor) return { success: false, error: UNAUTHENTICATED };
  const data = await volunteerRepository.list(params);
  return { success: true, data };
}

export async function getVolunteerAction(
  id: number
): Promise<ActionResult<Volunteer>> {
  const actor = await getActor();
  if (!actor) return { success: false, error: UNAUTHENTICATED };
  const volunteer = await volunteerRepository.getById(id);
  if (!volunteer) return { success: false, error: "Bénévole introuvable." };
  return { success: true, data: volunteer };
}

export async function getRoleCountsAction(): Promise<ActionResult<RoleCounts>> {
  const actor = await getActor();
  if (!actor) return { success: false, error: UNAUTHENTICATED };
  return { success: true, data: await volunteerRepository.countByRole() };
}

export async function createVolunteerAction(
  input: CreateVolunteerInput
): Promise<ActionResult<Volunteer>> {
  const actor = await getActor();
  if (!actor) return { success: false, error: UNAUTHENTICATED };

  const parsed = createVolunteerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides.",
    };
  }

  const { nom, prenom, email, password, role, statut, dateEntree } =
    parsed.data;

  // Matrice de création appliquée CÔTÉ SERVEUR, AVANT toute écriture en base.
  if (!canCreate(actor.role, role)) {
    return {
      success: false,
      error: `Vous ne pouvez pas créer un compte ${role}.`,
    };
  }

  const normalizedEmail = email.toLowerCase();
  if (await volunteerRepository.emailExists(normalizedEmail)) {
    return { success: false, error: "Un compte existe déjà avec cet email." };
  }

  const created = await volunteerRepository.create({
    nom,
    prenom,
    email: normalizedEmail,
    password: await bcryptjs.hash(password, 10),
    role,
    statut,
    dateEntree,
    createdById: actor.id,
  });

  revalidatePath("/admin/volunteer-management");
  return { success: true, data: created };
}

export async function updateVolunteerAction(
  id: number,
  input: UpdateVolunteerInput
): Promise<ActionResult<Volunteer>> {
  const actor = await getActor();
  if (!actor) return { success: false, error: UNAUTHENTICATED };

  const parsed = updateVolunteerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides.",
    };
  }

  const target = await volunteerRepository.findMetaById(id);
  if (!target || target.deletedAt) {
    return { success: false, error: "Bénévole introuvable." };
  }
  if (!canManageRole(actor.role, target.role)) {
    return {
      success: false,
      error:
        "Vous ne pouvez pas modifier un compte de rang supérieur au vôtre.",
    };
  }

  const data = parsed.data;
  if (
    data.role &&
    data.role !== target.role &&
    !canCreate(actor.role, data.role)
  ) {
    return {
      success: false,
      error: `Vous ne pouvez pas attribuer le rôle ${data.role}.`,
    };
  }

  if (data.email) {
    const normalized = data.email.toLowerCase();
    if (await volunteerRepository.emailExists(normalized, id)) {
      return {
        success: false,
        error: "Un autre compte utilise déjà cet email.",
      };
    }
  }

  const hashedPassword =
    data.password && data.password.length > 0
      ? await bcryptjs.hash(data.password, 10)
      : undefined;

  const updated = await volunteerRepository.update(
    id,
    buildUpdateRow(data, hashedPassword)
  );

  revalidatePath("/admin/volunteer-management");
  revalidatePath(`/admin/volunteer-management/${id}`);
  return { success: true, data: updated };
}

export async function deleteVolunteerAction(
  id: number
): Promise<ActionResult<{ id: number }>> {
  const actor = await getActor();
  if (!actor) return { success: false, error: UNAUTHENTICATED };

  const target = await volunteerRepository.findMetaById(id);
  if (!target || target.deletedAt) {
    return { success: false, error: "Bénévole introuvable." };
  }
  if (target.id === actor.id) {
    return {
      success: false,
      error: "Vous ne pouvez pas supprimer votre propre compte.",
    };
  }
  if (!canManageRole(actor.role, target.role)) {
    return {
      success: false,
      error:
        "Vous ne pouvez pas supprimer un compte de rang supérieur au vôtre.",
    };
  }

  await volunteerRepository.softDelete(id);
  revalidatePath("/admin/volunteer-management");
  return { success: true, data: { id } };
}

export async function setStatutAction(
  input: SetStatutInput
): Promise<ActionResult<Volunteer>> {
  const actor = await getActor();
  if (!actor) return { success: false, error: UNAUTHENTICATED };

  const parsed = setStatutSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Statut invalide." };
  }

  const target = await volunteerRepository.findMetaById(parsed.data.id);
  if (!target || target.deletedAt) {
    return { success: false, error: "Bénévole introuvable." };
  }
  if (target.id === actor.id) {
    return {
      success: false,
      error: "Vous ne pouvez pas modifier le statut de votre propre compte.",
    };
  }
  if (!canManageRole(actor.role, target.role)) {
    return {
      success: false,
      error:
        "Vous ne pouvez pas modifier un compte de rang supérieur au vôtre.",
    };
  }

  const updated = await volunteerRepository.setStatut(
    parsed.data.id,
    parsed.data.statut
  );

  revalidatePath("/admin/volunteer-management");
  revalidatePath("/admin/volunteer-management/roles");
  return { success: true, data: updated };
}

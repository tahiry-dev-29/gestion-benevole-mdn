"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

import {
  type CreateObservationInput,
  createObservationSchema,
  type DeleteObservationInput,
  deleteObservationSchema,
  type UpdateObservationInput,
  updateObservationSchema,
} from "./observation.schema";

function isAdminRole(role: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

/** Créer une observation — unicité (user, mois, annee) garantie par la DB */
export async function createObservationAction(data: CreateObservationInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Non authentifié." };
  }
  if (!isAdminRole(session.user.role ?? "")) {
    return { success: false, error: "Accès interdit (403)." };
  }

  const parsed = createObservationSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides.",
    };
  }

  const auteurId = parseInt(session.user.id, 10);

  const existing = await prisma.observation.findUnique({
    where: {
      user_id_mois_annee: {
        user_id: parsed.data.userId,
        mois: parsed.data.mois,
        annee: parsed.data.annee,
      },
    },
  });

  if (existing) {
    return {
      success: false,
      error: `Une observation existe déjà pour ce bénévole en ${parsed.data.mois}/${parsed.data.annee}.`,
    };
  }

  try {
    const observation = await prisma.observation.create({
      data: {
        user_id: parsed.data.userId,
        auteur_id: auteurId,
        mois: parsed.data.mois,
        annee: parsed.data.annee,
        contenu: parsed.data.contenu,
      },
      include: {
        user: { select: { id: true, nom: true, prenom: true } },
        auteur: { select: { id: true, nom: true, prenom: true } },
      },
    });

    revalidatePath("/admin/observations");
    return { success: true, data: observation };
  } catch {
    return {
      success: false,
      error: "Erreur lors de la création de l'observation.",
    };
  }
}

/** Modifier une observation — admin ou auteur uniquement */
export async function updateObservationAction(data: UpdateObservationInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Non authentifié." };
  }

  const parsed = updateObservationSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides.",
    };
  }

  const currentUserId = parseInt(session.user.id, 10);
  const isAdmin = isAdminRole(session.user.role ?? "");

  const existing = await prisma.observation.findUnique({
    where: { id: parsed.data.observationId },
  });

  if (!existing) {
    return { success: false, error: "Observation introuvable." };
  }

  const isAuteur = existing.auteur_id === currentUserId;
  if (!isAdmin && !isAuteur) {
    return { success: false, error: "Accès interdit (403)." };
  }

  try {
    const updated = await prisma.observation.update({
      where: { id: parsed.data.observationId },
      data: { contenu: parsed.data.contenu },
      include: {
        user: { select: { id: true, nom: true, prenom: true } },
        auteur: { select: { id: true, nom: true, prenom: true } },
      },
    });

    revalidatePath("/admin/observations");
    return { success: true, data: updated };
  } catch {
    return {
      success: false,
      error: "Erreur lors de la mise à jour de l'observation.",
    };
  }
}

/** Supprimer une observation — admin ou auteur uniquement */
export async function deleteObservationAction(data: DeleteObservationInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Non authentifié." };
  }

  const parsed = deleteObservationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Données invalides." };
  }

  const currentUserId = parseInt(session.user.id, 10);
  const isAdmin = isAdminRole(session.user.role ?? "");

  const existing = await prisma.observation.findUnique({
    where: { id: parsed.data.observationId },
  });

  if (!existing) {
    return { success: false, error: "Observation introuvable." };
  }

  const isAuteur = existing.auteur_id === currentUserId;
  if (!isAdmin && !isAuteur) {
    return { success: false, error: "Accès interdit (403)." };
  }

  try {
    await prisma.observation.delete({
      where: { id: parsed.data.observationId },
    });
    revalidatePath("/admin/observations");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Erreur lors de la suppression de l'observation.",
    };
  }
}

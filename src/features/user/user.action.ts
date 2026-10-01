"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { isAdminOrAbove } from "@/lib/rbac";

import {
  approveCertificateSchema,
  type CreateUserInput,
  createUserSchema,
  rejectCertificateSchema,
  type UpdateProfileInput,
  updateProfileSchema,
  type UpdateUserInput,
  updateUserSchema,
} from "./user.schema";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Non authentifié." } as const;
  if (!isAdminOrAbove(session.user.role as "SUPER_ADMIN" | "ADMIN" | "VOLUNTEER" | "USER")) {
    return { error: "Accès réservé aux administrateurs." } as const;
  }
  return { session } as const;
}

// ---------------------------------------------------------------------------
// createUserAction
// ---------------------------------------------------------------------------

export async function createUserAction(data: CreateUserInput) {
  const auth = await requireAdminSession();
  if ("error" in auth) return { success: false, error: auth.error };

  const parsed = createUserSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const {
    nom,
    prenom,
    email,
    sexe,
    matricule,
    telephone,
    materielPC,
    accepteRegles,
    spinneret,
    etablissement,
    societe,
    age,
    dateNaissance,
    socialProfile,
    cvUrl,
    siteWeb,
    joursDisponibles,
    disponibilites,
    contactUrgence,
    facebook,
    categorie,
  } = parsed.data;

  const createdById = parseInt(auth.session.user.id, 10);

  try {
    const user = await prisma.user.create({
      data: {
        nom,
        prenom,
        email: email.toLowerCase(),
        // role forcé à USER côté serveur — jamais pris du formulaire
        role: "USER",
        statut: "ACTIF",
        date_entree: new Date(),
        sexe: sexe ?? "Non précisé",
        age: age ?? 18,
        categorie: categorie ?? "UNIVERSITAIRE",
        etablissement: etablissement ?? "Non renseigné",
        facebook: facebook ?? null,
        matricule,
        telephone,
        materielPC,
        accepteRegles,
        reglesAccepteesAt: accepteRegles ? new Date() : null,
        spinneret: spinneret ?? null,
        societe: societe ?? null,
        dateNaissance: dateNaissance ? new Date(dateNaissance) : null,
        socialProfile: socialProfile ?? null,
        cvUrl: cvUrl ?? null,
        siteWeb: siteWeb ?? null,
        joursDisponibles: joursDisponibles ?? [],
        disponibilites: disponibilites ?? undefined,
        contactUrgence: contactUrgence ?? null,
        createdById,
      },
    });

    revalidatePath("/admin/users");
    return { success: true, data: { id: user.id } };
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      const target = (err as { meta?: { target?: string[] } }).meta?.target ?? [];
      if (target.includes("email")) {
        return { success: false, error: "Cet email est déjà utilisé." };
      }
      if (target.includes("matricule")) {
        return { success: false, error: "Ce matricule est déjà utilisé." };
      }
    }
    return { success: false, error: "Erreur lors de la création de l'utilisateur." };
  }
}

// ---------------------------------------------------------------------------
// listUsersAction
// ---------------------------------------------------------------------------

export async function listUsersAction(filters?: {
  query?: string;
  role?: string;
  certificatStatut?: string;
  statut?: string;
}) {
  const auth = await requireAdminSession();
  if ("error" in auth) return { success: false, error: auth.error };

  const { query, role, certificatStatut, statut } = filters ?? {};

  try {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
        ...(role && role !== "ALL" ? { role: role as "SUPER_ADMIN" | "ADMIN" | "VOLUNTEER" | "USER" } : {}),
        ...(certificatStatut && certificatStatut !== "ALL"
          ? { certificatStatut: certificatStatut as "NON_DEMANDE" | "EN_ATTENTE" | "APPROUVE" | "REJETE" }
          : {}),
        ...(statut && statut !== "ALL" ? { statut: statut as "ACTIF" | "INACTIF" } : {}),
        ...(query
          ? {
              OR: [
                { nom: { contains: query, mode: "insensitive" } },
                { prenom: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
                { matricule: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        statut: true,
        photo: true,
        sexe: true,
        age: true,
        contact: true,
        categorie: true,
        etablissement: true,
        facebook: true,
        date_entree: true,
        createdAt: true,
        matricule: true,
        societe: true,
        telephone: true,
        materielPC: true,
        accepteRegles: true,
        spinneret: true,
        certificatStatut: true,
        certificatUrl: true,
        certificatValidatedAt: true,
      },
    });

    return { success: true, data: users };
  } catch {
    return { success: false, error: "Impossible de récupérer les utilisateurs." };
  }
}

// ---------------------------------------------------------------------------
// getUserDetailsAction
// ---------------------------------------------------------------------------

export async function getUserDetailsAction(userId: number) {
  const auth = await requireAdminSession();
  if ("error" in auth) return { success: false, error: auth.error };

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        statut: true,
        photo: true,
        sexe: true,
        age: true,
        contact: true,
        categorie: true,
        etablissement: true,
        facebook: true,
        date_entree: true,
        createdAt: true,
        matricule: true,
        societe: true,
        telephone: true,
        dateNaissance: true,
        siteWeb: true,
        cvUrl: true,
        socialProfile: true,
        joursDisponibles: true,
        disponibilites: true,
        contactUrgence: true,
        spinneret: true,
        accepteRegles: true,
        reglesAccepteesAt: true,
        materielPC: true,
        certificatUrl: true,
        certificatStatut: true,
        certificatValidatedAt: true,
        certificatValidatedById: true,
        createdById: true,
      },
    });

    if (!user) return { success: false, error: "Utilisateur non trouvé." };
    return { success: true, data: user };
  } catch {
    return { success: false, error: "Erreur lors de la récupération." };
  }
}

// ---------------------------------------------------------------------------
// updateUserAction
// ---------------------------------------------------------------------------

export async function updateUserAction(userId: number, data: UpdateUserInput) {
  const auth = await requireAdminSession();
  if ("error" in auth) return { success: false, error: auth.error };

  const parsed = updateUserSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const {
    nom, prenom, email, sexe, matricule, telephone, materielPC,
    accepteRegles, spinneret, etablissement, societe, age,
    dateNaissance, socialProfile, cvUrl, certificatUrl,
    siteWeb, joursDisponibles, disponibilites, contactUrgence,
    facebook, categorie, statut,
  } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { accepteRegles: true, reglesAccepteesAt: true },
    });

    const reglesAccepteesAt =
      accepteRegles && !existing?.accepteRegles
        ? new Date()
        : (existing?.reglesAccepteesAt ?? null);

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        nom,
        prenom,
        email: email.toLowerCase(),
        sexe: sexe ?? "Non précisé",
        matricule,
        telephone,
        materielPC,
        accepteRegles,
        reglesAccepteesAt,
        spinneret: spinneret ?? null,
        etablissement: etablissement ?? "Non renseigné",
        societe: societe ?? null,
        age: age ?? 18,
        dateNaissance: dateNaissance ? new Date(dateNaissance) : null,
        socialProfile: socialProfile ?? null,
        cvUrl: cvUrl ?? null,
        certificatUrl: certificatUrl ?? undefined,
        siteWeb: siteWeb ?? null,
        joursDisponibles: joursDisponibles ?? [],
        disponibilites: disponibilites ?? undefined,
        contactUrgence: contactUrgence ?? null,
        facebook: facebook ?? null,
        categorie: categorie ?? "UNIVERSITAIRE",
        ...(statut ? { statut } : {}),
      },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    return { success: true, data: { id: updated.id } };
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return { success: false, error: "Ce matricule ou email est déjà utilisé." };
    }
    return { success: false, error: "Erreur lors de la mise à jour." };
  }
}

// ---------------------------------------------------------------------------
// approveCertificateAction
// ---------------------------------------------------------------------------

export async function approveCertificateAction(data: { userId: number }) {
  const auth = await requireAdminSession();
  if ("error" in auth) return { success: false, error: auth.error };

  const parsed = approveCertificateSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Données invalides." };

  const adminId = parseInt(auth.session.user.id, 10);

  try {
    await prisma.user.update({
      where: { id: parsed.data.userId },
      data: {
        role: "VOLUNTEER",
        certificatStatut: "APPROUVE",
        certificatValidatedAt: new Date(),
        certificatValidatedById: adminId,
      },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${parsed.data.userId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Erreur lors de l'approbation du certificat." };
  }
}

// ---------------------------------------------------------------------------
// rejectCertificateAction
// ---------------------------------------------------------------------------

export async function rejectCertificateAction(data: { userId: number; motif: string }) {
  const auth = await requireAdminSession();
  if ("error" in auth) return { success: false, error: auth.error };

  const parsed = rejectCertificateSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides." };

  try {
    await prisma.user.update({
      where: { id: parsed.data.userId },
      data: {
        certificatStatut: "REJETE",
        // motif non stocké en DB pour l'instant, mais l'action le reçoit
      },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${parsed.data.userId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Erreur lors du rejet du certificat." };
  }
}

// ---------------------------------------------------------------------------
// deleteUserAction (soft delete)
// ---------------------------------------------------------------------------

export async function deleteUserAction(userId: number) {
  const auth = await requireAdminSession();
  if ("error" in auth) return { success: false, error: auth.error };

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { statut: "INACTIF", deletedAt: new Date() },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch {
    return { success: false, error: "Erreur lors de la désactivation de l'utilisateur." };
  }
}

// ---------------------------------------------------------------------------
// updateUserRoleAction (conservé pour compatibilité)
// ---------------------------------------------------------------------------

export async function updateUserRoleAction(data: { userId: number; role: string }) {
  const auth = await requireAdminSession();
  if ("error" in auth) return { success: false, error: auth.error };

  try {
    const updated = await prisma.user.update({
      where: { id: data.userId },
      data: { role: data.role as "SUPER_ADMIN" | "ADMIN" | "VOLUNTEER" | "USER" },
    });

    revalidatePath("/admin/users");
    return { success: true, data: updated };
  } catch {
    return { success: false, error: "Erreur lors de la mise à jour du rôle." };
  }
}

// ---------------------------------------------------------------------------
// getProfileAction (conservé pour profil personnel)
// ---------------------------------------------------------------------------

export async function getProfileAction(userId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };

  const currentUserId = parseInt(session.user.id, 10);
  const isAdmin = isAdminOrAbove(session.user.role as "SUPER_ADMIN" | "ADMIN" | "VOLUNTEER" | "USER");

  if (!isAdmin && currentUserId !== userId) {
    return { success: false, error: "Accès non autorisé." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, nom: true, prenom: true, email: true,
        role: true, statut: true, photo: true,
        sexe: true, age: true, contact: true,
        categorie: true, etablissement: true, facebook: true,
        date_entree: true,
      },
    });

    if (!user) return { success: false, error: "Utilisateur non trouvé." };
    return { success: true, data: user };
  } catch {
    return { success: false, error: "Erreur lors de la récupération du profil." };
  }
}

// ---------------------------------------------------------------------------
// updateProfileAction (conservé pour profil personnel)
// ---------------------------------------------------------------------------

export async function updateProfileAction(
  userId: number,
  data: UpdateProfileInput
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };

  const currentUserId = parseInt(session.user.id, 10);
  const isAdmin = isAdminOrAbove(
    session.user.role as "SUPER_ADMIN" | "ADMIN" | "VOLUNTEER" | "USER"
  );

  if (!isAdmin && currentUserId !== userId) {
    return { success: false, error: "Accès non autorisé." };
  }

  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides.",
    };
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        nom: parsed.data.nom,
        prenom: parsed.data.prenom,
        email: parsed.data.email.toLowerCase(),
        photo: parsed.data.photo,
        sexe: parsed.data.sexe,
        age: parsed.data.age,
        contact: parsed.data.contact,
        categorie: parsed.data.categorie,
        etablissement: parsed.data.etablissement,
        facebook: parsed.data.facebook,
      },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin/profil");
    return { success: true, data: { id: updated.id } };
  } catch {
    return { success: false, error: "Erreur lors de la mise à jour du profil." };
  }
}

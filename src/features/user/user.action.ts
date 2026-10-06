"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

import {
  approveCertificateSchema,
  rejectCertificateSchema,
  type UpdateProfileInput,
  updateProfileSchema,
  updateRoleSchema,
  type UpdateUserInput,
  updateUserSchema,
  userListFiltersSchema,
  userSchema,
} from "./user.schema";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Non authentifié." } as const;
  const actorRole = session.user.role;
  if (actorRole !== "ADMIN" && actorRole !== "SUPER_ADMIN") {
    return { error: "Accès réservé aux administrateurs." } as const;
  }
  return { session } as const;
}

// ---------------------------------------------------------------------------
// createUserAction
// ---------------------------------------------------------------------------

export async function createUserAction(data: unknown) {
  const auth = await requireAdminSession();
  if ("error" in auth) return { success: false, error: auth.error };

  const parsed = userSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Données invalides." };
  const creatorId = Number.parseInt(auth.session.user.id, 10);
  if (!Number.isSafeInteger(creatorId)) {
    return { success: false, error: "Session administrateur invalide." };
  }

  try {
    const user = await prisma.user.create({
      data: {
        ...parsed.data,
        role: "USER",
        password: null,
        createdById: creatorId,
        statut: "ACTIF",
        date_entree: new Date(),
        sexe: parsed.data.sexe ?? "Non précisé",
        age: parsed.data.age ?? 18,
        categorie: parsed.data.categorie ?? "UNIVERSITAIRE",
        etablissement:
          parsed.data.categorie === "SALARIE"
            ? "Non renseigné"
            : (parsed.data.etablissement ?? "Non renseigné"),
        reglesAccepteesAt: parsed.data.accepteRegles ? new Date() : null,
        contact: parsed.data.telephone,
      },
    });
    revalidatePath("/admin/users");
    return { success: true, data: user };
  } catch (err: unknown) {
    if (isUniqueConstraintError(err)) {
      return {
        success: false,
        error: "Ce matricule ou email est déjà utilisé.",
      };
    }
    return {
      success: false,
      error: "Erreur lors de la création de l'utilisateur.",
    };
  }
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function listUsersAction(filters?: {
  query?: string;
  role?: string;
  certificatStatut?: string;
  statut?: string;
}) {
  const auth = await requireAdminSession();
  if ("error" in auth) return { success: false, error: auth.error };

  const parsedFilters = userListFiltersSchema.safeParse(filters ?? {});
  if (!parsedFilters.success) {
    return { success: false, error: "Filtres de recherche invalides." };
  }
  const { query, role, certificatStatut, statut } = parsedFilters.data;

  try {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
        role: "USER",
        ...(role && role !== "ALL" && role !== "USER" ? { id: -1 } : {}),
        ...(certificatStatut && certificatStatut !== "ALL"
          ? {
              certificatStatut,
            }
          : {}),
        ...(statut && statut !== "ALL" ? { statut } : {}),
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
        dateNaissance: true,
        siteWeb: true,
        cvUrl: true,
        socialProfile: true,
        joursDisponibles: true,
        disponibilites: true,
        contactUrgence: true,
        reglesAccepteesAt: true,
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
    return {
      success: false,
      error: "Impossible de récupérer les utilisateurs.",
    };
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
      where: { id: userId, deletedAt: null, role: "USER" },
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
        certificatMotifRejet: true,
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

function buildUserUpdateData(
  data: UpdateUserInput,
  existing: {
    accepteRegles: boolean;
    reglesAccepteesAt: Date | null;
    certificatUrl: string | null;
  }
) {
  const certificateChanged =
    Boolean(data.certificatUrl) &&
    data.certificatUrl !== existing.certificatUrl;
  return {
    nom: data.nom,
    prenom: data.prenom,
    email: data.email.toLowerCase(),
    sexe: data.sexe ?? "Non précisé",
    matricule: data.matricule,
    telephone: data.telephone,
    materielPC: data.materielPC,
    accepteRegles: data.accepteRegles,
    reglesAccepteesAt: acceptedRulesTimestamp(data, existing),
    spinneret: data.spinneret ?? null,
    etablissement:
      data.categorie === "SALARIE"
        ? "Non renseigné"
        : (data.etablissement ?? "Non renseigné"),
    societe: data.categorie === "SALARIE" ? (data.societe ?? null) : null,
    age: data.age ?? 18,
    dateNaissance: data.dateNaissance ? new Date(data.dateNaissance) : null,
    socialProfile: data.socialProfile ?? null,
    cvUrl: data.cvUrl ?? null,
    certificatUrl: data.certificatUrl || null,
    ...(certificateChanged
      ? {
          certificatStatut: "EN_ATTENTE" as const,
          certificatMotifRejet: null,
          certificatValidatedAt: null,
          certificatValidatedById: null,
        }
      : {}),
    siteWeb: data.siteWeb ?? null,
    joursDisponibles: data.joursDisponibles ?? [],
    disponibilites: data.disponibilites ?? undefined,
    contactUrgence: data.contactUrgence ?? null,
    facebook: data.facebook ?? null,
    categorie: data.categorie ?? "UNIVERSITAIRE",
    ...(data.statut ? { statut: data.statut } : {}),
  };
}

function acceptedRulesTimestamp(
  data: UpdateUserInput,
  existing: { accepteRegles: boolean; reglesAccepteesAt: Date | null }
) {
  if (data.accepteRegles && !existing.accepteRegles) return new Date();
  return existing.reglesAccepteesAt;
}

export async function updateUserAction(userId: number, data: UpdateUserInput) {
  const auth = await requireAdminSession();
  if ("error" in auth) return { success: false, error: auth.error };

  const parsed = updateUserSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides.",
    };
  }

  try {
    const existing = await prisma.user.findFirst({
      where: { id: userId, role: "USER", deletedAt: null },
      select: {
        accepteRegles: true,
        reglesAccepteesAt: true,
        certificatUrl: true,
      },
    });

    if (!existing)
      return { success: false, error: "Utilisateur USER introuvable." };

    const updated = await prisma.user.update({
      where: { id: userId, role: "USER", deletedAt: null },
      data: buildUserUpdateData(parsed.data, existing),
    });

    if (updated.role !== "USER") {
      return {
        success: false,
        error: "Seuls les comptes USER peuvent être modifiés ici.",
      };
    }

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    return { success: true, data: { id: updated.id } };
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "P2002"
    ) {
      return {
        success: false,
        error: "Ce matricule ou email est déjà utilisé.",
      };
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

  const adminId = Number.parseInt(auth.session.user.id, 10);
  if (!Number.isSafeInteger(adminId)) {
    return { success: false, error: "Session administrateur invalide." };
  }

  try {
    const result = await prisma.user.updateMany({
      where: {
        id: parsed.data.userId,
        role: "USER",
        certificatStatut: "EN_ATTENTE",
        certificatUrl: { not: null },
        deletedAt: null,
      },
      data: {
        role: "VOLUNTEER",
        certificatStatut: "APPROUVE",
        certificatValidatedAt: new Date(),
        certificatValidatedById: adminId,
      },
    });

    if (result.count !== 1) {
      return {
        success: false,
        error: "Un certificat PDF en attente est requis.",
      };
    }

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${parsed.data.userId}`);
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Erreur lors de l'approbation du certificat.",
    };
  }
}

// ---------------------------------------------------------------------------
// rejectCertificateAction
// ---------------------------------------------------------------------------

export async function rejectCertificateAction(data: {
  userId: number;
  motif: string;
}) {
  const auth = await requireAdminSession();
  if ("error" in auth) return { success: false, error: auth.error };

  const parsed = rejectCertificateSchema.safeParse(data);
  if (!parsed.success)
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides.",
    };

  try {
    const result = await prisma.user.updateMany({
      where: {
        id: parsed.data.userId,
        role: "USER",
        certificatStatut: "EN_ATTENTE",
        deletedAt: null,
      },
      data: {
        certificatStatut: "REJETE",
        certificatMotifRejet: parsed.data.motif.trim(),
      },
    });

    if (result.count !== 1) {
      return {
        success: false,
        error: "Aucun certificat en attente à rejeter.",
      };
    }

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
    const updated = await prisma.user.updateMany({
      where: { id: userId, role: "USER", deletedAt: null },
      data: { statut: "INACTIF", deletedAt: new Date() },
    });

    if (updated.count !== 1) {
      return { success: false, error: "Utilisateur USER introuvable." };
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Erreur lors de la désactivation de l'utilisateur.",
    };
  }
}

// ---------------------------------------------------------------------------
// updateUserRoleAction (conservé pour compatibilité)
// ---------------------------------------------------------------------------

export async function updateUserRoleAction(data: unknown) {
  const auth = await requireAdminSession();
  if ("error" in auth) return { success: false, error: auth.error };
  if (!updateRoleSchema.safeParse(data).success) {
    return { success: false, error: "Identifiant utilisateur invalide." };
  }
  return {
    success: false,
    error: "Le rôle se gère dans Volunteer Management.",
  };
}

// ---------------------------------------------------------------------------
// getProfileAction (conservé pour profil personnel)
// ---------------------------------------------------------------------------

export async function getProfileAction(userId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Non authentifié." };

  const currentUserId = Number.parseInt(session.user.id, 10);
  const isAdmin =
    session.user.role === "SUPER_ADMIN" || session.user.role === "ADMIN";

  if (!isAdmin && currentUserId !== userId) {
    return { success: false, error: "Accès non autorisé." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      },
    });

    if (!user) return { success: false, error: "Utilisateur non trouvé." };
    return { success: true, data: user };
  } catch {
    return {
      success: false,
      error: "Erreur lors de la récupération du profil.",
    };
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

  const currentUserId = Number.parseInt(session.user.id, 10);
  const isAdmin =
    session.user.role === "SUPER_ADMIN" || session.user.role === "ADMIN";

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
    return {
      success: false,
      error: "Erreur lors de la mise à jour du profil.",
    };
  }
}

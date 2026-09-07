"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import {
  type CreateUserInput,
  type UpdateProfileInput,
  updateProfileSchema,
  type UpdateRoleInput,
  updateRoleSchema,
  userSchema,
} from "./user.schema";

export async function createUserAction(data: CreateUserInput) {
  const parsed = userSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Données invalides." };
  }

  try {
    const user = await prisma.user.create({
      data: {
        ...parsed.data,
        statut: "ACTIF",
        date_entree: new Date(),
        sexe: parsed.data.sexe ?? "Non précisé",
        age: parsed.data.age ?? 18,
        categorie: parsed.data.categorie ?? "UNIVERSITAIRE",
        etablissement: parsed.data.etablissement ?? "Non renseigné",
      },
    });

    revalidatePath("/admin/users");
    return { success: true, data: user };
  } catch {
    return {
      success: false,
      error: "Erreur lors de la création de l'utilisateur.",
    };
  }
}

export async function listUsersAction(query?: string, role?: string) {
  try {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
        ...(role && (role === "ADMIN" || role === "BENEVOLE") ? { role } : {}),
        ...(query
          ? {
              OR: [
                { nom: { contains: query, mode: "insensitive" } },
                { prenom: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
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

export async function updateUserRoleAction(data: UpdateRoleInput) {
  const parsed = updateRoleSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Données invalides." };
  }

  try {
    const updated = await prisma.user.update({
      where: { id: parsed.data.userId },
      data: { role: parsed.data.role },
    });

    revalidatePath("/admin/users");
    return { success: true, data: updated };
  } catch {
    return { success: false, error: "Erreur lors de la mise à jour du rôle." };
  }
}

export async function deleteUserAction(userId: number) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        statut: "INACTIF",
        deletedAt: new Date(),
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Erreur lors de la désactivation de l'utilisateur.",
    };
  }
}

export async function getProfileAction(userId: number) {
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

    if (!user) {
      return { success: false, error: "Utilisateur non trouvé." };
    }

    return { success: true, data: user };
  } catch {
    return {
      success: false,
      error: "Erreur lors de la récupération du profil.",
    };
  }
}

export async function updateProfileAction(
  userId: number,
  data: UpdateProfileInput
) {
  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Données de profil invalides." };
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: parsed.data,
    });

    revalidatePath(`/admin/benevoles/${userId}`);
    return { success: true, data: updated };
  } catch {
    return {
      success: false,
      error: "Erreur lors de la mise à jour du profil.",
    };
  }
}

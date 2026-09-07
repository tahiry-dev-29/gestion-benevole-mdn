"use server";

import { revalidatePath } from "next/cache";
import type { Category } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import {
  type UpdateProfileInput,
  updateProfileSchema,
  type UpdateRoleInput,
  updateRoleSchema,
} from "./user.schema";

export interface CreateUserInput {
  nom: string;
  prenom: string;
  email: string;
  role: "ADMIN" | "BENEVOLE";
  sexe?: string;
  age?: number;
  contact?: string;
  categorie?: Category;
  etablissement?: string;
  facebook?: string;
}

export async function createUserAction(data: CreateUserInput) {
  try {
    const user = await prisma.user.create({
      data: {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        role: data.role,
        statut: "ACTIF",
        date_entree: new Date(),
        sexe: data.sexe ?? "Non précisé",
        age: data.age ?? 18,
        contact: data.contact,
        categorie: data.categorie ?? ("UNIVERSITAIRE" as Category),
        etablissement: data.etablissement ?? "Non renseigné",
        facebook: data.facebook,
      },
    });

    revalidatePath("/admin/users");
    return { success: true, data: user };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Erreur lors de la création de l'utilisateur.",
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
    return { success: false, error: "Impossible de récupérer les utilisateurs." };
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
    return { success: false, error: "Erreur lors de la désactivation de l'utilisateur." };
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
    return { success: false, error: "Erreur lors de la récupération du profil." };
  }
}

export async function updateProfileAction(userId: number, data: UpdateProfileInput) {
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
    return { success: false, error: "Erreur lors de la mise à jour du profil." };
  }
}
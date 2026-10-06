"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function hasAdminSession() {
  const session = await auth();
  return (
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN"
  );
}

export type UserPresenceItem = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: "USER" | "VOLUNTEER";
  statut: "ACTIF" | "INACTIF";
  matricule: string | null;
  photo: string | null;
};

/** Liste les USERs et VOLUNTEERs actifs pour le pointage de présence. */
export async function listUsersForPresenceAction(
  query?: string
): Promise<
  | { success: true; data: UserPresenceItem[] }
  | { success: false; error: string }
> {
  if (!(await hasAdminSession()))
    return { success: false, error: "Accès refusé." };

  try {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
        statut: "ACTIF",
        role: { in: ["USER", "VOLUNTEER"] },
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
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        statut: true,
        matricule: true,
        photo: true,
      },
      orderBy: [{ nom: "asc" }, { prenom: "asc" }],
    });

    return {
      success: true,
      data: users as UserPresenceItem[],
    };
  } catch {
    return {
      success: false,
      error: "Impossible de charger les utilisateurs.",
    };
  }
}

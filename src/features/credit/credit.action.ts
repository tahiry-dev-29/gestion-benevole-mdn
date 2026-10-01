"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

import {
  type CreateCreditInput,
  createCreditSchema,
  type DeleteCreditInput,
  deleteCreditSchema,
  type ListCreditsInput,
  listCreditsSchema,
} from "./credit.schema";

function isAdminRole(role: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

/** Créer un crédit — admin only */
export async function createCreditAction(data: CreateCreditInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Non authentifié." };
  }
  if (!isAdminRole(session.user.role ?? "")) {
    return { success: false, error: "Accès interdit (403)." };
  }

  const parsed = createCreditSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Données invalides.",
    };
  }

  const montant = Math.round(parsed.data.montant * 100) / 100;

  try {
    const credit = await prisma.credit.create({
      data: {
        user_id: parsed.data.userId,
        montant,
        date: parsed.data.date,
        motif: parsed.data.motif,
      },
      include: {
        user: { select: { id: true, nom: true, prenom: true } },
      },
    });

    revalidatePath("/admin/credits");
    return { success: true, data: credit };
  } catch {
    return { success: false, error: "Erreur lors de la création du crédit." };
  }
}

/** Lister les crédits avec pagination et filtres */
export async function listCreditsAction(params?: ListCreditsInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Non authentifié." };
  }

  const parsed = listCreditsSchema.safeParse(params ?? {});
  if (!parsed.success) {
    return { success: false, error: "Paramètres invalides." };
  }

  const { page, pageSize, userId, mois, annee } = parsed.data;

  const where: Record<string, unknown> = {};

  if (userId) {
    where.user_id = userId;
  }

  if (mois || annee) {
    const dateFilter: Record<string, Date> = {};
    if (annee && mois) {
      dateFilter.gte = new Date(annee, mois - 1, 1);
      dateFilter.lt = new Date(annee, mois, 1);
    } else if (annee) {
      dateFilter.gte = new Date(annee, 0, 1);
      dateFilter.lt = new Date(annee + 1, 0, 1);
    }
    where.date = dateFilter;
  }

  try {
    const [credits, total] = await Promise.all([
      prisma.credit.findMany({
        where,
        include: {
          user: { select: { id: true, nom: true, prenom: true } },
        },
        orderBy: { date: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.credit.count({ where }),
    ]);

    const data = credits.map((c) => ({
      id: c.id,
      userId: c.user_id,
      benevole: `${c.user.prenom} ${c.user.nom}`,
      montant: Math.round(c.montant * 100) / 100,
      date: c.date.toISOString().split("T")[0],
      motif: c.motif,
    }));

    return { success: true, data, total, page, pageSize };
  } catch {
    return {
      success: false,
      error: "Erreur lors de la récupération des crédits.",
    };
  }
}

/** Supprimer un crédit — admin only */
export async function deleteCreditAction(data: DeleteCreditInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Non authentifié." };
  }
  if (!isAdminRole(session.user.role ?? "")) {
    return { success: false, error: "Accès interdit (403)." };
  }

  const parsed = deleteCreditSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Données invalides." };
  }

  try {
    await prisma.credit.delete({ where: { id: parsed.data.creditId } });
    revalidatePath("/admin/credits");
    return { success: true };
  } catch {
    return { success: false, error: "Erreur lors de la suppression du crédit." };
  }
}

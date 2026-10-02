"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

import { creditPeriodFilterSchema } from "./credit.schema";
import { calculateCreditTotals, creditPeriod } from "./credit.utils";

export interface CumulEntry {
  userId: number;
  benevole: string;
  total: number;
}

/** Calculer le cumul des crédits par bénévole et total mensuel */
export async function getCumulCreditsAction(params?: {
  mois?: number;
  annee?: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Non authentifié." };
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Accès interdit (403)." };
  }

  const parsed = creditPeriodFilterSchema.safeParse(params ?? {});
  if (!parsed.success) {
    return { success: false, error: "Paramètres de période invalides." };
  }

  const where: Record<string, unknown> = {};

  if (parsed.data.mois && parsed.data.annee) {
    const range = creditPeriod(parsed.data.annee, parsed.data.mois);
    where.date = { gte: range.from, lt: range.to };
  } else if (parsed.data.annee) {
    const range = creditPeriod(parsed.data.annee);
    where.date = { gte: range.from, lt: range.to };
  }

  try {
    const credits = await prisma.credit.findMany({
      where,
      include: {
        user: { select: { id: true, nom: true, prenom: true } },
      },
    });

    return { success: true, data: calculateCreditTotals(credits) };
  } catch {
    return { success: false, error: "Erreur lors du calcul du cumul." };
  }
}

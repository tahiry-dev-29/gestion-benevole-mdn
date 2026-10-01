"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

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

  const where: Record<string, unknown> = {};

  if (params?.mois && params?.annee) {
    where.date = {
      gte: new Date(params.annee, params.mois - 1, 1),
      lt: new Date(params.annee, params.mois, 1),
    };
  } else if (params?.annee) {
    where.date = {
      gte: new Date(params.annee, 0, 1),
      lt: new Date(params.annee + 1, 0, 1),
    };
  }

  try {
    const credits = await prisma.credit.findMany({
      where,
      include: {
        user: { select: { id: true, nom: true, prenom: true } },
      },
    });

    const byUser = new Map<number, CumulEntry>();

    for (const c of credits) {
      const key = c.user_id;
      const existing = byUser.get(key);
      if (existing) {
        existing.total = Math.round((existing.total + c.montant) * 100) / 100;
      } else {
        byUser.set(key, {
          userId: c.user_id,
          benevole: `${c.user.prenom} ${c.user.nom}`,
          total: Math.round(c.montant * 100) / 100,
        });
      }
    }

    const parBenevole = Array.from(byUser.values()).sort(
      (a, b) => b.total - a.total
    );
    const totalGlobal =
      Math.round(parBenevole.reduce((s, b) => s + b.total, 0) * 100) / 100;

    return { success: true, data: { parBenevole, totalGlobal } };
  } catch {
    return { success: false, error: "Erreur lors du calcul du cumul." };
  }
}

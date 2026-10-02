"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

import {
  type ListObservationsInput,
  listObservationsSchema,
} from "./observation.schema";

export interface ObservationItem {
  id: number;
  userId: number;
  auteurId: number | null;
  benevole: string;
  auteur: string | null;
  mois: number;
  annee: number;
  contenu: string;
  createdAt: string;
  updatedAt: string;
}

/** Lister les observations avec filtres */
export async function listObservationsAction(params?: ListObservationsInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Non authentifié." };
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Accès interdit (403)." };
  }

  const parsed = listObservationsSchema.safeParse(params ?? {});
  if (!parsed.success) {
    return { success: false, error: "Paramètres invalides." };
  }

  const { userId, mois, annee, page, pageSize } = parsed.data;

  const where: Record<string, unknown> = {};
  if (userId) where.user_id = userId;
  if (mois) where.mois = mois;
  if (annee) where.annee = annee;

  try {
    const [observations, total] = await Promise.all([
      prisma.observation.findMany({
        where,
        include: {
          user: { select: { id: true, nom: true, prenom: true } },
          auteur: { select: { id: true, nom: true, prenom: true } },
        },
        orderBy: [{ annee: "desc" }, { mois: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.observation.count({ where }),
    ]);

    const data: ObservationItem[] = observations.map((o) => ({
      id: o.id,
      userId: o.user_id,
      auteurId: o.auteur_id,
      benevole: `${o.user.prenom} ${o.user.nom}`,
      auteur: o.auteur ? `${o.auteur.prenom} ${o.auteur.nom}` : null,
      mois: o.mois,
      annee: o.annee,
      contenu: o.contenu,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    }));

    return { success: true, data, total, page, pageSize };
  } catch {
    return {
      success: false,
      error: "Erreur lors de la récupération des observations.",
    };
  }
}

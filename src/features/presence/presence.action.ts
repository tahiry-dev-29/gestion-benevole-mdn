"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

import { computeHeures } from "./presence.utils";

/**
 * Pointer l'arrivée du bénévole pour aujourd'hui.
 * Crée un enregistrement Presence avec heure_arrivee.
 * Refuse si un pointage existe déjà pour ce user + cette date.
 */
export async function pointerArriveeAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Non authentifié." };
  }

  const userId = parseInt(session.user.id, 10);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const heureArrivee = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  try {
    // Vérifier s'il existe déjà un pointage pour aujourd'hui
    const existing = await prisma.presence.findUnique({
      where: { user_id_date: { user_id: userId, date: today } },
    });

    if (existing) {
      return {
        success: false,
        error: "Vous avez déjà pointé votre arrivée aujourd'hui.",
      };
    }

    const presence = await prisma.presence.create({
      data: {
        user_id: userId,
        date: today,
        heure_arrivee: heureArrivee,
        statut: "PRESENT",
      },
    });

    return { success: true, data: presence };
  } catch {
    return {
      success: false,
      error: "Erreur lors du pointage d'arrivée.",
    };
  }
}

/**
 * Pointer le départ du bénévole pour aujourd'hui.
 * Met à jour heure_depart sur la présence existante du jour.
 */
export async function pointerDepartAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Non authentifié." };
  }

  const userId = parseInt(session.user.id, 10);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const heureDepart = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  try {
    const existing = await prisma.presence.findUnique({
      where: { user_id_date: { user_id: userId, date: today } },
    });

    if (!existing) {
      return {
        success: false,
        error: "Aucun pointage d'arrivée trouvé pour aujourd'hui.",
      };
    }

    if (existing.heure_depart) {
      return {
        success: false,
        error: "Vous avez déjà pointé votre départ aujourd'hui.",
      };
    }

    const updated = await prisma.presence.update({
      where: { id: existing.id },
      data: { heure_depart: heureDepart },
    });

    return { success: true, data: updated };
  } catch {
    return {
      success: false,
      error: "Erreur lors du pointage de départ.",
    };
  }
}

/**
 * Récupérer le statut de pointage du jour pour l'utilisateur connecté.
 */
export async function getPresenceDuJourAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Non authentifié." };
  }

  const userId = parseInt(session.user.id, 10);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  try {
    const presence = await prisma.presence.findUnique({
      where: { user_id_date: { user_id: userId, date: today } },
    });

    return { success: true, data: presence };
  } catch {
    return {
      success: false,
      error: "Erreur lors de la récupération de la présence du jour.",
    };
  }
}

/**
 * Récupérer l'historique des présences avec pagination et filtres.
 * Admin : voit toutes les présences.
 * Bénévole : voit uniquement ses propres présences.
 */
export async function getHistoriquePresencesAction(params?: {
  page?: number;
  pageSize?: number;
  dateDebut?: string;
  dateFin?: string;
  userId?: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Non authentifié." };
  }

  const currentUserId = parseInt(session.user.id, 10);
  const isAdmin = session.user.role === "ADMIN";

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;

  // Un bénévole ne voit que ses propres présences
  const filterUserId = isAdmin ? params?.userId : currentUserId;

  const where: Record<string, unknown> = {};

  if (filterUserId) {
    where.user_id = filterUserId;
  }

  if (params?.dateDebut || params?.dateFin) {
    const dateFilter: Record<string, Date> = {};
    if (params?.dateDebut) {
      dateFilter.gte = new Date(params.dateDebut);
    }
    if (params?.dateFin) {
      dateFilter.lte = new Date(params.dateFin);
    }
    where.date = dateFilter;
  }

  try {
    const [presences, total] = await Promise.all([
      prisma.presence.findMany({
        where,
        include: {
          user: {
            select: { id: true, nom: true, prenom: true, email: true },
          },
        },
        orderBy: [{ date: "desc" }, { heure_arrivee: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.presence.count({ where }),
    ]);

    const data = presences.map((p) => ({
      id: p.id,
      userId: p.user_id,
      benevole: `${p.user.prenom} ${p.user.nom}`,
      date: p.date.toISOString().split("T")[0],
      heure_arrivee: p.heure_arrivee,
      heure_depart: p.heure_depart,
      statut: p.statut,
      heuresTravaillees: computeHeures(p.heure_arrivee, p.heure_depart),
    }));

    return { success: true, data, total, page, pageSize };
  } catch {
    return {
      success: false,
      error: "Erreur lors de la récupération de l'historique.",
    };
  }
}


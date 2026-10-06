"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { pointSchema, presenceFilterSchema } from "./presence.schema";
import { computeHeures } from "./presence.utils";

const heuresSchema = z
  .object({
    id: z.coerce.number().int().positive(),
    arrivee: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .nullable(),
    depart: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .nullable(),
  })
  .refine(
    (heures) =>
      !heures.arrivee || !heures.depart || heures.depart >= heures.arrivee,
    {
      message: "L'heure de départ doit être après l'heure d'arrivée.",
      path: ["depart"],
    }
  );

const bulkPointSchema = z
  .object({
    userIds: z.array(z.coerce.number().int().positive()).optional(),
    assignments: z
      .array(
        z.object({
          userId: z.coerce.number().int().positive(),
          seatId: z.coerce.number().int().positive().nullable().optional(),
        })
      )
      .optional(),
    date: z.string().date(),
    statut: z.enum(["PRESENT", "ABSENT", "RETARD"]).default("PRESENT"),
    arrivee: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .nullable()
      .optional(),
    depart: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .nullable()
      .optional(),
  })
  .refine(
    (data) =>
      (data.userIds && data.userIds.length > 0) ||
      (data.assignments && data.assignments.length > 0),
    {
      message: "Au moins un utilisateur doit être sélectionné.",
    }
  );

async function hasAdminSession() {
  const session = await auth();
  return (
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN"
  );
}

function dayFromString(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export async function pointAction(input: unknown) {
  if (!(await hasAdminSession()))
    return { success: false, error: "Accès refusé." };
  const parsed = pointSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, error: "Données de pointage invalides." };
  const data = parsed.data;
  const date = dayFromString(data.date);
  try {
    const person = await prisma.user.findFirst({
      where: {
        id: data.userId,
        role: "VOLUNTEER",
        statut: "ACTIF",
        deletedAt: null,
      },
      select: { id: true },
    });
    if (!person)
      return {
        success: false,
        error: "Ce bénévole n'existe pas ou n'est pas actif.",
      };
    if (data.seatId) {
      const seat = await prisma.seat.findUnique({ where: { id: data.seatId } });
      if (!seat) return { success: false, error: "Ce siège n'existe pas." };
      const occupant = await prisma.attendance.findFirst({
        where: { seat_id: data.seatId, date, user_id: { not: data.userId } },
      });
      if (occupant)
        return {
          success: false,
          error: "Ce siège est déjà occupé à cette date.",
        };
    }
    const attendance = await prisma.attendance.upsert({
      where: { user_id_date: { user_id: data.userId, date } },
      create: {
        user_id: data.userId,
        date,
        seat_id: data.seatId ?? null,
        statut: data.statut,
        heure_arrivee: data.arrivee ?? null,
        heure_depart: data.depart ?? null,
      },
      update: {
        seat_id: data.seatId ?? null,
        statut: data.statut,
        heure_arrivee: data.arrivee ?? null,
        heure_depart: data.depart ?? null,
      },
    });
    revalidatePath("/admin/presences");
    revalidatePath("/admin/users/presence");
    revalidatePath("/admin/users");
    return { success: true, data: attendance };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        error: "Ce siège est déjà occupé à cette date.",
      };
    }
    return { success: false, error: "Impossible d'enregistrer le pointage." };
  }
}

/** Pointage en masse pour plusieurs utilisateurs le même jour */
/** Pointage en masse ou individuel avec affectation de table/siège */
export async function bulkPointAction(input: unknown) {
  if (!(await hasAdminSession()))
    return { success: false as const, error: "Accès refusé." };

  const parsed = bulkPointSchema.safeParse(input);
  if (!parsed.success)
    return { success: false as const, error: "Données de pointage invalides." };

  const { userIds, assignments, date, statut, arrivee, depart } = parsed.data;
  const dateObj = dayFromString(date);

  // Normalize items to point: Map from userId to seatId
  const itemsToPoint: { userId: number; seatId: number | null }[] = [];
  if (assignments && assignments.length > 0) {
    for (const a of assignments) {
      itemsToPoint.push({ userId: a.userId, seatId: a.seatId ?? null });
    }
  } else if (userIds && userIds.length > 0) {
    for (const uid of userIds) {
      itemsToPoint.push({ userId: uid, seatId: null });
    }
  }

  const requestedUserIds = itemsToPoint.map((i) => i.userId);

  try {
    // Valider que tous les utilisateurs existent (VOLUNTEER ou USER actif)
    const persons = await prisma.user.findMany({
      where: {
        id: { in: requestedUserIds },
        statut: "ACTIF",
        deletedAt: null,
        role: { in: ["VOLUNTEER", "USER"] },
      },
      select: { id: true },
    });

    const validIdSet = new Set(persons.map((p) => p.id));
    const validItems = itemsToPoint.filter((item) =>
      validIdSet.has(item.userId)
    );

    if (validItems.length === 0) {
      return {
        success: false as const,
        error: "Aucun utilisateur actif trouvé parmi la sélection.",
      };
    }

    // Si des sièges sont spécifiés, vérifier qu'il n'y a pas de doublon dans la requête
    const requestedSeats = validItems
      .map((i) => i.seatId)
      .filter((s): s is number => s !== null);
    if (new Set(requestedSeats).size !== requestedSeats.length) {
      return {
        success: false as const,
        error: "Deux utilisateurs ne peuvent pas avoir le même siège assigné.",
      };
    }

    // Upsert pour chaque utilisateur
    await Promise.all(
      validItems.map((item) =>
        prisma.attendance.upsert({
          where: { user_id_date: { user_id: item.userId, date: dateObj } },
          create: {
            user_id: item.userId,
            date: dateObj,
            seat_id: statut === "PRESENT" ? item.seatId : null,
            statut,
            heure_arrivee: statut === "PRESENT" ? (arrivee ?? null) : null,
            heure_depart: statut === "PRESENT" ? (depart ?? null) : null,
          },
          update: {
            seat_id: statut === "PRESENT" ? item.seatId : null,
            statut,
            heure_arrivee: statut === "PRESENT" ? (arrivee ?? null) : null,
            heure_depart: statut === "PRESENT" ? (depart ?? null) : null,
          },
        })
      )
    );

    revalidatePath("/admin/presences");
    revalidatePath("/admin/users");
    revalidatePath("/admin/users/presence");

    return {
      success: true as const,
      data: {
        count: validItems.length,
        skipped: requestedUserIds.length - validItems.length,
      },
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false as const,
        error: "Un des sièges sélectionnés est déjà occupé pour aujourd'hui.",
      };
    }
    return {
      success: false as const,
      error: "Impossible d'enregistrer les pointages.",
    };
  }
}

/** Liste les présences du jour pour une liste d'IDs avec table et siège */
export async function getTodayAttendanceForUsersAction(userIds: number[]) {
  if (!(await hasAdminSession()))
    return { success: false as const, error: "Accès refusé." };

  const today = dayFromString(new Date().toISOString().slice(0, 10));
  try {
    const rows = await prisma.attendance.findMany({
      where: { user_id: { in: userIds }, date: today },
      select: {
        user_id: true,
        statut: true,
        heure_arrivee: true,
        heure_depart: true,
        seat_id: true,
        seat: {
          select: {
            tableNumber: true,
            seatNumber: true,
            label: true,
          },
        },
      },
    });
    return { success: true as const, data: rows };
  } catch {
    return {
      success: false as const,
      error: "Impossible de charger les présences.",
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

export async function listAttendanceAction(input: unknown = {}) {
  if (!(await hasAdminSession()))
    return { success: false as const, error: "Accès refusé." };
  const parsed = presenceFilterSchema.safeParse(input);
  if (!parsed.success)
    return { success: false as const, error: "Filtres invalides." };
  const filters = parsed.data;
  const where: Prisma.AttendanceWhereInput = {
    ...(filters.du || filters.au
      ? {
          date: {
            ...(filters.du ? { gte: dayFromString(filters.du) } : {}),
            ...(filters.au ? { lte: dayFromString(filters.au) } : {}),
          },
        }
      : {}),
    ...(filters.statut ? { statut: filters.statut } : {}),
    ...(filters.table ? { seat: { tableNumber: filters.table } } : {}),
    ...(filters.seatId ? { seat_id: filters.seatId } : {}),
    ...(filters.volunteerId ? { user_id: filters.volunteerId } : {}),
    ...(filters.query
      ? {
          user: {
            OR: [
              { nom: { contains: filters.query, mode: "insensitive" } },
              { prenom: { contains: filters.query, mode: "insensitive" } },
              { email: { contains: filters.query, mode: "insensitive" } },
              { matricule: { contains: filters.query, mode: "insensitive" } },
            ],
          },
        }
      : {}),
  };
  try {
    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        user: { select: { id: true, nom: true, prenom: true } },
        seat: true,
      },
      orderBy: [{ date: "desc" }, { user: { nom: "asc" } }],
    });
    return {
      success: true as const,
      data: attendance.map((item) => ({
        id: item.id,
        userId: item.user_id,
        benevole: `${item.user.prenom} ${item.user.nom}`,
        date: item.date.toISOString().slice(0, 10),
        tableNumber: item.seat?.tableNumber ?? null,
        seatNumber: item.seat?.seatNumber ?? null,
        seatId: item.seat_id,
        heure_arrivee: item.heure_arrivee,
        heure_depart: item.heure_depart,
        statut: item.statut,
        heuresTravaillees: computeHeures(item.heure_arrivee, item.heure_depart),
      })),
    };
  } catch {
    return {
      success: false as const,
      error: "Impossible de charger les présences.",
    };
  }
}

export async function updateHeuresAction(input: unknown) {
  if (!(await hasAdminSession()))
    return { success: false, error: "Accès refusé." };
  const parsed = heuresSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Heures invalides." };
  try {
    const data = await prisma.attendance.update({
      where: { id: parsed.data.id },
      data: {
        heure_arrivee: parsed.data.arrivee,
        heure_depart: parsed.data.depart,
      },
    });
    revalidatePath("/admin/presences");
    revalidatePath("/admin/users/presence");
    return { success: true, data };
  } catch {
    return { success: false, error: "Impossible de modifier les heures." };
  }
}

"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import {
  createTableSchema,
  deleteSeatSchema,
  renameTableSchema,
  seatSchema,
  updateSeatNumberSchema,
} from "./places.schema";

async function isAdmin() {
  const session = await auth();
  return (
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN"
  );
}

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.includes("unique")) {
    return "Ce numéro de table ou de siège existe déjà.";
  }
  return fallback;
}

export async function listSeatsAction() {
  if (!(await isAdmin()))
    return { success: false as const, error: "Accès refusé." };
  try {
    const today = new Date();
    const seats = await prisma.seat.findMany({
      include: { presences: { where: { date: today }, select: { id: true } } },
      orderBy: [{ tableNumber: "asc" }, { seatNumber: "asc" }],
    });
    const tables = new Map<number, typeof seats>();
    for (const seat of seats) {
      const current = tables.get(seat.tableNumber) ?? [];
      current.push(seat);
      tables.set(seat.tableNumber, current);
    }
    return {
      success: true as const,
      data: Array.from(tables, ([tableNumber, rows]) => ({
        tableNumber,
        seats: rows.map(({ id, seatNumber, label, presences }) => ({
          id,
          seatNumber,
          label,
          occupiedToday: presences.length > 0,
        })),
      })),
    };
  } catch {
    return {
      success: false as const,
      error: "Impossible de charger les places.",
    };
  }
}

export async function createTableAction(input: unknown) {
  if (!(await isAdmin())) return { success: false, error: "Accès refusé." };
  const parsed = createTableSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, error: "Nombre de sièges invalide." };
  try {
    const highest = await prisma.seat.aggregate({
      _max: { tableNumber: true },
    });
    const tableNumber =
      parsed.data.tableNumber ?? (highest._max.tableNumber ?? 0) + 1;
    if (await prisma.seat.count({ where: { tableNumber } })) {
      return { success: false, error: "Ce numéro de table existe déjà." };
    }
    await prisma.seat.createMany({
      data: Array.from({ length: parsed.data.seatCount }, (_, index) => ({
        tableNumber,
        seatNumber: index + 1,
      })),
    });
    revalidatePath("/admin/places");
    return { success: true, data: { tableNumber } };
  } catch (error) {
    return {
      success: false,
      error: errorMessage(error, "Impossible de créer la table."),
    };
  }
}

export async function renameTableAction(input: unknown) {
  if (!(await isAdmin())) return { success: false, error: "Accès refusé." };
  const parsed = renameTableSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, error: "Numéro de table invalide." };
  const { oldNumber, newNumber } = parsed.data;
  if (oldNumber === newNumber) return { success: true };
  try {
    const exists = await prisma.seat.count({
      where: { tableNumber: newNumber },
    });
    if (exists)
      return { success: false, error: "Ce numéro de table existe déjà." };
    await prisma.seat.updateMany({
      where: { tableNumber: oldNumber },
      data: { tableNumber: newNumber },
    });
    revalidatePath("/admin/places");
    return { success: true };
  } catch {
    return { success: false, error: "Impossible de renommer la table." };
  }
}

export async function createSeatAction(input: unknown) {
  if (!(await isAdmin())) return { success: false, error: "Accès refusé." };
  const parsed = seatSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, error: "Numéro de siège invalide." };
  try {
    await prisma.seat.create({ data: parsed.data });
    revalidatePath("/admin/places");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: errorMessage(error, "Impossible d'ajouter le siège."),
    };
  }
}

export async function updateSeatNumberAction(input: unknown) {
  if (!(await isAdmin())) return { success: false, error: "Accès refusé." };
  const parsed = updateSeatNumberSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, error: "Numéro de siège invalide." };
  const { seatId, ...data } = parsed.data;
  try {
    await prisma.seat.update({ where: { id: seatId }, data });
    revalidatePath("/admin/places");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: errorMessage(error, "Impossible de modifier le siège."),
    };
  }
}

export async function deleteSeatAction(input: unknown) {
  if (!(await isAdmin())) return { success: false, error: "Accès refusé." };
  const parsed = deleteSeatSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Siège invalide." };
  try {
    if (
      await prisma.attendance.count({ where: { seat_id: parsed.data.seatId } })
    ) {
      return {
        success: false,
        error:
          "Ce siège est associé à un pointage et ne peut pas être supprimé.",
      };
    }
    await prisma.seat.delete({ where: { id: parsed.data.seatId } });
    revalidatePath("/admin/places");
    return { success: true };
  } catch {
    return { success: false, error: "Impossible de supprimer le siège." };
  }
}

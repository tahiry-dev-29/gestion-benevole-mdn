import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { failedImport, readXlsxUpload } from "./excel.import.shared";
import { parsePresencesXlsx } from "./excel.reader";
import type { ExcelRowError } from "./excel.schema";

export async function importPresences(fileValue: FormDataEntryValue | null) {
  const upload = await readXlsxUpload(fileValue);
  if (!upload.buffer) return failedImport(upload.errors);

  const parsed = await parsePresencesXlsx(upload.buffer);
  const errors: ExcelRowError[] = [...parsed.errors];
  let imported = 0;

  for (const { ligne, value: presence } of parsed.data) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: presence.email,
          role: "VOLUNTEER",
          statut: "ACTIF",
          deletedAt: null,
        },
        select: { id: true },
      });
      if (!user) {
        errors.push({
          ligne,
          champ: "email",
          message: "Aucun bénévole actif ne correspond à cet email.",
        });
        continue;
      }

      const seat =
        presence.tableNumber !== undefined && presence.seatNumber !== undefined
          ? await prisma.seat.findUnique({
              where: {
                tableNumber_seatNumber: {
                  tableNumber: presence.tableNumber,
                  seatNumber: presence.seatNumber,
                },
              },
              select: { id: true },
            })
          : null;
      if (
        presence.tableNumber !== undefined &&
        presence.seatNumber !== undefined &&
        !seat
      ) {
        errors.push({
          ligne,
          champ: "tableNumber/seatNumber",
          message: "Cette table et ce siège n'existent pas.",
        });
        continue;
      }

      const date = new Date(`${presence.date}T00:00:00.000Z`);
      await prisma.attendance.upsert({
        where: { user_id_date: { user_id: user.id, date } },
        create: {
          user_id: user.id,
          date,
          statut: presence.statut,
          seat_id: seat?.id ?? null,
          heure_arrivee: presence.heure_arrivee || null,
          heure_depart: presence.heure_depart || null,
        },
        update: {
          statut: presence.statut,
          seat_id: seat?.id ?? null,
          heure_arrivee: presence.heure_arrivee || null,
          heure_depart: presence.heure_depart || null,
        },
      });
      imported += 1;
    } catch {
      errors.push({
        ligne,
        champ: "ligne",
        message: "Échec de l'enregistrement en base de données.",
      });
    }
  }

  revalidatePath("/admin/presences");
  return { success: errors.length === 0, imported, errors };
}

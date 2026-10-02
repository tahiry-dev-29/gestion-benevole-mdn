import { z } from "zod";

import { hasExcelAdminAccess } from "@/features/excel/excel.access";
import {
  exportPresencesTemplateXlsx,
  exportPresencesXlsx,
} from "@/features/excel/excel.writer";
import { prisma } from "@/lib/prisma";

const contentType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export async function GET(request: Request) {
  if (!(await hasExcelAdminAccess()))
    return Response.json({ error: "Accès interdit." }, { status: 403 });
  const url = new URL(request.url);
  const template = url.searchParams.get("template") === "1";
  const start = url.searchParams.get("dateDebut");
  const end = url.searchParams.get("dateFin");
  const dateSchema = z.string().date();
  if (
    (start && !dateSchema.safeParse(start).success) ||
    (end && !dateSchema.safeParse(end).success) ||
    (start && end && start > end)
  ) {
    return Response.json(
      { error: "Période de dates invalide." },
      { status: 400 }
    );
  }
  const date =
    start || end
      ? {
          ...(start ? { gte: new Date(start) } : {}),
          ...(end ? { lte: new Date(end) } : {}),
        }
      : undefined;
  const rows = template
    ? []
    : await prisma.attendance.findMany({
        where: date ? { date } : undefined,
        orderBy: [{ date: "desc" }, { heure_arrivee: "desc" }],
        include: {
          user: { select: { nom: true, prenom: true, email: true } },
          seat: { select: { tableNumber: true, seatNumber: true } },
        },
      });
  const data = rows.map((row) => ({
    date: row.date.toISOString().slice(0, 10),
    email: row.user.email,
    nom: row.user.nom,
    prenom: row.user.prenom,
    statut: row.statut,
    heure_arrivee: row.heure_arrivee ?? "",
    heure_depart: row.heure_depart ?? "",
    tableNumber: row.seat?.tableNumber.toString() ?? "",
    seatNumber: row.seat?.seatNumber.toString() ?? "",
  }));
  const buffer = template
    ? await exportPresencesTemplateXlsx()
    : await exportPresencesXlsx(data);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${template ? "modele-presences" : "presences"}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}

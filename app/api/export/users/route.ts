import { hasExcelAdminAccess } from "@/features/excel/excel.access";
import { exportUsersTemplateXlsx, exportUsersXlsx } from "@/features/excel/excel.writer";
import { prisma } from "@/lib/prisma";

const contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export async function GET(request: Request) {
  if (!(await hasExcelAdminAccess())) return Response.json({ error: "Accès interdit." }, { status: 403 });
  const template = new URL(request.url).searchParams.get("template") === "1";
  const users = template ? [] : await prisma.user.findMany({
    where: { deletedAt: null }, orderBy: { createdAt: "desc" },
    select: { nom: true, prenom: true, email: true, role: true, statut: true, sexe: true, age: true, contact: true, categorie: true, etablissement: true, facebook: true, date_entree: true },
  });
  const rows = users.map((user) => ({ ...user, contact: user.contact ?? "", facebook: user.facebook ?? "", date_entree: user.date_entree.toISOString().slice(0, 10) }));
  const buffer = template ? await exportUsersTemplateXlsx() : await exportUsersXlsx(rows);
  return new Response(new Uint8Array(buffer), { headers: { "Content-Type": contentType, "Content-Disposition": `attachment; filename="${template ? "modele-utilisateurs" : "utilisateurs"}.xlsx"`, "Cache-Control": "no-store" } });
}

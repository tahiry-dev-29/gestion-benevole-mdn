import { hasExcelAdminAccess } from "@/features/excel/excel.access";
import {
  exportUsersTemplateXlsx,
  exportUsersXlsx,
} from "@/features/excel/excel.writer";
import { prisma } from "@/lib/prisma";

const contentType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export async function GET(request: Request) {
  if (!(await hasExcelAdminAccess()))
    return Response.json({ error: "Accès interdit." }, { status: 403 });
  const template = new URL(request.url).searchParams.get("template") === "1";
  const users = template
    ? []
    : await prisma.user.findMany({
        where: { deletedAt: null, role: "USER" },
        orderBy: { createdAt: "desc" },
        select: {
          nom: true,
          prenom: true,
          email: true,
          role: true,
          statut: true,
          sexe: true,
          age: true,
          contact: true,
          categorie: true,
          etablissement: true,
          facebook: true,
          date_entree: true,
          matricule: true,
          societe: true,
          telephone: true,
          dateNaissance: true,
          siteWeb: true,
          cvUrl: true,
          socialProfile: true,
          joursDisponibles: true,
          disponibilites: true,
          contactUrgence: true,
          spinneret: true,
          accepteRegles: true,
          reglesAccepteesAt: true,
          materielPC: true,
          certificatUrl: true,
          certificatStatut: true,
        },
      });
  const rows = users.map((user) => ({
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    statut: user.statut,
    sexe: user.sexe,
    age: user.age,
    categorie: user.categorie,
    etablissement: user.etablissement,
    contact: user.contact ?? "",
    facebook: user.facebook ?? "",
    date_entree: user.date_entree.toISOString().slice(0, 10),
    matricule: user.matricule ?? "",
    societe: user.societe ?? "",
    telephone: user.telephone ?? "",
    dateNaissance: user.dateNaissance?.toISOString().slice(0, 10) ?? "",
    siteWeb: user.siteWeb ?? "",
    cvUrl: user.cvUrl ?? "",
    socialProfile: user.socialProfile ?? "",
    joursDisponibles: user.joursDisponibles.join(";"),
    disponibilites: user.disponibilites
      ? JSON.stringify(user.disponibilites)
      : "",
    contactUrgence: user.contactUrgence ?? "",
    spinneret: user.spinneret ?? "",
    accepteRegles: String(user.accepteRegles),
    reglesAccepteesAt: user.reglesAccepteesAt?.toISOString() ?? "",
    materielPC: String(user.materielPC),
    certificatUrl: user.certificatUrl ?? "",
    certificatStatut: user.certificatStatut,
  }));
  const buffer = template
    ? await exportUsersTemplateXlsx()
    : await exportUsersXlsx(rows);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${template ? "modele-utilisateurs" : "utilisateurs"}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}

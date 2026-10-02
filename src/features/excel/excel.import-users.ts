import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { failedImport, readXlsxUpload } from "./excel.import.shared";
import { parseUsersXlsx } from "./excel.reader";
import type { ExcelRowError } from "./excel.schema";

export async function importUsers(fileValue: FormDataEntryValue | null) {
  const upload = await readXlsxUpload(fileValue);
  if (!upload.buffer) return failedImport(upload.errors);

  const parsed = await parseUsersXlsx(upload.buffer);
  const errors: ExcelRowError[] = [...parsed.errors];
  let imported = 0;

  for (const { ligne, value: user } of parsed.data) {
    try {
      const existing = await prisma.user.findUnique({
        where: { email: user.email },
        select: {
          id: true,
          role: true,
          deletedAt: true,
          reglesAccepteesAt: true,
        },
      });
      if (existing && (existing.role !== "USER" || existing.deletedAt)) {
        errors.push({
          ligne,
          champ: "email",
          message: "Seuls les comptes USER actifs peuvent être importés.",
        });
        continue;
      }

      const data = {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        statut: user.statut,
        sexe: user.sexe,
        age: user.age,
        contact: user.contact || user.telephone || null,
        categorie: user.categorie,
        etablissement: user.etablissement || "Non renseigné",
        facebook: user.facebook || null,
        date_entree: user.date_entree
          ? new Date(`${user.date_entree}T00:00:00.000Z`)
          : new Date(),
        matricule: user.matricule,
        societe: user.societe || null,
        telephone: user.telephone,
        dateNaissance: user.dateNaissance
          ? new Date(`${user.dateNaissance}T00:00:00.000Z`)
          : null,
        siteWeb: user.siteWeb || null,
        cvUrl: user.cvUrl || null,
        socialProfile: user.socialProfile || null,
        joursDisponibles: user.joursDisponibles,
        disponibilites: user.disponibilites ?? Prisma.DbNull,
        contactUrgence: user.contactUrgence || null,
        spinneret: user.spinneret || null,
        accepteRegles: user.accepteRegles,
        reglesAccepteesAt: user.accepteRegles
          ? user.reglesAccepteesAt
            ? new Date(user.reglesAccepteesAt)
            : (existing?.reglesAccepteesAt ?? new Date())
          : null,
        materielPC: user.materielPC,
        certificatUrl: user.certificatUrl || null,
        certificatStatut: user.certificatStatut,
      };

      if (existing) {
        const result = await prisma.user.updateMany({
          where: { id: existing.id, role: "USER", deletedAt: null },
          data,
        });
        if (result.count !== 1) {
          errors.push({
            ligne,
            champ: "email",
            message: "Le compte USER a changé pendant l'import.",
          });
          continue;
        }
      } else {
        await prisma.user.create({
          data: { ...data, role: "USER", password: null },
        });
      }
      imported += 1;
    } catch {
      errors.push({
        ligne,
        champ: "ligne",
        message: "Échec de l'enregistrement en base de données.",
      });
    }
  }

  revalidatePath("/admin/users");
  return { success: errors.length === 0, imported, errors };
}

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { parsePresencesXlsx, parseUsersXlsx, validateXlsxUpload } from "./excel.reader";
import type { ExcelRowError } from "./excel.schema";

function signature(buffer: Buffer) {
  return buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b;
}

function invalidFile(file: FormDataEntryValue | null): { file: File; error: null } | { file: null; error: string } {
  if (!(file instanceof File)) return { file: null, error: "Fichier manquant." };
  const validation = validateXlsxUpload(file);
  if (validation) return { file: null, error: validation };
  return { file, error: null };
}

export async function importUsers(fileValue: FormDataEntryValue | null) {
  const checked = invalidFile(fileValue);
  if (!checked.file) return { success: false, imported: 0, errors: [{ ligne: 0, champ: "fichier", message: checked.error }] };
  const buffer = Buffer.from(await checked.file.arrayBuffer());
  if (!signature(buffer)) return { success: false, imported: 0, errors: [{ ligne: 0, champ: "fichier", message: "Le contenu n'est pas un fichier XLSX valide." }] };
  const parsed = await parseUsersXlsx(buffer);
  const errors: ExcelRowError[] = [...parsed.errors];
  let imported = 0;
  for (const [index, user] of parsed.data.entries()) {
    try {
      await prisma.user.upsert({
        where: { email: user.email },
        create: { ...user, contact: user.contact || null, facebook: user.facebook || null, date_entree: new Date() },
        update: { nom: user.nom, prenom: user.prenom, role: user.role, statut: user.statut, sexe: user.sexe, age: user.age, contact: user.contact || null, categorie: user.categorie, etablissement: user.etablissement, facebook: user.facebook || null },
      });
      imported += 1;
    } catch {
      errors.push({ ligne: index + 2, champ: "ligne", message: "Échec de l'enregistrement en base de données." });
    }
  }
  revalidatePath("/admin/users");
  return { success: errors.length === 0, imported, errors };
}

export async function importPresences(fileValue: FormDataEntryValue | null) {
  const checked = invalidFile(fileValue);
  if (!checked.file) return { success: false, imported: 0, errors: [{ ligne: 0, champ: "fichier", message: checked.error }] };
  const buffer = Buffer.from(await checked.file.arrayBuffer());
  if (!signature(buffer)) return { success: false, imported: 0, errors: [{ ligne: 0, champ: "fichier", message: "Le contenu n'est pas un fichier XLSX valide." }] };
  const parsed = await parsePresencesXlsx(buffer);
  const errors: ExcelRowError[] = [...parsed.errors];
  let imported = 0;
  for (const [index, presence] of parsed.data.entries()) {
    const user = await prisma.user.findUnique({ where: { email: presence.email }, select: { id: true } });
    if (!user) {
      errors.push({ ligne: index + 2, champ: "email", message: "Aucun utilisateur ne correspond à cet email." });
      continue;
    }
    try {
      await prisma.presence.upsert({
        where: { user_id_date: { user_id: user.id, date: new Date(`${presence.date}T00:00:00.000Z`) } },
        create: { user_id: user.id, date: new Date(`${presence.date}T00:00:00.000Z`), statut: presence.statut, heure_arrivee: presence.heure_arrivee || null, heure_depart: presence.heure_depart || null },
        update: { statut: presence.statut, heure_arrivee: presence.heure_arrivee || null, heure_depart: presence.heure_depart || null },
      });
      imported += 1;
    } catch {
      errors.push({ ligne: index + 2, champ: "ligne", message: "Échec de l'enregistrement en base de données." });
    }
  }
  revalidatePath("/admin/presences");
  return { success: errors.length === 0, imported, errors };
}

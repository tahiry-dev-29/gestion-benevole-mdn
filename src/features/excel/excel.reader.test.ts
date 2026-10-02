import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";

import { presenceColumns, userColumns } from "./excel.columns";
import { parseUsersXlsx } from "./excel.reader";

async function makeWorkbook(headers: string[], rows: string[][]) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Données");
  sheet.addRow(headers);
  for (const row of rows) sheet.addRow(row);
  return Buffer.from(await workbook.xlsx.writeBuffer());
}

describe("parseUsersXlsx", () => {
  it("associe les erreurs aux vrais numéros de lignes Excel", async () => {
    const headers = userColumns.map(({ header }) => header);
    const values: Record<string, string> = {
      nom: "Nom",
      prenom: "Prénom",
      email: "user@example.org",
      role: "USER",
      statut: "ACTIF",
      sexe: "Non précisé",
      age: "22",
      contact: "0340000000",
      categorie: "UNIVERSITAIRE",
      etablissement: "Université",
      date_entree: "2026-01-01",
      matricule: "MAT-22",
      telephone: "0340000000",
      accepteRegles: "false",
      materielPC: "false",
    };
    const row = headers.map((header) => values[header] ?? "");
    const buffer = await makeWorkbook(headers, [
      ["N", "P", "invalid-email", ...row.slice(2)],
      row,
    ]);

    const parsed = await parseUsersXlsx(buffer);

    expect(
      parsed.errors.some((error) => error.ligne === 2),
      JSON.stringify(parsed)
    ).toBe(true);
    expect(parsed.data).toEqual([
      {
        ligne: 3,
        value: expect.objectContaining({ email: "user@example.org" }),
      },
    ]);
  });

  it("renvoie une erreur contrôlée pour un fichier non XLSX", async () => {
    const parsed = await parseUsersXlsx(Buffer.from("this is not a workbook"));

    expect(parsed.data).toEqual([]);
    expect(parsed.errors[0]).toMatchObject({
      ligne: 0,
      champ: "fichier",
      message: "Le fichier XLSX ne peut pas être lu.",
    });
  });

  it("garde une définition distincte de colonnes de présence", () => {
    expect(presenceColumns.map(({ header }) => header)).toContain(
      "heure_depart"
    );
  });
});

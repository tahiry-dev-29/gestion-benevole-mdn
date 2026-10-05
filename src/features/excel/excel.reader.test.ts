import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";

import { presenceColumns, userColumns } from "./excel.columns";
import {
  parsePresencesXlsx,
  parseUsersXlsx,
  validateXlsxUpload,
} from "./excel.reader";
import { exportPresencesXlsx, exportUsersXlsx } from "./excel.writer";

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

  it("préserve la date de consentement au round-trip export puis import", async () => {
    const consentDate = "2026-02-03T14:25:00.000Z";
    const row = {
      nom: "Nom",
      prenom: "Prenom",
      email: "person@example.org",
      role: "USER",
      statut: "ACTIF",
      sexe: "Non précisé",
      age: 21,
      contact: "",
      categorie: "UNIVERSITAIRE",
      etablissement: "Établissement",
      facebook: "",
      date_entree: "2026-01-01",
      matricule: "MAT-21",
      societe: "",
      telephone: "0340000000",
      dateNaissance: "",
      siteWeb: "",
      cvUrl: "",
      socialProfile: "",
      joursDisponibles: "",
      disponibilites: "",
      contactUrgence: "",
      spinneret: "",
      accepteRegles: "true",
      reglesAccepteesAt: consentDate,
      materielPC: "false",
      certificatUrl: "",
      certificatStatut: "NON_DEMANDE",
    };

    const buffer = await exportUsersXlsx([row]);
    const parsed = await parseUsersXlsx(buffer);

    expect(parsed.errors).toEqual([]);
    expect(parsed.data[0]?.value.reglesAccepteesAt).toBe(consentDate);
    expect(parsed.data[0]?.value.email).toBe("person@example.org");
  });

  it("rejette un départ antérieur à l’arrivée avec le bon numéro de ligne", async () => {
    const headers = presenceColumns.map(({ header }) => header);
    const buffer = await makeWorkbook(headers, [
      [
        "2026-01-10",
        "volunteer@example.org",
        "Nom",
        "Prenom",
        "PRESENT",
        "10:30",
        "09:30",
        "",
        "",
      ],
    ]);

    const parsed = await parsePresencesXlsx(buffer);

    expect(parsed.errors).toContainEqual(
      expect.objectContaining({ ligne: 2, champ: "heure_depart" })
    );
  });

  it("relit les présences exportées avec les mêmes colonnes métier", async () => {
    const buffer = await exportPresencesXlsx([
      {
        date: "2026-01-10",
        email: "volunteer@example.org",
        nom: "Nom",
        prenom: "Prenom",
        statut: "PRESENT",
        heure_arrivee: "08:30",
        heure_depart: "12:15",
        tableNumber: "",
        seatNumber: "",
      },
    ]);

    const parsed = await parsePresencesXlsx(buffer);

    expect(parsed.errors).toEqual([]);
    expect(parsed.data[0]?.value).toMatchObject({
      email: "volunteer@example.org",
      heure_arrivee: "08:30",
      heure_depart: "12:15",
    });
  });

  it("rejette les fichiers vides ou dont l’extension est renommée", () => {
    expect(validateXlsxUpload(new File(["data"], "tableau.xls"))).toContain(
      ".xlsx"
    );
    expect(validateXlsxUpload(new File([], "tableau.xlsx"))).toContain("5 Mo");
  });
});

import "dotenv/config";

import ExcelJS from "exceljs";
import { afterAll, describe, expect, it, vi } from "vitest";

import type { ExcelPresence, ExcelUser } from "@/features/excel/excel.columns";
import { presenceColumns, userColumns } from "@/features/excel/excel.columns";
import { importPresences, importUsers } from "@/features/excel/excel.import";
import {
  parsePresencesXlsx,
  parseUsersXlsx,
} from "@/features/excel/excel.reader";
import {
  exportPresencesXlsx,
  exportUsersXlsx,
} from "@/features/excel/excel.writer";
import { prisma } from "@/lib/prisma";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const databaseUrl = process.env.DATABASE_URL;
const isDedicatedLocalDatabase = (() => {
  if (!databaseUrl) return false;
  try {
    const url = new URL(databaseUrl);
    return (
      (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
      url.pathname === "/gestion_benevole_sprint06"
    );
  } catch {
    return false;
  }
})();

const email = `test.excel.${Date.now()}@mdn.local`;
// A separate VOLUNTEER account is needed because importPresences requires role=VOLUNTEER.
const volunteerEmail = `test.excel.volunteer.${Date.now()}@mdn.local`;
let importedUserId: number | undefined;
let importedVolunteerId: number | undefined;
let importedSeatId: number | undefined;

async function workbookFile(name: string) {
  const row: ExcelUser = {
    nom: name,
    prenom: "Excel",
    email,
    role: "USER",
    statut: "ACTIF",
    sexe: "Non précisé",
    age: 24,
    contact: "0340000000",
    categorie: "UNIVERSITAIRE",
    etablissement: "Université",
    facebook: "",
    date_entree: "2026-10-01",
    matricule: "MAT-EXCEL-01",
    societe: "",
    telephone: "0340000000",
    dateNaissance: "2002-05-10",
    siteWeb: "",
    cvUrl: "",
    socialProfile: "",
    joursDisponibles: "MONDAY;FRIDAY",
    disponibilites: "",
    contactUrgence: "0341111111",
    spinneret: "Informatique",
    accepteRegles: "true",
    reglesAccepteesAt: "",
    materielPC: "false",
    certificatUrl: "",
    certificatStatut: "NON_DEMANDE",
  };
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Utilisateurs");
  sheet.addRow(userColumns.map(({ header }) => header));
  sheet.addRow(userColumns.map(({ key }) => String(row[key])));
  const bytes = await workbook.xlsx.writeBuffer();
  return new File([bytes], "users.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

async function presenceWorkbookFile(row: ExcelPresence) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Présences");
  sheet.addRow(presenceColumns.map(({ header }) => header));
  sheet.addRow(presenceColumns.map(({ key }) => String(row[key])));
  const bytes = await workbook.xlsx.writeBuffer();
  return new File([bytes], "presences.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

describe.skipIf(!isDedicatedLocalDatabase)(
  "XLSX USER round-trip sur DB locale",
  () => {
    afterAll(async () => {
      if (importedUserId)
        await prisma.attendance.deleteMany({
          where: { user_id: importedUserId },
        });
      if (importedVolunteerId)
        await prisma.attendance.deleteMany({
          where: { user_id: importedVolunteerId },
        });
      if (importedUserId)
        await prisma.user.deleteMany({ where: { id: importedUserId } });
      if (importedVolunteerId)
        await prisma.user.deleteMany({ where: { id: importedVolunteerId } });
      if (importedSeatId)
        await prisma.seat.deleteMany({ where: { id: importedSeatId } });
      await prisma.user.deleteMany({ where: { email } });
      await prisma.user.deleteMany({ where: { email: volunteerEmail } });
      await prisma.$disconnect();
    });

    it("réimporte sans doublon et conserve les propriétés USER définies", async () => {
      const first = await importUsers(await workbookFile("Initial"));
      expect(first).toMatchObject({ success: true, imported: 1, errors: [] });

      const created = await prisma.user.findUniqueOrThrow({ where: { email } });
      importedUserId = created.id;
      expect(created.role).toBe("USER");
      expect(created.matricule).toBe("MAT-EXCEL-01");
      expect(created.joursDisponibles).toEqual(["MONDAY", "FRIDAY"]);
      expect(created.accepteRegles).toBe(true);

      const second = await importUsers(await workbookFile("Mis à jour"));
      const count = await prisma.user.count({ where: { email } });
      expect(second.imported).toBe(1);
      expect(count).toBe(1);

      const updated = await prisma.user.findUniqueOrThrow({ where: { email } });
      expect(updated.id).toBe(importedUserId);
      expect(updated.nom).toBe("Mis à jour");

      const exported: ExcelUser = {
        nom: updated.nom,
        prenom: updated.prenom,
        email: updated.email,
        role: "USER",
        statut: updated.statut,
        sexe: updated.sexe,
        age: updated.age,
        contact: updated.contact ?? "",
        categorie: updated.categorie,
        etablissement: updated.etablissement,
        facebook: updated.facebook ?? "",
        date_entree: updated.date_entree.toISOString().slice(0, 10),
        matricule: updated.matricule ?? "",
        societe: updated.societe ?? "",
        telephone: updated.telephone ?? "",
        dateNaissance: updated.dateNaissance?.toISOString().slice(0, 10) ?? "",
        siteWeb: updated.siteWeb ?? "",
        cvUrl: updated.cvUrl ?? "",
        socialProfile: updated.socialProfile ?? "",
        joursDisponibles: updated.joursDisponibles.join(";"),
        disponibilites: "",
        contactUrgence: updated.contactUrgence ?? "",
        spinneret: updated.spinneret ?? "",
        accepteRegles: String(updated.accepteRegles),
        reglesAccepteesAt: updated.reglesAccepteesAt?.toISOString() ?? "",
        materielPC: String(updated.materielPC),
        certificatUrl: updated.certificatUrl ?? "",
        certificatStatut: updated.certificatStatut,
      };
      const output = await exportUsersXlsx([exported]);
      const parsed = await parseUsersXlsx(output);
      expect(parsed.errors).toEqual([]);
      expect(parsed.data[0]?.value).toMatchObject({
        role: "USER",
        nom: "Mis à jour",
        matricule: "MAT-EXCEL-01",
        joursDisponibles: ["MONDAY", "FRIDAY"],
      });
    });

    it("réimporte les présences avec table et siège sans doublon", async () => {
      // Create a dedicated VOLUNTEER fixture (importPresences requires role=VOLUNTEER, statut=ACTIF).
      const volunteer = await prisma.user.create({
        data: {
          nom: "Bénévole",
          prenom: "Excel",
          email: volunteerEmail,
          role: "VOLUNTEER",
          statut: "ACTIF",
          matricule: `MAT-VOL-${Date.now()}`,
          telephone: "0340000000",
          password: null,
        },
      });
      importedVolunteerId = volunteer.id;

      const seat = await prisma.seat.create({
        data: { tableNumber: 9876, seatNumber: 9876, label: "Test XLSX" },
      });
      importedSeatId = seat.id;

      const row: ExcelPresence = {
        date: "2026-10-02",
        email: volunteerEmail,
        nom: "Bénévole",
        prenom: "Excel",
        statut: "PRESENT",
        heure_arrivee: "09:00",
        heure_depart: "17:00",
        tableNumber: "9876",
        seatNumber: "9876",
      };

      const first = await importPresences(await presenceWorkbookFile(row));
      const second = await importPresences(await presenceWorkbookFile(row));
      const attendance = await prisma.attendance.findMany({
        where: {
          user_id: importedVolunteerId,
          date: new Date("2026-10-02T00:00:00.000Z"),
        },
        include: { seat: true },
      });

      expect(first.imported).toBe(1);
      expect(second.imported).toBe(1);
      expect(attendance).toHaveLength(1);
      expect(attendance[0]?.seat).toMatchObject({
        tableNumber: 9876,
        seatNumber: 9876,
      });

      const exported: ExcelPresence = {
        ...row,
        tableNumber: String(attendance[0]?.seat?.tableNumber ?? ""),
        seatNumber: String(attendance[0]?.seat?.seatNumber ?? ""),
      };
      const parsed = await parsePresencesXlsx(
        await exportPresencesXlsx([exported])
      );
      expect(parsed.errors).toEqual([]);
      expect(parsed.data[0]?.value).toMatchObject({
        tableNumber: 9876,
        seatNumber: 9876,
      });
    });
  }
);

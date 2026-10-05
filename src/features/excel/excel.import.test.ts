import ExcelJS from "exceljs";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  userFindUnique: vi.fn(),
  userCreate: vi.fn(),
  userUpdateMany: vi.fn(),
  seatFindUnique: vi.fn(),
  attendanceUpsert: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: mocks.userFindUnique,
      create: mocks.userCreate,
      updateMany: mocks.userUpdateMany,
    },
    seat: { findUnique: mocks.seatFindUnique },
    attendance: { upsert: mocks.attendanceUpsert },
  },
}));

import { userColumns } from "./excel.columns";
import { importPresences } from "./excel.import-presences";
import { importUsers } from "./excel.import-users";

async function makeUserFile() {
  const values: Record<string, string> = {
    nom: "Alice",
    prenom: "Martin",
    email: "alice@example.org",
    role: "USER",
    statut: "ACTIF",
    sexe: "Non précisé",
    age: "24",
    categorie: "UNIVERSITAIRE",
    etablissement: "Université",
    date_entree: "2026-01-01",
    matricule: "MAT-24",
    telephone: "0340000000",
    accepteRegles: "false",
    materielPC: "false",
    certificatStatut: "NON_DEMANDE",
  };
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Users");
  sheet.addRow(userColumns.map(({ header }) => header));
  sheet.addRow(userColumns.map(({ header }) => values[header] ?? ""));
  const bytes = new Uint8Array(await workbook.xlsx.writeBuffer());
  return new File([bytes], "users.xlsx");
}

async function makePresenceFile() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Présences");
  sheet.addRow([
    "date",
    "email",
    "nom",
    "prenom",
    "statut",
    "heure_arrivee",
    "heure_depart",
    "tableNumber",
    "seatNumber",
  ]);
  sheet.addRow([
    "2026-01-10",
    "alice@example.org",
    "Alice",
    "Martin",
    "PRESENT",
    "08:30",
    "12:30",
    "",
    "",
  ]);
  const bytes = new Uint8Array(await workbook.xlsx.writeBuffer());
  return new File([bytes], "presences.xlsx");
}

describe("Excel import persistence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates then updates the same USER on repeated import", async () => {
    const file = await makeUserFile();
    mocks.userFindUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({
      id: 7,
      role: "USER",
      deletedAt: null,
      reglesAccepteesAt: null,
    });
    mocks.userCreate.mockResolvedValue({ id: 7 });
    mocks.userUpdateMany.mockResolvedValue({ count: 1 });

    const first = await importUsers(file);
    const second = await importUsers(file);

    expect(first).toMatchObject({ success: true, imported: 1, errors: [] });
    expect(second).toMatchObject({ success: true, imported: 1, errors: [] });
    expect(mocks.userCreate).toHaveBeenCalledTimes(1);
    expect(mocks.userUpdateMany).toHaveBeenCalledTimes(1);
    expect(mocks.userUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 7, role: "USER", deletedAt: null },
      })
    );
  });

  it("does not mutate the database when the upload is invalid", async () => {
    const result = await importUsers(new File(["invalid"], "users.xls"));

    expect(result.imported).toBe(0);
    expect(result.errors[0]?.ligne).toBe(0);
    expect(mocks.userFindUnique).not.toHaveBeenCalled();
    expect(mocks.userCreate).not.toHaveBeenCalled();
  });

  it("does not import attendance for an account that is not an active volunteer", async () => {
    mocks.userFindUnique.mockResolvedValue(null);

    const result = await importPresences(await makePresenceFile());

    expect(result).toMatchObject({ success: false, imported: 0 });
    expect(result.errors[0]).toMatchObject({ ligne: 2, champ: "email" });
    expect(mocks.userFindUnique).toHaveBeenCalledWith({
      where: {
        email: "alice@example.org",
        role: "VOLUNTEER",
        statut: "ACTIF",
        deletedAt: null,
      },
      select: { id: true },
    });
    expect(mocks.attendanceUpsert).not.toHaveBeenCalled();
  });
});

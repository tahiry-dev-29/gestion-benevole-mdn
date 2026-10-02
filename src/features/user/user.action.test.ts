import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  updateMany: vi.fn(),
  findFirst: vi.fn(),
  update: vi.fn(),
  create: vi.fn(),
  findMany: vi.fn(),
}));

vi.mock("next-auth", () => ({ getServerSession: mocks.getServerSession }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth-options", () => ({ authOptions: {} }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      updateMany: mocks.updateMany,
      findFirst: mocks.findFirst,
      update: mocks.update,
      create: mocks.create,
      findMany: mocks.findMany,
    },
  },
}));

import {
  approveCertificateAction,
  createUserAction,
  listUsersAction,
  rejectCertificateAction,
  updateUserAction,
} from "./user.action";

describe("approveCertificateAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getServerSession.mockResolvedValue({
      user: { id: "7", role: "ADMIN" },
    });
    mocks.updateMany.mockResolvedValue({ count: 1 });
    mocks.findFirst.mockResolvedValue({
      accepteRegles: true,
      reglesAccepteesAt: new Date("2026-01-01T00:00:00Z"),
      certificatUrl: null,
    });
    mocks.update.mockResolvedValue({ id: 42, role: "USER" });
  });

  it("converts only a USER with an uploaded pending certificate", async () => {
    await expect(approveCertificateAction({ userId: 42 })).resolves.toEqual({
      success: true,
    });
    expect(mocks.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          role: "USER",
          certificatStatut: "EN_ATTENTE",
          certificatUrl: { not: null },
        }),
        data: expect.objectContaining({
          role: "VOLUNTEER",
          certificatStatut: "APPROUVE",
        }),
      })
    );
  });

  it("rejects approval when no eligible certificate exists", async () => {
    mocks.updateMany.mockResolvedValue({ count: 0 });
    await expect(
      approveCertificateAction({ userId: 42 })
    ).resolves.toMatchObject({
      success: false,
      error: "Un certificat PDF en attente est requis.",
    });
  });

  it("blocks VOLUNTEER before the database is called", async () => {
    mocks.getServerSession.mockResolvedValue({
      user: { id: "8", role: "VOLUNTEER" },
    });
    await expect(
      approveCertificateAction({ userId: 42 })
    ).resolves.toMatchObject({
      success: false,
      error: "Accès réservé aux administrateurs.",
    });
    expect(mocks.updateMany).not.toHaveBeenCalled();
  });

  it("marks a newly uploaded certificate as pending review", async () => {
    const result = await updateUserAction(42, {
      nom: "Nom",
      prenom: "Prenom",
      email: "user@example.com",
      matricule: "U-42",
      telephone: "0340000000",
      materielPC: false,
      accepteRegles: true,
      certificatUrl: "/uploads/certificat-42.pdf",
    });

    expect(result.success).toBe(true);
    expect(mocks.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          certificatUrl: "/uploads/certificat-42.pdf",
          certificatStatut: "EN_ATTENTE",
          certificatValidatedAt: null,
          certificatValidatedById: null,
        }),
      })
    );
  });

  it("persists the rejection reason for the user profile", async () => {
    const result = await rejectCertificateAction({
      userId: 42,
      motif: "Document illisible",
    });

    expect(result.success).toBe(true);
    expect(mocks.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          certificatStatut: "REJETE",
          certificatMotifRejet: "Document illisible",
        },
      })
    );
  });
});

describe("createUserAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getServerSession.mockResolvedValue({
      user: { id: "7", role: "ADMIN" },
    });
    mocks.create.mockResolvedValue({ id: 42, role: "USER" });
  });

  const validInput = {
    role: "ADMIN",
    nom: "Rakoto",
    prenom: "Hery",
    email: "hery@example.com",
    matricule: "U-42",
    telephone: "0340000000",
    materielPC: false,
    accepteRegles: true,
    etablissement: "Université",
  };

  it("forces the USER role even when the payload requests ADMIN", async () => {
    await expect(createUserAction(validInput)).resolves.toMatchObject({
      success: true,
      data: { role: "USER" },
    });
    expect(mocks.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ role: "USER", password: null }),
    });
  });

  it("returns a useful error when a unique matricule or email already exists", async () => {
    mocks.create.mockRejectedValue({ code: "P2002" });

    await expect(createUserAction(validInput)).resolves.toEqual({
      success: false,
      error: "Ce matricule ou email est déjà utilisé.",
    });
  });
});

describe("listUsersAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getServerSession.mockResolvedValue({
      user: { id: "7", role: "ADMIN" },
    });
    mocks.findMany.mockResolvedValue([]);
  });

  it("combines name search, account status, and certificate status filters", async () => {
    await expect(
      listUsersAction({
        query: "hery",
        statut: "ACTIF",
        certificatStatut: "EN_ATTENTE",
      })
    ).resolves.toMatchObject({ success: true, data: [] });

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          role: "USER",
          statut: "ACTIF",
          certificatStatut: "EN_ATTENTE",
          OR: expect.arrayContaining([
            { nom: { contains: "hery", mode: "insensitive" } },
            { email: { contains: "hery", mode: "insensitive" } },
            { matricule: { contains: "hery", mode: "insensitive" } },
          ]),
        }),
      })
    );
  });
});

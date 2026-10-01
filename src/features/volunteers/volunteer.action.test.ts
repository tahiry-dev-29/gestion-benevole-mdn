import type { Role } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { canCreate, MANAGED_ROLES } from "@/lib/rbac";

import { createVolunteerAction } from "./volunteer.action";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  hash: vi.fn(),
  repo: {
    list: vi.fn(),
    getById: vi.fn(),
    findMetaById: vi.fn(),
    emailExists: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    setStatut: vi.fn(),
    softDelete: vi.fn(),
    countByRole: vi.fn(),
  },
  revalidate: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ auth: mocks.auth }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("bcryptjs", () => ({
  default: { hash: mocks.hash, compare: vi.fn() },
}));
vi.mock("./volunteer.repository", () => ({ volunteerRepository: mocks.repo }));

const ACTORS: Role[] = ["SUPER_ADMIN", "ADMIN", "VOLUNTEER", "USER"];
const TARGETS = ["SUPER_ADMIN", "ADMIN", "VOLUNTEER"] as const;

function sessionFor(role: Role) {
  return {
    user: {
      id: "1",
      name: "Test User",
      email: "test@test.com",
      nom: "Test",
      prenom: "User",
      role,
      statut: "ACTIF",
      photo: null,
    },
    expires: new Date(Date.now() + 3_600_000).toISOString(),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.hash.mockResolvedValue("hashed-password");
  mocks.repo.emailExists.mockResolvedValue(false);
  mocks.repo.create.mockResolvedValue({
    id: 1,
    nom: "N",
    prenom: "P",
    email: "x@y.com",
    role: "VOLUNTEER",
    statut: "ACTIF",
    photo: null,
    dateEntree: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    createdById: 1,
    createdBy: null,
  });
});

describe("createVolunteerAction — canCreate appliqué côté serveur (4×3 exhaustif)", () => {
  for (const actor of ACTORS) {
    for (const target of TARGETS) {
      const allowed = actor !== "USER" && canCreate(actor, target);
      it(`${actor} crée ${target} → ${allowed ? "autorisé" : "refusé"}`, async () => {
        mocks.auth.mockResolvedValue(sessionFor(actor));

        const res = await createVolunteerAction({
          nom: "Nouveau",
          prenom: "Benevole",
          email: "nouveau@test.com",
          password: "password123",
          role: target,
          statut: "ACTIF",
        });

        if (allowed) {
          expect(res.success).toBe(true);
          expect(mocks.repo.create).toHaveBeenCalledTimes(1);
        } else {
          expect(res.success).toBe(false);
          expect(mocks.repo.create).not.toHaveBeenCalled();
        }
      });
    }
  }
});

describe("createVolunteerAction — sécurité et validations", () => {
  it("refus explicite contenant le rôle cible, sans écriture", async () => {
    mocks.auth.mockResolvedValue(sessionFor("VOLUNTEER"));

    const res = await createVolunteerAction({
      nom: "Nouveau",
      prenom: "Benevole",
      email: "nouveau@test.com",
      password: "password123",
      role: "ADMIN",
      statut: "ACTIF",
    });

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toBe("Vous ne pouvez pas créer un compte ADMIN.");
    }
    expect(mocks.repo.create).not.toHaveBeenCalled();
  });

  it("sans session → refusé, aucune écriture", async () => {
    mocks.auth.mockResolvedValue(null);

    const res = await createVolunteerAction({
      nom: "Nouveau",
      prenom: "Benevole",
      email: "nouveau@test.com",
      password: "password123",
      role: "VOLUNTEER",
      statut: "ACTIF",
    });

    expect(res.success).toBe(false);
    expect(mocks.repo.create).not.toHaveBeenCalled();
  });

  it("mot de passe trop court → refusé avant écriture", async () => {
    mocks.auth.mockResolvedValue(sessionFor("ADMIN"));

    const res = await createVolunteerAction({
      nom: "Nouveau",
      prenom: "Benevole",
      email: "nouveau@test.com",
      password: "court",
      role: "VOLUNTEER",
      statut: "ACTIF",
    });

    expect(res.success).toBe(false);
    expect(mocks.repo.create).not.toHaveBeenCalled();
  });

  it("SUPER_ADMIN crée un SUPER_ADMIN et trace createdById", async () => {
    mocks.auth.mockResolvedValue(sessionFor("SUPER_ADMIN"));

    const res = await createVolunteerAction({
      nom: "Root",
      prenom: "Bis",
      email: "root@test.com",
      password: "password123",
      role: "SUPER_ADMIN",
      statut: "ACTIF",
    });

    expect(res.success).toBe(true);
    const firstCall = mocks.repo.create.mock.calls[0];
    expect(firstCall?.[0]).toMatchObject({
      role: "SUPER_ADMIN",
      createdById: 1,
      email: "root@test.com",
    });
  });

  it("canCreate interdit toujours la création de USER", () => {
    for (const actor of MANAGED_ROLES) {
      expect(canCreate(actor, "USER")).toBe(false);
    }
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

const findUniqueMock = vi.hoisted(() => vi.fn());
const compareMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: findUniqueMock } },
}));
vi.mock("bcryptjs", () => ({ default: { compare: compareMock } }));

import type { RequestInternal } from "next-auth";

import { authOptions } from "./auth-options";

const credentialsProvider = authOptions.providers.find(
  (provider) => provider.id === "credentials"
);

if (!credentialsProvider || !("options" in credentialsProvider)) {
  throw new Error("Le provider Credentials doit exposer authorize().");
}

const authorize = credentialsProvider.options.authorize;

const request: RequestInternal = {
  headers: {},
  method: "POST",
  action: "callback",
  body: {},
  query: {},
  cookies: {},
};

function makeUser(role: string, statut: string) {
  return {
    id: 7,
    nom: "Rabe",
    prenom: "Soa",
    email: "soa@example.org",
    password: "password-hash",
    role,
    statut,
    photo: null,
    deletedAt: null,
  };
}

describe("authorize — comptes habilités uniquement", () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
    compareMock.mockReset();
    compareMock.mockResolvedValue(true);
  });

  it("refuse un USER sans créer de session", async () => {
    findUniqueMock.mockResolvedValue(makeUser("USER", "ACTIF"));

    await expect(
      authorize({ email: "soa@example.org", password: "secret" }, request)
    ).rejects.toThrow("Compte non habilité");
    expect(compareMock).not.toHaveBeenCalled();
  });

  it("refuse un compte inactif", async () => {
    findUniqueMock.mockResolvedValue(makeUser("ADMIN", "INACTIF"));

    await expect(
      authorize({ email: "soa@example.org", password: "secret" }, request)
    ).resolves.toBeNull();
    expect(compareMock).not.toHaveBeenCalled();
  });

  it("retourne un compte ADMIN actif après validation du mot de passe", async () => {
    findUniqueMock.mockResolvedValue(makeUser("ADMIN", "ACTIF"));

    const user = await authorize(
      { email: "soa@example.org", password: "secret" },
      request
    );

    expect(user).toMatchObject({
      id: "7",
      email: "soa@example.org",
      role: "ADMIN",
      statut: "ACTIF",
    });
    expect(compareMock).toHaveBeenCalledWith("secret", "password-hash");
  });
});

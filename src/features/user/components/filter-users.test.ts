import { describe, expect, it } from "vitest";

import { filterUsers } from "./filter-users";
import type { UserItem } from "./types";

const users: UserItem[] = [
  {
    id: 1,
    nom: "Rakoto",
    prenom: "Hery",
    email: "hery@example.com",
    role: "USER",
    statut: "ACTIF",
    photo: null,
    date_entree: new Date("2026-01-01"),
    createdAt: new Date("2026-01-01"),
    matricule: "ETU-42",
    telephone: "0340000000",
    spinneret: "A",
    certificatStatut: "EN_ATTENTE",
  },
  {
    id: 2,
    nom: "Rasoanaivo",
    prenom: "Miora",
    email: "miora@example.com",
    role: "USER",
    statut: "INACTIF",
    photo: null,
    date_entree: new Date("2026-01-02"),
    createdAt: new Date("2026-01-02"),
    matricule: "ETU-84",
    telephone: "0340000001",
    spinneret: "B",
    certificatStatut: "REJETE",
  },
];

describe("filterUsers", () => {
  it("searches by name, email, matricule, and organization", () => {
    expect(
      filterUsers(users, {
        query: "etu-42",
        statut: "ALL",
        certificat: "ALL",
      }).map((user) => user.id)
    ).toEqual([1]);
  });

  it("combines account status and certificate filters", () => {
    expect(
      filterUsers(users, {
        query: "",
        statut: "ACTIF",
        certificat: "EN_ATTENTE",
      }).map((user) => user.id)
    ).toEqual([1]);
  });

  it("treats a missing certificate state as not requested", () => {
    const userWithoutCertificate = { ...users[0], certificatStatut: undefined };

    expect(
      filterUsers([userWithoutCertificate], {
        query: "",
        statut: "ALL",
        certificat: "NON_DEMANDE",
      })
    ).toEqual([userWithoutCertificate]);
  });
});

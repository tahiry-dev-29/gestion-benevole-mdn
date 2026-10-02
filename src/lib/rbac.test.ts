import type { Role } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  canAccessRoute,
  canCreate,
  canLogin,
  canManageRole,
  creatableRoles,
  CREATE_MATRIX,
  isLoginRole,
  isRole,
  LOGIN_ROLES,
  MANAGED_ROLES,
  ROLES,
} from "./rbac";

const EXPECTED_CREATE_MATRIX: Record<Role, Role[]> = {
  SUPER_ADMIN: ["SUPER_ADMIN", "ADMIN", "VOLUNTEER"],
  ADMIN: ["ADMIN", "VOLUNTEER"],
  VOLUNTEER: ["VOLUNTEER"],
  USER: [],
};
const ROUTE_ACCESS_CASES = [
  { path: "/admin", allowed: LOGIN_ROLES },
  { path: "/admin/dashboard", allowed: LOGIN_ROLES },
  { path: "/admin/profil", allowed: LOGIN_ROLES },
  { path: "/admin/volunteer-management", allowed: MANAGED_ROLES },
  { path: "/admin/volunteers", allowed: MANAGED_ROLES },
  { path: "/admin/volunteer-management/add", allowed: MANAGED_ROLES },
  {
    path: "/admin/volunteer-management/roles",
    allowed: ["SUPER_ADMIN", "ADMIN"],
  },
  { path: "/admin/users", allowed: ["SUPER_ADMIN", "ADMIN"] },
  { path: "/admin/users/presence", allowed: ["SUPER_ADMIN", "ADMIN"] },
  { path: "/admin/places", allowed: ["SUPER_ADMIN", "ADMIN"] },
  { path: "/admin/credits", allowed: ["SUPER_ADMIN", "ADMIN"] },
  { path: "/admin/observations", allowed: ["SUPER_ADMIN", "ADMIN"] },
  { path: "/admin/statistiques", allowed: ["SUPER_ADMIN", "ADMIN"] },
  { path: "/admin/parametres", allowed: ["SUPER_ADMIN", "ADMIN"] },
  { path: "/admin/activites", allowed: ["SUPER_ADMIN", "ADMIN"] },
  { path: "/admin/activities", allowed: ["SUPER_ADMIN", "ADMIN"] },
  { path: "/admin/presences", allowed: ["SUPER_ADMIN", "ADMIN"] },
  { path: "/admin/partages", allowed: ["SUPER_ADMIN", "ADMIN"] },
  { path: "/admin/temoignages", allowed: ["SUPER_ADMIN", "ADMIN"] },
  { path: "/admin/sprints", allowed: ["SUPER_ADMIN", "ADMIN"] },
] as const;

describe("canCreate — matrice 4 rôles × 4 rôles (exhaustif)", () => {
  for (const actor of ROLES) {
    for (const target of ROLES) {
      const expected = EXPECTED_CREATE_MATRIX[actor].includes(target);
      it(`${actor} → ${target} = ${expected}`, () => {
        expect(canCreate(actor, target)).toBe(expected);
      });
    }
  }
});

describe("creatableRoles", () => {
  it("correspond à la ligne de la matrice", () => {
    for (const actor of ROLES) {
      expect(creatableRoles(actor)).toEqual(EXPECTED_CREATE_MATRIX[actor]);
    }
  });
});

describe("canManageRole — hiérarchie (jamais un rang supérieur)", () => {
  it("SUPER_ADMIN gère tout le monde", () => {
    for (const target of ROLES) {
      expect(canManageRole("SUPER_ADMIN", target)).toBe(true);
    }
  });
  it("ADMIN ne gère pas SUPER_ADMIN", () => {
    expect(canManageRole("ADMIN", "SUPER_ADMIN")).toBe(false);
  });
  it("ADMIN gère ADMIN et VOLUNTEER", () => {
    expect(canManageRole("ADMIN", "ADMIN")).toBe(true);
    expect(canManageRole("ADMIN", "VOLUNTEER")).toBe(true);
  });
  it("VOLUNTEER ne gère que VOLUNTEER", () => {
    expect(canManageRole("VOLUNTEER", "VOLUNTEER")).toBe(true);
    expect(canManageRole("VOLUNTEER", "ADMIN")).toBe(false);
    expect(canManageRole("VOLUNTEER", "SUPER_ADMIN")).toBe(false);
  });
});

describe("connexion & routes", () => {
  it("USER ne peut pas se connecter", () => {
    expect(isLoginRole("USER")).toBe(false);
    expect(canLogin("USER")).toBe(false);
  });
  it("les 3 rôles habilités peuvent se connecter", () => {
    expect([...LOGIN_ROLES]).toEqual(["SUPER_ADMIN", "ADMIN", "VOLUNTEER"]);
    for (const role of MANAGED_ROLES) {
      expect(isLoginRole(role)).toBe(true);
    }
  });
  it("/admin/volunteer-management ouvert aux 3 rôles connectés", () => {
    for (const role of MANAGED_ROLES) {
      expect(canAccessRoute("/admin/volunteer-management", role)).toBe(true);
    }
  });
  it("/admin/dashboard autorisé aux 3 rôles habilités", () => {
    for (const role of MANAGED_ROLES) {
      expect(canAccessRoute("/admin/dashboard", role)).toBe(true);
    }
  });
  it("/admin/volunteer-management/roles réservé ADMIN+", () => {
    expect(
      canAccessRoute("/admin/volunteer-management/roles", "VOLUNTEER")
    ).toBe(false);
    expect(canAccessRoute("/admin/volunteer-management/roles", "ADMIN")).toBe(
      true
    );
  });
  it("/admin/users réservé ADMIN+", () => {
    expect(canAccessRoute("/admin/users", "VOLUNTEER")).toBe(false);
    expect(canAccessRoute("/admin/users", "ADMIN")).toBe(true);
  });
  it("les routes métier ADMIN+ restent fermées aux bénévoles", () => {
    const adminOnlyRoutes = [
      "/admin/places",
      "/admin/credits",
      "/admin/observations",
      "/admin/statistiques",
      "/admin/parametres",
      "/admin/activities",
      "/admin/presences",
      "/admin/partages",
      "/admin/temoignages",
      "/admin/sprints",
    ];

    for (const path of adminOnlyRoutes) {
      expect(canAccessRoute(path, "VOLUNTEER"), path).toBe(false);
      expect(canAccessRoute(path, "ADMIN"), path).toBe(true);
      expect(canAccessRoute(path, "SUPER_ADMIN"), path).toBe(true);
    }
  });
  it("refuse les routes admin qui ne sont pas dans la matrice", () => {
    expect(canAccessRoute("/admin/secret", "ADMIN")).toBe(false);
    expect(canAccessRoute("/admin/users-malformed", "ADMIN")).toBe(false);
    expect(
      canAccessRoute("/admin/volunteer-management/roles-malformed", "VOLUNTEER")
    ).toBe(false);
  });
  it("couvre chaque route métier pour chaque rôle", () => {
    for (const { path, allowed } of ROUTE_ACCESS_CASES) {
      for (const role of ROLES) {
        expect(canAccessRoute(path, role), `${role} → ${path}`).toBe(
          allowed.some((allowedRole) => allowedRole === role)
        );
      }
    }
  });
  it("USER est refusé sur toutes les routes /admin", () => {
    expect(canAccessRoute("/admin/dashboard", "USER")).toBe(false);
    expect(canAccessRoute("/admin/volunteer-management", "USER")).toBe(false);
  });
});

describe("type guards", () => {
  it("isRole reconnaît les 4 rôles et rien d'autre", () => {
    for (const role of ROLES) {
      expect(isRole(role)).toBe(true);
    }
    expect(isRole("NOPE")).toBe(false);
    expect(isRole(undefined)).toBe(false);
    expect(isRole(42)).toBe(false);
  });
  it("CREATE_MATRIX couvre exactement les 4 rôles", () => {
    expect(Object.keys(CREATE_MATRIX).sort()).toEqual([...ROLES].sort());
  });
});

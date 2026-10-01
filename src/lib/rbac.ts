import type { Role } from "@prisma/client";

/**
 * Rôles autorisés à s'authentifier sur `/login`.
 * `USER` (pré-conversion) est explicitement exclu : il ne peut pas ouvrir de session.
 */
export const LOGIN_ROLES = ["SUPER_ADMIN", "ADMIN", "VOLUNTEER"] as const;

export type LoginRole = (typeof LOGIN_ROLES)[number];

/** Rôles gérés dans `/admin/volunteer-management` (hors `USER`, géré par `/admin/users`). */
export const MANAGED_ROLES = ["SUPER_ADMIN", "ADMIN", "VOLUNTEER"] as const;

export const ROLES: readonly Role[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "VOLUNTEER",
  "USER",
];

const RANK: Record<Role, number> = {
  SUPER_ADMIN: 3,
  ADMIN: 2,
  VOLUNTEER: 1,
  USER: 0,
};

/**
 * Matrice de création — source unique de vérité (UI + Server Actions).
 * Un rôle ne peut créer que les rôles listés sur sa ligne.
 */
export const CREATE_MATRIX: Record<Role, readonly Role[]> = {
  SUPER_ADMIN: ["SUPER_ADMIN", "ADMIN", "VOLUNTEER"],
  ADMIN: ["ADMIN", "VOLUNTEER"],
  VOLUNTEER: ["VOLUNTEER"],
  USER: [],
};

/**
 * Matrice routes × rôles : les préfixes listés sont réservés à `ADMIN` et
 * `SUPER_ADMIN`. Toute autre route `/admin/**` est ouverte aux 3 rôles
 * connectés (jamais `USER`).
 */
export const ROUTE_MATRIX: readonly {
  pattern: RegExp;
  roles: readonly Role[];
}[] = [
  {
    pattern: /^\/admin\/volunteer-management\/roles(?:\/|$)/,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  { pattern: /^\/admin\/users(?:\/|$)/, roles: ["SUPER_ADMIN", "ADMIN"] },
  { pattern: /^\/admin\/places(?:\/|$)/, roles: ["SUPER_ADMIN", "ADMIN"] },
  { pattern: /^\/admin\/credits(?:\/|$)/, roles: ["SUPER_ADMIN", "ADMIN"] },
  {
    pattern: /^\/admin\/observations(?:\/|$)/,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    pattern: /^\/admin\/statistiques(?:\/|$)/,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    pattern: /^\/admin\/parametres(?:\/|$)/,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  { pattern: /^\/admin\/activites(?:\/|$)/, roles: ["SUPER_ADMIN", "ADMIN"] },
  {
    pattern: /^\/admin\/activities(?:\/|$)/,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  { pattern: /^\/admin\/presences(?:\/|$)/, roles: ["SUPER_ADMIN", "ADMIN"] },
  { pattern: /^\/admin\/presence(?:\/|$)/, roles: ["SUPER_ADMIN", "ADMIN"] },
  { pattern: /^\/admin\/partages(?:\/|$)/, roles: ["SUPER_ADMIN", "ADMIN"] },
  {
    pattern: /^\/admin\/temoignages(?:\/|$)/,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  { pattern: /^\/admin\/sprints(?:\/|$)/, roles: ["SUPER_ADMIN", "ADMIN"] },
];

const LOGIN_ROLES_SET = new Set<string>(LOGIN_ROLES);
const ROLES_SET = new Set<string>(ROLES);

/** Type guard : la valeur est-elle un rôle connu ? */
export function isRole(value: unknown): value is Role {
  return typeof value === "string" && ROLES_SET.has(value);
}

/** Type guard : la valeur est-elle un rôle autorisé à se connecter ? */
export function isLoginRole(value: unknown): value is LoginRole {
  return typeof value === "string" && LOGIN_ROLES_SET.has(value);
}

export function canLogin(role: Role): boolean {
  return isLoginRole(role);
}

/** Un acteur peut-il créer un compte du rôle cible ? */
export function canCreate(actor: Role, target: Role): boolean {
  return CREATE_MATRIX[actor].includes(target);
}

/** Rôles que l'acteur est autorisé à créer (pour l'UI). */
export function creatableRoles(actor: Role): Role[] {
  return [...CREATE_MATRIX[actor]];
}

export function roleRank(role: Role): number {
  return RANK[role];
}

/**
 * Un acteur ne peut modifier / changer le statut / supprimer qu'un compte de
 * rang inférieur ou égal au sien (jamais un rang strictement supérieur).
 */
export function canManageRole(actor: Role, target: Role): boolean {
  return roleRank(actor) >= roleRank(target);
}

export function canAccessRoute(pathname: string, role: Role): boolean {
  if (!isLoginRole(role)) return false;
  const rule = ROUTE_MATRIX.find((entry) => entry.pattern.test(pathname));
  if (rule) return rule.roles.includes(role);
  return true;
}

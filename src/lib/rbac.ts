import type { Role } from "@prisma/client";

// Rôles autorisés à se connecter (USER = pré-conversion, bloqué)
export const LOGIN_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "VOLUNTEER"];

// Matrice de création : actorRole → targetRoles autorisés
const CREATE_MATRIX: Record<Role, Role[]> = {
  SUPER_ADMIN: ["SUPER_ADMIN", "ADMIN", "VOLUNTEER"],
  ADMIN: ["ADMIN", "VOLUNTEER"],
  VOLUNTEER: ["VOLUNTEER"],
  USER: [],
};

/**
 * Vérifie si un acteur peut créer un compte avec le rôle cible.
 * Source unique de vérité utilisée par les Server Actions ET l'UI.
 */
export function canCreate(actorRole: Role, targetRole: Role): boolean {
  return CREATE_MATRIX[actorRole]?.includes(targetRole) ?? false;
}

/**
 * Vérifie si un rôle peut accéder aux routes ADMIN+ (users, places, etc.)
 */
export function isAdminOrAbove(role: Role): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

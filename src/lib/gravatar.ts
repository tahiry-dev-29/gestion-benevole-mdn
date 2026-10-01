import { createHash } from "node:crypto";

/**
 * Génère une URL Gravatar à partir d'un email.
 * Hash SHA-256 de l'email en minuscules + trimmed.
 */
export function gravatarUrl(email: string, size = 200): string {
  const hash = createHash("sha256")
    .update(email.trim().toLowerCase())
    .digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

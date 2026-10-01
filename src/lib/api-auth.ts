import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { isLoginRole } from "@/lib/rbac";

const ADMIN_ROLES = new Set(["SUPER_ADMIN", "ADMIN"]);

/**
 * Autorise uniquement les sessions `SUPER_ADMIN` / `ADMIN`.
 * Retourne une réponse d'erreur si l'accès est refusé, sinon `null`.
 */
export async function requireAdmin(
  request: Request
): Promise<NextResponse | null> {
  const token = await getToken({
    req: request as Parameters<typeof getToken>[0]["req"],
  });

  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  if (!isLoginRole(token.role) || !ADMIN_ROLES.has(token.role)) {
    return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
  }

  return null;
}


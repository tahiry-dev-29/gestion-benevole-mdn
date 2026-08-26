import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function requireAdmin(
  request: Request
): Promise<NextResponse | null> {
  const token = await getToken({
    req: request as Parameters<typeof getToken>[0]["req"],
  });

  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  if (token.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
  }

  return null;
}

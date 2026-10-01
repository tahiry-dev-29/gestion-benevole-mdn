import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function getApiToken(request: Request) {
  return getToken({ req: new NextRequest(request.clone()) });
}

export async function requireAdmin(
  request: Request
): Promise<NextResponse | null> {
  const token = await getApiToken(request);

  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  if (token.role !== "ADMIN" || token.statut === "INACTIF") {
    return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
  }

  return null;
}

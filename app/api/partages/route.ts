import { NextResponse } from "next/server";

import { createPartageSchema } from "@/features/partages/application/partage.schema";
import { partageRepository } from "@/features/partages/infrastructure/partage.repository";
import { getApiToken, requireAdmin } from "@/lib/api-auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = await getApiToken(request);
  const canModerate =
    (token?.role === "ADMIN" || token?.role === "SUPER_ADMIN") &&
    token.statut !== "INACTIF";
  const page = Math.min(
    1_000_000,
    Math.max(1, Number(searchParams.get("page")) || 1)
  );
  const pageSize = Math.min(
    50,
    Math.max(1, Number(searchParams.get("pageSize")) || 10)
  );
  const q = searchParams.get("q") ?? undefined;
  const sortBy =
    (["titre", "datePublication"] as const).find(
      (f) => f === searchParams.get("sortBy")
    ) ?? "datePublication";
  const sortDir =
    (["asc", "desc"] as const).find((d) => d === searchParams.get("sortDir")) ??
    "desc";
  const statut = canModerate
    ? (["BROUILLON", "PUBLIE"] as const).find(
        (value) => value === searchParams.get("statut")
      )
    : undefined;
  return NextResponse.json(
    await partageRepository.list(
      { q, page, pageSize, sortBy, sortDir, statut },
      !canModerate
    )
  );
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const token = await getApiToken(request);
  const body = await request.json().catch(() => null);
  const parsed = createPartageSchema.safeParse(body);
  if (
    !parsed.success ||
    typeof token?.sub !== "string" ||
    !/^\d+$/.test(token.sub)
  ) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
  return NextResponse.json(
    await partageRepository.create(parsed.data, Number(token.sub)),
    { status: 201 }
  );
}

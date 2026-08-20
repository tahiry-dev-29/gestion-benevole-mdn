import { NextResponse } from "next/server";

import { createBenevoleSchema } from "@/features/benevoles/application/benevole.schema";
import { benevoleRepository } from "@/features/benevoles/infrastructure/benevole.repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 10);
  const sortBy =
    (["nom", "prenom", "email", "dateEntree"] as const).find(
      (f) => f === searchParams.get("sortBy")
    ) ?? "nom";
  const sortDir =
    (["asc", "desc"] as const).find((d) => d === searchParams.get("sortDir")) ??
    "asc";

  const result = await benevoleRepository.list({
    q,
    page,
    pageSize,
    sortBy,
    sortDir,
  });
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createBenevoleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const created = await benevoleRepository.create(parsed.data);
  return NextResponse.json(created, { status: 201 });
}

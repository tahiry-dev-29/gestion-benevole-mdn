import { NextResponse } from "next/server";

import { createActiviteSchema } from "@/features/activites/application/activite.schema";
import { activiteRepository } from "@/features/activites/infrastructure/activite.repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 10);
  const sortBy =
    (["titre", "date"] as const).find((f) => f === searchParams.get("sortBy")) ?? "date";
  const sortDir =
    (["asc", "desc"] as const).find((d) => d === searchParams.get("sortDir")) ?? "desc";

  const result = await activiteRepository.list({ q, page, pageSize, sortBy, sortDir });
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createActiviteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const created = await activiteRepository.create(parsed.data);
  return NextResponse.json(created, { status: 201 });
}

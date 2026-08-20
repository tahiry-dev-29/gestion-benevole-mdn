import { NextResponse } from "next/server";

import { updateActiviteSchema } from "@/features/activites/application/activite.schema";
import { activiteRepository } from "@/features/activites/infrastructure/activite.repository";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  const activite = await activiteRepository.getById(Number(id));

  if (!activite) {
    return NextResponse.json(
      { error: "Activité introuvable" },
      { status: 404 }
    );
  }
  return NextResponse.json(activite);
}

export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateActiviteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const updated = await activiteRepository.update(Number(id), parsed.data);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Activité introuvable" },
      { status: 404 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;

  try {
    await activiteRepository.remove(Number(id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Activité introuvable" },
      { status: 404 }
    );
  }
}

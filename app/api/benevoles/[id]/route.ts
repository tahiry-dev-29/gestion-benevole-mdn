import { NextResponse } from "next/server";

import { updateBenevoleSchema } from "@/features/benevoles/application/benevole.schema";
import { benevoleRepository } from "@/features/benevoles/infrastructure/benevole.repository";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  const benevole = await benevoleRepository.getById(Number(id));

  if (!benevole) {
    return NextResponse.json({ error: "Bénévole introuvable" }, { status: 404 });
  }
  return NextResponse.json(benevole);
}

export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateBenevoleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const updated = await benevoleRepository.update(Number(id), parsed.data);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Bénévole introuvable" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;

  try {
    await benevoleRepository.remove(Number(id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Bénévole introuvable" }, { status: 404 });
  }
}

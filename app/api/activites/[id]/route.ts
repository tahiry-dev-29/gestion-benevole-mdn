import { NextResponse } from "next/server";

import { updateActiviteSchema } from "@/features/activites/application/activite.schema";
import { activiteRepository } from "@/features/activites/infrastructure/activite.repository";
import { getApiToken, requireAdmin } from "@/lib/api-auth";

type Context = { params: Promise<{ id: string }> };

function parseId(raw: string) {
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function GET(request: Request, { params }: Context) {
  const { id } = await params;
  const parsedId = parseId(id);
  if (parsedId === null) {
    return NextResponse.json(
      { error: "Activité introuvable" },
      { status: 404 }
    );
  }
  const token = await getApiToken(request);
  const canModerate = token?.role === "ADMIN" && token.statut !== "INACTIF";

  const activite = await activiteRepository.getById(parsedId, !canModerate);

  if (!activite) {
    return NextResponse.json(
      { error: "Activité introuvable" },
      { status: 404 }
    );
  }
  return NextResponse.json(activite);
}

export async function PUT(request: Request, { params }: Context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const parsedId = parseId(id);
  if (parsedId === null) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
  const body = await request.json().catch(() => null);
  const parsed = updateActiviteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const updated = await activiteRepository.update(parsedId, parsed.data);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Activité introuvable" },
      { status: 404 }
    );
  }
}

export async function DELETE(request: Request, { params }: Context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const parsedId = parseId(id);
  if (parsedId === null) {
    return NextResponse.json(
      { error: "Activité introuvable" },
      { status: 404 }
    );
  }

  try {
    await activiteRepository.remove(parsedId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Activité introuvable" },
      { status: 404 }
    );
  }
}

import { NextResponse } from "next/server";

import { updatePartageSchema } from "@/features/partages/application/partage.schema";
import { partageRepository } from "@/features/partages/infrastructure/partage.repository";
import { getApiToken, requireAdmin } from "@/lib/api-auth";

type Context = { params: Promise<{ id: string }> };

function parseId(raw: string) {
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function GET(request: Request, { params }: Context) {
  const { id: raw } = await params;
  const id = parseId(raw);
  if (id === null)
    return NextResponse.json({ error: "Partage introuvable" }, { status: 404 });
  const token = await getApiToken(request);
  const canModerate =
    (token?.role === "ADMIN" || token?.role === "SUPER_ADMIN") &&
    token.statut !== "INACTIF";
  const partage = await partageRepository.getById(id, !canModerate);
  return partage
    ? NextResponse.json(partage)
    : NextResponse.json({ error: "Partage introuvable" }, { status: 404 });
}

export async function PUT(request: Request, { params }: Context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id: raw } = await params;
  const id = parseId(raw);
  const body = await request.json().catch(() => null);
  const parsed = updatePartageSchema.safeParse(body);
  if (id === null || !parsed.success)
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  try {
    return NextResponse.json(await partageRepository.update(id, parsed.data));
  } catch {
    return NextResponse.json({ error: "Partage introuvable" }, { status: 404 });
  }
}

export async function DELETE(request: Request, { params }: Context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id: raw } = await params;
  const id = parseId(raw);
  if (id === null)
    return NextResponse.json({ error: "Partage introuvable" }, { status: 404 });
  try {
    await partageRepository.remove(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Partage introuvable" }, { status: 404 });
  }
}

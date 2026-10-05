import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { creditPeriod } from "@/features/credit/credit.utils";
import { prisma } from "@/lib/prisma";

function isAdminRole(role?: string | null): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export async function GET(request: NextRequest) {
  const token = await getToken({
    req: request as Parameters<typeof getToken>[0]["req"],
  });

  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  if (!isAdminRole(typeof token.role === "string" ? token.role : null)) {
    return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const moisParam = searchParams.get("mois");
  const anneeParam = searchParams.get("annee");

  const where: Record<string, unknown> = {};

  if (moisParam && anneeParam) {
    const mois = parseInt(moisParam, 10);
    const annee = parseInt(anneeParam, 10);
    if (!isNaN(mois) && !isNaN(annee)) {
      const range = creditPeriod(annee, mois);
      where.date = {
        gte: range.from,
        lt: range.to,
      };
    }
  } else if (anneeParam) {
    const annee = parseInt(anneeParam, 10);
    if (!isNaN(annee)) {
      const range = creditPeriod(annee);
      where.date = {
        gte: range.from,
        lt: range.to,
      };
    }
  }

  try {
    const credits = await prisma.credit.findMany({
      where,
      include: {
        user: { select: { nom: true, prenom: true, email: true } },
      },
      orderBy: { date: "desc" },
    });

    // Construction CSV
    const headers = ["Date", "Bénévole", "Email", "Motif", "Montant (€)"];
    const rows = credits.map((c) => [
      c.date.toISOString().split("T")[0],
      `${c.user.prenom} ${c.user.nom}`,
      c.user.email,
      c.motif.replace(/"/g, '""'),
      (Math.round(c.montant * 100) / 100).toFixed(2),
    ]);

    const csvLines = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((r) => r.map((v) => `"${v}"`).join(",")),
    ];

    const csv = csvLines.join("\n");
    const filename = `credits_export_${Date.now()}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la génération du CSV" },
      { status: 500 }
    );
  }
}

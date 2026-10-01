import { prisma } from "@/lib/prisma";

import type {
  Partage,
  PartageInput,
  PartageListParams,
} from "../domain/partage.entity";

function toPartage(row: {
  id: number;
  titre: string;
  contenu: string;
  date_publication: Date;
  statut: "BROUILLON" | "PUBLIE";
  user: { prenom: string; nom: string };
}): Partage {
  return {
    id: row.id,
    titre: row.titre,
    contenu: row.contenu,
    datePublication: row.date_publication.toISOString(),
    statut: row.statut,
    auteur: `${row.user.prenom} ${row.user.nom}`,
  };
}

export const partageRepository = {
  async list(
    { page = 1, pageSize = 10, statut }: PartageListParams = {},
    publishedOnly = false
  ) {
    const where = publishedOnly
      ? { statut: "PUBLIE" as const }
      : statut
        ? { statut }
        : {};
    const [rows, total] = await Promise.all([
      prisma.partage.findMany({
        where,
        include: { user: { select: { prenom: true, nom: true } } },
        orderBy: { date_publication: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.partage.count({ where }),
    ]);
    return { data: rows.map(toPartage), total };
  },

  async getById(id: number, publishedOnly = false) {
    const row = await prisma.partage.findFirst({
      where: { id, ...(publishedOnly ? { statut: "PUBLIE" } : {}) },
      include: { user: { select: { prenom: true, nom: true } } },
    });
    return row ? toPartage(row) : null;
  },

  async create(input: PartageInput, userId: number) {
    const row = await prisma.partage.create({
      data: { ...input, user_id: userId },
      include: { user: { select: { prenom: true, nom: true } } },
    });
    return toPartage(row);
  },

  async update(id: number, input: Partial<PartageInput>) {
    const row = await prisma.partage.update({
      where: { id },
      data: input,
      include: { user: { select: { prenom: true, nom: true } } },
    });
    return toPartage(row);
  },

  async remove(id: number) {
    await prisma.partage.delete({ where: { id } });
  },
};

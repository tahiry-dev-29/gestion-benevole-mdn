import { prisma } from "@/lib/prisma";

import type {
  Activite,
  CreateActiviteInput,
  IActiviteRepository,
  UpdateActiviteInput,
} from "../domain/activite.entity";

const SORT_FIELDS = {
  titre: "titre",
  date: "date",
} as const;

function toEntity(a: {
  id: number;
  titre: string;
  description: string;
  date: Date;
  image: string | null;
  statut: "BROUILLON" | "PUBLIE";
  createdAt: Date;
  updatedAt: Date;
}): Activite {
  return {
    id: a.id,
    titre: a.titre,
    description: a.description,
    date: a.date.toISOString(),
    image: a.image,
    statut: a.statut,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

export const activiteRepository: IActiviteRepository = {
  async list(
    {
      q,
      page = 1,
      pageSize = 10,
      sortBy = "date",
      sortDir = "desc",
      statut,
    } = {},
    publishedOnly = false
  ) {
    const where = {
      ...(publishedOnly ? { statut: "PUBLIE" as const } : {}),
      ...(!publishedOnly && statut ? { statut } : {}),
      ...(q
        ? {
            OR: [
              { titre: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [rows, total] = await Promise.all([
      prisma.activite.findMany({
        where,
        orderBy: { [SORT_FIELDS[sortBy]]: sortDir },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.activite.count({ where }),
    ]);

    return { data: rows.map(toEntity), total };
  },

  async getById(id, publishedOnly = false) {
    const a = await prisma.activite.findFirst({
      where: { id, ...(publishedOnly ? { statut: "PUBLIE" } : {}) },
    });
    return a ? toEntity(a) : null;
  },

  async create(input: CreateActiviteInput) {
    const created = await prisma.activite.create({
      data: {
        titre: input.titre,
        description: input.description,
        date: new Date(input.date),
        image: input.image || null,
        statut: input.statut ?? "BROUILLON",
      },
    });
    return toEntity(created);
  },

  async update(id, input: UpdateActiviteInput) {
    const updated = await prisma.activite.update({
      where: { id },
      data: {
        ...(input.titre !== undefined ? { titre: input.titre } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.date !== undefined ? { date: new Date(input.date) } : {}),
        ...(input.image !== undefined ? { image: input.image || null } : {}),
        ...(input.statut !== undefined ? { statut: input.statut } : {}),
      },
    });
    return toEntity(updated);
  },

  async remove(id) {
    await prisma.activite.delete({ where: { id } });
  },
};

import type { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import type {
  Benevole,
  CreateBenevoleInput,
  IBenevoleRepository,
  ListBenevolesParams,
  UpdateBenevoleInput,
} from "../domain/benevole.entity";

const SORT_FIELDS = {
  nom: "nom",
  prenom: "prenom",
  email: "email",
  dateEntree: "date_entree",
} as const;

function toEntity(user: {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  photo: string | null;
  date_entree: Date;
  createdAt: Date;
  updatedAt: Date;
}): Benevole {
  return {
    id: user.id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    photo: user.photo,
    dateEntree: user.date_entree.toISOString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export const benevoleRepository: IBenevoleRepository = {
  async list(params: ListBenevolesParams = {}) {
    const {
      q,
      page = 1,
      pageSize = 10,
      sortBy = "nom",
      sortDir = "asc",
    } = params;
    const where = q
      ? {
          OR: [
            { nom: { contains: q, mode: "insensitive" as const } },
            { prenom: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [rows, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { [SORT_FIELDS[sortBy]]: sortDir },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          role: true,
          photo: true,
          date_entree: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { data: rows.map(toEntity), total };
  },

  async getById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        photo: true,
        date_entree: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user ? toEntity(user) : null;
  },

  async create(input: CreateBenevoleInput) {
    const created = await prisma.user.create({
      data: {
        nom: input.nom,
        prenom: input.prenom,
        email: input.email,
        password: input.password,
        role: input.role ?? "BENEVOLE",
        date_entree: input.dateEntree ? new Date(input.dateEntree) : new Date(),
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        photo: true,
        date_entree: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return toEntity(created);
  },

  async update(id, input: UpdateBenevoleInput) {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(input.nom !== undefined ? { nom: input.nom } : {}),
        ...(input.prenom !== undefined ? { prenom: input.prenom } : {}),
        ...(input.email !== undefined ? { email: input.email } : {}),
        ...(input.password !== undefined ? { password: input.password } : {}),
        ...(input.role !== undefined ? { role: input.role } : {}),
        ...(input.dateEntree !== undefined
          ? { date_entree: new Date(input.dateEntree) }
          : {}),
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        photo: true,
        date_entree: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return toEntity(updated);
  },

  async remove(id) {
    await prisma.user.delete({ where: { id } });
  },
};

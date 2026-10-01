import type { Role, UserStatut } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { MANAGED_ROLES } from "@/lib/rbac";

import type {
  ListVolunteersParams,
  RoleCounts,
  Volunteer,
  VolunteerListResult,
} from "./volunteer.entity";

const SORT_FIELDS = {
  nom: "nom",
  prenom: "prenom",
  email: "email",
  role: "role",
  statut: "statut",
  dateEntree: "date_entree",
} as const;

const VOLUNTEER_SELECT = {
  id: true,
  nom: true,
  prenom: true,
  email: true,
  role: true,
  statut: true,
  photo: true,
  date_entree: true,
  createdAt: true,
  createdById: true,
  createdBy: { select: { id: true, nom: true, prenom: true } },
} as const;

type VolunteerRow = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  statut: UserStatut;
  photo: string | null;
  date_entree: Date;
  createdAt: Date;
  createdById: number | null;
  createdBy: { id: number; nom: string; prenom: string } | null;
};

function toEntity(row: VolunteerRow): Volunteer {
  return {
    id: row.id,
    nom: row.nom,
    prenom: row.prenom,
    email: row.email,
    role: row.role,
    statut: row.statut,
    photo: row.photo,
    dateEntree: row.date_entree.toISOString(),
    createdAt: row.createdAt.toISOString(),
    createdById: row.createdById,
    createdBy: row.createdBy,
  };
}

export type CreateVolunteerRow = {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: Role;
  statut: UserStatut;
  dateEntree?: string;
  createdById: number;
};

export type UpdateVolunteerRow = {
  nom?: string;
  prenom?: string;
  email?: string;
  password?: string;
  role?: Role;
  statut?: UserStatut;
  dateEntree?: string;
};

export const volunteerRepository = {
  async list(params: ListVolunteersParams = {}): Promise<VolunteerListResult> {
    const {
      q,
      role,
      statut,
      page = 1,
      pageSize = 10,
      sortBy = "nom",
      sortDir = "asc",
    } = params;

    const where = {
      deletedAt: null,
      role: role ?? { in: [...MANAGED_ROLES] },
      ...(statut ? { statut } : {}),
      ...(q
        ? {
            OR: [
              { nom: { contains: q, mode: "insensitive" as const } },
              { prenom: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [rows, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { [SORT_FIELDS[sortBy]]: sortDir },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: VOLUNTEER_SELECT,
      }),
      prisma.user.count({ where }),
    ]);

    return { data: rows.map(toEntity), total };
  },

  async getById(id: number): Promise<Volunteer | null> {
    const row = await prisma.user.findFirst({
      where: { id, deletedAt: null, role: { in: [...MANAGED_ROLES] } },
      select: VOLUNTEER_SELECT,
    });
    return row ? toEntity(row) : null;
  },

  async findMetaById(
    id: number
  ): Promise<{ id: number; role: Role; deletedAt: Date | null } | null> {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, deletedAt: true },
    });
  },

  async emailExists(email: string, exceptId?: number): Promise<boolean> {
    const found = await prisma.user.findFirst({
      where: { email, ...(exceptId ? { id: { not: exceptId } } : {}) },
      select: { id: true },
    });
    return Boolean(found);
  },

  async create(input: CreateVolunteerRow): Promise<Volunteer> {
    const row = await prisma.user.create({
      data: {
        nom: input.nom,
        prenom: input.prenom,
        email: input.email,
        password: input.password,
        role: input.role,
        statut: input.statut,
        date_entree: input.dateEntree ? new Date(input.dateEntree) : new Date(),
        createdById: input.createdById,
      },
      select: VOLUNTEER_SELECT,
    });
    return toEntity(row);
  },

  async update(id: number, input: UpdateVolunteerRow): Promise<Volunteer> {
    const row = await prisma.user.update({
      where: { id },
      data: {
        ...(input.nom !== undefined ? { nom: input.nom } : {}),
        ...(input.prenom !== undefined ? { prenom: input.prenom } : {}),
        ...(input.email !== undefined ? { email: input.email } : {}),
        ...(input.password !== undefined ? { password: input.password } : {}),
        ...(input.role !== undefined ? { role: input.role } : {}),
        ...(input.statut !== undefined ? { statut: input.statut } : {}),
        ...(input.dateEntree !== undefined
          ? { date_entree: new Date(input.dateEntree) }
          : {}),
      },
      select: VOLUNTEER_SELECT,
    });
    return toEntity(row);
  },

  async setStatut(id: number, statut: UserStatut): Promise<Volunteer> {
    const row = await prisma.user.update({
      where: { id },
      data: { statut },
      select: VOLUNTEER_SELECT,
    });
    return toEntity(row);
  },

  async softDelete(id: number): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), statut: "INACTIF" },
    });
  },

  async countByRole(): Promise<RoleCounts> {
    const grouped = await prisma.user.groupBy({
      by: ["role"],
      where: { deletedAt: null },
      _count: { _all: true },
    });

    const counts: RoleCounts = {
      SUPER_ADMIN: 0,
      ADMIN: 0,
      VOLUNTEER: 0,
      USER: 0,
    };
    for (const entry of grouped) {
      counts[entry.role] = entry._count._all;
    }
    return counts;
  },
};

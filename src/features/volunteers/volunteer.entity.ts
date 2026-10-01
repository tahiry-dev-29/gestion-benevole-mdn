import type { Role, UserStatut } from "@prisma/client";

export type VolunteerStatus = UserStatut;

export type VolunteerCreator = {
  id: number;
  nom: string;
  prenom: string;
};

export type Volunteer = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  statut: VolunteerStatus;
  photo: string | null;
  dateEntree: string;
  createdAt: string;
  createdById: number | null;
  createdBy: VolunteerCreator | null;
};

export type ListVolunteersParams = {
  q?: string;
  role?: Role;
  statut?: VolunteerStatus;
  page?: number;
  pageSize?: number;
  sortBy?: "nom" | "prenom" | "email" | "role" | "statut" | "dateEntree";
  sortDir?: "asc" | "desc";
};

export type VolunteerListResult = {
  data: Volunteer[];
  total: number;
};

export type RoleCounts = Record<Role, number>;

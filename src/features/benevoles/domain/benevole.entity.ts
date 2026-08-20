import type { Role } from "@prisma/client";

export type Benevole = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  photo: string | null;
  dateEntree: string;
  createdAt: string;
  updatedAt: string;
};

export type ListBenevolesParams = {
  q?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "nom" | "prenom" | "email" | "dateEntree";
  sortDir?: "asc" | "desc";
};

export type CreateBenevoleInput = {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role?: Role;
  dateEntree?: string;
};

export type UpdateBenevoleInput = Partial<CreateBenevoleInput>;

export interface IBenevoleRepository {
  list(params: ListBenevolesParams): Promise<{ data: Benevole[]; total: number }>;
  getById(id: number): Promise<Benevole | null>;
  create(input: CreateBenevoleInput): Promise<Benevole>;
  update(id: number, input: UpdateBenevoleInput): Promise<Benevole>;
  remove(id: number): Promise<void>;
}

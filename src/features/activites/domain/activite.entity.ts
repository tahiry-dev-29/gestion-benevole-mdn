export type Activite = {
  id: number;
  titre: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type ListActivitesParams = {
  q?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "titre" | "date";
  sortDir?: "asc" | "desc";
};

export type CreateActiviteInput = {
  titre: string;
  description: string;
  date: string;
};

export type UpdateActiviteInput = Partial<CreateActiviteInput>;

export interface IActiviteRepository {
  list(
    params: ListActivitesParams
  ): Promise<{ data: Activite[]; total: number }>;
  getById(id: number): Promise<Activite | null>;
  create(input: CreateActiviteInput): Promise<Activite>;
  update(id: number, input: UpdateActiviteInput): Promise<Activite>;
  remove(id: number): Promise<void>;
}

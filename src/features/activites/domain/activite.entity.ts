export type Activite = {
  id: number;
  titre: string;
  description: string;
  date: string;
  image: string | null;
  statut: "BROUILLON" | "PUBLIE";
  createdAt: string;
  updatedAt: string;
};

export type ListActivitesParams = {
  q?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "titre" | "date";
  sortDir?: "asc" | "desc";
  statut?: "BROUILLON" | "PUBLIE";
};

export type CreateActiviteInput = {
  titre: string;
  description: string;
  date: string;
  image?: string;
  statut?: "BROUILLON" | "PUBLIE";
};

export type UpdateActiviteInput = Partial<CreateActiviteInput>;

export interface IActiviteRepository {
  list(
    params: ListActivitesParams,
    publishedOnly?: boolean
  ): Promise<{ data: Activite[]; total: number }>;
  getById(id: number, publishedOnly?: boolean): Promise<Activite | null>;
  create(input: CreateActiviteInput): Promise<Activite>;
  update(id: number, input: UpdateActiviteInput): Promise<Activite>;
  remove(id: number): Promise<void>;
}

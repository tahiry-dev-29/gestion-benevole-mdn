export type Partage = {
  id: number;
  titre: string;
  contenu: string;
  datePublication: string;
  statut: "BROUILLON" | "PUBLIE";
  auteur: string | null;
};

export type PartageInput = {
  titre: string;
  contenu: string;
  statut?: "BROUILLON" | "PUBLIE";
};

export type PartageListParams = {
  page?: number;
  pageSize?: number;
  statut?: "BROUILLON" | "PUBLIE";
};

export type CategoryType =
  | "PRIMAIRE"
  | "COLLEGIEN"
  | "UNIVERSITAIRE"
  | "SALARIE";

export interface UserItem {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: "ADMIN" | "BENEVOLE";
  statut: "ACTIF" | "INACTIF";
  photo: string | null;
  sexe?: string | null;
  age?: number | null;
  contact?: string | null;
  categorie?: CategoryType | null;
  etablissement?: string | null;
  facebook?: string | null;
  date_entree: Date;
  createdAt: Date;
}

export interface UserFormData {
  prenom: string;
  nom: string;
  email: string;
  role: "ADMIN" | "BENEVOLE";
  sexe: string;
  age: string;
  contact: string;
  categorie: CategoryType | "";
  etablissement: string;
  facebook: string;
}

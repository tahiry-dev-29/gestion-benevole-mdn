export type CategoryType =
  "PRIMAIRE" | "COLLEGIEN" | "UNIVERSITAIRE" | "SALARIE";

export interface UserItem {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "VOLUNTEER" | "USER";
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
  matricule: string | null;
  certificatStatut?: "NON_DEMANDE" | "EN_ATTENTE" | "APPROUVE" | "REJETE";
  certificatUrl?: string | null;
  telephone: string | null;
  societe?: string | null;
  materielPC?: boolean;
  accepteRegles?: boolean;
  spinneret: string | null;
}

export interface UserFormData {
  prenom: string;
  nom: string;
  email: string;
  role: "USER";
  sexe: string;
  age: string;
  contact: string;
  categorie: CategoryType | "";
  etablissement: string;
  facebook: string;
  matricule: string;
  telephone: string;
  materielPC: boolean;
  accepteRegles: boolean;
  spinneret: string;
  societe: string;
}

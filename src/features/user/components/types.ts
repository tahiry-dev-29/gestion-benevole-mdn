export type CategoryType = "PRIMAIRE" | "COLLEGIEN" | "UNIVERSITAIRE" | "SALARIE";
export type RoleType = "SUPER_ADMIN" | "ADMIN" | "VOLUNTEER" | "USER";
export type StatutType = "ACTIF" | "INACTIF";
export type CertificatStatutType =
  | "NON_DEMANDE"
  | "EN_ATTENTE"
  | "APPROUVE"
  | "REJETE";

export interface UserItem {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: RoleType;
  statut: StatutType;
  photo: string | null;
  sexe?: string | null;
  age?: number | null;
  contact?: string | null;
  categorie?: CategoryType | null;
  etablissement?: string | null;
  facebook?: string | null;
  date_entree: Date;
  createdAt: Date;
  matricule?: string | null;
  societe?: string | null;
  telephone?: string | null;
  materielPC?: boolean;
  accepteRegles?: boolean;
  spinneret?: string | null;
  certificatStatut?: CertificatStatutType;
  certificatUrl?: string | null;
  certificatValidatedAt?: Date | null;
}

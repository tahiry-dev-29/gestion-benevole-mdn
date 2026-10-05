import type { CertificatStatut, Role, UserStatut } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export interface UserDetailsView {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  statut: UserStatut;
  sexe: string | null;
  age: number | null;
  contact: string | null;
  categorie: string | null;
  etablissement: string | null;
  societe: string | null;
  matricule: string | null;
  telephone: string | null;
  dateNaissance: Date | null;
  siteWeb: string | null;
  cvUrl: string | null;
  socialProfile: string | null;
  joursDisponibles: string[];
  disponibilites: Prisma.JsonValue | null;
  contactUrgence: string | null;
  spinneret: string | null;
  accepteRegles: boolean;
  reglesAccepteesAt: Date | null;
  materielPC: boolean;
  certificatUrl: string | null;
  certificatStatut: CertificatStatut;
  certificatMotifRejet: string | null;
  certificatValidatedAt: Date | null;
  certificatValidatedById: number | null;
  date_entree: Date;
  createdAt: Date;
}

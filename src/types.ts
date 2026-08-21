// Type pour l'utilisateur dans la session
export type SessionUser = {
  id: string;
  email: string;
  name: string;
  nom: string;
  prenom: string;
  role: string;
  photo: string | null;
};

// Type pour les utilisateurs dans l'admin
export type UserRolePublic = "ADMIN" | "BENEVOLE";
export type UserStatus = "ACTIF" | "INACTIF";

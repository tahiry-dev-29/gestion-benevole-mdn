import type { Role, UserStatut } from "@prisma/client";

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super admin",
  ADMIN: "Administrateur",
  VOLUNTEER: "Bénévole",
  USER: "Utilisateur",
};

export const STATUT_LABELS: Record<UserStatut, string> = {
  ACTIF: "Actif",
  INACTIF: "Inactif",
};

export function roleLabel(role: Role): string {
  return ROLE_LABELS[role];
}

export function statutLabel(statut: UserStatut): string {
  return STATUT_LABELS[statut];
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(date);
}

export function formatFullName(person: {
  prenom: string;
  nom: string;
}): string {
  return `${person.prenom} ${person.nom}`.trim();
}

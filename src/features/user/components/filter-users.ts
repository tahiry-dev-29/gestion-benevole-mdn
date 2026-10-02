import type { UserItem } from "./types";

export function filterUsers(
  users: UserItem[],
  filters: { query: string; statut: string; certificat: string }
) {
  const query = filters.query.trim().toLocaleLowerCase("fr");

  return users.filter((user) => {
    const searchTarget = [
      user.prenom,
      user.nom,
      user.email,
      user.matricule ?? "",
      user.role,
      user.etablissement ?? "",
      user.societe ?? "",
      user.contact ?? "",
    ]
      .join(" ")
      .toLocaleLowerCase("fr");
    const matchesQuery = !query || searchTarget.includes(query);
    const matchesStatus =
      filters.statut === "ALL" || user.statut === filters.statut;
    const matchesCertificate =
      filters.certificat === "ALL" ||
      (user.certificatStatut ?? "NON_DEMANDE") === filters.certificat;

    return matchesQuery && matchesStatus && matchesCertificate;
  });
}

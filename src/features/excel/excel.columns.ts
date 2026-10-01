export type ExcelColumn<T> = {
  header: string;
  key: keyof T;
  width: number;
};

export type ExcelUser = {
  nom: string;
  prenom: string;
  email: string;
  role: string;
  statut: string;
  sexe: string;
  age: number;
  contact: string;
  categorie: string;
  etablissement: string;
  facebook: string;
  date_entree: string;
};

export type ExcelPresence = {
  date: string;
  email: string;
  nom: string;
  prenom: string;
  statut: string;
  heure_arrivee: string;
  heure_depart: string;
};

export const userColumns: ExcelColumn<ExcelUser>[] = [
  { header: "nom", key: "nom", width: 20 },
  { header: "prenom", key: "prenom", width: 20 },
  { header: "email", key: "email", width: 32 },
  { header: "role", key: "role", width: 16 },
  { header: "statut", key: "statut", width: 16 },
  { header: "sexe", key: "sexe", width: 18 },
  { header: "age", key: "age", width: 10 },
  { header: "contact", key: "contact", width: 20 },
  { header: "categorie", key: "categorie", width: 20 },
  { header: "etablissement", key: "etablissement", width: 28 },
  { header: "facebook", key: "facebook", width: 32 },
  { header: "date_entree", key: "date_entree", width: 16 },
];

export const presenceColumns: ExcelColumn<ExcelPresence>[] = [
  { header: "date", key: "date", width: 16 },
  { header: "email", key: "email", width: 32 },
  { header: "nom", key: "nom", width: 20 },
  { header: "prenom", key: "prenom", width: 20 },
  { header: "statut", key: "statut", width: 16 },
  { header: "heure_arrivee", key: "heure_arrivee", width: 18 },
  { header: "heure_depart", key: "heure_depart", width: 18 },
];

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
  matricule: string;
  societe: string;
  telephone: string;
  dateNaissance: string;
  siteWeb: string;
  cvUrl: string;
  socialProfile: string;
  joursDisponibles: string;
  disponibilites: string;
  contactUrgence: string;
  spinneret: string;
  accepteRegles: string;
  reglesAccepteesAt: string;
  materielPC: string;
  certificatUrl: string;
  certificatStatut: string;
};

export type ExcelPresence = {
  date: string;
  email: string;
  nom: string;
  prenom: string;
  statut: string;
  heure_arrivee: string;
  heure_depart: string;
  tableNumber: string;
  seatNumber: string;
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
  { header: "matricule", key: "matricule", width: 18 },
  { header: "societe", key: "societe", width: 24 },
  { header: "telephone", key: "telephone", width: 18 },
  { header: "dateNaissance", key: "dateNaissance", width: 16 },
  { header: "siteWeb", key: "siteWeb", width: 32 },
  { header: "cvUrl", key: "cvUrl", width: 40 },
  { header: "socialProfile", key: "socialProfile", width: 40 },
  { header: "joursDisponibles", key: "joursDisponibles", width: 28 },
  { header: "disponibilites", key: "disponibilites", width: 48 },
  { header: "contactUrgence", key: "contactUrgence", width: 24 },
  { header: "spinneret", key: "spinneret", width: 24 },
  { header: "accepteRegles", key: "accepteRegles", width: 16 },
  { header: "reglesAccepteesAt", key: "reglesAccepteesAt", width: 22 },
  { header: "materielPC", key: "materielPC", width: 14 },
  { header: "certificatUrl", key: "certificatUrl", width: 40 },
  { header: "certificatStatut", key: "certificatStatut", width: 18 },
];

export const presenceColumns: ExcelColumn<ExcelPresence>[] = [
  { header: "date", key: "date", width: 16 },
  { header: "email", key: "email", width: 32 },
  { header: "nom", key: "nom", width: 20 },
  { header: "prenom", key: "prenom", width: 20 },
  { header: "statut", key: "statut", width: 16 },
  { header: "heure_arrivee", key: "heure_arrivee", width: 18 },
  { header: "heure_depart", key: "heure_depart", width: 18 },
  { header: "tableNumber", key: "tableNumber", width: 14 },
  { header: "seatNumber", key: "seatNumber", width: 14 },
];

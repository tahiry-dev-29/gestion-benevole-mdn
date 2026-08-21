import {
  BarChart3,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  Coins,
  Eye,
  LayoutDashboard,
  type LucideIcon,
  MessageSquare,
  Package,
  Settings,
  Share2,
  UserCheck,
  Users,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
};

export type NavGroup = {
  label: string;
  icon?: LucideIcon;
  dropdown?: boolean;
  items: NavItem[];
};

export const adminGestionItems: NavItem[] = [
  {
    title: "Utilisateurs",
    url: "/admin/users",
    icon: Users,
    items: [{ title: "Liste des utilisateurs", url: "/admin/users" }],
  },
  {
    title: "Gestion bénévole",
    url: "/admin/volunteers",
    icon: UserCheck,
    items: [{ title: "Bénévoles", url: "/admin/volunteers" }],
  },
  {
    title: "Présences",
    url: "/admin/presences",
    icon: CalendarCheck,
    items: [{ title: "Pointage journalier", url: "/admin/presences" }],
  },
  {
    title: "Activités",
    url: "/admin/activities",
    icon: CalendarDays,
    items: [{ title: "Liste des activités", url: "/admin/activities" }],
  },
  {
    title: "Crédits",
    url: "/admin/credits",
    icon: Coins,
    items: [{ title: "Liste des crédits", url: "/admin/credits" }],
  },
  {
    title: "Observations",
    url: "/admin/observations",
    icon: Eye,
    items: [{ title: "Observations mensuelles", url: "/admin/observations" }],
  },
];

export const adminNavGroups: NavGroup[] = [
  {
    label: "Navigation",
    items: [
      { title: "Tableau de bord", url: "/admin", icon: LayoutDashboard },
      { title: "Suivi du projet", url: "/admin/sprints", icon: ClipboardList },
    ],
  },
  {
    label: "Communication",
    items: [
      { title: "Partages", url: "/admin/partages", icon: Share2 },
      { title: "Témoignages", url: "/admin/temoignages", icon: MessageSquare },
    ],
  },
  {
    label: "Système",
    items: [
      { title: "Statistiques", url: "/admin/statistiques", icon: BarChart3 },
      { title: "Paramètres", url: "/admin/parametres", icon: Settings },
    ],
  },
];

export const adminTeams = [
  { name: "Gestion Bénévole", logo: Package, plan: "Espace administration" },
];

export const adminUser = {
  name: "Marie Dupont",
  email: "marie.dupont@asso.fr",
  avatar: "",
};

export type PresenceMock = {
  id: number;
  benevole: string;
  date: string;
  heure_arrivee: string | null;
  heure_depart: string | null;
  statut: "PRESENT" | "ABSENT" | "RETARD";
};

export const presences: PresenceMock[] = [
  {
    id: 1,
    benevole: "Jean Martin",
    date: "2026-08-18",
    heure_arrivee: "09:00",
    heure_depart: "17:00",
    statut: "PRESENT",
  },
  {
    id: 2,
    benevole: "Sophie Bernard",
    date: "2026-08-18",
    heure_arrivee: "09:30",
    heure_depart: "16:30",
    statut: "RETARD",
  },
  {
    id: 3,
    benevole: "Pierre Lefevre",
    date: "2026-08-18",
    heure_arrivee: null,
    heure_depart: null,
    statut: "ABSENT",
  },
  {
    id: 4,
    benevole: "Claire Morel",
    date: "2026-08-17",
    heure_arrivee: "08:45",
    heure_depart: "17:15",
    statut: "PRESENT",
  },
  {
    id: 5,
    benevole: "Luc Petit",
    date: "2026-08-17",
    heure_arrivee: "10:00",
    heure_depart: "15:00",
    statut: "PRESENT",
  },
];

export type ActivityMock = {
  id: number;
  titre: string;
  description: string;
  date: string;
  responsable: string | null;
};

export const activities: ActivityMock[] = [
  {
    id: 1,
    titre: "Distribution alimentaire",
    description: "Distribution hebdomadaire aux familles.",
    date: "2026-08-20",
    responsable: "Marie Dupont",
  },
  {
    id: 2,
    titre: "Collecte de fonds",
    description: "Événement de collecte au marché.",
    date: "2026-08-25",
    responsable: "Jean Martin",
  },
  {
    id: 3,
    titre: "Formation bénévoles",
    description: "Session de formation pour les nouveaux.",
    date: "2026-09-02",
    responsable: null,
  },
  {
    id: 4,
    titre: "Nettoyage local",
    description: "Entretien du local associatif.",
    date: "2026-09-10",
    responsable: "Sophie Bernard",
  },
];

export type CreditMock = {
  id: number;
  benevole: string;
  montant: number;
  date: string;
  motif: string;
};

export const credits: CreditMock[] = [
  {
    id: 1,
    benevole: "Jean Martin",
    montant: 50,
    date: "2026-08-10",
    motif: "Remboursement transport",
  },
  {
    id: 2,
    benevole: "Sophie Bernard",
    montant: 120,
    date: "2026-08-12",
    motif: "Achat fournitures",
  },
  {
    id: 3,
    benevole: "Pierre Lefevre",
    montant: 30,
    date: "2026-08-15",
    motif: "Frais repas",
  },
];

export type ObservationMock = {
  id: number;
  benevole: string;
  mois: number;
  annee: number;
  contenu: string;
};

export const observations: ObservationMock[] = [
  {
    id: 1,
    benevole: "Jean Martin",
    mois: 7,
    annee: 2026,
    contenu: "Très impliqué, ponctuel et à l'écoute.",
  },
  {
    id: 2,
    benevole: "Sophie Bernard",
    mois: 7,
    annee: 2026,
    contenu: "Bon travail d'équipe, progresse vite.",
  },
  {
    id: 3,
    benevole: "Pierre Lefevre",
    mois: 6,
    annee: 2026,
    contenu: "Quelques absences, à suivre.",
  },
];

export type PartageMock = {
  id: number;
  titre: string;
  contenu: string;
  date_publication: string;
  auteur: string | null;
};

export const partages: PartageMock[] = [
  {
    id: 1,
    titre: "Astuces cuisine solidaire",
    contenu: "Comment cuisiner avec peu de moyens.",
    date_publication: "2026-08-05",
    auteur: "Marie Dupont",
  },
  {
    id: 2,
    titre: "Retour de mission",
    contenu: "Bilan de la dernière distribution.",
    date_publication: "2026-08-12",
    auteur: null,
  },
];

export type TemoignageMock = {
  id: number;
  nom_auteur: string;
  contenu: string;
  statut: "EN_ATTENTE" | "APPROUVE" | "REJETE";
};

export const temoignages: TemoignageMock[] = [
  {
    id: 1,
    nom_auteur: "Anonymous",
    contenu: "Merci pour votre aide précieuse !",
    statut: "EN_ATTENTE",
  },
  {
    id: 2,
    nom_auteur: "Claire Morel",
    contenu: "Une belle expérience humaine.",
    statut: "APPROUVE",
  },
  {
    id: 3,
    nom_auteur: "Jean Martin",
    contenu: "Témoignage non conforme.",
    statut: "REJETE",
  },
];

export const dashboardStats = [
  { label: "Bénévoles actifs", value: "42", change: "+12%", trend: "up" },
  { label: "Événements ce mois", value: "8", change: "+3", trend: "up" },
  { label: "Tâches complétées", value: "156", change: "+24%", trend: "up" },
  { label: "En attente", value: "5", change: "-2", trend: "down" },
];

export const users = [
  { id: 1, prenom: "Jean", nom: "Martin", email: "jean.martin@asso.fr", role: "BENEVOLE", date_entree: "2025-01-15" },
  { id: 2, prenom: "Sophie", nom: "Bernard", email: "sophie.bernard@asso.fr", role: "BENEVOLE", date_entree: "2025-03-22" },
  { id: 3, prenom: "Pierre", nom: "Lefevre", email: "pierre.lefevre@asso.fr", role: "BENEVOLE", date_entree: "2024-11-10" },
  { id: 4, prenom: "Claire", nom: "Morel", email: "claire.morel@asso.fr", role: "BENEVOLE", date_entree: "2025-06-05" },
  { id: 5, prenom: "Luc", nom: "Petit", email: "luc.petit@asso.fr", role: "BENEVOLE", date_entree: "2025-02-28" },
  { id: 6, prenom: "Marie", nom: "Dupont", email: "marie.dupont@asso.fr", role: "ADMIN", date_entree: "2024-09-01" },
  { id: 7, prenom: "Thomas", nom: "Durand", email: "thomas.durand@asso.fr", role: "BENEVOLE", date_entree: "2025-07-12" },
  { id: 8, prenom: "Julie", nom: "Roux", email: "julie.roux@asso.fr", role: "BENEVOLE", date_entree: "2025-04-18" },
  { id: 9, prenom: "Nicolas", nom: "Moreau", email: "nicolas.moreau@asso.fr", role: "BENEVOLE", date_entree: "2024-12-03" },
  { id: 10, prenom: "Emma", nom: "Fournier", email: "emma.fournier@asso.fr", role: "BENEVOLE", date_entree: "2025-05-30" },
  { id: 11, prenom: "Antoine", nom: "Girard", email: "antoine.girard@asso.fr", role: "BENEVOLE", date_entree: "2025-08-14" },
  { id: 12, prenom: "Léa", nom: "Lefort", email: "lea.lefort@asso.fr", role: "BENEVOLE", date_entree: "2025-01-20" },
];
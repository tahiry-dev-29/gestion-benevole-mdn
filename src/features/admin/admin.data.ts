import {
  CalendarCheck,
  CalendarDays,
  Coins,
  Eye,
  LayoutDashboard,
  type LucideIcon,
  MessageSquare,
  Share2,
  UserCheck,
  Users,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const adminNav: NavItem[] = [
  { title: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
  { title: "Utilisateurs", href: "/admin/users", icon: Users },
  { title: "Bénévoles", href: "/admin/volunteers", icon: UserCheck },
  { title: "Présences", href: "/admin/presences", icon: CalendarCheck },
  { title: "Activités", href: "/admin/activities", icon: CalendarDays },
  { title: "Crédits", href: "/admin/credits", icon: Coins },
  { title: "Observations", href: "/admin/observations", icon: Eye },
  { title: "Partages", href: "/admin/partages", icon: Share2 },
  { title: "Témoignages", href: "/admin/temoignages", icon: MessageSquare },
];

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const adminNavGroups: NavGroup[] = [
  {
    label: "Général",
    items: [
      { title: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Gestion",
    items: [
      { title: "Utilisateurs", href: "/admin/users", icon: Users },
      { title: "Bénévoles", href: "/admin/benevoles", icon: UserCheck },
      { title: "Présences", href: "/admin/presences", icon: CalendarCheck },
      { title: "Activités", href: "/admin/activites", icon: CalendarDays },
      { title: "Crédits", href: "/admin/credits", icon: Coins },
      { title: "Observations", href: "/admin/observations", icon: Eye },
      { title: "Partages", href: "/admin/partages", icon: Share2 },
      { title: "Témoignages", href: "/admin/temoignages", icon: MessageSquare },
    ],
  },
];

export type UserMock = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: "ADMIN" | "BENEVOLE";
  date_entree: string;
};

export const users: UserMock[] = [
  {
    id: 1,
    nom: "Dupont",
    prenom: "Marie",
    email: "marie.dupont@asso.fr",
    role: "ADMIN",
    date_entree: "2026-01-12",
  },
  {
    id: 2,
    nom: "Martin",
    prenom: "Jean",
    email: "jean.martin@asso.fr",
    role: "BENEVOLE",
    date_entree: "2026-02-03",
  },
  {
    id: 3,
    nom: "Bernard",
    prenom: "Sophie",
    email: "sophie.bernard@asso.fr",
    role: "BENEVOLE",
    date_entree: "2026-02-20",
  },
  {
    id: 4,
    nom: "Lefevre",
    prenom: "Pierre",
    email: "pierre.lefevre@asso.fr",
    role: "BENEVOLE",
    date_entree: "2026-03-08",
  },
  {
    id: 5,
    nom: "Morel",
    prenom: "Claire",
    email: "claire.morel@asso.fr",
    role: "BENEVOLE",
    date_entree: "2026-03-15",
  },
  {
    id: 6,
    nom: "Petit",
    prenom: "Luc",
    email: "luc.petit@asso.fr",
    role: "ADMIN",
    date_entree: "2026-04-01",
  },
];

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

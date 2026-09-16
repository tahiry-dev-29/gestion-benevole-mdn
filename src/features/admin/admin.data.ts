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

export * from "./data/mock-data";

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
      {
        title: "Tableau de bord",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
      },
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

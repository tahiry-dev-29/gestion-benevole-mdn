import type { Role } from "@prisma/client";
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

const ADMIN_ONLY: Role[] = ["SUPER_ADMIN", "ADMIN"];

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  roles?: Role[];
  isActive?: boolean;
  items?: { title: string; url: string; roles?: Role[] }[];
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
    roles: ADMIN_ONLY,
    items: [{ title: "Liste des utilisateurs", url: "/admin/users" }],
  },
  {
    title: "Gestion bénévole",
    url: "/admin/volunteer-management",
    icon: UserCheck,
    items: [
      { title: "Liste des bénévoles", url: "/admin/volunteer-management" },
      { title: "Ajouter un bénévole", url: "/admin/volunteer-management/add" },
      {
        title: "Rôles & permissions",
        url: "/admin/volunteer-management/roles",
        roles: ADMIN_ONLY,
      },
    ],
  },
  {
    title: "Présences",
    url: "/admin/presences",
    icon: CalendarCheck,
    roles: ADMIN_ONLY,
    items: [
      { title: "Pointage journalier", url: "/admin/presences" },
      { title: "Tables et places", url: "/admin/places", roles: ADMIN_ONLY },
    ],
  },
  {
    title: "Activités",
    url: "/admin/activites",
    icon: CalendarDays,
    roles: ADMIN_ONLY,
    items: [{ title: "Liste des activités", url: "/admin/activites" }],
  },
  {
    title: "Crédits",
    url: "/admin/credits",
    icon: Coins,
    roles: ADMIN_ONLY,
    items: [{ title: "Liste des crédits", url: "/admin/credits" }],
  },
  {
    title: "Observations",
    url: "/admin/observations",
    icon: Eye,
    roles: ADMIN_ONLY,
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
      {
        title: "Suivi du projet",
        url: "/admin/sprints",
        icon: ClipboardList,
        roles: ADMIN_ONLY,
      },
    ],
  },
  {
    label: "Communication",
    items: [
      {
        title: "Partages",
        url: "/admin/partages",
        icon: Share2,
        roles: ADMIN_ONLY,
      },
      {
        title: "Témoignages",
        url: "/admin/temoignages",
        icon: MessageSquare,
        roles: ADMIN_ONLY,
      },
    ],
  },
  {
    label: "Système",
    items: [
      {
        title: "Statistiques",
        url: "/admin/statistiques",
        icon: BarChart3,
        roles: ADMIN_ONLY,
      },
      {
        title: "Paramètres",
        url: "/admin/parametres",
        icon: Settings,
        roles: ADMIN_ONLY,
      },
    ],
  },
];

export const adminTeams = [
  { name: "Gestion Bénévole", logo: Package, plan: "Espace administration" },
];

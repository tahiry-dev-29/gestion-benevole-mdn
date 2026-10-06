Status: DONE

# Feature tasks: Refonte UI/UX — Section Présences (/admin/presences)

## Plan

Plan: plan-002
Plan file: ../plans/plan-002_design_system_ui_refonte.md
Feature: Gestion des présences quotidiennes

## Feature goal

Ajouter Breadcrumb et Tabs (Pointage du jour / Historique / Statistiques) à la page présences, et créer les vues Historique et Statistiques.

---

## Problèmes identifiés (audit 2026-10-05)

| # | Fichier | Problème | Sévérité |
|---|---------|----------|----------|
| 1 | `presences/page.tsx` | Page unique sans Tabs Pointage/Historique/Stats | 🟠 |
| 2 | `presences/page.tsx` | Pas de Breadcrumb | 🟠 |
| 3 | `attendance-manager.tsx` | Pas de filtre par date sur la vue principale | 🟡 |
| 4 | — | Pas de vue historique des présences | 🟠 |
| 5 | — | Pas de statistiques de présences | 🟡 |

---

## Parent task: Refonte complète section Présences

**Status:** DONE
**Depends on:** Task 19 (TASK-DS-01)

---

## Child tasks

### TASK-P-01: Breadcrumb + Tabs (Pointage · Historique · Statistiques)

**Status:** DONE
**Parent:** Refonte complète section Présences
**Depends on:** TASK-DS-01

Goal: ajouter Breadcrumb et navigation Tabs à la page présences.

Files to create/modify:
- `app/admin/presences/page.tsx`

Steps:
1. [x] Garder la page en RSC et utiliser les Tabs client partagés.
2. [x] Ajouter `<AdminBreadcrumb items={[{ label: "Administration", href: "/admin/dashboard" }, { label: "Présences" }]} />`
3. [x] Entourer avec `<Tabs defaultValue="pointage">` :
   - `<TabsTrigger value="pointage">` Pointage du jour (icon `CalendarCheck`)
   - `<TabsTrigger value="historique">` Historique (icon `History`)
   - `<TabsTrigger value="statistiques">` Statistiques (icon `BarChart3`)
4. [x] Tab "pointage" : contenu actuel `<AttendanceManager>`
5. [x] Tab "historique" : vue historique dans `<AttendanceManager>`
6. [x] Tab "statistiques" : vue statistiques dans `<AttendanceManager>`
7. [x] Appliquer `.glass-sm` sur `<TabsList>`

Note: `AttendanceManager` nécessite des données Prisma (server) — envisager de passer les données comme props depuis le RSC parent, ou de créer un hook TanStack Query pour le chargement client du tab Historique.

Acceptance criteria:
- [x] Breadcrumb visible : Administration > Présences
- [x] 3 Tabs fonctionnels
- [x] Tab Pointage : `AttendanceManager` affiché (données du jour)
- [x] `pnpm typecheck` PASS

---

### TASK-P-02: Tab Historique des présences

**Status:** DONE
**Parent:** Refonte complète section Présences
**Depends on:** TASK-P-01

Goal: créer la vue historique des présences avec filtres date et bénévole.

Files to create/modify:
- `src/features/presence/presentation/tabs/presence-history-tab.tsx` (nouveau)
- `src/features/presence/presence.action.ts` (si action listPresences manquante)

Steps:
1. [x] Créer la vue Historique client dans `AttendanceManager`.
2. [x] Utiliser la période sélectionnée (jour, semaine ou mois) comme filtre date.
3. [x] Ajouter un sélecteur bénévole.
4. [x] Afficher les présences dans `<DataTable>` avec les colonnes prévues.
5. [x] Conserver la pagination intégrée à la DataTable partagée.
6. [x] Utiliser TanStack Query avec les bornes de date et l’identifiant bénévole.

Acceptance criteria:
- [x] Filtre par date fonctionnel
- [x] DataTable présences avec toutes les colonnes
- [x] Pagination fonctionnelle
- [x] `pnpm typecheck` PASS

---

### TASK-P-03: Tab Statistiques présences

**Status:** DONE
**Parent:** Refonte complète section Présences
**Depends on:** TASK-P-01

Goal: afficher des KPIs et un graphique de présences sur 30 jours.

Files to create/modify:
- `src/features/presence/presentation/tabs/presence-stats-tab.tsx` (nouveau)

Steps:
1. [x] 3 `<Card>` KPI :
   - "Présents aujourd'hui" : valeur depuis `metrics.presentToday` (déjà dans `getAdminStatistics`)
   - "Moyenne cette semaine" : calculé côté serveur ou query
   - "Bénévole le plus assidu ce mois" : top 1 par count présences
2. [x] Graphique présences/jour sur 30 jours avec mini barres CSS relatives au maximum.
3. [x] `<Badge>` tendance : moyenne comparée à la semaine précédente.
4. [x] Appliquer `.glass-sm` sur les Cards

Acceptance criteria:
- [x] 3 KPI Cards visibles avec données réelles
- [x] Visualisation 30 jours lisible
- [x] `pnpm typecheck` PASS

---

## Verification

- TypeScript: `pnpm typecheck` PASS
- Lint ciblé: `pnpm exec eslint app/layout.tsx src/components/ui/tabs.tsx src/features/excel/import-export-buttons.tsx src/features/presence/presence.schema.ts src/features/presence/presence.action.ts src/features/presence/presentation/use-attendance.ts src/features/presence/presentation/attendance-manager.tsx src/features/presence/presentation/attendance-stats-panel.tsx src/features/presence/presentation/_components/attendance-table.tsx src/features/presence/presentation/_components/attendance-filters.tsx` PASS

## Avancement 2026-10-05

- `app/admin/presences/page.tsx` : breadcrumb, tabs Pointage / Historique / Statistiques et layout glass.
- `AttendanceManager` : Pointage conserve le formulaire; Historique expose période, filtres date/bénévole et table paginée; Statistiques affiche des indicateurs de date, semaine, mois et un graphique sur 30 jours.
- Responsive : les listes d’onglets s’étendent sur plusieurs lignes sans chevauchement.
- TypeScript : `pnpm typecheck` — PASS.
- Lint ciblé des fichiers touchés — PASS.
- Le navigateur automatisé n’a pas été utilisé pour la preuve, conformément à la consigne utilisateur.

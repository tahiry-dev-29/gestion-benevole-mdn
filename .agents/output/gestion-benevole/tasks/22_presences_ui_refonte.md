Status: IN_PROGRESS

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
1. [ ] Convertir en Client Component (`"use client"`) si nécessaire pour les Tabs — ou garder RSC et utiliser un wrapper client
2. [ ] Ajouter `<AdminBreadcrumb items={[{ label: "Administration", href: "/admin/dashboard" }, { label: "Présences" }]} />`
3. [ ] Entourer avec `<Tabs defaultValue="pointage">` :
   - `<TabsTrigger value="pointage">` Pointage du jour (icon `CalendarCheck`)
   - `<TabsTrigger value="historique">` Historique (icon `History`)
   - `<TabsTrigger value="statistiques">` Statistiques (icon `BarChart3`)
4. [ ] Tab "pointage" : contenu actuel `<AttendanceManager>`
5. [ ] Tab "historique" : `<PresenceHistoryTab />`
6. [ ] Tab "statistiques" : `<PresenceStatsTab />`
7. [ ] Appliquer `.glass-sm` sur `<TabsList>`

Note: `AttendanceManager` nécessite des données Prisma (server) — envisager de passer les données comme props depuis le RSC parent, ou de créer un hook TanStack Query pour le chargement client du tab Historique.

Acceptance criteria:
- [ ] Breadcrumb visible : Administration > Présences
- [ ] 3 Tabs fonctionnels
- [ ] Tab Pointage : `AttendanceManager` affiché (données du jour)
- [ ] `pnpm typecheck` PASS

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
1. [ ] Créer `PresenceHistoryTab` client component
2. [ ] Ajouter filtre date (input `type="date"` ou 2 inputs pour plage)
3. [ ] Ajouter filtre bénévole (Select ou DropdownMenu)
4. [ ] Afficher résultats dans `<DataTable>` avec colonnes : Bénévole · Date · Heure arrivée · Heure départ · Table · Place · Durée
5. [ ] Pagination TanStack Table intégrée
6. [ ] State: TanStack Query avec params (dateFrom, dateTo, volunteerId, page)

Acceptance criteria:
- [ ] Filtre par date fonctionnel
- [ ] DataTable présences avec toutes les colonnes
- [ ] Pagination fonctionnelle
- [ ] `pnpm typecheck` PASS

---

### TASK-P-03: Tab Statistiques présences

**Status:** TODO
**Parent:** Refonte complète section Présences
**Depends on:** TASK-P-01

Goal: afficher des KPIs et un graphique de présences sur 30 jours.

Files to create/modify:
- `src/features/presence/presentation/tabs/presence-stats-tab.tsx` (nouveau)

Steps:
1. [ ] 3 `<Card>` KPI :
   - "Présents aujourd'hui" : valeur depuis `metrics.presentToday` (déjà dans `getAdminStatistics`)
   - "Moyenne cette semaine" : calculé côté serveur ou query
   - "Bénévole le plus assidu ce mois" : top 1 par count présences
2. [ ] Graphique présences/jour sur 30 jours : utiliser `<Progress>` shadcn par jour (barre relative au max) ou mini barres CSS
3. [ ] `<Badge>` tendance : ↑ par rapport à la semaine dernière
4. [ ] Appliquer `.glass` sur les Cards

Acceptance criteria:
- [ ] 3 KPI Cards visibles avec données réelles
- [ ] Visualisation 30 jours lisible
- [ ] `pnpm typecheck` PASS

---

## Verification

- TypeScript: `pnpm typecheck` PASS
- Lint: `pnpm lint` 0 erreur
- Visual: screenshots Chromium pour `/admin/presences` — desktop + mobile, les 3 tabs

## Avancement 2026-10-05

- `app/admin/presences/page.tsx` : breadcrumb, tabs Pointage / Historique / Statistiques et layout glass.
- `AttendanceManager` : mode pointage conserve le formulaire; Historique expose période, filtres et table; Statistiques affiche des indicateurs calculés depuis les résultats chargés.
- TypeScript : `pnpm typecheck` — PASS.
- Vérification visuelle Chromium non exécutée; revue visuelle interactive restante.

Status: IN_PROGRESS

# Feature tasks: Refonte UI/UX — Activités, Crédits, Observations, Partages

## Plan

Plan: plan-002
Plan file: ../plans/plan-002_design_system_ui_refonte.md
Feature: Sections Activités · Crédits · Observations · Partages

## Feature goal

Ajouter Breadcrumb, consolider les filtres en DropdownMenu, moderniser les colonnes actions en DropdownMenu dans toutes ces sections.

---

## Problèmes identifiés (audit 2026-10-05)

| Section | Fichier | Problème | Sévérité |
|---------|---------|----------|----------|
| Activités | `activite-toolbar.tsx` | Filtres non consolidés | 🟡 |
| Activités | `activite-columns.tsx` | Actions simples sans DropdownMenu | 🟡 |
| Activités | `activites/page.tsx` | Pas de Breadcrumb | 🟠 |
| Crédits | `credit-filters.tsx` | Filtres éparpillés | 🟡 |
| Crédits | `credit-columns.tsx` | Actions sans DropdownMenu | 🟡 |
| Crédits | `credits/page.tsx` | Pas de Breadcrumb ni Tabs analytiques | 🟠 |
| Observations | `observation-filters.tsx` | Filtres non consolidés | 🟡 |
| Observations | `observation-columns.tsx` | Actions sans DropdownMenu | 🟡 |
| Observations | `observations/page.tsx` | Pas de Breadcrumb, pas de Tabs Mes obs/Toutes | 🟠 |
| Partages | `partage-toolbar.tsx` | Pas de DropdownMenu filter | 🟡 |
| Partages | `partage-columns.tsx` | Actions sans DropdownMenu | 🟡 |
| Partages | `partages/page.tsx` | Pas de Breadcrumb | 🟠 |

---

## Parent task: Refonte sections secondaires

**Status:** IN_PROGRESS
**Depends on:** Task 19 (TASK-DS-01)

---

## ACTIVITÉS

### TASK-A-01: Breadcrumb + DropdownMenu filter — Activités

**Status:** DONE
**Parent:** Refonte sections secondaires
**Depends on:** TASK-DS-01, TASK-DS-03

Goal: ajouter Breadcrumb et consolider les filtres dans la section Activités.

Files to create/modify:
- `app/admin/activites/page.tsx`
- `src/features/activites/presentation/activite-toolbar.tsx`

Steps:
1. [x] `activites/page.tsx` : ajouter `<AdminBreadcrumb items={[{ label: "Administration", href: "/admin/dashboard" }, { label: "Activités" }]} />`
2. [x] `activite-toolbar.tsx` : identifier les filtres actuels (statut, type, date?) et les regrouper dans 1 `<DropdownMenu>` avec badge count + reset
3. [x] Appliquer `.glass-sm` sur le toolbar container

Acceptance criteria:
- [x] Breadcrumb : Administration > Activités
- [x] 1 bouton Filtres avec DropdownMenu
- [x] `pnpm typecheck` PASS

---

### TASK-A-02: DropdownMenu actions colonnes — Activités

**Status:** DONE
**Parent:** Refonte sections secondaires
**Depends on:** None

Goal: remplacer les actions simples par des DropdownMenu dans la DataTable activités.

Files to create/modify:
- `src/features/activites/presentation/activite-columns.tsx`

Steps:
1. [x] Identifier la colonne actions actuelle
2. [x] Remplacer par `<DropdownMenu>` avec : Voir · Modifier · Supprimer (destructif)
3. [x] `onDelete` passé depuis `ActivitesTable` vers `createActiviteColumns({ onDelete })`

Acceptance criteria:
- [x] DropdownMenu actions fonctionnel sur chaque ligne
- [x] `pnpm typecheck` PASS

---

## CRÉDITS

### TASK-C-01: Breadcrumb + Tabs (Liste · Analytiques) — Crédits

**Status:** DONE
**Parent:** Refonte sections secondaires
**Depends on:** TASK-DS-01, TASK-DS-03

Goal: ajouter Breadcrumb et onglet Analytiques dans la section Crédits.

Files to create/modify:
- `app/admin/credits/page.tsx`
- `src/features/credit/tabs/credits-analytics-tab.tsx` (nouveau)

Steps:
1. [x] `credits/page.tsx` : ajouter `<AdminBreadcrumb>` + entourer avec `<Tabs>` :
   - Tab "liste" : `<CreditsList>`
   - Tab "analytiques" : `<CreditsAnalyticsTab>`
2. [x] `CreditsAnalyticsTab` : 3 Cards KPI (Total crédits, Moyenne/bénévole, Bénévole le mieux crédité) + tableau top 5 bénévoles par cumul

Acceptance criteria:
- [x] Breadcrumb : Administration > Crédits
- [x] 2 Tabs : Liste + Analytiques
- [x] Cards KPI dans Analytiques
- [x] `pnpm typecheck` PASS

---

### TASK-C-02: DropdownMenu filter + actions colonnes — Crédits

**Status:** IN_PROGRESS
**Parent:** Refonte sections secondaires
**Depends on:** None

Files to create/modify:
- `src/features/credit/_components/credit-filters.tsx`
- `src/features/credit/_components/credit-columns.tsx`

Steps:
1. [x] `credit-filters.tsx` : consolider les filtres (bénévole, mois, type?) en 1 `<DropdownMenu>`
2. [ ] `credit-columns.tsx` : `<DropdownMenu>` actif avec suppression. Modifier reste ouvert : aucune action de modification n’existe côté domaine/API, et le plan exclut les mutations métier.

Acceptance criteria:
- [x] 1 bouton Filtres dans CreditsList
- [x] DropdownMenu actions dans chaque ligne
- [x] `pnpm typecheck` PASS

---

## OBSERVATIONS

### TASK-O-01: Breadcrumb + Tabs (Mes obs · Toutes) + DropdownMenu filter

**Status:** DONE
**Parent:** Refonte sections secondaires
**Depends on:** TASK-DS-01, TASK-DS-03

Files to create/modify:
- `app/admin/observations/page.tsx`
- `src/features/observation/_components/observation-filters.tsx`

Steps:
1. [x] Ajouter `<AdminBreadcrumb items={[..., { label: "Observations" }]} />`
2. [x] Entourer avec `<Tabs>` :
   - "mes-observations" : observations filtrées par `currentUserId`
   - "toutes" : toutes les observations (si isAdmin)
3. [x] `observation-filters.tsx` : consolider en 1 `<DropdownMenu>` (bénévole, période, type?)

Acceptance criteria:
- [x] Breadcrumb présent
- [x] Tabs Mes observations / Toutes (conditionnellement visible selon le rôle)
- [x] 1 bouton Filtres
- [x] `pnpm typecheck` PASS

---

### TASK-O-02: DropdownMenu actions colonnes — Observations

**Status:** DONE
**Parent:** Refonte sections secondaires
**Depends on:** None

Files to create/modify:
- `src/features/observation/_components/observation-columns.tsx`

Steps:
1. [x] Remplacer actions simples par `<DropdownMenu>` : Voir · Modifier · Supprimer

Acceptance criteria:
- [x] DropdownMenu actions fonctionnel
- [x] `pnpm typecheck` PASS

---

## PARTAGES

### TASK-T-01: Breadcrumb + DropdownMenu filter — Partages

**Status:** DONE
**Parent:** Refonte sections secondaires
**Depends on:** TASK-DS-01, TASK-DS-03

Files to create/modify:
- `app/admin/partages/page.tsx`
- `src/features/partages/presentation/partage-toolbar.tsx`

Steps:
1. [x] Ajouter `<AdminBreadcrumb items={[..., { label: "Partages" }]} />`
2. [x] `partage-toolbar.tsx` : consolider filtres en 1 `<DropdownMenu>`

Acceptance criteria:
- [x] Breadcrumb présent
- [x] 1 bouton Filtres
- [x] `pnpm typecheck` PASS

---

### TASK-T-02: DropdownMenu actions colonnes — Partages

**Status:** DONE
**Parent:** Refonte sections secondaires

Files to create/modify:
- `src/features/partages/presentation/partage-columns.tsx`

Steps:
1. [x] Remplacer actions par `<DropdownMenu>` : Modifier · Supprimer

Acceptance criteria:
- [x] DropdownMenu actions fonctionnel
- [x] `pnpm typecheck` PASS

---

## Verification

- TypeScript: `pnpm typecheck` PASS
- Lint: `pnpm lint` 0 erreur
- TypeScript: `pnpm typecheck` PASS
- Visuel: non exécuté sur cette passe

## Avancement 2026-10-05

- Breadcrumbs ajoutés aux pages Activités, Crédits, Observations et Partages.
- Filtres Activités, Crédits, Observations et Partages regroupés dans un menu compact avec remise à zéro.
- Crédits : navigation Liste / Analytiques et résumé basé sur le cumul serveur existant.
- Actions Activités et Partages étaient déjà en DropdownMenu; actions Crédits et Observations regroupées à leur tour.
- Dialogs observations habillés avec `.glass-xl`.
- TypeScript : `pnpm typecheck` — PASS.
- Build : `pnpm build` — PASS.
- Onglets Mes observations / Toutes ajoutés (admin voit les deux; Mes observations filtre par auteur).
- Actions Activités et Partages déjà accessibles via leurs menus dédiés; actions Crédits/Observations regroupées également.
- Visuel automatisé omis conformément à la consigne utilisateur; le code est contrôlé par lint ciblé et typecheck.

- Revue UI : analytics Crédits présente désormais le meilleur bénévole et respecte le filtre actif; Observations propose un aperçu Sheet complet.

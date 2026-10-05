Status: IN_PROGRESS

# Feature tasks: Refonte UI/UX — Observations & Partages (détail)

## Plan

Plan: plan-002
Plan file: ../plans/plan-002_design_system_ui_refonte.md
Feature: Observations · Partages — détail complet

## Note

Ce fichier complète `23_activites_credits_ui.md` avec des détails supplémentaires sur les composants Observations et Partages, notamment les Dialog de création/édition existants et leur mise à niveau.

---

## OBSERVATIONS — Détail

### TASK-O-03: Moderniser les Dialog Observations

**Status:** TODO
**Parent:** Refonte sections secondaires
**Depends on:** None

Goal: vérifier et améliorer les Dialog de création/édition observation existants.

Files to create/modify:
- `src/features/observation/_components/create-observation-dialog.tsx`
- `src/features/observation/_components/edit-observation-dialog.tsx`

Steps:
1. [ ] Auditer `create-observation-dialog.tsx` : structure, champs, validations
2. [ ] Vérifier que le Dialog utilise `@base-ui/react/dialog` (cohérent avec le reste)
3. [ ] Ajouter un header avec `<ShieldAlert>` icon + titre stylisé
4. [ ] Appliquer `.glass-xl` sur le contenu du dialog si possible
5. [ ] Même chose pour `edit-observation-dialog.tsx`
6. [ ] `period-selects.tsx` : vérifier que les selects utilisent `@base-ui/react/select`

Acceptance criteria:
- [ ] Dialogs visuellement cohérents avec le design system
- [ ] `.glass-xl` appliqué sur le panel dialog
- [ ] `pnpm typecheck` PASS

---

## PARTAGES — Détail

### TASK-T-03: Fiche Partage + page détail

**Status:** TODO
**Parent:** Refonte sections secondaires
**Depends on:** None

Goal: si une page de détail partage existe, y ajouter Breadcrumb + Avatar auteur.

Files to create/modify:
- `app/admin/partages/` (vérifier s'il y a un `[id]/page.tsx`)

Steps:
1. [ ] Vérifier si `/admin/partages/[id]` existe
2. [ ] Si oui : ajouter Breadcrumb + header auteur avec Avatar
3. [ ] Si non : créer une vue détail dans un `Sheet` latéral (depuis la DataTable — clic sur titre → Sheet avec contenu complet)

Acceptance criteria:
- [ ] Vue détail accessible depuis la DataTable
- [ ] Breadcrumb si page dédiée
- [ ] `pnpm typecheck` PASS

---

## TEMOIGNAGES (bonus)

### TASK-TEM-01: Breadcrumb + actions DropdownMenu — Témoignages

**Status:** TODO
**Parent:** Refonte sections secondaires

Files to create/modify:
- `app/admin/temoignages/page.tsx`
- Composants témoignages existants

Steps:
1. [ ] Ajouter `<AdminBreadcrumb items={[..., { label: "Témoignages" }]} />`
2. [ ] Si table de témoignages : actions → `<DropdownMenu>` : Approuver · Rejeter · Supprimer
3. [ ] `Badge` de statut : En attente / Approuvé / Rejeté

Acceptance criteria:
- [ ] Breadcrumb présent
- [ ] Actions via DropdownMenu
- [ ] `pnpm typecheck` PASS

---

## PLACES (bonus)

### TASK-PL-01: Breadcrumb + amélioration UI Places

**Status:** TODO
**Parent:** Refonte sections secondaires

Files to create/modify:
- `app/admin/places/page.tsx`
- `src/features/places/presentation/places-manager.tsx`

Steps:
1. [ ] Ajouter `<AdminBreadcrumb items={[..., { label: "Tables & Places" }]} />`
2. [ ] Appliquer `.glass` sur les cards de tables
3. [ ] `rename-table-dialog.tsx` : vérifier cohérence avec design system

Acceptance criteria:
- [ ] Breadcrumb présent
- [ ] Cards tables avec effet glass
- [ ] `pnpm typecheck` PASS

---

## SPRINTS (bonus)

### TASK-SP-01: Breadcrumb page Sprints

**Status:** TODO

Files to create/modify:
- `app/admin/sprints/page.tsx`

Steps:
1. [ ] Ajouter `<AdminBreadcrumb items={[..., { label: "Sprints" }]} />`
2. [ ] Vérifier l'UI existante et appliquer `.glass` si pertinent

---

## PARAMÈTRES (bonus)

### TASK-PARAM-01: Breadcrumb + Tabs Paramètres

**Status:** TODO

Files to create/modify:
- `app/admin/parametres/page.tsx`

Steps:
1. [ ] Ajouter `<AdminBreadcrumb items={[..., { label: "Paramètres" }]} />`
2. [ ] Si plusieurs sections de paramètres : organiser en `<Tabs>`

---

## Verification

- TypeScript: `pnpm typecheck` PASS
- Lint: `pnpm lint` 0 erreur
- Visual: screenshots Chromium pour chaque page modifiée

## Avancement 2026-10-05

- Observations : dialogs habillés glass; onglets Mes observations / Toutes présents dans la tâche 23.
- Partages : aperçu complet en Sheet avec avatar, auteur, date et contenu.
- Témoignages, Places, Sprints et Paramètres : breadcrumbs ajoutés; cards glass ajoutées sur Places/Sprints/Paramètres; Dialog de renommage en glass.
- TypeScript : `pnpm typecheck` — PASS après l’ajout des actions Témoignages.
- Lint ciblé : PASS; lint complet — PASS sans erreur (warnings existants).
- Build : `pnpm build` — PASS.
- Menu Témoignages : Publier / Rejeter / Supprimer via DropdownMenu, avec confirmation avant suppression.
- À compléter : revue visuelle des pages bonus.

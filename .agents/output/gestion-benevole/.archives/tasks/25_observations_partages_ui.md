Status: DONE

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

**Status:** DONE
**Parent:** Refonte sections secondaires
**Depends on:** None

Goal: vérifier et améliorer les Dialog de création/édition observation existants.

Files to create/modify:
- `src/features/observation/_components/create-observation-dialog.tsx`
- `src/features/observation/_components/edit-observation-dialog.tsx`

Steps:
1. [x] Auditer `create-observation-dialog.tsx` : structure, champs, validations
2. [x] Réutiliser le Dialog partagé du design system
3. [x] Ajouter un header avec `<ShieldAlert>` icon + titre stylisé
4. [x] Appliquer `.glass-xl` sur le contenu du dialog
5. [x] Appliquer le même traitement à `edit-observation-dialog.tsx`
6. [x] `period-selects.tsx` réutilise les Select partagés du design system

Acceptance criteria:
- [x] Dialogs visuellement cohérents avec le design system
- [x] `.glass-xl` appliqué sur le panel dialog
- [x] `pnpm typecheck` PASS

---

## PARTAGES — Détail

### TASK-T-03: Fiche Partage + page détail

**Status:** DONE
**Parent:** Refonte sections secondaires
**Depends on:** None

Goal: si une page de détail partage existe, y ajouter Breadcrumb + Avatar auteur.

Files to create/modify:
- `app/admin/partages/` (vérifier s'il y a un `[id]/page.tsx`)

Steps:
1. [x] Vérifier si `/admin/partages/[id]` existe
2. [x] Aucune page détail dédiée n'existe
3. [x] Vue détail dans un `Sheet` latéral depuis la table, avec contenu complet et auteur

Acceptance criteria:
- [x] Vue détail accessible depuis la DataTable
- [x] Breadcrumb non applicable à la vue Sheet
- [x] `pnpm typecheck` PASS

---

## TEMOIGNAGES (bonus)

### TASK-TEM-01: Breadcrumb + actions DropdownMenu — Témoignages

**Status:** DONE
**Parent:** Refonte sections secondaires

Files to create/modify:
- `app/admin/temoignages/page.tsx`
- Composants témoignages existants

Steps:
1. [x] Breadcrumb présent
2. [x] Actions `DropdownMenu` : publier, rejeter, supprimer avec confirmation
3. [x] Badges de statut présents

Acceptance criteria:
- [x] Breadcrumb présent
- [x] Actions via DropdownMenu
- [x] `pnpm typecheck` PASS

---

## PLACES (bonus)

### TASK-PL-01: Breadcrumb + amélioration UI Places

**Status:** DONE
**Parent:** Refonte sections secondaires

Files to create/modify:
- `app/admin/places/page.tsx`
- `src/features/places/presentation/places-manager.tsx`

Steps:
1. [x] Breadcrumb présent
2. [x] Cards de tables avec effet glass
3. [x] Dialog de renommage cohérent avec le design system

Acceptance criteria:
- [x] Breadcrumb présent
- [x] Cards tables avec effet glass
- [x] `pnpm typecheck` PASS

---

## SPRINTS (bonus)

### TASK-SP-01: Breadcrumb page Sprints

**Status:** DONE

Files to create/modify:
- `app/admin/sprints/page.tsx`

Steps:
1. [x] Breadcrumb présent
2. [x] UI existante conservée avec cards glass

---

## PARAMÈTRES (bonus)

### TASK-PARAM-01: Breadcrumb + Tabs Paramètres

**Status:** DONE

Files to create/modify:
- `app/admin/parametres/page.tsx`

Steps:
1. [x] Breadcrumb présent
2. [x] Sections Général, Présences et Notifications organisées en `<Tabs>`

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
- Vérifications de cette reprise : `pnpm typecheck` PASS; lint ciblé PASS sans erreur (un avertissement connu React Hook Form `watch`). Pas de navigation navigateur ni de tests longs, selon la demande.
- Les primitives UI utilisées sont les composants partagés de l'application; aucun composant ne contourne le design system.

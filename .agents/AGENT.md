# AGENT.md — gestion-benevole

> Fichier d'entrée pour tous les agents thr-* opérant sur ce projet.
> Créé le 2026-10-05 par thr-memory -check (gap structurel corrigé).

## Projet

**Nom** : Gestion Bénévole — Maison du Numérique  
**Type** : Application web PWA (Next.js App Router)  
**Équipe** : @tahiry-dev-29 (Lead), @flavienrandria81, @HunjanRakotoarison, @rasoarimanana71-maker

## Fichiers de contexte obligatoires (lire avant toute tâche)

| Priorité | Fichier | Contenu |
|----------|---------|---------|
| 1 | [`.agents/rules/stack.md`](./rules/stack.md) | Stack, conventions de code, contraintes fortes |
| 2 | [`.agents/output/gestion-benevole/archi.md`](./output/gestion-benevole/archi.md) | Modèle de données, RBAC, routes, design system |
| 3 | [`.agents/memory/decisions.md`](./memory/decisions.md) | Journal append-only des décisions |
| 4 | [`.agents/output/gestion-benevole/tasks/TASK-STATUS.md`](./output/gestion-benevole/tasks/TASK-STATUS.md) | Statut de toutes les tâches (canonique) |

## Plans actifs

| Plan | Fichier | Périmètre |
|------|---------|-----------|
| plan-001 | [`plans/plan-001_sprints_00_08_functional_ux.md`](./output/gestion-benevole/plans/plan-001_sprints_00_08_functional_ux.md) | Remise en état fonctionnelle sprints 0–8 |
| plan-002 | [`plans/plan-002_design_system_ui_refonte.md`](./output/gestion-benevole/plans/plan-002_design_system_ui_refonte.md) | Refonte Design System Glass Liquid Blue + UI/UX toutes pages |

## Tâches en cours (non DONE)

| Tâche | Plan | Priorité | Prochain point |
|-------|------|----------|---------------|
| 12 — Gestion USER | plan-001 | 🔴 | Rapprochement PRD/champs, cas rejet |
| 15 — Crédits/observations | plan-001 | 🟠 | Bornes/fuseau, filtres Query |
| 17 — Témoignages/PWA | plan-001 | 🟠 | Appareils réels (S9) |
| 18 — E2E sprints 0–8 | plan-001 | 🟡 | Dépend 12, 15, 17 |
| 19 — Design system prérequis | plan-002 | 🔴 | `npx shadcn@latest add tabs breadcrumb popover` |
| 20 — Users UI refonte | plan-002 | 🔴 | Après tâche 19 |
| 21 — Bénévoles UI refonte | plan-002 | 🔴 | Après tâche 19 |
| 22 — Présences UI refonte | plan-002 | 🟠 | Après tâche 19 |
| 23 — Activités/Crédits/Obs/Partages UI | plan-002 | 🟠 | Après tâche 19 |
| 24 — Dashboard/Statistiques UI | plan-002 | 🟡 | Après tâche 19 |
| 25 — Observations/Partages/etc UI | plan-002 | 🟡 | Après tâche 19 |

## Conventions agent

- **Lire stack.md en premier** avant toute modification de code
- **Vérification en sortie** : `pnpm typecheck` + `pnpm lint` + `pnpm build`
- **Commits** : via `thr-commit` — conventionnel, un commit par feature
- **Pas de migration DB** sans isolation confirmée de la cible
- **Primitifs UI** : `@base-ui/react` pour Dialog/Select/Badge — ne pas substituer par Radix
- **Design tokens** : couleurs sémantiques uniquement (`bg-primary`, `text-muted-foreground`)
- **Pas de `any`** ni `@ts-ignore` ni CSS custom

## Design system actif (plan-002)

Classes glass disponibles dans `app/globals.css` :
`.glass` · `.glass-sm` · `.glass-lg` · `.glass-xl` · `.glass-gloss` · `.glass-glow` · `.fluid-bg` · `.glass-noise`

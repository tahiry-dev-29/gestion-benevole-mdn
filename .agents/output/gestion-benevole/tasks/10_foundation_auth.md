Status: TODO

# Feature tasks: Socle interactif, navigation et authentification (S0–S1)

## Plan

Plan: plan-001
Plan file: ../plans/plan-001_sprints_00_08_functional_ux.md
Feature: Fondations app, navigation et RBAC

## Feature goal

Chaque rôle accède uniquement aux routes/actions permises, les entrées de navigation mènent à des pages réelles et les écrans client dynamiques suivent le contrat TanStack Query du projet.

## Parent task: Socle fiable pour les domaines métier

**Status:** TODO
**Depends on:** None

Goal: établir un socle local exploitable, auth, Query et UI partagé dont les autres features peuvent se servir.

Files to create/modify:
- `app/layout.tsx`, `app/admin/layout.tsx` — providers et layouts existants à vérifier puis ajuster.
- `proxy.ts`, `src/lib/auth-options.ts`, `src/lib/rbac.ts` — accès par rôle.
- `src/features/admin/admin.data.ts`, `src/features/admin/query-provider.tsx` — navigation et client Query.
- `src/components/shared/`, `src/components/ui/` — primitives/tableaux partagés existants à étendre.
- `src/lib/env.ts`, `prisma/`, `next.config.ts`, manifest/SW et workflows CI existants — configuration, seed et PWA de base.

Steps:
1. [ ] cartographier routes, actions protégées et diffs locaux avant édition; vérifier config, migration/seed locale, CI et PWA de base.
2. [ ] établir TanStack Query comme frontière des reads/mutations client; conserver Server Components/repositories pour SSR et Query mutations pour les appels binaires.
3. [ ] aligner navigation et `canAccessRoute`/`canCreate` sur les rôles; les liens doivent pointer vers une page existante.
4. [ ] auditer l'interface avec `thr-design`, corriger les éléments partagés qui gênent toutes les pages.

Acceptance criteria:
- [ ] `USER` ne peut ouvrir de session ni appeler une mutation admin protégée.
- [ ] chaque lien actif de navigation mène à une page existante, et les pages hors droits sont refusées côté serveur.
- [ ] le provider Query et ses options permettent les états loading/error/invalidation sans doubles requêtes inutiles.
- [ ] les tests RBAC couvrent toutes les routes métier annoncées et chaque rôle.
- [ ] Prisma/seed et PWA de base ont une preuve locale reproductible; CI existante est vérifiée ou absence documentée; `/admin/sprints` fonctionne si conservée.

## Child tasks

### Task 10.1: Authentification et accès cohérents

**Status:** TODO
**Parent:** Socle fiable pour les domaines métier
**Depends on:** None

Goal: prouver les règles login et permissions par acteur, côté UI et serveur.

Files to create/modify:
- `src/lib/rbac.ts`, `proxy.ts`, `src/lib/auth-options.ts`, tests existants.

Steps:
1. [ ] valider le refus de `USER`, la matrice routes×rôles et la matrice de création.
2. [ ] vérifier les Server Actions/Route Handlers contre les accès directs interdits.

Acceptance criteria:
- [ ] une tentative `USER` ne crée pas de session; Volunteer Management respecte `canCreate` même si un rôle forgé est soumis.

### Task 10.2: Navigation et accès aux pages

**Status:** TODO
**Parent:** Socle fiable pour les domaines métier
**Depends on:** Task 10.1 — la navigation reflète l'accès serveur établi.

Goal: enlever les entrées mortes et rendre les destinations attendues accessibles.

Files to create/modify:
- `src/features/admin/admin.data.ts`, pages `app/admin/**/page.tsx` concernées.

Steps:
1. [ ] comparer chaque URL de navigation avec l'arborescence réelle et les tâches planifiées.
2. [ ] pointer chaque entrée vers une page déjà fonctionnelle; garder le pointage existant jusqu'à la livraison de la route canonique de Task 13.2.

Acceptance criteria:
- [ ] aucun lien visible pour un rôle ne retourne 404; les URLs historiques ciblées continuent à servir ou redirigent clairement.

### Task 10.3: Socle local, seed, PWA et CI

**Status:** TODO
**Parent:** Socle fiable pour les domaines métier
**Depends on:** None

Goal: vérifier les éléments du Sprint 0 nécessaires au développement et à la livraison interne.

Files to create/modify:
- `src/lib/env.ts`, `prisma/schema.prisma`, `prisma/seed.ts`, `next.config.ts`, manifest/SW, workflows CI réellement présents, `app/admin/sprints/` si conservée.

Steps:
1. [ ] vérifier schéma/génération Prisma et exécuter la seed uniquement sur DB locale isolée.
2. [ ] démarrer l'app avec env documenté, vérifier manifest, icônes, SW/fallback par build et navigateur local.
3. [ ] vérifier le workflow CI et la cible d'hébergement dev/preview s'ils existent; s'ils sont absents, consigner les dépendances/accès requis avant toute création.
4. [ ] vérifier les permissions et la persistance du suivi Sprint si cette page fait partie du produit actif.

Acceptance criteria:
- [ ] setup local mène à une app utilisable avec seed reproductible et sans secret imprimé.
- [ ] manifest, ressources PWA et fallback sont servis en local; le comportement du SW est exercé dans un navigateur.
- [ ] CI est prouvée par son workflow; absence ou besoin de fournisseur externe est signalé sans simuler un déploiement.
- [ ] l'hébergement dev/preview existant est accessible ou les comptes/config manquants sont explicitement marqués comme dépendance.
- [ ] aucune base partagée/de production n'est migrée et aucun déploiement production n'est effectué.

## Verification

- Unit: tests Vitest RBAC et options Query existantes.
- Integration / API: accès direct sans session et par rôles pour routes/actions.
- Environment: schema/generate/seed locale isolée, CI et manifest/SW local.
- UI, accessibility, and responsive behavior: scan de navigation, focus et layouts communs.
- End-to-end / manual: connexion admin, bénévole et refus USER.

## Risks and rollback

Préserver les changements locaux et les décisions existantes; aucune migration de données dans cette tâche.

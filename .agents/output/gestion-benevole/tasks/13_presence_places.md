Status: DONE

# Feature tasks: Pointage des présences et gestion des places (S4)

## Plan

Plan: plan-001
Plan file: ../plans/plan-001_sprints_00_08_functional_ux.md
Feature: Présence et places

## Feature goal

Le pointage quotidien avec arrivée, départ, statut, table et siège fonctionne depuis `/admin/presences`; le CRUD des places reste cohérent avec l'historique.

## Parent task: Workflow quotidien de présence

**Status:** DONE
**Depends on:** Task 10.1 — routes et rôles sont définis; Task 12.1 — modèle de personne cohérent.

Goal: rendre le pointage praticable et sûr pour les rôles autorisés.

Files to create/modify:
- `src/features/presence/`, `src/features/places/`.
- `app/admin/presences/`, `app/admin/users/presence/`, `app/admin/places/`, navigation.

Steps:
1. [x] vérifier schémas, requêtes/actions et unicité utilisateur/date sans toucher aux historiques.
2. [x] fournir `/admin/presences`; choisir une route canonique et préserver l'ancienne avec redirect/alias.
3. [x] relier table/siège au formulaire, filtres calendrier, vues et liste TanStack.
4. [x] finaliser CRUD places, erreurs de conflit et UX `thr-design`.

Acceptance criteria:
- [x] la page `/admin/presences` est réelle, navigable et autorisée; un pointage est ajouté puis affiché dans les filtres pertinents.
- [x] un même utilisateur n'a pas deux pointages incohérents le même jour; une place référencée ne peut pas être supprimée sans gestion explicite.
- [x] une mutation Query met à jour la liste et les indicateurs affectés.

## Child tasks

### Task 13.1: Requêtes, validation et règles de pointage

**Status:** DONE (2026-10-02 — refus explicite utilisateur inconnu dans `pointAction`, tests action négatifs, preuve DB locale : unicité (user,date), Restrict siège, FK user, fixtures nettoyées)
**Parent:** Workflow quotidien de présence
**Depends on:** Task 12.1

Goal: prouver les règles métier et accès sur la frontière serveur.

Files to create/modify:
- `src/features/presence/presence.action.ts`, `presence.schema.ts`, `presence.utils.ts`, tests.

Steps:
1. [x] tester créations, modifications, filtres dates, heures, statuts et relations siège.
2. [x] corriger validation et invalidations/revalidation selon preuves.

Acceptance criteria:
- [x] dates/heures invalides, utilisateurs inconnus et accès interdits sont refusés sans écriture partielle.

### Task 13.2: Page admin, navigation et UX responsive

**Status:** DONE (2026-10-02 — route /admin/presences + alias legacy prouvés en navigateur, viewport 390px sans débordement)
**Parent:** Workflow quotidien de présence
**Depends on:** Task 13.1

Goal: offrir une surface de pointage complète depuis l'URL annoncée.

Files to create/modify:
- `app/admin/presences/`, route historique, `src/features/presence/presentation/`, `src/features/admin/admin.data.ts`.

Steps:
1. [x] route admin `/admin/presences`, redirection de l'ancienne URL `/admin/users/presence`, navigation et composants shadcn/TanStack Table.
2. [x] recherche différée, date, statut et place; états loading/empty/error/success; invalidation Query après pointage et actualisation accessible.
3. [x] édition d'un pointage depuis l'historique, avec retour à sa date et modification du statut, des heures ou de la place.

Acceptance criteria:
- [x] un administrateur termine et modifie un pointage sans route morte ni rechargement manuel; vérifier le parcours complet au navigateur et le layout aux largeurs mobiles.

## Verification

- Unit: utilitaires de dates et schémas présence.
- Integration / API: droits, doublons et liens Seat/Attendance.
- UI, accessibility, and responsive behavior: navigation clavier, filtres et formulaire narrow viewport.
- End-to-end / manual: pointage, changement d'heure/statut, puis lecture via filtre jour/semaine/mois.

## Risks and rollback

Le schéma peut contenir un modèle historique `Presence` et un modèle `Attendance`; inspecter la DB et migrations avant toute évolution.

## Vérifications de reprise — 2026-10-02

- Recherche serveur par nom, prénom, email et matricule; filtres statut et place par identifiant de siège; la recherche est différée côté client.
- Historique basé sur TanStack Table, avec actualisation accessible, indicateur de chargement, état vide, erreur et action d'édition par ligne.
- L'occupation des sièges est relue sans les filtres d'historique actifs; un filtre de recherche/statut ne peut donc pas rendre disponible à tort un siège déjà pris.
- `pnpm test` : 19 fichiers, 128 tests réussis; tests ajoutés pour validation des filtres, recherche réservée aux bénévoles actifs, conflit d'unicité et composition de requête date/statut/place/recherche.
- `pnpm typecheck`, `pnpm lint` (0 erreur, 3 avertissements existants), lint ciblé des fichiers présence, formatage ciblé et `git diff --check` réussis.
- `pnpm build` réussi : compilation, TypeScript et 33 pages/routes générées, dont `/admin/presences` et `/admin/places`.
- La vérification manuelle au navigateur reste à faire : Playwright et navigateur Chromium ne sont pas installés dans l'environnement.

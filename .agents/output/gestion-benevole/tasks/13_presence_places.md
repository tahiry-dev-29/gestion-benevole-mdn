Status: TODO

# Feature tasks: Pointage des présences et gestion des places (S4)

## Plan

Plan: plan-001
Plan file: ../plans/plan-001_sprints_00_08_functional_ux.md
Feature: Présence et places

## Feature goal

Le pointage quotidien avec arrivée, départ, statut, table et siège fonctionne depuis `/admin/presences`; le CRUD des places reste cohérent avec l'historique.

## Parent task: Workflow quotidien de présence

**Status:** TODO
**Depends on:** Task 10.1 — routes et rôles sont définis; Task 12.1 — modèle de personne cohérent.

Goal: rendre le pointage praticable et sûr pour les rôles autorisés.

Files to create/modify:
- `src/features/presence/`, `src/features/places/`.
- `app/admin/presences/`, `app/admin/users/presence/`, `app/admin/places/`, navigation.

Steps:
1. [ ] vérifier schémas, requêtes/actions et unicité utilisateur/date sans toucher aux historiques.
2. [ ] fournir `/admin/presences`; choisir une route canonique et préserver l'ancienne avec redirect/alias.
3. [ ] relier table/siège au formulaire, filtres calendrier, vues et liste TanStack.
4. [ ] finaliser CRUD places, erreurs de conflit et UX `thr-design`.

Acceptance criteria:
- [ ] la page `/admin/presences` est réelle, navigable et autorisée; un pointage est ajouté puis affiché dans les filtres pertinents.
- [ ] un même utilisateur n'a pas deux pointages incohérents le même jour; une place référencée ne peut pas être supprimée sans gestion explicite.
- [ ] une mutation Query met à jour la liste et les indicateurs affectés.

## Child tasks

### Task 13.1: Requêtes, validation et règles de pointage

**Status:** TODO
**Parent:** Workflow quotidien de présence
**Depends on:** Task 12.1

Goal: prouver les règles métier et accès sur la frontière serveur.

Files to create/modify:
- `src/features/presence/presence.action.ts`, `presence.schema.ts`, `presence.utils.ts`, tests.

Steps:
1. [ ] tester créations, modifications, filtres dates, heures, statuts et relations siège.
2. [ ] corriger validation et invalidations/revalidation selon preuves.

Acceptance criteria:
- [ ] dates/heures invalides, utilisateurs inconnus et accès interdits sont refusés sans écriture partielle.

### Task 13.2: Page admin, navigation et UX responsive

**Status:** TODO
**Parent:** Workflow quotidien de présence
**Depends on:** Task 13.1

Goal: offrir une surface de pointage complète depuis l'URL annoncée.

Files to create/modify:
- `app/admin/presences/`, route historique, `src/features/presence/presentation/`, `src/features/admin/admin.data.ts`.

Steps:
1. [ ] ajouter route/alias et sélectionner les composants shadcn/TanStack Table existants.
2. [ ] fournir recherche, date, statut, table/siège et états loading/empty/error/success.

Acceptance criteria:
- [ ] un administrateur termine un pointage sans route morte ni rechargement manuel; le layout reste exploitable sur mobile.

## Verification

- Unit: utilitaires de dates et schémas présence.
- Integration / API: droits, doublons et liens Seat/Attendance.
- UI, accessibility, and responsive behavior: navigation clavier, filtres et formulaire narrow viewport.
- End-to-end / manual: pointage, changement d'heure/statut, puis lecture via filtre jour/semaine/mois.

## Risks and rollback

Le schéma peut contenir un modèle historique `Presence` et un modèle `Attendance`; inspecter la DB et migrations avant toute évolution.

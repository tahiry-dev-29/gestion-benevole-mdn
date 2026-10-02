Status: TODO

# Feature tasks: Observations mensuelles et crédits (S6)

## Plan

Plan: plan-001
Plan file: ../plans/plan-001_sprints_00_08_functional_ux.md
Feature: Observations et crédits

## Feature goal

Les observations mensuelles et crédits/heures peuvent être gérés et consultés avec des filtres, calculs et droits exacts.

## Parent task: Parcours observation et crédit vérifiables

**Status:** TODO
**Depends on:** Task 10.1 — contrôles RBAC; Task 11.1 — personnes bénévoles disponibles.

Goal: aligner les règles de calcul, requêtes et interfaces avec les données réelles.

Files to create/modify:
- `src/features/observation/`, `app/admin/observations/`.
- `src/features/credit/`, `app/admin/credits/`, export crédit.

Steps:
1. [ ] inspecter le modèle, actions, calculs, filtres et invariants actuellement codés.
2. [ ] formaliser par tests les règles de cumul, mois/période, statut et fuseau avant les modifier.
3. [ ] aligner reads/mutations client sur hooks TanStack Query et listes sur TanStack Table.
4. [ ] auditer puis polir formulaires, filtres, totaux et responsive avec `thr-design`.

Acceptance criteria:
- [ ] totaux par bénévole et global égalent des exemples calculés à la main pour périodes limites.
- [ ] un changement/création met à jour les listes et totaux concernés via invalidation Query.
- [ ] erreurs, périodes vides, données absentes et permissions ont une réponse UI explicite.

## Child tasks

### Task 15.1: Règles temporelles et calculs métier

**Status:** TODO
**Parent:** Parcours observation et crédit vérifiables
**Depends on:** None

Goal: prouver les formules et bornes de périodes à partir des règles projet.

Files to create/modify:
- `src/features/credit/credit-cumul.action.ts`, schémas et tests crédit/observation existants.

Steps:
1. [ ] confronter les calculs et filtres au CDC/PRD et à la donnée persistée.
2. [ ] écrire des cas de référence pour mois vide, plusieurs mois et changements de calendrier.

Acceptance criteria:
- [ ] les calculs produits égalent les valeurs de référence indépendamment de l'ordre des lignes.

### Task 15.2: Queries, mutations et interfaces admin

**Status:** TODO
**Parent:** Parcours observation et crédit vérifiables
**Depends on:** Task 15.1

Goal: rendre les workflows clairs, réactifs et cohérents après mutation.

Files to create/modify:
- `src/features/observation/`, `src/features/credit/`, pages admin associées.

Steps:
1. [ ] brancher chaque read/mutation client sur TanStack Query, préserver validations Zod et autorisations serveur.
2. [ ] vérifier tableau, filtres mois/personne, formulaires, confirmations et export existant.

Acceptance criteria:
- [ ] création observation/crédit et filtrage par période affichent les bonnes lignes et totaux sans rechargement manuel.

## Verification

- Unit: calculs cumulés, périodes et schémas.
- Integration / API: persistance avec rôles autorisés/interdits.
- UI, accessibility, and responsive behavior: affichage chiffres/table sur petit écran, annonces de mutation.
- End-to-end / manual: créer observation et crédit, consulter total période, filtrer puis exporter.

## Risks and rollback

Ne pas changer une formule ambiguë avant de la confronter au CDC et à des exemples de données. Éviter de confondre comptes USER et bénévoles convertis.

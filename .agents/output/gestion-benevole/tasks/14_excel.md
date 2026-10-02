Status: IN_PROGRESS

# Feature tasks: Import et export Excel (S5)

## Plan

Plan: plan-001
Plan file: ../plans/plan-001_sprints_00_08_functional_ux.md
Feature: Import/export XLSX

## Feature goal

Les imports et exports des USER et présences correspondent aux données métier, sont réexécutables sans doublon involontaire et donnent un rapport clair.

## Parent task: Flux XLSX fiables

**Status:** TODO
**Depends on:** Task 12.1 — champs USER validés; Task 13.1 — modèle présence validé.

Goal: prouver les endpoints réels, mappings, autorisations et parcours de fichier.

Files to create/modify:
- `src/features/excel/`, `app/api/import/`, `app/api/export/`.
- `src/features/excel/import-export-buttons.tsx` et écrans USER/présence concernés.

Steps:
1. [ ] comparer les colonnes uniques import/export avec les propriétés PRD et schémas validés.
2. [ ] vérifier le parse XLSX, le rapport par numéro de ligne et les écritures idempotentes.
3. [ ] couvrir les téléchargements/envois binaires via mutations Query, états de progression et résultat accessible.
4. [ ] vérifier authz serveur et UX du résultat partiel/complet.

Acceptance criteria:
- [ ] round-trip d'un jeu de données connu ne crée pas de doublon et conserve les champs définis.
- [ ] fichier invalide/renommé est rejeté sans écriture et les erreurs identifient la ligne/raison.
- [ ] VOLUNTEER reçoit 403 pour import/export protégé.

## Child tasks

### Task 14.1: Mapping XLSX et validation ligne par ligne

**Status:** TODO
**Parent:** Flux XLSX fiables
**Depends on:** Task 12.1, Task 13.1

Goal: utiliser un mapping cohérent et signaler les lignes incorrectes.

Files to create/modify:
- `src/features/excel/excel.columns.ts`, `excel.reader.ts`, `excel.schema.ts`.

Steps:
1. [ ] vérifier que les colonnes d'export et l'aliasing d'import ont une seule définition.
2. [ ] simuler fichier valide, erreur de champ, fichier non-XLSX et champs optionnels.

Acceptance criteria:
- [ ] parse différencie les lignes valides et invalides avec numéros de lignes corrects.

### Task 14.2: API protégée et aller-retour métier

**Status:** TODO
**Parent:** Flux XLSX fiables
**Depends on:** Task 14.1

Goal: prouver l'écriture réelle, la lecture et les autorisations.

Files to create/modify:
- `app/api/import/`, `app/api/export/`, `src/features/excel/excel.import.ts`, `excel.writer.ts`.

Steps:
1. [ ] exécuter import/export sur une DB jetable et inspecter les résultats sans fuite de contenu.
2. [ ] corriger doublons, erreurs partielles, en-têtes et Content-Disposition si observés.

Acceptance criteria:
- [ ] scénario export → réimport conserve les entités attendues et import interdit répond 403 sans mutation.

## Verification

- Unit: colonnes, parsing, validation et sérialisation.
- Integration / API: vraie requête multipart/download et upsert sur DB isolée.
- UI, accessibility, and responsive behavior: sélection fichier, progression, rapport d'erreur et annonce screen reader.
- End-to-end / manual: round-trip USER et présence.

## Risks and rollback

L'upsert peut modifier des lignes existantes; utiliser une DB/fixture jetable et documenter la clé de rapprochement avant l'exécution.

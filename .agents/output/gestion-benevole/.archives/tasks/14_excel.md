Status: DONE

# Feature tasks: Import et export Excel (S5)

## Plan

Plan: plan-001
Plan file: ../plans/plan-001_sprints_00_08_functional_ux.md
Feature: Import/export XLSX

## Feature goal

Les imports et exports des USER et présences correspondent aux données métier, sont réexécutables sans doublon involontaire et donnent un rapport clair.

## Parent task: Flux XLSX fiables

**Status:** DONE
**Depends on:** Task 12.1 — champs USER validés; Task 13.1 — modèle présence validé.

Goal: prouver les endpoints réels, mappings, autorisations et parcours de fichier.

Files to create/modify:
- `src/features/excel/`, `app/api/import/`, `app/api/export/`.
- `src/features/excel/import-export-buttons.tsx` et écrans USER/présence concernés.

Steps:
1. [x] comparer les colonnes uniques import/export avec les propriétés PRD et schémas validés.
2. [x] vérifier le parse XLSX, le rapport par numéro de ligne et les écritures idempotentes.
3. [x] couvrir les téléchargements/envois binaires via mutations Query, états de progression et résultat accessible.
4. [x] vérifier authz serveur et UX du résultat partiel/complet.

Acceptance criteria:
- [x] round-trip d'un jeu de données connu ne crée pas de doublon et conserve les champs définis.
- [x] fichier invalide/renommé est rejeté sans écriture et les erreurs identifient la ligne/raison.
- [x] VOLUNTEER reçoit 403 pour import/export protégé.

## Child tasks

### Task 14.1: Mapping XLSX et validation ligne par ligne

**Status:** DONE
**Parent:** Flux XLSX fiables
**Depends on:** Task 12.1, Task 13.1

Goal: utiliser un mapping cohérent et signaler les lignes incorrectes.

Files to create/modify:
- `src/features/excel/excel.columns.ts`, `excel.reader.ts`, `excel.schema.ts`.

Steps:
1. [x] vérifier que les colonnes d'export et l'aliasing d'import ont une seule définition.
2. [x] simuler fichier valide, erreur de champ, fichier non-XLSX et champs optionnels.

Acceptance criteria:
- [x] parse différencie les lignes valides et invalides avec numéros de lignes corrects.

### Task 14.2: API protégée et aller-retour métier

**Status:** DONE
**Parent:** Flux XLSX fiables
**Depends on:** Task 14.1

Goal: prouver l'écriture réelle, la lecture et les autorisations.

Files to create/modify:
- `app/api/import/`, `app/api/export/`, `src/features/excel/excel.import.ts`, `excel.writer.ts`.

Steps:
1. [x] exécuter import/export sur une DB jetable et inspecter les résultats sans fuite de contenu.
2. [x] corriger doublons, erreurs partielles, en-têtes et Content-Disposition si observés.

Acceptance criteria:
- [x] scénario export → réimport conserve les entités attendues et import interdit répond 403 sans mutation.

## Verification

- Unit: colonnes, parsing, validation et sérialisation.
  - Résultat 2026-10-05 : `pnpm test` — **24 fichiers, 153 tests, tous passent**.
  - Excel-specific : `excel.reader.test.ts`, `excel.import.test.ts`, `excel.routes.test.ts` — toutes les assertions passent.
- Integration / API: vraie requête multipart/download et upsert sur DB isolée.
  - Résultat 2026-10-05 : `pnpm test:integration` — **2 fichiers, 7 tests, tous passent**.
  - `tests/excel.integration.test.ts` : USER round-trip (create→update→export→parse) + présence round-trip avec bénévole VOLUNTEER et siège 9876/9876 — aucun doublon, 1 seule ligne d'attendance.
- UI, accessibility, and responsive behavior: sélection fichier, progression, rapport d'erreur et annonce screen reader.
  - `import-export-buttons.tsx` : `role="alert"` sur erreur fichier, `role="status" aria-live="polite"` sur progression et résultat; `<ImportErrorsTable>` affiche ligne/champ/message.
- End-to-end / manual: round-trip USER et présence.
  - Couvert par l'intégration DB ci-dessus.

## Risks and rollback

L'upsert peut modifier des lignes existantes; utiliser une DB/fixture jetable et documenter la clé de rapprochement avant l'exécution.

## Decision log

- 2026-10-05: Correction du test d'intégration de présence — la fixture utilisait l'email USER (`role=USER`) pour `importPresences` qui exige `role=VOLUNTEER`. Ajout d'un compte VOLUNTEER dédié (`volunteerEmail`/`importedVolunteerId`) créé directement en DB avant le test et supprimé dans `afterAll`. Les deux tests d'intégration passent désormais (USER round-trip 1 862 ms, présence round-trip 512 ms). Import sort corrigé sur `app/api/import/presences/route.ts`, `app/api/import/users/route.ts`, `excel.import.test.ts`, `excel.routes.test.ts` — 0 erreur lint sur la feature Excel.


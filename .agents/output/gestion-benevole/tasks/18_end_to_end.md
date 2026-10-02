Status: IN_PROGRESS

# Feature tasks: Validation intégrée des sprints 0 à 8

## Plan

Plan: plan-001
Plan file: ../plans/plan-001_sprints_00_08_functional_ux.md
Feature: Parcours utilisateur transversaux

## Feature goal

Les fonctions des sprints 0–8 passent des scénarios représentatifs intégrés et des vérifications qualité reproductibles en développement.

## Parent task: Preuves intégrées sans confondre build et fonctionnement

**Status:** IN_PROGRESS
**Depends on:** Tasks 10.1–17.2 — workflows de domaine prêts à être intégrés.

Goal: démontrer la fonctionnalité globale, corriger les défauts reproduits et documenter les limites restantes.

Files to create/modify:
- Tests dans les emplacements existants `src/**/*.test.ts` et configuration Vitest.
- Pages/routes/features touchées par les bugs reproduits.
- Tâches `10` à `17` pour statut et références de preuve.

Steps:
1. [ ] définir les comptes/fixtures de test et confirmer que la DB est isolée.
2. [ ] exécuter parcours d'auth, USER→conversion, présences/places, Excel, crédits/observations, publications, témoignages.
3. [ ] exécuter `thr-design` audit/verify et `thr-clean-code` uniquement sur problèmes démontrés.
4. [ ] lancer lint/typecheck/tests/build séquentiellement, corriger et relancer après chaque bug.
5. [ ] joindre la preuve HTTP/UI concrète à chaque critère et marquer les validations non disponibles « non vérifiées ».

Acceptance criteria:
- [ ] chaque parcours critique a un résultat runtime vérifié et reproductible, dont réponses d'erreurs/permissions.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` et `pnpm build` réussissent sur les changements finaux.
- [ ] aucune route métier référencée n'est 404; les bugs résiduels, dépendances DB et contrôles appareils sont nommés.
- [ ] aucune exigence S9, production ou Lighthouse n'est ajoutée à cette validation.

## Progression du 2026-10-02

- Tests unitaires : `pnpm test:all` — 19 fichiers, 117 tests réussis.
- Qualité : `pnpm lint` et `pnpm typecheck` réussis; lint conserve deux avertissements historiques (`excel.import-users.ts` complexité, `user.action.ts` longueur).
- Formatage : Prettier passe sur `app`, `src`, `vitest.config.ts`, `next.config.ts` et `proxy.ts`. Le contrôle global signale seulement `pnpm-lock.yaml` et le bundle généré `public/fallback-ce627215c0e4a9af.js`.
- `git diff --check` réussi. Build, tests d'intégration et parcours UI intégrés ne sont pas rerun dans cette reprise; critères correspondants restent ouverts.

## Child tasks

### Task 18.1: Scénarios par domaine

**Status:** IN_PROGRESS
**Parent:** Preuves intégrées sans confondre build et fonctionnement
**Depends on:** Tasks 10.1–17.2

Goal: prouver les workflows transversaux avec véritables acteurs et données de test.

Files to create/modify:
- Tests d'intégration/parcours existants et helpers de test.

Steps:
1. [ ] exécuter les scénarios selon le PRD pour utilisateur anonyme, ADMIN, VOLUNTEER et USER.
2. [ ] enregistrer route, statut HTTP/résultat et état DB avant/après, sans exposer de secrets.

Acceptance criteria:
- [ ] parcours positifs et négatifs permettent de reproduire les résultats sans utiliser de mocks pour la preuve finale.

### Task 18.2: Qualité, audit UX et fermeture des tâches

**Status:** TODO
**Parent:** Preuves intégrées sans confondre build et fonctionnement
**Depends on:** Task 18.1

Goal: confirmer qualité transversale et maintenir des statuts honnêtes.

Files to create/modify:
- Tâches concernées, tests et code des seuls bugs confirmés.

Steps:
1. [ ] exécuter les commandes de qualité en séquence et conserver leur sortie.
2. [ ] réaliser vérifications clavier/responsive et audit `thr-design` sur chaque page domaine.
3. [ ] mettre les tâches DONE uniquement avec preuve de leurs critères; relier les défauts nouveaux à `thr-planning` si le scope grandit.

Acceptance criteria:
- [ ] aucune tâche ne passe DONE sur build seul; limitations et appareils non testés restent explicitement ouverts.

## Verification

- Unit: `pnpm test` avec couverture des invariants importants.
- Integration / API: vrais appels locaux aux endpoints/actions et base de test isolée.
- UI, accessibility, and responsive behavior: axe/clavier/viewport avec outillage existant.
- End-to-end / manual: scénarios métiers de bout en bout; installation PWA sur appareil seulement si matériel disponible.

## Risks and rollback

Les scénarios peuvent révéler que la base locale a de la dérive préexistante; préserver ses données, ne pas reset, et isoler les mutations à des fixtures jetables.

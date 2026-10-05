Status: IN_PROGRESS

# Feature tasks: Gestion des USER et conversion (S3)

## Plan

Plan: plan-001
Plan file: ../plans/plan-001_sprints_00_08_functional_ux.md
Feature: Comptes USER, profils et certificats

## Feature goal

`/admin/users` gère uniquement les personnes avec rôle `USER`, leurs vraies propriétés et leur conversion modérée vers `VOLUNTEER`.

## Parent task: Corriger et terminer la gestion USER

**Status:** IN_PROGRESS
**Depends on:** Task 10.1 — les protections de rôle serveur sont en place.

Goal: enlever les bugs signalés et prouver propriétés, CRUD, upload et conversion.

Files to create/modify:
- `src/features/user/user.action.ts`, `user.schema.ts`, `src/features/user/components/`.
- `app/admin/users/`, `app/api/upload/route.ts`, `prisma/schema.prisma` uniquement si un champ validé manque.

Steps:
1. [ ] comparer champ par champ PRD, Zod, Prisma, création, édition, détail, liste et export.
2. [ ] forcer le rôle USER dans la validation/serveur et séparer les écrans de Volunteer Management.
3. [ ] vérifier upload PDF CV/certificat, permissions, transitions de modération et traçabilité.
4. [ ] refaire liste, détails et formulaires avec states soignés et hooks TanStack Query.

Acceptance criteria:
- [ ] un payload avec `role: ADMIN` crée toujours un USER ou est rejeté; il ne crée jamais un compte privilégié.
- [ ] toutes les propriétés USER validées sont persistées, affichées et éditables conformément au PRD.
- [ ] un fichier interdit ou trop volumineux est refusé proprement; seule l'approbation autorisée convertit le rôle.
- [ ] le compte converti peut se connecter, le compte USER non converti ne peut pas.

## Child tasks

### Task 12.1: Modèle et validation des propriétés USER

**Status:** TODO
**Parent:** Corriger et terminer la gestion USER
**Depends on:** None

Goal: définir un contrat unique correct pour les propriétés réellement demandées.

Files to create/modify:
- `src/features/user/user.schema.ts`, `prisma/schema.prisma`, actions et types liés.

Steps:
1. [ ] tracer chaque champ PRD jusqu'à sa persistance et noter les incohérences sans inventer de champs.
2. [ ] tester champs requis/optionnels, formats et unicité matricule/email.

Acceptance criteria:
- [ ] les propriétés exigées en création/édition correspondent aux données stockées et au modèle métier USER.

### Task 12.2: CRUD, conversion et UX USER

**Status:** TODO
**Parent:** Corriger et terminer la gestion USER
**Depends on:** Task 12.1 — formulaires, actions et détails partagent le contrat validé.

Goal: terminer les parcours utilisateur de bout en bout.

Files to create/modify:
- `app/admin/users/`, `src/features/user/`, `app/api/upload/route.ts`.

Steps:
1. [ ] utiliser TanStack Query pour les listes/détails/mutations client et invalidations ciblées.
2. [ ] gérer filtres, erreurs upload, actions de certificat, feedback et responsive.
3. [ ] vérifier le refus des rôles VOLUNTEER et l'application effective des droits ADMIN+.
4. [ ] refondre les écrans liste, fiche et édition après audit Chromium : tableau mobile sans débordement, hiérarchie simple, styles compatibles avec les thèmes et actions faciles à trouver.

Acceptance criteria:
- [ ] parcours distinct et couvert par code/tests; vérification navigateur 2026-10-05 (Chromium via `npx agent-browser`) : liste `/admin/users`, fiche `/admin/users/10` (Gravatar + statut rejeté), formulaire `/admin/users/10/update` affiché sans soumission, desktop + 390×844, 5 captures, aucune donnée modifiée. Le parcours avec écriture (création → édition → certificat → approbation/login) reste à prouver. Voir [preuves](../outputs/task-12/api-proof.md).
- [ ] liste mobile sans défilement horizontal de la page; fiche et formulaire suivent une hiérarchie lisible en thèmes clair et sombre. Vérification Chromium après refonte avec captures bureau/mobile.

## Verification

- Unit: schémas USER, validation matricule/email, transitions certificat.
- Integration / API: création rôle forgé, double matricule, upload invalide, accès non autorisé.
- UI, accessibility, and responsive behavior: liste/fiche/formulaire aux tailles mobile et bureau.
- End-to-end / manual: créer USER → modifier propriétés → charger certificat → approuver → login bénévole.

## Vérifications — 2026-10-05

- Tests USER ciblés: 5 fichiers, 21 tests PASS.
- `pnpm typecheck`: PASS après stabilisation des types Next.
- ESLint ciblé: 0 erreur, avertissement préexistant `max-lines` dans `user.action.ts`.
- `git diff --check`: PASS.
- Build supplémentaire: bloqué par un build partagé déjà actif.
- Contrôle navigateur 2026-10-05 : PASS lecture seule via Chromium (`npx agent-browser`, session SUPER_ADMIN seed) — liste, fiche avec Gravatar, formulaire affiché sans soumission, desktop + 390×844, 5 captures, aucune donnée modifiée.
- Preuve détaillée: [outputs/task-12/api-proof.md](../outputs/task-12/api-proof.md).

## Risks and rollback

Toute migration doit être strictement additive/compatible et testée sur DB isolée; ne pas supprimer d'anciennes colonnes ou données.

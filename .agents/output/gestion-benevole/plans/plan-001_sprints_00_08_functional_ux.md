# Plan: Remise en état fonctionnelle et UX des sprints 0 à 8

Plan-ID: plan-001
Project: gestion-benevole
Related task files: `../tasks/10_foundation_auth.md`, `../tasks/11_volunteer_management.md`, `../tasks/12_user_management.md`, `../tasks/13_presence_places.md`, `../tasks/14_excel.md`, `../tasks/15_observation_credit.md`, `../tasks/16_activities_shares.md`, `../tasks/17_testimonials_pwa.md`, `../tasks/18_end_to_end.md`
Sprint / Reference: Sprints 0–8 / PRD V1
Date: 2026-10-02
Status: DRAFT

---

## 1. Objective

- **Problem Statement:** La revue des PR révèle des parcours absents ou incomplets, une gestion USER incorrecte, une navigation de présences incohérente et des expériences UI trop génériques. Les statuts des tâches existantes ne prouvent pas que ces parcours fonctionnent réellement.
- **Scope Checklist:**
  - [ ] Auditer puis rendre utilisables les workflows des sprints 0 à 8, sans déclarer terminé sur la seule base d'une compilation.
  - [ ] Corriger la séparation des comptes `USER` et des comptes `ADMIN`/`VOLUNTEER`, les propriétés métier et les écrans associés.
  - [ ] Faire exister et fonctionner la route de pointage annoncée `/admin/presences`, avec compatibilité ou redirection documentée depuis `/admin/users/presence`.
  - [ ] Utiliser shadcn/ui, TanStack Query pour les opérations client réseau/mutations et TanStack Table pour les listes tabulaires.
  - [ ] Appliquer une qualité visuelle et d'interaction cohérente, responsive et accessible à l'ensemble des écrans couverts.
  - [ ] Valider les parcours réels par domaine, avec données isolées, erreurs et permissions testées.
- **Out of scope:** Sprint 9, mise en production, Lighthouse et son seuil de score, déploiement ou secrets d'infrastructure. La validation d'installation PWA sur appareils physiques est une dépendance manuelle, pas une raison pour bloquer les fonctions métier.

## 2. Current State

- Les routes existent dans `app/`, notamment `/admin/users`, `/admin/users/presence`, `/admin/places`, les modules observations/crédits, activités/partages et témoignages. La navigation `src/features/admin/admin.data.ts` référence `/admin/presences`, mais aucun `app/admin/presences/page.tsx` n'existe.
- Les données sont gérées par un mélange d'actions serveur, d'API Route Handlers, d'appels `fetch` directs et de hooks TanStack Query. Query/ Table sont installés et déjà employés pour certains domaines, pas uniformément.
- `/admin/users` et les formulaires sont dans `app/admin/users/` et `src/features/user/`; des modifications locales non commitées touchent déjà ces fichiers. Leur contenu doit être préservé et inspecté avant modification.
- Les routes et composants du domaine présence existent sous `src/features/presence/`, mais utilisent le chemin `/admin/users/presence`; un alias de route et la navigation devront être alignés.
- Les pages d'activités/partages ont des repositories, endpoints et hooks TanStack Query. Les autres features ont une couverture de données hétérogène. Des fichiers PWA générés/publics figurent aussi dans les changements locaux.
- Aucun dossier `plans/` n'était présent avant ce plan. Les tâches historiques 00–09 mélangent cases de conception, implémentation et preuves; les sprints 5, 7 et 8 gardent des critères non validés.
- Git est sur `main` avec 38 chemins modifiés/supprimés. Ces changements couvrent plusieurs sprints et ne sont ni propres ni inclus dans les futurs worktrees automatiquement.

## 3. Target State

`Current:` présence annoncée à une URL sans page, écrans et flux de données hétérogènes, critères terminés sans preuves homogènes → `Target:` toutes les fonctionnalités et routes des sprints 0–8 sont accessibles, protégées selon les rôles, utilisent les bons objets métier et terminent leurs parcours avec des retours UI soignés, une validation réaliste et des preuves reproductibles.

La gestion `/admin/users` ne crée, n'affiche et ne modifie que les comptes `USER`; les comptes habilités à se connecter sont gérés dans Volunteer Management. La conversion d'un USER n'arrive qu'après modération autorisée. Les écrans de données interactifs utilisent TanStack Query pour chargement, cache, mutations et invalidations; les tableaux utilisent TanStack Table. Les opérations binaires (upload/import/export) gardent les Route Handlers, déclenchés et suivis par mutations Query. Les Server Components publics peuvent lire directement les repositories pour préserver le rendu serveur; ils n'appellent pas une API HTTP interne.

## 4. Constraints

- **Stack / versions:** Next.js 16 App Router, React 19, Prisma 7/PostgreSQL, NextAuth v4, Tailwind 4, shadcn/ui, TanStack Query v5, TanStack Table v8, React Hook Form, Zod 4. Lire la documentation locale `node_modules/next/dist/docs/` avant tout changement Next.js.
- **Backward compatibility:** garder les modèles, migrations et décisions de `.agents/memory/decisions.md`; ne pas réintroduire l'inscription publique, ne pas permettre au rôle USER de se connecter, préserver les URLs partagées via redirection si la route canonique évolue.
- **Security & safety:** autorisation toujours vérifiée côté serveur; validations Zod côté serveur; ne jamais exécuter une migration contre une base partagée ou de production pendant les tests; préserver les changements locaux actuels; aucune suppression de données historiques.
- **Performance:** filtres et pagination côté serveur lorsque les volumes le justifient; debounce de recherche; invalidations ciblées; éviter les doubles chargements Server Component + client sans raison.
- **Tooling available:** scripts `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`; Prisma scripts disponibles mais cible DB locale à confirmer/isoler avant migrations.

## 5. Architectural Sketch

- **Applicable layers:** schéma/migrations uniquement si l'audit découvre un manque confirmé; règles métier et schémas Zod dans les features; Server Actions et Route Handlers existants comme frontière serveur; hooks Query dans les features; composants shadcn et tables TanStack dans la présentation; tests unitaires, d'intégration et parcours HTTP/UI selon les outils déjà présents.
- **Boundaries and reuse:** étendre les actions/repositories, hooks, `QueryProvider`, `DataTable`, primitives shadcn et contrôle RBAC existants avant d'ajouter une abstraction. Pas de nouvelle API redondante pour des mutations simples pouvant être invoquées comme Server Actions via `useMutation`.
- **Data flow:** interaction utilisateur → formulaire/table shadcn + React Hook Form → mutation Query → Server Action ou Route Handler existant → Zod/auth/RBAC → Prisma → résultat/toast et invalidation ciblée. Lecture client → hook Query → frontière serveur → cache Query et états loading/empty/error. Lecture de contenu public SSR → repository serveur filtré → Server Component.

## 6. Verification & Testing Blueprints

- **Test tooling:** Vitest (`pnpm test`), ESLint, TypeScript et build déjà configurés; réutiliser leurs conventions. Vérifier documentation Next.js embarquée avant les changements de routing/API.
- **Testing Approach:** tests unitaires des schémas, RBAC, calculs et mutations; tests d'intégration des actions/repositories avec DB isolée; vérification HTTP non authentifiée/authentifiée pour endpoints; parcours navigateur pour les flux CRUD critiques, états UI, responsive et navigation clavier.
- **Mocking Boundaries:** mocker les dépendances réseau uniquement dans les tests unitaires; les preuves d'acceptation doivent inclure API/app locale et DB jetable/localement isolée. Ne jamais présenter un mock comme validation du workflow complet.
- **Isolated environment:** utiliser une base locale/test dédiée. Si la cible DB ne peut pas être identifiée comme isolée, exécuter validation/génération sans migration et signaler le blocage.

## 7. UI / UX

- **User flow and states:** chaque écran métier a un titre/action primaire clairs, recherche/filtres utiles, pagination quand nécessaire, loading/skeleton, empty state avec prochaine action, erreur récupérable, succès confirmé et état interdit explicite.
- **Quality bar:** langage visuel unifié avec shadcn/ui et les tokens Tailwind existants; hiérarchie typographique, densité adaptée au travail administratif, responsive mobile/tablette/desktop, focus clavier, labels/annonces accessibles et contrastes vérifiés. Tables avec tri/filtres/selection/actions cohérents et états vides lisibles. Pas de copie de marque ou d'interface de YouTube/Facebook.
- **Interaction and visual polish:** préserver filtres pertinents, éviter les dialogues pour les tâches simples, confirmations pour les actions irréversibles, feedback de mutation cohérent, transitions discrètes utiles. Faire l'audit UX/design de chaque domaine avant sa refonte, à l'aide de `thr-design`.

## 8. Phases

### Phase 1 — Socle, environnement de développement, authentification et conventions de données
- **Objective:** confirmer le démarrage local, Prisma/seed, PWA de base et CI, puis rendre auth/RBAC/navigation fiables sans dégrader le travail local existant.
- **Scope / files / modules:** `app/layout.tsx`, `app/admin/layout.tsx`, `proxy.ts`, `src/lib/auth*`, `src/lib/rbac.ts`, `src/features/admin/`, `src/components/shared/`, `src/lib/env.ts`, `prisma/`, `next.config.ts`, workflows CI s'ils existent, manifest/SW.
- **Dependencies:** modifications locales inspectées; aucun secret requis; documentation Next.js locale disponible.
- **Steps:**
  1. [ ] établir un état initial des diffs et faire un inventaire fonctionnel des routes/permissions.
  2. [ ] vérifier variables requises sans révéler leurs valeurs, validation/génération Prisma, seed reproductible sur DB isolée et commandes CI réellement configurées.
  3. [ ] fixer le contrat React Query et le provider pour les écrans client interactifs; documenter lectures SSR et flux binaires comme frontières spécifiques.
  4. [ ] compléter auth, contrôles route/action et navigation; vérifier PWA de base en build/navigateur et page `/admin/sprints` si conservée.
- **Validation:** tests RBAC, parcours login par rôle, accès HTTP, schema Prisma, seed sur base isolée, build/PWA local, workflow CI disponible, lint/typecheck.
- **Acceptance criteria:** USER ne crée aucune session; setup local a des erreurs explicites; seed est reproductible sur base isolée; toutes les entrées de navigation mènent à une page; aucun déploiement production.
- **Risks:** modifications locales concurrentes; garder les diffs séparés et éviter les commits globaux.

### Phase 2 — Comptes bénévoles et comptes USER
- **Objective:** rendre distinctes, exactes et abouties la gestion des utilisateurs USER et celle des comptes bénévoles/admin.
- **Scope / files / modules:** `src/features/user/`, `app/admin/users/`, `src/features/volunteers/`, `app/admin/volunteer-management/`, `src/lib/rbac.ts`, upload certificat/CV.
- **Dependencies:** Phase 1; propriétés validées contre PRD et schéma Prisma actuel.
- **Steps:**
  1. [ ] vérifier chaque champ USER, son caractère requis, sa persistance, son affichage, son édition et son export.
  2. [ ] sécuriser création/édition USER pour forcer le rôle `USER`; garder la création de rôles habilités dans Volunteer Management.
  3. [ ] finaliser conversion certificat, upload et modération avec erreurs, succès et invalidations UI.
  4. [ ] appliquer le parcours visuel complet aux listes, détails et formulaires.
- **Validation:** scénarios create/read/update/convert, unicité, fichiers invalides, rôle forgé et autorisation par rôle.
- **Acceptance criteria:** un admin gère un USER avec propriétés exactes; l'approbation seule convertit en VOLUNTEER; l'ancien bug décrit par le propriétaire ne se reproduit pas.
- **Risks:** écarts entre PRD et champs Prisma (notamment propriétés métier anciennes); aucune migration avant preuve de besoin et base isolée.

### Phase 3 — Présences et places
- **Objective:** livrer un parcours journalier de pointage utilisable, cohérent avec les places et accessible depuis l'URL attendue.
- **Scope / files / modules:** `src/features/presence/`, `src/features/places/`, `app/admin/presences/`, `app/admin/users/presence/`, `src/features/admin/admin.data.ts`.
- **Dependencies:** Phase 1 et comptes de test valides.
- **Steps:**
  1. [ ] inventorier les opérations action/query et les contraintes d'unicité par jour.
  2. [ ] fournir `/admin/presences` et décider alias/redirection rétrocompatible pour le chemin historique.
  3. [ ] intégrer recherche de personne, date, statut, table/siège, arrivée/départ et filtres temporels.
  4. [ ] relier CRUD des sièges avec prévention des suppressions référencées.
- **Validation:** présence créée, mise à jour, duplication refusée ou gérée, filtres date, choix place valide, accès HTTP par rôle.
- **Acceptance criteria:** l'utilisateur peut pointer, corriger et consulter une présence depuis `/admin/presences`; places occupées et historiques restent cohérents.
- **Risks:** historiques `Presence` versus `Attendance` et dérive locale de DB; vérifier sans reset ni migration destructive.

### Phase 4 — Import et export Excel
- **Objective:** obtenir des fichiers XLSX fiables et un aller-retour sans doublon pour USER et présences.
- **Scope / files / modules:** `src/features/excel/`, `app/api/import/`, `app/api/export/`, listes USER et présences.
- **Dependencies:** phases 2 et 3 stabilisées.
- **Steps:**
  1. [ ] comparer colonnes PRD, schéma, colonnes partagées et entêtes réels.
  2. [ ] sécuriser parse/validation par ligne, rapport d'erreurs, upsert/idempotence et droits.
  3. [ ] intégrer les flux binaires via mutations Query et feedback UI accessible.
- **Validation:** vraie requête HTTP avec XLSX valide/invalide, round-trip, extension trompeuse, doublons et refus VOLUNTEER.
- **Acceptance criteria:** les données exportées/réimportées restent exactes; chaque erreur identifie la ligne; aucun import non autorisé n'écrit en base.
- **Risks:** différences de modèles/colonnes et effets d'upsert; scénario d'abord sur base isolée et fixtures jetables.

### Phase 5 — Observations, crédits et statistiques métier
- **Objective:** compléter la consultation et les mutations des observations/crédits avec calculs expliqués et navigation stable.
- **Scope / files / modules:** `src/features/observation/`, `src/features/credit/`, pages admin et export crédit.
- **Dependencies:** phases 1 et 2; données de test d'utilisateurs bénévoles.
- **Steps:**
  1. [ ] confirmer règles de cumul, périodes, fuseau et rôles avec implémentation/CDC.
  2. [ ] unifier reads/mutations client sous hooks TanStack Query et tables shadcn/TanStack Table.
  3. [ ] vérifier filtres, totaux, création/édition et export.
- **Validation:** tests unitaires des calculs/périodes, parcours mutation-query, permissions et valeurs de référence.
- **Acceptance criteria:** les totaux affichés correspondent aux enregistrements de la période; mutation et export reflètent immédiatement le même état autorisé.
- **Risks:** règles métier ou timezone ambigües; relever la décision avant de changer le calcul.

### Phase 6 — Activités, partages et contenu public
- **Objective:** fiabiliser modération admin et lecture publique SSR avec contenus brouillon réellement privés.
- **Scope / files / modules:** `src/features/activites/`, `src/features/partages/`, repositories, Route Handlers, `app/activites/`, `app/partages/`, pages admin.
- **Dependencies:** auth/RBAC de Phase 1.
- **Steps:**
  1. [ ] tracer chaque mutation/liste et réutiliser Query pour les surfaces interactives.
  2. [ ] vérifier auteur, statut publication, images et détail public contre accès non authentifié.
  3. [ ] compléter états et design des formulaires, filtres et cartes publiques.
- **Validation:** requêtes HTTP anonymes/admin, transitions brouillon/publié/dépublié, validation d'auteur et rendu des détails.
- **Acceptance criteria:** seul `PUBLIE` apparaît publiquement et les mutations admin deviennent visibles sans rebuild.
- **Risks:** ne pas exposer les données internes de l'auteur; maintenir la lecture serveur publique pour SEO/rendu initial.

### Phase 7 — Témoignages et comportement PWA
- **Objective:** assurer le cycle public de témoignage modéré et le fonctionnement hors ligne déjà dans le scope sprint 8.
- **Scope / files / modules:** `src/features/temoignage/`, `app/temoignages/`, `app/admin/temoignages/`, manifest, SW, fallback offline.
- **Dependencies:** auth/RBAC de Phase 1 et routes publiques de Phase 6.
- **Steps:**
  1. [ ] vérifier soumission anonyme, anti-spam, statut initial et limites du rate-limit.
  2. [ ] vérifier transitions de modération et propagation à la vitrine publique.
  3. [ ] exercer fallback/cache hors ligne en navigateur local; ne pas faire d'audit Lighthouse.
- **Validation:** POST anonyme réel, cas honeypot/limite, moderation admin, GET public filtré, scénario offline navigateur.
- **Acceptance criteria:** aucune soumission non modérée n'est publique; les pages publiques éligibles sont consultables hors ligne selon la règle du SW.
- **Risks:** rate-limit mémoire mono-processus et limites PWA appareil; consigner les limites sans inclure Lighthouse ni S9.

### Phase 8 — Validation transversale des sprints 0–8
- **Objective:** confirmer les parcours complets en environnement de développement et corriger les bugs prouvés.
- **Scope / files / modules:** routes/features des phases 1–7, tests existants, fixtures et documents de tâches.
- **Dependencies:** phases 1–7 terminées; env local et DB de test disponibles.
- **Steps:**
  1. [ ] parcourir les workflows représentant les sprints 0–8 avec acteurs dédiés.
  2. [ ] auditer les composants avec `thr-design`, puis appliquer `thr-clean-code` aux problèmes identifiés.
  3. [ ] exécuter lint, typecheck, tests et build séquentiellement; consigner preuves, limites et bugs restants.
- **Validation:** `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, requêtes API et parcours navigateur enregistrés.
- **Acceptance criteria:** aucune route annoncée n'est absente; chaque workflow du PRD a une preuve runtime; l'ensemble des états UI essentiels est vérifié; aucun score Lighthouse requis.
- **Risks:** appareils physiques requis pour installation PWA; ces contrôles restent explicitement « non vérifiés » s'ils ne sont pas disponibles.

## 9. Cross-Phase Dependencies

- Phase 1 précède toutes les autres pour la navigation, l'authentification et le contrat Query.
- Phase 2 précède présence, Excel et crédit car les objets USER/VOLUNTEER déterminent les sélections et colonnes.
- Phase 3 précède validation d'import/export des présences.
- Phases 6 et 7 partagent le rendu public, mais restent testables séparément.
- Phase 8 consomme seulement des comportements déjà implémentés et ne remplace pas leurs critères de validation.
- Toute migration exige une cible locale/test prouvée isolée; sinon, seule la validation sans mutation est exécutée.

## 10. Risks

- **Travail local non commité:** lors de l'inspection initiale, 38 chemins source étaient modifiés/supprimés; inspecter chaque chevauchement avant édition et préserver ces changements.
- **Plans et tâches historiques non alignés:** ne pas traiter les cases historiques cochées comme preuve; conserver leurs informations mais relier les nouveaux incréments vérifiables à ce plan.
- **TanStack généralisé:** Query ne remplace pas les handlers binaires, ni l'accès Prisma direct des Server Components; toute opération client doit néanmoins passer par hooks Query.
- **Dérive DB/migrations:** validation par introspection et environnements isolés; aucun reset ni migration prod.
- **Travail parallèle:** un worktree par feature; le worktree skill exige état source propre, aperçu confirmé, puis préparation isolée.

## 11. Related task files

- `../tasks/10_foundation_auth.md` — S0–S1, navigation et RBAC.
- `../tasks/11_volunteer_management.md` — S2, gestion des comptes habilités.
- `../tasks/12_user_management.md` — S3, gestion USER et conversion.
- `../tasks/13_presence_places.md` — S4, pointage et places.
- `../tasks/14_excel.md` — S5, import/export.
- `../tasks/15_observation_credit.md` — S6, observations et crédits.
- `../tasks/16_activities_shares.md` — S7, contenus publics.
- `../tasks/17_testimonials_pwa.md` — S8, témoignages et offline PWA.
- `../tasks/18_end_to_end.md` — validation transversale 0–8.

## 12. Final Acceptance Criteria

- [ ] Tous les workflows annoncés des sprints 0–8 sont accessibles et fonctionnent avec les rôles et données prévus.
- [ ] `/admin/users` gère exclusivement les USER; l'approbation seule convertit un USER en VOLUNTEER.
- [ ] `/admin/presences` fonctionne et les URLs historiques restent cohérentes.
- [ ] Les opérations interactives client sont lues/mutées via TanStack Query; les listes tabulaires utilisent TanStack Table.
- [ ] Chaque page métier a des états loading, empty, error, success et permission appropriés, vérifiés responsive/accessibles.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` et `pnpm build` passent; preuves runtime couvrent les parcours critiques.
- [ ] S9, déploiement de production et Lighthouse ne font pas partie de l'acceptation.

## 13. Progress

[~] Phase 1 — Inspection de l'existant et création du plan/tâches
[ ] Phase 2 — Comptes bénévoles et comptes USER
[ ] Phase 3 — Présences et places
[ ] Phase 4 — Import/export Excel
[ ] Phase 5 — Observations et crédits
[ ] Phase 6 — Activités, partages et contenu public
[ ] Phase 7 — Témoignages et comportement PWA
[ ] Phase 8 — Validation transversale

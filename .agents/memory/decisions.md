# Décisions d'architecture — gestion-benevole

Journal append-only. Une décision = une ligne datée. Ne pas effacer, ne pas réécrire.

<!-- Format: YYYY-MM-DD — Décision — Contexte -->
2026-10-01 — App fermée : `/` redirige vers `/login`, suppression de `/sign-up` et du `registerAction`, le rôle `USER` ne peut pas s'authentifier — le CDC prévoyait une inscription publique, l'interview a recentré le produit sur un usage interne administratif
2026-10-01 — RBAC à 4 rôles `SUPER_ADMIN / ADMIN / VOLUNTEER / USER` avec migration `ALTER TYPE "Role" RENAME VALUE 'BENEVOLE' TO 'VOLUNTEER'` (données conservées) et matrice de création centralisée `canCreate()` dans `src/lib/rbac.ts` — évite l'escalade de privilèges à la création de comptes
2026-10-01 — Création des comptes déplacée vers `/admin/volunteer-management` (sous-liste `roles` / `add` / `[id]`) ; suppression des doublons de routes `/admin/benevoles`, `/admin/volunteers`, `/admin/presence`
2026-10-01 — Places non fixes : `Seat` sans `userId`, la table/siège est choisie à chaque pointage (`Attendance.seat_id`) — CRUD des numéros de table/siège dans `/admin/places`
2026-10-01 — Import/Export Excel via `exceljs` (côté serveur) sur les listes USER et présences ; colonnes partagées import/export
2026-10-01 — Dossier `todos/` supprimé : plan/sprints migés dans `.agents/output/gestion-benevole/` (idea, discovery, prd, archi, ROADMAP, tasks/00-09, references/CDC)
2026-10-01 — Activités et Partages utilisent `PublicationStatut` (BROUILLON/PUBLIE), les routes publiques filtrent toujours sur PUBLIE, et la modération passe par des API admin protégées — les contenus ne paraissent pas sur la vitrine avant publication
2026-10-02 — Le périmètre de remise en état couvre les sprints 0 à 8 et exclut S9 et Lighthouse; toute opération réseau déclenchée côté client passe par TanStack Query, tandis que les lectures SSR utilisent directement les services serveur et que les flux binaires gardent leurs Route Handlers — demande UX/fonctionnelle du propriétaire et respect du rendu public serveur
2026-10-02 — Prisma Studio : `DATABASE_URL` en forme TCP (`...@localhost:5432/...`) dans `.env`/`.env.local` — le driver `postgres.js` de Studio transmettait `?host=/var/run/postgresql` au serveur → `unrecognized configuration parameter "host"` → « Could not load schema metadata » (prouvé via POST /bff : 9 tables + colonnes User + count lus) ; le moteur Rust et le `createPool()` custom acceptaient déjà les deux formes
2026-10-02 — Convention tests : tous les fichiers en `.test.ts` (`src/**` = unitaires jsdom via `pnpm test`, `tests/*.test.ts` = intégration BDD réelle via `pnpm test:integration --environment node`) ; coverage gate 80% configuré mais non atteint (~5,7 % lignes) — waiver temporaire, à remonter en écrivant les tests des features non couvertes

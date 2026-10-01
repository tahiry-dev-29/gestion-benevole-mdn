# Décisions d'architecture — gestion-benevole

Journal append-only. Une décision = une ligne datée. Ne pas effacer, ne pas réécrire.

<!-- Format: YYYY-MM-DD — Décision — Contexte -->
2026-10-01 — App fermée : `/` redirige vers `/login`, suppression de `/sign-up` et du `registerAction`, le rôle `USER` ne peut pas s'authentifier — le CDC prévoyait une inscription publique, l'interview a recentré le produit sur un usage interne administratif
2026-10-01 — RBAC à 4 rôles `SUPER_ADMIN / ADMIN / VOLUNTEER / USER` avec migration `ALTER TYPE "Role" RENAME VALUE 'BENEVOLE' TO 'VOLUNTEER'` (données conservées) et matrice de création centralisée `canCreate()` dans `src/lib/rbac.ts` — évite l'escalade de privilèges à la création de comptes
2026-10-01 — Création des comptes déplacée vers `/admin/volunteer-management` (sous-liste `roles` / `add` / `[id]`) ; suppression des doublons de routes `/admin/benevoles`, `/admin/volunteers`, `/admin/presence`
2026-10-01 — Places non fixes : `Seat` sans `userId`, la table/siège est choisie à chaque pointage (`Attendance.seat_id`) — CRUD des numéros de table/siège dans `/admin/places`
2026-10-01 — Import/Export Excel via `exceljs` (côté serveur) sur les listes USER et présences ; colonnes partagées import/export
2026-10-01 — Dossier `todos/` supprimé : plan/sprints migés dans `.agents/output/gestion-benevole/` (idea, discovery, prd, archi, ROADMAP, tasks/00-09, references/CDC)
2026-10-01 — Tâche 01 (Auth & RBAC) : app fermée, `enum Role` migré par `ALTER TYPE RENAME VALUE 'BENEVOLE' TO 'VOLUNTEER'` + `ADD VALUE` (ordre `SUPER_ADMIN, ADMIN, VOLUNTEER, USER`, zéro perte), `src/lib/rbac.ts` = source unique (`canCreate`, `ROUTE_MATRIX`, `canManageRole`, `canLogin`), `authorize()` refuse `USER` (message explicite), `registerAction`/`register-form.tsx` supprimés, `app/page.tsx` → `redirect("/login")`, sidebar filtrée par rôle, seed 4 rôles
2026-10-01 — Tâche 01 : migration de synchro `20261001090000_sync_presence_unique` ajoutée car l'index unique `Presence(user_id, date)` existait en base mais pas dans l'historique Prisma (drift) — `CREATE UNIQUE INDEX IF NOT EXISTS` (idempotent, sans perte)
2026-10-01 — Tâche 02 : `src/features/benevoles/` → `src/features/volunteers/` avec structure plate (`volunteer.entity.ts`, `volunteer.schema.ts`, `volunteer.repository.ts`, `volunteer.action.ts`, `presentation/*`) alignée sur AGENTS.md ; mutations en Server Actions (routes REST `/api/benevoles` supprimées), soft delete `deletedAt`, `createdById`/`createdBy` tracés, tests Vitest ajoutés (devDependency) : `canCreate` 4×4 + `createVolunteerAction` 4×3 exhaustive
2026-10-01 — Tâche 02 : `SHADOW_DATABASE_URL` du `.env` (symlink partagé) pointe vers la base `postgres` → permissions insuffisantes ; utiliser `postgresql://…/gestion_benevole_shadow` pour `prisma migrate dev` (le `migrate deploy`/`build` n'a pas besoin de shadow DB)


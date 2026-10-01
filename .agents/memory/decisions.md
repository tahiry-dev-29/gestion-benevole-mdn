# Décisions d'architecture — gestion-benevole

Journal append-only. Une décision = une ligne datée. Ne pas effacer, ne pas réécrire.

<!-- Format: YYYY-MM-DD — Décision — Contexte -->
2026-10-01 — App fermée : `/` redirige vers `/login`, suppression de `/sign-up` et du `registerAction`, le rôle `USER` ne peut pas s'authentifier — le CDC prévoyait une inscription publique, l'interview a recentré le produit sur un usage interne administratif
2026-10-01 — RBAC à 4 rôles `SUPER_ADMIN / ADMIN / VOLUNTEER / USER` avec migration `ALTER TYPE "Role" RENAME VALUE 'BENEVOLE' TO 'VOLUNTEER'` (données conservées) et matrice de création centralisée `canCreate()` dans `src/lib/rbac.ts` — évite l'escalade de privilèges à la création de comptes
2026-10-01 — Création des comptes déplacée vers `/admin/volunteer-management` (sous-liste `roles` / `add` / `[id]`) ; suppression des doublons de routes `/admin/benevoles`, `/admin/volunteers`, `/admin/presence`
2026-10-01 — Places non fixes : `Seat` sans `userId`, la table/siège est choisie à chaque pointage (`Attendance.seat_id`) — CRUD des numéros de table/siège dans `/admin/places`
2026-10-01 — Import/Export Excel via `exceljs` (côté serveur) sur les listes USER et présences ; colonnes partagées import/export
2026-10-01 — Dossier `todos/` supprimé : plan/sprints migés dans `.agents/output/gestion-benevole/` (idea, discovery, prd, archi, ROADMAP, tasks/00-09, references/CDC)

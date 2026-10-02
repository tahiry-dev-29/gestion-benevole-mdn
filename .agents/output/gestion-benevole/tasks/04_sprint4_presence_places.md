Status: DONE

> **Suivi de remise en état:** route `/admin/presences`, pointage et places sont suivis dans [`13_presence_places.md`](13_presence_places.md), Plan `plan-001`.

# Tâche 04 — Sprint 4 : Présence & Places (CRUD tables/sièges)

**Sprint:** 4 · **Durée:** 2 semaines · **Priorité:** Haute · **Dépend de:** Tâche 03 · **Plan:** [`prd.md`](../prd.md) §5 · **Archi:** [`archi.md`](../archi.md)

---

## Goal

CRUD réel des numéros de table et de siège (`/admin/places`), et pointage sur `/admin/users/presence` où l'on choisit **la table et le siège du jour** (places non fixes), avec filtre calendrier.

## Fichiers à créer/modifier

| Fichier | Action |
|---------|--------|
| `prisma/schema.prisma` | Modifier — modèles `Seat` + `Attendance`, supprimer l'ancien `Presence` (data migration) |
| `prisma/seed.ts` | Modifier — jeu de tables/sièges d'exemple |
| `src/features/places/` | Créer — `places.schema.ts`, `places.action.ts`, `presentation/` (grille, form) |
| `src/features/presence/presence.action.ts` | Refondre — `pointAction(user, date, table, seat)`, `listAttendance(filters)`, `updateHeuresAction` |
| `src/features/presence/presence.schema.ts` | Modifier — validation date + `seatId` |
| `app/admin/places/page.tsx` | Créer — CRUD tables/sièges |
| `app/admin/users/presence/page.tsx` | Créer — pointage avec place (remplace `/admin/presence`) |
| `src/features/presence/presentation/*` | Modifier — grille de salle, sélecteur table→siège, calendrier jour/semaine/mois |
| `app/admin/presence/page.tsx` | Supprimer — doublon |
| `src/features/admin/admin.data.ts` | Modifier — nav : `Présences` → `/admin/users/presence`, item `Places` → `/admin/places` |

## Étapes

1. **Schéma** (voir `archi.md`) : `Seat{ tableNumber, seatNumber, label }` avec `@@unique([tableNumber, seatNumber])` ; `Attendance{ user_id, date, seat_id?, statut, heure_arrivee, heure_depart }` avec `@@unique([user_id, date])`.
2. Migration : créer `Seat`/`Attendance` → **data migration** de `Presence` vers `Attendance` → supprimer `Presence` (`pnpm prisma migrate dev --name attendance_and_seats`).
3. **Actions places** :
   - `createTableAction(seatCount)` — crée la table + N sièges numérotés 1..N ; numéro de table auto-élevé (max + 1) ou libre si non pris.
   - `renameTableAction(oldNumber, newNumber)` — refuse si le numéro cible existe.
   - `createSeatAction / updateSeatNumberAction / deleteSeatAction` — **refus si une `Attendance` référence le siège** (message clair) ; `@@unique` gère les doublons.
   - `listSeatsAction` — agrégat par table pour la grille.
4. **Actions présence** :
   - `pointAction({ userId, date, seatId, statut, arrivee, depart })` — upsert (unique `[user,date]`), vérifie que le siège existe et que la table n'est pas occupée **le même jour par un autre** (contrôle d'unicité `Attendance.seat_id + date`).
   - `listAttendanceAction({ du, au, table, statut })` + calculs jour/semaine/mois.
   - Toutes les actions vérifient la session (`ADMIN+`).
5. **UI `/admin/places`** : grille des tables (card par table, sièges en chips), actions `Ajouter table` / `Renommer` / `Ajouter siège` / `Supprimer` (avec `ConfirmDeleteDialog`), badge « occupé aujourd'hui ».
6. **UI `/admin/users/presence`** : calendrier (jour/semaine/mois) → liste des présences du jour → bouton **Pointer** : sélecteur *Table* puis *Siège* (sièges occupés désactivés) + statut + heures ; historique par bénévole.
7. Supprimer `/admin/presence` (doublon) et mettre à jour la sidebar.
8. L'export Excel de cette page est livré au sprint 5 (bouton présent, désactivé ou à implémenter ici — décision : **bouton ajouté au sprint 5**).

## Critères d'acceptation

- [x] `pnpm typecheck` · `pnpm lint` · `pnpm format:check` — 0 erreur, 0 warning
- [x] `pnpm test` — 8 tests (3 actions + 5 calendrier)
- [x] `pnpm prisma migrate dev` — **exécuté et validé** sur une base neuve (`prisma migrate deploy` + `prisma migrate diff --from-migrations --to-schema` ⇒ *No difference detected*)
- [x] `pnpm prisma db seed` — passe sur base alignée
- [!] `pnpm build` — compile, TypeScript OK, 24/24 pages générées via `next build --debug-prerender`. Le build **standard** reste bloqué par un bug Next.js 16 connu (`/_global-error` / `useContext` null), reproduit **à l'identique sur `HEAD` sans le sprint 4** — voir `.agents/memory/decisions.md`
- [x] `/admin/places` : création de table avec sièges, renommage et refus d'un numéro cible existant implémentés
- [x] Supprimer un siège assigné refusé avec message; siège libre supprimable
- [x] Unicité base de données `(seat_id, date)` vérifiée par test SQL direct (violation levée)
- [x] Pointage upsert par `(user_id, date)` — contrainte vérifiée par test SQL direct
- [x] `Seat` n'a pas de `userId`
- [x] Filtre calendrier jour/semaine/mois implémenté (+ tests des fonctions pures dans `presence.utils.ts`)
- [x] `/admin/presence` supprimée; sidebar pointe `/admin/users/presence` et `/admin/places`
- [x] Tests d'action `pointAction` (upsert, siège occupé) et `deleteSeatAction` (siège assigné)
- [x] Migration de données `Presence` → `Attendance` (conservée) + enum `Role`/`User` des sprints 1–3 rattrappés par une migration de baseline idempotente
- [x] Composants de pointage découpés (`_components/`) — plus aucun fichier > 200 lignes

## Vérifications effectuées

| Commande | Résultat |
|----------|----------|
| `pnpm typecheck` | exit 0 |
| `pnpm lint` | exit 0 (0 warning) |
| `pnpm format:check` | exit 0 |
| `pnpm test` | 8/8 |
| `prisma migrate deploy` (base neuve) | 5 migrations appliquées |
| `prisma migrate diff --from-migrations --to-schema` | *No difference detected* |
| `prisma db seed` | succès |
| `next build --debug-prerender` | 24/24 pages, `/admin/places` + `/admin/users/presence` présentes |
| `next build` (standard) | bloqué par bug upstream Next.js 16, reproduit sur `HEAD` |

Garantees vérifiées en SQL sur la base migrée :
`Attendance_user_id_date_key` (upsert), `Attendance_seat_id_date_key` (pas de double réservation),
`Attendance_seat_id_fkey ON DELETE RESTRICT` (siège référencé non supprimable),
`Role` = `SUPER_ADMIN/ADMIN/VOLUNTEER/USER` avec remappage `BENEVOLE` → `VOLUNTEER` **préservant les données**.

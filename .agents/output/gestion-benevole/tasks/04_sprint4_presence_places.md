Status: TODO

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

- [ ] `pnpm typecheck` · `pnpm lint` · `pnpm build` · `pnpm prisma migrate dev` — 0 erreur
- [ ] `/admin/places` : créer une table génère ses sièges ; renommer un n° de table fonctionne ; le n° de table existant est refusé
- [ ] Supprimer un siège **occupé** → refus avec message ; siège libre → supprimé
- [ ] Un même siège ne peut pas être occupé par 2 personnes à la même date (contrainte testée)
- [ ] Pointage : 1 `Attendance` par `(user, date)` — repointer met à jour au lieu de dupliquer
- [ ] La place **n'est pas mémorisée sur l'utilisateur** (`Seat` sans `userId`)
- [ ] Filtre calendrier jour/semaine/mois correct
- [ ] `/admin/presence` n'existe plus ; sidebar pointe `/admin/users/presence` et `/admin/places`
- [ ] Tests : `pointAction` (doublon date, siège occupé), `deleteSeatAction` (assigné → error)

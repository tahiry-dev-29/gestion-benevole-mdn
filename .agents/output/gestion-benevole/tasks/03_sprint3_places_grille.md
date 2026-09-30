# Tâche 03 — Sprint 3 : Présence avec Places & Grille Tables/Sièges

**Status:** TODO
**Sprint:** 3 · **Durée:** 2 semaines · **Priorité:** Haute

---

## Goal

Remplacer `Presence` par `Seat` + `Attendance` : chaque place (table N / siège M) est assignée à un user, pointage sur la place, grille visuelle, filtre calendrier.

## Fichiers à créer/modifier

| Fichier | Action |
|---------|--------|
| `prisma/schema.prisma` | Modifier — modèles `Seat` + `Attendance`, supprimer `Presence` |
| `prisma/seed.ts` | Modifier — seed sièges + présences |
| `prisma/migrations/` | Créer — migration Presence → Attendance |
| `src/features/seat/seat.schema.ts` | Créer — Zod schemas |
| `src/features/seat/seat.action.ts` | Créer — CRUD Seat |
| `src/features/attendance/attendance.action.ts` | Créer — pointage, filtre calendrier |
| `src/features/presence/presentation/attendance-form.tsx` | Créer — pointage avec place |
| `src/features/presence/presentation/seat-grid.tsx` | Créer — grille tables/sièges |
| `src/features/presence/presentation/attendance-calendar.tsx` | Créer — filtre calendrier |

## Étapes

1. **Schema** : modèles `Seat` (tableNumber, seatNumber, user_id unique) + `Attendance` (user_id, seat_id, date, statut, arrival, departure) avec contraintes `@@unique`
2. **Migration** : script Presence → Attendance, puis supprimer Presence
3. **Seat Actions** : `createSeatsAction(tableNumber, count)`, `assignSeatAction`, `unassignSeatAction`, `listSeatsAction`
4. **Attendance Actions** : `markAttendanceAction` (vérifie siège assigné au user), `listAttendanceAction`, `getDailyAttendanceAction`, `getAttendanceByRange(startDate, endDate)`
5. **UI SeatGrid** : grille visuelle, sièges colorés (libre=vert, occupé=rouge), tooltip user, clic → assignation
6. **UI AttendanceForm** : affiche place assignée, boutons arrivée/départ, toast
7. **UI AttendanceCalendar** : navigation jour/semaine/mois, filtres statut/table/user, résumé
8. **Tests** : createSeats (doublon), markAttendance (siège d'un autre), getAttendanceByRange (périodes)

## Critères d'acceptation

- [ ] `pnpm prisma migrate dev` passe (Presence migré + supprimé)
- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm build` passent
- [ ] Créer une table avec N sièges fonctionne
- [ ] Un siège = un user unique (doublon rejeté)
- [ ] Un user pointe sur SON siège uniquement
- [ ] Double pointage même jour → update, pas doublon
- [ ] Grille visuelle affiche statuts correctement
- [ ] Filtre calendrier jour/semaine/mois fonctionne
- [ ] Seed crée des sièges et présences de test

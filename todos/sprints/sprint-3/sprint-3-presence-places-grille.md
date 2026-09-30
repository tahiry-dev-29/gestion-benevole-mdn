# Sprint 3 — Présence avec Places & Grille Tables/Sièges

> ⏱️ **Durée :** 2 semaines · 🎯 **Objectif :** système de places (table + siège), pointage par place,
> filtre calendrier (jour/semaine/mois), grille visuelle des tables/sièges
> 📌 **Statut :** ⚪ À venir · **Vélocité cible :** ~42 points

- [x] Toutes les cases cochées = PR fusionnée + revue Lead (CDC §6)

## 🎯 Sprint Goal

Remplacer l'ancien modèle `Presence` par un système `Seat` + `Attendance` où
chaque place (table N / siège M) est assignée à un utilisateur, le pointage se
fait sur la place occupée, et l'admin visualise une grille des tables/sièges
avec filtre calendrier.

## 🧮 Estimation & dépendances

| Story                                    | Dev    | Points | Priorité | Dépend de  |
| ---------------------------------------- | ------ | ------ | -------- | ---------- |
| S3.1 — Schéma Seat + Attendance          | Back1  | 5      | Haute    | S1.1       |
| S3.2 — API CRUD Seat (assignation)       | Back1  | 8      | Haute    | S3.1       |
| S3.3 — API Attendance (pointage + place) | Back2  | 8      | Haute    | S3.1, S3.2 |
| S3.4 — API filtre calendrier             | Back2  | 5      | Haute    | S3.3       |
| S3.5 — Migration Presence → Attendance   | Back1  | 5      | Haute    | S3.1       |
| S3.6 — UI grille Tables/Sièges           | Front1 | 8      | Haute    | S1.5, S3.2 |
| S3.7 — UI pointage avec sélection place  | Front1 | 5      | Haute    | S1.5, S3.3 |
| S3.8 — UI filtre calendrier              | Front2 | 5      | Haute    | S1.6, S3.4 |
| S3.9 — UI historique présence personnel  | Front2 | 3      | Moyenne  | S1.6, S3.3 |
| S3.10 — Tests fonctionnels               | Équipe | 2      | Haute    | toutes     |

**Capacité :** ~42 points · **Chargement :** 44 points (légèrement au-dessus, optionnel S3.9 en buffer).

## 🎫 Sprint Board

| Story                                   | Status | Dev    | Points | Backlog | En cours | Test | Fait |
| --------------------------------------- | ------ | ------ | ------ | ------- | -------- | ---- | ---- |
| S3.1 — Schéma Seat + Attendance         | ⚪     | Back1  | 5      | ☐       | ☐        | ☐    | ☐    |
| S3.2 — API CRUD Seat                    | ⚪     | Back1  | 8      | ☐       | ☐        | ☐    | ☐    |
| S3.3 — API Attendance                   | ⚪     | Back2  | 8      | ☐       | ☐        | ☐    | ☐    |
| S3.4 — API filtre calendrier            | ⚪     | Back2  | 5      | ☐       | ☐        | ☐    | ☐    |
| S3.5 — Migration Presence → Attendance  | ⚪     | Back1  | 5      | ☐       | ☐        | ☐    | ☐    |
| S3.6 — UI grille Tables/Sièges          | ⚪     | Front1 | 8      | ☐       | ☐        | ☐    | ☐    |
| S3.7 — UI pointage avec sélection place | ⚪     | Front1 | 5      | ☐       | ☐        | ☐    | ☐    |
| S3.8 — UI filtre calendrier             | ⚪     | Front2 | 5      | ☐       | ☐        | ☐    | ☐    |
| S3.9 — UI historique présence personnel | ⚪     | Front2 | 3      | ☐       | ☐        | ☐    | ☐    |
| S3.10 — Tests fonctionnels              | ⚪     | Équipe | 2      | ☐       | ☐        | ☐    | ☐    |

## 📦 Backlog (User Stories)

### 🎟️ S3.1 — Schéma Seat + Attendance

**Dev :** Back1 · **Pts :** 5 · **Dépend de :** S1.1

> En tant que **Lead**, je veux deux modèles distincts : `Seat` (table + numéro
> de siège, assigné à un user) et `Attendance` (présence datée avec référence
> à la place occupée).

#### Tâches

- [ ] `prisma/schema.prisma` :
  ```prisma
  model Seat {
    id          Int    @id @default(autoincrement())
    tableNumber Int
    seatNumber  Int
    user_id     Int?   @unique
    user        User?  @relation(fields: [user_id], references: [id])
    createdAt   DateTime @default(now())
    @@unique([tableNumber, seatNumber])
  }
  model Attendance {
    id        Int      @id @default(autoincrement())
    user_id   Int
    seat_id   Int?
    date      DateTime @db.Date
    statut    String   @default("PRESENT")
    arrival   String?
    departure String?
    user      User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
    seat      Seat?    @relation(fields: [seat_id], references: [id])
    @@unique([user_id, date])
  }
  ```
- [ ] Relations sur `User` : `seats Seat[]`, `attendances Attendance[]`
- [ ] Migration : `pnpm prisma migrate dev --name add_seat_attendance`

#### Critères d'acceptation

- [ ] Migration passe
- [ ] `@@unique([tableNumber, seatNumber])` — pas de doublon de place
- [ ] `user_id` unique sur Seat — un siège = un user
- [ ] `@@unique([user_id, date])` sur Attendance — un pointage par user par jour
- [ ] `pnpm typecheck` passe

---

### 🎟️ S3.2 — API CRUD Seat (assignation)

**Dev :** Back1 · **Pts :** 8 · **Dépend de :** S3.1

> En tant qu'**Admin**, je veux créer des tables/sièges et assigner un
> utilisateur à un siège précis (table N / siège M).

#### Tâches

- [ ] Schéma Zod : `createSeatSchema` (tableNumber, seatNumber)
- [ ] Server Action `createSeatsAction(tableNumber, count)` — crée N sièges d'une table
- [ ] Server Action `assignSeatAction(seatId, userId)` — assigne un user à un siège
- [ ] Server Action `unassignSeatAction(seatId)` — libère un siège
- [ ] Server Action `listSeatsAction()` — tous les sièges avec user assigné
- [ ] Vérifications : admin only, siège unique, user unique par siège

#### Critères d'acceptation

- [ ] Créer une table avec 10 sièges fonctionne
- [ ] Assigner un user à un siège fonctionne
- [ ] Assigner 2 users au même siège → erreur
- [ ] Assigner 2 sièges au même user → erreur
- [ ] Un non-admin reçoit 403

---

### 🎟️ S3.3 — API Attendance (pointage avec place)

**Dev :** Back2 · **Pts :** 8 · **Dépend de :** S3.1, S3.2

> En tant qu'**USER/BENEVOLE**, je veux pointer ma présence sur ma place
> (table + siège) avec heure d'arrivée et de départ.

#### Tâches

- [ ] Schéma Zod : `markAttendanceSchema` (date, seatId, arrival?, departure?)
- [ ] Server Action `markAttendanceAction` :
  - Vérifie que le siège est assigné au user connecté
  - Crée/met à jour `Attendance` (upsert sur user_id + date)
- [ ] Server Action `listAttendanceAction(filters)` — liste avec jointure Seat + User
- [ ] Server Action `getDailyAttendanceAction(date)` — pointage du jour
- [ ] Validation : un seul pointage par user par jour

#### Critères d'acceptation

- [ ] Un user pointe sur SON siège uniquement
- [ ] Pointer 2 fois le même jour → mise à jour, pas doublon
- [ ] Un user pointe sur le siège d'un autre → erreur
- [ ] `pnpm typecheck` passe

---

### 🎟️ S3.4 — API filtre calendrier

**Dev :** Back2 · **Pts :** 5 · **Dépend de :** S3.3

> En tant qu'**Admin**, je veux filtrer les présences par période
> (jour, semaine, mois) pour consulter l'historique.

#### Tâches

- [ ] Server Action `getAttendanceByRange(startDate, endDate, filters?)`
- [ ] Paramètres : `dateFrom`, `dateTo`, `userId?`, `statut?`, `tableNumber?`
- [ ] Agrégation : total présents/absents/retards par jour
- [ ] Retour structuré pour le composant calendrier

#### Critères d'acceptation

- [ ] Filtre par jour fonctionne
- [ ] Filtre par semaine fonctionne
- [ ] Filtre par mois fonctionne
- [ ] Agrégation correcte

---

### 🎟️ S3.5 — Migration Presence → Attendance

**Dev :** Back1 · **Pts :** 5 · **Dépend de :** S3.1

> En tant que **Lead**, je veux migrer les données de l'ancien modèle
> `Presence` vers `Attendance` sans perte de données.

#### Tâches

- [ ] Script de migration : `prisma/migrations/` ou script tsx
- [ ] Copier `Presence` → `Attendance` (user_id, date, statut, arrival/departure)
- [ ] Marquer les anciennes présences sans `seat_id` (null)
- [ ] Après validation : supprimer l'ancien modèle `Presence`
- [ ] Mettre à jour le seed pour utiliser `Attendance`

#### Critères d'acceptation

- [ ] Toutes les présences existantes sont migrées
- [ ] Aucune donnée perdue
- [ ] L'ancien modèle `Presence` est supprimé
- [ ] Le seed fonctionne avec les nouveaux modèles
- [ ] `pnpm prisma migrate dev` passe

---

### 🎟️ S3.6 — UI grille Tables/Sièges

**Dev :** Front1 · **Pts :** 8 · **Dépend de :** S1.5, S3.2

> En tant qu'**Admin**, je veux visualiser une grille de toutes les tables et
> sièges, avec leur statut (libre/occupé) et l'utilisateur assigné.

#### Tâches

- [ ] Composant `SeatGrid` :
  - Grille visuelle des tables (chaque table = un bloc de sièges)
  - Chaque siège affiche : numéro, statut (libre=vert, occupé=rouge, absent=gris)
  - Tooltip : nom de l'utilisateur assigné
- [ ] Filtre par table
- [ ] Cliquer sur un siège libre → modal d'assignation
- [ ] Style : shadcn Card + Badge, responsive
- [ ] TanStack Query pour le fetch

#### Critères d'acceptation

- [ ] La grille affiche toutes les tables et sièges
- [ ] Les statuts sont colorés correctement
- [ ] Le tooltip montre le user assigné
- [ ] L'assignation depuis la grille fonctionne
- [ ] Responsive mobile

---

### 🎟️ S3.7 — UI pointage avec sélection place

**Dev :** Front1 · **Pts :** 5 · **Dépend de :** S1.5, S3.3

> En tant qu'**USER**, je veux pointer ma présence en sélectionnant ma place
> (table + siège) avec mon heure d'arrivée.

#### Tâches

- [ ] Composant `AttendanceForm` :
  - Affiche la place assignée du user (table + siège)
  - Bouton "Pointer l'arrivée" → `markAttendanceAction`
  - Bouton "Pointer le départ" → `markAttendanceAction`
  - Horloge/heure courante affichée
- [ ] Si pas de place assignée : message "Contactez l'admin pour une assignation"
- [ ] Toast de confirmation à chaque pointage
- [ ] Déjà pointé aujourd'hui → affiche l'état actuel

#### Critères d'acceptation

- [ ] Le user voit sa place assignée
- [ ] L'arrivée se pointe en 1 clic
- [ ] Le départ se pointe en 1 clic
- [ ] L'état actuel du jour est visible
- [ ] Sans place → message d'aide

---

### 🎟️ S3.8 — UI filtre calendrier

**Dev :** Front2 · **Pts :** 5 · **Dépend de :** S1.6, S3.4

> En tant qu'**Admin**, je veux naviguer dans un calendrier pour consulter
> les présences par jour, semaine ou mois.

#### Tâches

- [ ] Composant `AttendanceCalendar` :
  - Sélecteur de période : jour / semaine / mois
  - Navigation ← → (période précédente/suivante)
  - Vue liste des présences de la période sélectionnée
- [ ] Filtres additionnels : statut, table, utilisateur
- [ ] Résumé : total présents / absents / retards
- [ ] Style : shadcn Calendar ou composant custom léger

#### Critères d'acceptation

- [ ] Navigation jour/semaine/mois fonctionne
- [ ] Les présences de la période s'affichent
- [ ] Les filtres statut/table/user fonctionnent
- [ ] Le résumé est correct

---

### 🎟️ S3.9 — UI historique présence personnel

**Dev :** Front2 · **Pts :** 3 · **Dépend de :** S1.6, S3.3

> En tant qu'**USER**, je veux consulter mon historique de présences
> (mois en cours + mois précédents).

#### Tâches

- [ ] Section dans le profil ou page dédiée
- [ ] Liste des présences du mois courant
- [ ] Sélecteur de mois
- [ ] Statut par jour (PRESENT / ABSENT / RETARD)
- [ ] Total de présence du mois

#### Critères d'acceptation

- [ ] L'historique du mois courant s'affiche
- [ ] Le changement de mois fonctionne
- [ ] Le total est correct

---

### 🎟️ S3.10 — Tests fonctionnels

**Dev :** Équipe · **Pts :** 2 · **Dépend de :** toutes

#### Tâches

- [ ] Tests Vitest : `createSeatsAction` (succès/doublon/403)
- [ ] Tests Vitest : `markAttendanceAction` (succès/déjà pointé/siège d'un autre)
- [ ] Tests Vitest : `getAttendanceByRange` (jour/semaine/mois)
- [ ] Test manuel : parcours complet assignation place → pointage → grille → calendrier
- [ ] `pnpm lint` + `pnpm typecheck` + `pnpm build` passent

#### Critères d'acceptation

- [ ] Tous les tests passent
- [ ] Aucune erreur lint/typecheck/build
- [ ] Parcours complet validé manuellement

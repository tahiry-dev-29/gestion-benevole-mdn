# Sprint 2 — Gestion Utilisateur (USER) & Vérification PDF

> ⏱️ **Durée :** 2 semaines · 🎯 **Objectif :** création/modification d'utilisateurs USER avec champs étudiants,
> liste filtrable (présence, fichier, place, ECTS), transfert USER → BENEVOLE via upload PDF validé par l'admin
> 📌 **Statut :** ⚪ À venir · **Vélocité cible :** ~40 points

- [x] Toutes les cases cochées = PR fusionnée + revue Lead (CDC §6)

## 🎯 Sprint Goal

Permettre à l'admin de créer des comptes USER (étudiants) avec toutes les informations
scolaires, de les filtrer efficacement dans une liste, et de les promouvoir en BENEVOLE
via une vérification PDF — le tout avec une UI shadcn + TanStack Table moderne.

## 🧮 Estimation & dépendances

| Story                                         | Dev    | Points | Priorité | Dépend de  |
| --------------------------------------------- | ------ | ------ | -------- | ---------- |
| S2.1 — Schéma USER + champs étudiants         | Back1  | 5      | Haute    | S1.1       |
| S2.2 — API création USER (champs étudiants)   | Back1  | 8      | Haute    | S2.1       |
| S2.3 — Upload PDF vérification (Blob)         | Back2  | 8      | Haute    | S2.1       |
| S2.4 — Action transfert USER → BENEVOLE       | Back1  | 5      | Haute    | S2.2, S2.3 |
| S2.5 — API liste USER + filtres               | Back2  | 8      | Haute    | S2.1       |
| S2.6 — UI création USER (formulaire)          | Front1 | 5      | Haute    | S1.5, S2.2 |
| S2.7 — UI liste UTILISATEURS (TanStack Table) | Front1 | 8      | Haute    | S1.5, S2.5 |
| S2.8 — Modal upload PDF + promouvoir          | Front1 | 5      | Haute    | S2.4, S2.7 |
| S2.9 — UI profil USER (champs étudiants)      | Front2 | 3      | Moyenne  | S1.6, S2.2 |
| S2.10 — Tests fonctionnels                    | Équipe | 2      | Haute    | toutes     |

**Capacité :** ~40 points · **Chargement :** 40 points (passant).

## 🎫 Sprint Board

| Story                                   | Status | Dev    | Points | Backlog | En cours | Test | Fait |
| --------------------------------------- | ------ | ------ | ------ | ------- | -------- | ---- | ---- |
| S2.1 — Schéma USER + champs étudiants   | ⚪     | Back1  | 5      | ☐       | ☐        | ☐    | ☐    |
| S2.2 — API création USER                | ⚪     | Back1  | 8      | ☐       | ☐        | ☐    | ☐    |
| S2.3 — Upload PDF vérification          | ⚪     | Back2  | 8      | ☐       | ☐        | ☐    | ☐    |
| S2.4 — Action transfert USER → BENEVOLE | ⚪     | Back1  | 5      | ☐       | ☐        | ☐    | ☐    |
| S2.5 — API liste USER + filtres         | ⚪     | Back2  | 8      | ☐       | ☐        | ☐    | ☐    |
| S2.6 — UI création USER                 | ⚪     | Front1 | 5      | ☐       | ☐        | ☐    | ☐    |
| S2.7 — UI liste UTILISATEURS            | ⚪     | Front1 | 8      | ☐       | ☐        | ☐    | ☐    |
| S2.8 — Modal upload PDF + promouvoir    | ⚪     | Front1 | 5      | ☐       | ☐        | ☐    | ☐    |
| S2.9 — UI profil USER                   | ⚪     | Front2 | 3      | ☐       | ☐        | ☐    | ☐    |
| S2.10 — Tests fonctionnels              | ⚪     | Équipe | 2      | ☐       | ☐        | ☐    | ☐    |

## 📦 Backlog (User Stories)

### 🎟️ S2.1 — Schéma USER + champs étudiants

**Dev :** Back1 · **Pts :** 5 · **Dépend de :** S1.1

> En tant que **Lead**, je veux que le modèle User porte tous les champs scolaires
> nécessaires à l'inscription d'un étudiant.

#### Tâches

- [ ] Ajouter champs sur `User` dans `prisma/schema.prisma` :
  - `schoolName String?`
  - `filiere String?`
  - `anneeScolaire String?`
  - `ects Int?`
  - `genre String?`
  - `verificationFile String?` (URL Vercel Blob)
  - `verifiedAt DateTime?`
- [ ] Migration Prisma : `pnpm prisma migrate dev --name add_student_fields`
- [ ] Mettre à jour `prisma/seed.ts` : créer un USER de test avec ces champs
- [ ] Ajouter `USER` à `enum Role` (si pas déjà fait en Sprint 1)

#### Critères d'acceptation

- [ ] `pnpm prisma migrate dev` passe sans erreur
- [ ] Le seed crée un USER avec tous les champs
- [ ] `pnpm typecheck` passe

---

### 🎟️ S2.2 — API création USER (champs étudiants)

**Dev :** Back1 · **Pts :** 8 · **Dépend de :** S2.1

> En tant qu'**Admin**, je veux créer un utilisateur avec toutes ses informations
> scolaires (établissement, filière, année, ECTS, genre, âge).

#### Tâches

- [ ] Schéma Zod `user.schema.ts` : `createUserSchema` avec tous les champs
- [ ] Server Action `createUserAction` dans `user.action.ts`
- [ ] Vérification session admin (`session.user.role === "ADMIN"`)
- [ ] Hash du mot de passe (`bcryptjs`)
- [ ] Rôle par défaut : `USER`
- [ ] Retour `{ success, error?, user? }`

#### Critères d'acceptation

- [ ] Un ADMIN peut créer un USER avec tous les champs
- [ ] Un non-admin reçoit `{ success: false }`
- [ ] Champs manquants → erreur Zod claire
- [ ] `pnpm typecheck` passe

---

### 🎟️ S2.3 — Upload PDF vérification (Vercel Blob)

**Dev :** Back2 · **Pts :** 8 · **Dépend de :** S2.1

> En tant qu'**Admin**, je veux uploader un fichier PDF de vérification (pièce
> justificative) associé à un utilisateur.

#### Tâches

- [ ] Server Action `uploadVerificationPdfAction(userId, file)`
- [ ] Validation : type MIME `application/pdf`, taille max 5 Mo
- [ ] Upload vers Vercel Blob (`@vercel/blob`)
- [ ] Sauvegarde URL dans `User.verificationFile`
- [ ] Gestion d'erreur (upload échoué, fichier invalide)

#### Critères d'acceptation

- [ ] Un PDF valide ≤ 5 Mo est uploadé et stocké
- [ ] Un non-PDF ou > 5 Mo est rejeté avec message clair
- [ ] L'URL est sauvegardée en base
- [ ] `pnpm typecheck` passe

---

### 🎟️ S2.4 — Action transfert USER → BENEVOLE

**Dev :** Back1 · **Pts :** 5 · **Dépend de :** S2.2, S2.3

> En tant qu'**Admin**, je veux valider un utilisateur (après vérification PDF)
> pour qu'il passe du rôle USER au rôle BENEVOLE.

#### Tâches

- [ ] Server Action `promoteUserToBenevoleAction(userId)`
- [ ] Vérifications : session ADMIN, user existe, PDF uploadé (`verificationFile` non null)
- [ ] Mise à jour : `role = "BENEVOLE"`, `verifiedAt = now()`
- [ ] Log dans `decisions.md` si décision d'archi

#### Critères d'acceptation

- [ ] Un ADMIN peut promouvoir un USER qui a un PDF
- [ ] Un USER sans PDF ne peut pas être promu (erreur claire)
- [ ] Un non-admin reçoit 403
- [ ] Après promotion, le user apparaît dans la liste BENEVOLE
- [ ] `pnpm typecheck` passe

---

### 🎟️ S2.5 — API liste USER + filtres

**Dev :** Back2 · **Pts :** 8 · **Dépend de :** S2.1

> En tant qu'**Admin**, je veux lister les utilisateurs USER avec des filtres
> par présence, fichier de vérification, place et ECTS.

#### Tâches

- [ ] Server Action `listUsersAction` avec filtres optionnels :
  - `presence`: `PRESENT | ABSENT | RETARD` (jointure Attendance du jour)
  - `verification`: `VALIDE | EN_ATTENTE | ABSENT`
  - `seat`: `tableNumber-seatNumber`
  - `minEcts`: nombre minimum
- [ ] Pagination (offset/limit)
- [ ] Retour : `User` + `seat` + `attendance` du jour
- [ ] Exclure les `deletedAt != null`

#### Critères d'acceptation

- [ ] Chaque filtre fonctionne isolément et combiné
- [ ] Pagination correcte
- [ ] Un non-admin reçoit 403
- [ ] `pnpm typecheck` passe

---

### 🎟️ S2.6 — UI création USER (formulaire)

**Dev :** Front1 · **Pts :** 5 · **Dépend de :** S1.5, S2.2

> En tant qu'**Admin**, je veux un formulaire de création d'utilisateur avec
> tous les champs scolaires, validé par Zod côté client.

#### Tâches

- [ ] Composant `CreateUserModal` (shadcn Dialog)
- [ ] React Hook Form + Zod resolver
- [ ] Champs : prénom, nom, email, mot de passe, âge, genre, schoolName, filière, année scolaire, ECTS
- [ ] Feedback : toast `sonner` succès/erreur
- [ ] Reset du formulaire après soumission

#### Critères d'acceptation

- [ ] Tous les champs obligatoires validés côté client
- [ ] Toast de succès à la création
- [ ] Modal fermé + liste rafraîchie
- [ ] Style cohérent shadcn/ui

---

### 🎟️ S2.7 — UI liste UTILISATEURS (TanStack Table)

**Dev :** Front1 · **Pts :** 8 · **Dépend de :** S1.5, S2.5

> En tant qu'**Admin**, je veux une table filtrable de tous les utilisateurs USER
> avec filtres présence, fichier, place, ECTS et actions (éditer, promouvoir).

#### Tâches

- [ ] `UsersTable` avec TanStack Table + `@tanstack/react-query`
- [ ] Colonnes : nom, email, rôle, school, filière, ECTS, place, statut présence, vérification
- [ ] Barre de filtres : présence, fichier, place, ECTS minimum
- [ ] Recherche par nom/email
- [ ] Pagination
- [ ] Actions par ligne : éditer, promouvoir BENEVOLE, désactiver
- [ ] Style : shadcn Table, responsive

#### Critères d'acceptation

- [ ] Les 4 filtres fonctionnent
- [ ] La recherche fonctionne
- [ ] Pagination correcte
- [ ] Bouton "Promouvoir" visible uniquement pour USER sans PDF validé
- [ ] Style moderne et responsive

---

### 🎟️ S2.8 — Modal upload PDF + promouvoir

**Dev :** Front1 · **Pts :** 5 · **Dépend de :** S2.4, S2.7

> En tant qu'**Admin**, je veux uploader un PDF de vérification puis promouvoir
> un utilisateur en BENEVOLE depuis la liste.

#### Tâches

- [ ] Composant `VerificationPdfModal` (shadcn Dialog)
- [ ] Input file acceptant `.pdf` uniquement
- [ ] Upload → `uploadVerificationPdfAction`
- [ ] Bouton "Promouvoir en BENEVOLE" → `promoteUserToBenevoleAction`
- [ ] État : désactivé si pas de PDF, en cours d'upload, succès
- [ ] Toast de confirmation

#### Critères d'acceptation

- [ ] Upload PDF fonctionne
- [ ] Bouton promouvoir désactivé sans PDF
- [ ] Après promotion, la ligne passe de USER à BENEVOLE
- [ ] Erreurs affichées via toast

---

### 🎟️ S2.9 — UI profil USER (champs étudiants)

**Dev :** Front2 · **Pts :** 3 · **Dépend de :** S1.6, S2.2

> En tant qu'**USER**, je veux consulter et modifier mon profil avec mes
> informations scolaires.

#### Tâches

- [ ] Extension de `profile-form.tsx` avec champs : schoolName, filière, année scolaire, ECTS, genre
- [ ] Lecture seule pour USER (champs modifiables : contact, photo)
- [ ] Mise à jour via `updateProfileAction`

#### Critères d'acceptation

- [ ] Les champs étudiants sont affichés
- [ ] Un USER peut modifier ses infos de contact
- [ ] Un USER ne peut pas modifier ses ECTS (admin only)

---

### 🎟️ S2.10 — Tests fonctionnels

**Dev :** Équipe · **Pts :** 2 · **Dépend de :** toutes

#### Tâches

- [ ] Tests Vitest : `createUserAction` (succès/échec/403)
- [ ] Tests Vitest : `promoteUserToBenevoleAction` (avec/sans PDF)
- [ ] Tests Vitest : `listUsersAction` (chaque filtre)
- [ ] Test manuel : parcours complet création → upload PDF → promotion
- [ ] `pnpm lint` + `pnpm typecheck` + `pnpm build` passent

#### Critères d'acceptation

- [ ] Tous les tests passent
- [ ] Aucune erreur lint/typecheck/build
- [ ] Parcours complet validé manuellement

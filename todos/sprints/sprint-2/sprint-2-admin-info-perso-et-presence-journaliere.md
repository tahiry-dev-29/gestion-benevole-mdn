# Sprint 2 — Admin : Info perso & Présence journalière

> ⏱️ **Durée :** 2 semaines · 🎯 **Objectif :** CRUD de la fiche bénévole (info + photo)
>
> - pointage quotidien (arrivée/départ) et historique
>   📌 **Statut :** ⚪ À venir · **Vélocité cible :** ~40 points

- [x] Toutes les cases cochées = PR fusionnée + revue Lead (CDC §6)

## 🎯 Sprint Goal

Donner au bénévole un espace personnel éditable et au Lead/admin un pointage
quotidien fiable avec historique. Les données restent privées au propriétaire ou à l'admin.

## 🧮 Estimation & dépendances

| Story                                | Dev    | Points | Priorité | Dépend de  |
| ------------------------------------ | ------ | ------ | -------- | ---------- |
| S2.1 — API CRUD Info perso           | Back1  | 5      | Haute    | S1.1, S1.3 |
| S2.2 — Upload photo de profil        | Back1  | 5      | Moyenne  | S2.1       |
| S2.3 — API Présence journalière      | Back2  | 8      | Haute    | S1.1, S1.3 |
| S2.4 — UI Fiche info perso           | Front1 | 5      | Haute    | S1.5, S2.1 |
| S2.5 — UI Présence + liste bénévoles | Front1 | 8      | Haute    | S1.5, S2.3 |
| S2.6 — Tests fonctionnels            | Équipe | 2      | Haute    | toutes     |

**Capacité :** ~40 points · **Chargement :** 33 points.

## 🎫 Sprint Board

| Story                                | Dev    | Points | Backlog | En cours | Test | Fait |
| ------------------------------------ | ------ | ------ | ------- | -------- | ---- | ---- |
| S2.1 — API CRUD Info perso           | Back1  | 5      | ☐       | ☐        | ☐    | ☐    |
| S2.2 — Upload photo de profil        | Back1  | 5      | ☐       | ☐        | ☐    | ☐    |
| S2.3 — API Présence journalière      | Back2  | 8      | ☐       | ☐        | ☐    | ☐    |
| S2.4 — UI Fiche info perso           | Front1 | 5      | ☐       | ☐        | ☐    | ☐    |
| S2.5 — UI Présence + liste bénévoles | Front1 | 8      | ☐       | ☐        | ☐    | ☐    |
| S2.6 — Tests fonctionnels            | Équipe | 2      | ☐       | ☐        | ☐    | ☐    |

## 📦 Backlog (User Stories)

### 🎟️ S2.1 — API CRUD "Info perso" bénévole

**Dev :** Back1 · **Pts :** 5 · **Dépend de :** S1.1, S1.3

> En tant que **bénévole**, je veux gérer ma fiche (nom, contact, rôle, photo, date
> d'entrée) afin de tenir mon profil à jour.

#### Tâches

- [ ] Feature `src/features/user/` : `user.schema.ts` (Zod nom/prenom/email/role/photo)
- [ ] Server Actions : `getProfile`, `updateProfile` (PATCH), `createUser` & `deleteUser` (admin)
- [ ] Ownership : bénévole modifie SON profil ; admin modifie tous
- [ ] `date_entree` calculée (`@default(now())`)

**Implémentation :** `prisma/model User`, `src/features/user/user.action.ts`,
`src/features/user/user.schema.ts`.

#### Critères d'acceptation

- [ ] CRUD testé (create/read/update/delete)
- [ ] Un bénévole reçoit 403 sur le profil d'un autre

### 🎟️ S2.2 — Upload photo de profil

**Dev :** Back1 · **Pts :** 5 · **Dépend de :** S2.1

#### Tâches

- [ ] Route handler upload : validation type (jpg/png/webp) + taille (≤ 2 Mo)
- [ ] Stockage : `public/uploads/` (uuid), suppression ancienne photo
- [ ] URL persistée dans `User.photo`

**Implémentation :** `app/api/upload/route.ts`, `public/uploads/`.

#### Acceptation (Gherkin)

- **Étant donné** une image > 2 Mo, **Quand** je l'upload, **Alors** rejet avec message.
- **Étant donné** une image valide, **Quand** je l'upload, **Alors** la photo s'affiche en preview.

### 🎟️ S2.3 — API Présence journalière (pointage)

**Dev :** Back2 · **Pts :** 8 · **Dépend de :** S1.1, S1.3

> En tant que **bénévole**, je veux pointer mon arrivée/départ quotidien pour suivre
> mes heures.

#### Tâches

- [ ] Feature `src/features/presence/` : `presence.schema.ts` + `presence.action.ts`
- [ ] `pointerArrivee` : crée la présence du jour (heure locale, PRESENT) — unicité (user,date)
- [ ] `pointerDepart` : met à jour `heure_depart`
- [ ] `getHistorique` : pagination + filtre date/bénévole
- [ ] `computeHeures` : départ − arrivée (minutes)

**Implémentation :** `prisma/model Presence`, `src/features/presence/presence.action.ts`.

#### Critères d'acceptation

- [ ] Deux pointages le même jour → rejet explicite
- [ ] Historique paginé et filtrable par date

#### Tests

- [ ] Unit : calcul heures (cas limites : départ < arrivée, absences)
- [ ] Intégration : doublon refusé par la DB (UNIQUE)

### 🎟️ S2.4 — UI Fiche "Info perso"

**Dev :** Front1 · **Pts :** 5 · **Dépend de :** S1.5, S2.1

#### Tâches

- [ ] `/admin/benevoles/[id]` : fiche consultable (photo, contact, rôle, date d'entrée)
- [ ] Formulaire pré-rempli + validation Zod client
- [ ] Upload photo avec preview avant enregistrement
- [ ] Feedback `sonner` (succès/erreur)

**Implémentation :** `app/admin/benevoles/[id]/page.tsx`,
`src/components/benevole/profile-form.tsx`.

#### Critères d'acceptation

- [ ] Édition persiste après rechargement

### 🎟️ S2.5 — UI Présence journalière + liste bénévoles

**Dev :** Front1 · **Pts :** 8 · **Dépend de :** S1.5, S2.3

#### Tâches

- [ ] `/admin/presence` : bouton "Pointer arrivée/départ" + état du jour en temps réel (optimistic UI)
- [ ] Historique du jour/mois (tableau) avec heures calculées côté serveur
- [ ] `/admin/benevoles` : liste (table + recherche + tri par nom)
- [ ] Accès rapide à la fiche depuis la liste

**Implémentation :** `app/admin/presence/page.tsx`,
`app/admin/benevoles/page.tsx`, `src/components/presence/pointage.tsx`.

#### Critères d'acceptation

- [ ] Un clic "Pointer" met à jour l'état sans reload complet
- [ ] La liste bénévoles est triée + filtrable

### 🎟️ S2.6 — Tests fonctionnels du Sprint

**Dev :** Toute l'équipe · **Pts :** 2

- [ ] Parcours : créer bénévole → fiche → photo → pointer arrivée/départ
- [ ] Contraintes : double pointage, cross-user (403)
- [ ] Bugs (max 2 boucles, sinon escalade Lead)

## 🧪 Critères d'acceptation du Sprint

- [ ] `pnpm lint` + `pnpm typecheck` + `pnpm build` verts
- [ ] Fiche bénévole + pointage journalier opérationnels
- [ ] Règles sécurité (ownership + unicité) validées par tests

## 🪵 Definition of Done (Sprint)

- [ ] Cases `[x]` = commit/PR + revue Lead
- [ ] Composants `ui/*` réutilisés (table, form, dialog, avatar)
- [ ] Rétro remplie + board à jour

## 📅 Rituels du Sprint

| Rituel          | Quand            |
| --------------- | ---------------- |
| Sprint Planning | J1               |
| Stand-up        | 2×/sem. (10 min) |
| Démo + Rétro    | Fin de sprint    |

## ✍️ Rétrospective

| Ce qui a bien marché | À améliorer | Actions |
| -------------------- | ----------- | ------- |
| _vide_               | _vide_      | _vide_  |

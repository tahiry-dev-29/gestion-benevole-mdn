# Sprint 1 — Authentification & Fondations

> ⏱️ **Durée :** 2 semaines · 🎯 **Objectif :** accès sécurisé (inscription/connexion/logout)
>
> - fondations UI (layouts admin/public, RBAC, shell PWA offline)
>   📌 **Statut :** ⚪ À venir · **Vélocité cible :** ~40 points

- [x] Toutes les cases cochées = PR fusionnée + revue Lead (CDC §6)

## 🎯 Sprint Goal

Permettre aux bénévoles et au Lead de s'authentifier, puis mettre en place les layouts
admin/public et le shell PWA offline. Rien de métier autre que l'accès n'est livré.

## 🧮 Estimation & dépendances

| Story                                   | Dev    | Points | Priorité | Dépend de |
| --------------------------------------- | ------ | ------ | -------- | --------- |
| S1.1 — Schéma finalisé + migrations     | Back1  | 5      | Haute    | S0.4      |
| S1.2 — API Auth (register/login/logout) | Back1  | 8      | Haute    | S1.1      |
| S1.3 — Middleware & RBAC                | Back2  | 5      | Haute    | S1.2      |
| S1.4 — UI Page de connexion             | Front1 | 5      | Haute    | S1.2,S1.5 |
| S1.5 — Layout Admin (sidebar/navbar)    | Front1 | 5      | Moyenne  | S1.2      |
| S1.6 — Layout Public (header/footer)    | Front2 | 5      | Moyenne  | —         |
| S1.7 — Service worker / offline shell   | Front2 | 5      | Moyenne  | S0.6      |
| S1.8 — Tests fonctionnels               | Équipe | 2      | Haute    | toutes    |
| S1.9 — API Gestion Utilisateur          | Back1  | 5      | Moyenne  | S1.1,S1.2 |
| S1.10 — UI Gestion Utilisateur          | Front1 | 5      | Moyenne  | S1.5,S1.9 |
| S1.11 — Inviter & reset mdp             | Back1  | 5      | Moyenne  | S1.2      |

**Capacité :** ~50 points · **Chargement :** 50 points (S1.9–S1.11 inclus) —
reportable en S2 si besoin (S1.11 priorisé S2 possible).

## 🎫 Sprint Board

| Story                                   | Dev    | Points | Backlog | En cours | Test | Fait |
| --------------------------------------- | ------ | ------ | ------- | -------- | ---- | ---- |
| S1.1 — Schéma finalisé + migrations     | Back1  | 5      | ☐       | ☐        | ☐    | ☐    |
| S1.2 — API Auth (register/login/logout) | Back1  | 8      | ☐       | ☐        | ☐    | ☐    |
| S1.3 — Middleware & RBAC                | Back2  | 5      | ☐       | ☐        | ☐    | ☐    |
| S1.4 — UI Page de connexion             | Front1 | 5      | ☐       | ☐        | ☐    | ☐    |
| S1.5 — Layout Admin (sidebar/navbar)    | Front1 | 5      | ☐       | ☐        | ☐    | ☐    |
| S1.6 — Layout Public (header/footer)    | Front2 | 5      | ☐       | ☐        | ☐    | ☐    |
| S1.7 — Service worker / offline shell   | Front2 | 5      | ☐       | ☐        | ☐    | ☐    |
| S1.8 — Tests fonctionnels               | Équipe | 2      | ☐       | ☐        | ☐    | ☐    |
| S1.9 — API Gestion Utilisateur          | Back1  | 5      | ☐       | ☐        | ☐    | ☐    |
| S1.10 — UI Gestion Utilisateur          | Front1 | 5      | ☐       | ☐        | ☐    | ☐    |
| S1.11 — Inviter & reset mdp             | Back1  | 5      | ☐       | ☐        | ☐    | ☐    |

## 📦 Backlog (User Stories)

### 🎟️ S1.1 — Finaliser le schéma Prisma & migrations

**Dev :** Back1 · **Pts :** 5 · **Priorité :** Haute · **Dépend de :** S0.4

> En tant que **Dev Backend**, je veux un schéma Prisma robuste afin de garantir l'intégrité
> des données (unicité pointage, rôles).

#### Tâches

- [ ] Ajouter les enums : `StatutPresence` (PRESENT/ABSENT/RETARD),
      `StatutPublication` (BROUILLON/PUBLIE), `StatutTemoignage` (EN_ATTENTE/PUBLIE/REJETE)
- [ ] Contraintes d'unicité : `Presence.user_id + date`, `Observation.user_id + mois + annee`
- [ ] Vérifier relations + `onDelete` (cascade sur présence/observation/crédit)
- [ ] `prisma migrate dev` + régénération du client
- [ ] Seed : 1 `ADMIN` + 2 bénévoles (hash bcrypt)

**Implémentation :** `prisma/schema.prisma`, `prisma/migrations/*`, `src/lib/prisma.ts`.

#### Critères d'acceptation

- [ ] `pnpm typecheck` vert
- [ ] Un doublon de présence (même user/date) est rejeté par la DB (UNIQUE)

### 🎟️ S1.2 — API Auth (register / login / logout)

**Dev :** Back1 · **Pts :** 8 · **Priorité :** Haute · **Dépend de :** S1.1

> En tant que **bénévole**, je veux m'authentifier avec email/mdp afin d'accéder à mon espace.

#### Tâches

- [ ] Feature `src/features/auth/` : `auth.schema.ts` (Zod) + `auth.action.ts`
- [ ] `register` : validation email + mdp (min 8) + hash + création `User`
- [ ] `login` : vérif credentials + création session JWT
- [ ] `logout` : destruction session + redirect `/login`
- [ ] next-auth v4 : `CredentialsProvider` + JWT, `AUTH_SECRET`/`NEXTAUTH_URL` en env
- [ ] Hook `useSession` exposé (NextAuth React)

**Implémentation :** `src/features/auth/auth.action.ts`, `app/api/auth/[...nextauth]/route.ts`,
`src/lib/authOptions.ts`.

#### Acceptation (Gherkin)

- **Étant donné** un compte valide, **Quand** l'utilisateur se connecte, **Alors** une
  session JWT est créée et il est redirigé `/dashboard`.
- **Étant donné** un mauvais mot de passe, **Quand** il soumet, **Alors** un message
  d'erreur s'affiche (sonner) sans crash.

### 🎟️ S1.3 — Middleware de protection & Rôles (RBAC)

**Dev :** Back2 · **Pts :** 5 · **Priorité :** Haute · **Dépend de :** S1.2

> En tant que **Lead**, je veux protéger les routes admin afin que les bénévoles non autorisés
> soient bloqués.

#### Tâches

- [ ] `middleware.ts` : protection `/admin/**` + `/dashboard/**`
- [ ] Gate par rôle : `ADMIN` seul sur `/admin/**` ; `BENEVOLE` → 403
- [ ] Server Actions sensibles vérifient la session serveur

**Implémentation :** `middleware.ts`, helper `getServerSession` dans chaque action.

#### Acceptation (Gherkin)

- **Étant donné** un non authentifié, **Quand** il accède à `/admin`, **Alors** il est
  redirigé `/login`.
- **Étant donné** un bénévole, **Quand** il tente `/admin`, **Alors** 403 affiché.

### 🎟️ S1.4 — UI Page de connexion

**Dev :** Front1 · **Pts :** 5 · **Priorité :** Haute · **Dépend de :** S1.2,S1.5

#### Tâches

- [ ] Route `/login` : formulaire (email/mdp), validation Zod en temps réel
- [ ] États loading + erreurs via `sonner`
- [ ] Lien d'inscription (register) si activé
- [ ] Responsive mobile

**Implémentation :** `app/login/page.tsx`, `src/components/auth/login-form.tsx`.

### 🎟️ S1.5 — Layout Admin

**Dev :** Front1 · **Pts :** 5 · **Priorité :** Moyenne · **Dépend de :** S1.4

#### Tâches

- [ ] `app/admin/layout.tsx` : sidebar (Dashboard, Bénévoles, Présence, Observations,
      Crédits, Activités, Partages, Témoignages)
- [ ] Navbar + `user-dropdown` (avatar, logout)
- [ ] Responsive → sidebar en `sheet` mobile
- [ ] Link actif mis en surbrillance

#### Critères d'acceptation

- [ ] Navigation fluide entre toutes les sections (section "à venir" si non implémentée)

### 🎟️ S1.6 — Layout Public

**Dev :** Front2 · **Pts :** 5 · **Priorité :** Moyenne · **Dépend de :** —

#### Tâches

- [ ] Header (logo MDN) + footer
- [ ] Nav : Accueil, Activités, Partages, Témoignages, Connexion
- [ ] A11y (landmarks, focus, contrastes)

### 🎟️ S1.7 — Service worker / offline shell

**Dev :** Front2 · **Pts :** 5 · **Priorité :** Moyenne · **Dépend de :** S0.6

#### Tâches

- [ ] SW (`@ducanh2912/next-pwa`) : pré-cache app shell + fallback offline
- [ ] Manifest renforcé (icônes, `theme_color`, `display: standalone`)
- [ ] Test offline DevTools (`CacheStorage` + network offline)

### 🎟️ S1.9 — API Gestion Utilisateur (admin)

**Dev :** Back1 · **Pts :** 5 · **Priorité :** Moyenne · **Dépend de :** S1.1, S1.2

> En tant que **Lead**, je veux lister et gérer les utilisateurs + leurs rôles afin de
> administrer l'organisation.

#### Tâches

- [ ] Feature `src/features/user/` : actions `listUsers`, `getUser`, `updateUserRole`,
      `deleteUser` (soft delete)
- [ ] Zod : rôle `ADMIN`/`BENEVOLE` uniquement (rejeter toute autre valeur)
- [ ] `GET /admin/users?role=&q=` : filtrage + pagination
- [ ] Soft delete : champ `deletedAt` / statut `INACTIF` (compte non authentifiable)

**Implémentation :** `prisma/model User`, `src/features/user/user.action.ts`,
`app/api/users/route.ts`.

#### Acceptation (Gherkin)

- **Étant donné** un admin, **Quand** il change le rôle d'un user, **Alors** le nouveau
  rôle s'applique et l'accès admin se met à jour.
- **Étant donné** un bénévole, **Quand** il tente `/admin/users`, **Alors** 403 retourné.

- [ ] Tests : admin liste + change rôle (optimistic) ; bénévole 403 sur route.

### 🎟️ S1.10 — UI Gestion Utilisateur (admin)

**Dev :** Front1 · **Pts :** 5 · **Priorité :** Moyenne · **Dépend de :** S1.5, S1.9

#### Tâches

- [ ] `app/admin/users` : table (nom, prénom, email, rôle, date d'entrée, statut)
- [ ] Select rôle inline (ADMIN/BENEVOLE) + sauvegarde optimistic + revert en cas d'erreur
- [ ] Badge statut (actif/inactif) + bouton "désactiver"
- [ ] Recherche + tri (nom, date d'entrée)

**Implémentation :** `app/admin/users/page.tsx`,
`src/components/user/users-table.tsx`.

#### Critères d'acceptation

- [ ] Le rôle change sans rechargement complet et persiste après refresh.

### 🎟️ S1.11 — Inviter & réinitialiser mot de passe

**Dev :** Back1 · **Pts :** 5 · **Priorité :** Moyenne · **Dépend de :** S1.2

> En tant que **Lead**, je veux inviter un nouveau bénévole et réinitialiser un mot de
> passe oublié sans connaître l'actuel.

#### Tâches

- [ ] `inviteUser` : crée le compte en `BENEVOLE` + déclenche un email reset (stub OK)
- [ ] `requestReset` + `resetPassword` : token à usage unique, expiration 24h
- [ ] Zod : nouveau mot de passe (min 8) + confirmation

**Implémentation :** `src/features/auth/auth.action.ts`,
`app/(auth)/reset-password/page.tsx`, `app/api/auth/[...nextauth]/route.ts`.

#### Acceptation (Gherkin)

- **Étant donné** un admin invitant un user, **Quand** il soumet, **Alors** un compte
  `BENEVOLE` est créé et un email reset est déclenché (stub OK).
- **Étant donné** un token expiré, **Quand** l'utilisateur réinitialise, **Alors** l'opération
  est rejetée avec message clair.

### 🎟️ S1.8 — Tests fonctionnels du Sprint

**Dev :** Toute l'équipe · **Pts :** 2 · **Priorité :** Haute

- [ ] Parcours : inscription → login → `/dashboard`
- [ ] RBAC : admin vs bénévole (403 `/admin`)
- [ ] Gestion utilisateur : liste, changement rôle, invite + reset mdp
- [ ] Build prod + installabilité PWA
- [ ] Bugs (max 2 boucles, sinon escalade Lead)

## 🧪 Critères d'acceptation du Sprint

- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm build` verts (sortie PR)
- [ ] Auth bout en bout (register → login → logout) fonctionnelle
- [ ] RBAC validé (non connecté + bénévole bloqués sur `/admin`)
- [ ] Gestion utilisateur validée (CRUD rôle + invite/reset mdp admin-only)
- [ ] App shell offline disponible en prod

## 🪵 Definition of Done (Sprint)

- [ ] Chaque case `[x]` = commit/PR + revue Lead
- [ ] `middleware.ts` protège toutes les routes sensibles
- [ ] Rétro remplie + board à jour

## 📅 Rituels du Sprint

| Rituel | Quand |
|---|---||
| Sprint Planning | J1 |
| Stand-up | 2×/sem. (10 min) |
| Démo + Rétro | Fin de sprint |

## ✍️ Rétrospective

| Ce qui a bien marché | À améliorer | Actions |
| -------------------- | ----------- | ------- |
| _vide_               | _vide_      | _vide_  |

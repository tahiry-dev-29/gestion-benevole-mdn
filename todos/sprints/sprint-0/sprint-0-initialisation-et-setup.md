# Sprint 0 — Initialisation & Setup

> ⏱️ **Durée :** 1 semaine · 👥 **Pilote :** Lead · 🎯 **Objectif :** socle
> infrastructure & delivery prêts (repo, Next, Tailwind, Prisma, PWA, CI/CD, hébergement, seed DB)
> 📌 **Statut :** 🔵 En cours · **Vélocité cible :** ~30 points

- [x] Toutes les cases cochées = PR fusionnée + revue Lead (CDC §6)

## 🎯 Sprint Goal

Mettre en place l'infrastructure et la chaîne de delivery du projet. Aucune
route métier n'est exigée, mais la DB seedée, la PWA et le CI/CD doivent être
fonctionnels de sorte que Sprint 1 parte sur des bases validées.

## 🧮 Estimation & dépendances

| Story                                 | Dev         | Points | Priorité | Dépend de | Notes                |
| ------------------------------------- | ----------- | ------ | -------- | --------- | -------------------- |
| S0.1 — Dépôt & branches               | Lead        | 2      | Haute    | —         | —                    |
| S0.2 — Scaffold Next.js               | Lead        | 3      | Haute    | —         | —                    |
| S0.3 — Tailwind v4 + shadcn           | Lead        | 3      | Haute    | S0.2      | —                    |
| S0.4 — PostgreSQL + Prisma            | Lead+Back1  | 5      | Haute    | S0.2      | inclut seed          |
| S0.5 — Variables d'environnement      | Lead        | 2      | Haute    | S0.2      | —                    |
| S0.6 — PWA de base                    | Front2      | 5      | Moyenne  | S0.3      | next-pwa @ducanh2912 |
| S0.7 — Hébergement                    | Lead        | 8      | Moyenne  | S0.4      | Vercel/Neon          |
| S0.8 — CI/CD GitHub Actions           | Lead        | 5      | Moyenne  | S0.4,S0.5 | —                    |
| S0.9 — (Option) Page `/admin/sprints` | Lead+Front1 | 8      | Basse    | S0.4      | —                    |

**Capacité :** ~30 points · **Chargement S0.1–S0.8 :** 33 points → S0.9 optionnel si
capacité suffisante ou reporté sur S1.

## 🎫 Sprint Board

| Story                                 | Dev         | Points | Backlog | En cours | Test | Fait |
| ------------------------------------- | ----------- | ------ | ------- | -------- | ---- | ---- |
| S0.1 — Dépôt & branches               | Lead        | 2      | ☑       | ☐        | ☐    | ☐    |
| S0.2 — Scaffold Next.js               | Lead        | 3      | ☑       | ☐        | ☐    | ☐    |
| S0.3 — Tailwind v4 + shadcn           | Lead        | 3      | ☑       | ☐        | ☐    | ☐    |
| S0.4 — PostgreSQL + Prisma            | Lead+Back1  | 5      | ☑       | ☐        | ☐    | ☐    |
| S0.5 — Variables d'environnement      | Lead        | 2      | ☑       | ☐        | ☐    | ☐    |
| S0.6 — PWA de base                    | Front2      | 5      | ☑       | ☐        | ☐    | ☐    |
| S0.7 — Hébergement                    | Lead        | 8      | ☐       | ☐        | ☐    | ☐    |
| S0.8 — CI/CD GitHub Actions           | Lead        | 5      | ☐       | ☐        | ☐    | ☐    |
| S0.9 — (Option) Page `/admin/sprints` | Lead+Front1 | 8      | ☐       | ☐        | ☐    | ☐    |

## 📦 Backlog (User Stories)

### 🎟️ S0.1 — Dépôt GitHub & branches

**Dev :** Lead · **Pts :** 2 · **Priorité :** Haute · **Dépend de :** —

> En tant que **Lead**, je veux un dépôt Git structuré avec protection `main` afin de
> garantir la qualité des livraison.

#### Tâches

- [x] Dépôt GitHub `gestion-benevole-mdn` créé + 3 collaborateurs invités
- [x] Branches `main` + `dev` (workflow feature branches)
- [ ] Règles de protection de `main` : PR obligatoire + revue du Lead

#### Acceptation (Gherkin)

- **Étant donné** un collaborateur, **Quand** il pousse un commit sur `main`, **Alors**
  le push est rejeté (protection active).

### 🎟️ S0.2 — Scaffold Next.js (App Router, TypeScript, pnpm)

**Dev :** Lead · **Pts :** 3 · **Priorité :** Haute · **Dépend de :** —

- [x] `pnpm create next-app` — App Router + TypeScript
- [x] Stack verrouillée : Next 16.2.11, React 19.2.4 (package.json)
- [x] Scripts npm : `dev`, `build`, `start`, `lint`, `typecheck`, `format`

**Implémentation :** racine `app/` (layout.tsx, page.tsx, globals.css), `next.config.ts`,
`tsconfig.json`, `eslint.config.mjs`, `.prettierrc`.

### 🎟️ S0.3 — Tailwind CSS v4 + shadcn UI

**Dev :** Lead · **Pts :** 3 · **Priorité :** Haute · **Dépend de :** S0.2

- [x] Tailwind CSS v4 configuré (postcss + global css)
- [x] shadcn UI initialisé (`components.json`) + ui de base
      (button, card, table, dialog, input, select, tabs, badge, dropdown, sheet, avatar, sonner)

**Implémentation :** `app/globals.css`, `src/components/ui/*`, `src/lib/utils.ts` (cn).

### 🎟️ S0.4 — PostgreSQL + Prisma + seed

**Dev :** Lead + Back1 · **Pts :** 5 · **Priorité :** Haute · **Dépend de :** S0.2

- [x] Prisma 7 configuré (`prisma.config.ts`, provider PostgreSQL)
- [x] Schéma initial : `User`, `Presence`, `Observation`, `Credit`, `Activite`,
      `Partage`, `Temoignage` + enum `Role` (ADMIN/BENEVOLE) (CDC §3.2)
- [x] Relations FK + `onDelete` cohérents
- [x] Générer les migrations initiales + appliquer sur DB locale (`prisma migrate dev`)
- [x] Seed : 1 compte `ADMIN` + 1 bénévole test (mot de passe hashé bcrypt)

**Implémentation :** `prisma/schema.prisma`, `prisma/migrations/`, `src/lib/prisma.ts`.

#### Critères d'acceptation

- [ ] `prisma migrate dev` s'exécute sans erreur
- [ ] Le seed crée les 2 utilisateurs attendus (`ADMIN`, `BENEVOLE`)

#### Tests

- [ ] Script `prisma db seed` reproductible
- [ ] `SELECT * FROM "User"` retourne 2 lignes en local

### 🎟️ S0.5 — Variables d'environnement

**Dev :** Lead · **Pts :** 2 · **Priorité :** Haute · **Dépend de :** S0.2

- [x] `.env.example` versionné (`DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`, …)
- [x] `.env` local dans `.gitignore` (jamais commité)

**Implémentation :** `.env`, `.env.example`, `src/lib/env.ts` (validation Zod au boot).

### 🎟️ S0.6 — PWA de base

**Dev :** Front2 · **Pts :** 5 · **Priorité :** Moyenne · **Dépend de :** S0.3

- [x] `@ducanh2912/next-pwa` branché dans `next.config.ts`
- [ ] Manifest complet : `name`, `short_name`, icônes 192/512, `theme_color`,
      `display: standalone`
- [ ] Service worker actif en production (`disable` uniquement en dev)
- [ ] Test d'installabilité (Lighthouse / DevTools Application)

**Implémentation :** `public/manifest.json`, `public/icons/*`, `next.config.ts` (withPWA). ✅ Icônes générées (icon-192x192.png, icon-512x512.png).

#### Acceptation (Gherkin)

- **Étant donné** l'app ouverte en prod, **Quand** l'utilisateur rafraîchit hors-ligne,
  **Alors** le shell s'affiche depuis le cache.

### 🎟️ S0.7 — Hébergement

**Dev :** Lead · **Pts :** 8 · **Priorité :** Moyenne · **Dépend de :** S0.4

- [ ] Projet Vercel lié au repo (ou VPS + reverse proxy Nginx/Caddy)
- [ ] PostgreSQL managée créée (Neon/Supabase/RDS)
- [ ] `DATABASE_URL` de prod renseigné + secrets dans Vercel

**Implémentation :** secrets Vercel, `vercel.json` éventuel (rewrites), env prod.

#### Acceptation (Gherkin)

- **Étant donné** une branche feature mergée, **Quand** elle pousse sur Vercel, **Alors**
  une URL preview est générée automatiquement.

### 🎟️ S0.8 — CI/CD GitHub Actions

**Dev :** Lead · **Pts :** 5 · **Priorité :** Moyenne · **Dépend de :** S0.4, S0.5

- [ ] Workflow `ci.yml` : pnpm install → `lint` → `typecheck` → `build`
- [ ] Workflow `deploy.yml` : preview par PR + déploiement sur `main`
- [ ] Cache pnpm optimisé (actions/setup-pnpm + cache)

**Implémentation :** `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`,
`.husky/`, `.lintstagedrc`.

#### Acceptation (Gherkin)

- **Étant donné** un push sur feature branch, **Quand** le CI s'exécute, **Alors** le
  statut passe au vert (ou échoue clairement).

### 🎟️ S0.9 — (Optionnel) Page `/admin/sprints` de suivi interne

**Dev :** Lead + Front1 · **Pts :** 8 · **Priorité :** Basse · **Dépend de :** S0.4

- [ ] Modèle Prisma `Task` (id, sprint, titre, assignee, statut, done, updatedAt)
- [ ] Server Action `task.action.ts` (`toggle`, `createTask`)
- [ ] Page `app/admin/sprints` avec checkboxes persistées en base
- [ ] Protection Admin (middleware S1.3)

**Implémentation :** `prisma/schema.prisma` (model Task), `src/features/task/task.action.ts`,
`app/admin/sprints/page.tsx`.

#### Acceptation (Gherkin)

- **Étant donné** un Lead connecté, **Quand** il coche une tâche, **Alors** l'état est
  sauvegardé et restitué après rafraîchissement.

## 🧪 Critères d'acceptation du Sprint

- [ ] `pnpm install && pnpm lint && pnpm typecheck && pnpm build` verts sur `main`
- [ ] Migration + seed appliqués sur la DB locale
- [ ] Manifest + service worker servis en mode production
- [ ] CI passe au vert sur un push

## 🪵 Definition of Done (Sprint)

- [ ] Chaque case `[x]` correspond à un commit/PR associé (CDC §6)
- [ ] Le Lead a relu et validé chaque PR
- [ ] Rétro remplie + board (`todos/README.md`) à jour

## 📅 Rituels du Sprint

| Rituel        | Quand            | Participants   |
| ------------- | ---------------- | -------------- |
| Kick-off      | J1               | Toute l'équipe |
| Stand-up      | 2×/sem. (10 min) | Toute l'équipe |
| Démo          | Fin de sprint    | Lead + équipe  |
| Rétrospective | Fin de sprint    | Toute l'équipe |

## ✍️ Rétrospective (à remplir en fin de sprint)

| Ce qui a bien marché | À améliorer | Actions |
| -------------------- | ----------- | ------- |
| _vide_               | _vide_      | _vide_  |

# Stack: Next.js (App Router) + Prisma + PostgreSQL

Fullstack dans un seul repo : Next.js 16 App Router pour front + Server Actions/Route Handlers, Prisma 7 vers PostgreSQL (Neon en prod, local en dev).

## Backend / données

1. **Prisma** : schéma dans `prisma/schema.prisma`, config dans `prisma.config.ts`, seed via `tsx prisma/seed.ts`. Migrations explicites (`pnpm prisma migrate dev`), jamais de `db push` en prod (`migrate deploy` uniquement). Adapter `@prisma/adapter-pg` obligatoire (Prisma 7 driver adapter). Index sur FK et champs filtrés/recherchés souvent.
2. **API** : Server Actions (`"use server"`) pour les mutations simples, Route Handlers (`app/api/.../route.ts`) pour les endpoints publics/webhooks/auth.
3. **Validation** : Zod sur toutes les entrées (server actions et route handlers), schémas dans `*.schema.ts` à côté des actions.
4. **Auth** : NextAuth v4 (Credentials provider, JWT strategy). Config dans `src/lib/auth-options.ts`, helper `auth()` dans `src/lib/auth.ts`. Protection routes via `proxy.ts` (middleware RBAC : SUPER_ADMIN / ADMIN / VOLUNTEER / USER). **App fermée** : `/` → `/login`, pas d'inscription publique, le rôle `USER` ne peut pas s'authentifier. Ne pas rouler sa propre gestion de session.
5. **Erreurs** : Server Actions retournent `{ success: boolean, error?: string }` — pas de throw brut côté client. Toasts via `sonner`.
6. **Excel** : `exceljs` côté **serveur uniquement** (Server Actions / Route Handlers), jamais importé dans un Client Component. Colonnes déclarées une seule fois dans `src/features/excel/excel.columns.ts` (partagées export + import).

## Frontend

1. **Server Components par défaut** ; `"use client"` seulement quand interactivité/state nécessaire (forms, tables, dropdowns).
2. **Data fetching** : TanStack Query (`@tanstack/react-query`) côté client pour les données dynamiques, Server Components pour le SSR statique. `QueryProvider` dans `src/features/admin/query-provider.tsx`.
3. **UI** : Tailwind CSS 4 (CSS-first, `@import "tailwindcss"`), shadcn/ui (composants dans `src/components/ui/`). Zéro CSS custom/SCSS — classes Tailwind uniquement.
4. **Tables** : TanStack Table (`@tanstack/react-table`) pour toute table de données. Patterns dans `src/components/shared/data-table.tsx`.
5. **Forms** : React Hook Form + Zod resolver (`@hookform/resolvers`). Validation front = validation back (même schéma Zod).
6. **Thème** : `next-themes` + thème admin isolé (`admin-theme.tsx`, clé localStorage `admin-theme`).
7. **Icônes** : `lucide-react` uniquement.
8. **Toasts** : `sonner` — jamais d'alert() ou state error/success manuel.

## Structure de fichiers (voir AGENTS.md)

- `src/app/` — routing App Router uniquement (pas de logique métier ici)
- `src/features/<feature>/` — logique métier verticale : `*.action.ts` (Server Actions), `*.schema.ts` (Zod), composants partagés
- `src/components/ui/` — primitives shadcn/ui
- `src/lib/` — instances partagées (prisma, auth, env)
- Composant > 200 lignes → split en sous-composants dans `_components/` (dossier privé, masqué du routing)

## Contraintes fortes explicites

| Règle | Où s'applique |
|-------|---------------|
| `any`, `as`, `!` interdits — type guards et validation Zod | Tout le code TS |
| `@ts-ignore`, `@ts-nocheck`, `@ts-expect-error` interdits | Tout le code TS |
| Pas de CSS custom / SCSS / `@apply` — Tailwind 4 classes uniquement | Tout le style |
| Un composant = un fichier, max 200 lignes | Composants + classes |
| `pnpm` pour installer, `bun`/`pnpm` pour exécuter | Package management |
| Prisma : `migrate dev` en dev, `migrate deploy` en prod, jamais `db push` en prod | Base de données |
| ESLint strict : `no-explicit-any`, `no-non-null-assertion` en warn ; `unused-imports` + `simple-import-sort` en error | Lint |
| Prettier pour le formatage | Formatage |
| Husky pre-commit : `pnpm lint-staged` + `pnpm typecheck` | Git hooks |
| RBAC via `proxy.ts` — matrice routes × rôles + `canCreate()` (SUPER_ADMIN / ADMIN / VOLUNTEER / USER) ; aucune route `/sign-up` | Sécurité |

## Vérification (critères d'acceptation)

```bash
bun run lint          # ESLint — 0 erreur
bun run typecheck     # tsc --noEmit — 0 erreur
bun run build         # prisma generate + next build — doit passer
bun run prisma migrate dev  # migrations — doit passer en dev
```

## Skills liées (thr-*)

Ces skills lisent `.agents/rules/stack.md` pour leurs contraintes. Référence ce fichier quand tu les invoques.

| Skill | Déclencheur | Lien avec cette stack |
|-------|------------|----------------------|
| `thr-dev` | Exécution de tâches (`tasks/NN_*.md`) | Lit stack.md + archi.md avant chaque tâche ; vérifie `pnpm typecheck` + `pnpm lint` en sortie |
| `thr-clean-code` | Refacto / cleanup / split fichiers | Respecte les règles max 200 lignes, zéro `any`, suppression `console.log` → toasts `sonner` |
| `thr-archi` | Conception technique (`archi.md`) | Génère l'archi en respectant Prisma + Server Actions + RBAC proxy.ts |
| `thr-tasks` | Découpage en tâches (`tasks/`) | Ordre : schéma Prisma → auth → server actions → UI → vérification |
| `thr-up` | Pipeline 5 étapes (plan → archi → tasks → dev → incident) | Étape 0 = ce fichier ; mis à jour à chaque changement de stack |
| `thr-scan` | Audit bugs front/back | Vérifie RBAC proxy.ts, validation Zod, patterns Server Actions |
| `thr-review` | Revue de PR/diff | Vérifie contraintes : `any`, CSS custom, taille fichiers, import sort |
| `thr-commit` | Commit conventionnel | Conventional commits, un commit par feature |
| `thr-test` | Écriture de tests Vitest | Mock `prisma` + `getToken` pour tests d'actions et middleware |
| `thr-debug` | Diagnostic bug runtime | Contexte : NextAuth JWT + proxy.ts RBAC + Prisma adapter pg |
| `thr-cyber` | Audit sécurité | Focus : proxy.ts RBAC, validation Zod, NextAuth secret, pas de secrets en dur |
| `thr-perf-opt` | Performance / Lighthouse | Focus : Server Components, TanStack Query cache, bundle size |
| `thr-memory` | Gestion `.agents/` projet | Ce fichier = `stack.md` ; `decisions.md` = journal append-only |

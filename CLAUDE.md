@AGENTS.md

# gestion-benevole — Agent Context

## Stack

- **Framework** : Next.js 16 App Router · React 19 · TypeScript
- **Styling** : Tailwind v4 · shadcn/ui · Glass Liquid Blue design system (`app/globals.css`)
- **UI Primitives** : `@base-ui/react` (Dialog, Select, Badge) + `@radix-ui` (DropdownMenu, Sheet, Tooltip) — **mixed, check before importing**
- **Table** : TanStack Table v8 + shared `DataTable` (`src/components/shared/data-table.tsx`)
- **State** : TanStack Query v5 (server state) + React `useState` (local)
- **Auth** : NextAuth v4
- **DB** : Prisma + PostgreSQL
- **Forms** : react-hook-form + zod
- **Icons** : lucide-react
- **Toasts** : sonner

## Structure

```
app/admin/          → Pages (route handlers, RSC data fetching)
src/features/       → Feature modules (components, hooks, actions)
src/components/ui/  → shadcn/ui components
src/components/shared/ → Shared: DataTable, ConfirmDeleteDialog, PageHeader
```

## Conventions

- **Server actions** : `src/features/*/**.action.ts` — use `"use server"`
- **Client components** : add `"use client"` when using hooks/events
- **Semantic colors only** : `bg-primary`, `text-muted-foreground` — never `bg-blue-500`
- **Spacing** : `gap-*` not `space-y-*`
- **Equal dims** : `size-*` not `w-* h-*`

## Refactoring Plan

→ Voir [`docs/plan-refonte-ui.md`](./docs/plan-refonte-ui.md) pour le plan complet UI/UX

### Tâches en attente (résumé rapide)

#### 🔴 Phase 0 — Prérequis (faire en premier)

- [ ] `npx shadcn@latest add tabs breadcrumb popover`

#### 🔴 Phase 1 — Users `/admin/users`

- [ ] **TASK-U02** Fix scrollbar responsive (breakpoint `lg`→`md`, retirer `whitespace-nowrap`)
- [ ] **TASK-U03** Filtre → 1 bouton `DropdownMenu` (au lieu de 2 Select séparés)
- [ ] **TASK-U04** Tabs : Liste · Présences · Analytics
- [ ] **TASK-U05** Breadcrumb sur toutes les pages users
- [ ] **TASK-U06** DataTable : tri + colonne actions DropdownMenu + Popover avatar
- [ ] **TASK-U07** Tab Présences (users)
- [ ] **TASK-U08** Tab Analytics KPIs + Charts
- [ ] **TASK-U09** Refonte fiche `/users/[id]` (Avatar header + Tabs)

#### 🔴 Phase 2 — Bénévoles `/admin/volunteer-management`

- [ ] **TASK-V01** Tabs : Liste · Rôles + Breadcrumb
- [ ] **TASK-V02** Filter DropdownMenu bénévoles
- [ ] **TASK-V03** DataTable bénévoles améliorée
- [ ] **TASK-V04** Page Rôles : Table + Dialog CRUD + Breadcrumb
- [ ] **TASK-V05** Fiche bénévole : Avatar + Tabs (Profil · Présences · Crédits)

#### 🟠 Phase 3 — Présences `/admin/presences`

- [ ] **TASK-P01** Breadcrumb + Tabs (Pointage · Historique · Stats)
- [ ] **TASK-P02** Historique présences : DataTable + filtre date range
- [ ] **TASK-P03** Stats présences : KPI Cards + Chart 30 jours

#### 🟡 Phase 4 — Autres sections

- [ ] **TASK-A01/A02** Activités : Breadcrumb + DropdownMenu filter + actions
- [ ] **TASK-C01/C02** Crédits : Breadcrumb + Tabs analytiques + DropdownMenu
- [ ] **TASK-O01/O02** Observations : Breadcrumb + DropdownMenu + Tabs
- [ ] **TASK-D01/D02/D03** Dashboard : StatCards + DataTable + Breadcrumb
- [ ] **TASK-S01** Statistiques : Tabs par domaine + Charts
- [ ] **TASK-T01/T02** Partages : Breadcrumb + DropdownMenu

## Design tokens glass/liquid (à utiliser)

```css
.glass        /* backdrop-blur 16px + border translucide */
.glass-sm     /* blur 8px */
.glass-lg     /* blur 28px */
.glass-xl     /* blur 48px — modals */
.glass-gloss  /* reflet top-edge */
.glass-glow   /* halo bleu lumineux */
.fluid-bg     /* fond ambiant radial bleu */
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

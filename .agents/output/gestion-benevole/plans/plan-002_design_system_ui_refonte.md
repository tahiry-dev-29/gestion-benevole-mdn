# Plan: Refonte Design System & UI/UX — Toutes les pages admin

Plan-ID: plan-002
Project: gestion-benevole
Related task files: `../tasks/19_design_system_glass.md`, `../tasks/20_users_ui_refonte.md`, `../tasks/21_volunteers_ui_refonte.md`, `../tasks/22_presences_ui_refonte.md`, `../tasks/23_activites_credits_ui.md`, `../tasks/24_dashboard_stats_ui.md`, `../tasks/25_observations_partages_ui.md`
Sprint / Reference: Sprint 9+ / Design System Glass Liquid Blue
Date: 2026-10-05
Status: IN_PROGRESS

---

## 1. Objective

- **Problem Statement:** L'ensemble de l'interface admin utilise des composants shadcn basiques sans cohérence visuelle forte. Les filtres sont éparpillés (plusieurs `<Select>` séparés), le responsive présente des scrollbars parasites sur tablette (breakpoint `lg` trop tardif), aucune page n'a de `Breadcrumb`, il n'y a pas de navigation par `Tabs` entre les vues d'une même section, et les colonnes d'actions des tables utilisent de simples liens au lieu de `DropdownMenu` contextuel. Le design system "Glass Liquid Blue" a été posé dans `app/globals.css` mais n'est pas encore appliqué aux composants.

- **Scope Checklist:**
  - [ ] Appliquer le design system Glass Liquid Blue cohérent à toutes les pages admin.
  - [ ] Installer les composants shadcn manquants : `tabs`, `breadcrumb`, `popover`.
  - [ ] Corriger le responsive scrollbar sur la liste users (breakpoint `lg` → `md`).
  - [ ] Consolider tous les filtres éparpillés en un seul bouton `DropdownMenu` par page.
  - [ ] Ajouter `Breadcrumb` sur toutes les pages admin (users, bénévoles, présences, activités, crédits, observations, partages, dashboard, statistiques).
  - [ ] Ajouter navigation `Tabs` intra-page sur les sections : Users, Bénévoles, Présences, Crédits, Statistiques.
  - [ ] Améliorer toutes les `DataTable` : tri par colonne, actions via `DropdownMenu`, `Popover` quick-view sur avatar.
  - [ ] Refonte des fiches détail (users/[id], volunteer-management/[id]) avec Avatar header + Tabs.
  - [ ] Ajouter des tabs Analytics/KPIs dans Users et Statistiques.
  - [ ] Appliquer les classes utilitaires `.glass`, `.glass-gloss`, `.fluid-bg` sur les panels clés.

- **Out of scope:** Nouvelles fonctionnalités métier, migrations de base de données, changements d'API, tests E2E.

---

## 2. Current State

- **Design system** : `app/globals.css` contient le thème Glass Liquid Blue (variables HSL + utilitaires `.glass*`) mais aucun composant ne l'utilise encore.
- **Composants manquants** : `tabs`, `breadcrumb`, `popover` non installés dans `src/components/ui/`.
- **Users** (`/admin/users`) : 2 `<Select>` séparés dans la filter bar ; breakpoint `lg` crée un gap tablette 768–1023px avec scrollbar parasite ; colonne actions = lien simple "Ouvrir →" ; pas de Breadcrumb ni de Tabs.
- **Bénévoles** (`/admin/volunteer-management`) : navigation entre Liste/Rôles via URL distinctes sans Tabs ; toolbar filtre non consolidée ; fiche `/[id]` sans structure shadcn.
- **Présences** (`/admin/presences`) : page unique sans Tabs Pointage/Historique/Stats.
- **Activités / Crédits / Observations / Partages** : filtres non consolidés, pas de Breadcrumb, colonnes actions sans `DropdownMenu`.
- **Dashboard** : `StatCard` custom sans `Card` complet shadcn ; table "récents" HTML brute.
- **Statistiques** : 4 KPIs seulement, pas de Tabs par domaine, pas de Charts.
- **Mixed UI primitives** : `@base-ui/react` pour Dialog/Select/Badge, `@radix-ui` pour DropdownMenu/Sheet/Tooltip — mélange documenté, à respecter.

---

## 3. Target State

`Current:` UI hétérogène, filtres éparpillés, scrollbar tablette, pas de Breadcrumb/Tabs, actions simples dans les tables → `Target:` Design system Glass Liquid Blue cohérent sur toutes les pages ; chaque section dispose d'un `Breadcrumb` + navigation `Tabs` ; tous les filtres sont consolidés dans un `DropdownMenu` unique avec badge count ; les DataTables ont des colonnes triables, des actions contextuelles (`DropdownMenu`) et un `Popover` quick-view ; les fiches détail utilisent Avatar + Tabs shadcn ; le dashboard utilise les composants `Card` complets.

---

## 4. Constraints

- **Stack / versions:** Next.js 16 App Router, React 19, Tailwind v4, shadcn/ui v4.21 (base-ui + radix mixed), TanStack Table v8, TanStack Query v5, lucide-react v1.25.
- **UI Rules:**
  - `@base-ui/react` : Dialog, Select, Badge — ne pas remplacer par Radix.
  - `@radix-ui` : DropdownMenu, Sheet, Tooltip, Separator — utiliser tel quel.
  - Couleurs sémantiques uniquement : `bg-primary`, `text-muted-foreground` — jamais `bg-blue-500`.
  - `gap-*` pas `space-y-*` ; `size-*` pas `w-* h-*`.
  - Pas de `dark:` manuel — utiliser les tokens CSS variables.
- **Backward compatibility:** Ne pas modifier la logique métier, les Server Actions, les schémas Zod, les repositories Prisma.
- **Preserving local changes:** Tous les fichiers modifiés listés dans le plan de tâches doivent préserver la logique existante et uniquement modifier la couche présentation.

---

## 5. Architectural Sketch

### Design tokens Glass Liquid Blue (déjà dans `app/globals.css`)

```css
/* Classes utilitaires à appliquer */
.glass        → backdrop-blur 16px + bg card/0.60 + border translucide
.glass-sm     → blur 8px  (sidebar items, inputs)
.glass-lg     → blur 28px (panels prominents)
.glass-xl     → blur 48px (modals, dialogs)
.glass-gloss  → reflet top-edge (cards KPI, sidebar header)
.glass-glow   → halo bleu (boutons primary, ring focus)
.fluid-bg     → fond ambiant radial bleu (layout body, sections hero)
```

### Composants à installer

```bash
npx shadcn@latest add tabs breadcrumb popover
```

### Pattern Breadcrumb (toutes les pages)

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/admin/dashboard">Administration</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Titre de la page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Pattern Filter DropdownMenu (toutes les pages avec filtres)

```
Avant : [Select A ▼] [Select B ▼]
Après : [⚙ Filtres (N actifs) ▼]  ← DropdownMenuCheckboxItem + reset
```

### Pattern DataTable améliorée

```
En-têtes triables : ArrowUpDown icon
Actions colonne   : DropdownMenu (Voir · Modifier · Supprimer)
Avatar colonne    : Popover quick-view (nom, email, statut)
```

### Pattern Tabs intra-page

```tsx
<Tabs defaultValue="liste">
  <TabsList className="glass-sm">
    <TabsTrigger value="liste">Liste</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
  </TabsList>
  <TabsContent value="liste">…</TabsContent>
  <TabsContent value="analytics">…</TabsContent>
</Tabs>
```

---

## 6. Verification & Testing Blueprints

- **Visual review** : screenshots Chromium via `npx agent-browser` — desktop (1280px) + mobile (390×844) pour chaque page modifiée.
- **TypeScript** : `pnpm typecheck` PASS après chaque tâche.
- **Lint** : `pnpm lint` 0 erreur après chaque tâche.
- **Build** : `pnpm build` PASS à la fin de chaque phase.
- **Responsive check** : aucun scrollbar parasite sur tablette (768–1023px) sur la liste users.
- **Accessibility** : tous les boutons ont `aria-label`, les icônes seules ont `aria-hidden`.

---

## 7. Phases & Task Map

| Phase | Tâches | Priorité | Durée est. |
|-------|--------|----------|-----------|
| **Phase 0** — Prérequis | TASK-DS-01 | 🔴 P0 | 15 min |
| **Phase 1** — Users | TASK-U-01 → U-09 | 🔴 P0 | 4–6h |
| **Phase 2** — Bénévoles | TASK-V-01 → V-05 | 🔴 P0 | 3–4h |
| **Phase 3** — Présences | TASK-P-01 → P-03 | 🟠 P1 | 2–3h |
| **Phase 4** — Activités/Crédits/Obs/Partages | TASK-A/C/O/T | 🟠 P1 | 3–4h |
| **Phase 5** — Dashboard/Stats | TASK-D/S | 🟡 P2 | 2–3h |

---

## 8. File Index

| Fichier tâche | Domaine |
|--------------|---------|
| `../tasks/19_design_system_glass.md` | Design system global + install composants |
| `../tasks/20_users_ui_refonte.md` | Section Users complète |
| `../tasks/21_volunteers_ui_refonte.md` | Section Bénévoles + Rôles |
| `../tasks/22_presences_ui_refonte.md` | Section Présences |
| `../tasks/23_activites_credits_ui.md` | Activités, Crédits, Observations, Partages |
| `../tasks/24_dashboard_stats_ui.md` | Dashboard + Statistiques |
| `../tasks/25_observations_partages_ui.md` | Observations + Partages |

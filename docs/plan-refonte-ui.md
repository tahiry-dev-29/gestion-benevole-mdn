# 🗺️ Plan de Refonte UI/UX — gestion-benevole

> **Stack** : Next.js 16 · Tailwind v4 · shadcn/ui (`@base-ui/react` + `@radix-ui` mixed) · TanStack Table/Query · Prisma  
> **Dernière mise à jour** : 2026-10-05  
> **Design system** : Glass Liquid Blue (voir `app/globals.css`)

---

## 📦 Composants shadcn à installer (prérequis global)

```bash
npx shadcn@latest add tabs breadcrumb popover
```

| Composant       | Utilisé pour                                      | Statut                         |
| --------------- | ------------------------------------------------- | ------------------------------ |
| `tabs`          | Navigation intra-page (Liste/Présences/Analytics) | ⏳ À installer                 |
| `breadcrumb`    | Fil d'Ariane sur toutes les pages                 | ⏳ À installer                 |
| `popover`       | Quick-view utilisateur, filtres avancés           | ⏳ À installer                 |
| `dropdown-menu` | Filtre, actions contextuelles                     | ✅ Installé                    |
| `dialog`        | CRUD modals                                       | ✅ Installé (`@base-ui/react`) |
| `sheet`         | Formulaires latéraux                              | ✅ Installé                    |
| `badge`         | Statuts, rôles                                    | ✅ Installé                    |
| `card`          | KPI cards, panels                                 | ✅ Installé                    |
| `table`         | DataTable                                         | ✅ Installé                    |
| `avatar`        | Photos profil                                     | ✅ Installé                    |
| `skeleton`      | Loading states                                    | ✅ Installé                    |
| `sonner`        | Toast notifications                               | ✅ Installé                    |
| `progress`      | Barres de progression                             | ✅ Installé                    |

---

## ⚠️ Règles techniques importantes

> **IMPORTANT** : Ce projet utilise un mix `@base-ui/react` (Dialog, Select, Badge) + `@radix-ui` (DropdownMenu, Sheet, Tooltip).  
> Toujours vérifier dans `src/components/ui/` quel primitif est utilisé avant d'importer.

> **WARNING** : `Select` utilise `@base-ui/react/select` — API différente de Radix Select.  
> Ne jamais importer `SelectTrigger` depuis Radix. Utiliser les composants existants dans `@/components/ui/select`.

> **TIP** : `DropdownMenu` est en Radix (`@radix-ui/react-dropdown-menu`) → peut être utilisé directement.

---

## 🗂️ Sections de l'application

| Section                                                  | Route                         | Feature dir                | Priorité |
| -------------------------------------------------------- | ----------------------------- | -------------------------- | -------- |
| [Users (Comptes)](#-section-1--users--comptes-user)      | `/admin/users`                | `src/features/user`        | 🔴 P0    |
| [Bénévoles](#-section-2--bénévoles-volunteer-management) | `/admin/volunteer-management` | `src/features/volunteers`  | 🔴 P0    |
| [Présences](#-section-3--présences)                      | `/admin/presences`            | `src/features/presence`    | 🟠 P1    |
| [Activités](#-section-4--activités)                      | `/admin/activites`            | `src/features/activites`   | 🟠 P1    |
| [Crédits](#-section-5--crédits)                          | `/admin/credits`              | `src/features/credit`      | 🟠 P1    |
| [Observations](#-section-6--observations)                | `/admin/observations`         | `src/features/observation` | 🟡 P2    |
| [Dashboard](#-section-7--dashboard)                      | `/admin/dashboard`            | `src/features/admin`       | 🟡 P2    |
| [Statistiques](#-section-8--statistiques)                | `/admin/statistiques`         | `src/features/admin`       | 🟡 P2    |
| [Partages](#-section-9--partages)                        | `/admin/partages`             | `src/features/partages`    | 🟡 P2    |

---

## 🔵 Section 1 — Users / Comptes USER

**Route** : `/admin/users`  
**Files** : `src/features/user/`, `app/admin/users/`

### Problèmes identifiés

| #   | Problème                                                        | Sévérité    |
| --- | --------------------------------------------------------------- | ----------- |
| 1   | 2 `<Select>` séparés dans la filter bar → encombrant mobile     | 🔴          |
| 2   | Breakpoint `lg` (1024px) crée gap tablette 768–1023px           | 🔴          |
| 3   | `overflow-x-auto` + `whitespace-nowrap` force scrollbar inutile | 🔴          |
| 4   | Pas de `Breadcrumb` → bouton `←` artisanal dans fiche user      | 🟠          |
| 5   | Pas de Tabs pour naviguer entre Liste · Présences · Analytics   | 🟠          |
| 6   | Colonne Actions = simple lien "Ouvrir" sans menu contextuel     | 🟡          |
| 7   | Composants `tabs`, `breadcrumb`, `popover` non installés        | 🔴 Bloquant |

### Architecture cible

```
/admin/users/
├── [Tab: Liste]       → DataTable filtrée + DropdownMenu Filter
├── [Tab: Présences]   → Tableau présences + filtre date
└── [Tab: Analytics]   → Cards KPIs + Charts

/admin/users/[id]/
├── Breadcrumb: Admin > Users > Prénom Nom
├── Header: Avatar + Nom + Badges statut/certificat
├── Tabs: Infos · Documents · Historique
└── Actions: Modifier (Sheet) · Désactiver (Dialog)
```

### Tasks

#### TASK-U01 — Installer composants shadcn manquants

- **Fichiers** : `src/components/ui/`
- **Commande** : `npx shadcn@latest add tabs breadcrumb popover`
- [ ] `tabs.tsx` créé
- [ ] `breadcrumb.tsx` créé
- [ ] `popover.tsx` créé

#### TASK-U02 — Fix responsive scrollbar

- **Fichiers** :
  - `src/components/shared/data-table.tsx`
  - `src/features/user/components/users-table.tsx`
- **Fix** :
  - Changer breakpoint `lg` → `md` dans `users-table.tsx`
  - Retirer `whitespace-nowrap` global sur `<TableCell>`
  - Ajouter `max-w-[200px] truncate` sur colonnes longues (email, nom)
  - Ajouter `min-w-0 w-full` sur le wrapper table

```tsx
// AVANT
<div className="hidden lg:block">          // desktop (≥1024px)
<section className="grid gap-3 lg:hidden"> // mobile

// APRÈS
<div className="hidden md:block">          // desktop (≥768px)
<section className="grid gap-3 md:hidden"> // mobile seulement
```

#### TASK-U03 — Filter DropdownMenu (1 bouton au lieu de 2 Select)

- **Fichier** : `src/features/user/components/_components/users-table-filter-bar.tsx`
- **Avant** : `[Search] [Tous certificats ▼] [Tous comptes ▼]`
- **Après** : `[Search] [⚙ Filtres (2) ▼]` avec badge count des filtres actifs

```
[⚙ Filtres (2) ▼]
  ↓ DropdownMenu
  ┌─────────────────────┐
  │ Statut du compte     │
  │ ○ Tous  ● Actifs     │
  │         ○ Inactifs   │
  │─────────────────────│
  │ Certificat           │
  │ ○ Tous  ○ Non demandé│
  │ ○ À vérifier ○ Appr.│
  │ ○ Rejeté             │
  │─────────────────────│
  │ [Réinitialiser]      │
  └─────────────────────┘
```

- Utiliser `DropdownMenu` + `DropdownMenuCheckboxItem`
- Badge count sur bouton : `Filtres (2)` quand filtres actifs
- Bouton "Réinitialiser" en bas

#### TASK-U04 — Tabs navigation `/admin/users`

- **Fichiers** : `app/admin/users/page.tsx`, `src/features/user/components/users-table.tsx`
- **Nouveau** : `src/features/user/components/users-page-layout.tsx`

```tsx
<Tabs defaultValue="liste">
  <TabsList>
    <TabsTrigger value="liste">
      <Users /> Liste
    </TabsTrigger>
    <TabsTrigger value="presences">
      <CalendarCheck /> Présences
    </TabsTrigger>
    <TabsTrigger value="analytics">
      <BarChart3 /> Analytics
    </TabsTrigger>
  </TabsList>
  <TabsContent value="liste">
    <UsersListTab />
  </TabsContent>
  <TabsContent value="presences">
    <UsersPresenceTab />
  </TabsContent>
  <TabsContent value="analytics">
    <UsersAnalyticsTab />
  </TabsContent>
</Tabs>
```

#### TASK-U05 — Breadcrumb toutes pages users

- **Fichiers** : `app/admin/users/page.tsx`, `app/admin/users/[id]/page.tsx`, `app/admin/users/create/page.tsx`, `app/admin/users/[id]/update/page.tsx`
- Remplacer le bouton `← retour` artisanal par `<Breadcrumb>` shadcn
- Pattern : `Administration > Utilisateurs > Prénom Nom`

#### TASK-U06 — DataTable améliorée

- **Fichiers** : `src/features/user/components/_components/user-columns.tsx`, `src/components/shared/data-table.tsx`
- En-têtes triables avec `ArrowUpDown`
- Colonne Actions → `DropdownMenu` : Voir fiche · Modifier · Désactiver
- `Popover` sur Avatar : quick-view nom, email, statut, date entrée

#### TASK-U07 — Tab Présences (dans users)

- **Nouveau** : `src/features/user/components/tabs/users-presence-tab.tsx`
- Sélecteur de date + DataTable présences filtrée

#### TASK-U08 — Tab Analytics (KPIs + Charts)

- **Nouveau** : `src/features/user/components/tabs/users-analytics-tab.tsx`
- 4 KPI Cards : Total · Actifs · Certificats validés · Ce mois
- Charts : répartition certificats, inscriptions/mois, par catégorie

#### TASK-U09 — Refonte fiche `/admin/users/[id]`

- Breadcrumb (TASK-U05)
- Header : `Avatar` Gravatar + nom + badges statut/certificat
- `Tabs` : Informations · Documents · Activité
- Section "Certificat EN_ATTENTE" → `Alert` shadcn

---

## 🟢 Section 2 — Bénévoles (Volunteer Management)

**Route** : `/admin/volunteer-management`  
**Files** : `src/features/volunteers/`, `app/admin/volunteer-management/`

### Problèmes identifiés

| #   | Problème                                                         | Sévérité |
| --- | ---------------------------------------------------------------- | -------- |
| 1   | Pas de Breadcrumb                                                | 🟠       |
| 2   | Navigation entre sous-pages (liste, add, roles) sans Tabs        | 🟠       |
| 3   | Filtre toolbar sans DropdownMenu consolidé                       | 🟡       |
| 4   | Fiche bénévole `/[id]` : layout artisanal sans shadcn components | 🟠       |
| 5   | Page Rôles : UI basique sans datatable ni gestion visuelle       | 🟠       |

### Architecture cible

```
/admin/volunteer-management/
├── [Tab: Liste bénévoles]    → DataTable + DropdownMenu filter + DropdownMenu actions
├── [Tab: Rôles & permissions] → Table rôles + Badge + Edit/Delete dialogs
└── Bouton "Ajouter" → Sheet formulaire latéral (ou /add)

/admin/volunteer-management/[id]/
├── Breadcrumb: Admin > Bénévoles > Prénom Nom
├── Header: Avatar + Nom + Badge rôle + Badge statut
└── Tabs: Profil · Présences · Crédits · Observations
```

### Tasks

#### TASK-V01 — Tabs navigation volunteer-management

- **Fichiers** : `app/admin/volunteer-management/page.tsx`
- Tabs : `Liste` · `Rôles & permissions`
- Ajouter `Breadcrumb` sur la page principale

#### TASK-V02 — DropdownMenu filter pour VolunteersTable

- **Fichier** : `src/features/volunteers/presentation/_components/volunteers-table-toolbar.tsx`
- Consolider filtres `role` + `statut` en 1 bouton `⚙ Filtres`
- Même pattern que TASK-U03

#### TASK-V03 — Refonte DataTable bénévoles

- **Fichier** : `src/features/volunteers/presentation/volunteer-columns.tsx`
- Ajouter colonne Avatar avec `Popover` quick-view
- Actions → `DropdownMenu` : Voir fiche · Modifier · Supprimer
- En-têtes triables (déjà partiellement fait, vérifier)

#### TASK-V04 — Page Rôles améliorée

- **Fichier** : `src/features/volunteers/presentation/roles-management.tsx`
- Table rôles avec `Badge` pour chaque permission
- `Dialog` pour créer/modifier un rôle
- `ConfirmDeleteDialog` pour supprimer
- `Breadcrumb` : Admin > Bénévoles > Rôles

#### TASK-V05 — Refonte fiche bénévole `/volunteer-management/[id]`

- **Fichier** : `app/admin/volunteer-management/[id]/page.tsx`
- Breadcrumb : Admin > Bénévoles > Prénom Nom
- Header : Avatar + nom + Badge rôle + Badge statut
- `Tabs` : Profil · Présences · Crédits · Observations
- Chaque tab charge les données correspondantes

---

## 🔵 Section 3 — Présences

**Route** : `/admin/presences`  
**Files** : `src/features/presence/presentation/`

### Problèmes identifiés

| #   | Problème                                              | Sévérité |
| --- | ----------------------------------------------------- | -------- |
| 1   | Pas de Breadcrumb                                     | 🟠       |
| 2   | Pas de Tabs entre "Pointage" et "Historique"          | 🟠       |
| 3   | Filtre date/bénévole : UI non consolidée              | 🟡       |
| 4   | Pas d'analytics de présences (taux de présence, etc.) | 🟡       |

### Tasks

#### TASK-P01 — Breadcrumb + Tabs présences

- **Fichier** : `app/admin/presences/page.tsx`
- Breadcrumb : Admin > Présences
- Tabs : `Pointage du jour` · `Historique` · `Statistiques`

#### TASK-P02 — Tab Historique des présences

- **Nouveau** : `src/features/presence/presentation/tabs/presence-history-tab.tsx`
- DataTable avec filtre date range + filtre bénévole
- Colonnes : Bénévole · Date · Heure arrivée · Heure départ · Table/Place · Durée

#### TASK-P03 — Tab Statistiques présences

- **Nouveau** : `src/features/presence/presentation/tabs/presence-stats-tab.tsx`
- KPI Cards : Présents aujourd'hui · Moyenne/semaine · Top bénévole du mois
- Chart : présences par jour sur 30 jours

---

## 🟡 Section 4 — Activités

**Route** : `/admin/activites`  
**Files** : `src/features/activites/presentation/`

### Problèmes identifiés

| #   | Problème                          | Sévérité |
| --- | --------------------------------- | -------- |
| 1   | Pas de Breadcrumb                 | 🟠       |
| 2   | Toolbar filtre sans DropdownMenu  | 🟡       |
| 3   | Colonne actions sans DropdownMenu | 🟡       |

### Tasks

#### TASK-A01 — Breadcrumb + DropdownMenu filter

- **Fichiers** : `app/admin/activites/page.tsx`, `src/features/activites/presentation/activite-toolbar.tsx`
- Breadcrumb : Admin > Activités
- Consolider filtres en 1 `DropdownMenu`

#### TASK-A02 — Actions contextuelles colonnes

- **Fichier** : `src/features/activites/presentation/activite-columns.tsx`
- `DropdownMenu` : Voir · Modifier · Supprimer

---

## 🟡 Section 5 — Crédits

**Route** : `/admin/credits`  
**Files** : `src/features/credit/`

### Problèmes identifiés

| #   | Problème                                | Sévérité |
| --- | --------------------------------------- | -------- |
| 1   | Pas de Breadcrumb                       | 🟠       |
| 2   | Filtres éparpillés (credit-filters.tsx) | 🟡       |
| 3   | Pas de vue analytique des crédits       | 🟡       |

### Tasks

#### TASK-C01 — Breadcrumb + Tabs crédits

- **Fichier** : `app/admin/credits/page.tsx`
- Breadcrumb : Admin > Crédits
- Tabs : `Liste` · `Analytiques` (cumul par bénévole, par mois)

#### TASK-C02 — DropdownMenu filter + actions

- **Fichiers** : `src/features/credit/_components/credit-filters.tsx`, `src/features/credit/_components/credit-columns.tsx`
- Consolider filtres en 1 bouton
- Actions colonnes → `DropdownMenu`

---

## 🟡 Section 6 — Observations

**Route** : `/admin/observations`  
**Files** : `src/features/observation/`

### Tasks

#### TASK-O01 — Breadcrumb + filtre DropdownMenu

- Breadcrumb : Admin > Observations
- `src/features/observation/_components/observation-filters.tsx` → 1 DropdownMenu

#### TASK-O02 — Actions colonnes + Tabs

- `DropdownMenu` actions dans `observation-columns.tsx`
- Tabs : `Mes observations` · `Toutes`

---

## 🟡 Section 7 — Dashboard

**Route** : `/admin/dashboard`  
**Files** : `app/admin/dashboard/page.tsx`, `src/features/admin/`

### Problèmes identifiés

| #   | Problème                                                  | Sévérité |
| --- | --------------------------------------------------------- | -------- |
| 1   | `StatCard` custom sans shadcn `Card` complet              | 🟡       |
| 2   | Table "récents" sans pagination ni tri                    | 🟡       |
| 3   | Distribution section : barres custom, pas de Chart shadcn | 🟡       |

### Tasks

#### TASK-D01 — Refonte StatCards

- **Fichier** : `src/features/admin/stat-card.tsx`
- Utiliser `Card` · `CardHeader` · `CardContent` · `CardTitle` correctement
- Ajouter `Badge` de tendance (↑ +12% ce mois)
- Ajouter `Tooltip` sur les valeurs

#### TASK-D02 — Tableau récents amélioré

- **Fichier** : `app/admin/dashboard/page.tsx`
- Remplacer table HTML brute par `DataTable` (shared)
- Ajouter pagination + tri

#### TASK-D03 — Breadcrumb + layout header dashboard

- Breadcrumb : Administration > Tableau de bord

---

## 🟡 Section 8 — Statistiques

**Route** : `/admin/statistiques`  
**Files** : `app/admin/statistiques/page.tsx`

### Tasks

#### TASK-S01 — Tabs + Charts statistiques

- **Fichier** : `app/admin/statistiques/page.tsx`
- Tabs : `Bénévoles` · `Activités` · `Présences` · `Crédits`
- Chaque tab : KPI Cards + Chart (Bar, Line, Donut)
- Breadcrumb : Admin > Statistiques

---

## 🟡 Section 9 — Partages

**Route** : `/admin/partages`  
**Files** : `src/features/partages/presentation/`

### Tasks

#### TASK-T01 — Breadcrumb + DropdownMenu filter

- Breadcrumb : Admin > Partages
- `src/features/partages/presentation/partage-toolbar.tsx` → DropdownMenu

#### TASK-T02 — Actions colonnes

- `DropdownMenu` dans `partage-columns.tsx`

---

## 🗓️ Ordre d'exécution recommandé

```
Phase 0 — Prérequis globaux (1h)
  TASK-U01 : npx shadcn@latest add tabs breadcrumb popover

Phase 1 — Users (priorité critique)
  TASK-U02 : Fix responsive scrollbar
  TASK-U03 : Filter DropdownMenu
  TASK-U04 : Tabs navigation /admin/users
  TASK-U05 : Breadcrumb users pages
  TASK-U06 : DataTable améliorée

Phase 2 — Bénévoles (priorité haute)
  TASK-V01 : Tabs volunteer-management
  TASK-V02 : Filter DropdownMenu bénévoles
  TASK-V03 : DataTable bénévoles
  TASK-V04 : Page Rôles
  TASK-V05 : Fiche bénévole

Phase 3 — Présences (priorité haute)
  TASK-P01 : Breadcrumb + Tabs
  TASK-P02 : Historique
  TASK-P03 : Stats présences

Phase 4 — Enrichissement (priorité normale)
  TASK-U07 : Tab Présences (users)
  TASK-U08 : Tab Analytics (users)
  TASK-U09 : Fiche user/[id]
  TASK-A01 + A02 : Activités
  TASK-C01 + C02 : Crédits
  TASK-O01 + O02 : Observations

Phase 5 — Dashboard & Stats (priorité normale)
  TASK-D01 + D02 + D03 : Dashboard
  TASK-S01 : Statistiques
  TASK-T01 + T02 : Partages
```

---

## 📁 Fichiers à créer / modifier (récapitulatif)

| Action      | Fichier                                                               | Task     |
| ----------- | --------------------------------------------------------------------- | -------- |
| ✏️ Modifier | `src/features/user/components/_components/users-table-filter-bar.tsx` | U03      |
| ✏️ Modifier | `src/features/user/components/users-table.tsx`                        | U02, U04 |
| ✏️ Modifier | `src/components/shared/data-table.tsx`                                | U02      |
| ✏️ Modifier | `src/features/user/components/_components/user-columns.tsx`           | U06      |
| ✏️ Modifier | `app/admin/users/page.tsx`                                            | U04, U05 |
| ✏️ Modifier | `app/admin/users/[id]/page.tsx`                                       | U05, U09 |
| ✏️ Modifier | `app/admin/users/create/page.tsx`                                     | U05      |
| ✏️ Modifier | `app/admin/volunteer-management/page.tsx`                             | V01      |
| ✏️ Modifier | `src/features/volunteers/presentation/volunteers-table.tsx`           | V02, V03 |
| ✏️ Modifier | `src/features/volunteers/presentation/volunteer-columns.tsx`          | V03      |
| ✏️ Modifier | `src/features/volunteers/presentation/roles-management.tsx`           | V04      |
| ✏️ Modifier | `app/admin/presences/page.tsx`                                        | P01      |
| ✏️ Modifier | `app/admin/activites/page.tsx`                                        | A01      |
| ✏️ Modifier | `src/features/activites/presentation/activite-toolbar.tsx`            | A01      |
| ✏️ Modifier | `src/features/activites/presentation/activite-columns.tsx`            | A02      |
| ✏️ Modifier | `app/admin/credits/page.tsx`                                          | C01      |
| ✏️ Modifier | `src/features/credit/_components/credit-filters.tsx`                  | C02      |
| ✏️ Modifier | `app/admin/statistiques/page.tsx`                                     | S01      |
| ✏️ Modifier | `src/features/admin/stat-card.tsx`                                    | D01      |
| 🆕 Créer    | `src/features/user/components/users-page-layout.tsx`                  | U04      |
| 🆕 Créer    | `src/features/user/components/_components/users-page-header.tsx`      | U04      |
| 🆕 Créer    | `src/features/user/components/tabs/users-presence-tab.tsx`            | U07      |
| 🆕 Créer    | `src/features/user/components/tabs/users-analytics-tab.tsx`           | U08      |
| 🆕 Créer    | `src/features/presence/presentation/tabs/presence-history-tab.tsx`    | P02      |
| 🆕 Créer    | `src/features/presence/presentation/tabs/presence-stats-tab.tsx`      | P03      |

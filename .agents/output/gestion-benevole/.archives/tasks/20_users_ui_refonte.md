Status: DONE

# Feature tasks: Refonte UI/UX — Section Users (/admin/users)

## Plan

Plan: plan-002
Plan file: ../plans/plan-002_design_system_ui_refonte.md
Feature: Gestion des comptes USER — interface complète

## Feature goal

Refondre l'interface de la section `/admin/users` pour corriger le responsive, consolider les filtres, ajouter une navigation Tabs, un Breadcrumb, une DataTable améliorée et des tabs Analytics/Présences.

---

## Problèmes identifiés (audit 2026-10-05)

| # | Fichier | Problème | Sévérité |
|---|---------|----------|----------|
| 1 | `users-table-filter-bar.tsx` | 2 `<Select>` séparés → encombrant mobile/tablet | 🔴 |
| 2 | `users-table.tsx` | Breakpoint `lg` (1024px) → gap tablette 768–1023px avec scrollbar parasite | 🔴 |
| 3 | `data-table.tsx` | `whitespace-nowrap` global → force scroll horizontal | 🔴 |
| 4 | `users/[id]/page.tsx` | Bouton `←` artisanal au lieu de `Breadcrumb` shadcn | 🟠 |
| 5 | `users-table.tsx` | Pas de Tabs entre Liste · Présences · Analytics | 🟠 |
| 6 | `user-columns.tsx` | Actions = simple lien "Ouvrir →" sans DropdownMenu | 🟡 |
| 7 | `src/components/ui/` | `tabs`, `breadcrumb`, `popover` non installés | 🔴 Bloquant |

---

## Parent task: Refonte complète section Users

**Status:** DONE
**Depends on:** Task 19 (TASK-DS-01 — composants installés)

---

## Child tasks

### TASK-U-01: Fix responsive scrollbar

**Status:** DONE
**Parent:** Refonte complète section Users
**Depends on:** None

Goal: supprimer le scrollbar parasite sur tablette et améliorer la gestion overflow de la DataTable.

Files to create/modify:
- `src/features/user/components/users-table.tsx`
- `src/components/shared/data-table.tsx`

Steps:
1. [x] Dans `users-table.tsx` : changer le breakpoint `hidden lg:block` → `hidden md:block` et `grid gap-3 lg:hidden` → `grid gap-3 md:hidden`
2. [x] Dans `data-table.tsx` : ajouter `min-w-0` sur le wrapper extérieur ; vérifier `w-full` sur `<Table>`
3. [x] Dans `user-columns.tsx` : retirer `whitespace-nowrap` sur les cellules courtes (Compte, Certificat) ; ajouter `max-w-[200px] truncate` sur la cellule email
4. [x] Vérifier sur 768px (tablette) : table visible, pas de scrollbar horizontal de page

Acceptance criteria:
- [x] Sur tablette 768px : DataTable visible sans scrollbar horizontal de page
- [x] Sur mobile <768px : cards `UserMobileCard` visibles
- [x] Sur desktop ≥768px : DataTable visible
- [x] `pnpm typecheck` PASS

---

### TASK-U-02: Filter DropdownMenu (remplacer 2 Select par 1 bouton)

**Status:** DONE
**Parent:** Refonte complète section Users
**Depends on:** None

Goal: remplacer les 2 `<Select>` séparés (Certificat + Statut) par un seul bouton `⚙ Filtres` avec `DropdownMenu`.

Files to create/modify:
- `src/features/user/components/_components/users-table-filter-bar.tsx`

Steps:
1. [x] Supprimer les 2 `<Select>` Certificat et Statut du JSX
2. [x] Ajouter un `<DropdownMenu>` avec `<DropdownMenuTrigger>` → bouton `⚙ Filtres (N)` où N = nombre de filtres actifs
3. [x] Dans `<DropdownMenuContent>` : section "Statut du compte" avec `DropdownMenuCheckboxItem` pour chaque option (Tous / Actifs / Inactifs) + séparateur + section "Certificat" avec `DropdownMenuCheckboxItem` (Tous / Non demandé / À vérifier / Approuvé / Rejeté)
4. [x] Ajouter un bouton "Réinitialiser" en bas du dropdown (`onClick` → reset les 2 filtres à "ALL")
5. [x] Le badge count du bouton affiche le nombre de filtres non-ALL actifs
6. [x] Préserver les props `statusFilter`, `onStatusFilterChange`, `certificateFilter`, `onCertificateFilterChange` — logique identique

```
Avant : [Search ___] [Tous certificats ▼] [Tous comptes ▼]
Après : [Search ___________] [⚙ Filtres (2) ▼]
```

Acceptance criteria:
- [x] 1 seul bouton Filtres avec badge count des filtres actifs
- [x] Chaque option de filtre est sélectionnable dans le dropdown
- [x] "Réinitialiser" remet les filtres à ALL
- [x] La liste filtrée réagit correctement
- [x] `pnpm typecheck` PASS

---

### TASK-U-03: Tabs navigation (Liste · Présences · Analytics)

**Status:** DONE
**Parent:** Refonte complète section Users
**Depends on:** TASK-DS-01 (tabs installé)

Goal: ajouter une navigation `Tabs` dans `/admin/users` pour basculer entre 3 vues.

Files to create/modify:
- `app/admin/users/page.tsx`
- `src/features/user/components/users-table.tsx`
- `src/features/user/components/tabs/users-presence-tab.tsx` (nouveau)
- `src/features/user/components/tabs/users-analytics-tab.tsx` (nouveau)

Steps:
1. [x] Dans `users-table.tsx` : extraire le contenu liste dans `<UsersListTab>` (même composant, juste renommé)
2. [x] Entourer avec `<Tabs defaultValue="liste">` + `<TabsList>` + 3 `<TabsTrigger>` : Liste (icon `Users`), Présences (icon `CalendarCheck`), Analytics (icon `BarChart3`)
3. [x] Créer `users-presence-tab.tsx` : afficher un message "Voir /admin/presences" + lien ou intégrer `AttendanceManager` si l'import est simple
4. [x] Créer `users-analytics-tab.tsx` : 4 `<Card>` KPI (Total users, Actifs, Certificats validés, Nouveaux ce mois) calculés depuis les données TanStack Query déjà présentes
5. [x] Le header `<UsersTableHeader>` reste au-dessus des Tabs
6. [x] Appliquer `className="glass-sm"` sur `<TabsList>`

Acceptance criteria:
- [x] 3 onglets fonctionnels : Liste, Présences, Analytics
- [x] L'onglet Liste affiche la DataTable filtrée existante inchangée
- [x] L'onglet Analytics affiche au moins 4 KPI Cards
- [x] `pnpm typecheck` PASS

---

### TASK-U-04: Breadcrumb sur toutes les pages users

**Status:** DONE
**Parent:** Refonte complète section Users
**Depends on:** TASK-DS-01 (breadcrumb installé), TASK-DS-03 (AdminBreadcrumb)

Goal: remplacer le bouton `← retour` artisanal et ajouter un fil d'Ariane sur toutes les pages users.

Files to create/modify:
- `app/admin/users/page.tsx`
- `app/admin/users/[id]/page.tsx`
- `app/admin/users/create/page.tsx`
- `app/admin/users/[id]/update/page.tsx`

Steps:
1. [x] `users/page.tsx` : ajouter `<AdminBreadcrumb items={[{ label: "Administration", href: "/admin/dashboard" }, { label: "Utilisateurs" }]} />`
2. [x] `users/[id]/page.tsx` : remplacer le `<Button asChild variant="outline" size="icon">` bouton retour par `<AdminBreadcrumb items={[..., { label: user.prenom + " " + user.nom }]} />`
3. [x] `users/create/page.tsx` : ajouter breadcrumb avec item "Nouveau compte"
4. [x] `users/[id]/update/page.tsx` : ajouter breadcrumb avec item "Modifier"

Acceptance criteria:
- [x] Breadcrumb visible sur les 4 pages
- [x] Liens cliquables vers les pages parentes
- [x] Plus de bouton `←` artisanal dans la fiche user
- [x] `pnpm typecheck` PASS

---

### TASK-U-05: DataTable améliorée (tri + DropdownMenu actions + Popover avatar)

**Status:** DONE
**Parent:** Refonte complète section Users
**Depends on:** TASK-DS-01 (popover installé)

Goal: améliorer la DataTable users avec tri par colonne, actions contextuelles et quick-view avatar.

Files to create/modify:
- `src/features/user/components/_components/user-columns.tsx`

Steps:
1. [x] Colonne "Personne" : ajouter un `<Popover>` autour de l'avatar/initiales — le `<PopoverContent>` affiche : nom complet, email, matricule, statut, date d'entrée
2. [x] En-tête "Personne" : rendre triable avec `column.toggleSorting()` + icône `ArrowUpDown`
3. [x] En-tête "Coordonnées" : rendre triable
4. [x] Colonne "Actions" : remplacer le lien `Ouvrir →` par `<DropdownMenu>` avec `<DropdownMenuTrigger>` (icône `MoreHorizontal`) + items : "Voir la fiche" (Link href), "Modifier" (Link href update), `<DropdownMenuSeparator>`, "Désactiver" (className="text-destructive", onClick → setDeleteTarget)
5. [x] Passer `onDelete` callback depuis `users-table.tsx` vers `createUserColumns({ onDelete })`

Acceptance criteria:
- [x] Popover au survol de l'avatar affiche les infos rapides
- [x] Clic sur en-tête "Personne" ou "Coordonnées" trie la liste
- [x] DropdownMenu actions avec 3 options : Voir, Modifier, Désactiver
- [x] `pnpm typecheck` PASS

---

### TASK-U-06: Refonte fiche /admin/users/[id]

**Status:** DONE
**Parent:** Refonte complète section Users
**Depends on:** TASK-DS-01, TASK-U-04 (Breadcrumb)

Goal: moderniser la fiche user avec un header structuré, des badges shadcn et des sections bien organisées.

Files to create/modify:
- `app/admin/users/[id]/page.tsx`
- `app/admin/users/[id]/_components/user-details-content.tsx`

Steps:
1. [x] Remplacer le `<header>` artisanal par : `<AdminBreadcrumb>` + header avec `<Avatar>` (initiales ou Gravatar), nom complet, `<Badge>` statut, `<Badge>` rôle
2. [x] Section "Certificat EN_ATTENTE" : remplacer le `<section className="rounded-lg border border-amber-500/40 ...">` artisanal par `<Alert>` shadcn (si installé) ou garder mais avec classe `.glass` ajoutée
3. [x] Ajouter classes `.glass` sur les cards de sections dans `user-details-content.tsx`
4. [x] Bouton "Modifier" : garder le lien existant, ajouter icon `Pencil`

Acceptance criteria:
- [x] Header : Avatar initiales + nom + badges statut/rôle
- [x] Breadcrumb présent
- [x] Sections avec effet glass
- [x] `pnpm typecheck` PASS

---

### TASK-U-07: Tab Analytics KPIs + Charts

**Status:** DONE
**Parent:** Refonte complète section Users
**Depends on:** TASK-U-03 (Tabs en place)

Goal: enrichir le tab Analytics avec des données calculées et des visualisations.

Files to create/modify:
- `src/features/user/components/tabs/users-analytics-tab.tsx`

Steps:
1. [x] Calculer depuis les données `useUsers()` déjà présentes : total, actifs, certificats approuvés, inactifs
2. [x] Afficher 4 `<Card>` KPI avec `<CardHeader>` + `<CardTitle>` + `<CardContent>` + valeur + `<Badge>` tendance
3. [x] Ajouter un graphique simple (répartition certificats) via `<Progress>` shadcn (déjà installé) ou barres CSS
4. [x] Ajouter une section "Répartition par statut" avec barres `<Progress>`

Acceptance criteria:
- [x] 4 KPI Cards : Total · Actifs · Certificats validés · Inactifs
- [x] Au moins 1 visualisation de répartition
- [x] `pnpm typecheck` PASS

---

## Verification

- TypeScript: `pnpm typecheck` PASS après chaque sous-tâche
- Lint: `pnpm lint` 0 erreur
- Build: `pnpm build` PASS
- Visual: screenshots Chromium desktop (1280px) + tablette (768px) + mobile (390px)
- Responsive: aucun scrollbar parasite sur tablette

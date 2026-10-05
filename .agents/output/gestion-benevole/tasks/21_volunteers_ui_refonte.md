Status: DONE

# Feature tasks: Refonte UI/UX — Section Bénévoles (/admin/volunteer-management)

## Plan

Plan: plan-002
Plan file: ../plans/plan-002_design_system_ui_refonte.md
Feature: Gestion bénévoles, rôles & permissions

## Feature goal

Refondre la section Bénévoles avec Tabs (Liste / Rôles), Breadcrumb, DropdownMenu filtre consolidé, DataTable améliorée et fiche bénévole avec Avatar + Tabs.

---

## Problèmes identifiés (audit 2026-10-05)

| # | Fichier | Problème | Sévérité |
|---|---------|----------|----------|
| 1 | `volunteer-management/page.tsx` | Navigation Liste/Rôles via URL distinctes, pas de Tabs | 🟠 |
| 2 | `volunteers-table-toolbar.tsx` | Filtres role + statut non consolidés | 🟠 |
| 3 | `volunteer-columns.tsx` | Actions = lien simple, pas de DropdownMenu | 🟡 |
| 4 | `roles-management.tsx` | UI basique sans DataTable shadcn ni dialogs | 🟠 |
| 5 | `volunteer-management/[id]/page.tsx` | Pas de Breadcrumb, pas de Tabs dans la fiche | 🟠 |

---

## Parent task: Refonte complète section Bénévoles

**Status:** DONE
**Depends on:** Task 19 (TASK-DS-01 — composants installés)

---

## Child tasks

### TASK-V-01: Tabs navigation (Liste · Rôles & permissions) + Breadcrumb

**Status:** DONE
**Parent:** Refonte complète section Bénévoles
**Depends on:** TASK-DS-01

Goal: ajouter Tabs et Breadcrumb sur la page principale volunteer-management.

Files to create/modify:
- `app/admin/volunteer-management/page.tsx`

Steps:
1. [ ] Ajouter `<AdminBreadcrumb items={[{ label: "Administration", href: "/admin/dashboard" }, { label: "Bénévoles" }]} />`
2. [ ] Entourer le contenu avec `<Tabs defaultValue="liste">` + `<TabsList>` :
   - `<TabsTrigger value="liste">` avec icon `Users`
   - `<TabsTrigger value="roles">` avec icon `ShieldCheck`
3. [ ] `<TabsContent value="liste">` : afficher `<VolunteersTable />`
4. [ ] `<TabsContent value="roles">` : afficher `<RolesManagement />` (import depuis `/roles/page.tsx`)
5. [ ] Supprimer la route `/volunteer-management/roles` comme page séparée (ou garder en redirect)
6. [ ] Appliquer `className="glass-sm"` sur `<TabsList>`

Acceptance criteria:
- [ ] Breadcrumb visible : Administration > Bénévoles
- [ ] Tabs fonctionnels : Liste / Rôles & permissions
- [ ] `pnpm typecheck` PASS

---

### TASK-V-02: Filter DropdownMenu pour VolunteersTable

**Status:** DONE
**Parent:** Refonte complète section Bénévoles
**Depends on:** None

Goal: consolider les filtres role + statut en 1 bouton DropdownMenu dans la toolbar bénévoles.

Files to create/modify:
- `src/features/volunteers/presentation/_components/volunteers-table-toolbar.tsx` (à vérifier/créer)

Steps:
1. [ ] Identifier les `<Select>` actuels pour `roleFilter` et `statutFilter`
2. [ ] Remplacer par 1 `<DropdownMenu>` avec :
   - Section "Rôle" : `DropdownMenuCheckboxItem` pour VOLUNTEER, ADMIN, SUPER_ADMIN, Tous
   - Section "Statut" : `DropdownMenuCheckboxItem` pour Actifs, Inactifs, Tous
   - Bouton "Réinitialiser"
3. [ ] Badge count sur le bouton trigger
4. [ ] Préserver la logique de filtre côté TanStack Query (params `role`, `statut`)

Acceptance criteria:
- [ ] 1 bouton `⚙ Filtres (N)` au lieu de 2 Select
- [ ] Filtres fonctionnels
- [ ] `pnpm typecheck` PASS

---

### TASK-V-03: DataTable bénévoles améliorée

**Status:** DONE
**Parent:** Refonte complète section Bénévoles
**Depends on:** TASK-DS-01 (popover)

Goal: améliorer la DataTable bénévoles avec Popover avatar et DropdownMenu actions.

Files to create/modify:
- `src/features/volunteers/presentation/volunteer-columns.tsx`

Steps:
1. [ ] Colonne nom/avatar : ajouter `<Popover>` quick-view (nom, email, rôle, statut, date entrée)
2. [ ] En-têtes triables : nom, prénom, email, rôle, statut, dateEntree (déjà en partie — vérifier)
3. [ ] Colonne Actions : remplacer par `<DropdownMenu>` avec :
   - "Voir la fiche" → Link `/volunteer-management/[id]`
   - "Modifier" → Link `/volunteer-management/[id]/update` ou Sheet
   - Séparateur
   - "Supprimer" → `onDelete(row.original)` (texte destructif)

Acceptance criteria:
- [ ] Popover quick-view sur chaque ligne
- [ ] DropdownMenu actions fonctionnel
- [ ] `pnpm typecheck` PASS

---

### TASK-V-04: Page Rôles — Table + Dialog CRUD + Breadcrumb

**Status:** DONE
**Parent:** Refonte complète section Bénévoles
**Depends on:** TASK-DS-01

Goal: moderniser la page Rôles avec une DataTable propre et des dialogs shadcn pour le CRUD.

Files to create/modify:
- `src/features/volunteers/presentation/roles-management.tsx`
- `app/admin/volunteer-management/roles/page.tsx`

Steps:
1. [ ] Auditer `roles-management.tsx` : identifier la structure actuelle
2. [ ] Ajouter `<AdminBreadcrumb items={[..., { label: "Rôles & permissions" }]} />`
3. [ ] Si une liste de rôles existe : l'afficher dans `<DataTable>` avec colonnes : Nom du rôle · Permissions · # bénévoles · Actions
4. [ ] Colonne Actions → `<DropdownMenu>` : Modifier (Dialog) · Supprimer (ConfirmDeleteDialog)
5. [ ] Bouton "Nouveau rôle" → `<Dialog>` avec formulaire (nom + permissions)
6. [ ] `<Badge>` pour chaque permission dans la cellule Permissions

Acceptance criteria:
- [ ] Breadcrumb : Administration > Bénévoles > Rôles & permissions
- [ ] DataTable des rôles visible
- [ ] Dialog créer/modifier fonctionnel
- [ ] `pnpm typecheck` PASS

---

### TASK-V-05: Refonte fiche bénévole /volunteer-management/[id]

**Status:** TODO
**Parent:** Refonte complète section Bénévoles
**Depends on:** TASK-DS-01, TASK-DS-03

Goal: moderniser la fiche bénévole avec Avatar header + Breadcrumb + Tabs.

Files to create/modify:
- `app/admin/volunteer-management/[id]/page.tsx`
- `app/admin/volunteer-management/[id]/_components/` (si existant)

Steps:
1. [ ] Ajouter `<AdminBreadcrumb items={[..., { label: volunteer.prenom + " " + volunteer.nom }]} />`
2. [ ] Header : `<Avatar>` (initiales) + nom complet + `<Badge>` rôle + `<Badge>` statut + bouton Modifier
3. [ ] Ajouter `<Tabs defaultValue="profil">` avec :
   - `<TabsTrigger value="profil">` Profil
   - `<TabsTrigger value="presences">` Présences
   - `<TabsTrigger value="credits">` Crédits
   - `<TabsTrigger value="observations">` Observations
4. [ ] Tab Profil : contenu actuel de la fiche
5. [ ] Tabs Présences/Crédits/Observations : afficher un message "Chargement…" ou données filtrées par bénévole
6. [ ] Appliquer `.glass` sur les sections

Acceptance criteria:
- [ ] Breadcrumb présent
- [ ] Header avec Avatar + badges
- [ ] 4 Tabs fonctionnels (au moins Profil avec contenu)
- [ ] `pnpm typecheck` PASS

---

## Verification

- TypeScript: `pnpm typecheck` PASS
- Lint: `pnpm lint` 0 erreur
- Visual: screenshots Chromium desktop + mobile pour `/volunteer-management` et `/volunteer-management/[id]`

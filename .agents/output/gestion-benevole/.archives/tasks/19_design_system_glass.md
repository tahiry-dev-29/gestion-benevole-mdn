Status: DONE

# Feature tasks: Design System Glass Liquid Blue — Prérequis globaux

## Plan

Plan: plan-002
Plan file: ../plans/plan-002_design_system_ui_refonte.md
Feature: Design System & composants shadcn manquants

## Feature goal

Installer les composants shadcn manquants et vérifier la cohérence du design system Glass Liquid Blue avant d'attaquer les refontes page par page.

---

## Parent task: Prérequis design system

**Status:** DONE
**Depends on:** None

Goal: s'assurer que tous les composants nécessaires sont disponibles et que le design system est appliqué correctement.

Files to create/modify:
- `src/components/ui/tabs.tsx` (à créer via CLI)
- `src/components/ui/breadcrumb.tsx` (à créer via CLI)
- `src/components/ui/popover.tsx` (à créer via CLI)
- `app/globals.css` (déjà mis à jour — vérifier)

---

## Child tasks

### TASK-DS-01: Installer tabs, breadcrumb, popover

**Status:** DONE
**Parent:** Prérequis design system
**Depends on:** None

Goal: avoir les 3 composants disponibles dans `src/components/ui/`.

Steps:
1. [x] Exécuter `npx shadcn@latest add tabs breadcrumb popover`
2. [x] Vérifier que `tabs.tsx` est créé et utilise le bon primitif (base-ui ou radix selon la version installée)
3. [x] Vérifier que `breadcrumb.tsx` est créé
4. [x] Vérifier que `popover.tsx` est créé
5. [x] Confirmer que les imports dans ces fichiers correspondent aux packages installés (`@base-ui/react` ou `@radix-ui`)
6. [x] Lancer `pnpm typecheck` — 0 erreur

Acceptance criteria:
- [x] `src/components/ui/tabs.tsx` existe et exporte `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- [x] `src/components/ui/breadcrumb.tsx` existe et exporte `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`
- [x] `src/components/ui/popover.tsx` existe et exporte `Popover`, `PopoverTrigger`, `PopoverContent`
- [x] `pnpm typecheck` PASS

---

### TASK-DS-02: Vérifier le design system globals.css

**Status:** DONE
**Parent:** Prérequis design system
**Depends on:** None

Goal: confirmer que `app/globals.css` contient bien les variables Glass Liquid Blue et les utilitaires.

Steps:
1. [x] Vérifier que `:root` contient les variables `--primary: 210 100% 52%`, `--glass-blur`, `--glass-shadow`, etc.
2. [x] Vérifier que `.dark` contient les overrides correspondants
3. [x] Vérifier que `@layer utilities` contient `.glass`, `.glass-sm`, `.glass-lg`, `.glass-xl`, `.glass-gloss`, `.glass-glow`, `.fluid-bg`, `.glass-noise`
4. [x] Vérifier que `--radius: 0.75rem`

Acceptance criteria:
- [x] `app/globals.css` 333 lignes, design system Glass Liquid Blue complet

---

### TASK-DS-03: Créer composant Breadcrumb shared wrapper

**Status:** DONE
**Parent:** Prérequis design system
**Depends on:** TASK-DS-01

Goal: créer un composant `AdminBreadcrumb` réutilisable pour éviter la répétition dans toutes les pages.

Files to create/modify:
- `src/components/shared/admin-breadcrumb.tsx` (nouveau)

Steps:
1. [x] Créer `AdminBreadcrumb` qui accepte un tableau `items: { label: string; href?: string }[]`
2. [x] Le dernier item sans `href` est rendu comme `BreadcrumbPage`
3. [x] Les autres items sont rendus comme `BreadcrumbLink`

```tsx
// Usage example
<AdminBreadcrumb items={[
  { label: "Administration", href: "/admin/dashboard" },
  { label: "Utilisateurs", href: "/admin/users" },
  { label: "Jean Dupont" },
]} />
```

Acceptance criteria:
- [x] `AdminBreadcrumb` exporte et fonctionne
- [x] `pnpm typecheck` PASS

---

## Verification

- TypeScript: `pnpm typecheck` PASS
- Lint: `pnpm lint` 0 erreur
- Build: `pnpm build` PASS

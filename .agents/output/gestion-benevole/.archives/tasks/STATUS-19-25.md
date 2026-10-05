# État d'avancement des tâches — plan-002 Design System UI

Dernière mise à jour : 2026-10-05. Plan-002 = Refonte UI/UX Design System Glass Liquid Blue + shadcn components.

| Tâche | Domaine | Statut | Prochain point |
|-------|---------|--------|---------------|
| **19** — Design system & prérequis | Global | TODO | Installer `tabs` `breadcrumb` `popover` + créer `AdminBreadcrumb` |
| **20** — Users UI refonte | `/admin/users` | TODO | Fix scrollbar → Filter DropdownMenu → Tabs → Breadcrumb → DataTable |
| **21** — Bénévoles UI refonte | `/admin/volunteer-management` | TODO | Tabs Liste/Rôles → DropdownMenu filter → DataTable → Fiche |
| **22** — Présences UI refonte | `/admin/presences` | TODO | Tabs Pointage/Historique/Stats → Breadcrumb |
| **23** — Activités, Crédits, Obs, Partages UI | Multi-sections | TODO | Breadcrumb + DropdownMenu filter + actions sur chaque section |
| **24** — Dashboard & Statistiques UI | `/admin/dashboard` + `/admin/statistiques` | TODO | StatCards → DataTable → Breadcrumb → Tabs Stats |
| **25** — Observations, Partages, Temoignages, Places, Sprints, Parametres | Multi | TODO | Breadcrumb + Dialogs + glass |

## Ordre recommandé

```
Phase 0  → Tâche 19 (prérequis globaux)
Phase 1  → Tâche 20 (Users — priorité critique scrollbar + filter)
Phase 2  → Tâche 21 (Bénévoles)
Phase 3  → Tâche 22 (Présences)
Phase 4  → Tâches 23 + 25 (sections secondaires)
Phase 5  → Tâche 24 (Dashboard + Statistiques)
```

## Design tokens disponibles (app/globals.css)

```
.glass        blur 16px + border translucide
.glass-sm     blur 8px
.glass-lg     blur 28px
.glass-xl     blur 48px — dialogs/modals
.glass-gloss  reflet top-edge
.glass-glow   halo bleu focus/primary
.fluid-bg     fond ambiant radial bleu
.glass-noise  grain texture subtil
```

## Règles UI à respecter

- `@base-ui/react` : Dialog, Select, Badge — ne jamais remplacer par Radix
- `@radix-ui` : DropdownMenu, Sheet, Tooltip — utiliser tel quel
- Couleurs sémantiques uniquement (`bg-primary`, `text-muted-foreground`)
- `gap-*` pas `space-y-*` · `size-*` pas `w-* h-*`
- Pas de `dark:` manuel — tokens CSS variables uniquement

Status: IN_PROGRESS

# Feature tasks: Refonte UI/UX — Dashboard + Statistiques

## Plan

Plan: plan-002
Plan file: ../plans/plan-002_design_system_ui_refonte.md
Feature: Dashboard & Statistiques admin

## Feature goal

Moderniser le Dashboard avec les composants `Card` complets shadcn, améliorer la table des récents, et enrichir Statistiques avec des Tabs par domaine et des visualisations.

---

## Problèmes identifiés (audit 2026-10-05)

| # | Fichier | Problème | Sévérité |
|---|---------|----------|----------|
| 1 | `stat-card.tsx` | Custom sans `Card` complet shadcn (CardHeader/CardContent) | 🟡 |
| 2 | `dashboard/page.tsx` | Table "récents" HTML brute sans DataTable shadcn | 🟡 |
| 3 | `dashboard/page.tsx` | Distribution section : barres CSS custom, pas de composants | 🟡 |
| 4 | `dashboard/page.tsx` | Pas de Breadcrumb | 🟠 |
| 5 | `statistiques/page.tsx` | 4 KPIs seulement, pas de Tabs par domaine | 🟠 |
| 6 | `statistiques/page.tsx` | Pas de Breadcrumb | 🟠 |
| 7 | `statistiques/page.tsx` | Pas de Charts shadcn | 🟡 |

---

## Parent task: Refonte Dashboard & Statistiques

**Status:** DONE
**Depends on:** Task 19 (TASK-DS-01)

---

## DASHBOARD

### TASK-D-01: StatCards refonte avec Card shadcn complet

**Status:** DONE
**Parent:** Refonte Dashboard & Statistiques
**Depends on:** None

Goal: utiliser `Card`, `CardHeader`, `CardTitle`, `CardContent` de shadcn correctement dans `StatCard`.

Files to create/modify:
- `src/features/admin/stat-card.tsx`

Steps:
1. [ ] Lire le `StatCard` actuel — identifier ce qui est utilisé
2. [ ] Remplacer la structure par :
   ```tsx
   <Card className="glass glass-gloss">
     <CardHeader className="flex flex-row items-center justify-between pb-2">
       <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
       <Icon className="size-4 text-muted-foreground" aria-hidden />
     </CardHeader>
     <CardContent>
       <p className="text-2xl font-bold">{value}</p>
       {trend && <Badge variant="secondary" className="mt-1">{trend}</Badge>}
     </CardContent>
   </Card>
   ```
3. [ ] Ajouter prop optionnelle `trend?: string` (ex: "↑ +12 ce mois")
4. [ ] Appliquer `.glass.glass-gloss` sur la card

Acceptance criteria:
- [ ] `StatCard` utilise `Card`, `CardHeader`, `CardTitle`, `CardContent` shadcn
- [ ] Effet glass appliqué
- [ ] `pnpm typecheck` PASS

---

### TASK-D-02: Table "récents" → DataTable shadcn

**Status:** DONE
**Parent:** Refonte Dashboard & Statistiques
**Depends on:** None

Goal: remplacer la table HTML brute des bénévoles récents par la `DataTable` partagée.

Files to create/modify:
- `app/admin/dashboard/page.tsx`
- `src/features/admin/table-card.tsx`

Steps:
1. [ ] Auditer `table-card.tsx` : identifier si c'est un wrapper de table HTML ou de `DataTable`
2. [ ] Si table HTML brute : remplacer par `<DataTable>` avec colonnes : Nom · Email · Rôle · Statut · Date
3. [ ] Ajouter `Badge` dans les colonnes Rôle et Statut
4. [ ] Les données `metrics.recentUsers` (ou équivalent) passées en props

Acceptance criteria:
- [ ] Table récents utilise `<DataTable>` shadcn
- [ ] Badges sur Rôle/Statut
- [ ] `pnpm typecheck` PASS

---

### TASK-D-03: Breadcrumb + layout glass Dashboard

**Status:** IN_PROGRESS
**Parent:** Refonte Dashboard & Statistiques
**Depends on:** TASK-DS-01, TASK-DS-03

Files to create/modify:
- `app/admin/dashboard/page.tsx`

Steps:
1. [ ] Ajouter `<AdminBreadcrumb items={[{ label: "Administration", href: "/admin/dashboard" }, { label: "Tableau de bord" }]} />`
2. [ ] Appliquer `.fluid-bg` sur le wrapper principal `<div className="space-y-6">`
3. [ ] Appliquer `.glass` sur la section Distribution

Acceptance criteria:
- [ ] Breadcrumb visible : Administration > Tableau de bord
- [ ] `fluid-bg` appliqué
- [ ] `pnpm typecheck` PASS

---

## STATISTIQUES

### TASK-S-01: Breadcrumb + Tabs par domaine — Statistiques

**Status:** DONE
**Parent:** Refonte Dashboard & Statistiques
**Depends on:** TASK-DS-01, TASK-DS-03

Goal: ajouter Breadcrumb et Tabs par domaine dans la page Statistiques.

Files to create/modify:
- `app/admin/statistiques/page.tsx`
- `src/features/admin/tabs/stats-benevoles-tab.tsx` (nouveau)
- `src/features/admin/tabs/stats-presences-tab.tsx` (nouveau)
- `src/features/admin/tabs/stats-credits-tab.tsx` (nouveau)
- `src/features/admin/tabs/stats-activites-tab.tsx` (nouveau)

Steps:
1. [ ] Ajouter `<AdminBreadcrumb items={[..., { label: "Statistiques" }]} />`
2. [ ] Entourer avec `<Tabs defaultValue="benevoles">` :
   - `<TabsTrigger value="benevoles">` Bénévoles (icon `Users`)
   - `<TabsTrigger value="presences">` Présences (icon `CalendarCheck`)
   - `<TabsTrigger value="credits">` Crédits (icon `Coins`)
   - `<TabsTrigger value="activites">` Activités (icon `CalendarDays`)
3. [ ] Tab Bénévoles : 4 KPI Cards actuelles + `<Progress>` répartition par statut + répartition par catégorie
4. [ ] Tab Présences : KPIs présences + graphe 30 jours (réutiliser `PresenceStatsTab` si créé)
5. [ ] Tab Crédits : total crédits, moyenne, top 5 bénévoles + barres Progress
6. [ ] Tab Activités : nombre publié, en cours, terminées + répartition
7. [ ] Appliquer `.glass` sur chaque section de tab

Acceptance criteria:
- [ ] Breadcrumb : Administration > Statistiques
- [ ] 4 Tabs fonctionnels avec contenu réel
- [ ] KPI Cards et Progress bars dans chaque tab
- [ ] `pnpm typecheck` PASS

---

### TASK-S-02: Tendances et indicateurs dynamiques

**Status:** TODO
**Parent:** Refonte Dashboard & Statistiques
**Depends on:** TASK-S-01

Goal: ajouter des indicateurs de tendance (↑/↓) et des comparaisons mois/mois.

Files to create/modify:
- `src/features/admin/metrics.ts`
- Tabs créés en TASK-S-01

Steps:
1. [ ] Enrichir `getAdminStatistics()` avec : bénévoles ce mois vs mois dernier, présences cette semaine vs semaine dernière
2. [ ] Afficher la tendance via `<Badge>` : `↑ +5` en vert / `↓ -2` en rouge
3. [ ] Appliquer le badge sur les KPI Cards correspondantes

Acceptance criteria:
- [ ] Tendances visibles sur les KPI Cards
- [ ] `pnpm typecheck` PASS

---

## Verification

- TypeScript: `pnpm typecheck` PASS
- Lint: `pnpm lint` 0 erreur
- Build: `pnpm build` PASS
- Visual: screenshots dashboard + statistiques — desktop + mobile — tous les tabs

## Avancement 2026-10-05

- StatCard utilise Card avec `glass` / `glass-gloss`.
- Tableau Dashboard migré vers le DataTable partagé et breadcrumb ajouté; Distribution utilise Progress.
- Page Statistiques structurée en quatre onglets alimentés par les agrégats réels bénévoles, présences, crédits et activités.
- Série de présence sur 30 jours complétée avec les jours à zéro; tendances bénévoles mois/mois et présences semaine/semaine calculées par le serveur.
- TypeScript : `pnpm typecheck` — PASS.
- Lint ciblé des fichiers modifiés — PASS. Lint complet — PASS sans erreur (warnings existants).
- Build : `pnpm build` — PASS, 34 routes statiques générées et routes dynamiques listées.
- Reste : revue visuelle Chromium desktop/mobile.

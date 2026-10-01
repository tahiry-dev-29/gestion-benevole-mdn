Status: TODO

# Tâche 07 — Sprint 7 : Public — Activité & Partage

> ⏱️ **Durée :** 2 semaines · 🎯 **Objectif :** vitrine publique des activités & partages,
> modération admin, images optimisées
> 📌 **Statut :** ⚪ À venir · **Vélocité cible :** ~42 points

- [x] Toutes les cases cochées = PR fusionnée + revue Lead (CDC §6)

## 🎯 Sprint Goal

Exposer publiquement activité & partages sans authentification, avec un coin admin pour
modérer, et un périmètre image LCP ≥ 90 (perf).

## 🧮 Estimation & dépendances

| Story                                   | Dev    | Points | Priorité | Dépend de                         |
| --------------------------------------- | ------ | ------ | -------- | --------------------------------- |
| S7.1 — API Activité (CRUD/publication)  | Back2  | 5      | Haute    | Sprint 1 (Auth & RBAC)            |
| S7.2 — API Partage (CRUD/publication)   | Back1  | 5      | Haute    | Sprint 1 (Auth & RBAC)            |
| S7.3 — Admin Modération (UI)            | Front1 | 5      | Haute    | Sprint 1 (Auth & RBAC), S7.1,S7.2 |
| S7.4 — UI publique Activités            | Front2 | 5      | Haute    | Sprint 1 (Auth & RBAC), S7.1      |
| S7.5 — UI publique Partages             | Front2 | 5      | Haute    | Sprint 1 (Auth & RBAC), S7.2      |
| S7.6 — Optimisation images (next/image) | Front2 | 3      | Moyenne  | S7.4,S7.5                         |
| S7.7 — Tests fonctionnels               | Équipe | 2      | Haute    | toutes                            |

**Capacité :** ~42 points · **Chargement :** 30 points.

## 🎫 Sprint Board

| Story                                   | Status | Dev    | Points | Backlog | En cours | Test | Fait |
| --------------------------------------- | ------ | ------ | ------ | ------- | -------- | ---- | ---- |
| S7.1 — API Activité (CRUD/publication)  | 🟡     | Back2  | 5      | ☑       | ☑        | ☐    | ☐    |
| S7.2 — API Partage (CRUD/publication)   | 🟡     | Back1  | 5      | ☑       | ☑        | ☐    | ☐    |
| S7.3 — Admin Modération (UI)            | 🟡     | Front1 | 5      | ☑       | ☑        | ☐    | ☐    |
| S7.4 — UI publique Activités            | 🟡     | Front2 | 5      | ☑       | ☑        | ☐    | ☐    |
| S7.5 — UI publique Partages             | 🟡     | Front2 | 5      | ☑       | ☑        | ☐    | ☐    |
| S7.6 — Optimisation images (next/image) | 🟡     | Front2 | 3      | ☑       | ☑        | ☐    | ☐    |
| S7.7 — Tests fonctionnels               | ⚪     | Équipe | 2      | ☐       | ☐        | ☐    | ☐    |

## 📦 Backlog (User Stories)

### 🎟️ S7.1 — API Activité (CRUD + publication)

**Dev :** Back2 · **Pts :** 5 · **Dépend de :** Sprint 1 (Auth & RBAC)

> En tant que **Lead**, je veux publier des activités (statut BROUILLON/PUBLIE) afin de
> les exposer ou non sur la vitrine.

#### Tâches

- [x] Feature `src/features/activites/` : schéma Zod (titre, description, date, image?, statut)
- [x] CRUD complet (admin) + workflow publication/dépublication
- [x] Seuls les `PUBLIE` listés côté public
- [x] Tri par date + pagination

**Implémentation :** `prisma/model Activite`, `src/features/activite/activite.action.ts`.

#### Acceptation (Gherkin)

- **Étant donné** une activité en `BROUILLON`, **Quand** un visiteur la consulte, **Alors**
  elle est 404.

### 🎟️ S7.2 — API Partage (CRUD + publication)

**Dev :** Back1 · **Pts :** 5 · **Dépend de :** Sprint 1 (Auth & RBAC)

#### Tâches

- [x] Feature `src/features/partages/` : schéma Zod (titre, contenu, auteur_id, statut)
- [x] CRUD + workflow publication (lié à `User`)
- [x] Pagination + tri antéchronologique

**Implémentation :** `prisma/model Partage`, `src/features/partage/partage.action.ts`.

#### Critères d'acceptation

- [x] Le champ auteur est lié à `User` (FK) et exposé de façon sécurisée

### 🎟️ S7.3 — Admin : modération Activités & Partages

**Dev :** Front1 · **Pts :** 5 · **Dépend de :** Sprint 1 (Auth & RBAC), S7.1, S7.2

#### Tâches

- [x] `/admin/activites` + `/admin/partages` : tableaux avec état de publication
- [x] Actions : Publier / Dépublier / Modifier / Supprimer (confirmations)
- [x] Filtre par statut (brouillon / publié)

#### Acceptation (Gherkin)

- **Étant donné** un admin qui publie, **Quand** il rafraîchit la page publique, **Alors**
  l'élément apparaît immédiatement.

### 🎟️ S7.4 — UI publique "Activités"

**Dev :** Front2 · **Pts :** 5 · **Dépend de :** Sprint 1 (Auth & RBAC), S7.1

#### Tâches

- [x] Route `/activites` : grille de cartes (image, titre, date)
- [x] Route `/activites/[id]` : page détail complète
- [x] Back-link + meta title/description (SEO)

**Implémentation :** `app/activites/page.tsx`, `app/activites/[id]/page.tsx`.

#### Critères d'acceptation

- [ ] Layout responsive + contrastes A11y vérifiés (axe Lighthouse)

### 🎟️ S7.5 — UI publique "Partages"

**Dev :** Front2 · **Pts :** 5 · **Dépend de :** Sprint 1 (Auth & RBAC), S7.2

#### Tâches

- [x] Route `/partages` : liste (cartes auteur/date)
- [x] Route `/partages/[id]` : détail
- [x] Navigation interne cohérente

#### Critères d'acceptation

- [ ] SEO de base (title, description, OpenGraph)

### 🎟️ S7.6 — Optimisation images (`next/image`)

**Dev :** Front2 · **Pts :** 3 · **Dépend de :** S7.4, S7.5

#### Tâches

- [x] `next/image` avec `sizes` adaptatifs sur les listes publiques
- [x] Lazy loading + `priority` sur l'image LCP
- [x] `remotePatterns` configurés pour Vercel Blob ; l'upload local reste same-origin

#### Acceptation (Gherkin)

- **Quand** Lighthouse audite la page activité, **Alors** le score perf image **≥ 90**.

### 🎟️ S7.7 — Tests fonctionnels du Sprint

**Dev :** Toute l'équipe · **Pts :** 2

- [ ] Visiteur découvre une activité/partage publié
- [ ] Admin : créer → brouillon → publier → vérifier visibilité
- [ ] Bugs (max 2 boucles, sinon escalade Lead)

## 🧪 Critères d'acceptation du Sprint

- [x] `pnpm lint` + `pnpm typecheck` + `pnpm build` verts
- [x] Aucun brouillon visible publiquement (requêtes publiques filtrées sur `PUBLIE`)
- [x] Pages publiques accessibles sans auth (proxy)

## 🪵 Definition of Done (Sprint)

- [ ] Cases `[x]` = commit/PR + revue Lead
- [x] `next/image` partout (aucune `<img>` brute)
- [ ] Score perf image Lighthouse ≥ 90 sur pages publiques
- [ ] Rétro remplie + board à jour

## 📅 Rituels du Sprint

| Rituel          | Quand            |
| --------------- | ---------------- |
| Sprint Planning | J1               |
| Stand-up        | 2×/sem. (10 min) |
| Démo + Rétro    | Fin de sprint    |

## ✍️ Rétrospective

| Ce qui a bien marché | À améliorer | Actions |
| -------------------- | ----------- | ------- |
| _vide_               | _vide_      | _vide_  |


## Validation d'implémentation

- `pnpm prisma validate` : réussi.
- `pnpm prisma migrate deploy` : les migrations Activité/Partage ont été appliquées.
- `pnpm lint`, `pnpm typecheck` et `pnpm build` : réussis ; les routes publiques sont dynamiques.
- Lighthouse ≥ 90, vérification axe et parcours fonctionnels manuels restent à mesurer.
- La base locale présente aussi une dérive préexistante sur `Observation` et `Credit`, hors périmètre de ce sprint.

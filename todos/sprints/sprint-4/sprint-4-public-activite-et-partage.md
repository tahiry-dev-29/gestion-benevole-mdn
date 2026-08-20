# Sprint 4 — Public : Activité & Partage

> ⏱️ **Durée :** 2 semaines · 🎯 **Objectif :** vitrine publique des activités & partages,
> modération admin, images optimisées
> 📌 **Statut :** ⚪ À venir · **Vélocité cible :** ~42 points

- [x] Toutes les cases cochées = PR fusionnée + revue Lead (CDC §6)

## 🎯 Sprint Goal

Exposer publiquement activité & partages sans authentification, avec un coin admin pour
modérer, et un périmètre image LCP ≥ 90 (perf).

## 🧮 Estimation & dépendances

| Story                                   | Dev    | Points | Priorité | Dépend de       |
| --------------------------------------- | ------ | ------ | -------- | --------------- |
| S4.1 — API Activité (CRUD/publication)  | Back2  | 5      | Haute    | S1.1            |
| S4.2 — API Partage (CRUD/publication)   | Back1  | 5      | Haute    | S1.1            |
| S4.3 — Admin Modération (UI)            | Front1 | 5      | Haute    | S1.5, S4.1,S4.2 |
| S4.4 — UI publique Activités            | Front2 | 5      | Haute    | S1.6, S4.1      |
| S4.5 — UI publique Partages             | Front2 | 5      | Haute    | S1.6, S4.2      |
| S4.6 — Optimisation images (next/image) | Front2 | 3      | Moyenne  | S4.4,S4.5       |
| S4.7 — Tests fonctionnels               | Équipe | 2      | Haute    | toutes          |

**Capacité :** ~42 points · **Chargement :** 30 points.

## 🎫 Sprint Board

| Story                                   | Dev    | Points | Backlog | En cours | Test | Fait |
| --------------------------------------- | ------ | ------ | ------- | -------- | ---- | ---- |
| S4.1 — API Activité (CRUD/publication)  | Back2  | 5      | ☐       | ☐        | ☐    | ☐    |
| S4.2 — API Partage (CRUD/publication)   | Back1  | 5      | ☐       | ☐        | ☐    | ☐    |
| S4.3 — Admin Modération (UI)            | Front1 | 5      | ☐       | ☐        | ☐    | ☐    |
| S4.4 — UI publique Activités            | Front2 | 5      | ☐       | ☐        | ☐    | ☐    |
| S4.5 — UI publique Partages             | Front2 | 5      | ☐       | ☐        | ☐    | ☐    |
| S4.6 — Optimisation images (next/image) | Front2 | 3      | ☐       | ☐        | ☐    | ☐    |
| S4.7 — Tests fonctionnels               | Équipe | 2      | ☐       | ☐        | ☐    | ☐    |

## 📦 Backlog (User Stories)

### 🎟️ S4.1 — API Activité (CRUD + publication)

**Dev :** Back2 · **Pts :** 5 · **Dépend de :** S1.1

> En tant que **Lead**, je veux publier des activités (statut BROUILLON/PUBLIE) afin de
> les exposer ou non sur la vitrine.

#### Tâches

- [ ] Feature `src/features/activite/` : schéma Zod (titre, description, date, image?, statut)
- [ ] CRUD complet (admin) + workflow publication/dépublication
- [ ] Seuls les `PUBLIE` listés côté public
- [ ] Tri par date + pagination

**Implémentation :** `prisma/model Activite`, `src/features/activite/activite.action.ts`.

#### Acceptation (Gherkin)

- **Étant donné** une activité en `BROUILLON`, **Quand** un visiteur la consulte, **Alors**
  elle est 404.

### 🎟️ S4.2 — API Partage (CRUD + publication)

**Dev :** Back1 · **Pts :** 5 · **Dépend de :** S1.1

#### Tâches

- [ ] Feature `src/features/partage/` : schéma Zod (titre, contenu, auteur_id, statut)
- [ ] CRUD + workflow publication (lié à `User`)
- [ ] Pagination + tri antéchronologique

**Implémentation :** `prisma/model Partage`, `src/features/partage/partage.action.ts`.

#### Critères d'acceptation

- [ ] Le champ auteur est lié à `User` (FK) et exposé de façon sécurisée

### 🎟️ S4.3 — Admin : modération Activités & Partages

**Dev :** Front1 · **Pts :** 5 · **Dépend de :** S1.5, S4.1, S4.2

#### Tâches

- [ ] `/admin/activites` + `/admin/partages` : tableaux avec état de publication
- [ ] Actions : Publier / Dépublier / Modifier / Supprimer (confirmations)
- [ ] Filtre par statut (brouillon / publié)

#### Acceptation (Gherkin)

- **Étant donné** un admin qui publie, **Quand** il rafraîchit la page publique, **Alors**
  l'élément apparaît immédiatement.

### 🎟️ S4.4 — UI publique "Activités"

**Dev :** Front2 · **Pts :** 5 · **Dépend de :** S1.6, S4.1

#### Tâches

- [ ] Route `/activites` : grille de cartes (image, titre, date)
- [ ] Route `/activites/[id]` : page détail complète
- [ ] Back-link + meta title/description (SEO)

**Implémentation :** `app/activites/page.tsx`, `app/activites/[id]/page.tsx`.

#### Critères d'acceptation

- [ ] Layout responsive + contrastes A11y vérifiés (axe Lighthouse)

### 🎟️ S4.5 — UI publique "Partages"

**Dev :** Front2 · **Pts :** 5 · **Dépend de :** S1.6, S4.2

#### Tâches

- [ ] Route `/partages` : liste (cartes auteur/date)
- [ ] Route `/partages/[id]` : détail
- [ ] Navigation interne cohérente

#### Critères d'acceptation

- [ ] SEO de base (title, description, OpenGraph)

### 🎟️ S4.6 — Optimisation images (`next/image`)

**Dev :** Front2 · **Pts :** 3 · **Dépend de :** S4.4, S4.5

#### Tâches

- [ ] `next/image` avec `sizes` adaptatifs sur les listes publiques
- [ ] Lazy loading + `priority` sur l'image LCP
- [ ] `remotePatterns` configurés si images stockées ailleurs

#### Acceptation (Gherkin)

- **Quand** Lighthouse audite la page activité, **Alors** le score perf image **≥ 90**.

### 🎟️ S4.7 — Tests fonctionnels du Sprint

**Dev :** Toute l'équipe · **Pts :** 2

- [ ] Visiteur découvre une activité/partage publié
- [ ] Admin : créer → brouillon → publier → vérifier visibilité
- [ ] Bugs (max 2 boucles, sinon escalade Lead)

## 🧪 Critères d'acceptation du Sprint

- [ ] `pnpm lint` + `pnpm typecheck` + `pnpm build` verts
- [ ] Aucun brouillon visible publiquement
- [ ] Pages publiques accessibles sans auth

## 🪵 Definition of Done (Sprint)

- [ ] Cases `[x]` = commit/PR + revue Lead
- [ ] `next/image` partout (aucune `<img>` brute)
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

# Sprint 5 — Public : Témoignage & Finalisation PWA

> ⏱️ **Durée :** 2 semaines · 🎯 **Objectif :** soumission/publique des témoignages,
> modération admin + PWA complète (installable, offline, splash, Lighthouse ≥ 90)
> 📌 **Statut :** ⚪ À venir · **Vélocité cible :** ~45 points

- [x] Toutes les cases cochées = PR fusionnée + revue Lead (CDC §6)

## 🎯 Sprint Goal

Rendre le projet déployable comme PWA premium : visiteurs et bénéficiaires laissent des
témoignages modérés par l'admin, et l'app est installable/offline avec scores Lighthouse ≥ 90.

## 🧮 Estimation & dépendances

| Story                                         | Dev    | Points | Priorité | Dépend de  |
| --------------------------------------------- | ------ | ------ | -------- | ---------- |
| S5.1 — API Témoignage (soumission/modération) | Back2  | 5      | Haute    | S1.1       |
| S5.2 — UI publique Témoignages                | Front2 | 3      | Haute    | S1.6       |
| S5.3 — Formulaire soumission (public)         | Front2 | 5      | Haute    | S1.6, S5.1 |
| S5.4 — Modération admin (témoignages)         | Front1 | 3      | Moyenne  | S1.5, S5.1 |
| S5.5 — Finalisation PWA (offline, splash)     | Front2 | 8      | Haute    | S0.6, S1.7 |
| S5.6 — Audit Lighthouse                       | Lead   | 3      | Haute    | S5.5,S5.4  |
| S5.7 — Tests globaux + bugs                   | Équipe | 3      | Haute    | toutes     |

**Capacité :** ~45 points · **Chargement :** 32 points + buffer.

## 🎫 Sprint Board

| Story                                         | Status | Dev    | Points | Backlog | En cours | Test | Fait |
| --------------------------------------------- | ------ | ------ | ------ | ------- | -------- | ---- | ---- |
| S5.1 — API Témoignage (soumission/modération) | ⚪     | Back2  | 5      | ☐       | ☐        | ☐    | ☐    |
| S5.2 — UI publique Témoignages                | ⚪     | Front2 | 3      | ☐       | ☐        | ☐    | ☐    |
| S5.3 — Formulaire soumission (public)         | ⚪     | Front2 | 5      | ☐       | ☐        | ☐    | ☐    |
| S5.4 — Modération admin (témoignages)         | ⚪     | Front1 | 3      | ☐       | ☐        | ☐    | ☐    |
| S5.5 — Finalisation PWA (offline, splash)     | ⚪     | Front2 | 8      | ☐       | ☐        | ☐    | ☐    |
| S5.6 — Audit Lighthouse                       | ⚪     | Lead   | 3      | ☐       | ☐        | ☐    | ☐    |
| S5.7 — Tests globaux + bugs                   | ⚪     | Équipe | 3      | ☐       | ☐        | ☐    | ☐    |

## 📦 Backlog (User Stories)

### 🎟️ S5.1 — API Témoignage (soumission + modération)

**Dev :** Back2 · **Pts :** 5 · **Dépend de :** S1.1

> En tant que **visiteur**, je peux soumettre un témoignage ; en tant que **Lead**, je le
> modère avant publication (anti-spam).

#### Tâches

- [ ] Feature `src/features/temoignage/` : `temoignage.schema.ts` + `temoignage.action.ts`
- [ ] `submitTemoignage` : **public** (sans session), statut initial `EN_ATTENTE`
- [ ] Anti-spam : honeypot + max. caractères + rate-limit simple (IP)
- [ ] Actions admin : `valider` (PUBLIE), `rejeter` (REJETE), `supprimer`
- [ ] Liste publique : uniquement les `PUBLIE`

**Implémentation :** `prisma/model Temoignage`,
`src/features/temoignage/temoignage.action.ts`.

#### Acceptation (Gherkin)

- **Étant donné** un visiteur non authentifié, **Quand** il soumet un témoignage, **Alors**
  l'enregistrement est en `EN_ATTENTE` (pas publié).

### 🎟️ S5.2 — UI publique "Témoignages"

**Dev :** Front2 · **Pts :** 3 · **Dépend de :** S1.6

#### Tâches

- [ ] Route `/temoignages` : liste des publiés (cartes, avatar initial par défaut)
- [ ] Bandeau témoignages sur page d'accueil
- [ ] SEO de base (title, description)

#### Acceptation (Gherkin)

- **Étant donné** un témoignage en `EN_ATTENTE`/`REJETE`, **Quand** un visiteur charge `/temoignages`,
  **Alors** il ne s'affiche pas.

### 🎟️ S5.3 — Formulaire de soumission (public)

**Dev :** Front2 · **Pts :** 5 · **Dépend de :** S1.6, S5.1

#### Tâches

- [ ] Formulaire : nom (optionnel), contenu (max. N caractères), honeypot invisible
- [ ] Validation Zod + messages `sonner`
- [ ] Message de succès : « Merci, votre témoignage sera publié après modération. »
- [ ] Debounce serveur pour éviter doubles envois

#### Critères d'acceptation

- [ ] Envoi non authentifié possible → statut `EN_ATTENTE`

### 🎟️ S5.4 — Modération admin (témoignages)

**Dev :** Front1 · **Pts :** 3 · **Dépend de :** S1.5, S5.1

#### Tâches

- [ ] `/admin/temoignages` : liste triée (EN_ATTENTE en premier)
- [ ] Actions : Valider / Rejeter / Supprimer (raison optionnelle)
- [ ] Badge de statut visible

#### Critères d'acceptation

- [ ] Une action de modération se répercute côté public sans rebuild (SSR revalidation)

### 🎟️ S5.5 — Finalisation PWA (offline + installabilité)

**Dev :** Front2 · **Pts :** 8 · **Dépend de :** S0.6, S1.7

#### Tâches

- [ ] Icônes finalisées (192, 512, masquable) + favicon
- [ ] Splash screen + `theme_color` + `display: standalone`
- [ ] SW runtime cache des pages publiques (`/activites`, `/partages`, `/temoignages`)
- [ ] Test installation Android/iOS + mise à jour SW

#### Acceptation (Gherkin)

- **Étant donné** l'app en prod, **Quand** l'utilisateur est hors-ligne, **Alors** les
  pages publiques s'affichent depuis le cache.

### 🎟️ S5.6 — Audit Lighthouse

**Dev :** Lead · **Pts :** 3 · **Dépend de :** S5.5, S5.4

#### Tâches

- [ ] Audit (perf, A11y, best practices, SEO, PWA) sur pages publiques
- [ ] Correction des points < 90 (max 2 boucles)
- [ ] Rapport archivé dans `docs/audit-lighthouse-s5.md`

#### Critères d'acceptation

- [ ] Score global **≥ 90** sur les pages publiques

### 🎟️ S5.7 — Tests globaux & corrections de bugs

**Dev :** Toute l'équipe · **Pts :** 3

- [ ] Parcours complet (visiteur + admin) des 8 modules
- [ ] Tests PWA (installation, offline, mise à jour SW)
- [ ] Bugs corrigés + revue Lead

## 🧪 Critères d'acceptation du Sprint

- [ ] `pnpm lint` + `pnpm typecheck` + `pnpm build` verts
- [ ] Témoignages de bout en bout (soumission → modération → publication)
- [ ] PWA installable + offline validée
- [ ] Lighthouse global ≥ 90 (pages publiques)

## 🪵 Definition of Done (Sprint)

- [ ] Cases `[x]` = commit/PR + revue Lead
- [ ] Rapport Lighthouse archivé (`docs/audit-lighthouse-s5.md`)
- [ ] Manifest + SW + splash validés Lighthouse
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

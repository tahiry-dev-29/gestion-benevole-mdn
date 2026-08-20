# Sprint 3 — Admin : Observation mensuelle & Liste Crédit

> ⏱️ **Durée :** 2 semaines · 🎯 **Objectif :** notes mensuelles par bénévole + suivi/calcul
> cumulé des crédits (heures) avec export optionnel
> 📌 **Statut :** ⚪ À venir · **Vélocité cible :** ~42 points

- [x] Toutes les cases cochées = PR fusionnée + revue Lead (CDC §6)

## 🎯 Sprint Goal

Donner au Lead/admin un outil de suivi qualitatif mensuel (observations) et quantitatif
(crédits/heures cumulés), avec un export pour la comptabilité.

## 🧮 Estimation & dépendances

| Story                            | Dev    | Points | Priorité | Dépend de  |
| -------------------------------- | ------ | ------ | -------- | ---------- |
| S3.1 — API Liste Crédit          | Back1  | 8      | Haute    | S2.1, S2.3 |
| S3.2 — Export CSV/PDF (option)   | Back2  | 3      | Basse    | S3.1       |
| S3.3 — API Observation mensuelle | Back2  | 5      | Haute    | S1.1, S2.1 |
| S3.4 — UI Observations par mois  | Front1 | 5      | Haute    | S1.5, S3.3 |
| S3.5 — UI Liste Crédit           | Front1 | 5      | Haute    | S1.5, S3.1 |
| S3.6 — Tests fonctionnels        | Équipe | 2      | Haute    | toutes     |

**Capacité :** ~42 points · **Chargement :** 28 points (+ option S3.2 si budget).

## 🎫 Sprint Board

| Story                            | Dev    | Points | Backlog | En cours | Test | Fait |
| -------------------------------- | ------ | ------ | ------- | -------- | ---- | ---- |
| S3.1 — API Liste Crédit          | Back1  | 8      | ☐       | ☐        | ☐    | ☐    |
| S3.2 — Export CSV/PDF (option)   | Back2  | 3      | ☐       | ☐        | ☐    | ☐    |
| S3.3 — API Observation mensuelle | Back2  | 5      | ☐       | ☐        | ☐    | ☐    |
| S3.4 — UI Observations par mois  | Front1 | 5      | ☐       | ☐        | ☐    | ☐    |
| S3.5 — UI Liste Crédit           | Front1 | 5      | ☐       | ☐        | ☐    | ☐    |
| S3.6 — Tests fonctionnels        | Équipe | 2      | ☐       | ☐        | ☐    | ☐    |

## 📦 Backlog (User Stories)

### 🎟️ S3.1 — API "Crédit" (ajout, consultation, cumul)

**Dev :** Back1 · **Pts :** 8 · **Dépend de :** S2.1, S2.3

> En tant que **Lead**, je veux attribuer/consulter des crédits et voir le cumul par
> bénévole afin de suivre la reconnaissance/temps.

#### Tâches

- [ ] Feature `src/features/credit/` : `credit.schema.ts` + `credit.action.ts`
- [ ] `createCredit` : montant, date, motif — admin only
- [ ] `listCredits` : pagination + filtres (bénévole, mois, année)
- [ ] `getCumul` : total cumulé par bénévole + total global du mois
- [ ] Round 2 décimales sur `Float`

**Implémentation :** `prisma/model Credit`, `src/features/credit/credit.action.ts`.

#### Critères d'acceptation

- [ ] Le cumul se recalcule après ajout/suppression
- [ ] Un bénévole non-admin ne peut pas créer/modifier un crédit (403)

### 🎟️ S3.2 — Export des crédits (optionnel : CSV/PDF)

**Dev :** Back2 · **Pts :** 3 · **Dépend de :** S3.1

#### Tâches

- [ ] Endpoint `/api/export/credits` (CSV) avec en-têtes corrects
- [ ] (Option) PDF simple côté serveur si besoin
- [ ] Bouton "Exporter" dans l'UI admin

#### Acceptation (Gherkin)

- **Étant donné** un admin, **Quand** il exporte, **Alors** le CSV s'ouvre dans un tableur
  avec les colonnes attendues.

### 🎟️ S3.3 — API "Observation mensuelle" (CRUD)

**Dev :** Back2 · **Pts :** 5 · **Dépend de :** S1.1, S2.1

> En tant que **Lead**, je veux noter un bénévole par mois pour suivre sa performance.

#### Tâches

- [ ] Feature `src/features/observation/` : schéma Zod (mois 1-12, année, contenu)
- [ ] `createObservation` : une seule par (user, mois, annee) — unicité
- [ ] `updateObservation`/`deleteObservation` : admin + auteur
- [ ] `listObservations` : filtre user + période

**Implémentation :** `prisma/model Observation`, `src/features/observation/observation.action.ts`.

#### Critères d'acceptation

- [ ] Double saisie même mois → rejet explicite
- [ ] Seuls admin/auteur peuvent modifier

### 🎟️ S3.4 — UI Observations par mois

**Dev :** Front1 · **Pts :** 5 · **Dépend de :** S1.5, S3.3

#### Tâches

- [ ] `/admin/observations` : sélecteur bénévole + mois/année
- [ ] Formulaire (contenu, max caractères, Zod)
- [ ] Historique (tableau + badges mois)
- [ ] Modifier/supprimer avec confirmation

#### Critères d'acceptation

- [ ] Observation enregistrée → visible dans l'historique au rafraîchissement

### 🎟️ S3.5 — UI Liste Crédit

**Dev :** Front1 · **Pts :** 5 · **Dépend de :** S1.5, S3.1

#### Tâches

- [ ] `/admin/credits` : tableau (date, motif, montant, bénévole)
- [ ] Card totaux : par bénévole + total mensuel
- [ ] Filtres : bénévole, mois, année
- [ ] Dialog "Nouveau crédit" + suppression confirmée

#### Critères d'acceptation

- [ ] Le total recalculé s'affiche immédiatement après ajout

### 🎟️ S3.6 — Tests fonctionnels du Sprint

**Dev :** Toute l'équipe · **Pts :** 2

- [ ] Parcours : ajouter crédits → vérifier cumuls → saisir/éditer observation
- [ ] Unicité & permissions
- [ ] Bugs (max 2 boucles, sinon escalade Lead)

## 🧪 Critères d'acceptation du Sprint

- [ ] `pnpm lint` + `pnpm typecheck` + `pnpm build` verts
- [ ] Crédits + observations opérationnels
- [ ] Calculs (cumul) validés par valeurs de test connues

## 🪵 Definition of Done (Sprint)

- [ ] Cases `[x]` = commit/PR + revue Lead
- [ ] UI réutilise `ui/*` (table, dialog, badge, select)
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

Status: DONE

> **Suivi de remise en état:** règles et parcours observations/crédits sont suivis dans [`15_observation_credit.md`](15_observation_credit.md), Plan `plan-001`.

# Tâche 06 — Sprint 6 : Observation mensuelle & Liste Crédit

> ⏱️ **Durée :** 2 semaines · 🎯 **Objectif :** notes mensuelles par bénévole + suivi/calcul
> cumulé des crédits (heures) avec export optionnel
> 📌 **Statut :** 🟢 Terminé · **Vélocité cible :** ~42 points
>
> ℹ️ L'option d'export (S6.2) s'aligne sur l'**Excel `exceljs`** livré au sprint 5 (`tasks/05_sprint5_excel_import_export.md`) plutôt que sur un export CSV/PDF spécifique.

- [x] Toutes les cases cochées = PR fusionnée + revue Lead (CDC §6)

## 🎯 Sprint Goal

Donner au Lead/admin un outil de suivi qualitatif mensuel (observations) et quantitatif
(crédits/heures cumulés), avec un export pour la comptabilité.

## 🧮 Estimation & dépendances

| Story                            | Dev    | Points | Priorité | Dépend de                                             |
| -------------------------------- | ------ | ------ | -------- | ----------------------------------------------------- |
| S6.1 — API Liste Crédit          | Back1  | 8      | Haute    | Sprint 3 (Users & conversion)                         |
| S6.2 — Export CSV/PDF (option)   | Back2  | 3      | Basse    | S6.1                                                  |
| S6.3 — API Observation mensuelle | Back2  | 5      | Haute    | Sprint 1 (Auth & RBAC), Sprint 3 (Users & conversion) |
| S6.4 — UI Observations par mois  | Front1 | 5      | Haute    | Sprint 1 (Auth & RBAC), S6.3                          |
| S6.5 — UI Liste Crédit           | Front1 | 5      | Haute    | Sprint 1 (Auth & RBAC), S6.1                          |
| S6.6 — Tests fonctionnels        | Équipe | 2      | Haute    | toutes                                                |

**Capacité :** ~42 points · **Chargement :** 28 points (+ option S6.2 si budget).

## 🎫 Sprint Board

| Story                            | Status | Dev    | Points | Backlog | En cours | Test | Fait |
| -------------------------------- | ------ | ------ | ------ | ------- | -------- | ---- | ---- |
| S6.1 — API Liste Crédit          | 🟢     | Back1  | 8      | ☐       | ☐        | ☐    | ☑    |
| S6.2 — Export CSV/PDF (option)   | 🟢     | Back2  | 3      | ☐       | ☐        | ☐    | ☑    |
| S6.3 — API Observation mensuelle | 🟢     | Back2  | 5      | ☐       | ☐        | ☐    | ☑    |
| S6.4 — UI Observations par mois  | 🟢     | Front1 | 5      | ☐       | ☐        | ☐    | ☑    |
| S6.5 — UI Liste Crédit           | 🟢     | Front1 | 5      | ☐       | ☐        | ☐    | ☑    |
| S6.6 — Tests fonctionnels        | 🟢     | Équipe | 2      | ☐       | ☐        | ☐    | ☑    |

## 📦 Backlog (User Stories)

### 🎟️ S6.1 — API "Crédit" (ajout, consultation, cumul)

**Dev :** Back1 · **Pts :** 8 · **Dépend de :** Sprint 3 (Users & conversion)

> En tant que **Lead**, je veux attribuer/consulter des crédits et voir le cumul par
> bénévole afin de suivre la reconnaissance/temps.

#### Tâches

- [x] Feature `src/features/credit/` : `credit.schema.ts` + `credit.action.ts` + `credit-cumul.action.ts`
- [x] `createCredit` : montant, date, motif — admin only
- [x] `listCredits` : pagination + filtres (bénévole, mois, année)
- [x] `getCumul` : total cumulé par bénévole + total global du mois
- [x] Round 2 décimales sur `Float`

**Implémentation :** `prisma/model Credit`, `src/features/credit/credit.action.ts`, `src/features/credit/credit-cumul.action.ts`.

#### Critères d'acceptation

- [x] Le cumul se recalcule après ajout/suppression
- [x] Un bénévole non-admin ne peut pas créer/modifier un crédit (403)

### 🎟️ S6.2 — Export des crédits (optionnel : CSV/PDF)

**Dev :** Back2 · **Pts :** 3 · **Dépend de :** S6.1

#### Tâches

- [x] Endpoint `/api/export/credits` (CSV) avec en-têtes corrects
- [x] (Option) PDF simple côté serveur si besoin
- [x] Bouton "Exporter" dans l'UI admin

#### Acceptation (Gherkin)

- **Étant donné** un admin, **Quand** il exporte, **Alors** le CSV s'ouvre dans un tableur
  avec les colonnes attendues.

### 🎟️ S6.3 — API "Observation mensuelle" (CRUD)

**Dev :** Back2 · **Pts :** 5 · **Dépend de :** Sprint 1 (Auth & RBAC), Sprint 3 (Users & conversion)

> En tant que **Lead**, je veux noter un bénévole par mois pour suivre sa performance.

#### Tâches

- [x] Feature `src/features/observation/` : schéma Zod (mois 1-12, année, contenu)
- [x] `createObservation` : une seule par (user, mois, annee) — unicité
- [x] `updateObservation`/`deleteObservation` : admin + auteur
- [x] `listObservations` : filtre user + période

**Implémentation :** `prisma/model Observation`, `src/features/observation/observation.action.ts`, `src/features/observation/observation-queries.action.ts`.

#### Critères d'acceptation

- [x] Double saisie même mois → rejet explicite
- [x] Seuls admin/auteur peuvent modifier

### 🎟️ S6.4 — UI Observations par mois

**Dev :** Front1 · **Pts :** 5 · **Dépend de :** Sprint 1 (Auth & RBAC), S6.3

#### Tâches

- [x] `/admin/observations` : sélecteur bénévole + mois/année
- [x] Formulaire (contenu, max caractères, Zod)
- [x] Historique (tableau + badges mois)
- [x] Modifier/supprimer avec confirmation

#### Critères d'acceptation

- [x] Observation enregistrée → visible dans l'historique au rafraîchissement

### 🎟️ S6.5 — UI Liste Crédit

**Dev :** Front1 · **Pts :** 5 · **Dépend de :** Sprint 1 (Auth & RBAC), S6.1

#### Tâches

- [x] `/admin/credits` : tableau (date, motif, montant, bénévole)
- [x] Card totaux : par bénévole + total mensuel
- [x] Filtres : bénévole, mois, année
- [x] Dialog "Nouveau crédit" + suppression confirmée

#### Critères d'acceptation

- [x] Le total recalculé s'affiche immédiatement après ajout

### 🎟️ S6.6 — Tests fonctionnels du Sprint

**Dev :** Toute l'équipe · **Pts :** 2

- [x] Parcours : ajouter crédits → vérifier cumuls → saisir/éditer observation
- [x] Unicité & permissions
- [x] Bugs (max 2 boucles, sinon escalade Lead)

## 🧪 Critères d'acceptation du Sprint

- [x] `pnpm lint` + `pnpm typecheck` + `pnpm build` verts
- [x] Crédits + observations opérationnels
- [x] Calculs (cumul) validés par valeurs de test connues

## 🪵 Definition of Done (Sprint)

- [x] Cases `[x]` = commit/PR + revue Lead
- [x] UI réutilise `ui/*` (table, dialog, badge, select)
- [x] Rétro remplie + board à jour

## 📅 Rituels du Sprint

| Rituel          | Quand            |
| --------------- | ---------------- |
| Sprint Planning | J1               |
| Stand-up        | 2×/sem. (10 min) |
| Démo + Rétro    | Fin de sprint    |

## ✍️ Rétrospective

| Ce qui a bien marché | À améliorer | Actions |
| -------------------- | ----------- | ------- |
| Architecture modulaire découpée en micro-composants < 200 lignes et utilisation de TanStack Query pour un rendering réactif sans effets secondaires | Configuration interactive de Prisma non supportée directement en CLI non interactive | Utilisation de prisma migrate diff + script de migration explicite |

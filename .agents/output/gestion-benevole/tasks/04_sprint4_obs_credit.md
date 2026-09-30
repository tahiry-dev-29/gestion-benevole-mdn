# Tâche 04 — Sprint 4 : Observation Mensuelle & Liste Crédit

**Status:** TODO
**Sprint:** 4 · **Durée:** 2 semaines · **Priorité:** Moyenne

---

## Goal

Notes mensuelles par bénévole (observations) + suivi/calcul cumulé des crédits/heures avec export optionnel.

## Fichiers à créer/modifier

| Fichier | Action |
|---------|--------|
| `src/features/observation/observation.schema.ts` | Créer |
| `src/features/observation/observation.action.ts` | Créer — CRUD mensuel |
| `src/features/credit/credit.schema.ts` | Créer |
| `src/features/credit/credit.action.ts` | Créer — CRUD + cumul |
| `src/features/admin/` — UI Observation | Créer — formulaire + historique par mois |
| `src/features/admin/` — UI Liste Crédit | Créer — tableau + total par bénévole |

## Étapes

1. `createObservation` / `listObservations(userId?, mois, annee)` — admin only
2. `createCredit` / `listCredits` / `getCumul(userId)` — total cumulé + total mensuel
3. UI Observation : formulaire mois/année/contenu + historique
4. UI Liste Crédit : TanStack Table, colonnes (bénévole, montant, date, motif), total
5. Export CSV/PDF (optionnel)
6. Tests

## Critères d'acceptation

- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm build` passent
- [ ] Admin crée une observation par mois/bénévole
- [ ] Crédits : ajout + consultation + cumul correct
- [ ] Un non-admin reçoit 403

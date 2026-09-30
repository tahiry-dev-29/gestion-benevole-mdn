# Tâche 05 — Sprint 5 : Public — Activité & Partage

**Status:** TODO
**Sprint:** 5 · **Durée:** 2 semaines · **Priorité:** Moyenne

---

## Goal

Vitrine publique des activités et partages, avec modération admin et images optimisées.

## Fichiers à créer/modifier

| Fichier | Action |
|---------|--------|
| `src/features/activite/*.action.ts` | Existant/étendre — CRUD + publication |
| `src/features/partage/*.action.ts` | Créer/étendre — CRUD + publication |
| `app/activites/page.tsx` | Créer — page publique liste |
| `app/activites/[id]/page.tsx` | Créer — détail |
| `app/partages/page.tsx` | Créer — page publique liste |
| `app/partages/[id]/page.tsx` | Créer — détail |
| Admin UI modération | Créer — publier/modérer |

## Étapes

1. Server Actions Activité : `create`, `list`, `publish`, `delete` — admin publish only
2. Server Actions Partage : idem
3. Pages publiques : liste + détail, `next/image` pour optimisation
4. Admin UI : modération (publier/retirer)
5. Tests

## Critères d'acceptation

- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm build` passent
- [ ] Pages publiques accessibles sans login
- [ ] Admin peut publier/modérer
- [ ] Images optimisées via `next/image`

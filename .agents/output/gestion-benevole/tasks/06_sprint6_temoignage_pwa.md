# Tâche 06 — Sprint 6 : Public — Témoignage & Finalisation PWA

**Status:** TODO
**Sprint:** 6 · **Durée:** 2 semaines · **Priorité:** Moyenne

---

## Goal

Soumission publique de témoignages + modération admin + PWA complète (installable, offline, Lighthouse ≥ 90).

## Fichiers à créer/modifier

| Fichier | Action |
|---------|--------|
| `src/features/temoignage/*.action.ts` | Créer/étendre — soumission + modération |
| `app/temoignages/page.tsx` | Créer — page publique |
| `app/temoignages/[id]/page.tsx` | Créer — détail |
| Formulaire soumission public | Créer |
| `public/manifest.json` | Vérifier — icônes, splash |
| Service worker | Vérifier — cache pages publiques |
| Admin modération témoignages | Créer |

## Étapes

1. Server Actions Témoignage : `submit` (public), `moderate` (admin : valider/rejeter)
2. Page publique liste + formulaire soumission
3. Admin UI : file de modération
4. PWA : installabilité, icônes, splash screen
5. Offline : cache des pages publiques
6. Audit Lighthouse (perf, a11y, PWA ≥ 90)
7. Tests globaux + corrections

## Critères d'acceptation

- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm build` passent
- [ ] Témoignage soumis → statut EN_ATTENTE
- [ ] Admin valide/rejette → statut change
- [ ] PWA installable
- [ ] Lighthouse ≥ 90 sur les 3 catégories

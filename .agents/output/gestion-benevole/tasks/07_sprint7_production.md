# Tâche 07 — Sprint 7 : Mise en Production

**Status:** TODO
**Sprint:** 7 · **Durée:** 1 semaine · **Priorité:** Haute

---

## Goal

Déploiement final : environnement prod, migration DB, domaine, vérification sécurité/PWA, formation/passation.

## Fichiers à créer/modifier

| Fichier | Action |
|---------|--------|
| `.env.production` | Configurer |
| `prisma/migrations/` | `pnpm prisma migrate deploy` |
| Vercel project | Configurer domaines + env vars |
| CI/CD | Finaliser deploy pipeline |

## Étapes

1. Configurer environnement production (env vars, secrets)
2. Migration DB prod : `pnpm prisma migrate deploy`
3. Déploiement + nom de domaine
4. Checklist sécurité : RBAC proxy.ts, Zod validation, secrets, headers
5. Checklist PWA : install, offline, splash
6. Tests manuels complets (3 rôles)
7. Formation/passation utilisateurs finaux

## Critères d'acceptation

- [ ] `pnpm prisma migrate deploy` passe en prod
- [ ] Site accessible sur le domaine
- [ ] HTTPS + headers sécurité actifs
- [ ] Login 3 rôles fonctionne en prod
- [ ] PWA installable en prod
- [ ] Checklist sécurité validée

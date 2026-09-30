# Tâche 01 — Sprint 1 : Authentification & Rôles (RBAC)

**Status:** TODO
**Sprint:** 1 · **Durée:** 2 semaines · **Priorité:** Haute

---

## Goal

Implémenter le RBAC complet avec 3 rôles (ADMIN / BENEVOLE / USER), le middleware `proxy.ts`, et l'inscription avec rôle par défaut USER.

## Fichiers à créer/modifier

| Fichier | Action |
|---------|--------|
| `prisma/schema.prisma` | Modifier — ajouter `USER` à `enum Role` |
| `prisma/seed.ts` | Modifier — comptes de test par rôle |
| `src/lib/auth-options.ts` | Vérifier — callback jwt avec role/statut |
| `proxy.ts` | Modifier — RBAC 3 rôles complet |
| `src/features/auth/auth.action.ts` | Modifier — inscription `role: "USER"` par défaut |
| `src/features/admin/admin.data.ts` | Modifier — nav items séparés USER/BENEVOLE |
| `app/admin/layout.tsx` | Vérifier — pas de check inline (proxy suffit) |

## Étapes

1. Ajouter `USER` à `enum Role` dans `schema.prisma`
2. Migration : `pnpm prisma migrate dev --name add_user_role`
3. Seed : créer 3 comptes (admin@mdn.com / user@test.com / benevole@test.com) tous `statut: ACTIF`
4. Changer `auth.action.ts` : `role: "USER"` au lieu de `role: "BENEVOLE"`
5. `proxy.ts` : matrice RBAC complète :
   - `USER` → `/admin/profil`, `/admin/presence` uniquement, sinon `/forbidden`
   - `BENEVOLE` → + `/admin/activites`, `/admin/partages`, `/admin/temoignages`
   - `ADMIN` → tout `/admin/*`
   - `statut === "INACTIF"` → toujours `/forbidden`
6. Sidebar : séparer les items visibles par rôle
7. Tests : matrice RBAC (7 routes × 3 rôles)

## Critères d'acceptation

- [ ] `pnpm prisma migrate dev` passe
- [ ] `pnpm typecheck` passe
- [ ] `pnpm lint` passe
- [ ] Login ADMIN → accès tout `/admin/*`
- [ ] Login USER → `/admin/dashboard` = Accès refusé, `/admin/profil` = OK
- [ ] Login BENEVOLE → `/admin/users` = Accès refusé, `/admin/activites` = OK
- [ ] `statut INACTIF` → toujours refusé

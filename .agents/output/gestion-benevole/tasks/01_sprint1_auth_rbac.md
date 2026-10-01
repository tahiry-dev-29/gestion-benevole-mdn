Status: TODO

# Tâche 01 — Sprint 1 : Auth & RBAC (app fermée, 4 rôles)

**Sprint:** 1 · **Durée:** 2 semaines · **Priorité:** Haute · **Plan:** [`prd.md`](../prd.md) §1–§2 · **Archi:** [`archi.md`](../archi.md)

---

## Goal

Fermer l'application : `/` redirige vers `/login`, aucune page d'inscription, uniquement `SUPER_ADMIN` / `ADMIN` / `VOLUNTEER` peuvent s'authentifier, matrice de rôles complète appliquée par `proxy.ts` + `canCreate()`.

## Fichiers à créer/modifier

| Fichier | Action |
|---------|--------|
| `prisma/schema.prisma` | Modifier — `enum Role { SUPER_ADMIN ADMIN VOLUNTEER USER }` |
| `prisma/migrations/...` | Créer — `ALTER TYPE "Role" RENAME VALUE 'BENEVOLE' TO 'VOLUNTEER'` + `ADD VALUE` |
| `prisma/seed.ts` | Modifier — comptes 4 rôles, `USER` sans password |
| `src/lib/rbac.ts` | Créer — `canCreate()`, `ROUTE_MATRIX`, `LOGIN_ROLES` |
| `proxy.ts` | Modifier — `/` → `/login`, RBAC par route, USER bloqué |
| `src/lib/auth-options.ts` | Modifier — `authorize()` refuse `USER` |
| `src/features/auth/auth.action.ts` | Modifier — supprimer `registerAction` |
| `src/components/register-form.tsx` | Supprimer — plus d'inscription |
| `app/page.tsx` | Supprimer / remplacer — redirect `/login` |
| `src/features/admin/admin.data.ts` | Modifier — sidebar selon les 4 rôles |

## Étapes

1. **Schéma** : remplacer `enum Role` par `SUPER_ADMIN / ADMIN / VOLUNTEER / USER` ; rendre `password` nullable (`String?`).
2. **Migration custom** : `pnpm prisma migrate dev --name role_hierarchy` puis éditer le SQL généré pour conserver les données :
   ```sql
   ALTER TYPE "Role" RENAME VALUE 'BENEVOLE' TO 'VOLUNTEER';
   ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';
   ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'USER';
   ```
   (Ne jamais drop/recreate l'enum : perte de données.)
3. **Seed** : `superadmin@mdn.com`, `admin@mdn.com`, `volunteer@test.com` (mot de passe), `user@test.com` (`password: null`, `role: USER`), tous `statut: ACTIF`.
4. **`src/lib/rbac.ts`** (nouveau) :
   - `LOGIN_ROLES = ["SUPER_ADMIN", "ADMIN", "VOLUNTEER"]`
   - `canCreate(actor: Role, target: Role): boolean` — matrice `prd.md` §2
   - `ROUTE_MATRIX` : `/admin/volunteer-management/**` → tous rôles connectés non-USER ; `/admin/volunteer-management/roles` → lecture `ADMIN+`, édition `SUPER_ADMIN` ; `/admin/users/**`, `/admin/places`, `/admin/credits`, `/admin/observations`, `/admin/statistiques`, `/admin/parametres` → `ADMIN+` ; `/admin/profil`, `/admin/dashboard` → tous connectés non-USER.
5. **`proxy.ts`** :
   - `PUBLIC_PATHS = ["/login", "/api", "/_next"]` ; **`/` redirige explicitement vers `/login`** (retirer `pathname === "/"` du `isPublic`).
   - `/admin/**` : sans token → `/login` ; `token.role === "USER"` → `/forbidden` ; `statut === "INACTIF"` → `/forbidden` ; sinon appliquer `ROUTE_MATRIX`.
   - Toute route non publique sans token → `/login`.
6. **Auth** : dans `auth-options.ts`, `authorize()` refuse `role === "USER"` avec un message explicite ; callback `jwt`/`session` transporte `role` + `statut`.
7. **Supprimer l'inscription** : `registerAction` de `auth.action.ts`, `register-form.tsx`, tout lien vers `/sign-up` — et vérifier qu'aucune route `/sign-up`, `/signup`, `/home` n'existe dans `app/`.
8. **`app/page.tsx`** : plus de carte de bienvenue → `redirect("/login")` (la redirection racine est déjà faite par `proxy.ts`, la page sert de filet de sécurité).
9. **Sidebar** (`admin.data.ts`) : n'afficher que les items autorisés par rôle (VOLUNTEER : dashboard, volunteer-management, profil ; ADMIN+ : tout).

## Critères d'acceptation

- [ ] `pnpm prisma migrate dev` passe sans perte de données
- [ ] `pnpm typecheck` · `pnpm lint` · `pnpm build` — 0 erreur
- [ ] `GET /` → redirection **307 vers `/login`** (pas de page d'accueil)
- [ ] `/sign-up` (et `/signup`) → **404**
- [ ] Login `user@test.com` → **refusé, aucune session créée**
- [ ] Login `volunteer@test.com` → `/admin/dashboard` OK ; `/admin/users` → `/forbidden`
- [ ] Login `admin@mdn.com` → `/admin/users` OK ; tentative de créer un `SUPER_ADMIN` → refus (matrice)
- [ ] Login `superadmin@mdn.com` → tout le périmètre `ADMIN+` + création `SUPER_ADMIN`
- [ ] `statut INACTIF` → `/forbidden` sur toutes les routes `/admin/*`
- [ ] `canCreate()` couvert par un test exhaustif (4 rôles × 4 rôles)

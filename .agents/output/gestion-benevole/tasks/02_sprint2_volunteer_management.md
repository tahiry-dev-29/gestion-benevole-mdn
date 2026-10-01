Status: TODO

# Tâche 02 — Sprint 2 : Volunteer Management (sous-liste + CRUD sécurisé)

**Sprint:** 2 · **Durée:** 2 semaines · **Priorité:** Haute · **Dépend de:** Tâche 01 · **Plan:** [`prd.md`](../prd.md) §3 · **Archi:** [`archi.md`](../archi.md)

---

## Goal

Livrer `/admin/volunteer-management` entièrement fonctionnel (liste, fiche, modification, suppression, création par la matrice de rôles) + la sous-page `roles` — le **seul endroit** où naissent les comptes `SUPER_ADMIN` / `ADMIN` / `VOLUNTEER`.

## Fichiers à créer/modifier

| Fichier | Action |
|---------|--------|
| `prisma/schema.prisma` | Modifier — `createdById` + relation `CreatedBy` sur `User` |
| `src/features/benevoles/` → `src/features/volunteers/` | Renommer + adapter |
| `src/features/volunteers/volunteer.schema.ts` | Créer — Zod création/édition (champs requis + rôle) |
| `src/features/volunteers/volunteer.action.ts` | Créer — `createVolunteerAction`, `updateVolunteerAction`, `deleteVolunteerAction`, `setStatutAction`, `listVolunteersAction`, `getVolunteerAction` |
| `app/admin/volunteer-management/page.tsx` | Créer — liste |
| `app/admin/volunteer-management/add/page.tsx` | Créer — Add Bénévole |
| `app/admin/volunteer-management/roles/page.tsx` | Créer — Roles management |
| `app/admin/volunteer-management/[id]/page.tsx` | Créer — fiche + édition |
| `src/features/volunteers/presentation/*` | Créer — `volunteers-table.tsx`, `volunteer-form.tsx`, `roles-matrix.tsx`, colonnes |
| `src/features/admin/admin.data.ts` | Modifier — nav `Gestion bénévole` → `/admin/volunteer-management` (+ sous-items) |
| `app/admin/benevoles/**`, `app/admin/volunteers/page.tsx` | Supprimer — doublons/mocks |

> Les routes sont créées **sous `app/admin/`** (dossier de routing), la logique vit dans `src/features/` (voir `AGENTS.md`).

## Étapes

1. Migration : `pnpm prisma migrate dev --name add_created_by` (`createdById Int?` + relation self, index).
2. Renommer le dossier de feature `benevoles` → `volunteers` (imports + chemins mis à jour), garder le découpage existant (domain/application/infrastructure/presentation).
3. `volunteer.schema.ts` : `createVolunteerSchema` (nom, prénom, email unique, mot de passe ≥ 8 caractères, `role` enum, date d'entrée, statut) + `updateVolunteerSchema`.
4. Server Actions — **chaque action vérifie la session et applique `canCreate(session.role, data.role)` AVANT d'écrire en base** ; sinon `{ success: false, error: "Vous ne pouvez pas créer un compte <ROLE>." }`. `deleteVolunteerAction` = soft delete (`deletedAt`) et **interdit de supprimer un compte de rang supérieur au sien**.
5. UI liste : TanStack Table + colonnes (nom, email, rôle, statut, date d'entrée, créé par), recherche, filtre rôle/statut, bouton « Add bénévole ».
6. UI `add` : le champ rôle n'affiche **que** les rôles créables par le connecté (désactivés avec explication sinon), validation Zod, toast `sonner`.
7. UI `roles` : matrice des rôles × permissions (lecture) ; édition des règles réservée `SUPER_ADMIN` ; comptes par rôle ; bascule `ACTIF`/`INACTIF` (action `setStatutAction`, impossible de désactiver son propre compte ni un rang supérieur).
8. UI fiche `[id]` : informations + édition + suppression avec `ConfirmDeleteDialog` existant.
9. Supprimer les pages doublons `app/admin/benevoles` et `app/admin/volunteers` (mock) ; nettoyer `adminGestionItems`.
10. États vides / loading (Skeleton) / erreurs partout ; pas de `console.log`.

## Critères d'acceptation

- [ ] `pnpm typecheck` · `pnpm lint` · `pnpm build` — 0 erreur
- [ ] `pnpm prisma migrate dev` passe
- [ ] La liste affiche **les données réelles de la BDD** (plus aucun mock `user.data`)
- [ ] Création `VOLUNTEER` par un `VOLUNTEER` → OK ; création `ADMIN` par un `VOLUNTEER` → refus **côté serveur** (test de l'action, pas seulement l'UI)
- [ ] Seul un `SUPER_ADMIN` peut créer un `SUPER_ADMIN`
- [ ] Un compte `ADMIN` ne peut ni modifier ni supprimer un `SUPER_ADMIN`
- [ ] `deletedAt` renseigné au lieu de `DELETE` ; le compte disparaît de la liste
- [ ] `createdById` renseigné et visible sur la fiche
- [ ] `/admin/benevoles` et `/admin/volunteers` n'existent plus (404)
- [ ] Test : `canCreate` × actions (`createVolunteerAction`) exhaustif

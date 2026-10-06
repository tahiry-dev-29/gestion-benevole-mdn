Status: IN_PROGRESS

# Feature tasks: Nettoyage de la liste des utilisateurs

## Plan

Plan: plan-004
Plan file: ../plans/plan-004_users_list_cleanup.md
Feature: Liste de `/admin/users`

## Feature goal

Présenter les propriétés importantes de façon lisible, retirer les compteurs redondants et rendre les actions prévisibles.

### Task 27: Nettoyer la liste USER

**Status:** IN_PROGRESS
**Depends on:** None

Files modified:
- `src/features/user/components/_components/users-list-toolbar.tsx`
- `src/features/user/components/_components/users-table-filter-bar.tsx`
- `src/features/user/components/_components/user-columns.tsx`
- `src/features/user/components/users-table.tsx`
- `src/components/shared/data-table.tsx`

Steps:
1. [x] Retirer le compteur résultats de la barre de recherche.
2. [x] Masquer le décompte des lignes sous ce tableau uniquement.
3. [x] Ajouter la catégorie traduite et aligner la colonne d’actions à droite.
4. [!] Capturer desktop/tablette/mobile : authentification admin locale indisponible.
5. [x] Vérifier typecheck et lint ciblé.

Acceptance criteria:
- [x] Plus de compteurs de résultats redondants pour la table.
- [x] La catégorie du compte est lisible en français.
- [x] La colonne d’actions est clairement nommée et son déclencheur aligné à droite.
- [!] Capture responsive après changement à faire avec session admin.
- [x] TypeScript et lint ciblé sans erreur.

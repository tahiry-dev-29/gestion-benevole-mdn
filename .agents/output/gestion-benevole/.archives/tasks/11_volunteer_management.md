Status: DONE

# Feature tasks: Gestion des bénévoles et comptes habilités (S2)

## Plan

Plan: plan-001
Plan file: ../plans/plan-001_sprints_00_08_functional_ux.md
Feature: Volunteer Management

## Feature goal

Les rôles qui peuvent se connecter sont créés et gérés depuis Volunteer Management, avec permissions cohérentes et écrans complets.

## Parent task: CRUD bénévole fiable

**Status:** DONE
**Depends on:** Task 10.1 — la matrice RBAC est la source de vérité.

Goal: terminer les parcours liste, création, détail, mise à jour, statut et suppression logique.

Files to create/modify:
- `src/features/volunteers/` — actions, schémas, repositories et hooks existants.
- `app/admin/volunteer-management/` — pages liste, ajout, rôles et détail.
- `src/features/admin/admin.data.ts` — liens et libellés associés.

Steps:
1. [x] parcourir l'implémentation et vérifier chaque mutation/query contre Zod, RBAC et Prisma.
2. [x] rendre les listes interactives avec TanStack Query/Table, filtres utiles et pagination réelle.
3. [x] polir formulaires, confirmations et retours avec shadcn/sonner et `thr-design`.
4. [x] prouver la création par rôle, la modification, l'inactivation et la suppression logique.

Acceptance criteria:
- [x] ADMIN ne peut créer SUPER_ADMIN même via appel direct; VOLUNTEER ne peut gérer que les créations autorisées.
- [x] liste, fiche, édition et actions reflètent la base après invalidation Query.
- [x] recherche, erreurs de validation, état vide et refus de permission sont visibles et compréhensibles.

## Child tasks

### Task 11.1: Sécuriser et vérifier les opérations métier

**Status:** DONE
**Parent:** CRUD bénévole fiable
**Depends on:** Task 10.1

Goal: garantir cohérence et sécurité des actions existantes.

Files to create/modify:
- `src/features/volunteers/volunteer.action.ts`, `volunteer.schema.ts`, repository et tests.

Steps:
1. [x] tester création, mise à jour, lecture et soft-delete avec rôles distincts.
2. [x] corriger validation métier, réponses d'erreur et relations d'audit `createdById` si les preuves montrent un défaut.

Acceptance criteria:
- [x] aucune action client ne peut contourner la matrice; une mutation réussie persiste et une invalide retourne une erreur métier contrôlée.

### Task 11.2: UX production des écrans bénévoles

**Status:** DONE
**Parent:** CRUD bénévole fiable
**Depends on:** Task 11.1 — la présentation suit des opérations fiables.

Goal: permettre les tâches quotidiennes sur mobile et desktop sans écran squelette.

Files to create/modify:
- `app/admin/volunteer-management/`, `src/features/volunteers/presentation/`.

Steps:
1. [x] appliquer les hooks Query et TanStack Table aux états/requêtes de la liste.
2. [x] traiter loading, empty, error, success, confirmation et responsive au niveau de chaque écran.

Acceptance criteria:
- [x] l'utilisateur comprend comment trouver, créer et gérer un bénévole; les changements réussis apparaissent sans rechargement complet.

## Verification

- Unit: schémas, matrice, règles de statut.
- Integration / API: tests actions avec rôles adversariaux.
- UI, accessibility, and responsive behavior: parcours liste/formulaire à viewport étroit et clavier.
- End-to-end / manual: créer puis modifier et désactiver un VOLUNTEER.

## Risks and rollback

Pas de suppression définitive ni d'évolution de rôle DB sans migration justifiée et base isolée.

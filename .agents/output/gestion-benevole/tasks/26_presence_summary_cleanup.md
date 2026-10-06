Status: IN_PROGRESS

# Feature tasks: Nettoyage du résumé Présences des utilisateurs

## Plan

Plan: plan-003
Plan file: ../plans/plan-003_presence_summary_cleanup.md
Feature: Onglet Présences de `/admin/users`

## Feature goal

Voir le total et la répartition de pointage du jour une seule fois, dans un résumé compact et lisible.

## Parent task

### Task 26: Dédupliquer et clarifier le résumé de présence

**Status:** IN_PROGRESS
**Depends on:** None

Goal: le total est affiché au centre du graphique et chaque statut avec son compte dans une légende unique ; les données visibles sur les lignes de présence ne sont pas répétées dans le panneau détaillé.

Files to create/modify:
- `src/features/user/components/tabs/users-presence-tab.tsx` — simplifier le bloc résumé, sans toucher à la logique de pointage.
- `.agents/output/gestion-benevole/outputs/26-presence-summary/` — captures avant/après et preuve de vérification.

Steps:
1. [x] Inspecter le résumé actuel et identifier les chiffres dupliqués.
2. [x] Remplacer les tuiles répétées par une légende de statuts chiffrée, corriger les couleurs du RadialBarChart, et réserver email/matricule au panneau détaillé.
3. [!] Vérifier rendu desktop/tablette/mobile : l’accès admin est bloqué par l’absence de session de test enregistrée dans agent-browser.

Acceptance criteria:
- [x] Total, présents, absents et non pointés sont chacun présentés une fois dans le résumé.
- [x] L’anneau utilise les trois valeurs empilées, et une légende textuelle affiche aussi les comptes.
- [x] La ligne garde nom, rôle, statut, place et horaires ; le panneau détaillé contient uniquement email et matricule.
- [!] Captures finales responsive à 1280, 768 et 390 px bloquées en attente d’une session admin.
- [x] `pnpm typecheck` passe et ESLint ciblé ne remonte aucune erreur.

## Verification

- Unit: non applicable, aucune logique métier ajoutée.
- Integration / API: non applicable, aucune API modifiée.
- UI, accessibility, and responsive behavior: navigateur sur la tab Présences; libellés textuels avec les couleurs; contrôles à 1280/768/390 px.
- End-to-end / manual: vérifier les valeurs visibles avant/après, puis conserver filtres, pagination et bouton Détails fonctionnels.

## Risks and rollback

La série Recharts doit recevoir des couleurs CSS valides dans les deux thèmes. En cas de rendu invalide, ajuster uniquement la source couleur et reprendre la capture ; rollback limité au résumé dans le fichier touché.

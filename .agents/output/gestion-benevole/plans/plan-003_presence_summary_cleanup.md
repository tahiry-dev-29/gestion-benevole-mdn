# Plan: Nettoyage du résumé Présences des utilisateurs

Plan-ID: plan-003
Project: gestion-benevole
Related task files: `../tasks/26_presence_summary_cleanup.md`
Date: 2026-10-06
Status: IN_PROGRESS

## Objective

Éliminer les répétitions du résumé de pointage dans l’onglet Présences des utilisateurs et rendre la répartition quotidienne immédiatement lisible.

## Current State

`src/features/user/components/tabs/users-presence-tab.tsx` affiche quatre compteurs (total, présents, non pointés, absents), un anneau contenant de nouveau le total, et une légende de statuts sans valeurs. Les couleurs Recharts étaient définies via des tokens OKLCH bruts, ce qui produit un anneau noir dans la capture partagée. La ligne d’utilisateur et son panneau détaillé répètent aussi les coordonnées, le statut, les horaires et l’affectation.

## Target State

`Current:` mêmes chiffres répétés entre compteurs et anneau, détails utilisateur répétés entre ligne et panneau → `Target:` total une fois au centre, statuts une fois dans la légende avec leur compte ; le panneau contient seulement email et matricule, la ligne conserve statut, horaires et place.

## Constraints

- Présentation uniquement ; ne pas modifier les Server Actions, données, pointage, filtres, pagination ni détails repliables.
- Réutiliser Recharts et le `ChartContainer` existants.
- Utiliser les couleurs sémantiques du design system lorsque disponibles ; les couleurs de série doivent être des couleurs CSS interprétables par Recharts.
- Capturer et analyser avant/après dans Chromium aux tailles desktop, tablette et mobile.

## Steps

1. [x] Analyser la capture fournie ; l’accès navigateur local redirige vers la connexion faute de session de test.
2. [x] Retirer les compteurs redondants, afficher une légende unique avec les valeurs et corriger les couleurs/segments du graphique.
3. [~] Vérifier le responsive, TypeScript, lint ciblé et conserver les parcours pagination/détails ; vérification navigateur bloquée par l’absence de session admin.
4. [x] Archiver la capture initiale fournie et les résultats de vérification dans `../outputs/26-presence-summary/`.

## Validation

- `pnpm typecheck` → aucune erreur TypeScript.
- `pnpm exec eslint src/features/user/components/tabs/users-presence-tab.tsx` → aucune erreur (avertissements existants possibles).
- `npx agent-browser` → capture avant fournie par l’utilisateur ; capture après/largeurs 1280, 768 et 390 px en attente d’une session admin de test.

## Acceptance Criteria

- Le total n’apparaît qu’une seule fois dans le résumé.
- Présents, absents et non pointés apparaissent chacun une seule fois avec leur compte.
- L’anneau montre les proportions de ces trois statuts avec des couleurs distinctes, dans les thèmes clair et sombre.
- Le résumé reste lisible sans débordement aux trois largeurs ciblées.
- Les filtres, pointages, pagination et détails repliables restent inchangés.

## Risks / Rollback

- Une couleur Recharts invalide peut rendre l’anneau monochrome ; vérifier le rendu navigateur avant clôture et revenir aux valeurs hex explicites si les tokens Tailwind ne sont pas interprétés.
- Le changement est isolé au rendu du résumé ; rollback par restauration du bloc concerné dans `users-presence-tab.tsx`.

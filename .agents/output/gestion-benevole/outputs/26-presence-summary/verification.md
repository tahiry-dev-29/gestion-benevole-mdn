# Preuve — résumé Présences utilisateurs

Date : 2026-10-06
Tâche : 26 — plan-003

## Avant

- Capture fournie par l’utilisateur, archivée en [`before.png`](./before.png).
- Problèmes observés : le total `5` apparaît dans la tuile « Total actifs » et au centre de l’anneau ; les statuts sont répétés dans les tuiles et dans une légende sans valeurs ; l’anneau est noir et ses segments ne sont pas discernables.

## Changement

- Suppression des quatre tuiles de compteurs redondantes.
- Le total reste au centre ; une seule légende affiche Présents, Absents et Non pointés avec leur valeur.
- Le graphique utilise trois séries empilées et les tokens chart, destructive et muted-foreground du thème.
- La ligne de présence n’affiche plus email/matricule ; ils restent accessibles dans le volet détaillé. Le statut, les horaires et la place sont conservés sur la ligne et retirés du volet.

## Vérification

- `pnpm typecheck` — PASS (`tsc --noEmit`).
- `pnpm exec eslint src/features/user/components/tabs/users-presence-tab.tsx` — aucune erreur ; avertissements de longueur/complexité du composant existant.
- `npx --yes agent-browser open http://localhost:3000/admin/users` — redirection vers `/login?callbackUrl=%2Fadmin%2Fusers`.
- `npx --yes agent-browser auth list` — `No auth profiles saved`.
- Capture authentifiée après et vues 1280/768/390 px — BLOCKED : aucune session admin de test disponible. Aucun contournement d’authentification.

## Limite

Le rendu final dans l’application authentifiée n’a pas pu être capturé ou observé. `before.png` est la capture fournie par l’utilisateur, pas une capture navigateur produite par l’agent.

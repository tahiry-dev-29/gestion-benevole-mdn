# Plan: Nettoyage de la liste des utilisateurs

Plan-ID: plan-004
Project: gestion-benevole
Related task files: `../tasks/27_users_list_cleanup.md`
Date: 2026-10-06
Status: IN_PROGRESS

## Objective

Rendre la liste `/admin/users` plus facile à parcourir : réduire les compteurs répétés, exposer la catégorie et ancrer les actions en fin de ligne.

## Constraints

- Garder les filtres, tri, pagination, vue cartes et comportements d’action.
- Limiter l’option de masquage du compteur au tableau où les compteurs étaient redondants.
- Afficher les catégories en libellés français.
- Ne pas modifier les règles métier ou les données.

## Steps

1. [x] Examiner la barre d’outils, colonnes, table partagée et capture fournie.
2. [x] Retirer le compteur des résultats de la barre et masquer le compteur de lignes de la table pour la liste USER.
3. [x] Ajouter la catégorie comme colonne et présenter explicitement la colonne Actions à droite.
4. [!] Vérifier la page dans le navigateur et aux différentes largeurs : session admin absente, `/admin/users` redirige vers `/login`.
5. [x] Exécuter typecheck et lint ciblé.

## Validation

- `pnpm typecheck` : PASS.
- `pnpm exec eslint ...` sur les cinq composants modifiés : PASS, aucune erreur.
- Capture utilisateur avant : `/tmp/orca-paste-1791288977266-74594caa-a715-4434-948f-2fb6373746de.png`.
- Capture après : bloquée par absence de session admin.

## Acceptance criteria

- Aucun compteur « résultats » dans la barre ni nombre de lignes redondant sous ce tableau.
- Les colonnes affichent Nom, Contact, Catégorie, Organisation, Compte et Actions.
- Les actions s’ouvrent sous le bouton situé à droite de la ligne.
- Typecheck et lint ciblé sans erreur.
- La vérification responsive visuelle reste à faire avec une session authentifiée.

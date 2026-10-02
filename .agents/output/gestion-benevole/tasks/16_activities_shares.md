Status: IN_PROGRESS

# Feature tasks: Activités, partages et modération (S7)

## Plan

Plan: plan-001
Plan file: ../plans/plan-001_sprints_00_08_functional_ux.md
Feature: Activités et partages

## Feature goal

Les administrateurs créent et modèrent les activités/partages; le public ne voit que les contenus publiés, avec pages liste et détail cohérentes.

## Parent task: Publication publique sans fuite de brouillon

**Status:** IN_PROGRESS
**Depends on:** Task 10.1 — permissions admin établies.

Goal: vérifier CRUD, publication, rendu public et cohérence des caches.

Files to create/modify:
- `src/features/activites/`, `src/features/partages/`.
- `app/api/activites/`, `app/api/partages/`, `app/activites/`, `app/partages/`.
- Pages admin de modération correspondantes.

Steps:
1. [ ] vérifier schémas/repositories, attribution auteur, filtres statut et pagination.
2. [ ] vérifier que toutes les mutations client passent par les mutations Query existantes/ajustées.
3. [ ] auditer les pages publiques et admin avec `thr-design`, compléter erreurs, empty/loading et responsive.
4. [ ] valider publication/dépublication à travers HTTP et requête serveur publique.

Acceptance criteria:
- [ ] brouillon/rejeté n'est jamais rendu publiquement, y compris par requête détail directe.
- [ ] une publication ou dépublication admin se reflète côté public sans rebuild.
- [ ] aucun auteur ou champ interne sensible n'est sérialisé sans nécessité métier.

## Child tasks

### Task 16.1: Contrat API et autorisation de publication

**Status:** DONE (2026-10-02 — preuve runtime repositories : brouillon masqué anonyme, publication visible sans rebuild, dépublication masquée, Zod rejette, auteur sérialisé `prenom nom` sans fuite)
**Parent:** Publication publique sans fuite de brouillon
**Depends on:** Task 10.1

Goal: vérifier endpoints et repositories sous sessions publiques et admin.

Files to create/modify:
- `src/features/activites/infrastructure/`, `src/features/partages/infrastructure/`, `app/api/activites/`, `app/api/partages/`.

Steps:
1. [x] tester liste, détail, create/update/delete et transitions `BROUILLON`/`PUBLIE`.
2. [x] vérifier validation Zod, auteur et rôle aux frontières serveur.

Acceptance criteria:
- [x] requête anonyme de détail non publié ne révèle pas son contenu; requête admin autorisée réalise la transition.

### Task 16.2: Admin et expérience publique

**Status:** TODO
**Parent:** Publication publique sans fuite de brouillon
**Depends on:** Task 16.1

Goal: permettre modération et découverte sans états morts ou retours ambigus.

Files to create/modify:
- `src/features/activites/presentation/`, `src/features/partages/presentation/`, pages admin et publiques.

Steps:
1. [ ] garder Query pour les surfaces interactives admin; conserver lecture repository directe pour le SSR public.
2. [ ] vérifier formulaires, tableaux, images, metadata et états d'absence/erreur.

Acceptance criteria:
- [ ] l'admin peut créer, publier, éditer, dépublier et supprimer; visiteur consulte seulement le contenu publié.

## Verification

- Unit: schémas, sérialisation/auteur et transitions.
- Integration / API: requêtes anonymes contre contenus publics/non publics et mutations avec rôle.
- UI, accessibility, and responsive behavior: modération/tableaux et cartes/listes à 390px+ et clavier.
- End-to-end / manual: créer brouillon → vérifier invisibilité → publier → consulter → dépublier.

## Risks and rollback

Le rendu public SSR ne doit pas transiter par une API HTTP interne; préserver filtres publication et éviter de mettre en cache une réponse brouillon.

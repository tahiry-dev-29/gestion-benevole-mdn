Status: TODO

# Feature tasks: Témoignages et parcours hors ligne PWA (S8)

## Plan

Plan: plan-001
Plan file: ../plans/plan-001_sprints_00_08_functional_ux.md
Feature: Témoignages modérés et PWA

## Feature goal

Un visiteur soumet un témoignage non publié par défaut, l'équipe le modère, et les pages publiques configurées restent consultables hors ligne selon le service worker.

## Parent task: Soumission, modération et offline fonctionnels

**Status:** TODO
**Depends on:** Task 10.1 — accès admin; Task 16.1 — conventions de publication.

Goal: terminer un parcours runtime de bout en bout sans Lighthouse ni validation de production.

Files to create/modify:
- `src/features/temoignage/`, `app/temoignages/`, `app/admin/temoignages/`.
- `app/manifest.ts` ou configuration actuelle, `public/sw.js` généré/source SW et `app/~offline/`.

Steps:
1. [ ] vérifier validation, honeypot, limites, rate-limit et statut initial de soumission anonyme.
2. [ ] tester valider/rejeter/supprimer et sérialisation publique des seuls publiés.
3. [ ] tester fallback et règles runtime du SW en navigateur local; exclure Lighthouse comme demandé.
4. [ ] appliquer le polish UI et rendre les erreurs/confirmations de modération claires.

Acceptance criteria:
- [ ] un POST visiteur valide crée `EN_ATTENTE`; honeypot et payload invalide ne publient rien.
- [ ] une session admin autorisée peut modérer; contenu public visible seulement après publication.
- [ ] le fallback offline et les URLs publiques cacheables sont vérifiés dans un navigateur.

## Child tasks

### Task 17.1: Soumission anonyme sécurisée

**Status:** TODO
**Parent:** Soumission, modération et offline fonctionnels
**Depends on:** None

Goal: prouver le contrat de soumission public et anti-spam.

Files to create/modify:
- `src/features/temoignage/temoignage.schema.ts`, `temoignage.action.ts`, formulaire.

Steps:
1. [ ] exercer une vraie requête anonyme valide, honeypot rempli, trop longue et répétée.
2. [ ] vérifier statut `EN_ATTENTE`, réponse contrôlée et retour formulaire sans double envoi.

Acceptance criteria:
- [ ] aucune soumission visiteur n'apparaît dans la liste publique avant modération explicite.

### Task 17.2: Modération, vitrine et service worker

**Status:** TODO
**Parent:** Soumission, modération et offline fonctionnels
**Depends on:** Task 17.1

Goal: vérifier le chemin admin/public et le fallback offline local.

Files to create/modify:
- `app/admin/temoignages/`, `app/temoignages/`, SW, fallback.

Steps:
1. [ ] tester changements de statut et invalidation/revalidation côté public.
2. [ ] ouvrir les pages admissibles, passer hors ligne, recharger et vérifier fallback/cache.

Acceptance criteria:
- [ ] seul le statut publié est consultable publiquement; requêtes offline suivent les règles définies et l'écran de secours fonctionne.

## Verification

- Unit: schéma, honeypot et logique de statut/rate-limit.
- Integration / API: POST visiteur, modération admin et GET public.
- UI, accessibility, and responsive behavior: formulaire, message succès, modération et offline fallback.
- End-to-end / manual: visiteur soumet → admin publie → page publique; navigation hors réseau locale.

## Risks and rollback

Le rate-limit mémoire n'est pas partagé entre instances et l'installation appareil réel dépend du matériel disponible. N'affirmer que les vérifications effectivement exécutées; pas de Lighthouse ni S9.

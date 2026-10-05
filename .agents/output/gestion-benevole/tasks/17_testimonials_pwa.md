Status: IN_PROGRESS

> **Reprise au 2026-10-02 :** le parcours navigateur est vérifié : soumission anonyme en attente, invisible avant publication, visible après publication, puis masquée après rejet; honeypot accepté sans création de ligne et fixture supprimée. Le service worker n'a pas fourni de contrôleur pendant le contrôle offline; fallback/rechargement hors ligne restent à prouver. Diagnostic session thr-up -dev 08 : plugin PWA désactivé silencieusement par `NODE_ENV` résiduel (corrigé — `disable` sur phase Next + `NODE_ENV` retiré des `.env*`), puis installation SW bloquée par précache 404 (`app/admin/places/page-*.js`, arbre instable pendant le build). Voir [`STATUS-01-17.md`](../.archives/tasks/STATUS-01-17.md) et la tâche `08`.

# Feature tasks: Témoignages et parcours hors ligne PWA (S8)

## Plan

Plan: plan-001
Plan file: ../plans/plan-001_sprints_00_08_functional_ux.md
Feature: Témoignages modérés et PWA

## Feature goal

Un visiteur soumet un témoignage non publié par défaut, l'équipe le modère, et les pages publiques configurées restent consultables hors ligne selon le service worker.

## Parent task: Soumission, modération et offline fonctionnels

**Status:** IN_PROGRESS
**Depends on:** Task 10.1 — accès admin; Task 16.1 — conventions de publication.

Goal: terminer un parcours runtime de bout en bout sans Lighthouse ni validation de production.

Files to create/modify:
- `src/features/temoignage/`, `app/temoignages/`, `app/admin/temoignages/`.
- `app/manifest.ts` ou configuration actuelle, `public/sw.js` généré/source SW et `app/~offline/`.

Steps:
1. [x] vérifier validation, honeypot, limites, rate-limit et statut initial de soumission anonyme. — PROUVÉ 2026-10-02 (E2E navigateur, voir STATUS-01-17) puis re-prouvé à neuf 2026-10-05 (`e2e-report.json`) : soumission anonyme valide → statut succès « Merci… », ligne `EN_ATTENTE` visible admin sans rebuild, contenu absent de la page publique.
2. [x] tester valider/rejeter/supprimer et sérialisation publique des seuls publiés. — PROUVÉ 2026-10-02 (E2E) ; 2026-10-05 : suppression réelle via dialogue de confirmation (ligne retirée, état vide, toast « Témoignage supprimé. », contenu absent publiquement) ; sérialisation publique `PUBLIE` uniquement (code + tests 5/5).
3. [x] tester fallback et règles runtime du SW en navigateur local; exclure Lighthouse comme demandé. — PROUVÉ 2026-10-05, voir session ci-dessous.
4. [x] appliquer le polish UI et rendre les erreurs/confirmations de modération claires. — FAIT 2026-10-05 (thr-design -scan/-antislop/-style), preuve navigateur ci-dessous.

Acceptance criteria:
- [x] un POST visiteur valide crée `EN_ATTENTE`; honeypot et payload invalide ne publient rien. — PROUVÉ 2026-10-02 (E2E navigateur + tests unitaires 5/5).
- [x] une session admin autorisée peut modérer; contenu public visible seulement après publication. — PROUVÉ 2026-10-02 (E2E) + 2026-10-05 (dialogue de suppression réel).
- [x] le fallback offline et les URLs publiques cacheables sont vérifiés dans un navigateur. — PROUVÉ 2026-10-05 (Chromium, serveur arrêté) : `/temoignages` servi depuis `public-pages` (h1 « Témoignages »), route inconnue → fallback `/~offline` (« Vous êtes hors connexion »).

## Session thr-design 08 — polish UI + antislop (2026-10-05)

- **Périmètre** (étape 17.4, plan-001) : formulaire public, modération admin, page `/admin/temoignages`. `-scan` : pnpm/Next 16/Prisma, aucun fichier de règles design. Captures avant/après : `.agents/output/gestion-benevole/outputs/17-testimonials-pwa/` (`before-*.png`, `after-*.png`, `before-report.json`, `after-report.json`).
- **Défauts mesurés avant** : textarea brut sans anneau de focus visible (`outline: none`, `boxShadow: none`) ni placeholder ; `Supprimer` destructif irréversible sans confirmation ; toast de modération générique (« Modération enregistrée. ») ; aucun état vide dans la table admin ; contenu sans `whitespace-pre-wrap`.
- **Corrections** : shadcn `Textarea` (anneau `focus-visible:ring-2` vérifié en navigateur : `boxShadow … rgb(61,158,255) 0 0 0 4px`) + placeholder + hint `aria-describedby` (20–2000 caractères) ; succès avec bouton « Envoyer un autre témoignage » ; dialog de confirmation pour Supprimer (Base UI `DialogTrigger render=`, convention du repo) avec description de l'irréversibilité ; toasts par action (« Témoignage publié./rejeté./supprimé. ») ; ligne d'état vide admin (colSpan 4) ; `whitespace-pre-wrap` sur le contenu.
- **Preuve navigateur (dev :3000, Chromium 1280 + 390 px)** : placeholder/hint/anneau de focus PASS ; aucun débordement horizontal à 390 px ; parcours de suppression réel : clic « Supprimer » → dialogue « Supprimer ce témoignage ? » → « Supprimer définitivement » → ligne retirée, état vide affiché, toast « Témoignage supprimé. » (fixture synthétique « Tanner / description du temoignage » supprimée, aucune donnée réelle).
- **Contraste (script `contrast-check.py` du skill)** : texte courant 4.57:1 (light) / 6.17:1 (dark) PASS. **Défaut corrigé** : blanc sur `--primary` light 3.61:1 et `--destructive` light 3.78:1 (échec 4.5:1 sur les libellés de boutons) → `--primary` light `210 100% 52%`→`45%` (4.58:1) et `--destructive` light `0 84% 60%`→`50%` (4.52:1), teinte conservée ; dark inchangé (déjà 6.94:1). Effet global : tous les boutons primary/destructive light s'assombrissent légèrement. `globals.css` a aussi reçu un passage prettier (fichier WIP non formaté).
- **Non corrigé, routé à thr-planning** : hauteurs de boutons 36–40 px < cible tactile 44 px (décision de design-system globale, hors périmètre tâche 17).
- **Vérifications** : `pnpm vitest run src/features/temoignage` 5/5 ; `eslint` sur les fichiers changés : 0 erreur (1 import `DialogClose` inutilisé corrigé) ; `prettier --check` OK ; `tsc --noEmit` : aucune erreur sur les fichiers de la tâche (l'échec global préexistant est le WIP partages, tâche 16).

## Session thr-dev 08 — preuve offline PWA (2026-10-05)

- **Build** : `env -u NODE_ENV pnpm build` → EXIT=0 après mise à l'écart temporaire de 6 fichiers WIP hors tâche (5 `src/features/partages/…` + `app/api/partages/route.ts`, incohérence de types entre eux), restaurés à l'octet près ensuite (`diff -q` OK, `git status` inchangé). Le précache du `sw.js` régénéré est cohérent : chaque `page-*.js` référencé existe dans `.next/` (dont `app/admin/places/page-efd40fa22e96e4db.js`, cause du 404 du 2026-10-02).
- **Protocole** : profil Chromium persistant (`/tmp/pwa-profile-08`), warmup `/temoignages`+`/activites`+`/partages` ×3 passes (la 1re passe ne met rien en cache : le SW installe/claim pendant la visite), contrôleur SW vérifié, serveur `:3108` arrêté, puis rechargement. Script : `/tmp/pw08x/pwa-proof-phases.mjs` (`warm` → PASS 3/3, `offline` → PASS 2/2). Artifacts : `/tmp/pwa-proof-08/` (`result-warm.json`, `result-offline.json`, `offline-temoignages.png`, `offline-fallback.png`).
- **Résultats** : SW actif + contrôleur ; `public-pages` contient les 3 documents + RSC ; `caches` précache contient `/~offline` ; serveur arrêté → `/temoignages` rendu complet depuis le cache (capture) ; `/route-jamais-vue-xyz` → fallback `/~offline` (capture).
- **Limite méthode** : `context.setOffline(true)` (émulation Playwright) contourne le SW dans ce Chromium (même `fetch()` en cache échoue) — preuve non valide par ce moyen ; seul le serveur arrêté prouve. Non prouvés : installation Android/iOS, audit Lighthouse prod (S9, hors scope plan-001).
- **Unitaires** : `pnpm vitest run src/features/temoignage` → 5/5 passent. `pnpm typecheck` global reste en échec sur le WIP partages hors tâche (`partage-form.tsx` TS2322/TS2345, préexistant, tâche 16) — non touché.

## Child tasks

### Task 17.1: Soumission anonyme sécurisée

**Status:** IN_PROGRESS
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

**Status:** IN_PROGRESS
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

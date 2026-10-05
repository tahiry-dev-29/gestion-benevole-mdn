Status: IN_PROGRESS

> **Suivi de remise en état:** soumission/modération/offline et validation intégrée sont suivies dans [`17_testimonials_pwa.md`](17_testimonials_pwa.md) et [`18_end_to_end.md`](18_end_to_end.md), Plan `plan-001`.

# Tâche 08 — Sprint 8 : Public — Témoignage & Finalisation PWA

> ⏱️ **Durée :** 2 semaines · 🎯 **Objectif :** soumission/publique des témoignages,
> modération admin + PWA complète (installable, offline, splash, Lighthouse ≥ 90)
> 📌 **Statut :** ⚪ À venir · **Vélocité cible :** ~45 points

- [x] Toutes les cases cochées = PR fusionnée + revue Lead (CDC §6)

## 🎯 Sprint Goal

Rendre le projet déployable comme PWA premium : visiteurs et bénéficiaires laissent des
témoignages modérés par l'admin, et l'app est installable/offline avec scores Lighthouse ≥ 90.

## 🧮 Estimation & dépendances

| Story                                         | Dev    | Points | Priorité | Dépend de                    |
| --------------------------------------------- | ------ | ------ | -------- | ---------------------------- |
| S8.1 — API Témoignage (soumission/modération) | Back2  | 5      | Haute    | Sprint 1 (Auth & RBAC)       |
| S8.2 — UI publique Témoignages                | Front2 | 3      | Haute    | Sprint 1 (Auth & RBAC)       |
| S8.3 — Formulaire soumission (public)         | Front2 | 5      | Haute    | Sprint 1 (Auth & RBAC), S8.1 |
| S8.4 — Modération admin (témoignages)         | Front1 | 3      | Moyenne  | Sprint 1 (Auth & RBAC), S8.1 |
| S8.5 — Finalisation PWA (offline, splash)     | Front2 | 8      | Haute    | S0.6, Sprint 1 (Auth & RBAC) |
| S8.6 — Audit Lighthouse                       | Lead   | 3      | Haute    | S8.5,S8.4                    |
| S8.7 — Tests globaux + bugs                   | Équipe | 3      | Haute    | toutes                       |

**Capacité :** ~45 points · **Chargement :** 32 points + buffer.

## 🎫 Sprint Board

| Story                                         | Status | Dev    | Points | Backlog | En cours | Test | Fait |
| --------------------------------------------- | ------ | ------ | ------ | ------- | -------- | ---- | ---- |
| S8.1 — API Témoignage (soumission/modération) | 🟡     | Back2  | 5      | ☐       | ☑        | ☑    | ☐    |
| S8.2 — UI publique Témoignages                | 🟡     | Front2 | 3      | ☐       | ☑        | ☑    | ☐    |
| S8.3 — Formulaire soumission (public)         | 🟡     | Front2 | 5      | ☐       | ☑        | ☑    | ☐    |
| S8.4 — Modération admin (témoignages)         | 🟡     | Front1 | 3      | ☐       | ☑        | ☑    | ☐    |
| S8.5 — Finalisation PWA (offline, splash)     | 🟡     | Front2 | 8      | ☐       | ☑        | ☑    | ☐    |
| S8.6 — Audit Lighthouse                       | ⚪     | Lead   | 3      | ☐       | ☐        | ☐    | ☐    |
| S8.7 — Tests globaux + bugs                   | ⚪     | Équipe | 3      | ☐       | ☐        | ☐    | ☐    |

## 📦 Backlog (User Stories)

### 🎟️ S8.1 — API Témoignage (soumission + modération)

**Dev :** Back2 · **Pts :** 5 · **Dépend de :** Sprint 1 (Auth & RBAC)

> En tant que **visiteur**, je peux soumettre un témoignage ; en tant que **Lead**, je le
> modère avant publication (anti-spam).

#### Tâches

- [x] Feature `src/features/temoignage/` : `temoignage.schema.ts` + `temoignage.action.ts`
- [x] `submitTemoignage` : **public** (sans session), statut initial `EN_ATTENTE`
- [x] Anti-spam : honeypot + max. caractères + rate-limit simple (IP, mémoire de processus)
- [x] Actions admin : `valider` (PUBLIE), `rejeter` (REJETE), `supprimer`
- [x] Liste publique : uniquement les `PUBLIE`

**Implémentation :** `prisma/model Temoignage`,
`src/features/temoignage/temoignage.action.ts`.

#### Acceptation (Gherkin)

- [ ] **Étant donné** un visiteur non authentifié, **Quand** il soumet un témoignage, **Alors**
  l'enregistrement est en `EN_ATTENTE` (pas publié).

### 🎟️ S8.2 — UI publique "Témoignages"

**Dev :** Front2 · **Pts :** 3 · **Dépend de :** Sprint 1 (Auth & RBAC)

#### Tâches

- [x] Route `/temoignages` : liste des publiés (cartes, avatar initial par défaut)
- [x] Bandeau témoignages sur page d'accueil
- [x] SEO de base (title, description)

#### Acceptation (Gherkin)

- [x] **Étant donné** un témoignage en `EN_ATTENTE`/`REJETE`, **Quand** un visiteur charge `/temoignages`,
  **Alors** il ne s'affiche pas.

### 🎟️ S8.3 — Formulaire de soumission (public)

**Dev :** Front2 · **Pts :** 5 · **Dépend de :** Sprint 1 (Auth & RBAC), S8.1

#### Tâches

- [x] Formulaire : nom (optionnel), contenu (max. 2000 caractères), honeypot invisible
- [x] Validation Zod + messages `sonner`
- [x] Message de succès : « Merci, votre témoignage sera publié après modération. »
- [x] Verrou anti-double clic côté formulaire et rate-limit serveur

#### Critères d'acceptation

- [ ] Envoi non authentifié possible → statut `EN_ATTENTE`

### 🎟️ S8.4 — Modération admin (témoignages)

**Dev :** Front1 · **Pts :** 3 · **Dépend de :** Sprint 1 (Auth & RBAC), S8.1

#### Tâches

- [x] `/admin/temoignages` : liste triée avec les témoignages en attente en premier
- [x] Actions : Valider / Rejeter / Supprimer
- [x] Badge de statut visible

#### Critères d'acceptation

- [x] Une action de modération se répercute côté public sans rebuild (SSR + revalidation)

### 🎟️ S8.5 — Finalisation PWA (offline + installabilité)

**Dev :** Front2 · **Pts :** 8 · **Dépend de :** S0.6, Sprint 1 (Auth & RBAC)

#### Tâches

- [x] Icônes 192 et 512 existantes, manifest standalone avec icône 512 masquable et favicon
- [x] Écran de repli hors ligne, `theme_color` + `display: standalone`
- [x] SW runtime cache des pages publiques (`/activites`, `/partages`, `/temoignages`)
- [!] Test installation Android/iOS + mise à jour SW (validation appareil requise) — **bloqué** : aucun appareil réel disponible dans cet environnement ; à valider au déploiement (S9)

#### Acceptation (Gherkin)

- **Étant donné** l'app en prod, **Quand** l'utilisateur est hors-ligne, **Alors** les
  pages publiques s'affichent depuis le cache.

### 🎟️ S8.6 — Audit Lighthouse

**Dev :** Lead · **Pts :** 3 · **Dépend de :** S8.5, S8.4

#### Tâches

- [x] Audit (perf, A11y, best practices, SEO, PWA) sur pages publiques — Lighthouse 13.5.0 mobile local (2026-10-02), une mesure/page
- [x] Correction des points < 90 (max 2 boucles) — `robots.txt`/`sitemap.xml` ajoutés (`app/robots.ts`, `app/sitemap.ts`), proxy ouvert en lecture anonyme → SEO 100
- [x] Rapport archivé dans `docs/audit-lighthouse-s5.md` (audit réel à exécuter sur déploiement)

#### Critères d'acceptation

- [x] Score global **≥ 90** sur les pages publiques — local : Activités 95, Partages 98, Témoignages 97 (perf) ; A11y/BP/SEO 100. Mesure prod/domaine restant à faire au déploiement (S9).

### 🎟️ S8.7 — Tests globaux & corrections de bugs

**Dev :** Toute l'équipe · **Pts :** 3

- [ ] Parcours complet (visiteur + admin) des 8 modules
- [ ] Tests PWA (installation, offline, mise à jour SW sur appareils réels)
- [ ] Bugs corrigés + revue Lead

## 🧪 Critères d'acceptation du Sprint

- [x] `pnpm lint` + `pnpm typecheck` + `pnpm build` verts
- [ ] Témoignages de bout en bout (soumission → modération → publication) validés par parcours runtime
- [ ] PWA installable + offline validée en navigateur/appareil
- [ ] Lighthouse global ≥ 90 (pages publiques)

## 🪵 Definition of Done (Sprint)

- [ ] Cases `[x]` = commit/PR + revue Lead
- [ ] Rapport Lighthouse archivé (`docs/audit-lighthouse-s5.md`)
- [x] Manifest + SW + fallback hors ligne compilés
- [ ] Rétro remplie + board à jour

## 📅 Rituels du Sprint

| Rituel          | Quand            |
| --------------- | ---------------- |
| Sprint Planning | J1               |
| Stand-up        | 2×/sem. (10 min) |
| Démo + Rétro    | Fin de sprint    |

## ✍️ Rétrospective

| Ce qui a bien marché | À améliorer | Actions |
| -------------------- | ----------- | ------- |
| _vide_               | _vide_      | _vide_  |

## Preuves et limites de validation (2026-10-01)

- `pnpm typecheck`, `pnpm lint`, `pnpm build` et `git diff --check` passent.
- `GET /temoignages` sans session répond HTTP 200 en serveur local ; la requête observée sélectionne uniquement les lignes `PUBLIE`.
- Le build de production utilise Webpack afin d'exécuter `@ducanh2912/next-pwa` ; il confirme le fallback `/~offline`. Le `public/sw.js` généré contient la règle `public-pages` pour les routes runtime configurées.
- Icônes vérifiées : 192×192 et 512×512. La soumission/modération par POST, l'installation/offline navigateur, les appareils Android/iOS et Lighthouse n'ont pas été exercés.
- Le build a remonté un avertissement Prisma préexistant sur la valeur enum `Role.USER` absente de la base branchée ; le rendu public des témoignages s'exécute cependant correctement.

## Session thr-up -dev 08 — correctifs PWA + preuves (2026-10-02)

- **Correctif `next.config.ts` (cause racine du « pas de contrôleur SW »)** : `disable` du plugin
  passait par `process.env.NODE_ENV === "development"`. Un `NODE_ENV` résiduel (shell, `.env`)
  désactivait silencieusement le PWA pendant `next build` (« PWA support is disabled » → aucun
  `sw.js` généré). Le `disable` utilise désormais la phase Next officielle
  (`phase === PHASE_DEVELOPMENT_SERVER`, forme-fonction documentée dans
  `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/`), et
  `extendDefaultRuntimeCaching: true` réactive la route par défaut (précache + `StaleWhileRevalidate`
  statique, nécessaire à l'enregistrement) que notre `runtimeCaching` personnalisé remplaçait.
- **`.env*` assaini** : suppression des lignes `NODE_ENV="development"/"production"` de `.env`,
  `.env.local`, `.env.production`, `.env.example` (Next.js assigne `NODE_ENV` lui-même ; la valeur
  forcée provoquait l'avertissement « non-standard NODE_ENV » et des builds dev déguisés en prod).
- **Build** : `env -u NODE_ENV pnpm build` → EXIT=0, 33 pages/routes, plugin PWA actif
  (`Service worker: …/public/sw.js`, `Documents (pages): /~offline`).
- **Preuve offline partielle (Chromium headless, CDP)** : `/sw.js` servi 200, `window.workbox`
  présent et `workbox.register()` exécuté, mais l'installation échoue :
  `bad-precaching-response :: [{"url":"…/app/admin/places/page-41fac3b3ee6d756f.js","status":404}]`
  — le précache référence un chunk hashé qui n'existe plus dans `.next/` (contenu édité entre le
  calcul du précache et l'émission ; session concurrente active sur le repo). `REGS` reste vide,
  donc **ni le rechargement offline ni le fallback n'ont pu être prouvés** dans cette session.
- **Action restante (tâche 17, étape 3)** : rebuild sur arbre stable (aucune édition concurrente),
  vérifier que le précache référence uniquement des chunks existants, puis rejouer la preuve :
  contrôleur SW → serveur stoppé → reload `/temoignages` (cache `public-pages`) → route non
  cachée (fallback `/~offline`). Script réutilisable : `/tmp/pwa-offline-proof.mjs`.
- Appareils Android/iOS + audit Lighthouse de production restent bloqués hors déploiement (S9).

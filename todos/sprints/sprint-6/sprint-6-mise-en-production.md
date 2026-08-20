# Sprint 6 — Mise en production

> ⏱️ **Durée :** 1 semaine · 🎯 **Objectif :** déploiement final sur prod (domaine, HTTPS,
> DB), verification sécurité/PWA, formation & passation
> 📌 **Statut :** ⚪ À venir · **Vélocité cible :** ~21 points

- [x] Toutes les cases cochées = PR fusionnée + revue Lead (CDC §6)

## 🎯 Sprint Goal

Livrer l'app en production, stable et sécurisée, installable comme PWA, et rendre
l'équipe autonome (formation + docs). Projet clôturé en `v1.0.0`.

## 🧮 Estimation & dépendances

| Story                                   | Dev    | Points | Priorité | Dépend de  |
| --------------------------------------- | ------ | ------ | -------- | ---------- |
| S6.1 — Environnement de production      | Lead   | 3      | Haute    | S0.7, S0.8 |
| S6.2 — Migration DB + déploiement final | Lead   | 5      | Haute    | S6.1, S5.5 |
| S6.3 — Vérification finale (checklist)  | Équipe | 5      | Haute    | S5.6       |
| S6.4 — Formation & passation            | Lead   | 3      | Moyenne  | S6.2       |
| S6.5 — Rétrospective globale + clôture  | Équipe | 2      | Moyenne  | S6.3       |

**Capacité :** ~21 points · **Chargement :** 18 points.

## 🎫 Sprint Board

| Story                                   | Status | Dev    | Points | Backlog | En cours | Test | Fait |
| --------------------------------------- | ------ | ------ | ------ | ------- | -------- | ---- | ---- |
| S6.1 — Environnement de production      | ⚪     | Lead   | 3      | ☐       | ☐        | ☐    | ☐    |
| S6.2 — Migration DB + déploiement final | ⚪     | Lead   | 5      | ☐       | ☐        | ☐    | ☐    |
| S6.3 — Vérification finale (checklist)  | ⚪     | Équipe | 5      | ☐       | ☐        | ☐    | ☐    |
| S6.4 — Formation & passation            | ⚪     | Lead   | 3      | ☐       | ☐        | ☐    | ☐    |
| S6.5 — Rétrospective globale + clôture  | ⚪     | Équipe | 2      | ☐       | ☐        | ☐    | ☐    |

## 📦 Backlog (User Stories)

### 🎟️ S6.1 — Environnement de production

**Dev :** Lead · **Pts :** 3 · **Dépend de :** S0.7, S0.8

> En tant que **Lead**, je veux un environnement prod configuré pour livrer l'app.

#### Tâches

- [ ] Variables prod dans Vercel (DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL, domaines)
- [ ] CSP + security headers + HTTPS/SSL actifs (Vercel Edge)
- [ ] Sauvegarde de la base configurée (fréquence + plan de restauration testé)
- [ ] Comptes `ADMIN` réels créés (pas de seed en prod)

**Implémentation :** Vercel → Settings → Environment Variables, `next.config.ts` (headers).

#### Critères d'acceptation

- [ ] `pnpm build` de prod passe avec les vraies variables

### 🎟️ S6.2 — Migration DB + déploiement final

**Dev :** Lead · **Pts :** 5 · **Dépend de :** S6.1, S5.5

#### Tâches

- [ ] `prisma migrate deploy` sur la base prod (jamais `dev`)
- [ ] Déploiement final Vercel + domaine (www → apex, redirects)
- [ ] Cache CDN + activation du service worker en prod
- [ ] Plan de rollback documenté (tag + migration précédente)

#### Acceptation (Gherkin)

- **Étant donné** l'app en prod, **Quand** un visiteur charge le domaine final, **Alors**
  le site est HTTPS, installable et fonctionne offline.
- **Étant donné** une migration cassante, **Quand** le rollback est exécuté, **Alors** la
  version précédente remonte en moins de 5 min.

### 🎟️ S6.3 — Vérification finale (checklist PWA + sécurité)

**Dev :** Toute l'équipe · **Pts :** 5 · **Dépend de :** S5.6

#### Tâches

- [ ] Checklist PWA : manifest, SW, HTTPS, installation, offline, splash (axe Lighthouse)
- [ ] Checklist sécurité : sessions, rôles, injection (Zod), uploads, CORS, secrets
- [ ] Test formulaire public (anti-spam) + témoignages
- [ ] `pnpm lint` + `pnpm typecheck` + `pnpm build` sur `main` (sortie jointe)

#### Critères d'acceptation

- [ ] Zéro problème bloquant ; critiques résiduelles explicitement listées

### 🎟️ S6.4 — Formation & passation

**Dev :** Lead · **Pts :** 3 · **Dépend de :** S6.2

#### Tâches

- [ ] Guide utilisateur (bénévole + admin) → `docs/guide-utilisateur.md`
- [ ] Session de démonstration en équipe
- [ ] Liste des comptes livrés + procédure reset mot de passe
- [ ] Doc déploiement (relancer build/migration) → `docs/runbook-deploiement.md`

#### Acceptation (Gherkin)

- **Étant donné** un bénévole nouveau, **Quand** il suit le guide, **Alors** il peut
  pointer sa présence sans aide.

### 🎟️ S6.5 — Rétrospective globale & clôture

**Dev :** Toute l'équipe · **Pts :** 2 · **Dépend de :** S6.3

#### Tâches

- [ ] Rétrospective projet (8 sprints)
- [ ] Mise à jour finale des boards (`todos/README.md`, ROADMAP, TODO par sprint)
- [ ] Tag release `v1.0.0` + release notes GitHub
- [ ] CDC archivé avec amendements éventuels

#### Critères d'acceptation

- [ ] Tous les sprints du ROADMAP passés en 🟢 Terminé

## 🧪 Critères d'acceptation du Sprint / du Produit

- [ ] L'app est disponible sur le domaine final en HTTPS
- [ ] PWA installable + offline validée (Lighthouse)
- [ ] Les 8 modules (User, Bénévole, Présence, Observation, Crédit, Activité, Partage, Témoignage) sont opérationnels
- [ ] Équipe autonome sur l'entretien

## 🪵 Definition of Done (Sprint)

- [ ] Cases `[x]` = commit/PR + validation Lead
- [ ] Docs (guide, runbook, audit) versionnées dans le repo
- [ ] Tag `v1.0.0` publié
- [ ] Board ROADMAP passé au statut 🟢 Terminé

## 📅 Rituels du Sprint

| Rituel                   | Quand               |
| ------------------------ | ------------------- |
| Planning + rétro globale | J1 et fin de sprint |
| Stand-up quotidien court | Chaque jour         |

## ✍️ Rétrospective

| Ce qui a bien marché | À améliorer | Actions |
| -------------------- | ----------- | ------- |
| _vide_               | _vide_      | _vide_  |

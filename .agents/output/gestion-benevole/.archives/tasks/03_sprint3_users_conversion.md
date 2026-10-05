Status: DONE

> Parcours USER → certificat → approbation → connexion vérifié le 2026-10-02. Voir [`STATUS-01-17.md`](./STATUS-01-17.md); les critères historiques non prouvés restent ouverts.

> **Suivi de remise en état:** l'audit correctif des comptes USER et de la conversion est suivi dans [`12_user_management.md`](../../tasks/12_user_management.md), Plan `plan-001`.

# Tâche 03 — Sprint 3 : Gestion USER & conversion en VOLUNTEER

**Sprint:** 3 · **Durée:** 2 semaines · **Priorité:** Haute · **Dépend de:** Tâche 01, Tâche 02 · **Plan:** [`prd.md`](../../prd.md) §4 · **Archi:** [`archi.md`](../../archi.md)

---

## Goal

Comptes `USER` complets (propriétés du PRD), pages `/admin/users`, `/admin/users/[id]`, `/admin/users/[id]/update`, et conversion **USER → VOLUNTEER** par approbation d'un certificat.

## Fichiers à créer/modifier

| Fichier | Action |
|---------|--------|
| `prisma/schema.prisma` | Modifier — champs USER + `CertificatStatut`, migration |
| `prisma/seed.ts` | Modifier — 2-3 `USER` de test avec matricule/certificat |
| `src/features/user/user.schema.ts` | Modifier — schéma complet (requis/optionnels du PRD) |
| `src/features/user/user.action.ts` | Modifier — `createUserAction`, `updateUserAction`, `getUserDetailsAction`, `listUsersAction` (filtres), `approveCertificateAction`, `rejectCertificateAction` |
| `app/api/upload/route.ts` | Vérifier — PDF CV + certificat (MIME `application/pdf`, ≤ 5 Mo) |
| `app/admin/users/page.tsx` | Créer — user/list (fichiers existants → refactorer) |
| `app/admin/users/[id]/page.tsx` | Créer — details |
| `app/admin/users/[id]/update/page.tsx` | Créer — formulaire de modification |
| `src/features/user/components/*` | Modifier — formulaire complet, badges certificat, bouton Approuver/Rejeter |
| `src/lib/gravatar.ts` | Créer — hash SHA-256 de l'email → URL Gravatar |
| `src/features/admin/admin.data.ts` | Vérifier — item `Utilisateurs` pointe vers `/admin/users` |

## Étapes

1. **Schéma** — ajouter les propriétés du PRD §4 :
   - Requis (Zod) : `matricule` **unique**, `telephone`, `materielPC: Boolean`, `accepteRegles: Boolean` + `reglesAccepteesAt`, `spinneret`, `etablissement`/`societe`, `genre`, `email`, `nom`, `prenom`.
   - Optionnels : `dateNaissance` (ou `age` existant), `socialProfile`, `cvUrl`, `siteWeb`, `joursDisponibles String[]`, `disponibilites Json`, `contactUrgence`.
   - Certificat : `certificatUrl`, `certificatStatut` (`NON_DEMANDE | EN_ATTENTE | APPROUVE | REJETE`), `certificatValidatedAt`, `certificatValidatedById`.
   - `password` reste `null` pour un `USER`.
2. Migration : `pnpm prisma migrate dev --name user_properties_and_certificate` + index `@@index([certificatStatut])`, `@@index([role, statut])`.
3. **Zod** : `createUserSchema` / `updateUserSchema` avec **tous** les champs requis listés + raffinement (`refine`) : `cvUrl` et `certificatUrl` doivent finir par `.pdf`.
4. **Server Actions** :
   - `createUserAction` — `role: "USER"` **imposé côté serveur** (le rôle n'est jamais pris du formulaire), matricule unique géré (erreur propre si doublon), `createdById = session.user.id`.
   - `updateUserAction` — vérifie session `ADMIN+`, soft-delete exclu, `revalidatePath("/admin/users")`.
   - `approveCertificateAction` — `ADMIN+` uniquement : `certificatStatut = APPROUVE`, `role = VOLUNTEER`, `certificatValidatedAt/ById`, `password` toujours null (le VOLUNTEER choisira son mdp à la première connexion ? → non : l'admin le initialise dans volunteer-management).
   - `rejectCertificateAction(motif)` — reste `USER`.
   - `listUsersAction` — filtres PRD : présence, statut certificat, place (table/siège, sprint 4), matricule, recherche nom/email.
5. **UI** :
   - Liste : colonnes nom, matricule, email, école/société, genre, certificat (Badge), statut présence ; filtres TanStack ; actions : voir / modifier / approuver.
   - Fiche `[id]` : toutes les propriétés en lecture, photo **Gravatar dérivée de l'email** (`src/lib/gravatar.ts`), boutons de conversion.
   - `update` : formulaire RHF + Zod, sections Identité / Scolarité / Contact / Disponibilités / Pièces jointes (CV, certificat) / Règles.
   - Confirmation des règles : case à cocher + date d'acceptation affichée en lecture seule.
6. Upload PDF (CV + certificat) via `/api/upload` existant : type MIME + taille vérifiés, chemin stocké en base.

## Critères d'acceptation

- [x] `pnpm typecheck`, `pnpm lint` et `pnpm build` réussissent (lint : 0 erreur, 2 avertissements existants).
- [x] État Prisma contrôlé sur la base locale dédiée `gestion_benevole_sprint06` (`localhost:5432`) : les 13 migrations sont appliquées, aucune migration en attente; `pnpm prisma migrate dev` inutile.
- [x] `createUserAction` impose `role: "USER"` même si le payload contient `role: "ADMIN"` (test unitaire).
- [x] Double `matricule` → `{ success: false, error: ... }` sans erreur brute (gestion Prisma `P2002` + test).
- [x] `/admin/users/[id]` charge toutes les propriétés USER du PRD et affiche Gravatar (page + `getUserDetailsAction` inspectées); contrôle visuel navigateur non rejoué dans cette reprise.
- [x] Upload exécutable en CV refusé, PDF de plus de 5 Mo refusé (tests unitaires); le helper vérifie également la signature PDF.
- [x] **Approuver** (ADMIN) fait passer `USER` → `VOLUNTEER` avec certificat approuvé (test d'action); la connexion après conversion a été vérifiée dans le parcours navigateur du 2026-10-02.
- [x] Un `VOLUNTEER` ne voit pas `/admin/users` (test proxy, réécriture vers `/forbidden`).
- [x] Filtres de liste certificat / statut / recherche, dont matricule, testés (unitaire + composition serveur).
- [x] Tests : `approveCertificateAction` (ADMIN ok, VOLUNTEER refusé), création à rôle forcé, erreur de doublon, et filtres.

## Vérifications de reprise — 2026-10-02

- `pnpm test` : 19 fichiers, 121 tests réussis.
- `pnpm typecheck` : réussi.
- `pnpm lint` : 0 erreur; 2 avertissements hors périmètre USER (`excel.import-users.ts` complexité, `user.action.ts` longueur).
- `pnpm build` : réussi, Next.js 16.3.4, routes USER compilées.
- Contrôle final après mise à jour du suivi : `pnpm test` 19 fichiers / 124 tests réussis; `pnpm typecheck` réussi; format Prettier et `git diff --check` réussis.
- `pnpm lint` relancé : une erreur React hors périmètre dans `src/features/places/presentation/_components/rename-table-dialog.tsx` (mise à jour d’état synchrone dans un effet) et trois avertissements. Le fichier fait partie des changements en cours sur la gestion des places; il n’a pas été modifié ici.
- `git diff --check` : réussi.
- Liste USER enrichie avec organisation, genre et badges certificat/statut; filtres extraits en fonction testée.
- Fiche USER inclut les champs contact et disponibilités horaires en plus de Gravatar et des champs déjà affichés.
- Base locale confirmée (`gestion_benevole_sprint06` sur `localhost:5432`) : `pnpm prisma migrate status` confirme les 13 migrations appliquées. Aucun changement de schéma n’était nécessaire.
- La page `[id]` et `getUserDetailsAction` incluent les propriétés USER, pièces jointes, consentement/règles, disponibilités et Gravatar. La compilation passe; le rendu réel navigateur n’a pas été rejoué car Playwright n’est pas disponible dans cet environnement.
- Contrôle Chromium effectué le 2026-10-05 : liste USER, fiche détaillée avec Gravatar, formulaire de modification et viewport 390×844. Captures : [`users-list.png`](../../outputs/task-12/users-list.png), [`user-detail.png`](../../outputs/task-12/user-detail.png), [`user-update.png`](../../outputs/task-12/user-update.png), [`users-list-mobile.png`](../../outputs/task-12/users-list-mobile.png), [`user-detail-mobile.png`](../../outputs/task-12/user-detail-mobile.png). Aucun formulaire soumis. La tâche 03 est clôturée; le suivi correctif plus large de la tâche 12 reste IN_PROGRESS.

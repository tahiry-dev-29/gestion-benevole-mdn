Status: DONE

> **Suivi de remise en état:** l'audit correctif des comptes USER et de la conversion est suivi dans [`12_user_management.md`](12_user_management.md), Plan `plan-001`.

# Tâche 03 — Sprint 3 : Gestion USER & conversion en VOLUNTEER

**Sprint:** 3 · **Durée:** 2 semaines · **Priorité:** Haute · **Dépend de:** Tâche 01, Tâche 02 · **Plan:** [`prd.md`](../prd.md) §4 · **Archi:** [`archi.md`](../archi.md)

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

- [ ] `pnpm typecheck` · `pnpm lint` · `pnpm build` · `pnpm prisma migrate dev` — 0 erreur
- [ ] `createUserAction` crée toujours un `role: "USER"` même si le payload contient `role: "ADMIN"`
- [ ] Double `matricule` → `{ success: false, error: ... }` (pas d'erreur brute)
- [ ] `/admin/users/[id]` affiche toutes les propriétés + Gravatar
- [ ] Upload d'un `.exe` en CV → refus ; PDF > 5 Mo → refus
- [ ] Bouton **Approuver** (ADMIN) : le compte passe `USER` → `VOLUNTEER`, `certificatStatut = APPROUVE`, et **ce compte peut alors se connecter sur `/login`**
- [ ] Un `VOLUNTEER` ne voit pas `/admin/users` (403 via proxy)
- [ ] Filtres de la liste : certificat / statut / recherche — résultats corrects
- [ ] Tests : `approveCertificateAction` (ADMIN ok, VOLUNTEER refusé), `createUserAction` (rôles forcés)

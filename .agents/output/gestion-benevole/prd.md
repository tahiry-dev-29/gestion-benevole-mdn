# Gestion Bénévole — PRD (V1)

> Mise à jour : 2026-10-01 — intègre les idées de l'interview (voir `discovery.md`).
> Supersede les sections §2.0–§2.2 du CDC migré dans `references/CDC_PWA_Gestion_Benevoles.md`.

## Ce que la V1 fait

### 1. Application fermée & authentification (`/login` unique)

- `/` (racine) **redirige vers `/login`** — pas de page d'accueil `/home`, pas de landing.
- **Aucune page d'inscription publique** : `/sign-up` (et tout alias) n'existe pas ; `registerAction` + `register-form.tsx` sont supprimés.
- `/login` accepte **uniquement** `SUPER_ADMIN`, `ADMIN`, `VOLUNTEER`. Un `USER` tente de se connecter → message « Compte non habilité (en attente de conversion) », **aucune session créée**.
- La création de comptes (tous rôles) se fait **uniquement** depuis `/admin/volunteer-management`.

### 2. RBAC — 4 rôles + matrice de création

| Rôle | Se connecte sur `/login` | Peut créer |
|---|---|---|
| `SUPER_ADMIN` | ✅ | `SUPER_ADMIN`, `ADMIN`, `VOLUNTEER` |
| `ADMIN` | ✅ | `ADMIN`, `VOLUNTEER` |
| `VOLUNTEER` | ✅ | `VOLUNTEER` |
| `USER` | ❌ | rien (compte géré par l'admin, converti en `VOLUNTEER`) |

- Migration `BENEVOLE` → `VOLUNTEER` (valeur renommée, données conservées) + ajout `SUPER_ADMIN` et `USER`.
- La matrice est appliquée **côté serveur** (Server Action) et reflétée dans l'UI (boutons masqués) — une seule source de vérité (`canCreate(actorRole, targetRole)`).
- Statut `INACTIF` → `/forbidden` partout.

### 3. `/admin/volunteer-management` — sous-liste + CRUD sécurisé

| Route | Page |
|---|---|
| `/admin/volunteer-management` | Liste des bénévoles (TanStack Table, filtres, recherche) |
| `/admin/volunteer-management/add` | **Add Bénévole** — création de compte avec choix du rôle selon la matrice |
| `/admin/volunteer-management/roles` | **Roles management** — matrice rôles/permissions, comptes par rôle, bascule ACTIF/INACTIF |
| `/admin/volunteer-management/[id]` | Fiche détaillée + modification + suppression (soft delete) |

CRUD réellement fonctionnel : validation Zod, vérification de rôle côté serveur, `createdById` pour la traçabilité, feedback `sonner`, états loading/erreur.

### 4. `/admin/users` — comptes USER, propriétés, conversion en VOLUNTEER

| Route | Page |
|---|---|
| `/admin/users` | **user/list** — liste filtrable + import/export Excel |
| `/admin/users/presence` | **user/presence** — pointage en choisissant la **table et le siège** |
| `/admin/users/[id]` | **user/id/details** — fiche complète |
| `/admin/users/[id]/update` | **user/id/update** — formulaire de modification |

**Propriétés USER :**

| Propriété | Requis | Type / note |
|---|---|---|
| `full_name` (nom + prénom) | ✅ | String |
| École **ou** société | ✅ | String (`etablissement` / `societe`) |
| Email | ✅ | String unique |
| Genre | ✅ | enum |
| Matricule / N° étudiant | ✅ | String **unique** |
| Téléphone / WhatsApp | ✅ | String |
| Matériel (PC) | ✅ | Boolean — `false` ⇒ l'association peut en fournir un |
| Confirmation des règles | ✅ | Boolean + `acceptedAt` (date d'acceptation des CGU) |
| Spinneret | ✅ | String — *libellé à confirmer, modélisé tel quel* |
| Date de naissance **ou** âge | ⬜ | DateTime? / Int? |
| Profil réseau social | ⬜ | String (URL) |
| Photo de profil | ⬜ | résolue automatiquement via l'email (Gravatar) |
| CV | ⬜ | PDF (upload, taille/MIME validés) |
| Site web | ⬜ | String (URL) |
| Jours de présence possibles | ⬜ | MONDAY→SATURDAY (String[]) |
| Disponibilités horaires | ⬜ | créneaux (Json) |
| Contact d'urgence | ⬜ | String (nom + téléphone) |

**Conversion USER → VOLUNTEER :** certificat (PDF) uploadé sur le compte → statut `EN_ATTENTE` → un **admin approuve** → `role = VOLUNTEER`, `certificatValidatedAt/By` tracés. Rejet possible avec motif.

### 5. Présences & places

- `/admin/places` — **CRUD des numéros de table et de siège** : créer une table (génère ses sièges), renommer un n° de table, ajouter/modifier/supprimer un n° de siège (refus si une présence y est rattachée).
- Les places **ne sont pas fixes** par utilisateur : à chaque pointage (`/admin/users/presence`), on choisit la table + le siège occupés ce jour-là.
- Filtre calendrier jour / semaine / mois ; enregistrement : date, arrivée, départ, table, siège, statut.

### 6. Import / Export Excel (exceljs)

- **Liste USER** : export de toutes les propriétés du tableau ci-dessus ; import en masse (validation Zod ligne par ligne, rapport d'erreurs avec n° de ligne).
- **Présences** : export (date, matricule, nom, email, table, siège, statut, arrivée, départ) ; import pour reprendre un pointage existant.

### 7. Reste du périmètre CDC (inchangé)

Observations mensuelles & liste de crédits (sprint 06), pages publiques activités/partages (07), témoignages + PWA (08), mise en production (09).

## Ce que la V1 NE fait PAS (hors scope volontaire)

- Pas d'inscription publique / pas de `/sign-up` / pas de page d'accueil `/home`.
- Pas de connexion pour le rôle `USER` (ni portail self-service côté USER).
- Pas de création de compte `SUPER_ADMIN` par un `ADMIN`.
- Pas d'application mobile native (PWA uniquement).
- Pas de paiement, pas de newsletter, pas de messagerie interne.
- Pas d'attribution **fixe** table/siège à un utilisateur (choix à chaque présence).
- Pas de suppression définitive (soft delete / statut INACTIF uniquement).

## Parcours ou cas d'usage clés

1. **Connexion fermée** : visite `/` → redirect `/login` → identification `ADMIN` → `/admin/dashboard` ; tentative `USER` → refus.
2. **Création d'un bénévole** : `VOLUNTEER` → `/admin/volunteer-management/add` → rôle proposé limité à `VOLUNTEER` → compte créé (`createdById` tracé) ; un `ADMIN` voit `ADMIN`+`VOLUNTEER` ; seul `SUPER_ADMIN` voit `SUPER_ADMIN`.
3. **Conversion d'un étudiant** : admin crée le `USER` (propriétés complètes, matricule unique) → le USER dépose son certificat → admin ouvre `/admin/users/[id]` → **Approuver** → le compte devient `VOLUNTEER` et peut alors se connecter.
4. **Pointage avec place** : `/admin/users/presence` → date + bénévole + table/siège → arrivée/départ enregistrés ; la grille de la salle est cohérente avec `/admin/places`.
5. **Excel** : export de la liste USER pour RH ; ré-import d'un fichier corrigé → lignes invalides signalées, lignes valides créées.

## Critères de succès de la V1

- `pnpm typecheck`, `pnpm lint`, `pnpm build` passent (0 erreur).
- Matrice RBAC vérifiée par test : chaque route × chaque rôle, + matrice de création `canCreate` exhaustivement testée.
- `/` → `/login` (307) ; `/sign-up` inexistant ; login `USER` impossible.
- CRUD volunteer-management, users, places fonctionnels en conditions réelles (pas de mock).
- Import/export Excel : aller-retour complet sans perte de colonnes et avec rapport d'erreurs.
- Aucun compte créé hors de `/admin/volunteer-management`.

## Contraintes techniques connues à ce stade

Voir `.agents/rules/stack.md` (Zod, Server Actions, Tailwind 4, fichiers ≤ 200 lignes, zéro `any`).

Spécifiques à ce projet :

- Migration Prisma : `ALTER TYPE "Role" RENAME VALUE 'BENEVOLE' TO 'VOLUNTEER'` (conserver les données), puis ajout `SUPER_ADMIN` / `USER`.
- `exceljs` en dépendance serveur (Server Actions / Route Handlers) — jamais importé dans un Client Component.
- Stockage fichiers (CV, certificat) : route `/api/upload` existante, contraintes MIME + taille.

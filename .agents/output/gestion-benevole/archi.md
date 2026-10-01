# Gestion Bénévole — Architecture technique

Stack : voir `.agents/rules/stack.md` (Next.js App Router + Prisma 7/PostgreSQL + NextAuth v4 + Tailwind 4 + shadcn/ui + TanStack Table/Query + Zod).

## Modélisation des données

### Évolution de l'`enum Role`

```prisma
enum Role {
  SUPER_ADMIN
  ADMIN
  VOLUNTEER   // ex-BENEVOLE — renommé par migration, données conservées
  USER        // pré-conversion, ne peut PAS se connecter
}
```

Migration : migration Prisma custom contenant
`ALTER TYPE "Role" RENAME VALUE 'BENEVOLE' TO 'VOLUNTEER';` puis `ADD VALUE 'SUPER_ADMIN'` / `'USER'`
(**jamais** drop/recreate de l'enum — cela détruirait les données).

### `User` — champs ajoutés (SPRINT 03)

```prisma
model User {
  // ... existants (nom, prenom, email, password, role, statut, photo, sexe, age,
  //     contact, categorie, etablissement, facebook, date_entree, deletedAt ...)

  matricule        String?  @unique          // N° étudiant — requis en Zod
  societe          String?                   // école OU société
  telephone        String?                   // téléphone / WhatsApp
  dateNaissance    DateTime?
  siteWeb          String?
  cvUrl            String?                   // PDF
  socialProfile    String?                   // URL profil réseau
  joursDisponibles String[]                  // MONDAY .. SATURDAY
  disponibilites   Json?                     // créneaux horaires
  contactUrgence   String?
  spinneret        String?                   // libellé à confirmer (voir discovery Q1)
  accepteRegles    Boolean   @default(false)
  reglesAccepteesAt DateTime?
  materielPC       Boolean   @default(false) // Hardware requis
  createdById      Int?                      // traçabilité de la création
  createdBy        User?   @relation("CreatedBy", fields: [createdById], references: [id])

  // conversion USER → VOLUNTEER
  certificatUrl         String?
  certificatStatut      CertificatStatut @default(NON_DEMANDE)
  certificatValidatedAt DateTime?
  certificatValidatedById Int?

  @@index([certificatStatut])
  @@index([role, statut])
}

enum CertificatStatut {
  NON_DEMANDE
  EN_ATTENTE
  APPROUVE
  REJETE
}
```

> `password` reste nullable : un `USER` n'a **pas** de mot de passe tant qu'il n'est pas converti.

### Places (SPRINT 04) — non fixes par utilisateur

```prisma
model Seat {
  id          Int    @id @default(autoincrement())
  tableNumber Int
  seatNumber  Int
  label       String?
  presences   Attendance[]
  @@unique([tableNumber, seatNumber])   // pas de doublon table/siège
  @@index([tableNumber])
}

model Attendance {
  id       Int      @id @default(autoincrement())
  user_id  Int
  date     DateTime @db.Date
  seat_id  Int?                            // place choisie CE JOUR-LÀ
  statut   String   @default("PRESENT")    // PRESENT | ABSENT | RETARD
  heure_arrivee String?
  heure_depart   String?
  user     User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  seat     Seat?    @relation(fields: [seat_id], references: [id])
  @@unique([user_id, date])                // un pointage par utilisateur et par jour
  @@index([date])
}
```

> L'ancien modèle `Presence` est remplacé par `Attendance` (data migration si données existantes).
> **Pas de `userId` sur `Seat`** : une place n'est jamais attribuée définitivement (décision D9).

## Modules / services backend

| Module | Fichiers | Responsabilité |
|---|---|---|
| Auth | `src/features/auth/auth.action.ts`, `src/lib/auth-options.ts` | login uniquement (register supprimé), refus `USER` dans `authorize()` |
| RBAC | `proxy.ts`, `src/lib/rbac.ts` | matrice routes × rôles + **`canCreate(actorRole, targetRole)`** (source unique) |
| Volunteer management | `src/features/volunteers/` (ex-`benevoles/`) | CRUD bénévoles, création avec matrice, roles management, soft delete |
| Users | `src/features/user/` | CRUD USER, filtres, conversion par certificat |
| Présence | `src/features/presence/` | pointage avec place, filtre calendrier |
| Places | `src/features/places/` | CRUD tables/sièges |
| Excel | `src/features/excel/` (`excel.ts`, `excel.schema.ts`, `excel.action.ts`) | import/export XLSX users + présences |
| Upload | `app/api/upload/route.ts` | CV + certificat (MIME + taille) |

**`canCreate` — unique source de vérité** (utilisée par les Server Actions ET l'UI) :

```ts
const CREATE_MATRIX: Record<Role, Role[]> = {
  SUPER_ADMIN: ["SUPER_ADMIN", "ADMIN", "VOLUNTEER"],
  ADMIN:       ["ADMIN", "VOLUNTEER"],
  VOLUNTEER:   ["VOLUNTEER"],
  USER:        [],
};
```

## Endpoints API

| Méthode | Route | Description | Auth requise |
|---|---|---|---|
| POST | `/api/auth/[...nextauth]` | NextAuth (login) — `USER` refusé | public |
| GET | `/` | redirect 307 → `/login` | public |
| POST | `/api/upload` | upload CV / certificat (PDF) | session ADMIN+ |
| GET | `/api/export/users` | download XLSX utilisateurs | session ADMIN+ |
| GET | `/api/export/presences` | download XLSX présences | session ADMIN+ |
| POST | `/api/import/users` | import XLSX (rapport d'erreurs) | session ADMIN+ |
| POST | `/api/import/presences` | import XLSX présences | session ADMIN+ |

Mutations simples = **Server Actions** (`*.action.ts`, validation Zod) ; les endpoints ci-dessus servent au téléchargement/upload binaire.

## Routes & composants frontend

| Route | Page / composants | Rôles |
|---|---|---|
| `/` | `redirect("/login")` (dans `proxy.ts`) | public |
| `/login` | `app/login/page.tsx` + `login-form.tsx` | public |
| `/forbidden` | `app/forbidden/page.tsx` | tout rôle |
| `/admin` | redirect → `/admin/dashboard` | connecté, non-USER |
| `/admin/dashboard` | dashboard | SUPER_ADMIN, ADMIN, VOLUNTEER |
| `/admin/volunteer-management` | liste (TanStack Table) | SUPER_ADMIN, ADMIN, VOLUNTEER |
| `/admin/volunteer-management/add` | form création + rôle selon matrice | selon `canCreate` |
| `/admin/volunteer-management/roles` | matrice rôles/permissions | lecture : ADMIN+ ; édition : SUPER_ADMIN |
| `/admin/volunteer-management/[id]` | fiche + edit + delete | selon `canCreate` |
| `/admin/users` | **user/list** + filtres + Excel | SUPER_ADMIN, ADMIN |
| `/admin/users/presence` | pointage table/siège + calendrier | SUPER_ADMIN, ADMIN |
| `/admin/users/[id]` | **details** (+ approbation certificat) | SUPER_ADMIN, ADMIN |
| `/admin/users/[id]/update` | **update** | SUPER_ADMIN, ADMIN |
| `/admin/places` | CRUD tables/sièges | SUPER_ADMIN, ADMIN |
| `/admin/{dashboard,presences,activities,credits,observations,statistiques,parametres,profil,sprints}` | existants | ADMIN+ (profil : tous) |

### Nettoyage de routes existantes (doublons)

| À garder | À supprimer (doublon/mock) |
|---|---|
| `/admin/volunteer-management` | `/admin/benevoles`, `/admin/benevoles/[id]`, `/admin/volunteers` (page mock) |
| `/admin/users/presence` | `/admin/presence` |
| `/admin/activities` | `/admin/activites` |
| `/admin/users` | — |

> La sidebar (`src/features/admin/admin.data.ts`) est mise à jour en même temps que les suppressions.

## Décisions d'architecture notables

| Choix | Écarté | Raison |
|---|---|---|
| 4 rôles avec `BENEVOLE` renommé `VOLUNTEER` | garder `BENEVOLE` | vocabulaire uniforme (UI en anglais/technique), migration par `RENAME VALUE` sans perte |
| `canCreate()` centralisé | vérifications dispersées dans chaque action | une seule source testable, UI et serveur toujours cohérents |
| Inscription supprimée (`registerAction` retiré) | garder un `/sign-up` masqué | app fermée : les comptes naissent dans volunteer-management |
| Refus de `USER` dans `authorize()` NextAuth | redirection après login | pas de session ouverte pour un rôle non habilité (moins de surface d'attaque) |
| `Seat` **sans** `userId` (place choisie à chaque présence) | siège fixe assigné | décision D9 : les numéros de table/siège sont réorganisables |
| `exceljs` côté serveur | CSV maison / SheetJS | lecture+écriture XLSX fiable, formats de colonnes, choix acté (D11) |
| Photo de profil = Gravatar dérivé de l'email | upload d'avatar | propriété demandée « get by email », zéro stockage |
| Soft delete (`deletedAt`) + statut `INACTIF` | suppression en dur | traçabilité et historique de présence préservés |
| `src/features/benevoles/` renommé `src/features/volunteers/` | garder le nom FR | cohérence avec `VOLUNTEER` et les routes `/admin/volunteer-management` |

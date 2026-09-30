# 🗺️ Feature / Sprint Plan: Refacto Gestion USER / BENEVOLE / ADMIN

**Sprint / Reference**: Sprint 3 — Refacto Rôles & Séparation Préoccupations
**Date**: 2026-09-30
**Status**: 📝 Draft

---

## 🎯 1. Objective & Scope

- **Problem Statement:** La gestion actuelle mélange les rôles ADMIN et BENEVOLE dans `src/features/user/`. Il n'existe pas de rôle USER (étudiant/participant standard). Les pages admin ne distinguent pas les utilisateurs réguliers des bénévoles. Il faut séparer : `/admin/users` (gestion USER uniquement), `/admin/benevoles` (gestion BENEVOLE), et restreindre l'accès admin aux ADMIN seuls.

- **Scope Checklist:**
  - [ ] Ajouter `USER` à `enum Role` + migration Prisma
  - [ ] Champs étudiants sur `User` (schoolName, filière, année scolaire, ECTS, genre, fullName)
  - [ ] Changer le rôle par défaut d'inscription : `BENEVOLE` → `USER`
  - [ ] Découper `src/features/user/` → USER uniquement ; `src/features/benevoles/` → BENEVOLE uniquement
  - [ ] Flow PDF : admin upload fichier de vérification → valide → USER devient BENEVOLE
  - [ ] Nouveaux modèles `Seat` (table + siège) + `Attendance` (présence par date + place)
  - [ ] Filtre calendrier sur les présences
  - [ ] Filtres user list : présence, fichier, place, ECTS
  - [ ] `proxy.ts` : `USER` accède profil + présence uniquement, zéro admin
  - [ ] `proxy.ts` : `BENEVOLE` accède activité/partage/témoignage + profil
  - [ ] Section Admin > Bénévole : Info perso, Presence (Journalier, Observation/Mois, Liste Crédit)
  - [ ] UI shadcnUI + TanStack Table, minimaliste moderne

---

## 🏗️ 2. Architectural Sketch (Da Vinci Mode)

### 2.1 Database Schema (Prisma)

```prisma
enum Role {
  ADMIN
  BENEVOLE
  USER        // ← nouveau
}

model User {
  // ... champs existants ...
  // ← nouveaux champs étudiants
  schoolName     String?
  filiere        String?
  anneeScolaire  String?
  ects           Int?
  genre          String?          // remplace/sexe existant si needed
  verificationFile String?        // URL/path du PDF de vérification
  verifiedAt     DateTime?        // date de validation admin
}
```

```prisma
model Seat {
  id          Int      @id @default(autoincrement())
  tableNumber Int
  seatNumber  Int
  user_id     Int?     @unique    // un siège = un user max
  user        User?    @relation(fields: [user_id], references: [id])
  createdAt   DateTime @default(now())

  @@unique([tableNumber, seatNumber])
}

model Attendance {
  id        Int      @id @default(autoincrement())
  user_id   Int
  date      DateTime @db.Date
  seat_id   Int?
  statut    String   @default("PRESENT")
  arrival   String?
  departure  String?
  user      User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  seat      Seat?    @relation(fields: [seat_id], references: [id])

  @@unique([user_id, date])
}
```

> **Note:** L'ancien modèle `Presence` est remplacé par `Attendance`. Migration avec data migration si données existantes.

### 2.2 Service Boundaries

| Couche | Fichier | Responsabilité |
|--------|---------|----------------|
| **Présentation** | `src/features/user/components/users-table.tsx` | Table TanStack — USER uniquement, filtres présence/fichier/place/ECTS |
| **Présentation** | `src/features/benevoles/presentation/benevoles-table.tsx` | Table TanStack — BENEVOLE uniquement |
| **Présentation** | `src/features/presence/` | Calendrier, grille tables/sièges, pointage |
| **Application** | `src/features/user/user.action.ts` | CRUD USER, transfert USER→BENEVOLE (PDF) |
| **Application** | `src/features/benevoles/application/` | CRUD BENEVOLE, infos perso, credits |
| **Domain** | `src/features/benevoles/domain/benevole.entity.ts` | Logique métier BENEVOLE |
| **Infrastructure** | `src/features/benevoles/infrastructure/benevole.repository.ts` | Accès DB BENEVOLE |
| **Middleware** | `proxy.ts` | RBAC : ADMIN→tout, BENEVOLE→activités+profil, USER→profil+présence |

### 2.3 Route Protection (`proxy.ts`)

```ts
if (pathname.startsWith("/admin")) {
  if (!token) → redirect /login
  if (token.role === "USER") → /forbidden          // aucun accès admin
  if (token.role === "BENEVOLE") → vérifier routes autorisées (activités, profil)
  if (token.role !== "ADMIN") → /forbidden
  if (token.statut === "INACTIF") → /forbidden
}
```

### 2.4 Navigation Sidebar (`admin.data.ts`)

```ts
adminNavGroups = [
  { label: "Navigation", items: [Dashboard, Sprints] },
  { label: "Utilisateurs", items: [
      { title: "Utilisateurs (USER)", url: "/admin/users" },
      { title: "Bénévoles", url: "/admin/benevoles" },
  ]},
  { label: "Présences", items: [
      { title: "Journalier", url: "/admin/presence" },
      { title: "Grille Places", url: "/admin/presence/grille" },
  ]},
  { label: "Communication", items: [Partages, Témoignages] },
  { label: "Système", items: [Statistiques, Paramètres] },
]
```

---

## 🧪 3. Verification & Testing Blueprints

- **Test Runner:** Vitest (`bun test`)
- **Testing Approach:**
  - Unit tests sur `user.action.ts` : création USER, transfert USER→BENEVOLE (PDF requis), filtres
  - Unit tests sur `proxy.ts` : chaque rôle → chaque route (table de matrice)
  - Integration tests sur les Server Actions avec mocked Prisma
- **Mocking Boundaries:**
  - Mock `prisma` pour les tests d'actions
  - Mock `getToken` pour les tests middleware
  - PDF upload testé avec fichier fixture

**Matrice d'accès attendue :**

| Route | ADMIN | BENEVOLE | USER |
|-------|-------|----------|------|
| `/admin/dashboard` | ✅ | ❌ | ❌ |
| `/admin/users` | ✅ | ❌ | ❌ |
| `/admin/benevoles` | ✅ | ❌ | ❌ |
| `/admin/presence` | ✅ | ❌ | ❌ |
| `/admin/profil` | ✅ | ✅ | ✅ |
| `/activites` (public) | ✅ | ✅ | ✅ |
| `/partages` (public) | ✅ | ✅ | ❌ |

---

## 🎨 4. Tactile Polish & Visuals (Animations)

- **Transitions:** `transition-colors duration-150` sur boutons, `duration-200` sur cards
- **Scale-on-press:** `active:scale-[0.98]` sur boutons primaires
- **Stagger:** entrées de table avec `animate-in fade-in slide-in-from-bottom-2` delayées de `50ms * index`
- **Rules compliance:** Pas de `transition: all`, radius concentrique (`rounded-md` partout), `duration-150/200` uniquement
- **UI Stack:** shadcnUI + TanStack Table + TanStack Query, TailwindCSS 4 uniquement

---

## 📅 5. Milestones & Task Breakdown

### Phase 1 — Schema & Migration
1. [ ] Ajouter `USER` à `enum Role` dans `schema.prisma`
2. [ ] Ajouter champs étudiants (`schoolName`, `filiere`, `anneeScolaire`, `ects`, `verificationFile`, `verifiedAt`) sur `User`
3. [ ] Créer modèles `Seat` et `Attendance`
4. [ ] Générer migration Prisma (`pnpm prisma migrate dev`)
5. [ ] Mettre à jour `prisma/seed.ts` : rôle par défaut `USER`, comptes existants
6. [ ] Supprimer ancien modèle `Presence` (ou data migration vers `Attendance`)

### Phase 2 — Backend / Server Actions
7. [ ] `user.action.ts` : restreindre à `role: USER` pour la liste
8. [ ] `user.action.ts` : nouvelle action `promoteUserToBenevoleAction` (upload PDF → vérification → rôle change)
9. [ ] `benevole.action.ts` (nouveau ou existant) : CRUD BENEVOLE isolé
10. [ ] `presence.action.ts` : refondre avec `Attendance` + `Seat`, filtre calendrier
11. [ ] `proxy.ts` : RBAC complet (matrice section 3)

### Phase 3 — Frontend / UI
12. [ ] `users-table.tsx` : filtres présence, fichier, place, ECTS + bouton "Promouvoir BENEVOLE"
13. [ ] Modal upload PDF de vérification (shadcn Dialog)
14. [ ] `benevoles-table.tsx` : isoler la gestion BENEVOLE
15. [ ] Page présence : calendrier filtre + grille tables/sièges
16. [ ] Sidebar : séparer menu USER / BENEVOLE
17. [ ] Profile form : champs étudiants (school, filière, ECTS…)

### Phase 4 — Audit & Verification
18. [ ] `pnpm prisma migrate dev` sans erreur
19. [ ] `npx tsc --noEmit` sans erreur
20. [ ] `npx eslint` sans erreur
21. [ ] Tests Vitest : matrice RBAC + actions user/benevole
22. [ ] Test manuel : login USER → accès refusé sur `/admin/*` sauf profil
23. [ ] Test manuel : login BENEVOLE → accès activités/profil, refus users/benevoles admin

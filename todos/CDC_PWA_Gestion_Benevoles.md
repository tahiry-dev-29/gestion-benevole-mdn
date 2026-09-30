# Cahier des Charges

## Application PWA – Gestion des Bénévoles (Maison du Numérique)

---

## 1. Présentation du projet

**Nom du projet :** Gestion Bénévole – Maison du Numérique
**Type :** Progressive Web App (PWA) — installable, responsive, utilisable hors-ligne partiellement
**Objectif :** Centraliser la gestion des bénévoles (présence, suivi, crédits) et offrir une vitrine publique de leurs activités, partages et témoignages.

### Stack technique

| Composant            | Technologie                                                        |
| -------------------- | ------------------------------------------------------------------ |
| Frontend / Framework | Next.js (App Router)                                               |
| Style                | Tailwind CSS                                                       |
| Base de données      | PostgreSQL                                                         |
| ORM (recommandé)     | Prisma                                                             |
| Auth                 | NextAuth.js (ou JWT custom)                                        |
| PWA                  | next-pwa / manifest.json + service worker                          |
| Hébergement          | Géré par le Lead                                                   |
| Suivi de projet      | **Intégré dans ce document** (voir section 6) — aucune app externe |

### Équipe (5 personnes)

| Rôle               | Responsabilité                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **Lead (toi)**     | Initialisation du repo, config Next.js/Tailwind, architecture, hébergement, CI/CD, revue de code |
| **Dev Backend 1**  | Modélisation PostgreSQL, API routes, auth                                                        |
| **Dev Backend 2**  | API routes (présence, crédits), sécurité                                                         |
| **Dev Frontend 1** | Interfaces Admin (bénévole, présence)                                                            |
| **Dev Frontend 2** | Interfaces Public + PWA (manifest, offline)                                                      |

---

## 2. Fonctionnalités

### 2.0 Gestion des rôles (RBAC)

| Rôle         | Description                                                                       | Accès                                                     |
| ------------ | --------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **ADMIN**    | Administrateur complet                                                            | Tout : dashboard, users, bénévoles, présences, paramètres |
| **USER**     | Utilisateur standard (étudiant/participant) — **rôle par défaut à l'inscription** | Profil + présences uniquement. **Zéro accès admin**       |
| **BENEVOLE** | Bénévole validé (passé de USER via vérification PDF)                              | Profil + présences + espaces activité/partage/témoignage  |

**Parcours USER → BENEVOLE :**

1. L'admin crée un USER avec les champs obligatoires
2. L'admin upload un fichier PDF de vérification (pièce justificative)
3. L'admin valide → le rôle passe à `BENEVOLE`
4. Le USER accède alors aux espaces bénévole

### 2.1 Création & Gestion Utilisateur (USER)

**Champs obligatoires à la création :**

- Full name (prénom + nom)
- Âge
- Genre
- Email + mot de passe
- School name (établissement scolaire/universitaire)
- Filière (département/voie)
- Année scolaire
- ECTS (crédits)

**Liste des utilisateurs — filtres :**

- Par présence (présent/absent/retard)
- Par fichier de vérification (validé/en attente/absent)
- Par place (table + siège)
- Par ECTS (seuil minimum)

**Actions admin sur la liste :**

- Créer un USER
- Modifier un USER
- Transformer USER → BENEVOLE (upload PDF + validation)
- Supprimer/désactiver un USER

### 2.2 Gestion des Présences (USER & BENEVOLE)

**Système de places :**

- Chaque **table** a un numéro
- Chaque **siège** dans une table a un numéro
- Un siège = un utilisateur assigné (unique)
- Assignation : `table N / siège M`

**Pointage avec places :**

- L'utilisateur pointe sur **sa place** (table + siège)
- Enregistrement : date, heure arrivée, heure départ, place occupée

**Filtre calendrier :**

- Vue par jour / semaine / mois
- Navigation calendrier pour consulter les présences passées

### 2.3 Espace Admin — Section Bénévole

- **Info perso** : fiche bénévole (nom, contact, rôle, photo, date d'entrée, school, filière, ECTS)
- **Présence**
  - **Journalier** : pointage quotidien (arrivée/départ) avec place (table + siège)
  - **Observation ?/Mois** : note ou observation mensuelle par bénévole
  - **Liste Crédit** : suivi des crédits/heures accumulés par bénévole

### 2.4 Espace Public

- **Activité (bénévole)** : liste/actualité des activités menées
- **Partage** : publications/contenus partagés par la structure ou les bénévoles
- **Témoignage** : témoignages de bénévoles ou bénéficiaires

### 2.5 Contraintes UI/UX

- **Style** : simple, minimaliste mais moderne
- **UI kit** : shadcn/ui (composants réutilisables)
- **Tables** : TanStack Table (filtres, tri, pagination)
- **State** : TanStack Query (data fetching/cache)
- **Validation** : Zod (front + back, même schéma)
- **Toasts** : sonner
- **Thème** : next-themes (dark/light)

---

## 3. Diagrammes UML

### 3.1 Diagramme de cas d'utilisation

```mermaid
flowchart LR
  Admin((Admin))
  User((USER))
  Benevole((Bénévole))
  Visiteur((Visiteur))

  Admin --> UC0[Créer/gerer utilisateurs USER]
  Admin --> UC0b[Valider PDF → USER devient BENEVOLE]
  Admin --> UC1[Gérer info perso bénévole]
  Admin --> UC2[Pointer présence bénévole]
  Admin --> UC3[Saisir observation mensuelle]
  Admin --> UC4[Consulter liste crédit]
  Admin --> UC5[Publier activité]
  Admin --> UC6[Publier partage]
  Admin --> UC7[Modérer témoignage]
  Admin --> UC99[Gérer places / tables / sièges]

  User --> UCP1[Consulter/modifier son profil]
  User --> UCP2[Pointer présence sur sa place]
  User --> UCP3[Consulter son historique présence]

  Benevole --> UCB1[Consulter info perso]
  Benevole --> UCB2[Pointer présence]
  Benevole --> UCB3[Consulter activité]
  Benevole --> UCB4[Consulter partage]
  Benevole --> UCB5[Rédiger témoignage]

  Visiteur --> UC8[Consulter activités]
  Visiteur --> UC9[Consulter partages]
  Visiteur --> UC10[Soumettre témoignage]
```

### 3.2 Diagramme de classes / Modèle de données (ERD)

```mermaid
erDiagram
  USER ||--o{ ATTENDANCE : effectue
  USER ||--o{ OBSERVATION : recoit
  USER ||--o{ CREDIT : cumule
  USER ||--o{ ACTIVITE : publie
  USER ||--o{ PARTAGE : publie
  USER ||--o{ TEMOIGNAGE : redige
  USER ||--o| SEAT : occupe
  SEAT ||--o{ ATTENDANCE : accueille

  USER {
    int id PK
    string nom
    string prenom
    string email
    string password
    string role "ADMIN | BENEVOLE | USER"
    string statut "ACTIF | INACTIF"
    string schoolName
    string filiere
    string anneeScolaire
    int ects
    string genre
    int age
    string verificationFile "URL PDF"
    datetime verifiedAt
    date date_entree
  }
  SEAT {
    int id PK
    int tableNumber
    int seatNumber
    int user_id FK "unique - un siège = un user"
  }
  ATTENDANCE {
    int id PK
    int user_id FK
    int seat_id FK "optionnel"
    date date
    string statut "PRESENT | ABSENT | RETARD"
    string heure_arrivee
    string heure_depart
  }
  OBSERVATION {
    int id PK
    int user_id FK
    int mois
    int annee
    string contenu
  }
  CREDIT {
    int id PK
    int user_id FK
    float montant
    date date
    string motif
  }
  ACTIVITE {
    int id PK
    int user_id FK
    string titre
    string description
    date date
  }
  PARTAGE {
    int id PK
    int user_id FK
    string titre
    string contenu
    date date_publication
  }
  TEMOIGNAGE {
    int id PK
    int user_id FK
    string nom_auteur
    string contenu
    string statut "EN_ATTENTE | VALIDE | REJETE"
  }
```

### 3.3 Diagramme de séquence — Authentification

```mermaid
sequenceDiagram
  participant U as Utilisateur
  participant F as Frontend (Next.js)
  participant A as API Auth
  participant DB as PostgreSQL

  U->>F: Saisie identifiants
  F->>A: POST /api/auth/login
  A->>DB: Vérifier utilisateur
  DB-->>A: Résultat
  A-->>F: Token / Session
  F-->>U: Redirection vers Dashboard
```

_(Ces diagrammes se rendent automatiquement dans GitHub, GitLab, Notion, VS Code avec l'extension Mermaid, etc.)_

---

## 4. Suivi des tâches — sans application externe

Chaque tâche ci-dessous est une **checklist Markdown standard** :

```
- [ ] Tâche à faire
- [x] Tâche terminée
```

Le bénévole/dev met un `x` entre les crochets directement dans ce fichier (édité dans le repo Git, poussé sur une branche, ou modifié en direct si le fichier est partagé). **Aucun outil tiers requis** — le fichier EST le tableau de bord, versionné avec le code.

> 💡 **Encore mieux, si tu veux aller plus loin :** comme le projet est déjà en Next.js + PostgreSQL, on peut ajouter une toute petite page interne `/admin/sprints` (une table `tasks` en base + une UI avec cases à cocher) qui remplace ce fichier par un vrai tableau de suivi persistant, développé avec la même stack — donc **zéro outil externe, zéro nouvelle techno à apprendre**. Je peux ajouter ça comme tâche du Sprint 0 si tu veux (voir case à cocher dédiée plus bas).

---

## 5. Sprints & Tâches (par équipe)

### Sprint 0 — Initialisation & Setup (1 semaine)

**Lead**

- [ ] Créer le repo Git + structure de branches (main/dev/feature)
- [ ] Initialiser projet Next.js (App Router)
- [ ] Configurer Tailwind CSS
- [ ] Configurer PostgreSQL + Prisma (schéma de base)
- [ ] Configurer variables d'environnement (.env)
- [ ] Mettre en place l'hébergement (Vercel/VPS + DB managée)
- [ ] Configurer CI/CD basique (build/lint)
- [ ] Ajouter manifest.json + icônes PWA de base
- [ ] (Optionnel) Créer table `tasks` + page `/admin/sprints` pour suivi interne

---

### Sprint 1 — Authentification & Rôles (2 semaines)

**Dev Backend 1**

- [ ] Finaliser schéma PostgreSQL (User + champs étudiants, Seat, Attendance, Observation, Credit, Activite, Partage, Temoignage)
- [ ] Ajouter `USER` à `enum Role` + migration Prisma
- [ ] API Auth (login/register/logout) — rôle par défaut `USER`
- [ ] Seed : comptes ADMIN, USER, BENEVOLE de test

**Dev Backend 2**

- [ ] Middleware `proxy.ts` : RBAC complet (ADMIN / BENEVOLE / USER)
- [ ] Protection routes : USER → profil+présence, BENEVOLE → +activités, ADMIN → tout

**Dev Frontend 1**

- [ ] Page de connexion (UI)
- [ ] Layout Admin (sidebar/navbar)

**Dev Frontend 2**

- [ ] Layout Public (header/footer)
- [ ] Configuration du service worker (offline shell de base)

---

### Sprint 2 — Gestion Utilisateur (USER) & Vérification PDF (2 semaines)

**Dev Backend 1**

- [ ] Server Action : création USER avec champs étudiants (schoolName, filière, année scolaire, ECTS, genre, age)
- [ ] Server Action : transfert USER → BENEVOLE (upload PDF + validation admin)
- [ ] Server Action : liste USER avec filtres (présence, fichier, place, ECTS)

**Dev Backend 2**

- [ ] Upload fichier PDF (validation type MIME + taille max 5 Mo)
- [ ] Stockage Vercel Blob pour les PDF de vérification

**Dev Frontend 1**

- [ ] UI création USER (formulaire champs étudiants)
- [ ] UI liste UTILISATEURS avec filtres TanStack Table
- [ ] Modal upload PDF + bouton "Promouvoir BENEVOLE"

**Dev Frontend 2**

- [ ] UI Profil utilisateur (champs étudiants en lecture/édition)

**Toute l'équipe**

- [ ] Tests fonctionnels Sprint 2

---

### Sprint 3 — Présence avec Places & Grille Tables/Sièges (2 semaines)

**Dev Backend 1**

- [ ] Server Actions : CRUD `Seat` (table + numéro siège, assignation user)
- [ ] Server Actions : CRUD `Attendance` (pointage avec place, filtre calendrier)

**Dev Backend 2**

- [ ] Contrainte : un siège = un user unique (`@@unique`)
- [ ] Calcul présence par jour/semaine/mois

**Dev Frontend 1**

- [ ] UI grille Tables/Sièges (visualisation des places)
- [ ] UI pointage avec sélection de place (table + siège)
- [ ] UI filtre calendrier (jour/semaine/mois)

**Dev Frontend 2**

- [ ] UI historique présence personnel (USER)

**Toute l'équipe**

- [ ] Tests fonctionnels Sprint 3

---

### Sprint 4 — Admin : Observation Mensuelle & Liste Crédit (2 semaines)

**Dev Backend 1**

- [ ] API Liste Crédit (ajout/consultation/calcul cumulé)

**Dev Backend 2**

- [ ] API Observation mensuelle (CRUD)
- [ ] Export simple (PDF/CSV) des crédits (optionnel)

**Dev Frontend 1**

- [ ] UI Observation par mois (formulaire + historique)
- [ ] UI Liste Crédit (tableau + total par bénévole)

**Toute l'équipe**

- [ ] Tests fonctionnels Sprint 4

---

### Sprint 5 — Public : Activité & Partage (2 semaines)

**Dev Backend 1**

- [ ] API Partage (CRUD, publication)

**Dev Backend 2**

- [ ] API Activité (CRUD, publication)

**Dev Frontend 1**

- [ ] Interface admin pour publier/modérer Activités & Partages

**Dev Frontend 2**

- [ ] UI Page publique "Activités" (liste + détail)
- [ ] UI Page publique "Partage" (liste + détail)
- [ ] Optimisation images (next/image)

---

### Sprint 6 — Public : Témoignage & Finalisation PWA (2 semaines)

**Dev Backend 2**

- [ ] API Témoignage (soumission + modération)

**Dev Frontend 2**

- [ ] UI Page publique "Témoignages"
- [ ] Formulaire de soumission de témoignage (public)
- [ ] Finaliser PWA : installabilité, icônes, splash screen
- [ ] Mode offline (cache des pages publiques)

**Lead**

- [ ] Audit Lighthouse (perf, accessibilité, PWA)

**Toute l'équipe**

- [ ] Tests globaux + corrections de bugs

---

### Sprint 7 — Mise en production (1 semaine)

**Lead**

- [ ] Configuration environnement de production
- [ ] Migration base de données production
- [ ] Déploiement final + nom de domaine

**Toute l'équipe**

- [ ] Vérification finale (checklist PWA + sécurité)

**Lead**

- [ ] Formation/passation aux utilisateurs finaux

---

## 6. Règles de suivi

- Chaque membre coche ses propres tâches (`- [ ]` → `- [x]`) directement dans ce fichier, dans son commit
- Une tâche cochée doit correspondre à un commit/PR associé
- Le **Lead** relit et valide en revue de code avant de considérer un sprint clos
- Stand-up court recommandé 2x/semaine pour passer en revue les cases cochées

---

## 7. Prochaines étapes

1. Valider ce CDC avec l'équipe
2. Décider si on ajoute la page interne `/admin/sprints` (Sprint 0) ou si le suivi reste dans ce fichier
3. Lancer le Sprint 0

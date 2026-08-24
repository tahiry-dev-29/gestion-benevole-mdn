# Gestion Bénévole — Maison du Numérique

Application de gestion des bénévoles pour la **Maison du Numérique (MDN) Madagascar**. PWA installable, responsive, utilisable partiellement hors-ligne.

**Objectif :** Centraliser la gestion des bénévoles (présence, suivi, crédits) et offrir une vitrine publique de leurs activités, partages et témoignages.

---

## Stack Technique

| Composant           | Technologie                                        |
| ------------------- | -------------------------------------------------- |
| **Framework**       | Next.js 16.2.11 (App Router, Server Components)    |
| **Language**        | TypeScript 5, React 19.2.4                         |
| **Styling**         | Tailwind CSS v4, shadcn/ui, lucide-react           |
| **Base de données** | PostgreSQL + Prisma 7 ORM                          |
| **Auth**            | NextAuth.js v4 (credentials, rôles ADMIN/BENEVOLE) |
| **State/Query**     | TanStack Query v5, React Hook Form + Zod           |
| **PWA**             | @ducanh2912/next-pwa (service worker, manifest)    |
| **Quality**         | ESLint 9, Prettier, Husky, lint-staged             |

---

## Architecture

Architecture **feature-driven** (domain-driven) avec séparation claire entre routing et logique métier :

```
app/                    → Routing (Next.js App Router)
src/                    → Logique métier (features, components, lib)
prisma/                 → Schema BDD + migrations + seed
```

### Diagramme d'architecture

```mermaid
flowchart TB
    subgraph Frontend["Frontend (Next.js)"]
        UI[shadcn/ui + Tailwind]
        RC[React Components]
        RQ[TanStack Query]
    end

    subgraph Backend["Backend (Next.js API)"]
        API[API Routes]
        Auth[NextAuth.js]
        SA[Server Actions]
    end

    subgraph Data["Data Layer"]
        Prisma[Prisma ORM]
        PG[(PostgreSQL)]
    end

    UI --> RC --> RQ
    RQ --> API
    RQ --> SA
    API --> Auth
    API --> Prisma
    SA --> Prisma
    Prisma --> PG
```

### Modèle de Données (ERD)

```mermaid
erDiagram
    USER ||--o{ PRESENCE : effectue
    USER ||--o{ OBSERVATION : recoit
    USER ||--o{ CREDIT : cumule
    USER ||--o{ ACTIVITE : publie
    USER ||--o{ PARTAGE : publie
    USER ||--o{ TEMOIGNAGE : redige

    USER {
        int id PK
        string nom
        string prenom
        string email
        string role
        date date_entree
    }
    PRESENCE {
        int id PK
        int user_id FK
        date date
        time heure_arrivee
        time heure_depart
        string statut
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
        string nom_auteur
        string contenu
        string statut
    }
```

---

## Getting Started

### Prérequis

| Outil          | Version requise | Vérifier         |
| -------------- | --------------- | ---------------- |
| **Node.js**    | ≥ 18            | `node -v`        |
| **pnpm**       | ≥ 9             | `pnpm -v`        |
| **PostgreSQL** | ≥ 14            | `psql --version` |

### Installation

```bash
# 1. Cloner le repo
git clone https://github.com/tahiry-dev-29/gestion-benevole-mdn.git
cd gestion-benevole-mdn

# 2. Installer les dépendances
pnpm install

# 3. Configurer la base de données (voir section suivante)

# 4. Lancer le serveur dev
pnpm dev
```

### Configuration de la Base de Données

#### 1. Créer la base PostgreSQL

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE gestion_benevole;

# Créer un utilisateur dédié (optionnel mais recommandé)
CREATE USER gestio_benevole WITH PASSWORD 'votre_mot_de_passe';

# Donner les privilèges
GRANT ALL PRIVILEGES ON DATABASE gestion_benevole TO gestio_benevole;

# Quitter psql
\q
```

#### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Remplir le fichier `.env` :

```env
# Base de données
DATABASE_URL="postgresql://gestio_benevole:votre_mot_de_passe@localhost:5432/gestion_benevole?schema=public"

# Shadow database (pour les migrations Prisma)
SHADOW_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generer-un-secret-ici"

# Environnement
NODE_ENV="development"
```

#### 3. Initialiser la base avec Prisma

```bash
# Appliquer le schéma à la base (crée les tables)
pnpm prisma:db:push

# OU créer une migration formelle
pnpm prisma:migrate --name init

# Générer le client Prisma
pnpm prisma:generate

# Remplir la base avec les données de test (admin + bénévole)
pnpm prisma:db:seed
```

#### 4. Vérifier (optionnel)

```bash
# Ouvrir l'interface graphique Prisma
pnpm prisma:studio
```

---

## Project Structure

```
├── app/                              # Next.js App Router (routing)
│   ├── layout.tsx                    # Layout global + providers
│   ├── page.tsx                      # Page d'accueil
│   ├── globals.css                   # Styles globaux + Tailwind
│   ├── api/                          # API Routes
│   │   ├── activites/[id]/route.ts
│   │   └── benevoles/[id]/route.ts
│   └── admin/                        # Pages admin protégées
│       ├── layout.tsx                # Layout admin + sidebar
│       ├── page.tsx                  # Dashboard admin
│       ├── activites/
│       ├── benevoles/
│       ├── credits/
│       ├── observations/
│       ├── partages/
│       ├── presences/
│       ├── temoignages/
│       ├── users/
│       └── volunteers/
│
├── src/
│   ├── features/                     # Features verticales (domain-driven)
│   │   ├── activites/                # Gestion activités
│   │   │   ├── application/          # Schemas Zod (validation)
│   │   │   ├── domain/               # Entités, types, interfaces
│   │   │   ├── infrastructure/       # Repository Prisma
│   │   │   └── presentation/         # Composants UI
│   │   ├── benevoles/                # Gestion bénévoles
│   │   ├── admin/                    # Composants admin partagés
│   │   ├── contact/                  # Formulaire contact
│   │   └── user/                     # User dropdown, liste, actions
│   │
│   ├── components/                   # Composants globaux réutilisables
│   │   ├── ui/                       # Primitives shadcn/ui
│   │   ├── svg/                      # Icônes SVG
│   │   └── utils/                    # Micro-composants utilitaires
│   │
│   ├── lib/                          # Configurations externes
│   │   ├── prisma.ts                 # Client Prisma singleton
│   │   ├── env.ts                    # Validation env (Zod)
│   │   └── utils.ts                  # Helpers (cn, etc.)
│   │
│   └── hooks/                        # Custom hooks transversaux
│
├── prisma/
│   ├── schema.prisma                 # Schéma BDD
│   ├── seed.ts                       # Seed DB (1 ADMIN + 1 BENEVOLE)
│   └── migrations/
│
├── public/                           # Assets statiques + PWA manifest
├── todos/sprints/                    # Roadmap & sprints (Markdown)
└── .github/workflows/                # CI/CD
```

---

## Key Features

### Espace Admin (Bénévole authentifié)

| Fonctionnalité             | Description                                               |
| -------------------------- | --------------------------------------------------------- |
| **Info perso**             | Fiche bénévole (nom, contact, rôle, photo, date d'entrée) |
| **Présence journalière**   | Pointage quotidien (arrivée/départ)                       |
| **Observation mensuelle**  | Note ou observation mensuelle par bénévole                |
| **Liste Crédit**           | Suivi des crédits/heures accumulés par bénévole           |
| **Gestion activités**      | CRUD activités publiques                                  |
| **Gestion partages**       | CRUD partages/ressources                                  |
| **Modération témoignages** | Validation des témoignages (EN_ATTENTE/VALIDE/REJETE)     |

### Espace Public

| Fonctionnalité  | Description                                     |
| --------------- | ----------------------------------------------- |
| **Activités**   | Liste/actualité des activités menées            |
| **Partages**    | Publications/contenus partagés par la structure |
| **Témoignages** | Témoignages de bénévoles ou bénéficiaires       |
| **PWA**         | Installable, responsive, mode offline partiel   |

---

## Commandes Disponibles

```bash
# Développement
pnpm dev                          # Lance le serveur dev (Turbopack)

# Build & Production
pnpm build                        # prisma generate + next build
pnpm build:prod                   # prisma migrate deploy + generate + build
pnpm start                        # Lance le serveur de production

# Base de données
pnpm prisma:generate              # Génère le client Prisma
pnpm prisma:migrate               # Crée/applique migrations (dev)
pnpm prisma:migrate:deploy        # Applique migrations (prod)
pnpm prisma:db:push               # Push schema sans migration
pnpm prisma:db:seed               # Seed la DB (admin@benevol.local / admin123)
pnpm prisma:studio                # Interface graphique Prisma

# Qualité
pnpm lint                         # ESLint
pnpm lint:fix                     # ESLint --fix
pnpm typecheck                    # TypeScript --noEmit
pnpm format                       # Prettier --write
pnpm format:check                 # Prettier --check

# Utilitaires
pnpm prepare                      # Installe Husky hooks
```

---

## Comptes de Test (après seed)

| Rôle     | Email                  | Mot de passe |
| -------- | ---------------------- | ------------ |
| ADMIN    | admin@benevol.local    | admin123     |
| BENEVOLE | benevole@benevol.local | benevole123  |

---

## Development Workflow

### Branching Strategy

```
main        ← code de production (stable)
  └── dev   ← code en développement
       └── feature/*   ← fonctionnalités en cours
```

### Processus

1. Créer une branche `feature/*` depuis `dev`
2. Développer avec commits conventionnels (`feat:`, `fix:`, `chore:`)
3. PR vers `dev` → revue Lead obligatoire
4. Merge squash après validation

### Sprints

| Sprint | Périmètre                     | Durée | Statut      |
| ------ | ----------------------------- | ----- | ----------- |
| 0      | Initialisation & Setup        | 1 sem | ✅ Terminé  |
| 1      | Authentification & Fondations | 2 sem | 🔵 En cours |
| 2      | Admin : Info perso & Présence | 2 sem | ⚪ À venir  |
| 3      | Admin : Observation & Crédits | 2 sem | ⚪ À venir  |
| 4      | Public : Activité & Partage   | 2 sem | ⚪ À venir  |
| 5      | Public : Témoignage & PWA     | 2 sem | ⚪ À venir  |
| 6      | Mise en production            | 1 sem | ⚪ À venir  |

Détails : [`todos/sprints/ROADMAP.md`](todos/sprints/ROADMAP.md)

---

## Coding Standards

- **TypeScript strict** : pas de `any`, types explicites
- **Server Components** par défaut, `"use client"` uniquement si nécessaire
- **Features verticales** : chaque feature est auto-contenue (domain, infrastructure, presentation)
- **Validation** : schemas Zod pour tous les formulaires et inputs
- **Styling** : Tailwind CSS + shadcn/ui, pas de CSS inline
- **Commits** : conventionnels (`feat:`, `fix:`, `chore:`, `docs:`)
- **Linting** : ESLint 9 + Prettier, hooks Husky pre-commit

---

## Testing

> ⚠️ Framework de test non encore configuré. Prévu dans la roadmap.

Quand configuré, les tests seront lancés avec :

```bash
pnpm test          # Unit tests
pnpm test:e2e      # End-to-end tests
```

---

## Contributing

1. **Fork** le repo
2. **Créer une branche** `feature/*` depuis `dev`
3. **Commits conventionnels** : `feat:`, `fix:`, `chore:`, `docs:`
4. **PR vers `dev`** → description claire des changements
5. **Revue Lead** obligatoire avant merge
6. **Merge squash** après validation

### Règles de suivi

- Chaque membre coche ses tâches dans `todos/CDC_PWA_Gestion_Benevoles.md`
- Une tâche cochée doit correspondre à un commit/PR associé
- Stand-up court 2x/semaine

---

## Équipe

| Rôle              | Membre                 |
| ----------------- | ---------------------- |
| **Lead**          | @tahiry-dev-29         |
| **Dev Backend 1** | @flavienrandria81      |
| **Dev Backend 2** | @HunjanRakotoarison    |
| **Dev Frontend**  | @rasoarimanana71-maker |

---

## License

Ce projet est la propriété de la **Maison du Numérique (MDN) Madagascar**.

Licence MIT — Usage libre pour les projets de la MDN et ses partenaires.

```
MIT License

Copyright (c) 2025 Maison du Numérique Madagascar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

**Maison du Numérique — Madagascar** 🇲🇬

# Gestion Bénévole — Maison du Numérique

Application de gestion des bénévoles pour la Maison du Numérique. Construite avec Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Prisma ORM (PostgreSQL), et NextAuth.js.

## 🚀 Stack Technique

| Layer | Technologies |
|-------|--------------|
| **Framework** | Next.js 16.2.11 (App Router, Server Components) |
| **Language** | TypeScript 5, React 19.2.4 |
| **Styling** | Tailwind CSS v4, shadcn/ui, lucide-react |
| **Database** | PostgreSQL + Prisma 7 ORM |
| **Auth** | NextAuth.js v4 (credentials, rôles ADMIN/BENEVOLE) |
| **State/Query** | TanStack Query (React Query) v5, React Hook Form + Zod |
| **PWA** | @ducanh2912/next-pwa (service worker, manifest) |
| **Quality** | ESLint 9, Prettier, Husky, lint-staged, TypeScript strict |

## 📁 Structure du Projet

```
├── app/                          # Next.js App Router (routing)
│   ├── layout.tsx                # Layout global + providers
│   ├── page.tsx                  # Page d'accueil
│   ├── globals.css               # Styles globaux + Tailwind
│   ├── api/                      # API Routes
│   │   ├── activites/[id]/route.ts
│   │   └── benevoles/[id]/route.ts
│   └── admin/                    # Pages admin protégées
│       ├── layout.tsx            # Layout admin + sidebar
│       ├── page.tsx              # Dashboard admin
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
│   ├── features/                 # Features verticales (domain-driven)
│   │   ├── activites/            # Gestion activités
│   │   │   ├── application/      # Schemas Zod (validation)
│   │   │   ├── domain/           # Entités, types, interfaces
│   │   │   ├── infrastructure/   # Repository Prisma
│   │   │   └── presentation/     # Composants UI
│   │   ├── benevoles/            # Gestion bénévoles
│   │   ├── admin/                # Composants admin partagés
│   │   ├── contact/              # Formulaire contact
│   │   └── user/                 # User dropdown, liste, actions
│   │
│   ├── components/               # Composants globaux réutilisables
│   │   ├── ui/                   # Primitives shadcn/ui
│   │   ├── svg/                  # Icônes SVG
│   │   └── utils/                # Micro-composants utilitaires
│   │
│   ├── lib/                      # Configurations externes
│   │   ├── prisma.ts             # Client Prisma singleton
│   │   ├── env.ts                # Validation env (Zod)
│   │   └── utils.ts              # Helpers (cn, etc.)
│   │
│   └── hooks/                    # Custom hooks transversaux
│
├── prisma/
│   ├── schema.prisma             # Schéma BDD (User, Presence, Observation, Credit, Activite, Partage, Temoignage)
│   ├── seed.ts                   # Seed DB (1 ADMIN + 1 BENEVOLE)
│   └── migrations/
│
├── public/                       # Assets statiques + PWA manifest
├── todos/sprints/                # Roadmap & sprints (Markdown)
└── .github/workflows/            # CI/CD (à configurer)
```

## 🛠️ Commandes Disponibles

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

## 🔐 Comptes de Test (après seed)

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| ADMIN | admin@benevol.local | admin123 |
| BENEVOLE | benevole@benevol.local | benevole123 |

## 🗄️ Modèle de Données (Prisma)

- **User** : bénévoles & admins (nom, prénom, email, password hash, rôle, photo, date_entrée)
- **Presence** : pointage quotidien (arrivée, départ, statut)
- **Observation** : note mensuelle par bénévole
- **Credit** : cumul heures/crédits avec motif
- **Activite** : activités publiques (titre, description, date, auteur optionnel)
- **Partage** : partages/ressources publics
- **Temoignage** : témoignages avec modération (EN_ATTENTE/VALIDE/REJETE)

## 📦 Roadmap des Sprints

| Sprint | Périmètre | Durée | Statut |
|--------|-----------|-------|--------|
| 0 | Initialisation & Setup | 1 sem | 🔵 En cours |
| 1 | Authentification & Fondations | 2 sem | ⚪ À venir |
| 2 | Admin : Info perso & Présence | 2 sem | ⚪ À venir |
| 3 | Admin : Observation & Crédits | 2 sem | ⚪ À venir |
| 4 | Public : Activité & Partage | 2 sem | ⚪ À venir |
| 5 | Public : Témoignage & PWA | 2 sem | ⚪ À venir |
| 6 | Mise en production | 1 sem | ⚪ À venir |

Détails : [`todos/sprints/ROADMAP.md`](todos/sprints/ROADMAP.md)

## 🌐 Variables d'Environnement

Copier `.env.example` vers `.env` et remplir :

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/gestion_benevole"
SHADOW_DATABASE_URL="postgresql://user:pass@localhost:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-securise"
NODE_ENV="development"
```

## 🚢 Déploiement

- **Vercel** (recommandé) : connecter le repo, configurer `DATABASE_URL` (Neon/Supabase) + secrets
- **Docker** : `Dockerfile` multi-stage (à créer)
- **PWA** : `next-pwa` génère manifest + SW automatiquement en prod

## 📋 CI/CD (à configurer - Sprint 0.8)

- `.github/workflows/ci.yml` : install → lint → typecheck → build
- `.github/workflows/deploy.yml` : preview PR + deploy main

## 🤝 Contribution

1. Créer une branche feature depuis `dev`
2. Commits conventionnels (`feat:`, `fix:`, `chore:`)
3. PR vers `dev` → revue Lead obligatoire
4. Merge squash après validation

---

**Équipe CDC** : Lead @tahiry-dev-29 · Back1 @flavienrandria81 · Back2/Front @HunjanRakotoarison · Front @rasoarimanana71-maker
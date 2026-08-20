<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Next.js and React Folder Structure Rules

Target folder structure guidelines for this application:

```
├── src/app/                         # DOSSIER DE ROUTING (Next.js App Router)
│   ├── layout.tsx                    # Layout global de l'application
│   ├── page.tsx                      # Page d'accueil racine
│   ├── dashboard/
│   │   ├── page.tsx                  # Page Dashboard
│   │   ├── dashboard-header.tsx      # Composant local (Colocation)
│   │   ├── dashboard-content.tsx     # Composant local (Colocation)
│   │   └── _components/              # Dossier privé masqué du routing Next.js
│   │       └── local-chart.tsx
│   └── organizations/                # Structure multi-tenant
│       └── [orgId]/
│           ├── layout.tsx            # Layout spécifique à l'organisation
│           └── page.tsx
│
├── src/                              # DOSSIER SOURCES (Séparé du routing)
│   ├── features/                     # Logique métier verticale multi-pages
│   │   ├── user/                     # Feature isolée : Gestion utilisateur
│   │   │   ├── user-dropdown.tsx     # Composant partagé
│   │   │   ├── user-list.tsx         # Micro-composant réutilisable
│   │   │   ├── user.action.ts        # Server Actions
│   │   │   └── user.schema.ts        # Validation de schéma (Zod)
│   │   └── contact/                  # Feature isolée : Contact
│   │       ├── contact-form.tsx
│   │       ├── contact.action.ts
│   │       └── contact.schema.ts
│   │
│   ├── components/                   # Composants génériques globaux
│   │   ├── ui/                       # Primitives UI (Shadcn UI)
│   │   │   ├── button.tsx
│   │   │   └── accordion.tsx         # Composant autonome réutilisable partout
│   │   ├── svg/                      # Fichiers SVG convertis en composants React
│   │   │   └── logo.tsx
│   │   └── utils/                    # Micro-composants utilitaires partagés
│   │
│   ├── lib/                          # Configurations de libs externes
│   │   ├── prisma.ts                 # Instance du client Prisma ORM
│   │   └── env.ts                    # Validation des variables d'environnement
│   │
│   └── hooks/                        # Custom hooks transversaux
│       └── use-media-query.ts
```

<!-- END:nextjs-agent-rules -->

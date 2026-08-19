# Sprint 0 & Project Roadmap — Gestion Bénévole (Maison du Numérique)

> Ancien `todos/sprint_0.md` — migré ici et enrichi. Le détail des tâches de chaque sprint vit dans son dossier `sprints/sprint-N/TODO.md`.

## 📌 Équipe & Collaborateurs GitHub

| #               | Compte GitHub            | Rôle CDC (à confirmer au Sprint Planning 1) |
| --------------- | ------------------------ | ------------------------------------------- |
| Lead            | `@tahiry-dev-29`         | Lead                                        |
| Collaborateur 1 | `@flavienrandria81`      | Backend 1 ou Frontend 1                     |
| Collaborateur 2 | `@HunjanRakotoarison`    | Backend 2 ou Frontend 2                     |
| Collaborateur 3 | `@rasoarimanana71-maker` | Frontend 1 ou 2                             |

## 🗓️ Roadmap des Sprints

| Sprint | Périmètre                                    | Durée      | Statut                          | Backlog Scrum                                                                                                                          |
| ------ | -------------------------------------------- | ---------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 0      | Initialisation & Setup                       | 1 semaine  | 🔵 En cours (2 cases restantes) | [sprint-0/sprint-0-initialisation-et-setup.md](./sprint-0/sprint-0-initialisation-et-setup.md)                                         |
| 1      | Authentification & Fondations                | 2 semaines | ⚪ À venir                      | [sprint-1/sprint-1-authentification-et-fondations.md](./sprint-1/sprint-1-authentification-et-fondations.md)                           |
| 2      | Admin : Info perso & Présence journalière    | 2 semaines | ⚪ À venir                      | [sprint-2/sprint-2-admin-info-perso-et-presence-journaliere.md](./sprint-2/sprint-2-admin-info-perso-et-presence-journaliere.md)       |
| 3      | Admin : Observation mensuelle & Liste Crédit | 2 semaines | ⚪ À venir                      | [sprint-3/sprint-3-admin-observation-mensuelle-et-liste-credit.md](./sprint-3/sprint-3-admin-observation-mensuelle-et-liste-credit.md) |
| 4      | Public : Activité & Partage                  | 2 semaines | ⚪ À venir                      | [sprint-4/sprint-4-public-activite-et-partage.md](./sprint-4/sprint-4-public-activite-et-partage.md)                                   |
| 5      | Public : Témoignage & Finalisation PWA       | 2 semaines | ⚪ À venir                      | [sprint-5/sprint-5-public-temoignage-et-finalisation-pwa.md](./sprint-5/sprint-5-public-temoignage-et-finalisation-pwa.md)             |
| 6      | Mise en production                           | 1 semaine  | ⚪ À venir                      | [sprint-6/sprint-6-mise-en-production.md](./sprint-6/sprint-6-mise-en-production.md)                                                   |

## ✅ Sprint 0 — état des lieux (checklist migrée)

- [x] Initialiser le dépôt GitHub `gestion-benevole-mdn` + ajouter les 3 collaborateurs
- [x] Initialiser l'application Next.js (App Router, TypeScript) avec `pnpm`
- [x] Configurer Tailwind CSS v4 + `shadcn UI`
- [x] Configurer PostgreSQL + Prisma (Modèles User, Presence, Observation, Credit, Activite, Partage, Temoignage)
- [x] Configurer variables d'environnement (`.env.example`)
- [x] Configurer PWA (web manifest + service worker `next-pwa`)
- [ ] Mettre en place l'hébergement (Vercel/VPS + DB managée)
- [ ] Configurer CI/CD GitHub Actions (build/lint)
- [ ] (Optionnel) Créer la page interne `/admin/sprints` pour le suivi des tâches

> Les cases restantes sont détaillées dans [`sprint-0/sprint-0-initialisation-et-setup.md`](./sprint-0/sprint-0-initialisation-et-setup.md).

## 📋 Périmètre global (rappel CDC §2)

| Module              | Détail                                                    | Sprints |
| ------------------- | --------------------------------------------------------- | ------- |
| Utilisateur / Auth  | login, register, logout, rôles ADMIN/BENEVOLE, middleware | 1       |
| Bénévole (Admin)    | fiche info perso, photo, date d'entrée                    | 2       |
| Présence (Admin)    | pointage arrivée/départ, historique, statut               | 2       |
| Observation (Admin) | note mensuelle par bénévole                               | 3       |
| Crédit (Admin)      | cumul heures/crédits, totaux, export optionnel            | 3       |
| Activité (Public)   | liste + détail, publication admin                         | 4       |
| Partage (Public)    | liste + détail, publication admin                         | 4       |
| Témoignage (Public) | soumission + modération                                   | 5       |
| PWA                 | manifest, offline, installabilité, Lighthouse             | 0, 1, 5 |
| Prod                | DB, déploiement, domaine, passation                       | 6       |

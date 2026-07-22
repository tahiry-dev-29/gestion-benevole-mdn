# Sprint 0 & Project Roadmap — Gestion Bénévole (Maison du Numérique)

## 📌 Équipe & Collaborateurs GitHub
- **Lead** : `@tahiry-dev-29`
- **Collaborateur 1** : `@flavienrandria81`
- **Collaborateur 2** : `@HunjanRakotoarison`
- **Collaborateur 3** : `@rasoarimanana71-maker`

---

## 🚀 Sprint 0 — Initialisation & Setup (1 semaine)
- [x] Initialiser le dépôt GitHub `gestion-benevole-mdn` + ajouter les 3 collaborateurs
- [x] Initialiser l'application Next.js (App Router, TypeScript) avec `pnpm`
- [x] Configurer Tailwind CSS v4 + `shadcn UI`
- [x] Configurer PostgreSQL + Prisma (Modèles User, Presence, Observation, Credit, Activite, Partage, Temoignage)
- [x] Configurer variables d'environnement (`.env.example`)
- [x] Configurer PWA (web manifest + service worker `next-pwa`)
- [ ] Mettre en place l'hébergement (Vercel/VPS + DB managée)
- [ ] Configurer CI/CD GitHub Actions (build/lint)
- [ ] (Optionnel) Créer la page interne `/admin/sprints` pour le suivi des tâches

---

## 🗓️ Roadmap des Sprints Suivants

### Sprint 1 — Authentification & Fondations (2 semaines)
- **Dev Backend 1** : Finaliser migrations Prisma & API Auth (login/register/logout)
- **Dev Backend 2** : Middleware protection des routes Admin & Rôles (ADMIN/BENEVOLE)
- **Dev Frontend 1** : UI Page de connexion & Layout Admin (sidebar/navbar)
- **Dev Frontend 2** : Layout Public (header/footer) & Service worker shell

### Sprint 2 — Admin : Info perso & Présence Journalière (2 semaines)
- **Dev Backend 1** : API CRUD "Info perso" & Upload photo
- **Dev Backend 2** : API Présence journalière (pointage)
- **Dev Frontend 1** : UI Fiche "Info perso" & UI Présence journalière (pointage/historique)

### Sprint 3 — Admin : Observation Mensuelle & Liste Crédit (2 semaines)
- **Dev Backend 1** : API Liste Crédit (calculs & cumul)
- **Dev Backend 2** : API Observation mensuelle (CRUD)
- **Dev Frontend 1** : UI Observation par mois & UI Liste Crédit

### Sprint 4 — Public : Activité & Partage (2 semaines)
- **Dev Backend 1** : API Partage (CRUD/publication)
- **Dev Backend 2** : API Activité (CRUD/publication)
- **Dev Frontend 1** : Admin Modération Activités & Partages
- **Dev Frontend 2** : UI Pages publiques Activités & Partages + Next Image Optimization

### Sprint 5 — Public : Témoignage & Finalisation PWA (2 semaines)
- **Dev Backend 2** : API Témoignage (soumission/modération)
- **Dev Frontend 2** : UI Page Témoignages + PWA Offline Mode + Installabilité
- **Lead** : Audit Lighthouse (perf, PWA, accessibilité)

### Sprint 6 — Mise en production (1 semaine)
- **Lead** : Prod DB migration, Vercel deployment, Domaine configuration, Passation

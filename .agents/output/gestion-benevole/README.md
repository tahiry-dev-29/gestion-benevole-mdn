# 🗂️ Plan & Sprints — Gestion Bénévole (Maison du Numérique)

> Ce dossier **remplace l'ancien `todos/`** (migré le 2026-10-01). Tout le suivi du projet est versionné ici, avec la mémoire `thr-up` : cadrage → conception → tâches → exécution.

## 📚 Documents

| Document | Fichier | Rôle |
| -------- | ------- | ---- |
| Idée / concept | [`idea.md`](./idea.md) | Pourquoi ce produit, valeur ajoutée |
| Discovery / interview | [`discovery.md`](./discovery.md) | Décisions d'entretien, contraintes, questions ouvertes |
| PRD (V1) | [`prd.md`](./prd.md) | Scope exact : ce que la V1 fait / ne fait pas |
| Architecture | [`archi.md`](./archi.md) | Modèle de données, RBAC, routes, modules |
| Roadmap & sprints | [`ROADMAP.md`](./ROADMAP.md) | Vue d'ensemble des 10 sprints + règles de suivi |
| Cahier des charges | [`references/CDC_PWA_Gestion_Benevoles.md`](./references/CDC_PWA_Gestion_Benevoles.md) | Référence historique (§2.0–2.2 partiellement supersedé par le PRD) |
| Stack & contraintes | [`../../rules/stack.md`](../../rules/stack.md) | Stack technique + règles de code |
| Décisions | [`../../memory/decisions.md`](../../memory/decisions.md) | Journal append-only des décisions d'archi |
| État des tâches 01–17 | [`tasks/STATUS-01-17.md`](./tasks/STATUS-01-17.md) | Statuts actuels, preuves locales et prochains critères ouverts |

## 📊 Tableau de bord des sprints

| Sprint | Backlog | Statut |
| ------ | ------- | ------ |
| 0 — Init & Setup | [`tasks/00_sprint0_init.md`](./tasks/00_sprint0_init.md) | ✅ Terminé |
| 1 — Auth & RBAC | [`tasks/01_sprint1_auth_rbac.md`](./tasks/01_sprint1_auth_rbac.md) | ✅ Terminé |
| 2 — Volunteer Management | [`tasks/02_sprint2_volunteer_management.md`](./tasks/02_sprint2_volunteer_management.md) | ✅ Terminé |
| 3 — Users & conversion | [`tasks/03_sprint3_users_conversion.md`](./tasks/03_sprint3_users_conversion.md) | 🟡 En cours — critères historiques à finir |
| 4 — Présence & Places | [`tasks/04_sprint4_presence_places.md`](./tasks/04_sprint4_presence_places.md) | ✅ Terminé; suivi de reprise en tâche 13 |
| 5 — Import/Export Excel | [`tasks/05_sprint5_excel_import_export.md`](./tasks/05_sprint5_excel_import_export.md) | 🟡 En cours — round-trip et UI |
| 6 — Observations & Crédits | [`tasks/06_sprint6_obs_credit.md`](./tasks/06_sprint6_obs_credit.md) | ✅ Terminé; suivi de reprise en tâche 15 |
| 7 — Activités & Partages | [`tasks/07_sprint7_activite_partage.md`](./tasks/07_sprint7_activite_partage.md) | 🟡 En cours — E2E API réussi, parcours admin UI à compléter |
| 8 — Témoignages & PWA | [`tasks/08_sprint8_temoignage_pwa.md`](./tasks/08_sprint8_temoignage_pwa.md) | 🟡 En cours — runtime SW/appareils à vérifier |
| 9 — Mise en production | [`tasks/09_sprint9_production.md`](./tasks/09_sprint9_production.md) | 🟡 En attente des accès externes de production |

## ▶️ Workflow

```
thr-plan  → idea.md / discovery.md / prd.md        ✅ fait
thr-archi → archi.md                                ✅ fait
thr-tasks → tasks/NN_*.md                           ✅ fait (10 sprints)
thr-dev   → exécute tasks/NN_*.md dans l'ordre      ⚪ prochaine étape (sprint 1)
```

L'exécution produit est en cours. Reprendre par [`tasks/STATUS-01-17.md`](./tasks/STATUS-01-17.md), puis poursuivre les critères ouverts dans chaque fichier; ne pas relancer le sprint 1.

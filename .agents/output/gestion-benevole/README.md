# 🗂️ Plan & Sprints — Gestion Bénévole (Maison du Numérique)

> Ce dossier **remplace l'ancien `todos/`** (migré le 2026-10-01). Tout le suivi du projet est versionné ici, avec la mémoire `thr-up` : cadrage → conception → tâches → exécution.

## 📚 Documents

| Document | Fichier | Rôle |
| -------- | ------- | ---- |
| Idée / concept | [`idea.md`](./idea.md) | Pourquoi ce produit, valeur ajoutée |
| Discovery / interview | [`discovery.md`](./discovery.md) | Décisions d'entretien, contraintes, questions ouvertes |
| PRD (V1) | [`prd.md`](./prd.md) | Scope exact : ce que la V1 fait / ne fait pas |
| Architecture | [`archi.md`](./archi.md) | Modèle de données, RBAC, routes, modules, design system |
| Roadmap & sprints | [`ROADMAP.md`](./ROADMAP.md) | Vue d'ensemble des 10 sprints + règles de suivi |
| Cahier des charges | [`references/CDC_PWA_Gestion_Benevoles.md`](./references/CDC_PWA_Gestion_Benevoles.md) | Référence historique (§2.0–2.2 partiellement supersedé par le PRD) |
| Stack & contraintes | [`../../rules/stack.md`](../../rules/stack.md) | Stack technique + règles de code |
| Décisions | [`../../memory/decisions.md`](../../memory/decisions.md) | Journal append-only des décisions d'archi |
| **Plan-001** | [`plans/plan-001_sprints_00_08_functional_ux.md`](./plans/plan-001_sprints_00_08_functional_ux.md) | Remise en état fonctionnelle sprints 0–8 |
| **Plan-002** | [`plans/plan-002_design_system_ui_refonte.md`](./plans/plan-002_design_system_ui_refonte.md) | Refonte Design System Glass Liquid Blue + UI/UX toutes pages |
| **État des tâches (canonique)** | [`tasks/TASK-STATUS.md`](./tasks/TASK-STATUS.md) | Index unifié de toutes les tâches (plan-001 + plan-002) |
| ~~État des tâches 01–17~~ | [`.archives/tasks/STATUS-01-17.md`](.archives/tasks/STATUS-01-17.md) | _Historique — fusionné dans TASK-STATUS.md_ |


## 📊 Tableau de bord des sprints — plan-001

| Sprint | Backlog | Statut |
| ------ | ------- | ------ |
| 0 — Init & Setup | [`.archives/tasks/00_sprint0_init.md`](.archives/tasks/00_sprint0_init.md) | ✅ Terminé |
| 1 — Auth & RBAC | [`.archives/tasks/01_sprint1_auth_rbac.md`](.archives/tasks/01_sprint1_auth_rbac.md) | ✅ Terminé |
| 2 — Volunteer Management | [`.archives/tasks/02_sprint2_volunteer_management.md`](.archives/tasks/02_sprint2_volunteer_management.md) | ✅ Terminé |
| 3 — Users & conversion | [`.archives/tasks/03_sprint3_users_conversion.md`](.archives/tasks/03_sprint3_users_conversion.md) | ✅ Sprint clôturé — suivi repris en tâche 12 |
| 4 — Présence & Places | [`.archives/tasks/04_sprint4_presence_places.md`](.archives/tasks/04_sprint4_presence_places.md) | ✅ Terminé; suivi de reprise en tâche 13 |
| 5 — Import/Export Excel | [`.archives/tasks/05_sprint5_excel_import_export.md`](.archives/tasks/05_sprint5_excel_import_export.md) | ✅ Sprint clôturé — suivi repris en tâche 14 |
| 6 — Observations & Crédits | [`.archives/tasks/06_sprint6_obs_credit.md`](.archives/tasks/06_sprint6_obs_credit.md) | ✅ Terminé; suivi de reprise en tâche 15 |
| 7 — Activités & Partages | [`tasks/07_sprint7_activite_partage.md`](./tasks/07_sprint7_activite_partage.md) | 🟡 En cours — E2E API réussi, parcours admin UI à compléter |
| 8 — Témoignages & PWA | [`tasks/08_sprint8_temoignage_pwa.md`](./tasks/08_sprint8_temoignage_pwa.md) | 🟡 En cours — runtime SW/appareils à vérifier |
| 9 — Mise en production | [`tasks/09_sprint9_production.md`](./tasks/09_sprint9_production.md) | 🟡 En attente des accès externes de production |

## 🎨 Tableau de bord UI/UX — plan-002 (Design System Glass Liquid Blue)

| Tâche | Backlog | Statut |
| ----- | ------- | ------ |
| 19 — Design system & prérequis | [`tasks/19_design_system_glass.md`](./tasks/19_design_system_glass.md) | ⬜ TODO — `tabs` `breadcrumb` `popover` |
| 20 — Users UI refonte | [`tasks/20_users_ui_refonte.md`](./tasks/20_users_ui_refonte.md) | ⬜ TODO — scrollbar fix + filter + Tabs |
| 21 — Bénévoles UI refonte | [`tasks/21_volunteers_ui_refonte.md`](./tasks/21_volunteers_ui_refonte.md) | ⬜ TODO — Tabs + DropdownMenu + fiche |
| 22 — Présences UI refonte | [`tasks/22_presences_ui_refonte.md`](./tasks/22_presences_ui_refonte.md) | ⬜ TODO — Tabs Pointage/Historique/Stats |
| 23 — Activités, Crédits, Obs, Partages | [`tasks/23_activites_credits_ui.md`](./tasks/23_activites_credits_ui.md) | ⬜ TODO — Breadcrumb + DropdownMenu |
| 24 — Dashboard & Statistiques | [`tasks/24_dashboard_stats_ui.md`](./tasks/24_dashboard_stats_ui.md) | ⬜ TODO — StatCards + DataTable + Tabs |
| 25 — Observations, Partages, Places… | [`tasks/25_observations_partages_ui.md`](./tasks/25_observations_partages_ui.md) | ⬜ TODO — Breadcrumb + glass |

## ▶️ Workflow

```
plan-001 → thr-plan / thr-archi / thr-tasks / thr-dev   ✅ fait (sprints 0–8)
plan-002 → thr-plan (design) / thr-tasks (UI)            ✅ planifié (tâches 19–25)
thr-dev  → exécute tasks/19_*.md → 25_*.md dans l'ordre ⬜ prochaine étape
```

Reprendre par [`tasks/TASK-STATUS.md`](./tasks/TASK-STATUS.md) (index canonique unifié).
Pour les tâches plan-001 ouvertes : critères dans chaque fichier 12, 15, 17, 18.
Pour plan-002 : commencer par tâche 19 (prérequis), puis 20 (Users — priorité critique).

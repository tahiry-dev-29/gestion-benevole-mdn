# TASK-STATUS — Gestion Bénévole (toutes tâches)

> Index canonique de toutes les tâches du projet. Source : `STATUS-01-17.md` (plan-001) + `STATUS-19-25.md` (plan-002), archivés dans `.archives/tasks/`.
> Dernière mise à jour : 2026-10-05 — thr-memory -prune.

---

## Plan-001 — Remise en état fonctionnelle (Sprints 0–8)

Plan file: `../plans/plan-001_sprints_00_08_functional_ux.md`

| ID | Titre | Statut | Preuve / Prochain point |
|----|-------|--------|------------------------|
| 10 | Socle auth & RBAC | ✅ DONE · archivé | Tests rôle, matrice RBAC, CI seed locale → `.archives/tasks/10_foundation_auth.md` |
| 11 | Gestion bénévoles | ✅ DONE · archivé | UX moderne, CRUD sécurisé, fiche hero → `.archives/tasks/11_volunteer_management.md` |
| 12 | Gestion USER & conversion | 🟡 IN_PROGRESS | Création, PDF, modération prouvés. Reste : rapprochement PRD/champs, cas rejet, filtres exhaustifs |
| 13 | Présences & places | ✅ DONE · archivé | TanStack + filtre statut/place, 128 tests, navigateur 390px PASS → `.archives/tasks/13_presence_places.md` |
| 14 | Import/Export Excel | ✅ DONE · archivé | Round-trip XLSX USER + présences sur DB locale, 153 tests → `.archives/tasks/14_excel.md` |
| 15 | Crédits & observations | 🟡 IN_PROGRESS | Création UI prouvée. Reste : bornes/fuseau, filtres, invalidation Query |
| 16 | Activités & partages | ✅ DONE · archivé | Brouillon/publication/dépublication HTTP prouvés + admin DataTable/Query → `.archives/tasks/16_activities_shares.md` |
| 17 | Témoignages & PWA | 🟡 IN_PROGRESS | Soumission/modération/offline prouvés. Reste : appareils réels, cible tactile 44px |
| 18 | Validation E2E sprints 0–8 | 🟡 IN_PROGRESS | Dépend de 12, 15, 17 — non clôturé |

Tasks 07 (`07_sprint7_activite_partage.md`) et 08 (`08_sprint8_temoignage_pwa.md`) sont les
backlogs sprint d'origine, encore `IN_PROGRESS` et suivis via `TASK-STATUS` 16 et 17.

---

## Plan-002 — Refonte Design System UI/UX (tâches 19–25)

Plan file: `../plans/plan-002_design_system_ui_refonte.md`

| ID | Titre | Statut | Dépend de | Prochain point |
|----|-------|--------|-----------|---------------|
| 19 | Design system & prérequis globaux | ⬜ TODO | — | `npx shadcn@latest add tabs breadcrumb popover` + `AdminBreadcrumb` |
| 20 | Users UI refonte | ⬜ TODO | 19 | Fix scrollbar → Filter DropdownMenu → Tabs → Breadcrumb → DataTable → Analytics |
| 21 | Bénévoles UI refonte | ⬜ TODO | 19 | Tabs Liste/Rôles → DropdownMenu → DataTable → Fiche Tabs |
| 22 | Présences UI refonte | ⬜ TODO | 19 | Tabs Pointage/Historique/Stats → Breadcrumb |
| 23 | Activités, Crédits, Observations, Partages UI | ⬜ TODO | 19 | Breadcrumb + DropdownMenu filter + actions sur chaque section |
| 24 | Dashboard & Statistiques UI | ⬜ TODO | 19 | StatCards Card shadcn → DataTable → Breadcrumb → Tabs par domaine |
| 25 | Observations, Partages, Temoignages, Places, Sprints, Paramètres | ⬜ TODO | 19 | Breadcrumb + Dialogs + glass |

---

## Gaps structurels détectés (thr-memory -check 2026-10-05)

| Gap | Sévérité | Action |
|-----|----------|--------|
| `.agents/AGENT.md` absent | 🟡 Mineur | À créer (voir ci-dessous) |
| `STATUS-01-17.md` + `STATUS-19-25.md` → fusionnés dans ce `TASK-STATUS.md`, puis archivés | ✅ Réglé | Ce fichier est le canonique désormais ; sources dans `.archives/tasks/` |
| Tâches 00–09 (anciens sprints) : format sans `Status:` header | ✅ Réglé | 00–06 archivés dans `.archives/tasks/` (prune 2026-10-05) ; 07–09 restent en place |
| `/admin/activites` vs `/admin/activities` : doublon détecté | 🟠 À résoudre | Vérifier et documenter dans archi.md |

---

## Légende statuts

| Symbole | Statut | Signification |
|---------|--------|---------------|
| ✅ | DONE | Tous les critères prouvés |
| 🟡 | IN_PROGRESS | Partiellement prouvé, critères ouverts |
| ⬜ | TODO | Pas commencé |
| ❌ | BLOCKED | Bloqué par dépendance externe |


---

## Tâches archivées (prune 2026-10-05)

Déplacées — non supprimées — vers [`.archives/tasks/`](../.archives/tasks/). Plan lié conservé dans
[`../plans/plan-001_sprints_00_08_functional_ux.md`](../plans/plan-001_sprints_00_08_functional_ux.md).

| ID | Titre | Statut à l'archivage | Chemin | Suivi repris par |
|----|-------|----------------------|--------|-----------------|
| 0 | Sprint 0 — Initialisation & Setup | ✅ DONE | [`.archives/tasks/00_sprint0_init.md`](../.archives/tasks/00_sprint0_init.md) | 10 |
| 1 | Sprint 1 — Auth & RBAC | ✅ DONE | [`.archives/tasks/01_sprint1_auth_rbac.md`](../.archives/tasks/01_sprint1_auth_rbac.md) | 10 |
| 2 | Sprint 2 — Volunteer Management | ✅ DONE | [`.archives/tasks/02_sprint2_volunteer_management.md`](../.archives/tasks/02_sprint2_volunteer_management.md) | 11 |
| 3 | Sprint 3 — Users & conversion | ✅ DONE | [`.archives/tasks/03_sprint3_users_conversion.md`](../.archives/tasks/03_sprint3_users_conversion.md) | 12 (IN_PROGRESS) |
| 4 | Sprint 4 — Présence & Places | ✅ DONE | [`.archives/tasks/04_sprint4_presence_places.md`](../.archives/tasks/04_sprint4_presence_places.md) | 13 (DONE) |
| 5 | Sprint 5 — Import/Export Excel | ✅ DONE | [`.archives/tasks/05_sprint5_excel_import_export.md`](../.archives/tasks/05_sprint5_excel_import_export.md) | 14 (DONE, archivé) |
| 6 | Sprint 6 — Observations & Crédits | ✅ DONE | [`.archives/tasks/06_sprint6_obs_credit.md`](../.archives/tasks/06_sprint6_obs_credit.md) | 15 (IN_PROGRESS) |
| 10 | Socle auth & RBAC | ✅ DONE | [`.archives/tasks/10_foundation_auth.md`](../.archives/tasks/10_foundation_auth.md) | — clôturée |
| 11 | Gestion bénévoles | ✅ DONE | [`.archives/tasks/11_volunteer_management.md`](../.archives/tasks/11_volunteer_management.md) | — clôturée |
| 13 | Présences & places | ✅ DONE | [`.archives/tasks/13_presence_places.md`](../.archives/tasks/13_presence_places.md) | 22 (TODO, refonte UI) |
| 14 | Import/Export Excel | ✅ DONE | [`.archives/tasks/14_excel.md`](../.archives/tasks/14_excel.md) | — clôturée |
| 16 | Activités & partages | ✅ DONE | [`.archives/tasks/16_activities_shares.md`](../.archives/tasks/16_activities_shares.md) | 23 (TODO, refonte UI) |
| — | `STATUS-01-17.md` | fusionné | [`.archives/tasks/STATUS-01-17.md`](../.archives/tasks/STATUS-01-17.md) | ce `TASK-STATUS.md` |
| — | `STATUS-19-25.md` | fusionné | [`.archives/tasks/STATUS-19-25.md`](../.archives/tasks/STATUS-19-25.md) | ce `TASK-STATUS.md` |

Règle appliquée : seules les tâches `DONE` **et** sans travail ouvert rattaché ont été archivées.
Restent dans `tasks/` : 07, 08, 12, 15, 17, 18 (`IN_PROGRESS`), 09 et 19–25 (`TODO`).
`decisions.md` n'a pas été résumé (22 entrées, contenu d'architecture load-bearing).

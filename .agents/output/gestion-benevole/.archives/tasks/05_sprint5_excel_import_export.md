Status: DONE

> Clôturé le 2026-10-05. Tous les critères sont prouvés — voir preuves ci-dessous et [`14_excel.md`](../../tasks/14_excel.md).

> **Suivi de remise en état:** preuves runtime et round-trip XLSX sont suivis dans [`14_excel.md`](../../tasks/14_excel.md), Plan `plan-001`.

# Tâche 05 — Sprint 5 : Import / Export Excel (users + présences)

**Sprint:** 5 · **Durée:** 1 semaine · **Priorité:** Moyenne · **Dépend de:** Tâche 03, Tâche 04 · **Plan:** [`prd.md`](../../prd.md) §6 · **Archi:** [`archi.md`](../../archi.md)

---

## Goal

Export XLSX et import XLSX **fonctionnels** sur la liste USER (`/admin/users`) et sur les présences (`/admin/presences`), colonnes alignées sur les propriétés du modèle, import validé ligne par ligne avec rapport d'erreurs.

## Fichiers à créer/modifier

| Fichier | Action |
|---------|--------|
| `package.json` | Modifier — `pnpm add exceljs` (dépendance **serveur**) |
| `src/features/excel/excel.columns.ts` | Créer — définition des colonnes (users, présences) — **une seule source** pour export ET import |
| `src/features/excel/excel.writer.ts` | Créer — `exportUsersXlsx(rows)`, `exportPresencesXlsx(rows)` (en-têtes, largeurs, styles, freeze 1re ligne) |
| `src/features/excel/excel.reader.ts` | Créer — `parseUsersXlsx(buffer)`, `parsePresencesXlsx(buffer)` → lignes + erreurs |
| `src/features/excel/excel.action.ts` | Créer — `exportUsersAction`, `importUsersAction(formData)`, `exportPresencesAction`, `importPresencesAction(formData)` |
| `src/features/excel/excel.schema.ts` | Créer — Zod par ligne (réutilise `user.schema.ts` / `presence.schema.ts`) |
| `app/api/export/users/route.ts` | Créer — GET, stream XLSX, `Content-Disposition` |
| `app/api/export/presences/route.ts` | Créer — idem |
| `src/features/excel/import-export-buttons.tsx` | Créer — boutons Importer / Exporter (Dialog d'upload + résultat) |
| `app/admin/users/page.tsx`, `app/admin/presences/page.tsx` | Modifier — intégrer les boutons + template XLSX |

## Étapes

1. `pnpm add exceljs` ; **aucun import `exceljs` dans un `"use client"`** — uniquement Server Actions / Route Handlers.
2. **Colonnes users** (ordre du PRD §4) : `nom, prenom, email, matricule, etablissement/societe, genre, telephone, materielPC (OUI/NON), dateNaissance, age, socialProfile, siteWeb, joursDisponibles (LUN..SAM séparés par `;`), disponibilites, contactUrgence, spinneret, cvUrl, accepteRegles (OUI/NON), role, statut, certificatStatut`.
3. **Colonnes présences** : `date, matricule, nom, prenom, email, tableNumber, seatNumber, statut, heure_arrivee, heure_depart`.
4. **Export** : Route Handler GET → session `ADMIN+` → requête → `exportXlsx` → réponse `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`. Pas de `any`, colonnes typées via `excel.columns.ts`.
5. **Import** : upload `.xlsx` (FormData) → `workbook.xlsx.load(buffer)` → pour chaque ligne : parse Zod → collecte `{ ligne, champ, message }` → écriture en upsert (users : upsert par `email` ; présences : upsert par `user_id + date`) → retour `{ success, imported, errors[] }`.
6. **UI** : boutons `Exporter` (download) et `Importer` (Dialog shadcn : zone de fichier, bouton « Télécharger le modèle ») ; affichage du rapport d'erreurs en tableau ; toasts `sonner`.
7. « Télécharger le modèle » : export XLSX **vide** (en-têtes seuls) depuis la même `excel.columns.ts`.
8. Rejeter les fichiers non-XLSX (extension + magic bytes `PK`), taille ≤ 5 Mo.

## Critères d'acceptation

- [x] `pnpm typecheck` · `pnpm lint` · `pnpm build` — 0 erreur
- [x] `pnpm add exceljs` dans `dependencies` (pas `devDependencies`)
- [x] Export `/admin/users` → fichier `.xlsx` s'ouvre avec **toutes** les colonnes du modèle — prouvé par `excel.reader.test.ts` (export→parse round-trip) et `excel.integration.test.ts` (USER round-trip sur DB locale, 2026-10-05).
- [x] Export `/admin/presences` → présences avec table/siège — prouvé par `excel.integration.test.ts` (siège 9876/9876 exporté et relu, 2026-10-05).
- [x] Round-trip : export → réimport à l'identique → 0 erreur, 0 doublon créé — prouvé par `tests/excel.integration.test.ts` : USER (create→update→export→parse) et présence (upsert × 2, 1 seule ligne d'attendance), 2026-10-05.
- [x] Import d'un fichier avec 1 ligne invalide (email malformé) → `imported: N-1` + erreur listée **avec le n° de ligne** — prouvé par `excel.reader.test.ts` « associe les erreurs aux vrais numéros de lignes Excel ».
- [x] Import d'un `.txt` renommé `.xlsx` → refus propre — prouvé par `validateXlsxUpload` (magic bytes PK) + `excel.reader.test.ts` « renvoie une erreur contrôlée pour un fichier non XLSX ».
- [x] Un `VOLUNTEER` appelant l'export → 403 (côté serveur) — prouvé par `excel.routes.test.ts` (4 routes × 403, 2026-10-05).
- [x] Aucun `exceljs` importé côté client (vérif : `grep -r "exceljs" src --include='*.tsx'` = vide)

## Résultats de vérification — 2026-10-05

- `pnpm test` (vitest run src/) : **24 fichiers, 153 tests, tous passent**.
- `pnpm test:integration` : **2 fichiers, 7 tests, tous passent** sur `gestion_benevole_sprint06` local.
- `eslint src/features/excel/ app/api/import/ app/api/export/` : **0 erreur**, 1 avertissement complexité (pré-existant).

### Notes de clôture

- La route de présence réellement utilisée est `/admin/presences` (la route `/admin/presence` redirige vers elle). L'export accepte des bornes `dateDebut`/`dateFin` via paramètres de requête.
- Le schéma Prisma déployé contient les champs nécessaires (matricule, Seat, etc.) — les colonnes de l'export correspondent aux propriétés réelles du modèle.
- Tous les scénarios de la checklist (HTTP 403, fichier malformé, round-trip) sont désormais couverts par des tests automatisés.


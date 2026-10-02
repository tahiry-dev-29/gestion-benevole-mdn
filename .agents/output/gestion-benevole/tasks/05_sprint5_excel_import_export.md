Status: IN_PROGRESS

> Vérifications API locales ajoutées le 2026-10-02 (XLSX, erreur ligne, import répété, accès rôle). Le round-trip XLSX complet et les critères listés ci-dessous restent à clôturer; voir [`STATUS-01-17.md`](./STATUS-01-17.md).

> **Suivi de remise en état:** preuves runtime et round-trip XLSX sont suivis dans [`14_excel.md`](14_excel.md), Plan `plan-001`.

# Tâche 05 — Sprint 5 : Import / Export Excel (users + présences)

**Sprint:** 5 · **Durée:** 1 semaine · **Priorité:** Moyenne · **Dépend de:** Tâche 03, Tâche 04 · **Plan:** [`prd.md`](../prd.md) §6 · **Archi:** [`archi.md`](../archi.md)

---

## Goal

Export XLSX et import XLSX **fonctionnels** sur la liste USER (`/admin/users`) et sur les présences (`/admin/users/presence`), colonnes alignées sur les propriétés du modèle, import validé ligne par ligne avec rapport d'erreurs.

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
| `src/features/user/components/_components/import-export-buttons.tsx` | Créer — boutons Importer / Exporter (Dialog d'upload + résultat) |
| `app/admin/users/page.tsx`, `app/admin/users/presence/page.tsx` | Modifier — intégrer les boutons + template XLSX |

## Étapes

1. `pnpm add exceljs` ; **aucun import `exceljs` dans un `"use client"`** — uniquement Server Actions / Route Handlers.
2. **Colonnes users** (ordre du PRD §4) : `nom, prenom, email, matricule, etablissement/societe, genre, telephone, materielPC (OUI/NON), dateNaissance, age, socialProfile, siteWeb, joursDisponibles (LUN..SAM séparés par `;`), disponibilites, contactUrgence, spinneret, cvUrl, accepteRegles (OUI/NON), role, statut, certificatStatut`.
3. **Colonnes présences** : `date, matricule, nom, prenom, email, tableNumber, seatNumber, statut, heure_arrivee, heure_depart`.
4. **Export** : Route Handler GET → session `ADMIN+` → requête → `exportXlsx` → réponse `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`. Pas de `any`, colonnes typées via `excel.columns.ts`.
5. **Import** : upload `.xlsx` (FormData) → `workbook.xlsx.load(buffer)` → pour chaque ligne : parse Zod → collecte `{ ligne, champ, message }` → écriture en `createMany({ skipDuplicates: true })` ou upsert (users : upsert par `email`/`matricule` ; présences : upsert par `user_id + date`) → retour `{ success, imported, errors[] }`.
6. **UI** : boutons `Exporter` (download) et `Importer` (Dialog shadcn : drag & zone de fichier, bouton « Télécharger le modèle ») ; affichage du rapport d'erreurs en tableau ; toasts `sonner`.
7. « Télécharger le modèle » : export XLSX **vide** (en-têtes seuls) depuis la même `excel.columns.ts`.
8. Rejeter les fichiers non-XLSX (extension + magic bytes `PK`), taille ≤ 5 Mo.

## Critères d'acceptation

- [x] `pnpm typecheck` · `pnpm lint` · `pnpm build` — 0 erreur
- [x] `pnpm add exceljs` dans `dependencies` (pas `devDependencies`)
- [ ] Export `/admin/users` → fichier `.xlsx` s'ouvre dans Excel/LibreOffice avec **toutes** les colonnes du PRD
- [ ] Export `/admin/users/presence` → présences du filtre courant avec table/siège
- [ ] Round-trip : export → réimport à l'identique → 0 erreur, 0 doublon créé (implémentation par upsert, scénario non exécuté)
- [ ] Import d'un fichier avec 1 ligne invalide (email malformé) → `imported: N-1` + erreur listée **avec le n° de ligne**
- [ ] Import d'un `.txt` renommé `.xlsx` → refus propre
- [ ] Un `VOLUNTEER` appelant l'export → 403 (côté serveur)
- [x] Aucun `exceljs` importé côté client (vérif : `grep -r "exceljs" src --include='*.tsx'` = vide)

### Blocages constatés

- Le schéma Prisma déployé ne contient ni `matricule`, ni les propriétés étendues du PRD, ni modèle `Seat`/relation table-siège. Les exports suivent donc les champs présents dans `User` et `Presence`; ils ne peuvent satisfaire les colonnes complètes décrites plus haut sans migration de schéma.
- La route de présence réellement utilisée est `/admin/presences` (la route `/admin/presence` redirige vers elle). L'export accepte des bornes `dateDebut`/`dateFin`, mais l'interface actuelle de l'historique n'expose pas ces filtres à l'export.
- Les vérifications automatisées passent. Les scénarios HTTP avec session, fichiers malformés et round-trip n'ont pas été exécutés; le statut global reste TODO tant que ces critères ne sont pas prouvés et que le périmètre de schéma n'est pas résolu.

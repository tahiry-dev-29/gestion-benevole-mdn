# Artifacts — tâche 17 (Témoignages & PWA), plan-001

Date : 2026-10-05. Preuves du cycle complet et du comportement offline.

## Contenu

| Fichier | Preuve |
|---|---|
| `e2e-report.json` | Cycle E2E frais (2026-10-05, Chromium/dev :3000) : soumission anonyme → succès « Merci… » → ligne `EN_ATTENTE` admin sans rebuild → dialogue de suppression → ligne retirée + état vide + toast « Témoignage supprimé. » → contenu absent publiquement. 6/6 PASS. |
| `after-public-form-success.png` | Formulaire public (shadcn Textarea, placeholder, hint) + panneau de succès |
| `after-admin-pending-row.png` | Ligne en attente dans `/admin/temoignages` |
| `after-admin-delete-dialog.png` | Dialogue « Supprimer ce témoignage ? » (confirmation irréversible) |
| `after-admin-empty-state.png` | État vide après suppression |
| `offline-temoignages.png` | `/temoignages` rendu complet, **serveur arrêté** (cache `public-pages` du SW) |
| `offline-fallback.png` | Route non cachée, serveur arrêté → fallback `/~offline` |
| `result-warm.json` / `result-offline.json` | Sorties structurées des deux phases du script |
| `pwa-offline-proof-script.mjs` | Script reproductible (phases `warm` puis `offline`, profil Chromium persistant) |

## Notes de périmètre

- Les captures **avant** (before-*) ont été perdues : une session
  concurrente (Cline checkpoint + prune `thr-memory -check`) a nettoyé
  l'arbre pendant la session. Les mesures avant sont conservées dans
  `review/review-001_temoignage-pwa-polish.md` §2/§4 (focus
  `outline:none`/`boxShadow:none`, pas de placeholder, pas de dialogue,
  contraste 3.61:1/3.78:1) et les captures après sont rejouées ci-dessus.
- La preuve offline utilise l'arrêt réel du serveur : l'émulation
  `context.setOffline()` de Playwright contourne le SW dans ce Chromium
  et n'est pas une méthode de preuve valide (consigné dans
  `.agents/memory/decisions.md`).
- Le status canonique est désormais `tasks/TASK-STATUS.md` (ligne 17) ;
  `STATUS-01-17.md` est archivé dans `.archives/tasks/`.

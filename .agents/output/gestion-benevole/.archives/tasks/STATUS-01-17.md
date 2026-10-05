# État d’avancement des tâches 01–17

Dernière mise à jour : 2026-10-05. Ce tableau est le point de reprise rapide; chaque tâche détaillée reste la source de ses critères. `IN_PROGRESS` signifie qu’une partie du produit est prouvée, mais qu’au moins un critère demeure ouvert.

| Tâche | Statut | État vérifiable / prochain point |
| --- | --- | --- |
| 01 — Auth/RBAC | DONE | Historique de tests par rôle et matrice RBAC conservé dans la tâche. |
| 02 — Gestion bénévoles | DONE | Historique CRUD, règles de création et soft delete conservé dans la tâche. |
| 03 — Comptes USER | DONE | Tests de rôle forcé, unicité, upload, filtres et proxy; rendu Chromium de la liste, fiche avec Gravatar et formulaire, bureau + viewport 390×844 prouvés. Captures et suivi complémentaire dans `outputs/task-12/`; corrections de contrat suivies par la tâche 12. |
| 04 — Présences/places | DONE | Implémentation et tests historiques; suivi complémentaire dans la tâche 13. |
| 05 — Excel | DONE | Round-trip USER et présence prouvés sur DB locale (`tests/excel.integration.test.ts`, 2026-10-05). 24 fichiers/153 tests unitaires + 7 tests intégration passent. 0 erreur lint Excel. 403 VOLUNTEER, rejet fichier invalide, idempotence — tous couverts. |
| 06 — Observations/crédits | DONE | Base fonctionnelle historique; parcours UI de création des deux types vérifié localement. Suivi complémentaire dans la tâche 15. |
| 07 — Activités/partages | DONE (plan-001) | Tâche 16 DONE 2026-10-05 : brouillon masqué, publication visible sans rebuild, dépublication masquée, détail public 200/404, aucune fuite sérialisée. Reste au sprint 07 historique : parcours depuis l'interface admin en navigateur avec captures, responsive/clavier, revue Lead, Lighthouse mobile ≥ 90, rétro. |
| 08 — Témoignages/PWA | IN_PROGRESS | Le parcours navigateur est vérifié : soumission anonyme en attente, invisible publiquement avant publication, visible après publication, masquée après rejet; honeypot accepté sans créer de ligne, fixture supprimée. S8.6 archivé (scores locaux ≥ 90). Preuve offline obtenue le 2026-10-05 (Chromium, serveur arrêté) : SW actif + contrôleur, `public-pages` contient `/temoignages`+`/activites`+`/partages`, `/temoignages` rechargé depuis le cache, route inconnue → fallback `/~offline` (captures `/tmp/pwa-proof-08/`). Build EXIT=0 sur arbre stabilisé (6 fichiers WIP partages écartés/restaurés à l'octet près). Appareils réels et audit prod restent ouverts (S9). |
| 09 — Production | IN_PROGRESS — externe | Aucun déploiement ni migration prod. Requiert accès fournisseur/hébergement, secrets de production, cible DB isolée/confirmée et domaine; installation réelle PWA requiert appareils. |
| 10 — Socle/auth | DONE | Refus USER, auth par rôle, tests RBAC, routes locales et navigation alignés; CI avec tests, seed locale reproductible et matrice route×rôle complétées. |
| 11 — Gestion bénévoles | DONE | Refonte UX/UI moderne de la gestion des bénévoles (cartes statistiques, toolbar filtrante, avatars, badges distinctifs, fiche détaillée hero et pages ajout/rôles avec navigation de retour). CRUD sécurisé côté serveur avec RBAC. |
| 12 — Gestion USER | IN_PROGRESS | Création USER, PDF, modération certificat et login après conversion testés; tests unitaires ajoutés pour signatures PDF et permissions upload. Compléter le rapprochement exhaustif PRD/champs, cas de rejet et filtres. |
| 13 — Présences/places | DONE | Liste TanStack avec recherche différée, filtres statut/place, actualisation accessible et édition d’un pointage; sièges occupés contrôlés indépendamment des filtres. 128 tests, typecheck, lint (0 erreur; 3 avertissements), formatage et build avec 33 pages passent. Contrôle navigateur/responsive du 2026-10-02 : anonyme redirigé vers login, legacy `/admin/users/presence` → `/admin/presences`, pages `/admin/presences` et `/admin/places` rendues, viewport 390 px sans débordement horizontal. |
| 14 — Excel | DONE | Round-trip USER (create→update→export→parse) et présence (VOLUNTEER + siège) prouvés sur DB locale. 24 fichiers/153 tests unitaires + 7 tests intégration passent (2026-10-05). 0 erreur lint Excel. UI : progression, annonce screen reader et tableau d'erreurs en place. |
| 15 — Crédits/observations | IN_PROGRESS | Création UI des deux types et persistance prouvées; validations de période et présence couvertes par tests. Compléter calculs de bornes/fuseau et vérification exhaustive des filtres/invalidation Query. |
| 16 — Activités/partages | DONE | Tâche 16.2 clôturée 2026-10-05 : admin Partages sur DataTable/Query, schémas partagés, preuve HTTP anonyme complète (brouillon 404 → publié 200 sans fuite → dépublié 404). Reste hors plan-001 : parcours admin UI en navigateur avec captures, responsive 390px + clavier, Definition of Done sprint 07 historique. |
| 17 — Témoignages/PWA | IN_PROGRESS | Soumission/modération/honeypot vérifiés en navigateur. Preuve offline 2026-10-05 : cache runtime + fallback prouvés serveur arrêté (script `/tmp/pw08x/pwa-proof-phases.mjs`, artifacts `/tmp/pwa-proof-08/`). Polish UI 2026-10-05 (thr-design) : textarea shadcn + anneau de focus vérifié, placeholder/hint, dialogue de confirmation Supprimer parcouru de bout en bout (ligne retirée, état vide, toast par action), contraste primary/destructive light corrigé à 4.58:1/4.52:1. Captures avant/après : `.agents/output/gestion-benevole/outputs/17-testimonials-pwa/`. Reste ouvert : étapes 1–2 (POST/honeypot/modération en UI), cible tactile 44 px (routée à thr-planning), appareils réels (S9). |

## Validations locales du 2026-10-05 (thr-design — tâche 17.4)

- Périmètre : formulaire témoinage public, modération admin, `/admin/temoignages`, tokens de contraste.
- `pnpm vitest run src/features/temoignage` : 5/5.
- `eslint src/features/temoignage/ app/admin/temoignages/` : 0 erreur. `prettier --check` : OK sur les 4 fichiers.
- `tsc --noEmit` : aucune erreur sur les fichiers de la tâche (l'échec global reste le WIP partages, tâche 16).
- Preuve navigateur (dev :3000, Chromium) : anneau de focus réel sur le textarea, placeholder + hint, dialogue de confirmation Supprimer → suppression effective de la fixture synthétique → état vide + toast « Témoignage supprimé. » ; aucun débordement horizontal à 390 px.
- Contraste (`contrast-check.py`) : primary light 3.61:1→4.58:1, destructive light 3.78:1→4.52:1 (corrigés dans `app/globals.css`, teinte conservée) ; toutes les paires de texte courant PASS (4.57:1 light, 6.17:1 dark).
- Captures : `.agents/output/gestion-benevole/outputs/17-testimonials-pwa/` (`before-public-desktop/mobile.png`, `before-admin-desktop.png`, `after-public-form/mobile.png`, `after-admin-delete-dialog.png`, `after-admin-empty-state.png`, rapports JSON).

## Validations locales du 2026-10-05 (Tâche 08 / 17)

- `env -u NODE_ENV pnpm build` : EXIT=0 (33 pages/routes, SW généré avec fallback `/~offline`) après écart temporaire de 6 fichiers WIP partages hors tâche, restaurés à l'octet près (`diff -q` OK).
- Preuve offline Chromium (serveur `:3108` arrêté, profil persistant) : SW actif + contrôleur, `public-pages` = `/temoignages`+`/activites`+`/partages`, `/temoignages` servi depuis le cache, route inconnue → `/~offline`. PASS 5/5 (`result-warm.json` 3/3, `result-offline.json` 2/2), captures dans `/tmp/pwa-proof-08/`.
- `pnpm vitest run src/features/temoignage` : 5/5 passent.
- `pnpm typecheck` global : en échec sur WIP partages préexistant hors tâche (`partage-form.tsx` TS2322/TS2345, tâche 16) — non touché.
- Non prouvés : installation SW Android/iOS, Lighthouse prod (S9, hors scope plan-001).

## Validations locales du 2026-10-02

- `pnpm lint` : réussi, 0 erreur; 2 avertissements (complexité `excel.import-users.ts`, taille `user.action.ts`).
- `pnpm typecheck` : réussi après les changements et tests ajoutés.
- `pnpm test:all` : 19 fichiers, 117 tests réussis après correction du mock `server-only` et de la simulation `formData()`.
- `pnpm exec prettier --check app src vitest.config.ts next.config.ts proxy.ts` : réussi. `pnpm format:check` global reste en échec uniquement sur `pnpm-lock.yaml` et l'asset généré `public/fallback-ce627215c0e4a9af.js`; aucun de ces fichiers n'a été reformaté.
- `pnpm test:integration` : 2 fichiers, 7 tests réussis sur PostgreSQL local `gestion_benevole_sprint06`.
- `pnpm build` : réussi, Next.js 16.3.4; 33 pages/routes générées.
- `git diff --check` : réussi.
- E2E navigateur S7 : activités et partages brouillon → publication → pages publiques → dépublication → suppression; aucune fixture conservée.
- E2E navigateur témoignage : soumission anonyme en attente, invisible avant publication, visible après publication, cachée après rejet; honeypot accepté silencieusement sans ligne créée; fixture supprimée. Le dernier contrôle confirmé s'arrête ici; aucune preuve de fonctionnement offline n'a été obtenue.
- Lighthouse local mobile : Activités 95, Partages 98, Témoignages 97 en performance; accessibilité, bonnes pratiques et SEO à 100. Les chiffres sont locaux, une mesure/page, et ne remplacent pas la production.

## Prochaines actions

1. ~~Reprendre par le diagnostic service worker, puis prouver le rechargement hors ligne et le fallback (S8 / tâche 17).~~ FAIT le 2026-10-05 (serveur arrêté, captures `/tmp/pwa-proof-08/`) — reste : appareils réels (S9) et étape 17.4 (polish UI modération).
2. Ensuite terminer le round-trip XLSX sur base dédiée/fixtures isolées; ne pas réimporter l’export global dans la base de développement partagée.
3. Puis vérifier les workflows admin restants (bénévoles, USER, présences, crédits/observations, activités/partages) aux critères manquants, sans remplacer les parcours avec un build seul.
4. S9 reste le dernier jalon : accès autorisé à l'hébergement, à la DB et au domaine requis; ne pas migrer la base Neon depuis ce poste.

## Reprise rapide

Le code des sprints 0–8 est largement en place et les validations unitaires/type/lint/format ciblé listées ci-dessus ont réussi. Les parcours runtime et la preuve offline restent à faire; reprendre au point 1 ci-dessus. La production n'a pas été déployée. Le gros volume de changements déjà présent dans le workspace est du travail en cours non commité; ne pas le réinitialiser.

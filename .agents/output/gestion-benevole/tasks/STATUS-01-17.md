# État d’avancement des tâches 01–17

Dernière mise à jour : 2026-10-02. Ce tableau est le point de reprise rapide; chaque tâche détaillée reste la source de ses critères. `IN_PROGRESS` signifie qu’une partie du produit est prouvée, mais qu’au moins un critère demeure ouvert.

| Tâche | Statut | État vérifiable / prochain point |
| --- | --- | --- |
| 01 — Auth/RBAC | DONE | Historique de tests par rôle et matrice RBAC conservé dans la tâche. |
| 02 — Gestion bénévoles | DONE | Historique CRUD, règles de création et soft delete conservé dans la tâche. |
| 03 — Comptes USER | IN_PROGRESS | Payload de rôle forcé, doublon matricule, refus EXE/PDF trop lourd, filtres et proxy couverts par tests; 124 tests et typecheck passent. Les 13 migrations sont appliquées sur la DB locale dédiée; champs de la fiche et Gravatar vérifiés dans le rendu/chargement serveur. Contrôle navigateur à rejouer. Le lint global échoue actuellement sur une règle React dans le composant de renommage des places, hors tâche 03. |
| 04 — Présences/places | DONE | Implémentation et tests historiques; suivi complémentaire dans la tâche 13. |
| 05 — Excel | IN_PROGRESS | XLSX exporté, import invalide rejeté avec ligne, import répété idempotent, accès VOLUNTEER refusé; compléter le round-trip intégral et valider les colonnes/filtres UI. |
| 06 — Observations/crédits | DONE | Base fonctionnelle historique; parcours UI de création des deux types vérifié localement. Suivi complémentaire dans la tâche 15. |
| 07 — Activités/partages | IN_PROGRESS | Pour les deux contenus : brouillon masqué, publication visible sans rebuild, dépublication masquée, détail public 200/404; compléter les parcours depuis l’interface admin et le reste de la checklist sprint. |
| 08 — Témoignages/PWA | IN_PROGRESS | Le parcours navigateur est vérifié : soumission anonyme en attente, invisible publiquement avant publication, visible après publication, masquée après rejet; honeypot accepté sans créer de ligne, fixture supprimée. Le contrôle runtime offline/SW, les appareils réels et l'audit de production restent ouverts. |
| 09 — Production | IN_PROGRESS — externe | Aucun déploiement ni migration prod. Requiert accès fournisseur/hébergement, secrets de production, cible DB isolée/confirmée et domaine; installation réelle PWA requiert appareils. |
| 10 — Socle/auth | DONE | Refus USER, auth par rôle, tests RBAC, routes locales et navigation alignés; CI avec tests, seed locale reproductible et matrice route×rôle complétées. |
| 11 — Gestion bénévoles | DONE | Refonte UX/UI moderne de la gestion des bénévoles (cartes statistiques, toolbar filtrante, avatars, badges distinctifs, fiche détaillée hero et pages ajout/rôles avec navigation de retour). CRUD sécurisé côté serveur avec RBAC. |
| 12 — Gestion USER | IN_PROGRESS | Création USER, PDF, modération certificat et login après conversion testés; tests unitaires ajoutés pour signatures PDF et permissions upload. Compléter le rapprochement exhaustif PRD/champs, cas de rejet et filtres. |
| 13 — Présences/places | IN_PROGRESS | Route `/admin/presences` et pointage réel avec place vérifiés; compléter cas négatifs/invariants et validation UI complète. |
| 14 — Excel | IN_PROGRESS | Endpoints et tests de fichier exécutés; compléter aller-retour complet pour USER et présence, plus progression/annonce UI. |
| 15 — Crédits/observations | IN_PROGRESS | Création UI des deux types et persistance prouvées; validations de période et présence couvertes par tests. Compléter calculs de bornes/fuseau et vérification exhaustive des filtres/invalidation Query. |
| 16 — Activités/partages | IN_PROGRESS | Voir preuves runtime ci-dessus; parcours admin UI, édition de contenu et contrôles responsive/clavier restent à valider. |
| 17 — Témoignages/PWA | IN_PROGRESS | Soumission/modération/honeypot vérifiés en navigateur. Le test offline n'a pas obtenu de contrôleur SW : fallback et rechargement hors ligne non prouvés. Le suivi reste ouvert. |

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

1. Reprendre par le diagnostic service worker, puis prouver le rechargement hors ligne et le fallback (S8 / tâche 17).
2. Ensuite terminer le round-trip XLSX sur base dédiée/fixtures isolées; ne pas réimporter l’export global dans la base de développement partagée.
3. Puis vérifier les workflows admin restants (bénévoles, USER, présences, crédits/observations, activités/partages) aux critères manquants, sans remplacer les parcours avec un build seul.
4. S9 reste le dernier jalon : accès autorisé à l'hébergement, à la DB et au domaine requis; ne pas migrer la base Neon depuis ce poste.

## Reprise rapide

Le code des sprints 0–8 est largement en place et les validations unitaires/type/lint/format ciblé listées ci-dessus ont réussi. Les parcours runtime et la preuve offline restent à faire; reprendre au point 1 ci-dessus. La production n'a pas été déployée. Le gros volume de changements déjà présent dans le workspace est du travail en cours non commité; ne pas le réinitialiser.

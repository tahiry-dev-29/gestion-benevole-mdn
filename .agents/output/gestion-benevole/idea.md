# Gestion Bénévole — Maison du Numérique — Idée

## Concept en une phrase

PWA interne de gestion des bénévoles de la Maison du Numérique : comptes à rôles strictement contrôlés (SUPER_ADMIN / ADMIN / VOLUNTEER), comptes utilisateurs (USER) convertibles en bénévole après validation d'un certificat, présences pointées sur une place réelle (table + siège), avec import/export Excel, et vitrine publique (activités, partages, témoignages).

## Problème résolu

- Suivi dispersé (papier / Excel maison) des présences, des places et des crédits des bénévoles.
- Aucun contrôle de qui peut créer des comptes administrateurs → risque d'escalade de privilèges.
- Pas de processus de conversion étudiant → bénévole validé (certificat vérifié par un admin).
- Pas de visibilité sur les tables/sièges disponibles dans la salle, ni de CRUD sur leurs numéros.
- Pas d'export exploitable pour la comptabilité ou l'administration (Excel).

## Valeur ajoutée / différenciation

- **Hiérarchie de création de comptes déléguée** : seul SUPER_ADMIN crée des SUPER_ADMIN ; ADMIN crée ADMIN et VOLUNTEER ; VOLUNTEER crée VOLUNTEER. Vérifiée côté serveur, pas seulement dans l'UI.
- **Application fermée** : pas d'inscription publique, pas de page d'accueil marketing — `/` redirige sur `/login`, seule porte d'entrée pour SUPER_ADMIN / ADMIN / VOLUNTEER. Le rôle USER ne peut pas s'authentifier.
- **Présence = place réelle** : chaque pointage choisit une table et un siège ; CRUD complet des numéros de table et de siège.
- **Import / Export Excel** (exceljs) sur les listes USER et les présences, en respectant les propriétés du modèle.
- **Conversion USER → VOLUNTEER** traçable : certificat uploadé, statut de vérification, approbation par un admin.

## Cible / contexte d'usage principal

- **Interne (quotidien)** : équipe de la Maison du Numérique — SUPER_ADMIN, ADMIN, VOLUNTEER — depuis `/admin/*` (dashboard, volunteer-management, users, présences, crédits, observations).
- **Comptes USER** : étudiants / participants gérés par les admins — ils n'utilisent jamais `/login` ; ils sont convertis en VOLUNTEER après validation de leur certificat.
- **Public** : visiteurs des pages vitrines (activités, partages, témoignages) soumises à modération.


## My Idee to tasks

- Je veux des UI UX pret a la production comme dans les gros application comme youtube ou facebook, pas du squelete. tu dois utilise mes libraire shadcn-ui et tanstack (query, table) car je veux que toutes les appel api dans cette application utilise tanstack query, avec mon skill /thr-desing -all-steps, `stack.md`.
- presque toutes les page du tasks n existe par dans l Application par exemple `admin/presences`.
- dans la gestion des utilisateurs l ancienne bug est encore present la admin/users, j ai deja dit que la gestion user c et pour les USER n est pas les ADMIN est les propriete tous n est pas correcte.
- Les UI UX son tres classique et il je veux partout des composant avec du bon desing comme dans une application comme youtube ou facebook ou d autres.
- d apres mon review la toutes les fonctionnalite de mon application est encore du bordel et pas encore termine, donc pour ca, il faux creer les plans $thr-up -plans[id_task] et -tasks[id_plan], pour mettre en place toutes les gestion dans cette sprints pour avoire une application equivalent a youtube ou facebook a la fin du tasks

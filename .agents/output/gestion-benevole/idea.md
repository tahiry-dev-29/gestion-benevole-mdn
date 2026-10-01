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

# Gestion Bénévole — Discovery

## Contexte & objectif

Repo Next.js existant (App Router + Prisma + PostgreSQL, stack figée dans `.agents/rules/stack.md`) déjà amorcé : pages `/admin/*` en place (users, volunteers, presences, activities, credits, observations…), auth NextAuth Credentials, middleware `proxy.ts`, features `src/features/{auth,user,benevoles,presence,activites}`.

Le cadrage initial (`todos/`, migré ici le 2026-10-01) partait d'un CDC avec 3 rôles (ADMIN / BENEVOLE / USER) et des pages publiques. L'interview du 2026-10-01 recentre le produit sur **l'usage interne administratif** : app fermée, hiérarchie de rôles plus fine, gestion des places, Excel.

## Décisions issues de l'interview (2026-10-01)

| # | Décision | Détail |
|---|----------|--------|
| D1 | **4 rôles** | `SUPER_ADMIN`, `ADMIN`, `VOLUNTEER` (ex-`BENEVOLE`, renommé par migration), `USER` (pré-conversion) |
| D2 | **App fermée** | `/login` = seul point d'entrée ; `/` → redirect `/login` ; **pas** de `/sign-up`, **pas** de page `/home` ; le rôle `USER` ne peut pas s'authentifier |
| D3 | **Création de comptes** | Plus jamais via un formulaire public : elle vit dans `/admin/volunteer-management` |
| D4 | **Matrice de création** | SUPER_ADMIN → crée SUPER_ADMIN/ADMIN/VOLUNTEER ; ADMIN → crée ADMIN/VOLUNTEER ; VOLUNTEER → crée VOLUNTEER |
| D5 | **Routes** | Toutes les nouvelles pages sous `/admin/*` (cohérent avec `proxy.ts` existant) |
| D6 | **Volunteer management** | Sous-liste : `/admin/volunteer-management` (liste+CRUD), `/admin/volunteer-management/roles`, `/admin/volunteer-management/add` — CRUD « qui marche vraiment », sécurisé |
| D7 | **Conversion USER → VOLUNTEER** | Déclenchée par l'approbation d'un certificat par un admin |
| D8 | **Propriétés USER** | Liste figée dans le PRD ; en plus du base : téléphone, matricule, disponibilités horaires, contact d'urgence, confirmation des règles |
| D9 | **Places non fixes** | Le n° de table/siège **n'est pas figé** sur l'utilisateur : il est choisi à chaque pointage (`/admin/users/presence`) |
| D10 | **CRUD tables/sièges** | Page dédiée pour créer/modifier les numéros de table et de siège |
| D11 | **Excel** | `exceljs` — import + export sur la liste USER et sur les présences |
| D12 | **Toutes les pages sous `/admin`** | Pas de routes top-level `/volunteer/*` ou `/user/*` |

## Contraintes

- Respecter `.agents/rules/stack.md` (Zod partout, Server Actions, Tailwind 4-only, fichiers ≤ 200 lignes, zéro `any`).
- Données existantes à ne pas casser : migration Prisma avec `ALTER TYPE ... RENAME VALUE` pour `BENEVOLE` → `VOLUNTEER` (pas de drop/recreate).
- Repo git avec changements non commités (CDC, ROADMAP, task 01, stack.md) — à commiter proprement avant/pendant l'implémentation.

## Questions ouvertes / à trancher plus tard

1. **Libellé « Spinneret »** (propriétés USER, champ requis demandé) : le terme n'est pas interprété — le champ sera modélisé tel quel (`spinneret: String`) en attendant une clarification.
2. **Création de comptes USER** : le matrice précis qui crée les USER (ADMIN+ ? VOLUNTEER aussi ?) — par défaut retenu : SUPER_ADMIN et ADMIN créent les USER ; VOLUNTEER ne crée que des VOLUNTEER.
3. **Périmètre public** (activités / partages / témoignages / PWA) : maintenu du CDC mais secondaire — sprints 07-09, à re-confirmer avant lancement.
4. **Droits sur la page roles** : seule l'édition des règles par SUPER_ADMIN est retenue par défaut (ADMIN en lecture).
5. **Quel accès VOLUNTEER au dashboard** : retenu = accès au dashboard + volunteer-management (création VOLUNTEER) + profil ; le reste est ADMIN+.

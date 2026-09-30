# Tâche 02 — Sprint 2 : Gestion Utilisateur (USER) & Vérification PDF

**Status:** TODO
**Sprint:** 2 · **Durée:** 2 semaines · **Priorité:** Haute

---

## Goal

Créer/modifier des UTILISATEURS avec champs étudiants, liste filtrable (présence, fichier, place, ECTS), transfert USER → BENEVOLE via upload PDF validé par l'admin.

## Fichiers à créer/modifier

| Fichier | Action |
|---------|--------|
| `prisma/schema.prisma` | Modifier — champs étudiants sur User |
| `prisma/seed.ts` | Modifier — USER de test avec champs |
| `src/features/user/user.schema.ts` | Modifier — `createUserSchema` complet |
| `src/features/user/user.action.ts` | Modifier — `createUserAction`, `listUsersAction` filtres, `promoteToBenevoleAction` |
| `src/features/user/components/_components/create-user-modal.tsx` | Modifier — formulaire champs étudiants |
| `src/features/user/components/users-table.tsx` | Modifier — filtres TanStack + bouton promouvoir |
| `src/features/user/components/_components/verification-pdf-modal.tsx` | Créer — upload PDF + promouvoir |
| `src/features/user/user.action.ts` | Créer — `uploadVerificationPdfAction` |

## Étapes

1. **Schema** : ajouter `schoolName`, `filiere`, `anneeScolaire`, `ects`, `genre`, `verificationFile`, `verifiedAt` sur User + migration
2. **Zod** : `createUserSchema` avec tous les champs (champs scolaires requis)
3. **createUserAction** : admin only, hash password, rôle `USER`
4. **uploadVerificationPdfAction** : validation MIME `application/pdf` + taille ≤ 5 Mo, upload Vercel Blob, save URL
5. **promoteToBenevoleAction** : admin only, vérifie `verificationFile` non null, `role = "BENEVOLE"`, `verifiedAt = now()`
6. **listUsersAction** : filtres `presence`, `verification`, `seat`, `minEcts`, pagination
7. **UI CreateUserModal** : React Hook Form + Zod, champs complets, toast sonner
8. **UI UsersTable** : TanStack Table, colonnes (nom, email, school, filière, ECTS, place, présence, vérification), filtres, actions (éditer, promouvoir, désactiver)
9. **UI VerificationPdfModal** : input file PDF, bouton upload, bouton promouvoir (désactivé sans PDF)
10. **Tests** : createUser, promote (avec/sans PDF), listUsers (chaque filtre)

## Critères d'acceptation

- [ ] `pnpm prisma migrate dev` passe
- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm build` passent
- [ ] Admin crée un USER avec tous les champs scolaires
- [ ] Non-PDF ou > 5 Mo rejeté avec message clair
- [ ] USER sans PDF → bouton promouvoir désactivé
- [ ] USER avec PDF → promotion en BENEVOLE fonctionne
- [ ] Les 4 filtres de la liste fonctionnent (présence, fichier, place, ECTS)
- [ ] Un non-admin reçoit 403 sur chaque action

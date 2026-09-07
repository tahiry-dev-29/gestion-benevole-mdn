-- CreateEnum
CREATE TYPE "UserStatut" AS ENUM ('ACTIF', 'INACTIF');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('PRIMAIRE', 'COLLEGIEN', 'UNIVERSITAIRE', 'SALARIE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER NOT NULL DEFAULT 18,
ADD COLUMN     "categorie" "Category" NOT NULL DEFAULT 'UNIVERSITAIRE',
ADD COLUMN     "contact" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "etablissement" TEXT NOT NULL DEFAULT 'Non renseigné',
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "sexe" TEXT NOT NULL DEFAULT 'Non précisé',
ADD COLUMN     "statut" "UserStatut" NOT NULL DEFAULT 'ACTIF';

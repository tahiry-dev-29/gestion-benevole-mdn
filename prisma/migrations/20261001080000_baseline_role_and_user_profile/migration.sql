-- Migration de rattrapage (baseline) — sprints 1 à 3.
--
-- Les colonnes `User` (profil, certificat, `createdById`) et l'énumération `Role`
-- à 4 rôles ont été ajoutées au schéma et appliquées à la base de dev via
-- `db push`/`db execute`, sans jamais être commitées dans `prisma/migrations/`.
-- L'historique de migrations était donc incomplet : une base créée depuis zéro
-- s'arrêtait à l'énumération `Role ('ADMIN','BENEVOLE')` et sans ces colonnes,
-- ce qui faisait échouer le seed et le build.
--
-- Ce script est idempotent et préserve les données : il peut être appliqué aussi
-- bien sur une base neuve que sur une base de dev déjà corrigée manuellement.

-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CertificatStatut') THEN
    CREATE TYPE "CertificatStatut" AS ENUM ('NON_DEMANDE', 'EN_ATTENTE', 'APPROUVE', 'REJETE');
  END IF;
END$$;

-- AlterEnum : `BENEVOLE` devient `VOLUNTEER`, les données sont conservées.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role')
     AND EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid
                 WHERE t.typname = 'Role' AND e.enumlabel = 'BENEVOLE') THEN

    ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;

    CREATE TYPE "Role_new" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'VOLUNTEER', 'USER');

    -- Les lignes `BENEVOLE` sont remappées sur `VOLUNTEER` avant le cast,
    -- sinon `::Role_new` échouerait sur une valeur absente du nouvel enum.
    ALTER TABLE "User"
      ALTER COLUMN "role" TYPE "Role_new"
      USING (CASE WHEN "role"::text = 'BENEVOLE' THEN 'VOLUNTEER' ELSE "role"::text END)::"Role_new";

    ALTER TYPE "Role" RENAME TO "Role_old";
    ALTER TYPE "Role_new" RENAME TO "Role";
    DROP TYPE "Role_old";

    ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'VOLUNTEER';
  END IF;
END$$;

-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "accepteRegles" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "certificatStatut" "CertificatStatut" NOT NULL DEFAULT 'NON_DEMANDE',
ADD COLUMN IF NOT EXISTS "certificatUrl" TEXT,
ADD COLUMN IF NOT EXISTS "certificatValidatedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "certificatValidatedById" INTEGER,
ADD COLUMN IF NOT EXISTS "contactUrgence" TEXT,
ADD COLUMN IF NOT EXISTS "createdById" INTEGER,
ADD COLUMN IF NOT EXISTS "cvUrl" TEXT,
ADD COLUMN IF NOT EXISTS "dateNaissance" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "disponibilites" JSONB,
ADD COLUMN IF NOT EXISTS "joursDisponibles" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS "materielPC" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "matricule" TEXT,
ADD COLUMN IF NOT EXISTS "reglesAccepteesAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "siteWeb" TEXT,
ADD COLUMN IF NOT EXISTS "socialProfile" TEXT,
ADD COLUMN IF NOT EXISTS "societe" TEXT,
ADD COLUMN IF NOT EXISTS "spinneret" TEXT,
ADD COLUMN IF NOT EXISTS "telephone" TEXT;

-- Après le bloc ci-dessus, `Role` contient toujours la valeur `VOLUNTEER`
-- (soit parce que le cast vient de la créer, soit parce qu'elle existait déjà).
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'VOLUNTEER';

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_matricule_key" ON "User"("matricule");
CREATE INDEX IF NOT EXISTS "User_certificatStatut_idx" ON "User"("certificatStatut");
CREATE INDEX IF NOT EXISTS "User_role_statut_idx" ON "User"("role", "statut");
CREATE INDEX IF NOT EXISTS "User_createdById_idx" ON "User"("createdById");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'User_createdById_fkey'
  ) THEN
    ALTER TABLE "User" ADD CONSTRAINT "User_createdById_fkey"
      FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;


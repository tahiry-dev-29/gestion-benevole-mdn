-- Sprint 3: User properties and certificate conversion

-- Add new columns to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "matricule"             TEXT UNIQUE;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "societe"               TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "telephone"             TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "dateNaissance"         TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "siteWeb"               TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "cvUrl"                 TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "socialProfile"         TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "joursDisponibles"      TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "disponibilites"        JSONB;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "contactUrgence"        TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "spinneret"             TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "accepteRegles"         BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "reglesAccepteesAt"     TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "materielPC"            BOOLEAN NOT NULL DEFAULT false;

-- Certificate conversion columns
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "certificatUrl"            TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "certificatValidatedAt"    TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "certificatValidatedById"  INTEGER;

-- CertificatStatut enum
DO $$ BEGIN
  CREATE TYPE "CertificatStatut" AS ENUM ('NON_DEMANDE', 'EN_ATTENTE', 'APPROUVE', 'REJETE');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "certificatStatut" "CertificatStatut" NOT NULL DEFAULT 'NON_DEMANDE';

-- Indexes
CREATE INDEX IF NOT EXISTS "User_certificatStatut_idx" ON "User"("certificatStatut");

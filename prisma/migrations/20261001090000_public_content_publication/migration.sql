CREATE TYPE "PublicationStatut" AS ENUM ('BROUILLON', 'PUBLIE');

ALTER TABLE "Activite"
ADD COLUMN "image" TEXT,
ADD COLUMN "statut" "PublicationStatut" NOT NULL DEFAULT 'BROUILLON';

ALTER TABLE "Partage"
ADD COLUMN "statut" "PublicationStatut" NOT NULL DEFAULT 'BROUILLON';

CREATE INDEX "Activite_statut_date_idx" ON "Activite"("statut", "date");
CREATE INDEX "Partage_statut_date_publication_idx" ON "Partage"("statut", "date_publication");

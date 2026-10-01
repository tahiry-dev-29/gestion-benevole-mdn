-- AlterTable
ALTER TABLE "Observation" ADD COLUMN     "auteur_id" INTEGER;

-- CreateIndex
CREATE INDEX "Credit_user_id_idx" ON "Credit"("user_id");

-- CreateIndex
CREATE INDEX "Credit_date_idx" ON "Credit"("date");

-- CreateIndex
CREATE INDEX "Observation_user_id_idx" ON "Observation"("user_id");

-- CreateIndex
CREATE INDEX "Observation_auteur_id_idx" ON "Observation"("auteur_id");

-- CreateIndex
CREATE INDEX "Observation_annee_mois_idx" ON "Observation"("annee", "mois");

-- CreateIndex
CREATE UNIQUE INDEX "Observation_user_id_mois_annee_key" ON "Observation"("user_id", "mois", "annee");

-- CreateIndex
CREATE UNIQUE INDEX "Presence_user_id_date_key" ON "Presence"("user_id", "date");

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_auteur_id_fkey" FOREIGN KEY ("auteur_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

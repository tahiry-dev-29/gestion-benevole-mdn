-- Synchronisation de l'historique : l'index unique (user_id, date) existe en
-- base (appliqué hors migration) mais était absent de l'historique Prisma.
-- IF NOT EXISTS garantit l'idempotence sur la base déjà à jour (zéro perte).
CREATE UNIQUE INDEX IF NOT EXISTS "Presence_user_id_date_key" ON "Presence"("user_id", "date");

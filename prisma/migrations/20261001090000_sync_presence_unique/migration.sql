-- AddUnique: Presence (user_id, date)
CREATE UNIQUE INDEX IF NOT EXISTS "Presence_user_id_date_key" ON "Presence"("user_id", "date");

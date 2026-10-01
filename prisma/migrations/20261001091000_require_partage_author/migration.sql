-- Existing records can have no author. Keep their history by assigning them to
-- the first administrator before making the author relation required.
UPDATE "Partage"
SET "user_id" = (
  SELECT "id" FROM "User"
  ORDER BY CASE WHEN "role"::text = 'ADMIN' THEN 0 ELSE 1 END, "id"
  LIMIT 1
)
WHERE "user_id" IS NULL
  AND EXISTS (SELECT 1 FROM "User");

DELETE FROM "Partage" WHERE "user_id" IS NULL;
ALTER TABLE "Partage" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "Partage" DROP CONSTRAINT "Partage_user_id_fkey";
ALTER TABLE "Partage" ADD CONSTRAINT "Partage_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "Partage_user_id_idx" ON "Partage"("user_id");

-- Add createdById column to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "createdById" INTEGER;
ALTER TABLE "User" ADD CONSTRAINT "User_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX IF NOT EXISTS "User_createdById_idx" ON "User"("createdById");
CREATE INDEX IF NOT EXISTS "User_role_statut_idx" ON "User"("role", "statut");

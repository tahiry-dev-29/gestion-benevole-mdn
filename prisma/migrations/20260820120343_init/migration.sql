-- AlterTable
ALTER TABLE "User" ADD COLUMN "emailVerified" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

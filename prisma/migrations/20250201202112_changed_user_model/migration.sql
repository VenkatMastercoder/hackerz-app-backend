-- AlterTable
ALTER TABLE "User" ADD COLUMN     "last_sync" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Learner" ADD COLUMN     "isAdult" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userType" TEXT NOT NULL DEFAULT 'parent';

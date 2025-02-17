-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "postcode" TEXT,
ADD COLUMN     "profileComplete" BOOLEAN NOT NULL DEFAULT false;

/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `credits` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Learner` will be added. If there are existing duplicate values, this will fail.
  - Made the column `learnerId` on table `Booking` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_learnerId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "Learner" DROP CONSTRAINT "Learner_parentId_fkey";

-- DropIndex
DROP INDEX "Booking_date_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "paymentId",
ALTER COLUMN "learnerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Learner" ADD COLUMN     "email" TEXT,
ADD COLUMN     "password" TEXT,
ALTER COLUMN "parentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "credits",
ADD COLUMN     "availableSessions" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "SessionAvailability" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER NOT NULL,
    "maxSlots" INTEGER NOT NULL DEFAULT 3,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedDate" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockedDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomSessionTime" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER NOT NULL,
    "maxSlots" INTEGER NOT NULL DEFAULT 3,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomSessionTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookingToPayment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookingToPayment_AB_unique" ON "_BookingToPayment"("A", "B");

-- CreateIndex
CREATE INDEX "_BookingToPayment_B_index" ON "_BookingToPayment"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Learner_email_key" ON "Learner"("email");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "Learner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Learner" ADD CONSTRAINT "Learner_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingToPayment" ADD CONSTRAINT "_BookingToPayment_A_fkey" FOREIGN KEY ("A") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingToPayment" ADD CONSTRAINT "_BookingToPayment_B_fkey" FOREIGN KEY ("B") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

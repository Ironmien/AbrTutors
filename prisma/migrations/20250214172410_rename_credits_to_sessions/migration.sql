/*
  Warnings:

  - You are about to drop the `CreditHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CreditHistory" DROP CONSTRAINT "CreditHistory_userId_fkey";

-- AlterTable
ALTER TABLE "_BookingToPayment" ADD CONSTRAINT "_BookingToPayment_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_BookingToPayment_AB_unique";

-- DropTable
DROP TABLE "CreditHistory";

-- CreateTable
CREATE TABLE "SessionHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "adminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SessionHistory_userId_idx" ON "SessionHistory"("userId");

-- AddForeignKey
ALTER TABLE "SessionHistory" ADD CONSTRAINT "SessionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "learnerId" TEXT;

-- CreateTable
CREATE TABLE "Learner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "schoolYear" INTEGER,
    "subjects" TEXT[],
    "parentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Learner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Learner_parentId_idx" ON "Learner"("parentId");

-- CreateIndex
CREATE INDEX "Booking_learnerId_idx" ON "Booking"("learnerId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "Learner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Learner" ADD CONSTRAINT "Learner_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

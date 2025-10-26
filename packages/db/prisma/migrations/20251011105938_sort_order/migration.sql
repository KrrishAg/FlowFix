/*
  Warnings:

  - You are about to drop the column `actionId` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `triggerId` on the `Trigger` table. All the data in the column will be lost.
  - Added the required column `actionTypeId` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `triggerTypeId` to the `Trigger` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Action" DROP CONSTRAINT "Action_actionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Trigger" DROP CONSTRAINT "Trigger_triggerId_fkey";

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "actionId",
ADD COLUMN     "actionTypeId" TEXT NOT NULL,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Trigger" DROP COLUMN "triggerId",
ADD COLUMN     "triggerTypeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_triggerTypeId_fkey" FOREIGN KEY ("triggerTypeId") REFERENCES "AvailableTrigger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_actionTypeId_fkey" FOREIGN KEY ("actionTypeId") REFERENCES "AvailableAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

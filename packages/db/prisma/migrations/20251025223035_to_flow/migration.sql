/*
  Warnings:

  - You are about to drop the column `zapId` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `zapId` on the `Trigger` table. All the data in the column will be lost.
  - You are about to drop the `Zap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZapRun` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZapRunOutbox` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[flowId]` on the table `Trigger` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `flowId` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flowId` to the `Trigger` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Action" DROP CONSTRAINT "Action_zapId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Trigger" DROP CONSTRAINT "Trigger_zapId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Zap" DROP CONSTRAINT "Zap_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ZapRun" DROP CONSTRAINT "ZapRun_zapId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ZapRunOutbox" DROP CONSTRAINT "ZapRunOutbox_zapRunId_fkey";

-- DropIndex
DROP INDEX "public"."Trigger_zapId_key";

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "zapId",
ADD COLUMN     "flowId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Trigger" DROP COLUMN "zapId",
ADD COLUMN     "flowId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Zap";

-- DropTable
DROP TABLE "public"."ZapRun";

-- DropTable
DROP TABLE "public"."ZapRunOutbox";

-- CreateTable
CREATE TABLE "Flow" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "triggerId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowRun" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "FlowRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowRunOutbox" (
    "id" TEXT NOT NULL,
    "flowRunId" TEXT NOT NULL,

    CONSTRAINT "FlowRunOutbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Flow_triggerId_key" ON "Flow"("triggerId");

-- CreateIndex
CREATE UNIQUE INDEX "FlowRunOutbox_flowRunId_key" ON "FlowRunOutbox"("flowRunId");

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_flowId_key" ON "Trigger"("flowId");

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowRun" ADD CONSTRAINT "FlowRun_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowRunOutbox" ADD CONSTRAINT "FlowRunOutbox_flowRunId_fkey" FOREIGN KEY ("flowRunId") REFERENCES "FlowRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - Added the required column `emai` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metadata` to the `ZapRun` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
ADD COLUMN     "emai" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ZapRun" ADD COLUMN     "metadata" JSONB NOT NULL;

/*
  Warnings:

  - The primary key for the `MutualizedTierList` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `averageScore` on the `MutualizedTierList` table. All the data in the column will be lost.
  - You are about to drop the column `finalRank` on the `MutualizedTierList` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `MutualizedTierList` table. All the data in the column will be lost.
  - You are about to drop the column `lastCalculatedAt` on the `MutualizedTierList` table. All the data in the column will be lost.
  - You are about to drop the column `pdfUrl` on the `MutualizedTierList` table. All the data in the column will be lost.
  - You are about to drop the column `voteDistribution` on the `MutualizedTierList` table. All the data in the column will be lost.
  - Added the required column `category` to the `MutualizedTierList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfVotes` to the `MutualizedTierList` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "MutualizedTierList_companyId_key";

-- AlterTable
ALTER TABLE "MutualizedTierList" DROP CONSTRAINT "MutualizedTierList_pkey",
DROP COLUMN "averageScore",
DROP COLUMN "finalRank",
DROP COLUMN "id",
DROP COLUMN "lastCalculatedAt",
DROP COLUMN "pdfUrl",
DROP COLUMN "voteDistribution",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "numberOfVotes" INTEGER NOT NULL,
ADD CONSTRAINT "MutualizedTierList_pkey" PRIMARY KEY ("companyId", "category");

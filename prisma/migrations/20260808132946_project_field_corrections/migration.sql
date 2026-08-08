/*
  Warnings:

  - You are about to drop the column `category` on the `projects` table. All the data in the column will be lost.
  - Added the required column `techSummary` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "category",
ADD COLUMN     "filterTags" TEXT[],
ADD COLUMN     "techSummary" TEXT NOT NULL;

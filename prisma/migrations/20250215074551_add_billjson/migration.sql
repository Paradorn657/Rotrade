/*
  Warnings:

  - Added the required column `Deals_count` to the `Bills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dealsData` to the `Bills` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bills" ADD COLUMN     "Deals_count" INTEGER NOT NULL,
ADD COLUMN     "dealsData" JSONB NOT NULL;

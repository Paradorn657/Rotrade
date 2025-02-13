/*
  Warnings:

  - You are about to drop the column `Model_id` on the `Bills` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bills" DROP CONSTRAINT "Bills_Model_id_fkey";

-- AlterTable
ALTER TABLE "Bills" DROP COLUMN "Model_id";

/*
  Warnings:

  - The primary key for the `mt5Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `MT5_id` column on the `mt5Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `MT5_accountid` to the `mt5Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mt5Account" DROP CONSTRAINT "mt5Account_pkey",
ADD COLUMN     "MT5_accountid" TEXT NOT NULL,
DROP COLUMN "MT5_id",
ADD COLUMN     "MT5_id" SERIAL NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'disconnect',
ALTER COLUMN "balance" SET DEFAULT 0,
ADD CONSTRAINT "mt5Account_pkey" PRIMARY KEY ("MT5_id");

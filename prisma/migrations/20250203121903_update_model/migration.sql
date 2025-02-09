/*
  Warnings:

  - A unique constraint covering the columns `[api_token]` on the table `mt5Account` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "mt5Account" ALTER COLUMN "status" SET DEFAULT 'Disconnect';

-- CreateTable
CREATE TABLE "Model" (
    "Model_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "version" DOUBLE PRECISION NOT NULL,
    "Update_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numberofuse" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("Model_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mt5Account_api_token_key" ON "mt5Account"("api_token");

/*
  Warnings:

  - The `model_id` column on the `mt5Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "mt5Account" DROP COLUMN "model_id",
ADD COLUMN     "model_id" INTEGER;

-- AddForeignKey
ALTER TABLE "mt5Account" ADD CONSTRAINT "mt5Account_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Model"("Model_id") ON DELETE SET NULL ON UPDATE CASCADE;

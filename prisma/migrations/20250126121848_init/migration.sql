-- CreateTable
CREATE TABLE "mt5Account" (
    "MT5_id" TEXT NOT NULL,
    "MT5_name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "api_token" TEXT NOT NULL,
    "model_id" TEXT,
    "status" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "mt5Account_pkey" PRIMARY KEY ("MT5_id")
);

-- AddForeignKey
ALTER TABLE "mt5Account" ADD CONSTRAINT "mt5Account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

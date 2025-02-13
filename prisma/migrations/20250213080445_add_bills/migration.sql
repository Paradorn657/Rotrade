-- CreateTable
CREATE TABLE "Bills" (
    "Bill_id" SERIAL NOT NULL,
    "User_id" INTEGER NOT NULL,
    "Model_id" INTEGER NOT NULL,
    "Billing_startdate" TIMESTAMP(3) NOT NULL,
    "Billing_enddate" TIMESTAMP(3) NOT NULL,
    "status" TEXT DEFAULT 'Unpaid',
    "Balance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Bills_pkey" PRIMARY KEY ("Bill_id")
);

-- AddForeignKey
ALTER TABLE "Bills" ADD CONSTRAINT "Bills_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bills" ADD CONSTRAINT "Bills_Model_id_fkey" FOREIGN KEY ("Model_id") REFERENCES "Model"("Model_id") ON DELETE RESTRICT ON UPDATE CASCADE;

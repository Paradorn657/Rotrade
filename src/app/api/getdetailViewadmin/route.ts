import { NextRequest, NextResponse } from "next/server";

import { prisma } from "../../../../lib/prisma";

const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true, // ใช้ 12 ชั่วโมง (AM/PM)
    }).format(date);
};
export async function GET(req: NextRequest) {
    try {

      const searchParams = req.nextUrl.searchParams;
      const userId = searchParams.get("user_id"); 
  
      if (!userId) {
        return NextResponse.json({ success: false, message: "Missing user_id" }, { status: 400 });
      }
  
      const userAccounts = await prisma.mt5Account.findMany({
        where: { user_id: parseInt(userId) },
        include: { model: true },
      });

      const bills = await prisma.bills.findMany({
        where: { User_id: parseInt(userId),Bill_show: true },
        include: { user: true },
      });

      const transformedBills = {
        pending: bills
          .filter((bill) => bill.status === "Unpaid")
          .map((bill) => ({
            id: bill.Bill_id,
            amount: bill.Balance,
            date: formatDate(bill.Billing_startdate),
            description: `Bill #INV-${bill.Bill_id}`,
          })),
        paid: bills
          .filter((bill) => bill.status === "Paid")
          .map((bill) => ({
            id: bill.Bill_id,
            amount: bill.Balance,
            date: formatDate(bill.Billing_startdate),
            description: `Bill #INV-${bill.Bill_id}`,
            paidDate: bill.Paid_at ? new Date(bill.Paid_at) : "N/A",
          })),
      };
  
      return NextResponse.json({userAccounts,transformedBills}, { status: 200 });
    } catch (error) {
      console.error("Error fetching user accounts:", error);
      return NextResponse.json({ success: false, message: "Failed to fetch user accounts" }, { status: 500 });
    }
}  

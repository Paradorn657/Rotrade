import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";


export async function GET(request: Request) {
  // ดึง query parameter จาก URL เช่น ?userId=123
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  try {
    const bills = await prisma.bills.findMany({
      where: { User_id: Number(userId) },
      orderBy: { Billing_startdate: 'desc' },
    });

    // แปลงข้อมูลในรูปแบบที่ client ต้องการ
    const result = bills.map(bill => {
      // คำนวณ totalProfit และ serviceFee จาก dealsData ถ้าต้องการ
      const deals = bill.dealsData || [];
      const totalProfit = Array.isArray(deals)
        ? deals.reduce((sum:number, deal: any) => sum + deal.profit, 0)
        : 0;
      const serviceFee = totalProfit * 0.1;

      return {
        bill: {
          Bill_id: bill.Bill_id,
          User_id: bill.User_id,
          Billing_startdate: bill.Billing_startdate,
          Billing_enddate: bill.Billing_enddate,
          status: bill.status,
          Balance: bill.Balance,
          Deals_count: bill.Deals_count,
        },
        deals,
        totalProfit,
        serviceFee,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching bills:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    // ดึงข้อมูลบิลจาก DB (หา User_id ที่ตรงกัน)
    const bill = await prisma.bills.findMany({
      where: { User_id: Number(userId) },
    });

    if (!bill) {
      return NextResponse.json({ message: "Bill not found" }, { status: 404 });
    }

    // ดึงข้อมูลดีลจาก API `/api/get-history`
    const response = await fetch("http://localhost:3000/api/get-history"); // ใช้ URL เต็มถ้าต้องการเรียก API ภายใน
    const data = await response.json();
    const allDeals = data.flatMap((item: any) => item.deals || []);

    // กรองเฉพาะดีลที่อยู่ในช่วงเวลาของบิล และมีกำไร
    const billsWithDeals = bill.map((singleBill) => {
      const filteredDeals = allDeals.filter((deal: any) => {
          const dealTime = new Date(deal.time * 1000);
          return (
              dealTime >= new Date(singleBill.Billing_startdate) &&
              dealTime <= new Date(singleBill.Billing_enddate)
          );
      });
  
      const totalProfit = filteredDeals.reduce((sum: number, deal: any) => sum + deal.profit, 0);
      const serviceFee = totalProfit * 0.1; // ค่าบริการ 10%
  
      return {
          ...singleBill,
          deals: filteredDeals,
          totalProfit: totalProfit.toFixed(2),
          serviceFee: serviceFee.toFixed(2),
      };
  });
  
  return NextResponse.json(billsWithDeals);
  } catch (error) {
    console.error("Error fetching bill details:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

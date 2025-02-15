import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const { token, deals } = requestData;

    // ค้นหา userId จาก token ในตาราง mt5account
    const account = await prisma.mt5Account.findUnique({
      where: { api_token:token },
    });

    if (!account) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    const userId = account.user_id;
    console.log('สร้าง bills สำหรับ user id:', userId);

    if (!deals || deals.length === 0) {
      return NextResponse.json({ message: "No trade history available" });
    }

    // ตรวจหาวันที่เก่าสุด และวันที่ใหม่สุดจากดีล
    const timestamps = deals.map(deal => deal.time * 1000);
    const minDate = new Date(Math.min(...timestamps));
    const maxDate = new Date(Math.max(...timestamps));

    let currentStart = new Date(minDate);
    let bills = [];

    while (currentStart <= maxDate) {
      let currentEnd = new Date(currentStart);
      currentEnd.setDate(currentEnd.getDate() + 10);

      if (currentEnd > maxDate) break;

      // ตรวจสอบว่าช่วง [currentStart, currentEnd] มีการทับซ้อนกับบิลใดที่มีอยู่แล้วหรือไม่
      const existingBill = await prisma.bills.findFirst({
        where: {
          User_id: userId,
          // ตรวจสอบว่า ช่วงเวลาบิลเก่าทับซ้อนกับช่วงใหม่หรือไม่
          Billing_startdate: { lt: currentEnd },
          Billing_enddate: { gt: currentStart },
        },
      });

      if (existingBill) {
        console.log(`พบบิลซ้ำในช่วง ${currentStart.toISOString()} - ${currentEnd.toISOString()} ไม่สร้างซ้ำ`);
      } else {
        const filteredDeals = deals.filter(deal => {
          const dealDate = new Date(deal.time * 1000);
          return dealDate >= currentStart && dealDate <= currentEnd;
        });

        const totalProfit = filteredDeals.reduce((sum, deal) => sum + deal.profit, 0);

        const dealCount = filteredDeals.length;

        if (totalProfit > 0) {
          const serviceFee = totalProfit * 0.1;
          const newBill = await prisma.bills.create({
            data: {
              User_id: userId,
              Billing_startdate: currentStart,
              Billing_enddate: currentEnd,
              Balance: serviceFee,
              status: "Unpaid",
              Deals_count: dealCount,
              dealsData: filteredDeals, // เก็บข้อมูล JSON ของ filteredDeals
            },
          });
          bills.push({ bill: newBill, deals: filteredDeals });
        } else {
          console.log('ไม่สร้างบิลเพราะขาดทุน', totalProfit);
        }
      }
      currentStart.setDate(currentStart.getDate() + 10);
    }

    return NextResponse.json({ message: "Bills created successfully", bills });
  } catch (error) {
    console.error("Error creating bills:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

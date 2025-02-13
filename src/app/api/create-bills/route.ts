import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const userId = await req.json();
    console.log('สร้าง bills สำหรับ user id:', userId.userId);

    // ดึงข้อมูลการเทรดจาก API
    const response = await fetch("http://localhost:3000/api/get-history");
    const data = await response.json();
    const allDeals = data.flatMap((item) => item.deals || []);

    // ตรวจหาวันที่เก่าสุด และวันที่ใหม่สุดจากดีล
    if (allDeals.length === 0) {
      return NextResponse.json({ message: "No trade history available" });
    }

    const timestamps = allDeals.map(deal => deal.time * 1000);
    const minDate = new Date(Math.min(...timestamps));
    const maxDate = new Date(Math.max(...timestamps));

    let currentStart = new Date(minDate);
    let bills = [];

    while (currentStart <= maxDate) {
      let currentEnd = new Date(currentStart);
      currentEnd.setDate(currentEnd.getDate() + 10); // สิ้นสุดที่ 15 วัน

      // ถ้าข้อมูลไม่ถึง 15 วันเต็ม ให้หยุด ไม่สร้างบิล
      if (currentEnd > maxDate) break;

      // ตรวจสอบว่ามีบิลอยู่แล้วหรือไม่
      const existingBill = await prisma.bills.findFirst({
        where: {
          User_id: Number(userId.userId),
          Billing_startdate: currentStart,
          Billing_enddate: currentEnd,
        },
      });

      if (existingBill) {
        console.log(`พบบิลซ้ำในช่วง ${currentStart.toISOString()} - ${currentEnd.toISOString()} ไม่สร้างซ้ำ`);
      } else {
        // คัดกรองดีลที่อยู่ในช่วงเวลานี้
        const filteredDeals = allDeals.filter((deal) => {
          const dealDate = new Date(deal.time * 1000);
          return dealDate >= currentStart && dealDate <= currentEnd;
        });

        // คำนวณค่าธรรมเนียม 10% ของกำไร
        const totalProfit = filteredDeals
          .reduce((sum, deal) => sum + deal.profit, 0);

        if (totalProfit > 0) {
          const serviceFee = totalProfit * 0.1; // 10% ของกำไร
    
          // สร้างบิลใหม่
          const newBill = await prisma.bills.create({
            data: {
              User_id: Number(userId.userId),
              Billing_startdate: currentStart,
              Billing_enddate: currentEnd,
              Balance: serviceFee,
              status: "Unpaid",
            },
          });
    
          bills.push({ bill: newBill, deals: filteredDeals });
      }else{
        console.log('ไม่สร้างบิลเพราะขาดทุน',totalProfit)
      }

      // เลื่อนไปอีก 15 วัน
      currentStart.setDate(currentStart.getDate() + 10);
    }
  }

    return NextResponse.json({ message: "Bills created successfully", bills });
  } catch (error) {
    console.error("Error creating bills:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

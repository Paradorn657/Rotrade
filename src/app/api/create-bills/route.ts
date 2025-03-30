import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const { token, deals } = requestData;

    // ค้นหา userId จาก token ในตาราง mt5account
    const account = await prisma.mt5Account.findUnique({
      where: { api_token: token },
    });

    if (!account) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    const userId = account.user_id;
    const mt5AccountId = account.MT5_accountid; // ✅ ดึง MT5_accountid
    console.log('สร้าง bills สำหรับ user id:', userId, 'บัญชี MT5:', mt5AccountId);

    if (!deals || deals.length === 0) {
      return NextResponse.json({ message: "No trade history available" });
    }

    //เช็คว่าบิลเกิน 2 รอบชำระหรือไม่
    const unpaidBillsCount = await prisma.bills.count({
      where: {
        User_id: userId,
        status: "Unpaid",
        Bill_show:true
      }
    });

    // ถ้าผู้ใช้มี 2 บิลที่ค้างชำระอยู่แล้ว ให้เปลี่ยน role เป็น BAN
    if (unpaidBillsCount >= 2) {
      console.log(`🔴 ผู้ใช้ ${userId} ถูก BAN เนื่องจากมีบิลค้างชำระเกิน 2 รอบบิล`);

      await prisma.user.update({
        where: { id: userId },
        data: { role: "BAN" }
      });

      //ปิดสัญญานเทรดทั้งหมด ถ้าโดนแบน

      await prisma.mt5Account.updateMany({
        where: { user_id: userId },
        data: { signal_status: "OFF" }
      });
    }





    // ตรวจหาวันที่เก่าสุด และวันที่ใหม่สุดจากดีล
    // ปรับ timestamp จาก GMT+2 ให้เป็น UTC
    const timestamps = deals.map((deal: { time: number; }) => (deal.time * 1000) - (2 * 60 * 60 * 1000));
    const minDate = new Date(Math.min(...timestamps));
    const maxDate = new Date(Math.max(...timestamps));

    let currentStart = new Date(minDate);
    const bills = [];
    console.log('mindate:', minDate.toISOString(), "maxDate:", maxDate.toISOString());

    let lastBilledDate: Date | null = null; // ตัวแปรเก็บวันที่ตัดบิลรอบสุดท้าย
    while (currentStart <= maxDate) {
      const currentEnd = new Date(currentStart);
      // เพิ่มเวลา 1 นาทีในรูปแบบ UTC
      // currentEnd.setUTCMinutes(currentEnd.getUTCMinutes() + 1);
      currentEnd.setUTCDate(currentEnd.getUTCDate() + 15);

      if (currentEnd > maxDate) {
        console.log('currentEnd > maxDate', maxDate.toISOString(), " - ", currentEnd.toISOString());
        break;
      }

      // ตรวจสอบว่าช่วง [currentStart, currentEnd] มีการทับซ้อนกับบิลที่มีอยู่หรือไม่
      const existingBill = await prisma.bills.findFirst({
        where: {
          User_id: userId,
          MT5_accountid: mt5AccountId,
          Billing_startdate: { lt: currentEnd },
          Billing_enddate: { gt: currentStart },
        },
      });

      if (existingBill) {
        console.log(`พบบิลซ้ำของ MT5 ${mt5AccountId} ในช่วง ${currentStart.toISOString()} - ${currentEnd.toISOString()} ไม่สร้างซ้ำ`);
      } else {
        const filteredDeals = deals.filter((deal: { time: number; }) => {
          // ปรับ timestamp จาก GMT+2 เป็น UTC ก่อนเปรียบเทียบ
          const dealDate = new Date((deal.time * 1000) - (2 * 60 * 60 * 1000));
          return dealDate >= currentStart && dealDate <= currentEnd;
        });

        const totalProfit = filteredDeals.reduce((sum: any, deal: { profit: any; }) => sum + deal.profit, 0);
        const dealCount = filteredDeals.length;
        let BILLSHOW;

        if (totalProfit > 0) {
          console.log(`🟢 มีกำไรในช่วง ${currentStart.toISOString()} - ${currentEnd.toISOString()}`);
          BILLSHOW = true;
          const serviceFee = totalProfit * 0.1;
          const newBill = await prisma.bills.create({
            data: {
              User_id: userId,
              MT5_accountid: mt5AccountId,
              Billing_startdate: currentStart,
              Billing_enddate: currentEnd,
              Balance: serviceFee,
              status: "Unpaid",
              Deals_count: dealCount,
              Bill_show: BILLSHOW,
              dealsData: filteredDeals,
            },
          });
          bills.push({ bill: newBill, deals: filteredDeals });
        } else if (totalProfit < 0) {
          console.log(`🔴 ขาดทุนในช่วง ${currentStart.toISOString()} - ${currentEnd.toISOString()}`);
          BILLSHOW = false;
          const serviceFee = 0;
          const newBill = await prisma.bills.create({
            data: {
              User_id: userId,
              MT5_accountid: mt5AccountId,
              Billing_startdate: currentStart,
              Billing_enddate: currentEnd,
              Balance: serviceFee,
              status: "Unpaid",
              Deals_count: dealCount,
              Bill_show: BILLSHOW,
              dealsData: filteredDeals,
            },
          });
          bills.push({ bill: newBill, deals: filteredDeals });
          lastBilledDate = currentEnd; // อัปเดตวันที่ตัดบิลล่าสุด
        } else {
          console.log(`⚪ ไม่มีกำไรหรือขาดทุนในช่วง ${currentStart.toISOString()} - ${currentEnd.toISOString()}`);
          // ไม่สร้างบิล
        }
      }
      // อัปเดต currentStart เป็น currentEnd เพื่อให้ช่วงต่อเนื่อง
      currentStart = new Date(currentEnd);
    }

    // อัปเดต last_billed เป็น currentEnd ของบิลสุดท้ายที่ถูกสร้าง
    if (lastBilledDate) {
      await prisma.mt5Account.update({
        where: { MT5_accountid: String(mt5AccountId), api_token: String(token) },
        data: { last_billed: lastBilledDate },
      });
      console.log(`อัปเดต last_billed ของ MT5 ${mt5AccountId} เป็น ${lastBilledDate.toISOString()}`);
    }


    return NextResponse.json({ message: "Bills created successfully", bills });
  } catch (error) {
    console.error("Error creating bills:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

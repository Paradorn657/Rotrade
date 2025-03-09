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
        status: "Unpaid"
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
    const timestamps = deals.map((deal: { time: number; }) => deal.time * 1000);
    const minDate = new Date(Math.min(...timestamps));
    const maxDate = new Date(Math.max(...timestamps));

    let currentStart = new Date(minDate);
    let bills = [];
    console.log('mindate:', minDate, "maxDate: ", maxDate);
    while (currentStart <= maxDate) {
      let currentEnd = new Date(currentStart);
      currentEnd.setDate(currentEnd.getDate() + 3);

      if (currentEnd > maxDate) {
        console.log('currentEnd > maxDate ', maxDate, " - ", currentEnd);
        break;
      }

      // ตรวจสอบว่าช่วง [currentStart, currentEnd] มีการทับซ้อนกับบิลใดที่มีอยู่แล้วหรือไม่
      const existingBill = await prisma.bills.findFirst({
        where: {
          User_id: userId,
          MT5_accountid: mt5AccountId,
          // ตรวจสอบว่า ช่วงเวลาบิลเก่าทับซ้อนกับช่วงใหม่หรือไม่
          Billing_startdate: { lt: currentEnd },
          Billing_enddate: { gt: currentStart },
        },
      });

      if (existingBill) {
        console.log(`พบบิลซ้ำของ MT5 ${mt5AccountId} ในช่วง ${currentStart.toISOString()} - ${currentEnd.toISOString()} ไม่สร้างซ้ำ`);
      } else {
        const filteredDeals = deals.filter(deal => {
          const dealDate = new Date(deal.time * 1000);
          return dealDate >= currentStart && dealDate <= currentEnd;
        });

        const totalProfit = filteredDeals.reduce((sum, deal) => sum + deal.profit, 0);

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
          const serviceFee = 0; // หรือคิดค่าบริการตามเงื่อนไขที่ต้องการสำหรับกรณีขาดทุน
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
        } else {
          // กรณี totalProfit = 0 พอดี
          console.log(`⚪ ไม่มีกำไรหรือขาดทุนในช่วง ${currentStart.toISOString()} - ${currentEnd.toISOString()}`);
          // ไม่สร้างบิล
        }
      }
      currentStart.setDate(currentStart.getDate() + 3);
    }

    return NextResponse.json({ message: "Bills created successfully", bills });
  } catch (error) {
    console.error("Error creating bills:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

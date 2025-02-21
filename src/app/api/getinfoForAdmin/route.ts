import { NextResponse } from "next/server"; // นำเข้า NextResponse
import { getServerSession } from "next-auth";
import { prisma } from "../../../../lib/prisma"; // หรือ import ตามที่คุณตั้งชื่อ prisma client ของคุณ
import { authOptions } from "../../../../lib/authOptions";
 // ตั้งค่า authOptions ของคุณ

export async function GET() {
  try {
    // ตรวจสอบ session ของผู้ใช้
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalUsers = await prisma.user.count();
    const previousTotalUsers = await prisma.user.count({
      where: {
        create_at: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          lt: new Date(new Date().setMonth(new Date().getMonth())),
        },
      },
    });

    const userGrowth = previousTotalUsers > 0
      ? ((totalUsers - previousTotalUsers) / previousTotalUsers) * 100
      : 0;

    const totalCommission = await prisma.bills.aggregate({
      _sum: {
        Balance: true,
      },
    });
    const previousTotalCommission = await prisma.bills.aggregate({
      _sum: {
        Balance: true,
      },
      where: {
        Billing_startdate: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          lt: new Date(new Date().setMonth(new Date().getMonth())),
        },
      },
    });
    const commissionGrowth = previousTotalCommission._sum.Balance && totalCommission._sum.Balance && previousTotalCommission._sum.Balance > 0 
      ? ((totalCommission._sum.Balance - previousTotalCommission._sum.Balance) / previousTotalCommission._sum.Balance) * 100 
      : 0;

    const totalMT5Accounts = await prisma.mt5Account.count();
    const runningRobots = await prisma.mt5Account.count({
      where: {
        signal_status: "ON",
      },
    });


    const usersDB = await prisma.user.findMany({
      where: {
        NOT: {
          id: Number(session?.user.id),
        },
      },
    });

    return NextResponse.json({ totalUsers,userGrowth,totalCommission,commissionGrowth,totalMT5Accounts,runningRobots, usersDB });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

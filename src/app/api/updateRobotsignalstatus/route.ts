import { prisma } from "../../../../lib/prisma"; // นำเข้า Prisma Client
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { id, signal_status } = await req.json();

        console.log('signal status:',id, signal_status )

        if (id === undefined || signal_status === undefined) {
            return NextResponse.json({ error: "Missing ID or signal_status" }, { status: 400 });
        }

        // อัปเดต signal_status ในฐานข้อมูล
        const MT5 = await prisma.mt5Account.findUnique({
            where: { MT5_id: id },
            include: { user: true },
        })
        console.log(MT5?.user.role)

        
        if (MT5?.user.role === "BAN") {
            return NextResponse.json({ error: "Banned user can not update signal status" }, { status: 403 });
        }

        const updatedAccount = await prisma.mt5Account.update({
            where: { MT5_id: id },
            data: { signal_status }, // ค่าใหม่ที่รับเข้ามา
        });


        return NextResponse.json(updatedAccount);
    } catch (error) {
        console.error("Database update error:", error);
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}

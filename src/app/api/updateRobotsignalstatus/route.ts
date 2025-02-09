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

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // ตรวจสอบว่าไฟล์ prisma.ts ถูกตั้งค่าไว้

export async function GET(request: Request) {
    try {
        // ดึง Query Params จาก URL
        const { searchParams } = new URL(request.url);
        const accountId = searchParams.get("mt5_id");
        const api_token = searchParams.get("api_token");

        console.log(accountId,api_token)

        // ถ้าไม่มี accountId ให้ส่ง error กลับ
        if (!accountId) {
            return NextResponse.json({ error: "MT5_accountid is required" }, { status: 400 });
        }

        // ค้นหา MT5 Account ใน Database
        const account = await prisma.mt5Account.findUnique({
            where: { 
                api_token: api_token || "null",
                MT5_accountid: accountId,
            },
            include: { user: true },
        });

        // ถ้าไม่พบ Account หรือ ไม่มี Model ที่เชื่อม ให้ส่ง error กลับ
        if (!account) {
            return NextResponse.json({ error: "MT5 status not found" }, { status: 404 });
        }

        // ส่งชื่อ Model กลับไป
        return NextResponse.json({ status:account.user.role==="BAN"});
    } catch (error) {
        console.error("Error fetching model name:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

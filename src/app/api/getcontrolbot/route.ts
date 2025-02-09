import { NextResponse } from 'next/server';  // ใช้ NextResponse
import { prisma } from '../../../../lib/prisma'; // ใช้ prisma client ที่คุณตั้งไว้

export async function GET(request:Request) {
  try {
    // ดึงข้อมูล user_id จาก query parameters
    const url = new URL(request.url);
    const user_id = url.searchParams.get("user_id");

    // ตรวจสอบว่ามี user_id หรือไม่
    if (!user_id) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    // ดึงข้อมูล MT5Account ที่มี user_id ตรงกับ session และ status เป็น "Connect"
    const mt5Accounts = await prisma.mt5Account.findMany({
      where: {
        user_id: parseInt(user_id),  // เปลี่ยนเป็นตัวเลขตามรูปแบบฐานข้อมูล
        status: "Connected",
        model_id: {
            not: null,  // เลือกเฉพาะแถวที่ model_id ไม่ใช่ null
          },
      },
      include:{
        model:true
      }
    });

    console.log("return",mt5Accounts)

    // ส่งข้อมูลกลับเป็น JSON
    return NextResponse.json(mt5Accounts, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
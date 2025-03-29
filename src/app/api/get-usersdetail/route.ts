import { NextResponse } from "next/server"; // นำเข้า NextResponse
import { prisma } from "../../../../lib/prisma"; // หรือ import ตามที่คุณตั้งชื่อ prisma client ของคุณ
 // ตั้งค่า authOptions ของคุณ

export async function GET(request:Request) {


    const {searchParams} = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
        return NextResponse.json({ message: "Missing userId" }, { status: 400 });
      }
    try {
        const usersDB = await prisma.user.findUnique({
            where:{
                id:Number(userId)
            },
            include:{
                Bills:true,
                mt5Accounts:{
                    include:{
                        model:true
                    }
                }
            }
          });


          return NextResponse.json({usersDB});

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Cant get user data for userDashboard" }, { status: 500 });
    }
}
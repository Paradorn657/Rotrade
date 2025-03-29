import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

let tradeHistory: any[] = []; //{token,history} 


export async function POST(req: NextRequest) {
    
    try {
        const {token,orders, deals} = await req.json();

        console.log(token)

        if (!orders|| !deals) {
            return NextResponse.json({ error: "Invalid trade data" }, { status: 400 });
        }

        tradeHistory = [{ orders, deals}]; // เขียนทับตัวเก่า

        console.log("🔹 New Trade History Received:", tradeHistory);

        //พอได้รับ history แล้วคำนวนเลย

        const user = await prisma.mt5Account.findUnique({
            where: {
                api_token:token
            }
        })

        const createBillResponse = await fetch("http://localhost:3000/api/create-bills", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: user?.user_id }),
        });

        await createBillResponse.json();
        console.log("🧾 Bill Created:");


        return NextResponse.json({ success: true, message: "Trade history updated" }, { status: 200 });
    } catch (error) {
        console.error("❌ Error processing trade history:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json(tradeHistory, { status: 200 });
}

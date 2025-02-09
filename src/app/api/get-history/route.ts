import { NextRequest, NextResponse } from "next/server";

let tradeHistory: any[] = [];

export async function POST(req: NextRequest) {
    try {
        const trades = await req.json();

        if (!trades.orders || !trades.deals) {
            return NextResponse.json({ error: "Invalid trade data" }, { status: 400 });
        }

        tradeHistory.push(trades); // เก็บข้อมูลเพิ่ม (ถ้าต้องการให้เก็บหลายรายการ)

        console.log("🔹 New Trade History Received:", tradeHistory);

        return NextResponse.json({ success: true, message: "Trade history updated" }, { status: 200 });
    } catch (error) {
        console.error("❌ Error processing trade history:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json(tradeHistory, { status: 200 });
}

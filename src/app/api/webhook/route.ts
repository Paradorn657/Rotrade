import Stripe from "stripe";
import { stripe } from "../../../../lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {

    const body = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!);

    } catch {
        return new NextResponse("invalid signature", { status: 400 })
    }
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("✅ Payment Success!");
        console.log(paymentIntent)
        console.log("📧 Customer name:", paymentIntent.metadata.customerName);
        console.log("👤 User ID:", paymentIntent.metadata.userId);
        console.log("FOR MT5 ID:", paymentIntent.metadata.forMT5id);
        console.log("BIll ID:", paymentIntent.metadata.billid);


        await prisma.bills.update({
            where: {
                Bill_id: Number(paymentIntent.metadata.billid),
                MT5_accountid: paymentIntent.metadata.forMT5id
            },
            data: {
                status: "Paid",
                Paid_at: new Date(),
            }
        })

        const userId = paymentIntent.metadata.userId;
        const unpaidBillsCount = await prisma.bills.count({
            where: {
                User_id: Number(userId),
                Bill_show: true, //เลือกนับเฉพาะบิลที่เก็บตังค์
                status: "Unpaid"
            }
        });

        // ถ้าจำนวนบิลที่ค้างชำระน้อยกว่า 2 บิล และผู้ใช้มี role เป็น "BAN" ให้ปลดแบน
        if (unpaidBillsCount < 2) {
            // ตรวจสอบว่าผู้ใช้ถูกแบนอยู่หรือไม่
            const user = await prisma.user.findUnique({
                where: { 
                    id: Number(userId) ,
                },
                select: { role: true }
            });

            if (user && user.role === "BAN") {
                console.log(`🟢 ปลดแบนผู้ใช้ ${userId} เนื่องจากมีบิลค้างชำระน้อยกว่า 2 บิล (เหลือ ${unpaidBillsCount} บิล)`);

                await prisma.user.update({
                    where: { id: Number(userId) },
                    data: { role: "user" } // เปลี่ยน role กลับเป็น USER หรือค่าเริ่มต้นที่คุณต้องการ
                });
            }
        }


    }
    return new NextResponse("ok", { status: 200 })
}

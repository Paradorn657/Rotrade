import Stripe from "stripe";
import { stripe } from "../../../../lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest, res: NextResponse) {

    const body = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!);

    } catch (error) {
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


        const updatedBill = await prisma.bills.update({
            where: {
                Bill_id: Number(paymentIntent.metadata.billid),
                MT5_accountid: paymentIntent.metadata.forMT5id
            },
            data: {
                status: "Paid",
            }
        })

        const mtAccount = await prisma.mt5Account.findFirst({
            where: {
                user_id: Number(paymentIntent.metadata.userId),
                MT5_accountid: paymentIntent.metadata.forMT5id
            }
        });
        
        // ถ้าพบข้อมูล จึงอัปเดต
        if (mtAccount) {
            await prisma.mt5Account.update({
                where: {
                    MT5_id: mtAccount.MT5_id
                },
                data: {
                    last_billed: new Date()
                }
            });
            console.log(`🟢 อัปเดต last_billed สำหรับ MT5_id: ${mtAccount.MT5_id} สำเร็จ`);
        } else {
            console.log(`❌ ไม่พบข้อมูล mt5Account สำหรับ user_id: ${paymentIntent.metadata.userId} และ MT5_accountid: ${paymentIntent.metadata.forMT5id}`);
        }

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

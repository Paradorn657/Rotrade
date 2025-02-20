import Stripe from "stripe";
import { stripe } from "../../../../lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest,res:NextResponse) {

    const body = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!);

    } catch (error) {
        return new NextResponse("invalid signature",{status:400})
    }
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("✅ Payment Success!");
        console.log(paymentIntent)
        console.log("📧 Customer name:", paymentIntent.metadata.customerName);
        console.log("👤 User ID:", paymentIntent.metadata.userId);
        console.log("BIll ID:", paymentIntent.metadata.billid);


        const updatedBill = await prisma.bills.update({
            where:{
                Bill_id:Number(paymentIntent.metadata.billid)
            },
            data:{
                status:"PAID"
            }
        })
      }
    return new NextResponse("ok",{status:200})
}

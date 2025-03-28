
import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { amount,usersession,selectedbill } = await request.json();

    // ตรวจสอบว่าจำนวนเงินต้องไม่น้อยกว่า 1000 satang (10 บาท)
    if (amount < 1000) {
      return NextResponse.json(
        { error: "Amount must be at least 1000 satang (10 THB)." },
        { status: 400 }
      );
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: usersession.user.id, // ระบุไอดีของลูกค้า
        customerName:usersession.user.name,
        forMT5id: selectedbill.bill.MT5_accountid,
        billid: selectedbill.bill.Bill_id, 
      }
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Internal error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}

import Stripe from "stripe";
import { stripe } from "../../../../lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest,res:NextResponse) {


    

    const body = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!);

            console.log('event',event)
    } catch (error) {
        return new NextResponse("invalid signature",{status:400})
    }
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('session',session)
    if(event.type === 'checkout.session.completed'){
        console.log("payment success for user");
    }
    return new NextResponse("ok",{status:200})
}

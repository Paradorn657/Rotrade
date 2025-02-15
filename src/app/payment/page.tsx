'use client'

import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { deflateRaw } from 'zlib';
import { useEffect, useState } from 'react';
import { CheckoutPage } from '@/components/Payment';

if(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY===undefined){
    throw new Error("cant find stripe public key");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function StripePayment(){
    const amount = 200;
    const cents = amount *100;

    return(
        <div>
            <h1>TEST STRIPE</h1>
            <Elements stripe={stripePromise}
                options={{
                    mode:"payment",
                    amount:  cents,
                    currency:"usd"
                }}  
            >            
                <CheckoutPage amount={cents}/>
            </Elements>
        </div>
    )
}
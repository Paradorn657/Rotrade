import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma';
import { authOptions } from '../../../../lib/authOptions';
import { getServerSession } from 'next-auth';

export async function POST(req: Request) {
  try {
    const { token, mt5_id, action ,balance} = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    
    console.log(token)

    const mt5account = await prisma.mt5Account.findUnique({
      where:{api_token:token,MT5_accountid:mt5_id}
    })
    if (!mt5account) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    else{
    console.log("Found account",mt5account.MT5_accountid);
    const newStatus = action === "connect" ? "Connected" : "Disconnected";
    const newBalance = action === "connect" ? balance : mt5account.balance;
    const updatedAccount = await prisma.mt5Account.update({
        where: { api_token: token ,MT5_accountid:String(mt5_id)},  
        data: { status: newStatus ,
            balance:newBalance
        },
    });
    }


    return NextResponse.json({
      valid: true,
      message: 'Token verified and update status'
    });
  } catch (error: any) {
    console.error('Token verification or database operation failed:', error.message);
    return NextResponse.json(
      { valid: false, error: error.message },
      { status: 401 }
    );
  }
}


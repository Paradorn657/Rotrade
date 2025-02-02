// app/api/create-token/route.js
import { getServerSession } from "next-auth";
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/authOptions";


export async function POST(req:any) {
  const { token, mt5Id, mt5Name } = await req.json();

  if (!token || !mt5Id || !mt5Name) {
    return new Response(JSON.stringify({ message: 'Missing fields' }), {
      status: 400,
    });
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ message: 'User session not found' }), {
      status: 401,
    });
  }

  try {

    const existingAccount = await prisma.mt5Account.findFirst({
        where: {
          OR: [
            { MT5_accountid: mt5Id },
            { api_token: token }, // ตรวจสอบว่า token นี้มีอยู่แล้วหรือไม่
          ],
        },
      });
  
      if (existingAccount) {
        // ถ้ามี MT5 ID หรือ token นี้แล้ว แจ้ง error กลับไป
        return new Response(
          JSON.stringify({ message: 'MT5 ID or Token already in use' }),
          { status: 400 }
        );
      }

    const newAccount = await prisma.mt5Account.create({
      data: {
        user_id:parseInt(session.user.id, 10),
        MT5_accountid:mt5Id,
        MT5_name:mt5Name,
        api_token:token,
        status: 'disconnect',  
        balance: 0,            
      },
    });

    return new Response(JSON.stringify(newAccount), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: 'Failed to create token' }),
      { status: 500 }
    );
  }
}
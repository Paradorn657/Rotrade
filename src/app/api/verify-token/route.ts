import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma';
import { authOptions } from '../../../../lib/authOptions';
import { getServerSession } from 'next-auth';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';



export async function POST(req: Request) {
  try {
    const { token, MT5_id, balance } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    if (!MT5_id || !balance) {
      return NextResponse.json(
        { error: 'MT5_id and balance are required' },
        { status: 400 }
      );
    }

    // Verify the token
    const decoded:any = jwt.verify(token, SECRET_KEY);

    console.log(decoded.e)

    // Get the user session

    const session = await getServerSession(authOptions);
    console.log(session)
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'User session not found' },
        { status: 401 }
      );
    }

    const user_id_string = session.user.id;
    const user_id = parseInt(user_id_string, 10)

    const newRecord = await prisma.mt5Account.create({
      data: {
        MT5_id, // Primary Key
        MT5_name: 'paradorn', // Hardcoded name for now
        user_id, // From session
        api_token: token, // Verified token
        model_id: null, // Default value
        status: 'disconnect', // Default status
        balance, // From request
      },
    });

    return NextResponse.json({
      valid: true,
      message: 'Token verified and data saved to the database',
      data: newRecord,
    });
  } catch (error: any) {
    console.error('Token verification or database operation failed:', error.message);
    return NextResponse.json(
      { valid: false, error: error.message },
      { status: 401 }
    );
  }
}


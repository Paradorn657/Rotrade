import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate a random MT5 Instance ID
    const mt5InstanceId = Math.random().toString(36).substring(2, 10);


    const payload = { e: email, m: mt5InstanceId }; // ใช้ key สั้นลงใน payload

    // Generate JWT Token with HS256 algorithm (shorter signature)
    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: '1h',
      algorithm: 'HS256',
    });

    return NextResponse.json({ token, mt5InstanceId });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

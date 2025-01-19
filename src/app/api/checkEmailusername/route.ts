import { prisma } from "../../../../lib/prisma";


export async function POST(req: Request) {
    try {
        const body = await req.json(); // รับข้อมูลจาก request body
        const { email, username } = body;

        // ตรวจสอบว่ามี email หรือ username ซ้ำในฐานข้อมูลหรือไม่
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { name: username }, // ใช้ "name" ตามที่ schema ของคุณระบุ
                ],
            },
        });

        if (existingUser) {
            // หากพบความซ้ำ ส่งสถานะ 400 พร้อมข้อความแจ้งเตือน
            return new Response(
                JSON.stringify({
                    error: existingUser.email === email 
                        ? 'Email already exists' 
                        : 'Username already exists',
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // หากไม่พบความซ้ำ ส่งสถานะ 200
        return new Response(
            JSON.stringify({ message: 'No duplicates found' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error checking duplicates:', error);

        // ส่งสถานะ 500 หากเกิดข้อผิดพลาดในเซิร์ฟเวอร์
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
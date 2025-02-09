import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

import { hash } from 'bcrypt';


export async function POST(req: NextRequest) {
    try {
        const { userId, newUsername, newPassword } = await req.json()
        console.log(userId, newUsername, newPassword )

        if (!userId) {
            return NextResponse.json(
                { error: 'Missing userId' },
                { status: 400 }
            );
        }
        let updateUser;

        if (newUsername) { //ถ้ามี newusername มาก็ อัปเดต ถ้า password มาก็อัปเดต
            updateUser = await prisma.user.update({
                where: {
                    id: Number(userId)
                },
                data: {
                    name: newUsername
                }
            })
        }

        if (newPassword!="") {
            const hashednewPassword = await hash(newPassword, 10);
            updateUser = await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    password: hashednewPassword
                }
            })

        }
        return NextResponse.json(updateUser);

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );

    }
}
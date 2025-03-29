import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

import { hash,compare } from 'bcrypt';


export async function POST(req: NextRequest) {
    try {
        const { userId, newUsername} = await req.json()
        console.log(userId, newUsername)

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
        return NextResponse.json(updateUser);

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );

    }
}

export async function PATCH(req: NextRequest) {
    try {
        const { userId, newPassword, password } = await req.json()
        console.log(userId, newPassword, password)

        if(!newPassword || !password) {
            return NextResponse.json(
                { error: 'Missing newPassword or password' },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { error: 'Missing userId' },
                { status: 400 }
            );
        }
        const userdata = await prisma.user.findFirst({
            where: { id: Number(userId) }
        });

        if (!userdata) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }
        // Check if the password is correct
        if (!userdata.password) {
            return NextResponse.json(
                { error: 'User password not found' },
                { status: 404 }
            );
        }

        const isPasswordValid = await compare(password, userdata.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Incorrect Current password' },
                { status: 401 }
            );
        }
        else{
            const hashednewPassword = await hash(newPassword, 10);
            await prisma.user.update({
                where: {
                    id: Number(userId)
                },
                data: {
                    password: hashednewPassword
                }
            })
        }
        return NextResponse.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );

    }
}
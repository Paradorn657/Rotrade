import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma";

import { hash } from 'bcrypt';


export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, username, password } = body;


        const existingEmail = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingEmail) {
            return NextResponse.json({ user: null, message: "email already used"}, {status: 409 })
        }

        const existingUsername = await prisma.user.findFirst({
            where: { name: username }
        });

        if (existingUsername) {
            return NextResponse.json({ user: null, message: "username already used" }, { status: 409 })
        }

        const hashedPassword = await hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                name: username,
                password: hashedPassword
            }
        })

        const {password:newUserPassword , ...rest} = newUser;



        return NextResponse.json({ user: rest, message: "User created success" }, { status: 201 });


    } catch (error) {

        return NextResponse.json({message: "Something went wrong!" }, { status: 500 });

    }
}
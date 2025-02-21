
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function DELETE(req: NextRequest) {
    try {
        const {userid} = await req.json();

        if(!userid){
            return NextResponse.json({error:"user id is required"},{status:400})
        }

        const deleteuser = await prisma.user.delete({
            where:{
                id:userid
            }
        })
        console.log("ลบ user",deleteuser)

        return NextResponse.json({ message: 'User deleted successfully', user: deleteuser });
  
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
    
}
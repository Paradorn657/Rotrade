import {  NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";


export async function DELETE(req:Request){
    try {
        const {mt5_id} = await req.json();
        
        if(!mt5_id){
            return NextResponse.json({error:"mt5 id is required"},{status:400})
        }
        const deletemt5 = await prisma.mt5Account.delete({
            where:{
                MT5_id:Number(mt5_id)
            }
        })

        console.log("ลบ mt5",deletemt5)
        return NextResponse.json({ message: 'mt5 deleted successfully', mt5: deletemt5 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete mt5'+error }, { status: 500 });
    }
}
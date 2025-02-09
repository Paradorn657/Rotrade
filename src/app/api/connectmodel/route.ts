// /pages/api/updateMt5Account.ts
import { getServerSession } from "next-auth";
import { prisma } from "../../../../lib/prisma";  // ปรับ path ให้ตรงกับที่ใช้งาน
import { authOptions } from "../../../../lib/authOptions";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const { mt5_id, selectedModelId } = await req.json();

  

  // ตรวจสอบ session ของผู้ใช้
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!mt5_id || !selectedModelId) {
    return NextResponse.json({ message: "mt5 Id and Model ID are required" }, { status: 400 });
  }
  try {

    console.log("recieve",mt5_id,selectedModelId )

    const existingAccount = await prisma.mt5Account.findUnique({
      where: { MT5_id: mt5_id },
    });

    if (!existingAccount) {
      return NextResponse.json({ message: "MT5 account not found" }, { status: 404 });
    }
    
    // อัปเดต mt5Account
    const updatedAccount = await prisma.mt5Account.update({
      where: {
        MT5_id: mt5_id, // ใช้ MT5_id ในการค้นหากับ update
      },
      data: {
        model_id: selectedModelId, // อัปเดต model_id
      },
    });

    return NextResponse.json(updatedAccount); 
  } catch (error) {
    console.error("Error updating MT5 account:", error);
    return NextResponse.json({ message: "Failed to update MT5 account" }, { status: 500 });
  }
}

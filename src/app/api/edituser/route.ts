import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { prisma } from "../../../../lib/prisma";

// ใช้ POST แต่อัปเดตแทนการสร้างใหม่
export async function POST(req: NextRequest) {
  try {
    const { userId, formData } = await req.json(); // รับข้อมูลจาก body

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email:formData.email,
        name:formData.name,
        role:formData.role
      },
    });

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ success: false, message: "Failed to update user" }, { status: 500 });
  }
}

import { getServerSession } from "next-auth";
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/authOptions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { mt5_id, selectedModelId } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!mt5_id || !selectedModelId) {
      return NextResponse.json({ message: "mt5 Id and Model ID are required" }, { status: 400 });
    }

    console.log("Received:", mt5_id, selectedModelId);

    // ✅ ดึงบัญชี MT5 และโมเดลที่ใช้อยู่ปัจจุบัน
    const existingAccount = await prisma.mt5Account.findUnique({
      where: { MT5_id: mt5_id },
      select: { model: true }, // ดึงเฉพาะ modelId ปัจจุบัน
    });

    if (!existingAccount) {
      return NextResponse.json({ message: "MT5 account not found" }, { status: 404 });
    }

    const previousModelId = existingAccount.model?.Model_id;

    // ✅ ลดจำนวน `numberofuse` ของโมเดลเก่า (-1) ถ้ามีโมเดลเดิม
    if (previousModelId) {
      await prisma.model.update({
        where: { Model_id: previousModelId },
        data: { numberofuse: { decrement: 1 } },
      });
    }

    // ✅ เพิ่มจำนวน `numberofuse` ของโมเดลใหม่ (+1)
    await prisma.model.update({
      where: { Model_id: selectedModelId },
      data: { numberofuse: { increment: 1 } },
    });

    // ✅ อัปเดตโมเดลที่บัญชี MT5 ใช้งาน
    await prisma.mt5Account.update({
      where: { MT5_id: mt5_id },
      data: { model_id: selectedModelId }, // เปลี่ยนเป็น modelId ตาม Prisma schema
    });

    return NextResponse.json({ message: "MT5 account updated successfully" });
  } catch (error) {
    console.error("Error updating MT5 account:", error);
    return NextResponse.json({ message: "Failed to update MT5 account" }, { status: 500 });
  }
}

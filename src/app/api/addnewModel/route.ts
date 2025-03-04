import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ตรวจสอบข้อมูลที่ส่งมา
    if (!body.name || !body.version) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // สร้างโมเดลใหม่ในฐานข้อมูล
    const newModel = await prisma.model.create({
      data: {
        name: body.name,
        version: body.version,
        Update_at: new Date(),
        numberofuse: body.numberofuse || 0,
      },
    });

    return NextResponse.json(newModel, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
  }
}

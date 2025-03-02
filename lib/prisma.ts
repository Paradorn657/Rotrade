import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query']
  })

// ✅ เพิ่ม Middleware ที่นี่
prisma.$use(async (params, next) => {
  if (params.model === "mt5Account" && params.action === "create") {
    const data = params.args.data;

    // ตรวจสอบว่า last_billed ยังไม่มีค่า
    if (!data.last_billed) {
      // ดึงข้อมูล create_at ของ User
      const user = await prisma.user.findUnique({
        where: { id: data.user_id },
        select: { create_at: true },
      });

      // ถ้ามี user ให้กำหนดค่า last_billed เท่ากับ create_at
      if (user) {
        data.last_billed = user.create_at;
      } else {
        data.last_billed = new Date(); // fallback เป็นวันปัจจุบัน
      }
    }
  }
  return next(params);
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
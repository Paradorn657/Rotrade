import { getServerSession } from "next-auth";
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const accounts = await prisma.mt5Account.findMany({
      where: { user_id: parseInt(session.user.id, 10) },
    });

    return new Response(JSON.stringify(accounts), { status: 200 });
  } catch (error) {
    console.error("Error fetching MT5 accounts:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch accounts" }), { status: 500 });
  }
}

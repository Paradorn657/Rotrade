import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";


export async function GET(request: Request) {
    try {

        const { searchParams } = new URL(request.url);
        const api_token = searchParams.get("api_token");

        console.log("last bill for"+api_token);
       if (!api_token) {
            return NextResponse.json({ error: "api_token is required" }, { status: 400 });
        }

        const account = await prisma.mt5Account.findUnique({
            where: {
                api_token: api_token,
            }
        });

        console.log("last bill for"+api_token,"is",account?.last_billed);

        if (!account) {
            return NextResponse.json({ error: "Mt5 Account not found" }, { status: 404 });
        }
        return NextResponse.json({ last_billed: account.last_billed });
        
    } catch (error) {
        console.error("Error fetching lastbilldate from token", error);
        return NextResponse.json({ error: "Error fetching lastbilldate from token" }, { status: 500 });
        
    }

}
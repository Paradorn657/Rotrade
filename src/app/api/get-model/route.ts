import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
prisma


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    let models;

    
    models = await prisma.model.findMany();
    

    return NextResponse.json(models, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

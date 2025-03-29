import {NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';


export async function GET() {
  try {

    
    const models = await prisma.model.findMany();
    

    return NextResponse.json(models, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

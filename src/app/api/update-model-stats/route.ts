import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // Optional: Check authentication if required
    // const session = await authSession();
    // if (!session) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    // Parse the request body
    const body = await req.json();
    const { 
      modelId, 
      winrate, 
      balance_drawdown, 
      equity_drawdown 
    } = body;

    // Validate input
    if (!modelId) {
      return NextResponse.json({ message: 'Model ID is required' }, { status: 400 });
    }

    // Check if the model exists
    const existingModel = await prisma.model.findUnique({
      where: { Model_id: modelId }
    });

    if (!existingModel) {
      return NextResponse.json({ message: 'Model not found' }, { status: 404 });
    }

    // Update model stats
    const updatedModel = await prisma.model.update({
      where: { Model_id: modelId },
      data: {
        winrate: winrate ? parseFloat(winrate) : undefined,
        balance_drawdown: balance_drawdown ? parseFloat(balance_drawdown) : undefined,
        equity_drawdown: equity_drawdown ? parseFloat(equity_drawdown) : undefined,
        Update_at: new Date() // Update the timestamp
      }
    });

    return NextResponse.json(updatedModel, { status: 200 });
  } catch (error) {
    console.error('Error updating model stats:', error);
    
    // More detailed error handling
    if (error instanceof Error) {
      return NextResponse.json({ 
        message: 'Internal Server Error', 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
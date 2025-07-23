import connect from '@/lib/db';
import AdminChallan from '@/lib/models/AdminChallan.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('---> Got request');
    await connect();

    const { id } = await params; // Get ID from dynamic route params

    if (!id) {
      return NextResponse.json(
        { message: 'Challan ID is required', status: 400 },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { accountNo, session, amount, issueDate, lastDate, maxChallan } =
      body;
    console.log('---> Got request', body);

    const existingChallan = await AdminChallan.findById(id);
    if (!existingChallan) {
      return NextResponse.json(
        { message: 'Admin Challan Not Found', status: 404 },
        { status: 404 }
      );
    }

    const updatedChallan = await AdminChallan.findByIdAndUpdate(
      id,
      {
        ...(accountNo && { accountNo }),
        ...(session && { session }),
        ...(amount && { amount }),
        ...(issueDate && { issueDate }),
        ...(lastDate && { lastDate }),
        ...(maxChallan && { maxChallan }),
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        message: 'AdminChallan updated successfully',
        status: 200,
        data: updatedChallan,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating AdminChallan:', error);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        status: 500,
      },
      { status: 500 }
    );
  }
}

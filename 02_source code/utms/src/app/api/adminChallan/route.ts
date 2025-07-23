import connect from '@/lib/db';
import AdminChallan from '@/lib/models/AdminChallan.model';
import { NextResponse } from 'next/server';

// GET: Fetch the latest admin challan or create one if none exists
export async function GET() {
  try {
    await connect();
    let adminChallan = await AdminChallan.findOne();

    if (!adminChallan) {
      // No challan exists, create a default one
      adminChallan = new AdminChallan({
        accountNo: '1234567890', // Default account number
        session: '2023-2024', // Default session
        amount: '15000', // Default amount
        issueDate: new Date().toISOString().split('T')[0], // Current date
        lastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0], // 30 days from now
        maxChallan: '10', // Default max challan
      });

      // Save the new challan to MongoDB
      await adminChallan.save();
    }

    return NextResponse.json({
      message: 'Challan Fetched Successfully',
      status: 200,
      adminChallan,
    });
  } catch (err) {
    console.error('Error fetching or creating AdminChallan:', err);
    return NextResponse.json(
      { message: 'Internal Server Error', status: 500 },
      { status: 500 }
    );
  }
}

// POST: Create a new admin challan if none exists
export async function POST(request: Request) {
  try {
    await connect();

    // Check if a challan already exists
    const existingChallan = await AdminChallan.findOne();
    if (existingChallan) {
      return NextResponse.json(
        {
          message: 'Admin Challan already exists. Use PUT to update.',
          status: 400,
        },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      accountNo = '1234567890', // Default if not provided
      session = '2023-2024',
      amount = '15000',
      issueDate = new Date().toISOString().split('T')[0], // Current date
      lastDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0], // 30 days from now
      maxChallan = '10',
    } = body;

    // Create a new AdminChallan document
    const newAdminChallan = new AdminChallan({
      accountNo,
      session,
      amount,
      issueDate,
      lastDate,
      maxChallan,
    });

    // Save the document to MongoDB
    const savedChallan = await newAdminChallan.save();

    return NextResponse.json(
      {
        message: 'AdminChallan created successfully',
        status: 201,
        data: savedChallan,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating AdminChallan:', error);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        status: 500,
      },
      { status: 500 }
    );
  }
}

// PUT: Update an existing admin challan
export async function PUT(request: Request) {
  try {
    await connect();

    // Parse request body
    const body = await request.json();
    const { accountNo, session, amount, issueDate, lastDate, maxChallan } =
      body;

    // Find the existing challan
    const existingChallan = await AdminChallan.findOne();
    if (!existingChallan) {
      return NextResponse.json(
        {
          message:
            'No Admin Challan found to update. Create one first using POST.',
          status: 404,
        },
        { status: 404 }
      );
    }

    // Update fields only if provided in the request
    const updateData: any = {};
    if (accountNo) updateData.accountNo = accountNo;
    if (session) updateData.session = session;
    if (amount) updateData.amount = amount;
    if (issueDate) updateData.issueDate = issueDate;
    if (lastDate) updateData.lastDate = lastDate;
    if (maxChallan) updateData.maxChallan = maxChallan;

    // Update the challan
    const updatedChallan = await AdminChallan.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true } // Return the updated document
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

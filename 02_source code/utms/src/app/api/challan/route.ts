import connect from '@/lib/db';
import AdminChallan from '@/lib/models/AdminChallan.model';
import Challan from '@/lib/models/Challan.model';
import { NextResponse } from 'next/server';

// POST: Create a new challan (equivalent to store)
export async function POST(request: Request) {
  try {
    const payload = await request.json(); // Parse JSON body

    // Fetch the latest admin settings to get the maxChallan value
    const latestAdminChallan = await AdminChallan.findOne().sort({
      createdAt: -1,
    });
    const maxChallan = latestAdminChallan
      ? parseInt(latestAdminChallan.maxChallan)
      : 0;

    console.log('MaxChallan value:', maxChallan);

    if (!maxChallan || isNaN(maxChallan) || maxChallan <= 0) {
      console.log('Invalid maxChallan value');
      return NextResponse.json(
        { message: 'Invalid maxChallan value', status: 400 },
        { status: 400 }
      );
    }

    // Check if the rollNo already exists
    const existingChallan = await Challan.findOne({ rollNo: payload.rollNo });
    if (existingChallan) {
      console.log(`Challan with rollNo ${payload.rollNo} already exists`);
      return NextResponse.json(
        {
          message: `Challan with rollNo ${payload.rollNo} already exists`,
          status: 400,
        },
        { status: 400 }
      );
    }

    // Count the number of existing challans
    const challanCount = await Challan.countDocuments();

    console.log('Current Challan Count:', challanCount);

    if (challanCount >= maxChallan) {
      console.log('Maximum number of challans reached');
      return NextResponse.json(
        { message: 'Maximum number of challans reached', status: 400 },
        { status: 400 }
      );
    }

    // Determine the limit per route
    const routeLimit = Math.floor(maxChallan / 5);

    // Count the number of challans for the given route
    const routeChallanCount = await Challan.countDocuments({
      route: payload.route,
    });

    console.log(
      `Current Challan Count for route ${payload.route}:`,
      routeChallanCount
    );

    if (routeChallanCount >= routeLimit) {
      console.log(
        `Maximum number of challans reached for route ${payload.route}`
      );
      return NextResponse.json(
        {
          message: `Maximum number of challans reached for route ${payload.route}`,
          status: 400,
        },
        { status: 400 }
      );
    }

    // Set SrNo for the new challan
    const newSrNo = challanCount + 1;
    payload.SrNo = newSrNo;

    console.log('Creating new challan with SrNo:', newSrNo);

    const challan = await Challan.create(payload);

    console.log('Challan created successfully:', challan);

    return NextResponse.json(
      {
        message: 'Challan Created Successfully',
        status: 201,
        challan,
        SrNo: newSrNo,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error in storing challan:', err);
    return NextResponse.json(
      { message: 'Internal Server Error', status: 500 },
      { status: 500 }
    );
  }
}

// Note: If you want a GET method here for fetching all challans, you can add it.
// For fetching by rollNo, we'll use the dynamic route below.

import AdminChallan from '@/lib/models/AdminChallan.model';
import Challan from '@/lib/models/Challan.model';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  rollNo: string;
}
// GET: Fetch a challan by rollNo (equivalent to index)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ rollNo: string }> }
) {
  try {
    const { rollNo } = await params;

    // console.log('Fetching challan for rollNo:', rollNo);

    const _challans = await Challan.find();

    console.log('Challans fetched successfully:', _challans);

    if (!_challans) {
      console.log(`Challan not found for rollNo: ${rollNo}`);
      return NextResponse.json(
        { message: `Challan not found for rollNo: ${rollNo}`, status: 404 },
        { status: 404 }
      );
    }

    const challans = _challans.filter((challan) => challan.rollNo === rollNo);

    // console.log('Challan fetched successfully:', challans);

    return NextResponse.json({
      message: 'Challan Fetched Successfully',
      status: 200,
      challans,
    });
  } catch (err) {
    console.error('Error in fetching challan:', err);
    return NextResponse.json(
      { message: 'Internal Server Error', status: 500 },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ rollNo: string }> }
) {
  try {
    const payload = await request.json(); // Parse JSON body
    const { rollNo } = await params;

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
    const existingChallan = await Challan.findOne({ rollNo: rollNo });
    if (existingChallan) {
      console.log(`Challan with rollNo ${rollNo} already exists`);
      return NextResponse.json(
        {
          message: `Challan with rollNo ${rollNo} already exists`,
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
      route: payload?.route,
    });

    console.log(
      `Current Challan Count for route ${payload?.route}:`,
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
      { message: 'Internal Server Error', status: 500, err },
      { status: 500 }
    );
  }
}

// PATCH: Update download status by rollNo
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { rollNo } = await params; // No await needed, params is directly accessible

    console.log(`Updating download status for rollNo: ${rollNo}`);

    // Find the challan by rollNo
    const challan = await Challan.findOne({ rollNo });

    if (!challan) {
      console.log(`Challan not found for rollNo: ${rollNo}`);
      return NextResponse.json(
        { message: `Challan not found for rollNo: ${rollNo}`, status: 404 },
        { status: 404 }
      );
    }

    // Update the downloadStatus to true
    challan.downloadStatus = 'true'; // Assuming 'downloadStatus' is a String field

    // Save the updated challan
    await challan.save();

    console.log(
      `Challan download status updated successfully for rollNo: ${rollNo}`
    );

    return NextResponse.json({
      message: `Challan download status updated successfully for rollNo: ${rollNo}`,
      status: 200,
      challan,
    });
  } catch (err) {
    console.error('Error in updating challan download status:', err);
    return NextResponse.json(
      { message: 'Internal Server Error', status: 500 },
      { status: 500 }
    );
  }
}

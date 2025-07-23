import connect from '@/lib/db';
import Schedule from '@/lib/models/Schedules.model';
import { NextRequest, NextResponse } from 'next/server';

// GET: Retrieve all schedules
export async function GET(req: NextRequest) {
  await connect();
  try {
    const schedules = await Schedule.find().lean(); // .lean() for plain JS objects
    return NextResponse.json({ success: true, schedules }, { status: 200 });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}

// POST: Add a new schedule
export async function POST(req: NextRequest) {
  await connect();

  try {
    const body = await req.json();

    // Validate required fields
    const { busId, driverId, stops, scheduleId, routeName } = body;
    if (
      !busId ||
      !driverId ||
      !stops ||
      !Array.isArray(stops) ||
      stops.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: busId, driverId, or stops',
        },
        { status: 400 }
      );
    }

    // Validate stops
    for (const stop of stops) {
      if (!stop.stopName || !stop.arrivalTime || !stop.departureTime) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Each stop must have stopName, arrivalTime, and departureTime',
          },
          { status: 400 }
        );
      }
    }

    const newSchedule = new Schedule({
      scheduleId: scheduleId || `SCH-${Date.now()}`, // Generate a default if not provided
      routeName: routeName || '',
      busId,
      driverId,
      stops,
      isActive: body.isActive || false,
    });

    await newSchedule.save();
    return NextResponse.json(
      { success: true, schedule: newSchedule },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding schedule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add schedule' },
      { status: 500 }
    );
  }
}

// PATCH: Update an existing schedule
export async function PATCH(req: NextRequest) {
  await connect();

  try {
    const body = await req.json();
    const { scheduleId, ...updates } = body;

    if (!scheduleId) {
      return NextResponse.json(
        { success: false, error: 'Schedule ID is required' },
        { status: 400 }
      );
    }

    // Validate stops if provided
    if (updates.stops) {
      if (!Array.isArray(updates.stops) || updates.stops.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Stops must be a non-empty array' },
          { status: 400 }
        );
      }
      for (const stop of updates.stops) {
        if (!stop.stopName || !stop.arrivalTime || !stop.departureTime) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Each stop must have stopName, arrivalTime, and departureTime',
            },
            { status: 400 }
          );
        }
      }
    }

    const updatedSchedule = await Schedule.findOneAndUpdate(
      { scheduleId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedSchedule) {
      return NextResponse.json(
        { success: false, error: 'Schedule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, schedule: updatedSchedule },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update schedule' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a schedule
export async function DELETE(req: NextRequest) {
  await connect();

  try {
    const { searchParams } = new URL(req.url);
    const scheduleId = searchParams.get('scheduleId');

    if (!scheduleId) {
      return NextResponse.json(
        { success: false, error: 'Schedule ID is required' },
        { status: 400 }
      );
    }

    const deletedSchedule = await Schedule.findOneAndDelete({ scheduleId });

    if (!deletedSchedule) {
      return NextResponse.json(
        { success: false, error: 'Schedule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Schedule deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete schedule' },
      { status: 500 }
    );
  }
}

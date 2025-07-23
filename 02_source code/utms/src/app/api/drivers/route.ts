import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import Driver from '@/lib/models/Driver.model';

export const POST = async (request: Request) => {
  try {
    await connect();
    const data = await request.json();
    const driver = new Driver(data);
    await driver.save();
    return NextResponse.json(
      { message: 'Driver created', driver },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating driver' },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    await connect();
    const drivers = await Driver.find({ isActive: true });
    return NextResponse.json({ drivers }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching drivers' },
      { status: 500 }
    );
  }
};

export const PUT = async (request: Request) => {
  try {
    await connect();
    const { _id, ...data } = await request.json();
    const driver = await Driver.findByIdAndUpdate(_id, data, { new: true });
    if (!driver) {
      return NextResponse.json(
        { message: 'Driver not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'Driver updated', driver },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating driver' },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    await connect();
    const { _id } = await request.json();
    const driver = await Driver.findByIdAndUpdate(
      _id,
      { isActive: false },
      { new: true }
    );
    if (!driver) {
      return NextResponse.json(
        { message: 'Driver not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'Driver deactivated' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deactivating driver' },
      { status: 500 }
    );
  }
};

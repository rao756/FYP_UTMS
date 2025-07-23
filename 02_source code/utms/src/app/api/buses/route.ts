import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import Bus from '@/lib/models/Bus.model';

export const POST = async (request: Request) => {
  try {
    await connect();
    const data = await request.json();
    const bus = new Bus(data);
    await bus.save();
    return NextResponse.json({ message: 'Bus created', bus }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating bus' },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    await connect();
    const buses = await Bus.find({ isActive: true });
    return NextResponse.json({ buses }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching buses' },
      { status: 500 }
    );
  }
};

export const PUT = async (request: Request) => {
  try {
    await connect();
    const { _id, ...data } = await request.json();
    const bus = await Bus.findByIdAndUpdate(_id, data, { new: true });
    if (!bus) {
      return NextResponse.json({ message: 'Bus not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Bus updated', bus }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating bus' },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    await connect();
    const { _id } = await request.json();
    const bus = await Bus.findByIdAndUpdate(
      _id,
      { isActive: false },
      { new: true }
    );
    if (!bus) {
      return NextResponse.json({ message: 'Bus not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Bus deactivated' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deactivating bus' },
      { status: 500 }
    );
  }
};

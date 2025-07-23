import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import Route from '@/lib/models/Route.model';

export const POST = async (request: Request) => {
  try {
    await connect();
    const data = await request.json();
    const route = new Route(data);
    await route.save();
    return NextResponse.json(
      { message: 'Route created', route },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating route' },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    await connect();
    const routes = await Route.find({ isActive: true });
    return NextResponse.json({ routes }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching routes' },
      { status: 500 }
    );
  }
};

export const PUT = async (request: Request) => {
  try {
    await connect();
    const { _id, ...data } = await request.json();
    const route = await Route.findByIdAndUpdate(_id, data, { new: true });
    if (!route) {
      return NextResponse.json({ message: 'Route not found' }, { status: 404 });
    }
    return NextResponse.json(
      { message: 'Route updated', route },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating route' },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    await connect();
    const { _id } = await request.json();
    const route = await Route.findByIdAndUpdate(
      _id,
      { isActive: false },
      { new: true }
    );
    if (!route) {
      return NextResponse.json({ message: 'Route not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Route deactivated' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deactivating route' },
      { status: 500 }
    );
  }
};

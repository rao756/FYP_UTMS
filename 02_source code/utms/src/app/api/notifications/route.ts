import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import Notification from '@/lib/models/Notification.model';

export const POST = async (request: Request) => {
  try {
    await connect();
    const data = await request.json();
    const notification = new Notification(data);
    await notification.save();
    return NextResponse.json(
      { message: 'Notification created', notification },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating notification' },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    await connect();
    const notifications = await Notification.find({ isActive: true }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching notifications' },
      { status: 500 }
    );
  }
};

export const PUT = async (request: Request) => {
  try {
    await connect();
    const { _id, ...data } = await request.json();
    const notification = await Notification.findByIdAndUpdate(_id, data, {
      new: true,
    });
    if (!notification) {
      return NextResponse.json(
        { message: 'Notification not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'Notification updated', notification },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating notification' },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    await connect();
    const { _id } = await request.json();
    const notification = await Notification.findByIdAndUpdate(
      _id,
      { isActive: false },
      { new: true }
    );
    if (!notification) {
      return NextResponse.json(
        { message: 'Notification not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'Notification deactivated' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deactivating notification' },
      { status: 500 }
    );
  }
};

import connect from '@/lib/db';
import Admin from '@/lib/models/Admin.model';
import User from '@/lib/models/User.model';
import { NextRequest, NextResponse } from 'next/server';

// POST: Create a new admin with the provided userId
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const idParams = await params;
    const id = idParams.id;

    const body = await req.json();
    console.log(body);

    // Check if the userId exists in the User model
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found',
          status: 404,
        },
        { status: 404 }
      );
    }

    // Check if an admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email: user.email });
    if (existingAdmin) {
      return NextResponse.json(
        {
          message: 'Admin with this email already exists',
          status: 400,
        },
        { status: 400 }
      );
    }

    // Create a new Admin document using user data
    const newAdmin = new Admin({
      departmentName: user.departmentName || 'General', // Default if not in User model
      email: user.email,
      role: user.role || 'super_admin', // Default to super_admin if not provided
      isActive: user.isActive !== undefined ? user.isActive : false, // Default to false
      userId: id,
    });

    // Save the admin to the database
    const savedAdmin = await newAdmin.save();

    return NextResponse.json(
      {
        message: 'Admin created successfully',
        status: 201,
        data: savedAdmin,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating Admin:', error);
    if (error.code === 11000) {
      // Handle duplicate key error (e.g., adminId or email)
      return NextResponse.json(
        {
          message: 'Admin with this email or adminId already exists',
          status: 400,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        status: 500,
      },
      { status: 500 }
    );
  }
}

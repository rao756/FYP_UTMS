import connect from '@/lib/db';
import User from '@/lib/models/User.model';
import Admin from '@/lib/models/Admin.model';
import { NextResponse } from 'next/server';
const bcrypt = require('bcryptjs');

export async function POST(request: Request) {
  try {
    await connect();

    const body = await request.json();
    const {
      userName,
      fatherName,
      rollNo,
      email,
      departmentName,
      password,
      image,
      isActive,
    } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          message: 'Email and password are required',
          status: 400,
        },
        { status: 400 }
      );
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          message: 'User with this email already exists',
          status: 400,
        },
        { status: 400 }
      );
    }

    // Check if an admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        {
          message: 'Admin with this email already exists',
          status: 400,
        },
        { status: 400 }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new User document
    const newUser = new User({
      userName: userName || '',
      fatherName: fatherName || '',
      rollNo: rollNo || '',
      email,
      departmentName: departmentName || '',
      password: hashedPassword,
      image: image || '',
      isActive: isActive || false,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Create a new Admin document linked to the user
    const newAdmin = new Admin({
      departmentName: departmentName || 'General',
      email,
      role: 'super_admin', // Default role, can be modified via form if needed
      isActive: isActive || false,
      userId: savedUser._id,
    });

    // Save the admin to the database
    const savedAdmin = await newAdmin.save();

    return NextResponse.json(
      {
        message: 'Admin registered successfully',
        status: 201,
        data: { user: savedUser, admin: savedAdmin },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error registering admin:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        {
          message: 'Email or adminId already exists',
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

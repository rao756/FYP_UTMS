const bcrypt = require('bcryptjs');
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connect from '@/lib/db';
import User from '@/lib/models/User.model';
import Admin from '@/lib/models/Admin.model';

export const POST = async (req: Request) => {
  try {
    await connect();
    const data = await req.json();
    const { email, password } = data.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found',
          status: 404,
          success: false,
        },
        { status: 404 }
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('|--> ', isMatch);

    if (!isMatch) {
      return NextResponse.json(
        {
          message: 'Invalid credentials',
          status: 401,
          success: false,
        },
        { status: 401 }
      );
    }

    // Check if user is admin
    const isAdmin = await Admin.findOne({ email: user.email });
    console.log('|--> ', isAdmin);

    if (!isAdmin) {
      return NextResponse.json(
        {
          message: 'Unauthorized: Admin access required',
          status: 403,
          success: false,
        },
        { status: 403 }
      );
    }

    // Generate JWT token for admin user
    const token = jwt.sign(
      {
        userId: user._id,
        userName: user.userName,
        fatherName: user.fatherName,
        semester: user.semester,
        departmentName: user.departmentName,
        rollNo: user.rollNo,
        image: user.image,
        isAdmin: true,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      {
        message: 'Admin login successful',
        status: 200,
        success: true,
        token,
        user: {
          _id: user._id,
          userName: user.userName,
          fatherName: user.fatherName,
          rollNo: user.rollNo,
          email: user.email,
          departmentName: user.departmentName,
          semester: user.semester,
          image: user.image,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        status: 500,
        success: false,
      },
      { status: 500 }
    );
  }
};

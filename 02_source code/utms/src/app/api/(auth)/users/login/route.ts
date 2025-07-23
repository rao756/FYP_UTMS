const bcrypt = require('bcryptjs');
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connect from '@/lib/db';
import User from '@/lib/models/User.model';

export const POST = async (req: Request) => {
  try {
    await connect();
    const data = await req.json();

    console.log('->', data.body);

    const { email, password } = data.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({
        message: 'User not found',
        status: 404,
        success: false,
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('->', isMatch);

    if(!user.isActive){
      return NextResponse.json({
        message: 'User inactive!',
        success: false,
      }, 
      {status: 401},
    );
    }

    if (!isMatch) {
      return NextResponse.json({
        message: 'Password does not match',
        success: false,
      }, {
      status: 401
    },
    );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        userName: user.userName,
        fatherName: user.fatherName,
        semester: user.semester,
        departmentName: user.departmentName,
        rollNo: user.rollNo,
        image: user.image,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Login successful',
      success: true,
      token,
      user,
    }, {
    status: 200
  }
  
  );
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: 'Internal Server Error',
      success: false,
    },{
    status: 500
  },
  
  );
  }
};

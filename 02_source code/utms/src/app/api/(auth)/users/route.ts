const bcrypt = require('bcryptjs');
import connect from '@/lib/db';
import Admin from '@/lib/models/Admin.model';
import User from '@/lib/models/User.model';
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';


export const GET = async () => {
  await connect();
  try {
    // Fetch all users
    const users = await User.find().lean(); // Use lean() for better performance
    const totalUsers = await User.countDocuments();

    // Fetch all admin records to check for admin status
    const admins = await Admin.find().select('email').lean();
    console.log('--> Admins:', admins); // Debug: Log the admins array

    // Create a Set of admin emails
    const adminEmails = new Set(
      admins
        .filter((admin) => admin.email && typeof admin.email === 'string') // Ensure email is valid
        .map((admin) => admin.email.toLowerCase()) // Normalize to lowercase for consistent matching
    );
    console.log('--> Admin Emails Set:', Array.from(adminEmails)); // Debug: Log the Set as an array

    // Map users to include isAdmin field
    const usersWithAdminStatus = users.map((user) => {
      const userEmail =
        user.email && typeof user.email === 'string'
          ? user.email.toLowerCase()
          : null;
      return {
        ...user,
        isAdmin: userEmail ? adminEmails.has(userEmail) : false, // Check if user email is in adminEmails
      };
    });

    return new NextResponse(
      JSON.stringify({
        message: 'Users fetched',
        users: usersWithAdminStatus,
        totalUsers,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Error fetching users' }),
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    await connect();
    const formData = await request.formData();

    const body: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      body[key] = value;
    });

    // Handle file upload
    if (formData.has('image')) {
      const file = formData.get('image') as File;
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      const filePath = `${uploadDir}/${file.name}`;

      await writeFile(filePath, buffer);
      body.image = `/uploads/${file.name}`;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    body.password = hashedPassword;

    // Create new user
    const newUser = new User(body);
    await newUser.save();

    return new NextResponse(
      JSON.stringify({ message: 'User is created', user: newUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Error creating user' }), {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  await connect();

  try {
    const { id } = await request.json();

    const user = await User.findById(id);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), {
        status: 404,
      });
    }

    user.isActive = true;
    await user.save();
    console.log("--->", user.isActive);

    return new NextResponse(
      JSON.stringify({ message: 'PATCH request successful' }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: 'Invalid JSON in request body' }),
      { status: 400 }
    );
  }
};

export const DELETE = async (request: Request) => {
  await connect();

  const { searchParams } = new URL(request.url);
  const userId = await searchParams.get('userId');

  if (!userId) {
    return new NextResponse(
      JSON.stringify({ message: 'userId parameter is missing' }),
      { status: 400 }
    );
  }

  const user = await User.deleteOne({ _id: userId });

  if (!user) {
    return new NextResponse(JSON.stringify({ message: 'User not found' }), {
      status: 400,
    });
  }

  return new NextResponse(
    JSON.stringify({ message: 'DELETE request successful', userId }),
    { status: 200 }
  );
};

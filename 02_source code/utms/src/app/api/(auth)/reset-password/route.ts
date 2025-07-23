import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connect from '@/lib/db';
import User from '@/lib/models/User.model';

// Constant for salt rounds to ensure consistency across routes
const SALT_ROUNDS = 10;

export const POST = async (request: Request) => {
  try {
    await connect();
    const data = await request.json();
    const { email, currentPassword, newPassword } = data;

    // Validate input
    if (
      !email ||
      !currentPassword ||
      !newPassword ||
      typeof email !== 'string' ||
      typeof currentPassword !== 'string' ||
      typeof newPassword !== 'string'
    ) {
      return NextResponse.json(
        { message: 'Email, current password, and new password are required' },
        { status: 400 }
      );
    }

    // Additional validation for new password
    const trimmedNewPassword = newPassword.trim();
    if (trimmedNewPassword.length < 6) {
      return NextResponse.json(
        { message: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword.trim(), user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(
      trimmedNewPassword,
      SALT_ROUNDS
    );

    // Update user's password
    user.password = hashedNewPassword;
    await user.save();

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { message: 'Error resetting password' },
      { status: 500 }
    );
  }
};

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { connectToDatabase } from '@/lib/db/mongoose';
import User from '@/lib/models/User';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, username } = body;

    if (!name || !email || !username) {
      return NextResponse.json({
        success: false,
        error: 'Name, email, and username are required'
      }, { status: 400 });
    }

    await connectToDatabase();

    // Check if username already exists for another user
    const existingUser = await User.findOne({
      username: username,
      _id: { $ne: session.user.id }
    });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'Username already taken'
      }, { status: 400 });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { name, email, username },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile'
    }, { status: 500 });
  }
}

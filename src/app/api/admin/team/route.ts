import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import TeamMember from '@/lib/models/TeamMember';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const members = await TeamMember.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    console.error('Team GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await connectToDatabase();

    const member = new TeamMember({
      ...body,
      updatedAt: new Date(),
    });

    await member.save();
    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    console.error('Team POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    const member = await TeamMember.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    if (!member) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    console.error('Team PUT error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    const member = await TeamMember.findByIdAndDelete(id);
    if (!member) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Team DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import TeamMember from '@/lib/models/TeamMember';

export async function GET() {
  try {
    await connectToDatabase();
    const members = await TeamMember.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    console.error('Public Team API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import Settings from '@/lib/models/Settings';

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await Settings.find({});
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Public Settings API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

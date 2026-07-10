import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import Settings from '@/lib/models/Settings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';

// GET - Fetch all settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const settings = await Settings.find({}).lean();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch settings' 
    }, { status: 500 });
  }
}

// POST - Create or update setting
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { key, value, type, group, description } = body;

    if (!key) {
      return NextResponse.json({ 
        success: false, 
        error: 'Key is required' 
      }, { status: 400 });
    }

    await connectToDatabase();

    const setting = await Settings.findOneAndUpdate(
      { key },
      { 
        key, 
        value, 
        type: type || 'string', 
        group: group || 'general',
        description: description || '',
        updatedAt: new Date() 
      },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({ 
      success: true, 
      data: setting,
      message: 'Setting saved successfully' 
    });
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save setting' 
    }, { status: 500 });
  }
}

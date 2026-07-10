import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import Content from '@/lib/models/Content';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');

    await connectToDatabase();

    let query: any = { isPublished: true };
    if (page) query.page = page;
    if (section) query.section = section;

    const content = await Content.find(query).sort({ order: 1 });
    
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Public Content API error:', error);
    // Fix: Handle unknown error type
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch content';
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}

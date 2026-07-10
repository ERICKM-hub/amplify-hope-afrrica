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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

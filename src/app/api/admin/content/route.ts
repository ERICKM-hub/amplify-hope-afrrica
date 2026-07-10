import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import Content from '@/lib/models/Content';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';

// Define limits per page/section
const CONTENT_LIMITS: Record<string, Record<string, number>> = {
  'gallery': { 'images': 1000 },
  // Default limit for everything else is 10
};

const DEFAULT_LIMIT = 10;

async function getCount(page: string, section: string): Promise<number> {
  return await Content.countDocuments({ page, section });
}

async function getLimit(page: string, section: string): Promise<number> {
  // Check if there's a specific limit for this page/section
  if (CONTENT_LIMITS[page] && CONTENT_LIMITS[page][section]) {
    return CONTENT_LIMITS[page][section];
  }
  return DEFAULT_LIMIT;
}

// GET - Fetch all content or specific page/section
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');

    await connectToDatabase();

    let query: any = {};
    if (page) query.page = page;
    if (section) query.section = section;

    const content = await Content.find(query).sort({ page: 1, section: 1, order: 1 });
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Content GET error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch content' 
    }, { status: 500 });
  }
}

// POST - Create new content
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await connectToDatabase();

    // Validate required fields
    if (!body.page || !body.section) {
      return NextResponse.json({ 
        success: false, 
        error: 'Page and section are required' 
      }, { status: 400 });
    }

    // Clean the section name
    const cleanSection = body.section.trim().toLowerCase().replace(/\s+/g, '-');
    
    // Check limit
    const limit = await getLimit(body.page, cleanSection);
    const count = await getCount(body.page, cleanSection);
    
    if (count >= limit) {
      return NextResponse.json({ 
        success: false, 
        error: `Maximum limit of ${limit} items reached for page "${body.page}" section "${cleanSection}". Please delete some existing items first.` 
      }, { status: 400 });
    }

    // Prepare content data
    const contentData = {
      page: body.page,
      section: cleanSection,
      title: body.title || '',
      content: body.content || '',
      data: body.data || {},
      images: body.images || [],
      order: body.order || count,
      isPublished: body.isPublished !== undefined ? body.isPublished : true,
    };

    const content = new Content(contentData);
    await content.save();

    return NextResponse.json({ 
      success: true, 
      data: content,
      message: 'Content created successfully' 
    });
  } catch (error) {
    console.error('Content POST error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create content' 
    }, { status: 500 });
  }
}

// PUT - Update content
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID is required' 
      }, { status: 400 });
    }

    await connectToDatabase();

    // Clean section if provided
    if (updateData.section) {
      updateData.section = updateData.section.trim().toLowerCase().replace(/\s+/g, '-');
    }

    const content = await Content.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        updatedAt: new Date(),
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!content) {
      return NextResponse.json({ 
        success: false, 
        error: 'Content not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: content,
      message: 'Content updated successfully' 
    });
  } catch (error) {
    console.error('Content PUT error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update content' 
    }, { status: 500 });
  }
}

// DELETE - Delete content
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID is required' 
      }, { status: 400 });
    }

    await connectToDatabase();

    const content = await Content.findByIdAndDelete(id);
    if (!content) {
      return NextResponse.json({ 
        success: false, 
        error: 'Content not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: { id },
      message: 'Content deleted successfully' 
    });
  } catch (error) {
    console.error('Content DELETE error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete content' 
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import Content from '@/lib/models/Content';

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch gallery content from the database
    const galleryContent = await Content.find({
      page: 'gallery',
      isPublished: true
    }).sort({ order: 1 });

    // Format the data for the gallery
    const images = galleryContent.map((item) => ({
      _id: item._id,
      url: item.images && item.images.length > 0 ? item.images[0] : '',
      alt: item.title || 'Gallery image',
      title: item.title || '',
    })).filter(img => img.url); // Only return images with a URL

    return NextResponse.json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('Gallery API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch gallery images'
    }, { status: 500 });
  }
}

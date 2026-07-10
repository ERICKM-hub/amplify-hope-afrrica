import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'image';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type based on upload type
    const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    let allowedTypes: string[] = [];
    let maxSize: number = 0;

    if (type === 'image') {
      allowedTypes = imageTypes;
      maxSize = 10 * 1024 * 1024;
    } else if (type === 'document') {
      allowedTypes = documentTypes;
      maxSize = 20 * 1024 * 1024;
    } else {
      allowedTypes = [...imageTypes, ...documentTypes];
      maxSize = 20 * 1024 * 1024;
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`
      }, { status: 400 });
    }

    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`
      }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return the URL
    const url = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: url,
      filename: filename,
      type: type,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }, { status: 500 });
  }
}

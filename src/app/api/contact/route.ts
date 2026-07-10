import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import FormSubmission from '@/lib/models/FormSubmission';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Save to database
    const submission = await FormSubmission.create({
      type: 'contact',
      data: {
        name,
        email,
        subject: subject || 'General Inquiry',
        message,
      },
      status: 'new',
    });

    return NextResponse.json({ 
      success: true, 
      data: submission,
      message: 'Your message has been sent successfully!' 
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

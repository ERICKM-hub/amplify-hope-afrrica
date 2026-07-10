import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import FormSubmission from '@/lib/models/FormSubmission';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, interest, gender, country, message, consent } = body;

    // Validate required fields
    if (!name || !email || !phone || !interest || !message) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Save to database
    const submission = await FormSubmission.create({
      type: interest || 'general',
      data: {
        name,
        email,
        phone,
        interest,
        gender: gender || 'prefer-not-to-say',
        country: country || '',
        message,
        consent: consent || false,
      },
      status: 'new',
    });

    return NextResponse.json({ 
      success: true, 
      data: submission,
      message: 'Your submission has been received successfully!' 
    });
  } catch (error) {
    console.error('Get Involved API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}

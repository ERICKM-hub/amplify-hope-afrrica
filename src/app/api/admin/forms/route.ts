import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import FormSubmission from '@/lib/models/FormSubmission';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const submissions = await FormSubmission.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const submission = await FormSubmission.create({
      type: body.type || 'contact',
      data: body,
    });

    return NextResponse.json({ success: true, data: submission });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

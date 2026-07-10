import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import Content from '@/lib/models/Content';
import FormSubmission from '@/lib/models/FormSubmission';
import TeamMember from '@/lib/models/TeamMember';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const [contentCount, formCount, teamCount, newForms] = await Promise.all([
      Content.countDocuments(),
      FormSubmission.countDocuments(),
      TeamMember.countDocuments(),
      FormSubmission.countDocuments({ status: 'new' }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        content: contentCount,
        forms: formCount,
        team: teamCount,
        newForms: newForms,
        total: contentCount + formCount + teamCount,
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

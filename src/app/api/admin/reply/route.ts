import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { submissionId, email, subject, message, type } = body;

    if (!email || !message) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and message are required' 
      }, { status: 400 });
    }

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: process.env.EMAIL_SERVER_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'admin@amplifyhopeafrica.org',
      to: email,
      subject: subject || 'Re: Your message to Amplify Hope Africa',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #1A5D3C; padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Amplify Hope Africa</h1>
          </div>
          <div style="background-color: #F9FAFB; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #E5E7EB;">
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">Dear ${body.name || 'Valued Supporter'},</p>
            <div style="font-size: 16px; line-height: 1.8; color: #1F2937; margin: 20px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-top: 20px;">
              Thank you for reaching out to us.
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Warm regards,<br>
              <strong style="color: #1A5D3C;">Amplify Hope Africa Team</strong>
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #6B7280; font-size: 12px;">
            <p>Amplify Hope Africa &bull; Nairobi, Kenya</p>
            <p>
              <a href="mailto:${process.env.EMAIL_FROM}" style="color: #1A5D3C; text-decoration: none;">${process.env.EMAIL_FROM}</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Reply sent successfully' 
    });
  } catch (error) {
    console.error('Reply error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send reply' 
    }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import TeamMember from "@/lib/models/TeamMember";

export async function GET() {
  try {
    await connectToDatabase();

    const members = await TeamMember.find({})
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: members,
    });
  } catch (error) {
    console.error("Public Team API error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch team members";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
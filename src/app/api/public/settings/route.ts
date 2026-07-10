import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import Content from "@/lib/models/Content";
import FormSubmission from "@/lib/models/FormSubmission";
import TeamMember from "@/lib/models/TeamMember";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const [contentCount, formCount, teamCount, newForms] = await Promise.all([
      Content.countDocuments(),
      FormSubmission.countDocuments(),
      TeamMember.countDocuments(),
      FormSubmission.countDocuments({ status: "new" }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        content: contentCount,
        forms: formCount,
        team: teamCount,
        newForms,
        total: contentCount + formCount + teamCount,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

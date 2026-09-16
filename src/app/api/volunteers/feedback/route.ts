import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/auth";

function getInitials(name: string) {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// GET /api/volunteers/feedback?status=APPROVED
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status") || "APPROVED";
    
    // Map APPROVED or VERIFIED to VERIFIED for VerificationStatus enum compatibility
    const targetStatus = (statusParam === "APPROVED" || statusParam === "VERIFIED") ? "VERIFIED" : (statusParam as any);

    const feedbacks = await db.volunteerFeedback.findMany({
      where: {
        status: targetStatus,
      },
      include: {
        volunteer: {
          select: {
            fullName: true,
            city: true,
            interest: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    const data = feedbacks.map((fb) => ({
      id: fb.id,
      name: fb.volunteer?.fullName || "Volunteer",
      role: fb.volunteer?.interest || "Volunteer Member",
      review: fb.message,
      rating: fb.rating,
      initials: getInitials(fb.volunteer?.fullName || "Volunteer"),
      city: fb.volunteer?.city || "",
      createdAt: fb.createdAt,
    }));

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/volunteers/feedback:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}

const feedbackSchema = z.object({
  rating: z.coerce.number().min(1, "Rating must be 1 to 5").max(5, "Rating must be 1 to 5"),
  message: z.string().min(1, "Message is required"),
});

// POST /api/volunteers/feedback
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const volunteer = await db.volunteerApplication.findFirst({
      where: {
        userId: session.user.id,
        status: "VERIFIED",
      },
    });

    if (!volunteer) {
      return NextResponse.json(
        { success: false, error: "Only verified volunteers can submit feedback" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = feedbackSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const feedback = await db.volunteerFeedback.create({
      data: {
        volunteerId: volunteer.id,
        rating: validation.data.rating,
        message: validation.data.message,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { id: feedback.id },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/volunteers/feedback:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

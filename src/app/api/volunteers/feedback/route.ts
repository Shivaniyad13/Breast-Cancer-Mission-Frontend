import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { apiClient } from "@/lib/apiClient";

// GET /api/volunteers/feedback?status=APPROVED
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status") || "APPROVED";
    const targetStatus = (statusParam === "APPROVED" || statusParam === "VERIFIED") ? "VERIFIED" : statusParam;

    const response = await apiClient(`/volunteers/feedback?status=${targetStatus}&limit=6`);
    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return NextResponse.json(
        { success: false, error: resData.message || resData.error || "Failed to fetch feedback" },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json({ success: true, data: resData.data }, { status: 200 });
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

    const sessRes = await apiClient(`/volunteers/session?userId=${session.user.id}`);
    const sessData = await sessRes.json();
    const volunteer = sessData.data;

    if (!volunteer || !volunteer.volunteerId || (volunteer.volunteerStatus !== "VERIFIED" && volunteer.volunteerStatus !== "APPROVED")) {
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

    const response = await apiClient("/volunteers/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        volunteerId: volunteer.volunteerId,
        rating: validation.data.rating,
        message: validation.data.message,
      }),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return NextResponse.json(
        { success: false, error: resData.message || resData.error || "Failed to submit feedback" },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { id: resData.data.id },
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

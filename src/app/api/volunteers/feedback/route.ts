import { NextResponse } from "next/server";
import { z } from "zod";
import { apiClient } from "@/lib/apiClient";

// GET /api/volunteers/feedback?status=APPROVED
export async function GET() {
  try {
    const response = await apiClient("/volunteers/feedback?status=PUBLIC&limit=6");
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
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email address").max(254),
  rating: z.coerce.number().min(1, "Rating must be 1 to 5").max(5, "Rating must be 1 to 5"),
  message: z.string().trim().min(1, "Message is required").max(2000),
  consent: z.literal(true, { error: "Consent is required before submitting" }),
});

// POST /api/volunteers/feedback
export async function POST(request: Request) {
  try {
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
        submitterName: validation.data.name,
        submitterEmail: validation.data.email,
        rating: validation.data.rating,
        message: validation.data.message,
        consent: validation.data.consent,
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

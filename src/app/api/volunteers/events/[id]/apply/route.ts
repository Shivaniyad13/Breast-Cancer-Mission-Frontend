import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { apiClient } from "@/lib/apiClient";

// POST /api/volunteers/events/[id]/apply
export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const eventId = params.id;

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
        {
          success: false,
          error: "Only verified volunteers can apply for events",
        },
        { status: 403 }
      );
    }

    const response = await apiClient(`/volunteers/events/${eventId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ volunteerId: volunteer.volunteerId }),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return NextResponse.json(
        { success: false, error: resData.message || resData.error || "Failed to apply for event" },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: resData.data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/volunteers/events/[id]/apply:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to apply for event",
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

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

    // Check if user is a verified volunteer
    const volunteer = await db.volunteerApplication.findFirst({
      where: {
        userId: session.user.id,
        status: "VERIFIED",
      },
    });

    if (!volunteer) {
      return NextResponse.json(
        {
          success: false,
          error: "Only verified volunteers can apply for events",
        },
        { status: 403 }
      );
    }

    // Check if event exists
    const event = await db.volunteerEvent.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Volunteer event not found" },
        { status: 404 }
      );
    }

    if (!event.isOpen) {
      return NextResponse.json(
        { success: false, error: "This event is closed for applications" },
        { status: 400 }
      );
    }

    // Prevent duplicate application
    const existingApplication = await db.volunteerEventApplication.findUnique({
      where: {
        eventId_volunteerId: {
          eventId,
          volunteerId: volunteer.id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: "You have already applied for this event" },
        { status: 400 }
      );
    }

    // Create event application
    const application = await db.volunteerEventApplication.create({
      data: {
        eventId,
        volunteerId: volunteer.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: application,
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

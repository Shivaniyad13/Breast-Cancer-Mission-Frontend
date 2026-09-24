import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { apiClient } from "@/lib/apiClient";

// GET /api/volunteers/events?isOpen=true
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isOpenParam = searchParams.get("isOpen");
    
    const query = isOpenParam !== null ? `?isOpen=${isOpenParam}` : "";

    const response = await apiClient(`/volunteers/events${query}`);
    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return NextResponse.json(
        {
          success: false,
          error: resData.message || resData.error || "Failed to fetch volunteer events",
        },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: resData.data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in GET /api/volunteers/events:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch volunteer events",
      },
      { status: 500 }
    );
  }
}

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  eventDate: z.string().min(1, "Event date is required"),
  slots: z.coerce.number().min(1, "Slots must be at least 1"),
  interestKey: z.string().min(1, "Interest key is required"),
  isOpen: z.boolean().default(true),
});

// POST /api/volunteers/events
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = eventSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const response = await apiClient("/volunteers/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validation.data,
        createdBy: session.user.id,
      }),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return NextResponse.json(
        { success: false, error: resData.message || resData.error || "Failed to create event" },
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
    console.error("Error in POST /api/volunteers/events:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create event" },
      { status: 500 }
    );
  }
}

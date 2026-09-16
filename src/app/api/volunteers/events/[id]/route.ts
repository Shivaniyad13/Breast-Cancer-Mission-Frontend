import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/auth";

const patchEventSchema = z.object({
  isOpen: z.boolean().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  slots: z.coerce.number().optional(),
});

// PATCH /api/volunteers/events/[id]
export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
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

    const { id } = await props.params;
    const body = await request.json();
    const validation = patchEventSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const updatedEvent = await db.volunteerEvent.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedEvent,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PATCH /api/volunteers/events/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update event" },
      { status: 500 }
    );
  }
}

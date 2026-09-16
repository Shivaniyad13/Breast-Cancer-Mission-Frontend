import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/auth";

const statusSchema = z.object({
  status: z.enum(["VERIFIED", "REJECTED", "APPROVED", "PENDING"]),
});

// PATCH /api/volunteers/feedback/[id]
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
    const validation = statusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    let targetStatus = validation.data.status;
    if (targetStatus === "APPROVED") {
      targetStatus = "VERIFIED";
    }

    const updatedFeedback = await db.volunteerFeedback.update({
      where: { id },
      data: {
        status: targetStatus as any,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedFeedback,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PATCH /api/volunteers/feedback/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update feedback status" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { apiClient } from "@/lib/apiClient";

const verifySchema = z.object({
  status: z.enum(["VERIFIED", "REJECTED"]),
  rejectionReason: z.string().optional(),
});

// POST /api/volunteers/[id]/verify
export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const volunteerId = params.id;

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
    const validation = verifySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { status, rejectionReason } = validation.data;

    const response = await apiClient(`/volunteers/${volunteerId}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, rejectionReason }),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return NextResponse.json(
        {
          success: false,
          error: resData.message || resData.error || "Failed to verify volunteer application",
        },
        { status: response.status || 500 }
      );
    }

    const updatedVolunteer = resData.data;

    return NextResponse.json(
      {
        success: true,
        data: updatedVolunteer,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/volunteers/[id]/verify:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to verify volunteer application",
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { apiClient } from "@/lib/apiClient";

const updateSchema = z.object({
  status: z.enum(["VERIFIED", "REJECTED", "APPROVED", "PENDING"]).optional(),
  title: z.string().trim().min(1).max(120).optional(),
}).refine((data) => data.status !== undefined || data.title !== undefined);

// PATCH /api/volunteers/gallery/[id]
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
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const targetStatus = validation.data.status === "APPROVED" ? "VERIFIED" : validation.data.status;

    const response = await apiClient(`/volunteers/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validation.data, status: targetStatus }),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return NextResponse.json(
        { success: false, error: resData.message || resData.error || "Failed to update gallery submission status" },
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
    console.error("Error in PATCH /api/volunteers/gallery/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update gallery submission status" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { apiClient } from "@/lib/apiClient";

const updateSchema = z.object({
  message: z.string().trim().min(1).max(1000),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 });
    }

    const validation = updateSchema.safeParse(await request.json());
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues.map((issue) => issue.message).join(", ") },
        { status: 400 }
      );
    }

    const { id } = await context.params;
    const response = await apiClient(`/volunteers/feedback/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Error updating volunteer feedback comment as admin:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update comment" },
      { status: 500 }
    );
  }
}

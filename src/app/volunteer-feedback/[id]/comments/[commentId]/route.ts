import { NextResponse } from "next/server";
import { z } from "zod";
import { apiClient } from "@/lib/apiClient";

const updateSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  authorToken: z.string().uuid(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id, commentId } = await context.params;
    const validation = updateSchema.safeParse(await request.json());
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues.map((issue) => issue.message).join(", ") },
        { status: 400 }
      );
    }

    const response = await apiClient(`/volunteers/feedback/${id}/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Error updating public feedback comment:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update comment" },
      { status: 500 }
    );
  }
}

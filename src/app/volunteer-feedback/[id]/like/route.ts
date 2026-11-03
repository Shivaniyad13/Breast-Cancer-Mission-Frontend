import { NextResponse } from "next/server";
import { z } from "zod";
import { apiClient } from "@/lib/apiClient";

const likeSchema = z.object({
  visitorKey: z.string().uuid(),
  liked: z.boolean(),
});

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const validation = likeSchema.safeParse(await request.json());
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues.map((issue) => issue.message).join(", ") },
        { status: 400 }
      );
    }

    const response = await apiClient(`/volunteers/feedback/${id}/like`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Error updating public feedback like:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update like" },
      { status: 500 }
    );
  }
}

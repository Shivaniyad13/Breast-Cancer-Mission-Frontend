import { NextResponse } from "next/server";
import { z } from "zod";
import { apiClient } from "@/lib/apiClient";

const commentSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  message: z.string().trim().min(1, "Comment is required").max(1000),
  authorToken: z.string().uuid(),
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const response = await apiClient(`/volunteers/feedback/${id}/comments`);
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Error fetching public feedback comments:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const validation = commentSchema.safeParse(await request.json());
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues.map((issue) => issue.message).join(", ") },
        { status: 400 }
      );
    }

    const response = await apiClient(`/volunteers/feedback/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Error submitting public feedback comment:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to submit comment" },
      { status: 500 }
    );
  }
}

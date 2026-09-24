import { NextResponse } from "next/server";
import { apiClient } from "@/lib/apiClient";

export const revalidate = 300;

// GET /api/volunteers/stats
export async function GET() {
  try {
    const response = await apiClient("/volunteers/stats");
    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return NextResponse.json(
        {
          success: false,
          error: resData.message || resData.error || "Failed to fetch volunteer stats",
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
    console.error("Error in GET /api/volunteers/stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch volunteer stats",
      },
      { status: 500 }
    );
  }
}

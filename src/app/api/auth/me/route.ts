import { NextResponse } from "next/server";
import { getCurrentUserAction } from "@/app/actions/auth";

// GET /api/auth/me
// Compatibility layer: Returns current logged in user & volunteer status for client components
export async function GET() {
  try {
    const userData = await getCurrentUserAction();

    if (!userData) {
      return NextResponse.json({ success: true, user: null }, { status: 200 });
    }

    return NextResponse.json({ success: true, user: userData }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/auth/me:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch user session" },
      { status: 500 }
    );
  }
}

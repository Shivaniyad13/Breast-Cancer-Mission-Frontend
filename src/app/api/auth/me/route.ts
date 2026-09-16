import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// GET /api/auth/me
// Returns current logged in user & volunteer status for client-side polling / external integrations
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ success: true, user: null }, { status: 200 });
    }

    const userId = session.user.id;
    const role = (session.user.role as any) || "USER";

    const volunteer = await db.volunteerApplication.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    let certificateCode: string | null = null;
    if (volunteer && (volunteer.status === "VERIFIED" || (volunteer.status as any) === "APPROVED")) {
      const cert = await db.volunteerCertificate.findFirst({
        where: { volunteerId: volunteer.id },
      });
      certificateCode = cert?.certificateCode || null;
    }

    const userData = {
      userId,
      role,
      volunteerStatus: volunteer ? volunteer.status : "NOT_APPLIED",
      volunteerId: volunteer?.id,
      certificateCode,
      fullName: volunteer?.fullName || session.user.name || "",
    };

    return NextResponse.json({ success: true, user: userData }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/auth/me:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch user session" },
      { status: 500 }
    );
  }
}

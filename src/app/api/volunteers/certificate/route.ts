import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

// GET /api/volunteers/certificate
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const volunteer = await db.volunteerApplication.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!volunteer) {
      return NextResponse.json(
        { success: false, error: "Volunteer application not found" },
        { status: 404 }
      );
    }

    const certificate = await db.volunteerCertificate.findFirst({
      where: { volunteerId: volunteer.id },
    });

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: "No certificate issued yet" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          certificateCode: certificate.certificateCode,
          issuedAt: certificate.issuedAt.toISOString(),
          revokedAt: certificate.revokedAt ? certificate.revokedAt.toISOString() : null,
          volunteerName: volunteer.fullName,
          city: volunteer.city,
          interest: volunteer.interest,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in GET /api/volunteers/certificate:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch certificate details",
      },
      { status: 500 }
    );
  }
}

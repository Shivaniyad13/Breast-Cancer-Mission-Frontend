import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { apiClient } from "@/lib/apiClient";

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

    const response = await apiClient(`/volunteers/certificate?userId=${session.user.id}`);
    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return NextResponse.json(
        {
          success: false,
          error: resData.message || resData.error || "Failed to fetch certificate details",
        },
        { status: response.status || 500 }
      );
    }

    const { volunteer, certificate } = resData.data;

    if (!volunteer) {
      return NextResponse.json(
        { success: false, error: "Volunteer application not found" },
        { status: 404 }
      );
    }

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
          issuedAt: certificate.issuedAt,
          revokedAt: certificate.revokedAt || null,
          volunteerName: volunteer.fullName,
          city: volunteer.city || "",
          interest: volunteer.interest || "",
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

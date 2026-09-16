import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/auth";

const verifySchema = z.object({
  status: z.enum(["VERIFIED", "REJECTED"]),
  rejectionReason: z.string().optional(),
});

// POST /api/volunteers/[id]/verify
export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const volunteerId = params.id;

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

    const body = await request.json();
    const validation = verifySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { status, rejectionReason } = validation.data;

    // Verify volunteer application exists
    const volunteer = await db.volunteerApplication.findUnique({
      where: { id: volunteerId },
    });

    if (!volunteer) {
      return NextResponse.json(
        { success: false, error: "Volunteer application not found" },
        { status: 404 }
      );
    }

    // Update volunteer application
    const updatedVolunteer = await db.volunteerApplication.update({
      where: { id: volunteerId },
      data: {
        status: status as any,
        verifiedAt: status === "VERIFIED" ? new Date() : null,
        verifiedBy: session.user.id,
        rejectionReason: status === "REJECTED" ? rejectionReason || "Rejected by admin" : null,
      },
    });

    // If verified, also ensure a VolunteerCertificate row exists with unique nanoid code
    let certificate = null;
    if (status === "VERIFIED") {
      const existingCert = await db.volunteerCertificate.findFirst({
        where: { volunteerId },
      });

      if (!existingCert) {
        const certCode = `CERT-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
        certificate = await db.volunteerCertificate.create({
          data: {
            certificateCode: certCode,
            volunteerId,
            issuedAt: new Date(),
          },
        });
      } else {
        certificate = existingCert;
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          volunteer: updatedVolunteer,
          certificate,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/volunteers/[id]/verify:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to verify volunteer application",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    // Find certificate
    const cert = await db.certificate.findFirst({
      where: {
        OR: [
          { id },
          { certificateIdString: id }
        ]
      }
    });

    if (!cert) {
      return new NextResponse("Certificate not found", { status: 404 });
    }

    // Security: Only recipient or admin can download
    if (cert.recipientId !== session.user.id && session.user.role !== Role.ADMIN) {
      return new NextResponse("Forbidden: Access denied", { status: 403 });
    }

    // Build absolute path to the PDF file
    const filePath = path.join(process.cwd(), "public", cert.pdfStorageUrl);

    if (!fs.existsSync(filePath)) {
      return new NextResponse("PDF file not found on disk", { status: 404 });
    }

    // Read file stream
    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cert.certificateIdString}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Download certificate error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

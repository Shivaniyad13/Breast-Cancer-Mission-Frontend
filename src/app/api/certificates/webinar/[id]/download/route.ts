import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { apiClient } from "@/lib/apiClient";
import { Role } from "@/types/enums";
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

    // Find certificate via Express backend
    const certRes = await apiClient(`/certificates/verify/${id}`);
    if (!certRes.ok) {
      return new NextResponse("Certificate not found", { status: 404 });
    }

    const certData = await certRes.json();
    const cert = certData.data;

    if (!cert) {
      return new NextResponse("Certificate not found", { status: 404 });
    }

    // Security: Only recipient or admin can download
    if (cert.recipientId !== session.user.id && session.user.role !== Role.ADMIN) {
      return new NextResponse("Forbidden: Access denied", { status: 403 });
    }

    // Fetch PDF stream from Express backend or read file
    const pdfRes = await apiClient(`/certificates/download/${id}`);
    if (!pdfRes.ok) {
      // Fallback: check local public path if applicable
      const filePath = path.join(process.cwd(), "public", cert.pdfStorageUrl || "");
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${cert.certificateIdString || id}.pdf"`,
          },
        });
      }
      return new NextResponse("PDF file not found on disk", { status: 404 });
    }

    const arrayBuffer = await pdfRes.arrayBuffer();
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cert.certificateIdString || id}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Download certificate error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

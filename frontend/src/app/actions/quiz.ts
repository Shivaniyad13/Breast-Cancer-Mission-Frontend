"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role, CertificateType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import crypto from "crypto";

// Helper for general user auth
async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: Please log in to proceed.");
  }
  return session.user;
}

export async function generateQuizCertificateAction(score: number) {
  try {
    const user = await requireUser();

    if (score < 8) {
      return { success: false, error: "Score must be at least 80% (8/10) to earn a certificate." };
    }

    // Check if user already has a quiz certificate
    const existingCert = await db.certificate.findFirst({
      where: {
        recipientId: user.id,
        certificateType: CertificateType.QUIZ_EXCELLENCE,
      },
    });

    if (existingCert) {
      return { success: true, certificateId: existingCert.id, message: "Certificate already earned!" };
    }

    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return { success: false, error: "User not found in database." };
    }

    const userName = dbUser.name || dbUser.email || "Participant";
    const eventName = "Breast Cancer Awareness & Prevention Quiz";
    const speakerName = "GRS Medical Board";
    const formattedDate = new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Create unique Certificate ID
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const certificateNumber = `GRS-QUIZ-${randomSuffix}`;

    // Cryptographic verification hash
    const verificationHash = crypto
      .createHash("sha256")
      .update(`${user.id}-QUIZ-${certificateNumber}-GRS-SECRET-2026`)
      .digest("hex");

    // Local file storage paths
    const publicCertificatesDir = path.join(process.cwd(), "public", "certificates");
    if (!fs.existsSync(publicCertificatesDir)) {
      fs.mkdirSync(publicCertificatesDir, { recursive: true });
    }

    const filename = `${certificateNumber}.pdf`;
    const relativePath = `/certificates/${filename}`;
    const absolutePath = path.join(publicCertificatesDir, filename);

    // Dynamic Verification URL
    const verificationUrl = `http://localhost:3000/verify/${certificateNumber}`;

    // Font paths – using local Roboto TTF files to avoid Helvetica.afm ENOENT in Next.js
    const fontsDir = path.join(process.cwd(), "public", "fonts");
    const fontRegular    = path.join(fontsDir, "Roboto-Regular.ttf");
    const fontBold       = path.join(fontsDir, "Roboto-Bold.ttf");
    const fontItalic     = path.join(fontsDir, "Roboto-Italic.ttf");
    const fontBoldItalic = path.join(fontsDir, "Roboto-BoldItalic.ttf");

    // Create PDF Document using PDFKit (A4 Landscape)
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margins: { top: 40, bottom: 40, left: 40, right: 40 },
      font: fontRegular,
    });

    // Register custom fonts so we can reference them by alias
    doc.registerFont("Roboto",           fontRegular);
    doc.registerFont("Roboto-Bold",      fontBold);
    doc.registerFont("Roboto-Italic",    fontItalic);
    doc.registerFont("Roboto-BoldItalic",fontBoldItalic);

    const stream = fs.createWriteStream(absolutePath);
    doc.pipe(stream);

    // Design background - Double Frame (Rose Pink theme)
    const width = doc.page.width;
    const height = doc.page.height;

    // Outer border
    doc.lineWidth(15);
    doc.strokeColor("#fda4af"); // Soft Pink Ribbon Rose Color
    doc.rect(20, 20, width - 40, height - 40).stroke();

    // Inner thin border
    doc.lineWidth(2);
    doc.strokeColor("#e11d48"); // Darker Rose
    doc.rect(32, 32, width - 64, height - 64).stroke();

    // Corner decorative circles
    const drawCorners = (x: number, y: number) => {
      doc.circle(x, y, 6).fill("#e11d48");
    };

    drawCorners(32, 32);
    drawCorners(width - 32, 32);
    drawCorners(32, height - 32);
    drawCorners(width - 32, height - 32);

    // Title / Header
    doc.fillColor("#1e293b"); // Slate
    doc.font("Roboto-Bold").fontSize(34).text("CERTIFICATE OF QUIZ EXCELLENCE", {
      align: "center",
      underline: false,
    });
    doc.moveDown(0.2);

    doc.fillColor("#e11d48"); // Primary pink accent
    doc.font("Roboto-BoldItalic").fontSize(18).text("GRS Breast Cancer Awareness Mission", {
      align: "center",
    });
    doc.moveDown(1.2);

    doc.fillColor("#475569"); // Slate text
    doc.font("Roboto").fontSize(14).text("This certificate is proudly awarded to", {
      align: "center",
    });
    doc.moveDown(0.5);

    // Participant Name (Big and Bold)
    doc.fillColor("#0f172a"); // Charcoal
    doc.font("Roboto-Bold").fontSize(28).text(userName, {
      align: "center",
    });
    doc.moveDown(0.6);

    // Quiz details text
    doc.fillColor("#475569");
    doc.font("Roboto").fontSize(13).text("for successfully passing the breast cancer clinical knowledge check", {
      align: "center",
    });
    doc.moveDown(0.4);

    // Quiz Title (Bold)
    doc.fillColor("#1e293b");
    doc.font("Roboto-Bold").fontSize(18).text(`"${eventName}"`, {
      align: "center",
    });
    doc.moveDown(0.6);

    // Date & Score info
    doc.fillColor("#475569");
    doc.font("Roboto").fontSize(12).text(
      `Conducted on ${formattedDate} | Score Achieved: ${score}/10 (Distinction)`,
      { align: "center" }
    );

    // Logos & Signatures section (bottom layout)
    const bottomY = height - 160;

    // QR Code generation
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;
      const response = await fetch(qrUrl);
      if (response.ok) {
        const qrBuffer = Buffer.from(await response.arrayBuffer());
        doc.image(qrBuffer, 80, bottomY - 10, { width: 80, height: 80 });
      } else {
        throw new Error();
      }
    } catch (e) {
      doc.rect(80, bottomY - 10, 80, 80).stroke();
      doc.fontSize(8).fillColor("#94a3b8").text("Scan to Verify", 85, bottomY + 25, { width: 70, align: 'center' });
    }

    doc.fillColor("#64748b").fontSize(8).text(`Verification ID: ${certificateNumber}`, 80, bottomY + 75, { width: 100 });

    const sigX = width - 260;

    doc.moveTo(sigX, bottomY + 45).lineTo(sigX + 180, bottomY + 45).strokeColor("#cbd5e1").lineWidth(1).stroke();
    doc.fontSize(12).fillColor("#1e293b").font("Roboto-BoldItalic").text("Antigravity AI", sigX + 10, bottomY + 15, { width: 160, align: "center" });
    doc.fontSize(9).fillColor("#64748b").font("Roboto").text("GRS Authorized Signature", sigX, bottomY + 50, { width: 180, align: "center" });

    const logoX = width / 2 - 80;
    try {
      const grsLogoPath = path.join(process.cwd(), "public", "grs-group-logo.jpg");
      doc.image(grsLogoPath, logoX, bottomY, { width: 50, height: 45 });
    } catch (e) {
      doc.rect(logoX, bottomY, 50, 45).fillColor("#fce7f3").fill();
      doc.fillColor("#e11d48").fontSize(10).font("Roboto-Bold").text("GRS", logoX + 13, bottomY + 18);
    }

    try {
      const khushiLogoPath = path.join(process.cwd(), "public", "khushi-logo.jpg");
      doc.image(khushiLogoPath, logoX + 70, bottomY, { width: 50, height: 45 });
    } catch (e) {
      doc.rect(logoX + 70, bottomY, 50, 45).fillColor("#dbeafe").fill();
      doc.fillColor("#1d4ed8").fontSize(9).font("Roboto-Bold").text("KHUSHI", logoX + 7, bottomY + 18);
    }

    doc.fontSize(7).fillColor("#64748b").font("Roboto").text("Audit Seal & Strategic Partners", logoX, bottomY + 50, { width: 130, align: "center" });

    doc.end();

    const certificate = await db.certificate.create({
      data: {
        recipientId: user.id,
        certificateType: CertificateType.QUIZ_EXCELLENCE,
        eventName: eventName,
        certificateIdString: certificateNumber,
        pdfStorageUrl: relativePath,
        verificationHash,
        userName,
        speakerName,
        date: new Date(),
        digitalSignature: "Verified GRS Cryptographic Signature",
        verificationUrl,
      },
    });

    console.log(`[QUIZ CERTIFICATE GENERATED] Issued ${certificateNumber} to ${userName}`);
    
    revalidatePath("/dashboard");
    return { success: true, certificateId: certificate.id, certificateNumber };
  } catch (error: any) {
    console.error("Quiz certificate generation error:", error);
    return { success: false, error: error.message };
  }
}

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
      margins: { top: 20, bottom: 20, left: 20, right: 20 },
      font: fontRegular,
    });

    // Register custom fonts so we can reference them by alias
    doc.registerFont("Roboto",           fontRegular);
    doc.registerFont("Roboto-Bold",      fontBold);
    doc.registerFont("Roboto-Italic",    fontItalic);
    doc.registerFont("Roboto-BoldItalic",fontBoldItalic);

    const stream = fs.createWriteStream(absolutePath);
    doc.pipe(stream);

    const width = doc.page.width;   // 841.89
    const height = doc.page.height; // 595.28

    // 1. Background Fill & Side Pink Ribbons
    doc.rect(0, 0, width, height).fill("#ffffff");

    // Left and Right Pink Accent Bands
    doc.rect(0, 0, 14, height).fill("#f472b6");
    doc.rect(width - 14, 0, 14, height).fill("#f472b6");

    // Outer & Inner Decorative Borders
    doc.lineWidth(2).strokeColor("#f472b6").rect(22, 22, width - 44, height - 44).stroke();
    doc.lineWidth(1).strokeColor("#c49a45").rect(28, 28, width - 56, height - 56).stroke();

    // Corner Ornaments (Gold Dots/Circles & Lines)
    const drawCornerOrnament = (cx: number, cy: number) => {
      doc.circle(cx, cy, 5).fillColor("#c49a45").fill();
    };
    drawCornerOrnament(28, 28);
    drawCornerOrnament(width - 28, 28);
    drawCornerOrnament(28, height - 28);
    drawCornerOrnament(width - 28, height - 28);

    // 2. TOP HEADER: LOGOS & SLOGAN
    const headerY = 45;

    // Top Left: GRS India Group Logo
    try {
      const grsLogoPath = path.join(process.cwd(), "public", "grs-group-logo.jpg");
      doc.image(grsLogoPath, 45, headerY, { width: 110, height: 45 });
    } catch (e) {
      doc.rect(45, headerY, 110, 45).fillColor("#fce7f3").fill();
      doc.fillColor("#e11d48").fontSize(11).font("Roboto-Bold").text("GRS INDIA", 65, headerY + 15);
    }

    // Top Right: Khushi Centre Logo
    try {
      const khushiLogoPath = path.join(process.cwd(), "public", "khushi-logo.jpg");
      doc.image(khushiLogoPath, width - 155, headerY, { width: 110, height: 45 });
    } catch (e) {
      doc.rect(width - 155, headerY, 110, 45).fillColor("#dbeafe").fill();
      doc.fillColor("#1d4ed8").fontSize(10).font("Roboto-Bold").text("KHUSHI CENTRE", width - 145, headerY + 15);
    }

    // Top Center: Ribbon Slogan
    doc.fillColor("#e11d48");
    doc.circle(width / 2, headerY + 10, 6).fill();
    doc.moveTo(width / 2 - 120, headerY + 28).lineTo(width / 2 + 120, headerY + 28).strokeColor("#f472b6").lineWidth(0.8).stroke();
    doc.fillColor("#be185d").fontSize(9).font("Roboto-Bold").text("TOGETHER FOR AWARENESS • TOGETHER FOR A CURE", width / 2 - 160, headerY + 32, {
      width: 320,
      align: "center",
    });

    // 3. TITLE & SUBTITLE
    let currentY = 110;

    // CERTIFICATE
    doc.fillColor("#8b1c43").font("Roboto-Bold").fontSize(36).text("CERTIFICATE", 0, currentY, {
      align: "center",
      width: width,
    });
    currentY += 42;

    // OF APPRECIATION (Flanked by gold lines)
    doc.moveTo(width / 2 - 140, currentY + 8).lineTo(width / 2 - 60, currentY + 8).strokeColor("#c49a45").lineWidth(1).stroke();
    doc.moveTo(width / 2 + 60, currentY + 8).lineTo(width / 2 + 140, currentY + 8).strokeColor("#c49a45").lineWidth(1).stroke();

    doc.fillColor("#b8860b").font("Roboto-Bold").fontSize(12).text("OF APPRECIATION", 0, currentY, {
      align: "center",
      width: width,
    });
    currentY += 28;

    // 4. PINK RIBBON BANNER: PROUDLY PRESENTED TO
    const bannerW = 260;
    const bannerH = 24;
    const bannerX = (width - bannerW) / 2;

    doc.rect(bannerX, currentY, bannerW, bannerH).fill("#e0528e");
    doc.fillColor("#ffffff").font("Roboto-Bold").fontSize(11).text("PROUDLY PRESENTED TO", 0, currentY + 6, {
      align: "center",
      width: width,
    });
    currentY += 36;

    // 5. RECIPIENT NAME
    doc.fillColor("#8a1c4a").font("Roboto-BoldItalic").fontSize(30).text(userName, 0, currentY, {
      align: "center",
      width: width,
    });
    currentY += 36;

    // Gold Flourish Divider Line
    doc.moveTo(width / 2 - 70, currentY).lineTo(width / 2 + 70, currentY).strokeColor("#c49a45").lineWidth(1.5).stroke();
    doc.circle(width / 2, currentY, 3).fillColor("#c49a45").fill();
    currentY += 14;

    // 6. CERTIFICATE TEXT BODY
    doc.fillColor("#4b5563").font("Roboto").fontSize(12).text("for successfully completing the", 0, currentY, {
      align: "center",
      width: width,
    });
    currentY += 20;

    // Program Title
    doc.fillColor("#8b1c43").font("Roboto-Bold").fontSize(18).text("Breast Cancer Awareness Quiz", 0, currentY, {
      align: "center",
      width: width,
    });
    currentY += 26;

    // Paragraph 1
    doc.fillColor("#374151").font("Roboto").fontSize(11).text(
      "Your participation demonstrates your commitment to spreading awareness, promoting early detection, and supporting breast cancer education.",
      width / 2 - 240,
      currentY,
      { width: 480, align: "center", lineGap: 3 }
    );
    currentY += 34;

    // Paragraph 2
    doc.fillColor("#be185d").font("Roboto-Bold").fontSize(10.5).text(
      "Thank you for contributing to a healthier and more informed community.",
      0,
      currentY,
      { align: "center", width: width }
    );

    // 7. SIGNATURES & CENTRAL GOLD SEAL BADGE
    const sigY = height - 130;

    // Left Signature: Santosh Aggarwal
    doc.fillColor("#1e293b").font("Roboto-BoldItalic").fontSize(16).text("S. Aggarwal", 70, sigY, { width: 180, align: "center" });
    doc.moveTo(70, sigY + 22).lineTo(250, sigY + 22).strokeColor("#94a3b8").lineWidth(1).stroke();
    doc.fillColor("#1e293b").font("Roboto-Bold").fontSize(10).text("SANTOSH AGGARWAL", 70, sigY + 26, { width: 180, align: "center" });
    doc.fillColor("#64748b").font("Roboto").fontSize(9).text("Chairman, GRS India Group", 70, sigY + 39, { width: 180, align: "center" });

    // Center Gold Seal Badge
    const sealX = width / 2;
    const sealY = sigY + 15;
    doc.circle(sealX, sealY, 28).fillColor("#ca8a04").fill();
    doc.circle(sealX, sealY, 24).fillColor("#fef08a").fill();
    doc.circle(sealX, sealY, 24).lineWidth(1.5).strokeColor("#854d0e").stroke();
    doc.fillColor("#713f12").font("Roboto-Bold").fontSize(9).text("GRS", sealX - 20, sealY - 12, { width: 40, align: "center" });
    doc.fillColor("#854d0e").font("Roboto-Bold").fontSize(6.5).text("INDIA GROUP", sealX - 25, sealY + 1, { width: 50, align: "center" });
    doc.fillColor("#a16207").font("Roboto").fontSize(5.5).text("OFFICIAL SEAL", sealX - 25, sealY + 10, { width: 50, align: "center" });

    // Right Signature: Khushi Centre
    doc.fillColor("#1e293b").font("Roboto-BoldItalic").fontSize(16).text("Dr. Khushi", width - 250, sigY, { width: 180, align: "center" });
    doc.moveTo(width - 250, sigY + 22).lineTo(width - 70, sigY + 22).strokeColor("#94a3b8").lineWidth(1).stroke();
    doc.fillColor("#1e293b").font("Roboto-Bold").fontSize(10).text("KHUSHI CENTRE", width - 250, sigY + 26, { width: 180, align: "center" });
    doc.fillColor("#64748b").font("Roboto").fontSize(9).text("For Rehabilitation & Research", width - 250, sigY + 39, { width: 180, align: "center" });

    // 8. BOTTOM FOOTER: CERTIFICATE ID & DATE
    const footerY = height - 42;
    doc.moveTo(40, footerY - 8).lineTo(width - 40, footerY - 8).strokeColor("#fbcfe8").lineWidth(0.8).stroke();

    doc.fillColor("#be185d").font("Roboto-Bold").fontSize(9.5).text(`Certificate ID: `, 45, footerY);
    doc.fillColor("#1e293b").font("Roboto").fontSize(9.5).text(certificateNumber, 115, footerY);

    doc.fillColor("#be185d").font("Roboto-Bold").fontSize(9.5).text("✦ • 🌸 • ✦", 0, footerY, { align: "center", width: width });

    doc.fillColor("#be185d").font("Roboto-Bold").fontSize(9.5).text(`Date: `, width - 180, footerY);
    doc.fillColor("#1e293b").font("Roboto").fontSize(9.5).text(formattedDate, width - 150, footerY);

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

"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role, CertificateType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import crypto from "crypto";

// Helper for admin auth
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privilege required.");
  }
  return session.user;
}

// Helper for general user auth
async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: Please log in to proceed.");
  }
  return session.user;
}

// Get webinars with filters
export async function getWebinars(filters: {
  search?: string;
  city?: string;
  category?: string;
  date?: string;
  mode?: "upcoming" | "past";
}) {
  const { search, city, category, date, mode } = filters;
  const now = new Date();

  const where: any = {};

  // Search by title or speaker name
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { speakerName: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  // Filter by City
  if (city && city !== "all") {
    where.city = { equals: city, mode: "insensitive" };
  }

  // Filter by Category
  if (category && category !== "all") {
    where.category = { equals: category, mode: "insensitive" };
  }

  // Filter by Date
  if (date) {
    const filterDate = new Date(date);
    const startOfDay = new Date(filterDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(filterDate.setHours(23, 59, 59, 999));
    where.date = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }

  // Upcoming vs Past toggle
  if (mode === "upcoming") {
    where.endTime = { gte: now };
    // Draft webinars shouldn't show to regular users, unless they are admin
    // For simplicity in browse listing, we only show Published or Completed
    where.status = "PUBLISHED";
  } else if (mode === "past") {
    where.OR = [
      { endTime: { lt: now } },
      { status: "COMPLETED" },
    ];
    where.status = { in: ["PUBLISHED", "COMPLETED"] };
  } else {
    where.status = { in: ["PUBLISHED", "COMPLETED"] };
  }

  return await db.webinar.findMany({
    where,
    orderBy: { date: mode === "past" ? "desc" : "asc" },
    include: {
      registrations: true,
    },
  });
}

// Get unique categories and cities for filters
export async function getWebinarFilterMetadata() {
  const webinars = await db.webinar.findMany({
    select: {
      city: true,
      category: true,
    },
  });

  const cities = Array.from(new Set(webinars.map((w) => w.city).filter((c): c is string => !!c)));
  const categories = Array.from(new Set(webinars.map((w) => w.category).filter((c): c is string => !!c)));

  return { cities, categories };
}

// Get single webinar by ID
export async function getWebinarById(id: string) {
  const webinar = await db.webinar.findUnique({
    where: { id },
    include: {
      registrations: {
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      },
      attendance: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      certificates: true,
    },
  });

  return webinar;
}

// Create Webinar (Admin)
export async function createWebinarAction(data: any) {
  await requireAdmin();

  const webinar = await db.webinar.create({
    data: {
      title: data.title,
      description: data.description,
      fullContent: data.fullContent || "",
      bannerImage: data.bannerImage || null,
      speakerName: data.speakerName,
      speakerImage: data.speakerImage || null,
      speakerBio: data.speakerBio || "",
      speakerQualification: data.speakerQualification || null,
      speakerSpecialization: data.speakerSpecialization || null,
      speakerHospital: data.speakerHospital || null,
      date: new Date(data.date),
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      venue: data.venue || "Online",
      city: data.city || null,
      state: data.state || null,
      country: data.country || null,
      webinarMode: data.webinarMode || "Online",
      meetingLink: data.meetingLink || "",
      maxSeats: parseInt(data.maxSeats) || 100,
      category: data.category || "General",
      status: data.status || "DRAFT",
      objectives: data.objectives || "",
      agenda: data.agenda || "",
      faqs: data.faqs || [],
      organizerDetails: data.organizerDetails || "Breast Cancer Mission Awareness Platform",
      language: data.language || "English",
      meetingPlatform: data.meetingPlatform || "Zoom",
      learningOutcomes: data.learningOutcomes || "",
      eligibility: data.eligibility || "",
    },
  });

  revalidatePath("/webinars");
  revalidatePath("/admin/webinars");
  return { success: true, webinarId: webinar.id };
}

// Edit Webinar (Admin)
export async function editWebinarAction(id: string, data: any) {
  await requireAdmin();

  await db.webinar.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      fullContent: data.fullContent || "",
      bannerImage: data.bannerImage || null,
      speakerName: data.speakerName,
      speakerImage: data.speakerImage || null,
      speakerBio: data.speakerBio || "",
      speakerQualification: data.speakerQualification || null,
      speakerSpecialization: data.speakerSpecialization || null,
      speakerHospital: data.speakerHospital || null,
      date: new Date(data.date),
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      venue: data.venue || "Online",
      city: data.city || null,
      state: data.state || null,
      country: data.country || null,
      webinarMode: data.webinarMode || "Online",
      meetingLink: data.meetingLink || "",
      maxSeats: parseInt(data.maxSeats) || 100,
      category: data.category || "General",
      status: data.status || "DRAFT",
      objectives: data.objectives || "",
      agenda: data.agenda || "",
      faqs: data.faqs || [],
      organizerDetails: data.organizerDetails || "Breast Cancer Mission Awareness Platform",
      recordingUrl: data.recordingUrl || null,
      materialsUrl: data.materialsUrl || null,
      language: data.language || "English",
      meetingPlatform: data.meetingPlatform || "Zoom",
      learningOutcomes: data.learningOutcomes || "",
      eligibility: data.eligibility || "",
    },
  });

  revalidatePath("/webinars");
  revalidatePath(`/webinars/${id}`);
  revalidatePath("/admin/webinars");
  return { success: true };
}

// Delete Webinar (Admin)
export async function deleteWebinarAction(id: string) {
  await requireAdmin();

  await db.webinar.delete({
    where: { id },
  });

  revalidatePath("/webinars");
  revalidatePath("/admin/webinars");
  return { success: true };
}

// Update Webinar Status (Admin) - Publish, Schedule, Cancel, Complete
export async function updateWebinarStatusAction(id: string, status: string) {
  await requireAdmin();

  await db.webinar.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/webinars");
  revalidatePath(`/webinars/${id}`);
  revalidatePath("/admin/webinars");
  return { success: true };
}

// Upload Recording (Admin)
export async function uploadRecordingAction(id: string, recordingUrl: string) {
  await requireAdmin();

  await db.webinar.update({
    where: { id },
    data: { recordingUrl },
  });

  revalidatePath(`/webinars/${id}`);
  revalidatePath("/admin/webinars");
  return { success: true };
}

// Upload Materials (Admin)
export async function uploadMaterialsAction(id: string, materialsUrl: string) {
  await requireAdmin();

  await db.webinar.update({
    where: { id },
    data: { materialsUrl },
  });

  revalidatePath(`/webinars/${id}`);
  revalidatePath("/admin/webinars");
  return { success: true };
}

// Register for Webinar
export async function registerForWebinarAction(
  webinarId: string,
  formData?: {
    name: string;
    email: string;
    phone: string;
    gender: string;
    age: number;
    city: string;
    state: string;
    occupation: string;
    emergencyContact: string;
    reason: string;
  }
) {
  const user = await requireUser();

  // Check if webinar exists
  const webinar = await db.webinar.findUnique({
    where: { id: webinarId },
    include: { registrations: true },
  });

  if (!webinar) {
    throw new Error("Webinar not found.");
  }

  // Check if already registered
  const existingReg = await db.webinarRegistration.findFirst({
    where: { userId: user.id, webinarId },
  });

  if (existingReg) {
    return { success: true, message: "Already registered for this webinar." };
  }

  // Check seat limit
  if (webinar.registrations.length >= webinar.maxSeats) {
    throw new Error("This webinar is fully booked.");
  }

  // Create registration
  await db.webinarRegistration.create({
    data: {
      userId: user.id,
      webinarId,
      name: formData?.name ?? user.name ?? "",
      email: formData?.email ?? user.email ?? "",
      phone: formData?.phone ?? "",
      gender: formData?.gender ?? "",
      age: formData?.age ? Number(formData.age) : 0,
      city: formData?.city ?? "",
      state: formData?.state ?? "",
      occupation: formData?.occupation ?? "",
      emergencyContact: formData?.emergencyContact ?? "",
      reason: formData?.reason ?? "",
      status: "Registered",
    },
  });

  // Mock Notification
  console.log(`[NOTIFICATION SENT] Registration Successful: User ${user.email} registered for Webinar "${webinar.title}"`);

  revalidatePath(`/webinars/${webinarId}`);
  revalidatePath("/dashboard");
  return { success: true, message: "Successfully registered! A confirmation has been logged." };
}

// Get or Create Webinar by Title (to handle static campaigns page registrations)
export async function getOrCreateWebinarByTitleAction(title: string) {
  const user = await requireUser();

  let webinar = await db.webinar.findFirst({
    where: { title: { equals: title, mode: "insensitive" } },
    include: { registrations: true },
  });

  if (!webinar) {
    const now = new Date();
    const dateObj = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days in future
    const startTime = new Date(dateObj.setHours(15, 0, 0, 0)); // 3:00 PM
    const endTime = new Date(dateObj.setHours(16, 0, 0, 0)); // 4:00 PM

    webinar = await db.webinar.create({
      data: {
        title,
        description: `This is a certified campaign event for ${title}. Join us live for key clinical insights.`,
        fullContent: `Full details, timing schedules and expert guidelines for the ${title} event. Participate live to receive GRS & Khushi certifications.`,
        speakerName: "Dr. Ananya Sen",
        speakerBio: "Oncologist dedicated to public health and early detection awareness.",
        date: dateObj,
        startTime,
        endTime,
        webinarMode: "Online",
        meetingLink: "https://zoom.us/j/mock-meeting-room-id",
        maxSeats: 100,
        category: "Awareness",
        status: "PUBLISHED",
      },
      include: { registrations: true },
    });
  }

  return { success: true, webinarId: webinar.id, webinarTitle: webinar.title };
}

// Send Reminder (Admin)
export async function sendReminderAction(webinarId: string) {
  await requireAdmin();

  const webinar = await db.webinar.findUnique({
    where: { id: webinarId },
  });

  if (!webinar) {
    throw new Error("Webinar not found.");
  }

  console.log(`[REMINDER SENT] Admin sent a manual reminder for Webinar: "${webinar.title}"`);
  return { success: true, message: `Successfully sent reminders to all registered attendees for "${webinar.title}".` };
}

// User Joins Meeting Room - Attendance Start
export async function joinWebinarAction(webinarId: string) {
  const user = await requireUser();

  const webinar = await db.webinar.findUnique({
    where: { id: webinarId },
  });

  if (!webinar) {
    throw new Error("Webinar not found.");
  }

  // Upsert join time
  const attendance = await db.attendance.upsert({
    where: {
      userId_webinarId: {
        userId: user.id,
        webinarId,
      },
    },
    update: {
      joinTime: new Date(),
    },
    create: {
      userId: user.id,
      webinarId,
      joinTime: new Date(),
      status: "Incomplete",
      durationMinutes: 0,
      attendancePercentage: 0,
    },
  });

  console.log(`[ATTENDANCE LOGGED] User ${user.email} joined webinar "${webinar.title}" at ${attendance.joinTime}`);
  return { success: true, attendanceId: attendance.id };
}

// User Leaves Meeting Room - Calculate Attendance & Generate Certificate if >= 80%
export async function leaveWebinarAction(webinarId: string, durationSeconds: number) {
  const user = await requireUser();

  const webinar = await db.webinar.findUnique({
    where: { id: webinarId },
  });

  if (!webinar) {
    throw new Error("Webinar not found.");
  }

  // Get active attendance log
  const existingAtt = await db.attendance.findUnique({
    where: {
      userId_webinarId: {
        userId: user.id,
        webinarId,
      },
    },
  });

  const durationMin = durationSeconds / 60;
  const accumulatedMin = (existingAtt?.durationMinutes || 0) + durationMin;

  // Calculate webinar duration in minutes
  const webinarDurationMin = Math.max(
    (webinar.endTime.getTime() - webinar.startTime.getTime()) / 60000,
    30 // Default fallback minimum webinar length: 30 minutes
  );

  const percentage = Math.min((accumulatedMin / webinarDurationMin) * 100, 100);
  const status = percentage >= 80 ? "Completed" : "Incomplete";
  const certificateEligible = status === "Completed";

  const updatedAtt = await db.attendance.update({
    where: {
      userId_webinarId: {
        userId: user.id,
        webinarId,
      },
    },
    data: {
      leaveTime: new Date(),
      durationMinutes: accumulatedMin,
      attendancePercentage: percentage,
      status,
      certificateEligible,
    },
  });

  console.log(`[ATTENDANCE UPDATED] User ${user.email} left webinar "${webinar.title}". Stayed: ${accumulatedMin.toFixed(2)} min (${percentage.toFixed(1)}%). Status: ${status}`);

  let certificateId = null;
  // If status is Completed and no certificate exists, automatically generate one!
  if (status === "Completed") {
    const existingCert = await db.certificate.findFirst({
      where: {
        recipientId: user.id,
        webinarId,
      },
    });

    if (!existingCert) {
      const certResult = await generateCertificateForUser(user.id, webinarId);
      if (certResult.success) {
        certificateId = certResult.certificateId;
      }
    }
  }

  revalidatePath("/dashboard");
  return {
    success: true,
    attendance: updatedAtt,
    certificateGenerated: !!certificateId,
    certificateId,
  };
}

// Submit feedback (User)
export async function submitFeedbackAction(webinarId: string, feedback: string, rating: number) {
  const user = await requireUser();

  await db.webinarRegistration.update({
    where: {
      userId_webinarId: {
        userId: user.id,
        webinarId,
      },
    },
    data: {
      feedback,
      rating,
    },
  });

  revalidatePath(`/webinars/${webinarId}`);
  revalidatePath("/dashboard");
  return { success: true, message: "Thank you for your feedback!" };
}

// Generate PDF Certificate using PDFKit
export async function generateCertificateForUser(userId: string, webinarId: string) {
  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    const webinar = await db.webinar.findUnique({ where: { id: webinarId } });

    if (!user || !webinar) {
      return { success: false, error: "User or Webinar not found." };
    }

    const userName = user.name || user.email || "Participant";
    const webinarName = webinar.title;
    const speakerName = webinar.speakerName;
    const formattedDate = webinar.date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Create unique Certificate ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const certificateNumber = `GRS-2026-${randomSuffix}`;

    // Cryptographic verification hash
    const verificationHash = crypto
      .createHash("sha256")
      .update(`${userId}-${webinarId}-${certificateNumber}-GRS-SECRET-2026`)
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

    const width = doc.page.width;
    const height = doc.page.height;
    const bottomY = height - 160;

    // Check if uploaded certificate template design image background exists
    const bgImagePath = path.join(process.cwd(), "public", "images", "webinar-certificate.png");
    const hasTemplate = fs.existsSync(bgImagePath);

    if (hasTemplate) {
      // Use uploaded design background directly
      doc.image(bgImagePath, 0, 0, { width, height });

      // Dynamic QR Code placement
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

      // Render Dynamic text over template fields
      // Certificate ID (top right)
      doc.fillColor("#64748b").fontSize(9).font("Roboto-Bold").text(`Certificate ID: ${certificateNumber}`, width - 260, 40, { width: 220, align: "right" });

      // Recipient User Name (middle center)
      doc.fillColor("#1e293b").font("Roboto-Bold").fontSize(30).text(userName, 0, 240, { align: "center", width });

      // Webinar Title (centered below name)
      doc.fillColor("#e11d48").font("Roboto-Bold").fontSize(18).text(`"${webinarName}"`, 0, 320, { align: "center", width });

      // Doctor/Speaker Name (written above signature/right bottom slot)
      doc.fillColor("#1e293b").font("Roboto-BoldItalic").fontSize(14).text(speakerName, width - 260, bottomY + 15, { width: 180, align: "center" });

      // Conducted Date (centered bottom-ish)
      doc.fillColor("#475569").font("Roboto").fontSize(12).text(`Conducted on ${formattedDate}`, 0, bottomY - 50, { align: "center", width });

    } else {
      // Fallback: Custom Double Frame (Soft Pink and Gold/Rose theme)
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
      doc.font("Roboto-Bold").fontSize(34).text("CERTIFICATE OF PARTICIPATION", {
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

      // Webinar description
      doc.fillColor("#475569");
      doc.font("Roboto").fontSize(13).text("for successfully attending the live awareness webinar", {
        align: "center",
      });
      doc.moveDown(0.4);

      // Webinar Title (Bold)
      doc.fillColor("#1e293b");
      doc.font("Roboto-Bold").fontSize(18).text(`"${webinarName}"`, {
        align: "center",
      });
      doc.moveDown(0.6);

      // Date and Speaker info
      doc.fillColor("#475569");
      doc.font("Roboto").fontSize(12).text(
        `Conducted on ${formattedDate} | Lead Speaker: ${speakerName}`,
        { align: "center" }
      );

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
    }

    doc.end();

    const certificate = await db.certificate.create({
      data: {
        recipientId: userId,
        certificateType: CertificateType.WEBINAR_ATTENDANCE,
        eventName: webinarName,
        certificateIdString: certificateNumber,
        pdfStorageUrl: relativePath,
        verificationHash,
        webinarId,
        userName,
        speakerName,
        date: webinar.date,
        digitalSignature: "Verified GRS Cryptographic Signature",
        verificationUrl,
      },
    });

    console.log(`[CERTIFICATE GENERATED] Issued ${certificateNumber} to ${userName} for webinar "${webinarName}"`);
    return { success: true, certificateId: certificate.id, certificateNumber };
  } catch (error: any) {
    console.error("Certificate generation error:", error);
    return { success: false, error: error.message };
  }
}

// Manual Attendance Adjustments (Admin)
export async function adjustAttendanceAction(userId: string, webinarId: string, durationMinutes: number) {
  await requireAdmin();

  // Find or create attendance
  const webinar = await db.webinar.findUnique({ where: { id: webinarId } });
  if (!webinar) throw new Error("Webinar not found.");

  const webinarDurationMin = Math.max(
    (webinar.endTime.getTime() - webinar.startTime.getTime()) / 60000,
    30
  );

  const percentage = Math.min((durationMinutes / webinarDurationMin) * 100, 100);
  const status = percentage >= 80 ? "Completed" : "Incomplete";
  const certificateEligible = status === "Completed";

  const attendance = await db.attendance.upsert({
    where: {
      userId_webinarId: {
        userId,
        webinarId,
      },
    },
    update: {
      durationMinutes,
      attendancePercentage: percentage,
      status,
      certificateEligible,
    },
    create: {
      userId,
      webinarId,
      durationMinutes,
      attendancePercentage: percentage,
      status,
      certificateEligible,
    },
  });

  revalidatePath("/admin/webinars");
  return { success: true, attendance };
}

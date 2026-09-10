"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role, VerificationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privilege required.");
  }
  return session.user;
}

/**
 * Ensures the logged-in doctor user has a Doctor model record.
 * Lazily creates one if it doesn't exist yet.
 */
export async function getOrCreateDoctorRecord(userId: string) {
  let doctor = await db.doctor.findUnique({
    where: { userId },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true, role: true }
      },
    },
  });

  if (!doctor) {
    // Check if user is a DOCTOR or ADMIN
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || (user.role !== Role.DOCTOR && user.role !== Role.ADMIN)) {
      throw new Error("Unauthorized: Doctor access required.");
    }

    const doctorIdString = "DOC-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    doctor = await db.doctor.create({
      data: {
        userId: user.id,
        doctorId: doctorIdString,
        medicalLicenseNumber: user.profile?.medicalLicenseNumber || null,
        hospitalAffiliation: user.profile?.hospitalAffiliation || null,
        specialty: user.profile?.specialty || "Surgical Oncology",
        verificationStatus: user.profile?.verificationStatus || "VERIFIED",
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true, role: true }
        },
      },
    });
  }

  return doctor;
}

/**
 * Fetches dashboard analytics and history strictly for the authenticated doctor.
 */
export async function getDoctorDashboardData() {
  const session = await auth();

  if (!session?.user || (session.user.role !== Role.DOCTOR && session.user.role !== Role.ADMIN)) {
    throw new Error("Unauthorized: Only doctors can view doctor dashboard.");
  }

  const doctor = await getOrCreateDoctorRecord(session.user.id);
  const now = new Date();

  // Fetch articles belonging strictly to this doctor
  const articles = await db.article.findMany({
    where: { doctorId: doctor.id },
    orderBy: { createdAt: "desc" },
  });

  // Fetch webinars belonging strictly to this doctor
  const webinars = await db.webinar.findMany({
    where: { doctorId: doctor.id },
    include: {
      registrations: true,
    },
    orderBy: { date: "desc" },
  });

  // Calculate strict Doctor counters
  const totalArticlesPublished = articles.filter(a => a.status === "PUBLISHED").length;
  const draftArticles = articles.filter(a => a.status === "DRAFT").length;
  const totalWebinarsCreated = webinars.length;
  
  const upcomingWebinars = webinars.filter(w => {
    const isFuture = new Date(w.date) >= now || new Date(w.startTime) >= now;
    return isFuture && w.status !== "COMPLETED" && w.status !== "CANCELLED";
  }).length;

  const completedWebinars = webinars.filter(w => {
    const isPast = new Date(w.endTime) < now || new Date(w.date) < now;
    return isPast || w.status === "COMPLETED";
  }).length;

  // Build Recent Activity Feed
  const recentArticles = articles.slice(0, 5).map(a => ({
    id: a.id,
    type: "ARTICLE",
    title: a.title,
    status: a.status,
    date: a.createdAt,
  }));

  const recentWebinars = webinars.slice(0, 5).map(w => ({
    id: w.id,
    type: "WEBINAR",
    title: w.title,
    status: w.status,
    date: w.createdAt,
  }));

  const recentActivity = [...recentArticles, ...recentWebinars]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  return {
    doctor: {
      id: doctor.id,
      doctorId: doctor.doctorId,
      name: doctor.user.name || "Dr. Medical Specialist",
      email: doctor.user.email || "",
      specialty: doctor.specialty || "Oncology Specialist",
      hospitalAffiliation: doctor.hospitalAffiliation || "General Hospital",
      medicalLicenseNumber: doctor.medicalLicenseNumber || "N/A",
      verificationStatus: doctor.verificationStatus,
      rejectionReason: doctor.rejectionReason || null,
      verificationDocument: doctor.verificationDocument || null,
    },
    stats: {
      totalArticlesPublished,
      draftArticles,
      totalWebinarsCreated,
      upcomingWebinars,
      completedWebinars,
    },
    myArticles: articles.map(a => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      category: a.category,
      excerpt: a.excerpt || a.summary || "",
      content: a.content,
      status: a.status,
      readTime: a.readTime,
      publishDate: a.createdAt.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }),
      createdAt: a.createdAt,
    })),
    myWebinars: webinars.map(w => ({
      id: w.id,
      title: w.title,
      description: w.description,
      fullContent: w.fullContent,
      category: w.category,
      date: w.date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }),
      rawDate: w.date,
      startTime: w.startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      endTime: w.endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      rawStartTime: w.startTime,
      rawEndTime: w.endTime,
      meetingLink: w.meetingLink,
      venue: w.venue,
      webinarMode: w.webinarMode,
      status: w.status,
      webinarType: w.webinarType || "FREE",
      registrationPrice: w.registrationPrice || 0,
      minimumAllowedPrice: w.minimumAllowedPrice || 0,
      durationMinutes: w.durationMinutes || 60,
      approvalStatus: w.approvalStatus || "APPROVED",
      approvalRejectionReason: w.approvalRejectionReason || null,
      maxSeats: w.maxSeats,
      registeredUsersCount: w.registrations.length,
      createdAt: w.createdAt,
    })),
    recentActivity,
  };
}

/**
 * Public function to fetch Doctor profile & their published content.
 */
export async function getDoctorPublicProfile(idOrDoctorId: string) {
  let doctor = await db.doctor.findFirst({
    where: {
      OR: [
        { id: idOrDoctorId },
        { doctorId: idOrDoctorId },
      ],
    },
    include: {
      user: {
        select: { name: true, email: true, image: true },
      },
      articles: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
      },
      webinars: {
        where: { status: { in: ["PUBLISHED", "COMPLETED"] } },
        include: { registrations: true },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!doctor) {
    return null;
  }

  return {
    id: doctor.id,
    doctorId: doctor.doctorId,
    name: doctor.user.name || "Dr. Verified Medical Practitioner",
    email: doctor.user.email,
    image: doctor.user.image,
    specialty: doctor.specialty || "Oncology Specialist",
    hospitalAffiliation: doctor.hospitalAffiliation || "Leading Cancer Research Center",
    medicalLicenseNumber: doctor.medicalLicenseNumber,
    verificationStatus: doctor.verificationStatus,
    bio: doctor.bio || `Dr. ${doctor.user.name || "Specialist"} is a dedicated medical professional committed to raising awareness, improving breast cancer screening, and providing guidance to patients.`,
    articles: doctor.articles,
    webinars: doctor.webinars,
  };
}

/**
 * Admin Action: Fetches all doctor verification requests with full details (Admin only).
 */
export async function getAdminDoctorVerificationRequests() {
  await requireAdmin();

  const doctors = await db.doctor.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
          profile: true,
        },
      },
      articles: {
        select: { id: true },
      },
      webinars: {
        select: { id: true },
      },
    },
  });

  return doctors.map((d) => ({
    id: d.id,
    doctorId: d.doctorId,
    userId: d.userId,
    name: d.user?.name || "Dr. Medical Specialist",
    email: d.user?.email || "N/A",
    image: d.user?.image || null,
    medicalLicenseNumber: d.medicalLicenseNumber || d.user?.profile?.medicalLicenseNumber || "N/A",
    hospitalAffiliation: d.hospitalAffiliation || d.user?.profile?.hospitalAffiliation || "N/A",
    specialty: d.specialty || d.user?.profile?.specialty || "N/A",
    verificationStatus: d.verificationStatus,
    rejectionReason: d.rejectionReason || d.user?.profile?.rejectionReason || null,
    verificationDocument: d.verificationDocument || null,
    createdAt: d.createdAt,
    articlesCount: d.articles.length,
    webinarsCount: d.webinars.length,
  }));
}

/**
 * Admin Action: Verifies a doctor's professional identity (Admin only).
 */
export async function approveDoctorVerificationAction(doctorId: string) {
  await requireAdmin();

  const doctor = await db.doctor.findFirst({
    where: {
      OR: [{ id: doctorId }, { doctorId: doctorId }],
    },
  });

  if (!doctor) {
    return { error: "Doctor record not found." };
  }

  // Update Doctor model
  await db.doctor.update({
    where: { id: doctor.id },
    data: {
      verificationStatus: VerificationStatus.VERIFIED,
      rejectionReason: null,
    },
  });

  // Update corresponding Profile model
  await db.profile.updateMany({
    where: { userId: doctor.userId },
    data: {
      verificationStatus: VerificationStatus.VERIFIED,
      rejectionReason: null,
    },
  });

  revalidatePath("/admin/doctors");
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Admin Action: Rejects a doctor's verification request with mandatory reason (Admin only).
 */
export async function rejectDoctorVerificationAction(doctorId: string, rejectionReason: string) {
  await requireAdmin();

  if (!rejectionReason || !rejectionReason.trim()) {
    return { error: "A reason for rejection is required." };
  }

  const doctor = await db.doctor.findFirst({
    where: {
      OR: [{ id: doctorId }, { doctorId: doctorId }],
    },
  });

  if (!doctor) {
    return { error: "Doctor record not found." };
  }

  const trimmedReason = rejectionReason.trim();

  // Update Doctor model
  await db.doctor.update({
    where: { id: doctor.id },
    data: {
      verificationStatus: VerificationStatus.REJECTED,
      rejectionReason: trimmedReason,
    },
  });

  // Update corresponding Profile model
  await db.profile.updateMany({
    where: { userId: doctor.userId },
    data: {
      verificationStatus: VerificationStatus.REJECTED,
      rejectionReason: trimmedReason,
    },
  });

  revalidatePath("/admin/doctors");
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Doctor Action: Resubmits updated professional credentials for verification (Doctor only).
 */
export async function resubmitDoctorVerificationAction(data: {
  medicalLicenseNumber: string;
  hospitalAffiliation: string;
  specialty: string;
  verificationDocument?: string;
}) {
  const session = await auth();
  if (!session?.user || (session.user.role !== Role.DOCTOR && session.user.role !== Role.ADMIN)) {
    return { error: "Unauthorized: Only doctor accounts can submit verification details." };
  }

  const licenseTrimmed = data.medicalLicenseNumber?.trim();
  const affiliationTrimmed = data.hospitalAffiliation?.trim();
  const specialtyTrimmed = data.specialty?.trim();

  if (!licenseTrimmed || licenseTrimmed.length < 3) {
    return { error: "Please enter a valid Medical License / Registration Number (minimum 3 characters)." };
  }
  if (!affiliationTrimmed) {
    return { error: "Hospital / Clinic Affiliation is required." };
  }
  if (!specialtyTrimmed) {
    return { error: "Medical Specialty is required." };
  }

  const doctor = await getOrCreateDoctorRecord(session.user.id);

  // Update Doctor model: resets verificationStatus = PENDING, clears rejectionReason
  await db.doctor.update({
    where: { id: doctor.id },
    data: {
      medicalLicenseNumber: licenseTrimmed,
      hospitalAffiliation: affiliationTrimmed,
      specialty: specialtyTrimmed,
      ...(data.verificationDocument !== undefined && { verificationDocument: data.verificationDocument?.trim() || null }),
      verificationStatus: VerificationStatus.PENDING,
      rejectionReason: null,
    },
  });

  // Update Profile model
  await db.profile.updateMany({
    where: { userId: session.user.id },
    data: {
      medicalLicenseNumber: licenseTrimmed,
      hospitalAffiliation: affiliationTrimmed,
      specialty: specialtyTrimmed,
      verificationStatus: VerificationStatus.PENDING,
      rejectionReason: null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin/doctors");
  return { success: true };
}

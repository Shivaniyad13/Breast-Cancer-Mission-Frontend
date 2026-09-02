"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role } from "@prisma/client";

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
      startTime: w.startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      endTime: w.endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      meetingLink: w.meetingLink,
      venue: w.venue,
      webinarMode: w.webinarMode,
      status: w.status,
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

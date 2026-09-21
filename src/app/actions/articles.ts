"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getOrCreateDoctorRecord } from "./doctor";
import { sendAdminRegistrationAlert, sendArticleStatusEmail } from "@/lib/email";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privilege required.");
  }
  return session.user;
}

/**
 * Creates a new article automatically linked to the logged-in doctor.
 * Default status is PENDING awaiting admin approval.
 */
export async function createDoctorArticleAction(data: {
  title: string;
  category?: string;
  excerpt?: string;
  content: string;
  fileUrl?: string;
  featuredImage?: string;
  specialty?: string;
  status?: "PENDING" | "DRAFT" | "PUBLISHED" | "APPROVED";
}) {
  const session = await auth();

  if (!session?.user || (session.user.role !== Role.DOCTOR && session.user.role !== Role.ADMIN)) {
    throw new Error("Unauthorized: Only verified Doctors or Administrators can upload articles.");
  }

  const doctor = await getOrCreateDoctorRecord(session.user.id);

  if (!data.title || (!data.content && !data.fileUrl)) {
    return { error: "Title and either content or PDF document upload are required." };
  }

  // Generate unique slug from title
  const baseSlug = data.title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
  const slug = `${baseSlug}-${uniqueSuffix}`;

  // Estimate read time
  const wordCount = (data.content || "").trim().split(/\s+/).filter(Boolean).length;
  const readTimeMins = Math.max(1, Math.ceil(wordCount / 200));
  const readTime = `${readTimeMins} min read`;

  // Doctors upload articles in PENDING state (Admins can directly approve)
  const initialStatus = session.user.role === Role.ADMIN
    ? (data.status || "APPROVED")
    : "PENDING";

  const article = await db.article.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt || (data.content ? data.content.substring(0, 160) + "..." : "Doctor Resource Document"),
      summary: data.excerpt || (data.content ? data.content.substring(0, 160) + "..." : "Doctor Resource Document"),
      content: data.content || "Uploaded PDF Document",
      category: data.category || "Clinical Resources",
      fileUrl: data.fileUrl || null,
      featuredImage: data.featuredImage || null,
      specialty: data.specialty || doctor.specialty || "Oncology Specialist",
      status: initialStatus,
      readTime,
      doctorId: doctor.id,
      authorId: session.user.id,
      ...(initialStatus === "APPROVED" && {
        approvedBy: session.user.id,
        approvedAt: new Date(),
      }),
    },
  });

  if (initialStatus === "PENDING") {
    try {
      await sendAdminRegistrationAlert({
        type: "Doctor Article Submission",
        applicantName: session.user.name || "Doctor",
        applicantEmail: session.user.email || "",
        role: "DOCTOR",
        details: `Article Title: "${article.title}"`,
      });
    } catch (e) {
      console.error("[SMTP] Failed to send admin alert for article creation:", e);
    }
  }

  revalidatePath("/care/care-providers");
  revalidatePath("/dashboard");
  revalidatePath("/admin/articles");

  return { success: true, articleId: article.id, slug: article.slug };
}

/**
 * Updates an article with strict doctor ownership verification.
 */
export async function updateDoctorArticleAction(
  articleId: string,
  data: {
    title?: string;
    category?: string;
    excerpt?: string;
    content?: string;
    fileUrl?: string;
    featuredImage?: string;
    specialty?: string;
    status?: "PENDING" | "DRAFT" | "APPROVED" | "PUBLISHED";
  }
) {
  const session = await auth();

  if (!session?.user || (session.user.role !== Role.DOCTOR && session.user.role !== Role.ADMIN)) {
    throw new Error("Unauthorized: Doctor privilege required.");
  }

  const article = await db.article.findUnique({
    where: { id: articleId },
    include: { doctor: true },
  });

  if (!article) {
    return { error: "Article not found." };
  }

  const doctor = await getOrCreateDoctorRecord(session.user.id);

  // Permission Check: Must be owner doctor OR admin
  if (session.user.role !== Role.ADMIN && article.doctorId !== doctor.id) {
    return { error: "Permission Denied: You can only edit your own articles." };
  }

  // If doctor edits an article, reset status to PENDING (unless keeping as DRAFT)
  let updatedStatus = data.status;
  if (session.user.role !== Role.ADMIN) {
    if (data.status !== "DRAFT") {
      updatedStatus = "PENDING";
    }
  }

  await db.article.update({
    where: { id: articleId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.category && { category: data.category }),
      ...(data.excerpt !== undefined && { excerpt: data.excerpt, summary: data.excerpt }),
      ...(data.content && { content: data.content }),
      ...(data.fileUrl !== undefined && { fileUrl: data.fileUrl }),
      ...(data.featuredImage !== undefined && { featuredImage: data.featuredImage }),
      ...(data.specialty && { specialty: data.specialty }),
      ...(updatedStatus && { status: updatedStatus }),
    },
  });

  revalidatePath("/care/care-providers");
  revalidatePath("/dashboard");
  revalidatePath("/admin/articles");

  return { success: true };
}

/**
 * Deletes an article with strict doctor ownership verification.
 */
export async function deleteDoctorArticleAction(articleId: string) {
  const session = await auth();

  if (!session?.user || (session.user.role !== Role.DOCTOR && session.user.role !== Role.ADMIN)) {
    throw new Error("Unauthorized: Doctor privilege required.");
  }

  const article = await db.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    return { error: "Article not found." };
  }

  const doctor = await getOrCreateDoctorRecord(session.user.id);

  // Permission Check: Must be owner doctor OR admin
  if (session.user.role !== Role.ADMIN && article.doctorId !== doctor.id) {
    return { error: "Permission Denied: You can only delete your own articles." };
  }

  await db.article.delete({
    where: { id: articleId },
  });

  revalidatePath("/care/care-providers");
  revalidatePath("/dashboard");
  revalidatePath("/admin/articles");

  return { success: true };
}

/**
 * Gets ONLY APPROVED articles for the public Care Provider page.
 * Strictly filters out PENDING and REJECTED articles.
 */
export async function getPublicApprovedArticlesAction() {
  const articles = await db.article.findMany({
    where: {
      OR: [
        { status: "APPROVED" },
        { status: "PUBLISHED" },
      ],
    },
    include: {
      doctor: {
        include: {
          user: {
            select: { name: true, email: true, image: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return articles.map(art => ({
    id: art.id,
    title: art.title,
    slug: art.slug,
    excerpt: art.excerpt || art.summary || "",
    category: art.category,
    content: art.content,
    fileUrl: art.fileUrl || null,
    featuredImage: art.featuredImage || null,
    readTime: art.readTime,
    status: art.status,
    publishDate: (art.approvedAt || art.createdAt).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }),
    doctorId: art.doctorId,
    doctorName: art.doctor?.user?.name || "Dr. Verified Specialist",
    doctorSpecialty: art.specialty || art.doctor?.specialty || "Oncology Specialist",
    doctorVerificationStatus: art.doctor?.verificationStatus || "VERIFIED",
  }));
}

/**
 * Backward compatibility alias for public articles retrieval.
 */
export async function getPublicArticlesAction() {
  return getPublicApprovedArticlesAction();
}

/**
 * Admin Action: Gets all submitted doctor articles for admin moderation.
 */
export async function getAdminArticlesAction() {
  await requireAdmin();

  const articles = await db.article.findMany({
    include: {
      doctor: {
        include: {
          user: {
            select: { name: true, email: true, image: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return articles.map(art => ({
    id: art.id,
    title: art.title,
    slug: art.slug,
    excerpt: art.excerpt || art.summary || "",
    content: art.content,
    category: art.category,
    fileUrl: art.fileUrl || null,
    featuredImage: art.featuredImage || null,
    specialty: art.specialty || art.doctor?.specialty || "Oncology Specialist",
    status: art.status,
    rejectionReason: art.rejectionReason || null,
    approvedBy: art.approvedBy || null,
    approvedAt: art.approvedAt ? art.approvedAt.toISOString() : null,
    createdAt: art.createdAt.toISOString(),
    doctorId: art.doctorId,
    doctorName: art.doctor?.user?.name || "Dr. Medical Specialist",
    doctorEmail: art.doctor?.user?.email || "",
    doctorLicense: art.doctor?.medicalLicenseNumber || "",
  }));
}

/**
 * Admin Action: Approves a doctor article (Admin only).
 */
export async function approveDoctorArticleAction(articleId: string) {
  const adminUser = await requireAdmin();

  const article = await db.article.findUnique({
    where: { id: articleId },
    include: {
      doctor: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!article) {
    return { error: "Article not found." };
  }

  const oldStatus = article.status;

  await db.article.update({
    where: { id: articleId },
    data: {
      status: "APPROVED",
      approvedBy: adminUser.id,
      approvedAt: new Date(),
      rejectionReason: null,
    },
  });

  // Duplicate email protection: send only if status transitioned to APPROVED
  if (oldStatus !== "APPROVED" && article.doctor?.user?.email) {
    try {
      await sendArticleStatusEmail({
        to: article.doctor.user.email,
        doctorName: article.doctor.user.name || "Doctor",
        articleTitle: article.title,
        status: "APPROVED",
        articleSlug: article.slug,
      });
    } catch (e) {
      console.error("[SMTP] Failed to send article approval email:", e);
    }
  }

  revalidatePath("/care/care-providers");
  revalidatePath("/admin/articles");
  revalidatePath("/dashboard");

  return { success: true };
}

/**
 * Admin Action: Rejects a doctor article with reason (Admin only).
 */
export async function rejectDoctorArticleAction(articleId: string, rejectionReason: string) {
  await requireAdmin();

  if (!rejectionReason || !rejectionReason.trim()) {
    return { error: "Rejection reason is required." };
  }

  const article = await db.article.findUnique({
    where: { id: articleId },
    include: {
      doctor: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!article) {
    return { error: "Article not found." };
  }

  const oldStatus = article.status;
  const oldReason = article.rejectionReason;
  const trimmedReason = rejectionReason.trim();

  await db.article.update({
    where: { id: articleId },
    data: {
      status: "REJECTED",
      rejectionReason: trimmedReason,
    },
  });

  // Duplicate email protection: send only if status or reason changed
  if ((oldStatus !== "REJECTED" || oldReason !== trimmedReason) && article.doctor?.user?.email) {
    try {
      await sendArticleStatusEmail({
        to: article.doctor.user.email,
        doctorName: article.doctor.user.name || "Doctor",
        articleTitle: article.title,
        status: "REJECTED",
        rejectionReason: trimmedReason,
      });
    } catch (e) {
      console.error("[SMTP] Failed to send article rejection email:", e);
    }
  }

  revalidatePath("/care/care-providers");
  revalidatePath("/admin/articles");
  revalidatePath("/dashboard");

  return { success: true };
}

/**
 * Gets a single article by slug for public detail view.
 */
export async function getArticleBySlugAction(slug: string) {
  const article = await db.article.findUnique({
    where: { slug },
    include: {
      doctor: {
        include: {
          user: {
            select: { name: true, email: true, image: true },
          },
        },
      },
    },
  });

  if (!article) {
    return null;
  }

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || article.summary || "",
    content: article.content,
    category: article.category,
    fileUrl: article.fileUrl || null,
    featuredImage: article.featuredImage || null,
    readTime: article.readTime,
    status: article.status,
    publishDate: article.createdAt.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }),
    doctorId: article.doctorId,
    doctor: article.doctor ? {
      id: article.doctor.id,
      doctorId: article.doctor.doctorId,
      name: article.doctor.user.name || "Dr. Medical Specialist",
      specialty: article.specialty || article.doctor.specialty || "Oncology Specialist",
      hospitalAffiliation: article.doctor.hospitalAffiliation || "Cancer Research Institute",
      verificationStatus: article.doctor.verificationStatus,
    } : null,
  };
}

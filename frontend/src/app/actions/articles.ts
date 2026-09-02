"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getOrCreateDoctorRecord } from "./doctor";

/**
 * Creates a new article automatically linked to the logged-in doctor.
 */
export async function createDoctorArticleAction(data: {
  title: string;
  category: string;
  excerpt?: string;
  content: string;
  status?: "PUBLISHED" | "DRAFT";
}) {
  const session = await auth();

  if (!session?.user || (session.user.role !== Role.DOCTOR && session.user.role !== Role.ADMIN)) {
    throw new Error("Unauthorized: Only verified Doctors or Administrators can publish articles.");
  }

  const doctor = await getOrCreateDoctorRecord(session.user.id);

  if (!data.title || !data.content) {
    return { error: "Title and full content are required." };
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
  const wordCount = data.content.trim().split(/\s+/).length;
  const readTimeMins = Math.max(1, Math.ceil(wordCount / 200));
  const readTime = `${readTimeMins} min read`;

  const article = await db.article.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt || data.content.substring(0, 160) + "...",
      summary: data.excerpt || data.content.substring(0, 160) + "...",
      content: data.content,
      category: data.category || "Clinical Guidance",
      status: data.status || "PUBLISHED",
      readTime,
      doctorId: doctor.id,
      authorId: session.user.id,
    },
  });

  revalidatePath("/learn/articles");
  revalidatePath("/dashboard");

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
    status?: "PUBLISHED" | "DRAFT";
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

  await db.article.update({
    where: { id: articleId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.category && { category: data.category }),
      ...(data.excerpt !== undefined && { excerpt: data.excerpt, summary: data.excerpt }),
      ...(data.content && { content: data.content }),
      ...(data.status && { status: data.status }),
    },
  });

  revalidatePath("/learn/articles");
  revalidatePath(`/learn/articles/${article.slug}`);
  revalidatePath("/dashboard");

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

  revalidatePath("/learn/articles");
  revalidatePath("/dashboard");

  return { success: true };
}

/**
 * Gets all published articles for the public website.
 */
export async function getPublicArticlesAction() {
  const articles = await db.article.findMany({
    where: { status: "PUBLISHED" },
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
    readTime: art.readTime,
    publishDate: art.createdAt.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }),
    doctorId: art.doctorId,
    doctorName: art.doctor?.user?.name || "Dr. Medical Specialist",
    doctorSpecialty: art.doctor?.specialty || "Oncology",
    doctorVerificationStatus: art.doctor?.verificationStatus || "VERIFIED",
  }));
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
      specialty: article.doctor.specialty || "Oncology Specialist",
      hospitalAffiliation: article.doctor.hospitalAffiliation || "Cancer Research Institute",
      verificationStatus: article.doctor.verificationStatus,
    } : null,
  };
}

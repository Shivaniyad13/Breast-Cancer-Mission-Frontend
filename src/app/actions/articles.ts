"use server";

import { auth } from "@/auth";
import { Role } from "@/types/enums";
import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/apiClient";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privilege required.");
  }
  return session.user;
}

/**
 * Creates a new article automatically linked to the logged-in doctor via backend Express endpoint.
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

  if (!data.title || (!data.content && !data.fileUrl)) {
    return { error: "Title and either content or PDF document upload are required." };
  }

  const isAdmin = session.user.role === Role.ADMIN;

  const res = await apiClient("/articles-content/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: session.user.id,
      isAdmin,
      userName: session.user.name,
      ...data,
    }),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    return { error: resData.message || "Failed to create article." };
  }

  const article = resData.data;

  revalidatePath("/care/care-providers");
  revalidatePath("/dashboard");
  revalidatePath("/admin/articles");

  return { success: true, articleId: article?.id, slug: article?.slug };
}

/**
 * Updates an article via backend Express endpoint.
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

  const isAdmin = session.user.role === Role.ADMIN;

  const res = await apiClient(`/articles-content/${articleId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: session.user.id,
      isAdmin,
      ...data,
    }),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    return { error: resData.message || "Failed to update article." };
  }

  revalidatePath("/care/care-providers");
  revalidatePath("/dashboard");
  revalidatePath("/admin/articles");

  return { success: true };
}

/**
 * Deletes an article via backend Express endpoint.
 */
export async function deleteDoctorArticleAction(articleId: string) {
  const session = await auth();

  if (!session?.user || (session.user.role !== Role.DOCTOR && session.user.role !== Role.ADMIN)) {
    throw new Error("Unauthorized: Doctor privilege required.");
  }

  const isAdmin = session.user.role === Role.ADMIN;

  const res = await apiClient(`/articles-content/${articleId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: session.user.id,
      isAdmin,
    }),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    return { error: resData.message || "Failed to delete article." };
  }

  revalidatePath("/care/care-providers");
  revalidatePath("/dashboard");
  revalidatePath("/admin/articles");

  return { success: true };
}

/**
 * Gets ONLY APPROVED articles for the public Care Provider page via Express backend.
 */
export async function getPublicApprovedArticlesAction() {
  const res = await apiClient("/articles-content/public", { cache: "no-store" });
  if (!res.ok) return [];
  const resData = await res.json();
  return resData.data || [];
}

/**
 * Backward compatibility alias for public articles retrieval.
 */
export async function getPublicArticlesAction() {
  return getPublicApprovedArticlesAction();
}

/**
 * Admin Action: Gets all submitted doctor articles via Express backend.
 */
export async function getAdminArticlesAction() {
  await requireAdmin();

  const res = await apiClient("/articles-content/admin", { cache: "no-store" });
  if (!res.ok) return [];
  const resData = await res.json();
  return resData.data || [];
}

/**
 * Admin Action: Approves a doctor article via Express backend.
 */
export async function approveDoctorArticleAction(articleId: string) {
  const adminUser = await requireAdmin();

  const res = await apiClient(`/articles-content/admin/${articleId}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminId: adminUser.id }),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    return { error: resData.message || "Failed to approve article." };
  }

  revalidatePath("/care/care-providers");
  revalidatePath("/admin/articles");
  revalidatePath("/dashboard");

  return { success: true };
}

/**
 * Admin Action: Rejects a doctor article via Express backend.
 */
export async function rejectDoctorArticleAction(articleId: string, rejectionReason: string) {
  await requireAdmin();

  if (!rejectionReason || !rejectionReason.trim()) {
    return { error: "Rejection reason is required." };
  }

  const res = await apiClient(`/articles-content/admin/${articleId}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rejectionReason }),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    return { error: resData.message || "Failed to reject article." };
  }

  revalidatePath("/care/care-providers");
  revalidatePath("/admin/articles");
  revalidatePath("/dashboard");

  return { success: true };
}

/**
 * Gets a single article by slug via Express backend.
 */
export async function getArticleBySlugAction(slug: string) {
  const res = await apiClient(`/articles-content/slug/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  const resData = await res.json();
  return resData.data || null;
}

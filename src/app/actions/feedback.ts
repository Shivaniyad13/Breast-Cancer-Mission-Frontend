"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role, VerificationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Admin check helper
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privileges required.");
  }
  return session.user;
}

// 1. Submit Feedback (Public)
export async function submitFeedback(data: {
  name: string;
  email: string;
  role: string;
  city?: string;
  rating: number;
  message: string;
  consent: boolean;
}) {
  try {
    if (!data.name || !data.email || !data.role || !data.message) {
      throw new Error("Name, email, role, and feedback message are required.");
    }

    if (!data.rating || data.rating < 1 || data.rating > 5) {
      throw new Error("Rating must be between 1 and 5 stars.");
    }

    if (data.message.trim().length > 500) {
      throw new Error("Feedback message must not exceed 500 characters.");
    }

    const feedback = await db.feedback.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        role: data.role.trim(),
        city: data.city ? data.city.trim() : null,
        rating: Math.round(data.rating),
        message: data.message.trim(),
        consent: Boolean(data.consent),
        status: VerificationStatus.PENDING,
      },
    });

    try {
      revalidatePath("/campaigns/membership");
      revalidatePath("/admin/memberships");
      revalidatePath("/admin/feedback");
    } catch (e) {
      // Ignore revalidate errors outside Next.js request context
    }

    return { success: true, feedback };
  } catch (error: any) {
    console.error("Error submitting feedback:", error);
    return { success: false, error: error.message || "Failed to submit feedback." };
  }
}

// 2. Fetch Approved Feedback (Public)
export async function getApprovedFeedback() {
  try {
    const feedbackList = await db.feedback.findMany({
      where: {
        status: VerificationStatus.VERIFIED,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, feedback: feedbackList };
  } catch (error: any) {
    console.error("Error fetching approved feedback:", error);
    return { success: false, error: error.message || "Failed to fetch feedback." };
  }
}

// 3. Fetch All Feedback (Admin only, supports filters and search)
export async function getAllFeedbackAdmin(filters?: {
  status?: string;
  search?: string;
}) {
  try {
    await requireAdmin();

    const whereClause: any = {};

    if (filters?.status && filters.status !== "ALL") {
      whereClause.status = filters.status as VerificationStatus;
    }

    if (filters?.search) {
      const searchLower = filters.search.trim();
      whereClause.OR = [
        { name: { contains: searchLower, mode: "insensitive" } },
        { email: { contains: searchLower, mode: "insensitive" } },
        { role: { contains: searchLower, mode: "insensitive" } },
        { city: { contains: searchLower, mode: "insensitive" } },
        { message: { contains: searchLower, mode: "insensitive" } },
      ];
    }

    const feedbackList = await db.feedback.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return { success: true, feedback: feedbackList };
  } catch (error: any) {
    console.error("Error fetching admin feedback list:", error);
    return { success: false, error: error.message || "Unauthorized or fetch failed." };
  }
}

// 4. Update Feedback Status (Admin only)
export async function updateFeedbackStatus(
  id: string,
  status: VerificationStatus | "PENDING" | "VERIFIED" | "REJECTED",
  remarks?: string
) {
  try {
    await requireAdmin();

    const existing = await db.feedback.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Feedback record not found.");
    }

    const updated = await db.feedback.update({
      where: { id },
      data: {
        status: status as VerificationStatus,
        remarks: remarks !== undefined ? remarks : existing.remarks,
      },
    });

    try {
      revalidatePath("/campaigns/membership");
      revalidatePath("/admin/memberships");
      revalidatePath("/admin/feedback");
    } catch (e) {
      // Ignore
    }

    return { success: true, feedback: updated };
  } catch (error: any) {
    console.error("Error updating feedback status:", error);
    return { success: false, error: error.message || "Failed to update feedback status." };
  }
}

// 5. Delete Feedback (Admin only)
export async function deleteFeedback(id: string) {
  try {
    await requireAdmin();

    await db.feedback.delete({
      where: { id },
    });

    try {
      revalidatePath("/campaigns/membership");
      revalidatePath("/admin/memberships");
      revalidatePath("/admin/feedback");
    } catch (e) {
      // Ignore
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting feedback:", error);
    return { success: false, error: error.message || "Failed to delete feedback." };
  }
}

// 6. Toggle Feedback Status (Admin only: VERIFIED <-> REJECTED / PENDING -> VERIFIED)
export async function toggleFeedbackStatus(id: string) {
  try {
    await requireAdmin();

    const existing = await db.feedback.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Feedback record not found.");
    }

    const newStatus =
      existing.status === VerificationStatus.VERIFIED
        ? VerificationStatus.REJECTED
        : VerificationStatus.VERIFIED;

    const updated = await db.feedback.update({
      where: { id },
      data: { status: newStatus },
    });

    try {
      revalidatePath("/campaigns/membership");
      revalidatePath("/admin/memberships");
      revalidatePath("/admin/feedback");
    } catch (e) {
      // Ignore
    }

    return { success: true, feedback: updated };
  } catch (error: any) {
    console.error("Error toggling feedback status:", error);
    return { success: false, error: error.message || "Failed to toggle feedback status." };
  }
}

"use server";

import { auth } from "@/auth";
import { Role, VerificationStatus } from "@/types/enums";
import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/apiClient";

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

    const res = await apiClient("/site-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to submit feedback." };
    }

    try {
      revalidatePath("/campaigns/membership");
      revalidatePath("/admin/memberships");
      revalidatePath("/admin/feedback");
    } catch (e) {
      // Ignore revalidate errors outside Next.js request context
    }

    return { success: true, feedback: resData.data };
  } catch (error: any) {
    console.error("Error submitting feedback:", error);
    return { success: false, error: error.message || "Failed to submit feedback." };
  }
}

// 2. Fetch Approved Feedback (Public)
export async function getApprovedFeedback() {
  try {
    const res = await apiClient("/site-feedback/public", { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || "Failed to fetch feedback." };
    }
    const resData = await res.json();
    return { success: true, feedback: resData.data || [] };
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

    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.set("status", filters.status);
    if (filters?.search) queryParams.set("search", filters.search);

    const res = await apiClient(`/site-feedback/admin?${queryParams.toString()}`, { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || "Unauthorized or fetch failed." };
    }
    const resData = await res.json();
    return { success: true, feedback: resData.data || [] };
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

    const res = await apiClient(`/site-feedback/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, remarks }),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to update feedback status." };
    }

    try {
      revalidatePath("/campaigns/membership");
      revalidatePath("/admin/memberships");
      revalidatePath("/admin/feedback");
    } catch (e) {
      // Ignore
    }

    return { success: true, feedback: resData.data };
  } catch (error: any) {
    console.error("Error updating feedback status:", error);
    return { success: false, error: error.message || "Failed to update feedback status." };
  }
}

// 5. Delete Feedback (Admin only)
export async function deleteFeedback(id: string) {
  try {
    await requireAdmin();

    const res = await apiClient(`/site-feedback/${id}`, {
      method: "DELETE",
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to delete feedback." };
    }

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

    const res = await apiClient(`/site-feedback/${id}/toggle-active`, {
      method: "PATCH",
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to toggle feedback status." };
    }

    try {
      revalidatePath("/campaigns/membership");
      revalidatePath("/admin/memberships");
      revalidatePath("/admin/feedback");
    } catch (e) {
      // Ignore
    }

    return { success: true, feedback: resData.data };
  } catch (error: any) {
    console.error("Error toggling feedback status:", error);
    return { success: false, error: error.message || "Failed to toggle feedback status." };
  }
}

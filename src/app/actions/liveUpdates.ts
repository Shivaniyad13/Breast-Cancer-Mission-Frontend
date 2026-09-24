"use server";

import { auth } from "@/auth";
import { Role } from "@/types/enums";
import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/apiClient";

// Helper for admin auth check
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privilege required.");
  }
  return session.user;
}

// 1. Fetch live updates
export async function getLiveUpdates(onlyActive: boolean = false) {
  try {
    const res = await apiClient(`/live-updates?onlyActive=${onlyActive}`, { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || "Failed to fetch live updates" };
    }
    const resData = await res.json();
    return { success: true, updates: resData.data || [] };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch live updates" };
  }
}

// 2. Create update
export async function createLiveUpdate(data: {
  category: string;
  imageUrl?: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  eventDate?: Date | null;
  eventTime?: string;
  venue?: string;
  speakerName?: string;
  registrationLink?: string;
  externalLink?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  publishDate?: Date | null;
  expiryDate?: Date | null;
}) {
  try {
    await requireAdmin();

    const res = await apiClient("/live-updates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to create update" };
    }

    revalidatePath("/");
    return { success: true, update: resData.data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create update" };
  }
}

// 3. Update update details
export async function updateLiveUpdate(id: string, data: {
  category?: string;
  imageUrl?: string | null;
  title?: string;
  shortDescription?: string;
  fullDescription?: string | null;
  eventDate?: Date | null;
  eventTime?: string | null;
  venue?: string | null;
  speakerName?: string | null;
  registrationLink?: string | null;
  externalLink?: string | null;
  isFeatured?: boolean;
  isActive?: boolean;
  publishDate?: Date | null;
  expiryDate?: Date | null;
}) {
  try {
    await requireAdmin();

    const res = await apiClient(`/live-updates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to update live update" };
    }

    revalidatePath("/");
    return { success: true, update: resData.data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update live update" };
  }
}

// 4. Delete update
export async function deleteLiveUpdate(id: string) {
  try {
    await requireAdmin();

    const res = await apiClient(`/live-updates/${id}`, {
      method: "DELETE",
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to delete live update" };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete live update" };
  }
}

// 5. Reorder updates using lists of IDs
export async function reorderLiveUpdates(orderedIds: string[]) {
  try {
    await requireAdmin();

    const res = await apiClient("/live-updates/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to reorder updates" };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reorder updates" };
  }
}

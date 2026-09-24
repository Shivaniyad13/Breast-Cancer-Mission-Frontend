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

// 1. Fetch updates
export async function getHomePageUpdates(onlyActive: boolean = false) {
  try {
    const res = await apiClient(`/homepage-updates?onlyActive=${onlyActive}`, { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || "Failed to fetch updates" };
    }
    const resData = await res.json();
    return { success: true, updates: resData.data || [] };
  } catch (error: any) {
    console.error("Error fetching homepage updates:", error);
    return { success: false, error: error.message || "Failed to fetch updates" };
  }
}

// 2. Create update
export async function createHomePageUpdate(data: {
  category: string;
  imageUrl?: string;
  title: string;
  shortDescription: string;
  detailedContent?: string;
  eventDate?: Date | null;
  destinationLink?: string;
  isActive?: boolean;
}) {
  try {
    await requireAdmin();

    const res = await apiClient("/homepage-updates", {
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
    console.error("Error creating homepage update:", error);
    return { success: false, error: error.message || "Failed to create update" };
  }
}

// 3. Update update details
export async function updateHomePageUpdate(id: string, data: {
  category?: string;
  imageUrl?: string | null;
  title?: string;
  shortDescription?: string;
  detailedContent?: string | null;
  eventDate?: Date | null;
  destinationLink?: string | null;
  isActive?: boolean;
}) {
  try {
    await requireAdmin();

    const res = await apiClient(`/homepage-updates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to update update" };
    }

    revalidatePath("/");
    return { success: true, update: resData.data };
  } catch (error: any) {
    console.error("Error updating homepage update:", error);
    return { success: false, error: error.message || "Failed to update update" };
  }
}

// 4. Delete update
export async function deleteHomePageUpdate(id: string) {
  try {
    await requireAdmin();

    const res = await apiClient(`/homepage-updates/${id}`, {
      method: "DELETE",
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to delete update" };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting homepage update:", error);
    return { success: false, error: error.message || "Failed to delete update" };
  }
}

// 5. Reorder updates using lists of IDs
export async function reorderHomePageUpdates(orderedIds: string[]) {
  try {
    await requireAdmin();

    const res = await apiClient("/homepage-updates/reorder", {
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
    console.error("Error reordering homepage updates:", error);
    return { success: false, error: error.message || "Failed to reorder updates" };
  }
}

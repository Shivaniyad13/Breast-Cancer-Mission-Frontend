"use server";

import { auth } from "@/auth";
import { Role } from "@/types/enums";
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

// 1. Fetch Active Gallery Items (Public)
export async function getActiveGalleryItems() {
  try {
    const res = await apiClient("/gallery-items/public", { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || "Failed to fetch gallery items." };
    }
    const resData = await res.json();
    return { success: true, items: resData.data || [] };
  } catch (error: any) {
    console.error("Error fetching active gallery items:", error);
    return { success: false, error: error.message || "Failed to fetch gallery items." };
  }
}

// 2. Fetch All Gallery Items (Admin)
export async function getAllGalleryItems() {
  try {
    await requireAdmin();

    const res = await apiClient("/gallery-items/admin", { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || "Unauthorized or fetch failed." };
    }
    const resData = await res.json();
    return { success: true, items: resData.data || [] };
  } catch (error: any) {
    console.error("Error fetching all gallery items for admin:", error);
    return { success: false, error: error.message || "Unauthorized or fetch failed." };
  }
}

// 3. Create Gallery Item (Admin)
export async function createGalleryItem(data: {
  imageUrl: string;
  caption: string;
  category: string;
  eventDate?: string | Date | null;
  orderIndex?: number;
}) {
  try {
    await requireAdmin();

    if (!data.imageUrl || !data.caption || !data.category) {
      throw new Error("Image URL, caption, and category are required.");
    }

    const res = await apiClient("/gallery-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to create gallery item." };
    }

    revalidatePath("/care/partner-organizations");
    revalidatePath("/admin/gallery");

    return { success: true, item: resData.data };
  } catch (error: any) {
    console.error("Error creating gallery item:", error);
    return { success: false, error: error.message || "Failed to create gallery item." };
  }
}

// 4. Update Gallery Item (Admin)
export async function updateGalleryItem(
  id: string,
  data: {
    imageUrl?: string;
    caption?: string;
    category?: string;
    eventDate?: string | Date | null;
    orderIndex?: number;
    isActive?: boolean;
  }
) {
  try {
    await requireAdmin();

    const res = await apiClient(`/gallery-items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to update gallery item." };
    }

    revalidatePath("/care/partner-organizations");
    revalidatePath("/admin/gallery");

    return { success: true, item: resData.data };
  } catch (error: any) {
    console.error("Error updating gallery item:", error);
    return { success: false, error: error.message || "Failed to update gallery item." };
  }
}

// 5. Delete Gallery Item (Admin)
export async function deleteGalleryItem(id: string) {
  try {
    await requireAdmin();

    const res = await apiClient(`/gallery-items/${id}`, {
      method: "DELETE",
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to delete gallery item." };
    }

    revalidatePath("/care/partner-organizations");
    revalidatePath("/admin/gallery");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting gallery item:", error);
    return { success: false, error: error.message || "Failed to delete gallery item." };
  }
}

// 6. Toggle Gallery Item Active State (Admin)
export async function toggleGalleryItemActive(id: string) {
  try {
    await requireAdmin();

    const res = await apiClient(`/gallery-items/${id}/toggle-active`, {
      method: "PATCH",
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to toggle gallery item active status." };
    }

    revalidatePath("/care/partner-organizations");
    revalidatePath("/admin/gallery");

    return { success: true, item: resData.data };
  } catch (error: any) {
    console.error("Error toggling gallery item active state:", error);
    return { success: false, error: error.message || "Failed to toggle gallery item active status." };
  }
}

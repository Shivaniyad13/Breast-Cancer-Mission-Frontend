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

// 1. Fetch Active Video Stories (Public)
export async function getActiveVideoStories() {
  try {
    const res = await apiClient("/video-stories/public", { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || "Failed to fetch video stories." };
    }
    const resData = await res.json();
    return { success: true, stories: resData.data || [] };
  } catch (error: any) {
    console.error("Error fetching active video stories:", error);
    return { success: false, error: error.message || "Failed to fetch video stories." };
  }
}

// 2. Fetch All Video Stories (Admin)
export async function getAllVideoStories() {
  try {
    await requireAdmin();

    const res = await apiClient("/video-stories/admin", { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || "Unauthorized or fetch failed." };
    }
    const resData = await res.json();
    return { success: true, stories: resData.data || [] };
  } catch (error: any) {
    console.error("Error fetching all video stories for admin:", error);
    return { success: false, error: error.message || "Unauthorized or fetch failed." };
  }
}

// 3. Create Video Story (Admin Manual Upload)
export async function createVideoStory(data: {
  title: string;
  category: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  description?: string | null;
  orderIndex?: number;
}) {
  try {
    await requireAdmin();

    if (!data.title || !data.category || !data.videoUrl) {
      throw new Error("Title, category, and video URL are required.");
    }

    const res = await apiClient("/video-stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to create video story." };
    }

    revalidatePath("/care/partner-organizations");
    revalidatePath("/admin/video-stories");

    return { success: true, story: resData.data };
  } catch (error: any) {
    console.error("Error creating video story:", error);
    return { success: false, error: error.message || "Failed to create video story." };
  }
}

// 4. Update Video Story (Admin)
export async function updateVideoStory(
  id: string,
  data: {
    title?: string;
    category?: string;
    videoUrl?: string;
    thumbnailUrl?: string | null;
    description?: string | null;
    orderIndex?: number;
    isActive?: boolean;
  }
) {
  try {
    await requireAdmin();

    const res = await apiClient(`/video-stories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to update video story." };
    }

    revalidatePath("/care/partner-organizations");
    revalidatePath("/admin/video-stories");

    return { success: true, story: resData.data };
  } catch (error: any) {
    console.error("Error updating video story:", error);
    return { success: false, error: error.message || "Failed to update video story." };
  }
}

// 5. Delete Video Story (Admin)
export async function deleteVideoStory(id: string) {
  try {
    await requireAdmin();

    const res = await apiClient(`/video-stories/${id}`, {
      method: "DELETE",
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to delete video story." };
    }

    revalidatePath("/care/partner-organizations");
    revalidatePath("/admin/video-stories");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting video story:", error);
    return { success: false, error: error.message || "Failed to delete video story." };
  }
}

// 6. Toggle Video Story Active State (Admin)
export async function toggleVideoStoryActive(id: string) {
  try {
    await requireAdmin();

    const res = await apiClient(`/video-stories/${id}/toggle-active`, {
      method: "PATCH",
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to toggle video story active status." };
    }

    revalidatePath("/care/partner-organizations");
    revalidatePath("/admin/video-stories");

    return { success: true, story: resData.data };
  } catch (error: any) {
    console.error("Error toggling video story active state:", error);
    return { success: false, error: error.message || "Failed to toggle video story active status." };
  }
}

// 7. Helper: Auto-create Video Story from Verified Success Story
export async function autoCreateVideoFromSuccessStory(successStory: {
  id: string;
  storyTitle: string;
  videoUrl: string;
  imageUrls?: string[];
  completeStory: string;
}) {
  try {
    if (!successStory.videoUrl) return { success: false, error: "No video URL provided." };

    const res = await apiClient("/video-stories/auto-create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(successStory),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to auto-create video story." };
    }

    revalidatePath("/care/partner-organizations");
    revalidatePath("/admin/video-stories");

    return { success: true, story: resData.data };
  } catch (error: any) {
    console.error("Error auto-creating video story from success story:", error);
    return { success: false, error: error.message || "Failed to auto-create video story." };
  }
}

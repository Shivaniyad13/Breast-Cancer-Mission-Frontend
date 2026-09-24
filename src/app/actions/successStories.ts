"use server";

import { auth } from "@/auth";
import { Role, VerificationStatus } from "@/types/enums";
import { revalidatePath } from "next/cache";
import { autoCreateVideoFromSuccessStory } from "./videoStories";
import { apiClient } from "@/lib/apiClient";

// Helper for admin auth
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privilege required.");
  }
  return session.user;
}

// 1. Submit a story (Public / User submission)
export async function submitSuccessStory(data: {
  fullName: string;
  email: string;
  mobileNumber: string;
  city: string;
  state: string;
  age?: number;
  roleType: string;
  storyTitle: string;
  completeStory: string;
  videoUrl?: string;
  imageUrls: string[];
  treatmentHospital?: string;
  consent: boolean;
}) {
  try {
    if (!data.consent) {
      throw new Error("Consent is required to submit a success story.");
    }

    const res = await apiClient("/success-stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to submit story" };
    }

    revalidatePath("/");
    return { success: true, storyId: resData.data?.id };
  } catch (error: any) {
    console.error("Error submitting story:", error);
    return { success: false, error: error.message || "Failed to submit story" };
  }
}

// 2. Fetch approved stories (Public homepage)
export async function getApprovedSuccessStories() {
  try {
    const res = await apiClient("/success-stories/approved", { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || "Failed to fetch stories" };
    }
    const resData = await res.json();
    return { success: true, stories: resData.data || [] };
  } catch (error: any) {
    console.error("Error fetching approved stories:", error);
    return { success: false, error: error.message || "Failed to fetch stories" };
  }
}

// 2b. Fetch public success stories for Partner Organizations page
export async function getPublicSuccessStories() {
  try {
    const res = await apiClient("/success-stories/approved", { cache: "no-store" });
    if (!res.ok) {
      return { success: false, error: "Failed to fetch stories", stories: [] };
    }
    const resData = await res.json();
    return { success: true, stories: resData.data || [] };
  } catch (error: any) {
    console.error("Error fetching public success stories:", error);
    return { success: false, error: error.message || "Failed to fetch stories", stories: [] };
  }
}

// 3. Fetch single story by ID (Public detail page)
export async function getSuccessStoryById(id: string) {
  try {
    const res = await apiClient(`/success-stories/${id}`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Story not found");
    }
    const resData = await res.json();
    return { success: true, story: resData.data };
  } catch (error: any) {
    console.error("Error fetching success story:", error);
    return { success: false, error: error.message || "Failed to fetch story" };
  }
}

// 4. Fetch all stories (Admin dashboard)
export async function getAdminSuccessStories() {
  try {
    await requireAdmin();

    const res = await apiClient("/success-stories/admin", { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || "Unauthorized or fetch failed" };
    }
    const resData = await res.json();
    return { success: true, stories: resData.data || [] };
  } catch (error: any) {
    console.error("Error fetching admin stories:", error);
    return { success: false, error: error.message || "Unauthorized or fetch failed" };
  }
}

// 5. Update story status (Admin Approve / Reject / Pending)
export async function updateSuccessStoryStatus(id: string, status: VerificationStatus) {
  try {
    await requireAdmin();

    const res = await apiClient(`/success-stories/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to update status" };
    }

    const result = resData.data;

    if (status === VerificationStatus.VERIFIED && result.videoUrl) {
      await autoCreateVideoFromSuccessStory({
        id: result.story.id,
        storyTitle: result.storyTitle,
        videoUrl: result.videoUrl,
        imageUrls: result.imageUrls,
        completeStory: result.completeStory,
      });
    }

    revalidatePath("/");
    revalidatePath("/care/partner-organizations");
    revalidatePath("/admin/video-stories");
    return { success: true, story: result.story || result };
  } catch (error: any) {
    console.error("Error updating story status:", error);
    return { success: false, error: error.message || "Failed to update status" };
  }
}

// 6. Edit story (Admin Edit)
export async function editSuccessStory(id: string, data: {
  fullName?: string;
  city?: string;
  state?: string;
  age?: number;
  roleType?: string;
  storyTitle?: string;
  completeStory?: string;
  videoUrl?: string;
  treatmentHospital?: string;
}) {
  try {
    await requireAdmin();

    const res = await apiClient(`/success-stories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to edit story" };
    }

    revalidatePath("/");
    return { success: true, story: resData.data };
  } catch (error: any) {
    console.error("Error editing success story:", error);
    return { success: false, error: error.message || "Failed to edit story" };
  }
}

// 7. Delete story (Admin Delete)
export async function deleteSuccessStory(id: string) {
  try {
    await requireAdmin();

    const res = await apiClient(`/success-stories/${id}`, {
      method: "DELETE",
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to delete story" };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting success story:", error);
    return { success: false, error: error.message || "Failed to delete story" };
  }
}

"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
    const stories = await db.videoStory.findMany({
      where: { isActive: true },
      orderBy: [
        { orderIndex: "asc" },
        { createdAt: "desc" },
      ],
    });
    return { success: true, stories };
  } catch (error: any) {
    console.error("Error fetching active video stories:", error);
    return { success: false, error: error.message || "Failed to fetch video stories." };
  }
}

// 2. Fetch All Video Stories (Admin)
export async function getAllVideoStories() {
  try {
    await requireAdmin();
    const stories = await db.videoStory.findMany({
      include: {
        successStory: {
          select: {
            id: true,
            fullName: true,
            roleType: true,
            status: true,
          },
        },
      },
      orderBy: [
        { orderIndex: "asc" },
        { createdAt: "desc" },
      ],
    });
    return { success: true, stories };
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

    const story = await db.videoStory.create({
      data: {
        title: data.title,
        category: data.category,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl || null,
        description: data.description || null,
        sourceType: "ADMIN",
        orderIndex: data.orderIndex ?? 0,
        isActive: true,
      },
    });

    revalidatePath("/care/partner-organizations");
    revalidatePath("/admin/video-stories");

    return { success: true, story };
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

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl;
    if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.orderIndex !== undefined) updateData.orderIndex = data.orderIndex;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const story = await db.videoStory.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/care/partner-organizations");
    revalidatePath("/admin/video-stories");

    return { success: true, story };
  } catch (error: any) {
    console.error("Error updating video story:", error);
    return { success: false, error: error.message || "Failed to update video story." };
  }
}

// 5. Delete Video Story (Admin)
export async function deleteVideoStory(id: string) {
  try {
    await requireAdmin();

    const existing = await db.videoStory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Video story not found.");
    }

    if (existing.sourceType === "SUCCESS_STORY") {
      // Deactivate instead of hard deleting to preserve linkage
      await db.videoStory.update({
        where: { id },
        data: { isActive: false },
      });
    } else {
      await db.videoStory.delete({
        where: { id },
      });
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

    const existing = await db.videoStory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Video story not found.");
    }

    const story = await db.videoStory.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });

    revalidatePath("/care/partner-organizations");
    revalidatePath("/admin/video-stories");

    return { success: true, story };
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

    // Check if video story already exists for this successStoryId
    const existing = await db.videoStory.findFirst({
      where: { successStoryId: successStory.id },
    });

    let story;
    if (existing) {
      story = await db.videoStory.update({
        where: { id: existing.id },
        data: {
          title: successStory.storyTitle,
          category: "Survivor Stories",
          videoUrl: successStory.videoUrl,
          thumbnailUrl: successStory.imageUrls?.[0] || null,
          description: successStory.completeStory.slice(0, 200),
          isActive: true,
        },
      });
    } else {
      story = await db.videoStory.create({
        data: {
          title: successStory.storyTitle,
          category: "Survivor Stories",
          videoUrl: successStory.videoUrl,
          thumbnailUrl: successStory.imageUrls?.[0] || null,
          description: successStory.completeStory.slice(0, 200),
          sourceType: "SUCCESS_STORY",
          successStoryId: successStory.id,
          isActive: true,
        },
      });
    }

    revalidatePath("/care/partner-organizations");
    revalidatePath("/admin/video-stories");

    return { success: true, story };
  } catch (error: any) {
    console.error("Error auto-creating video story from success story:", error);
    return { success: false, error: error.message || "Failed to auto-create video story." };
  }
}

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

// 1. Fetch Active Gallery Items (Public)
export async function getActiveGalleryItems() {
  try {
    const items = await db.galleryItem.findMany({
      where: { isActive: true },
      orderBy: [
        { orderIndex: "asc" },
        { createdAt: "desc" },
      ],
    });
    return { success: true, items };
  } catch (error: any) {
    console.error("Error fetching active gallery items:", error);
    return { success: false, error: error.message || "Failed to fetch gallery items." };
  }
}

// 2. Fetch All Gallery Items (Admin)
export async function getAllGalleryItems() {
  try {
    await requireAdmin();
    const items = await db.galleryItem.findMany({
      orderBy: [
        { orderIndex: "asc" },
        { createdAt: "desc" },
      ],
    });
    return { success: true, items };
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

    const item = await db.galleryItem.create({
      data: {
        imageUrl: data.imageUrl,
        caption: data.caption,
        category: data.category,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        orderIndex: data.orderIndex ?? 0,
        isActive: true,
      },
    });

    revalidatePath("/care/partner-organizations");
    revalidatePath("/admin/gallery");

    return { success: true, item };
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

    const updateData: any = {};
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.caption !== undefined) updateData.caption = data.caption;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.eventDate !== undefined) updateData.eventDate = data.eventDate ? new Date(data.eventDate) : null;
    if (data.orderIndex !== undefined) updateData.orderIndex = data.orderIndex;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const item = await db.galleryItem.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/care/partner-organizations");
    revalidatePath("/admin/gallery");

    return { success: true, item };
  } catch (error: any) {
    console.error("Error updating gallery item:", error);
    return { success: false, error: error.message || "Failed to update gallery item." };
  }
}

// 5. Delete Gallery Item (Admin)
export async function deleteGalleryItem(id: string) {
  try {
    await requireAdmin();

    await db.galleryItem.delete({
      where: { id },
    });

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

    const existing = await db.galleryItem.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Gallery item not found.");
    }

    const item = await db.galleryItem.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });

    revalidatePath("/care/partner-organizations");
    revalidatePath("/admin/gallery");

    return { success: true, item };
  } catch (error: any) {
    console.error("Error toggling gallery item active state:", error);
    return { success: false, error: error.message || "Failed to toggle gallery item active status." };
  }
}

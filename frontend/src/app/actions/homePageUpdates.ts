"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Helper for admin auth check
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privilege required.");
  }
  return session.user;
}

const SEED_UPDATES = [
  {
    category: "Webinar",
    title: "Early Detection Oncology Panel Live Q&A",
    shortDescription: "Learn from lead oncologists about regular clinical screenings, self-check timings, and treatment plans. Join our Zoom meeting room this weekend.",
    imageUrl: "/images/awareness4.png",
    destinationLink: "/webinars",
    eventDate: new Date("2026-07-25T14:30:00Z"),
    orderIndex: 0,
    isActive: true
  },
  {
    category: "Campaign",
    title: "FundLife Campaign: Support Anjali's Chemotherapy",
    shortDescription: "Anjali is undergoing treatment for stage II breast cancer at KEM Hospital. Direct hospital payout coordination ensures your donation builds hope.",
    imageUrl: "/images/awareness2.png",
    destinationLink: "/campaigns",
    eventDate: null,
    orderIndex: 1,
    isActive: true
  },
  {
    category: "News",
    title: "50 Free Mammography Screenings in Pune",
    shortDescription: "Collaborative clinical test drives are launched in association with NGO Khushi Centre. Apply for free checkups.",
    imageUrl: "/images/mammography_screening.png",
    destinationLink: "/campaigns/awareness",
    eventDate: new Date("2026-08-01T09:00:00Z"),
    orderIndex: 2,
    isActive: true
  },
  {
    category: "Tip",
    title: "Breast Self-Examination (BSE) Routine",
    shortDescription: "Regular checks help spot unusual lumps early. Oncologists recommend spending 10 minutes every month conducting checks. Learn standard procedures.",
    imageUrl: "/images/awareness_ribbon.png",
    destinationLink: "/learn/bse-guide",
    eventDate: null,
    orderIndex: 3,
    isActive: true
  }
];

// Seed updates if table is empty
async function ensureSeedUpdates() {
  try {
    const count = await db.homePageUpdate.count();
    if (count === 0) {
      for (const update of SEED_UPDATES) {
        await db.homePageUpdate.create({ data: update });
      }
    }
  } catch (error) {
    console.error("Failed to seed Home Page Updates:", error);
  }
}

// 1. Fetch updates
export async function getHomePageUpdates(onlyActive: boolean = false) {
  try {
    await ensureSeedUpdates();
    
    const where: any = {};
    if (onlyActive) {
      where.isActive = true;
    }

    const updates = await db.homePageUpdate.findMany({
      where,
      orderBy: [
        { orderIndex: "asc" },
        { createdAt: "desc" }
      ]
    });

    return { success: true, updates };
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

    // Get max order index to put at the end
    const lastItem = await db.homePageUpdate.findFirst({
      orderBy: { orderIndex: "desc" }
    });
    const orderIndex = lastItem ? lastItem.orderIndex + 1 : 0;

    const newUpdate = await db.homePageUpdate.create({
      data: {
        category: data.category,
        imageUrl: data.imageUrl || null,
        title: data.title,
        shortDescription: data.shortDescription,
        detailedContent: data.detailedContent || null,
        eventDate: data.eventDate || null,
        destinationLink: data.destinationLink || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        orderIndex
      }
    });

    revalidatePath("/");
    return { success: true, update: newUpdate };
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

    const updated = await db.homePageUpdate.update({
      where: { id },
      data
    });

    revalidatePath("/");
    return { success: true, update: updated };
  } catch (error: any) {
    console.error("Error updating homepage update:", error);
    return { success: false, error: error.message || "Failed to update update" };
  }
}

// 4. Delete update
export async function deleteHomePageUpdate(id: string) {
  try {
    await requireAdmin();

    await db.homePageUpdate.delete({
      where: { id }
    });

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

    // Perform updates in transaction
    const updatePromises = orderedIds.map((id, index) => 
      db.homePageUpdate.update({
        where: { id },
        data: { orderIndex: index }
      })
    );

    await db.$transaction(updatePromises);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error reordering homepage updates:", error);
    return { success: false, error: error.message || "Failed to reorder updates" };
  }
}

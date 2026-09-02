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
    title: "Genetic Mutation & Screening Panel Live Q&A",
    shortDescription: "Learn from lead oncologists about BRCA1/BRCA2 genetic mutations, screening guidelines, and risk factors.",
    fullDescription: "Join Dr. Jyoti Bajpai as we explore breast self-examination schedules, clinical checkups, genetic mappings, and answering public questions live on Zoom.",
    eventDate: new Date("2026-07-28T14:30:00Z"),
    eventTime: "14:30",
    venue: "Zoom Meeting Room ID 841-392",
    speakerName: "Dr. Jyoti Bajpai",
    registrationLink: "/webinars",
    isFeatured: true,
    isActive: true,
    orderIndex: 0
  },
  {
    category: "Campaign",
    title: "Aasha Initiative: Mobile Screening Vans",
    shortDescription: "Funding specialized oncology vans to deliver free physical checks and mammography to rural women.",
    fullDescription: "In coordination with Khushi NGO, we plan to launch mobile mammography vans visiting underserved villages. Donate to buy equipment.",
    eventDate: new Date("2026-08-15T09:00:00Z"),
    venue: "Rural Communities in Maharashtra",
    registrationLink: "/campaigns",
    isFeatured: true,
    isActive: true,
    orderIndex: 1
  },
  {
    category: "News",
    title: "93% Success Rates on Targeted Care Protocols",
    shortDescription: "New clinical research trials indicate excellent recovery rates using personalized targeted chemotherapy.",
    fullDescription: "Published in the Oncology Research Journal, new custom hormone blockers show high prevention efficacy in early-stage survivors.",
    externalLink: "/learn/articles",
    isFeatured: false,
    isActive: true,
    orderIndex: 2
  }
];

async function ensureSeedLiveUpdates() {
  try {
    const count = await db.liveUpdate.count();
    if (count === 0) {
      for (const update of SEED_UPDATES) {
        await db.liveUpdate.create({ data: update });
      }
    }
  } catch (error) {
    console.error("Failed to seed Live Updates:", error);
  }
}

// 1. Fetch live updates
export async function getLiveUpdates(onlyActive: boolean = false) {
  try {
    await ensureSeedLiveUpdates();
    const where: any = {};
    if (onlyActive) {
      where.isActive = true;
    }
    const updates = await db.liveUpdate.findMany({
      where,
      orderBy: { orderIndex: "asc" }
    });
    return { success: true, updates };
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
    const lastItem = await db.liveUpdate.findFirst({ orderBy: { orderIndex: "desc" } });
    const orderIndex = lastItem ? lastItem.orderIndex + 1 : 0;

    const newUpdate = await db.liveUpdate.create({
      data: {
        category: data.category,
        imageUrl: data.imageUrl || null,
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription || null,
        eventDate: data.eventDate || null,
        eventTime: data.eventTime || null,
        venue: data.venue || null,
        speakerName: data.speakerName || null,
        registrationLink: data.registrationLink || null,
        externalLink: data.externalLink || null,
        isFeatured: data.isFeatured !== undefined ? data.isFeatured : false,
        isActive: data.isActive !== undefined ? data.isActive : true,
        publishDate: data.publishDate || null,
        expiryDate: data.expiryDate || null,
        orderIndex
      }
    });

    revalidatePath("/");
    return { success: true, update: newUpdate };
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
    const updated = await db.liveUpdate.update({
      where: { id },
      data
    });
    revalidatePath("/");
    return { success: true, update: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update live update" };
  }
}

// 4. Delete update
export async function deleteLiveUpdate(id: string) {
  try {
    await requireAdmin();
    await db.liveUpdate.delete({ where: { id } });
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
    const promises = orderedIds.map((id, index) => 
      db.liveUpdate.update({
        where: { id },
        data: { orderIndex: index }
      })
    );
    await db.$transaction(promises);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reorder updates" };
  }
}

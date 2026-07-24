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

const SEED_BANNERS = [
  {
    logoUrl: "/grs-group-logo.jpg",
    imageUrl: "/images/mammography_screening.png",
    title: "Cancer Diagnostics",
    description: "Providing high-tech mammography screenings and patient care guidance in coordination with regional medical centers.",
    destinationLink: "/care/partner-organizations",
    orderIndex: 0,
    isActive: true
  },
  {
    logoUrl: "/khushi-logo.jpg",
    imageUrl: "/images/support_group.png",
    title: "Khushi Rehab & Research",
    description: "Rehabilitation therapies, mental wellness programs, and survivorship advocacy platforms for cancer patients.",
    destinationLink: "https://khushicentre.in/",
    orderIndex: 1,
    isActive: true
  }
];

const SEED_TESTIMONIALS = [
  {
    name: "Dr. Jyoti Bajpai",
    profession: "Senior Oncologist, TMH",
    videoUrl: "/Breast Cancer Survivor Story _ A Journey of Hope, Strength & Healing _ Dr. Jyoti Bajpai.mp4",
    thumbnailUrl: "/images/awareness_ribbon.png",
    duration: "11:58",
    quote: "Early screening and genetic mapping are the ultimate defenses against breast cancer progression.",
    orderIndex: 0,
    isActive: true
  },
  {
    name: "Sharda Deshmukh",
    profession: "Breast Cancer Survivor",
    videoUrl: "/vidssave.com From Diagnosis to Recovery _ Breast Cancer Patient Story 720P.mp4",
    thumbnailUrl: "/images/survivor_strength.png",
    duration: "10:14",
    quote: "Strength is born in moments you think you can't go on. Early checkups saved my family.",
    orderIndex: 1,
    isActive: true
  },
  {
    name: "Kareena Kapoor Khan",
    profession: "Actress & Campaign Ambassador",
    videoUrl: "/fCJDcVOcf4mwHu6auQwh+9LaEZi9UTik.mp4",
    thumbnailUrl: "/images/awareness_ribbon.png",
    duration: "0:47",
    quote: "Your health is in your hands. A simple screening can detect breast cancer early and save your life.",
    orderIndex: 2,
    isActive: true
  },
  {
    name: "Manushi Chhillar",
    profession: "Miss World 2017 & Actor",
    videoUrl: "/l3KWdaaykG6eQV5w8YSw+LYIJd_VnYho.mp4",
    thumbnailUrl: "/images/survivor_strength.png",
    duration: "0:58",
    quote: "Raising awareness about breast cancer is a collective responsibility. Early detection saves lives.",
    orderIndex: 3,
    isActive: true
  }
];

// Seed databases if empty
async function ensureSeedBanners() {
  try {
    const count = await db.sponsorBanner.count();
    if (count === 0) {
      for (const banner of SEED_BANNERS) {
        await db.sponsorBanner.create({ data: banner });
      }
    }
  } catch (error) {
    console.error("Failed to seed Sponsor Banners:", error);
  }
}

async function ensureSeedTestimonials() {
  try {
    const count = await db.celebrityTestimonial.count();
    if (count === 0) {
      for (const t of SEED_TESTIMONIALS) {
        await db.celebrityTestimonial.create({ data: t });
      }
    }
  } catch (error) {
    console.error("Failed to seed Celebrity Testimonials:", error);
  }
}

// ==========================================
// SPONSOR BANNERS ACTIONS
// ==========================================
export async function getSponsorBanners(onlyActive: boolean = false) {
  try {
    await ensureSeedBanners();
    const where: any = {};
    if (onlyActive) {
      where.isActive = true;
    }
    const banners = await db.sponsorBanner.findMany({
      where,
      orderBy: { orderIndex: "asc" }
    });
    return { success: true, banners };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch sponsor banners" };
  }
}

export async function createSponsorBanner(data: {
  logoUrl?: string;
  imageUrl?: string;
  title: string;
  description: string;
  destinationLink?: string;
  isActive?: boolean;
}) {
  try {
    await requireAdmin();
    const lastItem = await db.sponsorBanner.findFirst({ orderBy: { orderIndex: "desc" } });
    const orderIndex = lastItem ? lastItem.orderIndex + 1 : 0;

    const newBanner = await db.sponsorBanner.create({
      data: {
        logoUrl: data.logoUrl || null,
        imageUrl: data.imageUrl || null,
        title: data.title,
        description: data.description,
        destinationLink: data.destinationLink || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        orderIndex
      }
    });
    revalidatePath("/");
    return { success: true, banner: newBanner };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create sponsor banner" };
  }
}

export async function updateSponsorBanner(id: string, data: {
  logoUrl?: string | null;
  imageUrl?: string | null;
  title?: string;
  description?: string;
  destinationLink?: string | null;
  isActive?: boolean;
}) {
  try {
    await requireAdmin();
    const updated = await db.sponsorBanner.update({
      where: { id },
      data
    });
    revalidatePath("/");
    return { success: true, banner: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update sponsor banner" };
  }
}

export async function deleteSponsorBanner(id: string) {
  try {
    await requireAdmin();
    await db.sponsorBanner.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete sponsor banner" };
  }
}

export async function reorderSponsorBanners(orderedIds: string[]) {
  try {
    await requireAdmin();
    const promises = orderedIds.map((id, index) => 
      db.sponsorBanner.update({
        where: { id },
        data: { orderIndex: index }
      })
    );
    await db.$transaction(promises);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reorder sponsor banners" };
  }
}

// ==========================================
// CELEBRITY TESTIMONIALS ACTIONS
// ==========================================
export async function getCelebrityTestimonials(onlyActive: boolean = false) {
  try {
    await ensureSeedTestimonials();
    const where: any = {};
    if (onlyActive) {
      where.isActive = true;
    }
    const testimonials = await db.celebrityTestimonial.findMany({
      where,
      orderBy: { orderIndex: "asc" }
    });
    return { success: true, testimonials };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch testimonials" };
  }
}

export async function createCelebrityTestimonial(data: {
  videoUrl: string;
  thumbnailUrl?: string;
  name: string;
  profession: string;
  duration?: string;
  quote: string;
  description?: string;
  isActive?: boolean;
}) {
  try {
    await requireAdmin();
    const lastItem = await db.celebrityTestimonial.findFirst({ orderBy: { orderIndex: "desc" } });
    const orderIndex = lastItem ? lastItem.orderIndex + 1 : 0;

    const newTestimonial = await db.celebrityTestimonial.create({
      data: {
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl || null,
        name: data.name,
        profession: data.profession,
        duration: data.duration || null,
        quote: data.quote,
        description: data.description || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        orderIndex
      }
    });
    revalidatePath("/");
    return { success: true, testimonial: newTestimonial };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create testimonial" };
  }
}

export async function updateCelebrityTestimonial(id: string, data: {
  videoUrl?: string;
  thumbnailUrl?: string | null;
  name?: string;
  profession?: string;
  duration?: string | null;
  quote?: string;
  description?: string | null;
  isActive?: boolean;
}) {
  try {
    await requireAdmin();
    const updated = await db.celebrityTestimonial.update({
      where: { id },
      data
    });
    revalidatePath("/");
    return { success: true, testimonial: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update testimonial" };
  }
}

export async function deleteCelebrityTestimonial(id: string) {
  try {
    await requireAdmin();
    await db.celebrityTestimonial.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete testimonial" };
  }
}

export async function reorderCelebrityTestimonials(orderedIds: string[]) {
  try {
    await requireAdmin();
    const promises = orderedIds.map((id, index) => 
      db.celebrityTestimonial.update({
        where: { id },
        data: { orderIndex: index }
      })
    );
    await db.$transaction(promises);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reorder testimonials" };
  }
}

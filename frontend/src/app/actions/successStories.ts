"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role, VerificationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Helper for admin auth
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privilege required.");
  }
  return session.user;
}

// Default Seed Stories
const SEED_STORIES = [
  {
    fullName: "Ananya Sharma",
    email: "ananya.sharma@example.com",
    mobileNumber: "9876543210",
    city: "Mumbai",
    state: "Maharashtra",
    age: 34,
    roleType: "Patient",
    storyTitle: "A Journey of Hope, Strength & Healing",
    completeStory: `Ananya Sharma's life changed forever when she felt a lump during a routine self-examination. At just 34 years old, the diagnosis of Stage II Breast Cancer felt overwhelming.

However, she decided to face the challenge head-on. She was referred to Dr. Jyoti Bajpai, under whose compassionate and professional care she completed her chemotherapy and surgical treatments.

Her journey is one of incredible resilience. Today, Ananya is completely cancer-free and dedicates her spare time to mentoring newly diagnosed patients and educating young women in local community groups about physical self-screening.`,
    videoUrl: "/Breast Cancer Survivor Story _ A Journey of Hope, Strength & Healing _ Dr. Jyoti Bajpai.mp4",
    imageUrls: ["/images/awareness_ribbon.png"],
    treatmentHospital: "Tata Memorial Hospital, Mumbai",
    consent: true,
    status: VerificationStatus.VERIFIED,
  },
  {
    fullName: "Meera Deshmukh",
    email: "meera.deshmukh@example.com",
    mobileNumber: "9876543211",
    city: "Pune",
    state: "Maharashtra",
    age: 42,
    roleType: "Patient",
    storyTitle: "From Diagnosis to Complete Recovery",
    completeStory: `Meera Deshmukh, a high school teacher and mother of two, was diagnosed with breast cancer during a regular health screening campaign. The news was sudden, but Meera's determination was unwavering.

She underwent surgery followed by targeted radiation therapy. Throughout her treatment, her family, colleagues, and the volunteer network stood by her as a pillar of strength.

Having achieved complete recovery, Meera believes that early screening is the single most critical factor in survival. She regularly hosts awareness talks at schools and community centers.`,
    videoUrl: "/vidssave.com From Diagnosis to Recovery _ Breast Cancer Patient Story 720P.mp4",
    imageUrls: ["/images/survivor_strength.png"],
    treatmentHospital: "KEM Hospital, Pune",
    consent: true,
    status: VerificationStatus.VERIFIED,
  }
];

// Helper to seed if database is empty
async function ensureSeedStories() {
  try {
    const count = await db.successStory.count();
    if (count === 0) {
      for (const story of SEED_STORIES) {
        await db.successStory.create({ data: story });
      }
    }
  } catch (error) {
    console.error("Failed to seed success stories:", error);
  }
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

    const newStory = await db.successStory.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        city: data.city,
        state: data.state,
        age: data.age,
        roleType: data.roleType,
        storyTitle: data.storyTitle,
        completeStory: data.completeStory,
        videoUrl: data.videoUrl,
        imageUrls: data.imageUrls,
        treatmentHospital: data.treatmentHospital,
        consent: data.consent,
        status: VerificationStatus.PENDING
      }
    });

    revalidatePath("/");
    return { success: true, storyId: newStory.id };
  } catch (error: any) {
    console.error("Error submitting story:", error);
    return { success: false, error: error.message || "Failed to submit story" };
  }
}

// 2. Fetch approved stories (Public homepage)
export async function getApprovedSuccessStories() {
  try {
    await ensureSeedStories();
    const stories = await db.successStory.findMany({
      where: { status: VerificationStatus.VERIFIED },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, stories };
  } catch (error: any) {
    console.error("Error fetching approved stories:", error);
    return { success: false, error: error.message || "Failed to fetch stories" };
  }
}

// 3. Fetch single story by ID (Public detail page)
export async function getSuccessStoryById(id: string) {
  try {
    const story = await db.successStory.findUnique({
      where: { id }
    });
    if (!story) {
      throw new Error("Story not found");
    }
    return { success: true, story };
  } catch (error: any) {
    console.error("Error fetching success story:", error);
    return { success: false, error: error.message || "Failed to fetch story" };
  }
}

// 4. Fetch all stories (Admin dashboard)
export async function getAdminSuccessStories() {
  try {
    await requireAdmin();
    await ensureSeedStories();
    const stories = await db.successStory.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { success: true, stories };
  } catch (error: any) {
    console.error("Error fetching admin stories:", error);
    return { success: false, error: error.message || "Unauthorized or fetch failed" };
  }
}

// 5. Update story status (Admin Approve / Reject / Pending)
export async function updateSuccessStoryStatus(id: string, status: VerificationStatus) {
  try {
    await requireAdmin();
    const updated = await db.successStory.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/");
    return { success: true, story: updated };
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
    const updated = await db.successStory.update({
      where: { id },
      data
    });
    revalidatePath("/");
    return { success: true, story: updated };
  } catch (error: any) {
    console.error("Error editing success story:", error);
    return { success: false, error: error.message || "Failed to edit story" };
  }
}

// 7. Delete story (Admin Delete)
export async function deleteSuccessStory(id: string) {
  try {
    await requireAdmin();
    await db.successStory.delete({
      where: { id }
    });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting success story:", error);
    return { success: false, error: error.message || "Failed to delete story" };
  }
}

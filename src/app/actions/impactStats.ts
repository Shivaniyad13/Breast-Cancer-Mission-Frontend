"use server";

import { db } from "@/lib/db";

export async function getImpactStats() {
  try {
    const [
      partnershipCount,
      corporateCount,
      orgMemberCount,
      doctorCount,
      hospitalCount,
      campaignCount,
      storyCount,
      webinarCount,
    ] = await Promise.all([
      db.partnershipRequest.count({
        where: { status: "APPROVED", isPublished: true },
      }),
      db.corporatePartner.count({
        where: { status: "VERIFIED" },
      }),
      db.organizationMember.count({
        where: { status: "VERIFIED" },
      }),
      db.doctor.count({
        where: { verificationStatus: "VERIFIED" },
      }),
      db.partnershipRequest.count({
        where: {
          status: "APPROVED",
          isPublished: true,
          organizationType: { contains: "hospital", mode: "insensitive" },
        },
      }),
      db.campaign.count({
        where: { status: { in: ["ACTIVE", "COMPLETED"] } },
      }),
      db.successStory.count({
        where: { status: "VERIFIED" },
      }),
      db.webinar.count({
        where: { status: "PUBLISHED" },
      }),
    ]);

    return {
      success: true,
      stats: {
        totalPartners: partnershipCount + corporateCount + orgMemberCount,
        doctors: doctorCount,
        hospitals: hospitalCount,
        campaigns: campaignCount,
        stories: storyCount,
        webinars: webinarCount,
        ngo: orgMemberCount + partnershipCount,
      },
    };
  } catch (error: any) {
    console.error("Error in getImpactStats:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch impact stats.",
      stats: {
        totalPartners: 0,
        doctors: 0,
        hospitals: 0,
        campaigns: 0,
        stories: 0,
        webinars: 0,
        ngo: 0,
      },
    };
  }
}

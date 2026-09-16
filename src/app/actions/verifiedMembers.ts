"use server";

import { db } from "@/lib/db";

export async function getVerifiedMembers() {
  try {
    const [individuals, orgs, corporates] = await Promise.all([
      db.individualMember.findMany({
        where: { status: "VERIFIED" },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      db.organizationMember.findMany({
        where: { status: "VERIFIED" },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      db.corporatePartner.findMany({
        where: { status: "VERIFIED" },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    const formattedIndividuals = individuals.map((ind) => ({
      id: ind.id,
      type: "individual" as const,
      displayName: ind.fullName,
      category: "Individual Member",
      city: ind.city || "",
      state: ind.state || "",
      description: ind.whyJoin || "",
      logoUrl: null,
      createdAt: ind.createdAt,
    }));

    const formattedOrgs = orgs.map((org) => ({
      id: org.id,
      type: "ngo" as const,
      displayName: org.organizationName,
      category: "NGO Partner",
      city: org.city || "",
      state: org.state || "",
      description: org.areasOfWork || org.expectedCollaboration || "",
      logoUrl: org.organizationLogoUrl || null,
      createdAt: org.createdAt,
    }));

    const formattedCorporates = corporates.map((corp) => ({
      id: corp.id,
      type: "corporate" as const,
      displayName: corp.companyName,
      category: "Corporate Partner",
      city: corp.city || "",
      state: corp.state || "",
      description: corp.collaborationInterest || "",
      logoUrl: corp.companyLogoUrl || null,
      createdAt: corp.createdAt,
    }));

    const members = [...formattedIndividuals, ...formattedOrgs, ...formattedCorporates].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return { success: true, members };
  } catch (error) {
    console.error("Error fetching verified members:", error);
    return { success: false, members: [] };
  }
}

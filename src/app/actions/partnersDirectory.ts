"use server";

import { db } from "@/lib/db";

export async function getPartnerDirectory() {
  try {
    const [partnershipRequests, corporatePartners, organizationMembers] =
      await Promise.all([
        db.partnershipRequest.findMany({
          where: { status: "APPROVED", isPublished: true },
          orderBy: { createdAt: "desc" },
        }),
        db.corporatePartner.findMany({
          where: { status: "VERIFIED" },
          orderBy: { createdAt: "desc" },
        }),
        db.organizationMember.findMany({
          where: { status: "VERIFIED" },
          orderBy: { createdAt: "desc" },
        }),
      ]);

    const all = [
      ...partnershipRequests.map((p) => ({
        id: p.id,
        name: p.organizationName,
        category: mapCategoryString(p.category),
        subcategory: p.category,
        desc: p.description || "",
        city: p.city || "",
        website: p.website || "",
        coverImage: p.logoUrl || "",
        source: "PARTNERSHIP",
      })),
      ...corporatePartners.map((p) => ({
        id: p.id,
        name: p.companyName,
        category: "corporate",
        subcategory: p.industry,
        desc: p.collaborationInterest || "",
        city: p.city || "",
        website: p.website || "",
        coverImage: p.companyLogoUrl || "",
        source: "CORPORATE",
      })),
      ...organizationMembers.map((p) => ({
        id: p.id,
        name: p.organizationName,
        category: mapNgoType(p.organizationType),
        subcategory: p.organizationType,
        desc: p.areasOfWork || "",
        city: p.city || "",
        website: p.website || "",
        coverImage: p.organizationLogoUrl || "",
        source: "ORG_MEMBER",
      })),
    ];

    return { success: true, all };
  } catch (error: any) {
    console.error("Error in getPartnerDirectory:", error);
    return { success: false, error: error.message || "Failed to fetch directory.", all: [] };
  }
}

function mapCategoryString(str: string): string {
  const lower = (str || "").toLowerCase();
  if (
    lower.includes("hospital") ||
    lower.includes("medical") ||
    lower.includes("diagnostic")
  )
    return "hospital";
  if (
    lower.includes("ngo") ||
    lower.includes("support") ||
    lower.includes("awareness") ||
    lower.includes("community")
  )
    return "ngo";
  if (
    lower.includes("research") ||
    lower.includes("academic") ||
    lower.includes("university")
  )
    return "research";
  if (
    lower.includes("corporate") ||
    lower.includes("csr") ||
    lower.includes("technology")
  )
    return "corporate";
  if (lower.includes("government") || lower.includes("public"))
    return "government";
  return "hospital";
}

function mapNgoType(str: string): string {
  const lower = (str || "").toLowerCase();
  if (lower.includes("hospital") || lower.includes("medical")) return "hospital";
  if (
    lower.includes("college") ||
    lower.includes("university") ||
    lower.includes("research") ||
    lower.includes("institute")
  )
    return "research";
  return "ngo";
}

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

// Mock email helper
async function simulateEmail(email: string, orgName: string, status: string, remarks?: string) {
  console.log("--------------------------------------------------");
  console.log(`[MOCK EMAIL SENT]`);
  console.log(`To: ${email}`);
  console.log(`Subject: Breast Cancer Mission - Partnership Application status updated`);
  console.log(`Body:`);
  console.log(`Dear ${orgName} representative,`);
  console.log(`Your partnership application with Breast Cancer Mission has been marked as: ${status}.`);
  if (remarks) {
    console.log(`Notes from Administration: ${remarks}`);
  }
  console.log(`Thank you for your dedication to early detection and cancer support campaigns.`);
  console.log("--------------------------------------------------");
}

// 1. Submit Partnership Request
export async function submitPartnershipRequest(data: {
  organizationName: string;
  organizationType: string;
  contactPersonName: string;
  designation?: string;
  email: string;
  phone: string;
  website?: string;
  city?: string;
  state?: string;
  country?: string;
  logoUrl?: string;
  documentUrl?: string;
  category: string;
  description?: string;
  reason?: string;
  termsAccepted: boolean;
}) {
  try {
    if (!data.organizationName || !data.contactPersonName || !data.email || !data.phone) {
      throw new Error("Required fields: Organization Name, Contact Person, Email, and Phone.");
    }
    if (!data.termsAccepted) {
      throw new Error("You must accept the terms and conditions to proceed.");
    }

    const request = await db.partnershipRequest.create({
      data: {
        organizationName: data.organizationName,
        organizationType: data.organizationType,
        contactPersonName: data.contactPersonName,
        designation: data.designation,
        email: data.email,
        phone: data.phone,
        website: data.website,
        city: data.city,
        state: data.state,
        country: data.country,
        logoUrl: data.logoUrl,
        documentUrl: data.documentUrl,
        category: data.category,
        description: data.description,
        reason: data.reason,
        termsAccepted: data.termsAccepted,
        status: "PENDING",
        isPublished: false
      }
    });

    revalidatePath("/campaigns/awareness");
    return { success: true, requestId: request.id };
  } catch (error: any) {
    console.error("Error submitting partnership request:", error);
    return { success: false, error: error.message || "Failed to submit request." };
  }
}

// 2. Fetch Partnership Requests (Admin Dashboard with search and filters)
export async function getPartnershipRequests(filters?: {
  search?: string;
  status?: string;
  category?: string;
}) {
  try {
    await requireAdmin();

    const whereClause: any = {};

    if (filters?.status && filters.status !== "ALL") {
      whereClause.status = filters.status;
    }
    if (filters?.category && filters.category !== "ALL") {
      whereClause.category = filters.category;
    }

    if (filters?.search) {
      const searchLower = filters.search.trim();
      whereClause.OR = [
        { organizationName: { contains: searchLower, mode: "insensitive" } },
        { contactPersonName: { contains: searchLower, mode: "insensitive" } },
        { email: { contains: searchLower, mode: "insensitive" } },
        { city: { contains: searchLower, mode: "insensitive" } }
      ];
    }

    const requests = await db.partnershipRequest.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" }
    });

    return { success: true, requests };
  } catch (error: any) {
    console.error("Error fetching partnership requests:", error);
    return { success: false, error: error.message || "Unauthorized or fetch failed." };
  }
}

// 3. Fetch Approved & Published Partnerships (Public Awareness Page Grid)
export async function getApprovedPartnerships() {
  try {
    const partnerships = await db.partnershipRequest.findMany({
      where: {
        status: "APPROVED",
        isPublished: true
      },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, partnerships };
  } catch (error: any) {
    console.error("Error fetching approved partnerships:", error);
    return { success: false, error: error.message || "Failed to fetch approved partners." };
  }
}

// 4. Update Application Status (Approve/Reject/Pending)
export async function updatePartnershipStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED",
  remarks?: string
) {
  try {
    await requireAdmin();

    const request = await db.partnershipRequest.findUnique({
      where: { id }
    });

    if (!request) {
      throw new Error("Application request not found.");
    }

    // Auto publish if approved (optionally publish automatically)
    const isPublishedVal = status === "APPROVED" ? true : request.isPublished;

    const updated = await db.partnershipRequest.update({
      where: { id },
      data: {
        status,
        isPublished: isPublishedVal
      }
    });

    await simulateEmail(updated.email, updated.organizationName, status, remarks);

    revalidatePath("/campaigns/awareness");
    revalidatePath("/admin/partnerships");
    return { success: true, request: updated };
  } catch (error: any) {
    console.error("Error updating partnership status:", error);
    return { success: false, error: error.message || "Failed to update status." };
  }
}

// 5. Toggle Publish State
export async function togglePartnershipPublishState(id: string, isPublished: boolean) {
  try {
    await requireAdmin();

    const updated = await db.partnershipRequest.update({
      where: { id },
      data: { isPublished }
    });

    revalidatePath("/campaigns/awareness");
    revalidatePath("/admin/partnerships");
    return { success: true, request: updated };
  } catch (error: any) {
    console.error("Error toggling publish state:", error);
    return { success: false, error: error.message || "Failed to change publish state." };
  }
}

// 6. Delete Application Request
export async function deletePartnershipRequest(id: string) {
  try {
    await requireAdmin();

    await db.partnershipRequest.delete({
      where: { id }
    });

    revalidatePath("/campaigns/awareness");
    revalidatePath("/admin/partnerships");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting partnership request:", error);
    return { success: false, error: error.message || "Failed to delete request." };
  }
}

"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { sendAdminRegistrationAlert, sendPartnershipStatusEmail } from "@/lib/email";

// Admin check helper
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privileges required.");
  }
  return session.user;
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

    try {
      await sendAdminRegistrationAlert({
        type: "Awareness Partnership Request",
        applicantName: data.contactPersonName,
        applicantEmail: data.email,
        role: `Partnership (${data.organizationName})`,
        details: `Category: ${data.category} | City: ${data.city || "N/A"}`
      });
    } catch (e) {
      console.error("[SMTP] Failed to send admin alert for partnership request:", e);
    }

    try {
      revalidatePath("/campaigns/awareness");
      revalidatePath("/admin/partnerships");
      revalidatePath("/care/partner-organizations");
    } catch (e) {
      // Ignore revalidatePath errors outside Next.js request context
    }
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

    const oldStatus = request.status;

    // Auto publish if approved (optionally publish automatically)
    const isPublishedVal = status === "APPROVED" ? true : request.isPublished;

    const updated = await db.partnershipRequest.update({
      where: { id },
      data: {
        status,
        isPublished: isPublishedVal
      }
    });

    // Send SMTP status update strictly if status transitioned
    if (oldStatus !== status && updated.email) {
      try {
        await sendPartnershipStatusEmail({
          to: updated.email,
          contactPersonName: updated.contactPersonName,
          organizationName: updated.organizationName,
          status,
          remarks,
        });
      } catch (e) {
        console.error("[SMTP] Failed to send partnership status email:", e);
      }
    }

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

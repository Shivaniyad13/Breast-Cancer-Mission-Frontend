"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role, VerificationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { 
  sendUserRegistrationEmail, 
  sendAdminRegistrationAlert, 
  sendIndividualMemberStatusEmail 
} from "@/lib/email";

// Admin check helper
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privileges required.");
  }
  return session.user;
}

// 1. Submit Individual Member Application (Public)
export async function applyIndividualMemberAction(data: {
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  category: string;
  whyJoin: string;
}) {
  try {
    if (
      !data.fullName?.trim() ||
      !data.email?.trim() ||
      !data.mobile?.trim() ||
      !data.city?.trim() ||
      !data.state?.trim() ||
      !data.category?.trim() ||
      !data.whyJoin?.trim()
    ) {
      throw new Error("All fields (Full Name, Email, Mobile, City, State, Category, and Reason to Join) are required.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      throw new Error("Please enter a valid email address.");
    }

    const member = await db.individualMember.create({
      data: {
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        mobile: data.mobile.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        category: data.category.trim(),
        whyJoin: data.whyJoin.trim(),
        status: VerificationStatus.PENDING,
      },
    });

    // Trigger SMTP email notifications safely
    try {
      await sendUserRegistrationEmail({
        to: data.email.trim(),
        userName: data.fullName.trim(),
        role: `Individual Member (${data.category.trim()})`,
        verificationStatus: "PENDING",
      });

      await sendAdminRegistrationAlert({
        type: "Individual Membership Application",
        applicantName: data.fullName.trim(),
        applicantEmail: data.email.trim(),
        role: `Individual Member (${data.category.trim()})`,
        details: `City: ${data.city.trim()}, ${data.state.trim()} | Category: ${data.category.trim()}`
      });
    } catch (emailErr) {
      console.error("Non-fatal individual member email error:", emailErr);
    }

    try {
      revalidatePath("/campaigns/membership");
      revalidatePath("/admin/individual-members");
    } catch (e) {
      // Ignore revalidate errors outside Next.js request context
    }

    return { success: true, id: member.id };
  } catch (error: any) {
    console.error("Error submitting individual member application:", error);
    return { success: false, error: error.message || "Failed to submit application." };
  }
}

// 2. Fetch Approved Individual Members (Public)
export async function getApprovedIndividualMembers() {
  try {
    const members = await db.individualMember.findMany({
      where: {
        status: VerificationStatus.VERIFIED,
      },
      select: {
        id: true,
        fullName: true,
        city: true,
        state: true,
        category: true,
        whyJoin: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, members };
  } catch (error: any) {
    console.error("Error fetching approved individual members:", error);
    return { success: false, error: error.message || "Failed to fetch approved members." };
  }
}

// 3. Fetch All Individual Members (Admin only, with filters & search)
export async function getIndividualMembersAdmin(filters?: {
  status?: string;
  search?: string;
}) {
  try {
    await requireAdmin();

    const whereClause: any = {};

    if (filters?.status && filters.status !== "ALL") {
      whereClause.status = filters.status as VerificationStatus;
    }

    if (filters?.search) {
      const searchLower = filters.search.trim();
      whereClause.OR = [
        { fullName: { contains: searchLower, mode: "insensitive" } },
        { email: { contains: searchLower, mode: "insensitive" } },
        { mobile: { contains: searchLower, mode: "insensitive" } },
        { city: { contains: searchLower, mode: "insensitive" } },
        { state: { contains: searchLower, mode: "insensitive" } },
        { whyJoin: { contains: searchLower, mode: "insensitive" } },
      ];
    }

    const members = await db.individualMember.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return { success: true, members };
  } catch (error: any) {
    console.error("Error fetching individual members for admin:", error);
    return { success: false, error: error.message || "Unauthorized or fetch failed." };
  }
}

// 4. Update Individual Member Application Status (Admin only)
export async function updateIndividualMemberStatus(
  id: string,
  status: VerificationStatus | "PENDING" | "VERIFIED" | "REJECTED",
  remarks?: string
) {
  try {
    await requireAdmin();

    const existing = await db.individualMember.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Individual member record not found.");
    }

    const statusChanged = existing.status !== status;

    const updated = await db.individualMember.update({
      where: { id },
      data: {
        status: status as VerificationStatus,
        remarks: remarks !== undefined ? remarks : existing.remarks,
      },
    });

    // Send SMTP status email strictly when status changes
    if (statusChanged && (status === "VERIFIED" || status === "REJECTED")) {
      try {
        await sendIndividualMemberStatusEmail({
          to: existing.email,
          memberName: existing.fullName,
          status: status as "VERIFIED" | "REJECTED",
          remarks: remarks !== undefined ? remarks : (existing.remarks || undefined),
        });
      } catch (emailErr) {
        console.error("Non-fatal individual member status email error:", emailErr);
      }
    }

    try {
      revalidatePath("/campaigns/membership");
      revalidatePath("/admin/individual-members");
    } catch (e) {
      // Ignore
    }

    return { success: true, member: updated };
  } catch (error: any) {
    console.error("Error updating individual member status:", error);
    return { success: false, error: error.message || "Failed to update status." };
  }
}

// 5. Delete Individual Member Record (Admin only)
export async function deleteIndividualMember(id: string) {
  try {
    await requireAdmin();

    await db.individualMember.delete({
      where: { id },
    });

    try {
      revalidatePath("/campaigns/membership");
      revalidatePath("/admin/individual-members");
    } catch (e) {
      // Ignore
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting individual member record:", error);
    return { success: false, error: error.message || "Failed to delete record." };
  }
}


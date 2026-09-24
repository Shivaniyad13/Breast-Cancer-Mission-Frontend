"use server";

import { auth } from "@/auth";
import { apiClient } from "@/lib/apiClient";
import { Role, VerificationStatus } from "@/types/enums";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privileges required.");
  }
  return session.user;
}

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

    const response = await apiClient("/memberships/individual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      throw new Error(resData.message || "Failed to submit application.");
    }

    const member = resData.data;

    try {
      revalidatePath("/campaigns/membership");
      revalidatePath("/admin/individual-members");
    } catch (e) {
      // Ignore
    }

    return { success: true, id: member.id };
  } catch (error: any) {
    console.error("Error submitting individual member application:", error);
    return { success: false, error: error.message || "Failed to submit application." };
  }
}

export async function getApprovedIndividualMembers() {
  try {
    const response = await apiClient("/memberships/individual/approved");
    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to fetch approved members." };
    }

    return { success: true, members: resData.data };
  } catch (error: any) {
    console.error("Error fetching approved individual members:", error);
    return { success: false, error: error.message || "Failed to fetch approved members." };
  }
}

export async function getIndividualMembersAdmin(filters?: {
  status?: string;
  search?: string;
}) {
  try {
    await requireAdmin();

    const queryParams = new URLSearchParams();
    if (filters?.search) queryParams.set("search", filters.search);
    if (filters?.status) queryParams.set("status", filters.status);

    const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await apiClient(`/memberships/individual/admin/all${queryStr}`);
    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Unauthorized or fetch failed." };
    }

    return { success: true, members: resData.data };
  } catch (error: any) {
    console.error("Error fetching individual members for admin:", error);
    return { success: false, error: error.message || "Unauthorized or fetch failed." };
  }
}

export async function updateIndividualMemberStatus(
  id: string,
  status: VerificationStatus | "PENDING" | "VERIFIED" | "REJECTED",
  remarks?: string
) {
  try {
    await requireAdmin();

    const response = await apiClient(`/memberships/individual/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, remarks }),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      throw new Error(resData.message || "Failed to update status.");
    }

    const updated = resData.data;

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

export async function deleteIndividualMember(id: string) {
  try {
    await requireAdmin();

    const response = await apiClient(`/memberships/individual/${id}`, {
      method: "DELETE",
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      throw new Error(resData.message || "Failed to delete record.");
    }

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

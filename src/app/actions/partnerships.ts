"use server";

import { auth } from "@/auth";
import { apiClient } from "@/lib/apiClient";
import { Role } from "@/types/enums";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privileges required.");
  }
  return session.user;
}

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

    const response = await apiClient("/partnerships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      throw new Error(resData.message || "Failed to submit request.");
    }

    const request = resData.data;

    try {
      revalidatePath("/campaigns/awareness");
      revalidatePath("/admin/partnerships");
      revalidatePath("/care/partner-organizations");
    } catch (e) {
      // Ignore
    }
    return { success: true, requestId: request.id };
  } catch (error: any) {
    console.error("Error submitting partnership request:", error);
    return { success: false, error: error.message || "Failed to submit request." };
  }
}

export async function getPartnershipRequests(filters?: {
  search?: string;
  status?: string;
  category?: string;
}) {
  try {
    await requireAdmin();

    const queryParams = new URLSearchParams();
    if (filters?.search) queryParams.set("search", filters.search);
    if (filters?.status) queryParams.set("status", filters.status);
    if (filters?.category) queryParams.set("category", filters.category);

    const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await apiClient(`/partnerships/admin/all${queryStr}`);
    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Unauthorized or fetch failed." };
    }

    return { success: true, requests: resData.data };
  } catch (error: any) {
    console.error("Error fetching partnership requests:", error);
    return { success: false, error: error.message || "Unauthorized or fetch failed." };
  }
}

export async function getApprovedPartnerships() {
  try {
    const response = await apiClient("/partnerships");
    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to fetch approved partners." };
    }

    return { success: true, partnerships: resData.data };
  } catch (error: any) {
    console.error("Error fetching approved partnerships:", error);
    return { success: false, error: error.message || "Failed to fetch approved partners." };
  }
}

export async function updatePartnershipStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED",
  remarks?: string
) {
  try {
    await requireAdmin();

    const response = await apiClient(`/partnerships/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, remarks }),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      throw new Error(resData.message || "Failed to update status.");
    }

    const updated = resData.data;

    revalidatePath("/campaigns/awareness");
    revalidatePath("/admin/partnerships");
    return { success: true, request: updated };
  } catch (error: any) {
    console.error("Error updating partnership status:", error);
    return { success: false, error: error.message || "Failed to update status." };
  }
}

export async function togglePartnershipPublishState(id: string, isPublished: boolean) {
  try {
    await requireAdmin();

    const response = await apiClient(`/partnerships/${id}/publish`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished }),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      throw new Error(resData.message || "Failed to change publish state.");
    }

    revalidatePath("/campaigns/awareness");
    revalidatePath("/admin/partnerships");
    return { success: true, request: resData.data };
  } catch (error: any) {
    console.error("Error toggling publish state:", error);
    return { success: false, error: error.message || "Failed to change publish state." };
  }
}

export async function deletePartnershipRequest(id: string) {
  try {
    await requireAdmin();

    const response = await apiClient(`/partnerships/${id}`, {
      method: "DELETE",
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      throw new Error(resData.message || "Failed to delete request.");
    }

    revalidatePath("/campaigns/awareness");
    revalidatePath("/admin/partnerships");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting partnership request:", error);
    return { success: false, error: error.message || "Failed to delete request." };
  }
}

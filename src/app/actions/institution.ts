"use server";

import { auth } from "@/auth";
import { apiClient } from "@/lib/apiClient";
import { Role } from "@/types/enums";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privilege required.");
  }
  return session.user;
}

export async function applyOrganizationMemberAction(data: any) {
  try {
    const response = await apiClient("/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { error: resData.message || "An unexpected error occurred." };
    }

    const application = resData.data;

    return { success: true, applicationId: application.id };
  } catch (error: any) {
    console.error("applyOrganizationMemberAction error:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function applyCorporatePartnerAction(data: any) {
  try {
    const response = await apiClient("/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { error: resData.message || "An unexpected error occurred." };
    }

    const application = resData.data;

    return { success: true, applicationId: application.id };
  } catch (error: any) {
    console.error("applyCorporatePartnerAction error:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function getOrganizationApplicationsAction() {
  await requireAdmin();
  const response = await apiClient("/organizations");
  const resData = await response.json();
  if (!response.ok || !resData.success) {
    throw new Error(resData.message || "Failed to fetch organization applications.");
  }
  return resData.data;
}

export async function getCorporateApplicationsAction() {
  await requireAdmin();
  const response = await apiClient("/partners");
  const resData = await response.json();
  if (!response.ok || !resData.success) {
    throw new Error(resData.message || "Failed to fetch corporate applications.");
  }
  return resData.data;
}

export async function updateOrganizationApplicationStatusAction(
  id: string,
  status: "VERIFIED" | "REJECTED",
  remarks: string
) {
  await requireAdmin();

  try {
    const response = await apiClient(`/organizations/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, remarks }),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { error: resData.message || "Failed to update application status." };
    }

    const app = resData.data;

    revalidatePath("/admin/memberships");
    return { success: true };
  } catch (error: any) {
    console.error("updateOrganizationApplicationStatusAction error:", error);
    return { error: error.message || "Failed to update application status." };
  }
}

export async function updateCorporateApplicationStatusAction(
  id: string,
  status: "VERIFIED" | "REJECTED",
  remarks: string
) {
  await requireAdmin();

  try {
    const response = await apiClient(`/partners/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, remarks }),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { error: resData.message || "Failed to update application status." };
    }

    const app = resData.data;

    revalidatePath("/admin/memberships");
    return { success: true };
  } catch (error: any) {
    console.error("updateCorporateApplicationStatusAction error:", error);
    return { error: error.message || "Failed to update application status." };
  }
}

"use server";

import { auth } from "@/auth";
import { Role } from "@/types/enums";
import { apiClient } from "@/lib/apiClient";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== Role.ADMIN) {
    throw new Error("Only administrators can review registration documents.");
  }
}

export async function getRegistrationVerificationsAction() {
  await requireAdmin();
  const response = await apiClient("/admin/registrations", { cache: "no-store" });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load registration verifications.");
  }
  return result.data;
}

export async function reviewRegistrationVerificationAction(
  userId: string,
  status: "VERIFIED" | "REJECTED",
  rejectionReason?: string
) {
  await requireAdmin();
  const response = await apiClient(`/admin/registrations/${encodeURIComponent(userId)}/verification`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, rejectionReason }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) {
    return { error: result.message || "Unable to update verification status." };
  }
  revalidatePath("/admin/registrations");
  revalidatePath("/admin/doctors");
  return { success: true };
}

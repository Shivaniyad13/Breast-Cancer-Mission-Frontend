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

export async function getOrCreateDoctorRecord(userId: string) {
  const response = await apiClient("/doctors/get-or-create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  const resData = await response.json();
  if (!response.ok || !resData.success) {
    throw new Error(resData.message || "Failed to get or create doctor record.");
  }
  return resData.data;
}

export async function getDoctorDashboardData() {
  const session = await auth();

  if (!session?.user || (session.user.role !== Role.DOCTOR && session.user.role !== Role.ADMIN)) {
    throw new Error("Unauthorized: Only doctors can view doctor dashboard.");
  }

  const response = await apiClient(`/doctors/dashboard?userId=${session.user.id}`);
  const resData = await response.json();

  if (!response.ok || !resData.success) {
    throw new Error(resData.message || "Failed to fetch doctor dashboard data.");
  }

  return resData.data;
}

export async function getDoctorPublicProfile(idOrDoctorId: string) {
  const response = await apiClient(`/doctors/profile/${idOrDoctorId}`);
  const resData = await response.json();

  if (!response.ok || !resData.success) {
    return null;
  }

  return resData.data;
}

export async function getAdminDoctorVerificationRequests() {
  await requireAdmin();

  const response = await apiClient("/doctors/admin/verifications");
  const resData = await response.json();

  if (!response.ok || !resData.success) {
    throw new Error(resData.message || "Failed to fetch doctor verifications.");
  }

  return resData.data;
}

export async function approveDoctorVerificationAction(doctorId: string) {
  await requireAdmin();

  const response = await apiClient(`/doctors/admin/verify/${doctorId}/approve`, {
    method: "POST",
  });

  const resData = await response.json();

  if (!response.ok || !resData.success) {
    return { error: resData.message || "Failed to approve doctor verification." };
  }

  revalidatePath("/admin/doctors");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function rejectDoctorVerificationAction(doctorId: string, rejectionReason: string) {
  await requireAdmin();

  if (!rejectionReason || !rejectionReason.trim()) {
    return { error: "A reason for rejection is required." };
  }

  const response = await apiClient(`/doctors/admin/verify/${doctorId}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rejectionReason: rejectionReason.trim() }),
  });

  const resData = await response.json();

  if (!response.ok || !resData.success) {
    return { error: resData.message || "Failed to reject doctor verification." };
  }

  revalidatePath("/admin/doctors");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function resubmitDoctorVerificationAction(data: {
  medicalLicenseNumber: string;
  hospitalAffiliation: string;
  specialty: string;
  verificationDocument?: string;
}) {
  const session = await auth();
  if (!session?.user || (session.user.role !== Role.DOCTOR && session.user.role !== Role.ADMIN)) {
    return { error: "Unauthorized: Only doctor accounts can submit verification details." };
  }

  const licenseTrimmed = data.medicalLicenseNumber?.trim();
  const affiliationTrimmed = data.hospitalAffiliation?.trim();
  const specialtyTrimmed = data.specialty?.trim();

  if (!licenseTrimmed || licenseTrimmed.length < 3) {
    return { error: "Please enter a valid Medical License / Registration Number (minimum 3 characters)." };
  }
  if (!affiliationTrimmed) {
    return { error: "Hospital / Clinic Affiliation is required." };
  }
  if (!specialtyTrimmed) {
    return { error: "Medical Specialty is required." };
  }

  const response = await apiClient("/doctors/verify/resubmit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: session.user.id,
      medicalLicenseNumber: licenseTrimmed,
      hospitalAffiliation: affiliationTrimmed,
      specialty: specialtyTrimmed,
      verificationDocument: data.verificationDocument?.trim() || undefined,
    }),
  });

  const resData = await response.json();

  if (!response.ok || !resData.success) {
    return { error: resData.message || "Failed to resubmit verification details." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin/doctors");
  return { success: true };
}

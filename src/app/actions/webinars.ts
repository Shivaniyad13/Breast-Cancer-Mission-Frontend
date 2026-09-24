"use server";

import { apiClient } from "@/lib/apiClient";
import { auth } from "@/auth";
import { Role } from "@/types/enums";
import { revalidatePath } from "next/cache";
import { calculateWebinarDurationMinutes, calculateMinimumAllowedPrice } from "@/lib/webinarPricing";

// Helper for admin auth
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privilege required.");
  }
  return session.user;
}

// Helper for general user auth
async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: Please log in to proceed.");
  }
  return session.user;
}

// Get webinars with filters
export async function getWebinars(filters: {
  search?: string;
  city?: string;
  category?: string;
  date?: string;
  mode?: "upcoming" | "past";
}) {
  try {
    const query = new URLSearchParams();
    if (filters.category && filters.category !== "all") query.set("category", filters.category);
    if (filters?.mode) query.set("status", filters.mode === "past" ? "COMPLETED" : "PUBLISHED");
    const endpoint = `/webinars${query.toString() ? `?${query.toString()}` : ""}`;
    const res = await apiClient(endpoint, { cache: "no-store" });
    const data = await res.json();
    if (res.ok && data.data) {
      return data.data;
    }
  } catch (err) {
    console.error("Error fetching webinars from Express API:", err);
  }
  return [];
}

// Get unique categories and cities for filters
export async function getWebinarFilterMetadata() {
  const res = await apiClient("/webinars/filters/metadata", { cache: "no-store" });
  if (!res.ok) return { cities: [], categories: [] };
  const resData = await res.json();
  return resData.data || { cities: [], categories: [] };
}

// Get single webinar by ID
export async function getWebinarById(id: string) {
  const res = await apiClient(`/webinars/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const resData = await res.json();
  return resData.data || null;
}

// Create Webinar (Admin)
export async function createWebinarAction(data: any) {
  await requireAdmin();

  const res = await apiClient("/webinars", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    throw new Error(resData.message || "Failed to create webinar.");
  }

  revalidatePath("/webinars");
  revalidatePath("/admin/webinars");
  return { success: true, webinarId: resData.data.id };
}

// Edit Webinar (Admin)
export async function editWebinarAction(id: string, data: any) {
  await requireAdmin();

  const res = await apiClient(`/webinars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    throw new Error(resData.message || "Failed to edit webinar.");
  }

  const { updated: updatedWebinar, existingWebinar: existing } = resData.data || {};

  if (existing && existing.registrations && existing.registrations.length > 0) {
    const newDate = new Date(data.date || existing.date);
    const newStartTime = new Date(data.startTime || existing.startTime);
    const newEndTime = new Date(data.endTime || existing.endTime);

    const isScheduleChanged =
      new Date(existing.date).getTime() !== newDate.getTime() ||
      new Date(existing.startTime).getTime() !== newStartTime.getTime() ||
      existing.meetingLink !== (data.meetingLink || "");
    const isCancelled = data.status === "CANCELLED" && existing.status !== "CANCELLED";

    if (isScheduleChanged || isCancelled) {
      const formattedDate = newDate.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
      const formattedTime = `${newStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${newEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const summary = isCancelled
        ? "This webinar session has been CANCELLED by the host."
        : "The date, time schedule, or meeting link for this webinar has been updated.";

    }
  }

  revalidatePath("/webinars");
  revalidatePath(`/webinars/${id}`);
  revalidatePath("/admin/webinars");
  return { success: true };
}

// Delete Webinar (Admin)
export async function deleteWebinarAction(id: string) {
  await requireAdmin();

  const res = await apiClient(`/webinars/${id}`, {
    method: "DELETE",
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    throw new Error(resData.message || "Failed to delete webinar.");
  }

  revalidatePath("/webinars");
  revalidatePath("/admin/webinars");
  return { success: true };
}

/**
 * Creates a webinar automatically linked to the logged-in doctor.
 */
export async function createDoctorWebinarAction(data: any) {
  const session = await auth();

  if (!session?.user || (session.user.role !== Role.DOCTOR && session.user.role !== Role.ADMIN)) {
    throw new Error("Unauthorized: Doctor privilege required.");
  }

  const startTimeDate = new Date(data.startTime);
  const endTimeDate = new Date(data.endTime);

  if (isNaN(startTimeDate.getTime()) || isNaN(endTimeDate.getTime()) || endTimeDate <= startTimeDate) {
    return { error: "Invalid schedule: End time must be later than start time." };
  }

  const durationMinutes = calculateWebinarDurationMinutes(startTimeDate, endTimeDate);
  const isPaid = data.webinarType === "PAID";
  const minimumAllowedPrice = isPaid ? calculateMinimumAllowedPrice(durationMinutes) : 0;
  const registrationPrice = isPaid ? parseFloat(data.registrationPrice) || 0 : 0;

  if (isPaid && registrationPrice < minimumAllowedPrice) {
    return {
      error: `Registration price (₹${registrationPrice}) cannot be lower than the platform minimum of ₹${minimumAllowedPrice} for a ${durationMinutes}-minute webinar.`,
    };
  }

  const res = await apiClient("/webinars", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      registrationPrice,
      minimumAllowedPrice,
      durationMinutes,
      webinarType: isPaid ? "PAID" : "FREE",
      approvalStatus: isPaid ? "PENDING_APPROVAL" : "APPROVED",
      status: data.status || "PUBLISHED",
    }),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    return { error: resData.message || "Failed to create doctor webinar." };
  }

  const webinar = resData.data;

  revalidatePath("/webinars");
  revalidatePath("/dashboard");
  return { success: true, webinarId: webinar?.id };
}

/**
 * Updates a doctor's webinar via Express backend.
 */
export async function updateDoctorWebinarAction(id: string, data: any) {
  const session = await auth();

  if (!session?.user || (session.user.role !== Role.DOCTOR && session.user.role !== Role.ADMIN)) {
    throw new Error("Unauthorized: Doctor privilege required.");
  }

  const res = await apiClient(`/webinars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    return { error: resData.message || "Failed to update webinar." };
  }

  revalidatePath("/webinars");
  revalidatePath(`/webinars/${id}`);
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Deletes a doctor's webinar via Express backend.
 */
export async function deleteDoctorWebinarAction(id: string) {
  const session = await auth();

  if (!session?.user || (session.user.role !== Role.DOCTOR && session.user.role !== Role.ADMIN)) {
    throw new Error("Unauthorized: Doctor privilege required.");
  }

  const res = await apiClient(`/webinars/${id}`, {
    method: "DELETE",
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    return { error: resData.message || "Failed to delete webinar." };
  }

  revalidatePath("/webinars");
  revalidatePath("/dashboard");
  return { success: true };
}

// Update Webinar Status (Admin)
export async function updateWebinarStatusAction(id: string, status: string) {
  await requireAdmin();

  const res = await apiClient(`/webinars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    throw new Error(resData.message || "Failed to update webinar status.");
  }

  revalidatePath("/webinars");
  revalidatePath(`/webinars/${id}`);
  revalidatePath("/admin/webinars");
  return { success: true };
}

// Upload Recording (Admin)
export async function uploadRecordingAction(id: string, recordingUrl: string) {
  await requireAdmin();

  const res = await apiClient(`/webinars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recordingUrl }),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    throw new Error(resData.message || "Failed to upload recording.");
  }

  revalidatePath(`/webinars/${id}`);
  revalidatePath("/admin/webinars");
  return { success: true };
}

// Upload Materials (Admin)
export async function uploadMaterialsAction(id: string, materialsUrl: string) {
  await requireAdmin();

  const res = await apiClient(`/webinars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ materialsUrl }),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    throw new Error(resData.message || "Failed to upload materials.");
  }

  revalidatePath(`/webinars/${id}`);
  revalidatePath("/admin/webinars");
  return { success: true };
}

// Register for Webinar
export async function registerForWebinarAction(
  webinarId: string,
  formData?: {
    name: string;
    email: string;
    phone: string;
    gender: string;
    age: number;
    city: string;
    state: string;
    occupation: string;
    emergencyContact: string;
    reason: string;
  }
) {
  const user = await requireUser();

  const res = await apiClient("/webinars/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user.id,
      webinarId,
      ...formData,
    }),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    throw new Error(resData.message || "Failed to register for webinar.");
  }

  const { isAlreadyRegistered, registration: reg, webinar } = resData.data || {};

  if (isAlreadyRegistered) {
    return { success: true, message: "Already registered for this webinar." };
  }

  revalidatePath(`/webinars/${webinarId}`);
  revalidatePath("/dashboard");
  return { success: true, message: "Successfully registered! A confirmation email has been sent." };
}

// Get or Create Webinar by Title
export async function getOrCreateWebinarByTitleAction(title: string) {
  await requireUser();

  const res = await apiClient("/webinars/get-or-create-title", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    throw new Error(resData.message || "Failed to retrieve or create webinar.");
  }

  const webinar = resData.data;
  return { success: true, webinarId: webinar.id, webinarTitle: webinar.title };
}

// Send Reminder (Admin)
export async function sendReminderAction(webinarId: string) {
  await requireAdmin();

  const res = await apiClient(`/webinars/${webinarId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Webinar not found.");
  const resData = await res.json();
  const webinar = resData.data;

  const count = webinar.registrations?.length || 0;
  return { success: true, count, message: `Successfully sent reminders to ${count} registered participants.` };
}

// User Joins Meeting Room - Attendance Start
export async function joinWebinarAction(webinarId: string) {
  const user = await requireUser();

  const res = await apiClient("/webinars/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.id, webinarId }),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    throw new Error(resData.message || "Failed to log attendance join.");
  }

  return { success: true, attendanceId: resData.data.id };
}

// User Leaves Meeting Room
export async function leaveWebinarAction(webinarId: string, durationSeconds: number) {
  const user = await requireUser();

  const res = await apiClient("/webinars/leave", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.id, webinarId, durationSeconds }),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    throw new Error(resData.message || "Failed to update attendance leave.");
  }

  const { attendance, certificateGenerated, certificateId } = resData.data;

  revalidatePath("/dashboard");
  return {
    success: true,
    attendance,
    certificateGenerated,
    certificateId,
  };
}

// Submit feedback (User)
export async function submitFeedbackAction(webinarId: string, feedback: string, rating: number) {
  const user = await requireUser();

  const res = await apiClient("/webinars/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.id, webinarId, feedback, rating }),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    throw new Error(resData.message || "Failed to submit feedback.");
  }

  revalidatePath(`/webinars/${webinarId}`);
  revalidatePath("/dashboard");
  return { success: true, message: "Thank you for your feedback!" };
}

// Manual Attendance Adjustments (Admin)
export async function adjustAttendanceAction(userId: string, webinarId: string, durationMinutes: number) {
  await requireAdmin();

  const res = await apiClient("/webinars/adjust-attendance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, webinarId, durationMinutes }),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    throw new Error(resData.message || "Failed to adjust attendance.");
  }

  revalidatePath("/admin/webinars");
  return { success: true, attendance: resData.data };
}

/**
 * Approves a pending paid webinar via Express backend.
 */
export async function approveWebinarAction(id: string) {
  await requireAdmin();

  const res = await apiClient(`/webinars/${id}/approve`, {
    method: "POST",
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    return { error: resData.message || "Failed to approve webinar." };
  }

  const result = resData.data;

  revalidatePath("/admin/webinars");
  revalidatePath("/webinars");
  revalidatePath(`/webinars/${id}`);
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Rejects a pending paid webinar via Express backend.
 */
export async function rejectWebinarAction(id: string, rejectionReason: string) {
  await requireAdmin();

  if (!rejectionReason || !rejectionReason.trim()) {
    return { error: "A reason for rejection is required." };
  }

  const res = await apiClient(`/webinars/${id}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rejectionReason }),
  });

  const resData = await res.json();
  if (!res.ok || !resData.success) {
    return { error: resData.message || "Failed to reject webinar." };
  }

  const result = resData.data;

  revalidatePath("/admin/webinars");
  revalidatePath("/webinars");
  revalidatePath(`/webinars/${id}`);
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Fetches all pending approval webinars for admin review via Express backend.
 */
export async function getPendingWebinarsForAdmin() {
  await requireAdmin();

  const res = await apiClient("/webinars/admin/pending", { cache: "no-store" });
  if (!res.ok) return [];
  const resData = await res.json();
  return resData.data || [];
}

/**
 * Certificate generation action for admin dashboard
 */
export async function generateCertificateForUser(
  recipientIdOrData: any,
  webinarIdParam?: string,
  eventNameParam?: string
) {
  await requireAdmin();

  let payload: any;
  if (typeof recipientIdOrData === "object" && recipientIdOrData !== null) {
    payload = recipientIdOrData;
  } else {
    payload = {
      recipientId: recipientIdOrData,
      webinarId: webinarIdParam,
      eventName: eventNameParam || "Webinar Participation & Excellence",
      certificateType: "ATTENDANCE",
    };
  }

  const res = await apiClient("/certificates/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return { success: false, error: errorData.message || "Failed to generate certificate." };
  }

  const body = await res.json();
  const cert = body.data;
  return {
    success: true,
    certificate: cert,
    certificateNumber: cert?.certificateIdString || cert?.id,
  };
}

export const generateCertificateAction = generateCertificateForUser;

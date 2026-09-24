"use server";

import { auth } from "@/auth";
import { Role } from "@/types/enums";
import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/apiClient";

// Helper for admin auth validation
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privilege required.");
  }
  return session.user;
}

// 1. Get technologies
export async function getDiagnosisTechnologies(activeOnly = true) {
  try {
    const res = await apiClient(`/diagnosis?activeOnly=${activeOnly}`, { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || "Failed to retrieve technologies" };
    }
    const resData = await res.json();
    return { success: true, technologies: resData.data || [] };
  } catch (error: any) {
    console.error("Error in getDiagnosisTechnologies:", error);
    return { success: false, error: error.message || "Failed to retrieve technologies" };
  }
}

// 2. Get single technology
export async function getDiagnosisTechnology(id: string) {
  try {
    const res = await apiClient(`/diagnosis/${id}`, { cache: "no-store" });
    if (!res.ok) {
      return { success: false, error: "Technology not found." };
    }
    const resData = await res.json();
    return { success: true, technology: resData.data };
  } catch (error: any) {
    console.error("Error in getDiagnosisTechnology:", error);
    return { success: false, error: error.message || "Failed to retrieve technology" };
  }
}

// 3. Create technology (Admin)
export async function createDiagnosisTechnology(data: {
  name: string;
  category: string;
  shortOverview: string;
  accuracy?: string | null;
  purpose: string;
  advantages: string;
  limitations: string;
  recommendedGroup: string;
  imageUrl?: string | null;
  introVideoUrl?: string | null;
  animationVideoUrl?: string | null;
  explainerVideoUrl?: string | null;
  workflow?: string | null;
  stepByStep?: string | null;
  preparation?: string | null;
  duration?: string | null;
  benefits?: string | null;
  risks?: string | null;
  whoShouldTake?: string | null;
  faqs?: Array<{ q: string; a: string }> | null;
  relatedArticles?: Array<{ title: string; link: string }> | null;
  brochureUrl?: string | null;
  manufacturerName: string;
  manufacturerLogoUrl?: string | null;
  manufacturerOverview?: string | null;
  manufacturerWebsite?: string | null;
  manufacturerCountry?: string | null;
  manufacturerSpecialization?: string | null;
  collaborationStatus?: string | null;
  isActive?: boolean;
}) {
  try {
    await requireAdmin();

    const res = await apiClient("/diagnosis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to create technology" };
    }

    revalidatePath("/diagnosis");
    revalidatePath("/admin/diagnosis");
    return { success: true, technology: resData.data };
  } catch (error: any) {
    console.error("Error in createDiagnosisTechnology:", error);
    return { success: false, error: error.message || "Failed to create technology" };
  }
}

// 4. Update technology (Admin)
export async function updateDiagnosisTechnology(
  id: string,
  data: Partial<{
    name: string;
    category: string;
    shortOverview: string;
    accuracy: string | null;
    purpose: string;
    advantages: string;
    limitations: string;
    recommendedGroup: string;
    imageUrl: string | null;
    introVideoUrl: string | null;
    animationVideoUrl: string | null;
    explainerVideoUrl: string | null;
    workflow: string | null;
    stepByStep: string | null;
    preparation: string | null;
    duration: string | null;
    benefits: string | null;
    risks: string | null;
    whoShouldTake: string | null;
    faqs: Array<{ q: string; a: string }>;
    relatedArticles: Array<{ title: string; link: string }>;
    brochureUrl: string | null;
    manufacturerName: string;
    manufacturerLogoUrl: string | null;
    manufacturerOverview: string | null;
    manufacturerWebsite: string | null;
    manufacturerCountry: string | null;
    manufacturerSpecialization: string | null;
    collaborationStatus: string | null;
    isActive: boolean;
  }>
) {
  try {
    await requireAdmin();

    const res = await apiClient(`/diagnosis/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to update technology" };
    }

    revalidatePath("/diagnosis");
    revalidatePath("/admin/diagnosis");
    return { success: true, technology: resData.data };
  } catch (error: any) {
    console.error("Error in updateDiagnosisTechnology:", error);
    return { success: false, error: error.message || "Failed to update technology" };
  }
}

// 5. Delete technology (Admin)
export async function deleteDiagnosisTechnology(id: string) {
  try {
    await requireAdmin();

    const res = await apiClient(`/diagnosis/${id}`, {
      method: "DELETE",
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to delete technology" };
    }

    revalidatePath("/diagnosis");
    revalidatePath("/admin/diagnosis");
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteDiagnosisTechnology:", error);
    return { success: false, error: error.message || "Failed to delete technology" };
  }
}

// 6. Reorder technologies (Admin)
export async function reorderDiagnosisTechnologies(ids: string[]) {
  try {
    await requireAdmin();

    const res = await apiClient("/diagnosis/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to reorder technologies" };
    }

    revalidatePath("/diagnosis");
    revalidatePath("/admin/diagnosis");
    return { success: true };
  } catch (error: any) {
    console.error("Error in reorderDiagnosisTechnologies:", error);
    return { success: false, error: error.message || "Failed to reorder technologies" };
  }
}

// 7. Submit collaboration request (Public)
export async function submitCollaborationRequest(data: {
  organizationName: string;
  companyName: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  country: string;
  website?: string;
  technologyName: string;
  collaborationType: string;
  description: string;
  brochureUrl?: string;
  companyProfileUrl?: string;
  consent: boolean;
}) {
  try {
    if (!data.consent) {
      throw new Error("Consent is required to submit a collaboration request.");
    }

    const res = await apiClient("/collaborations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to submit request" };
    }

    const newRequest = resData.data;

    revalidatePath("/admin/diagnosis");
    return { success: true, requestId: newRequest.id };
  } catch (error: any) {
    console.error("Error in submitCollaborationRequest:", error);
    return { success: false, error: error.message || "Failed to submit request" };
  }
}

// 8. Get collaboration requests (Admin)
export async function getCollaborationRequests() {
  try {
    await requireAdmin();

    const res = await apiClient("/collaborations", { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || "Failed to retrieve requests" };
    }
    const resData = await res.json();
    return { success: true, requests: resData.data || [] };
  } catch (error: any) {
    console.error("Error in getCollaborationRequests:", error);
    return { success: false, error: error.message || "Failed to retrieve requests" };
  }
}

// 9. Update collaboration request status (Admin)
export async function updateCollaborationRequestStatus(id: string, status: "PENDING" | "APPROVED" | "REJECTED") {
  try {
    await requireAdmin();

    const res = await apiClient(`/collaborations/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to update status" };
    }

    const result = resData.data;

    revalidatePath("/admin/diagnosis");
    return { success: true, request: result.request || result };
  } catch (error: any) {
    console.error("Error in updateCollaborationRequestStatus:", error);
    return { success: false, error: error.message || "Failed to update status" };
  }
}

// 10. Delete collaboration request (Admin)
export async function deleteCollaborationRequest(id: string) {
  try {
    await requireAdmin();

    const res = await apiClient(`/collaborations/${id}`, {
      method: "DELETE",
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to delete request" };
    }

    revalidatePath("/admin/diagnosis");
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteCollaborationRequest:", error);
    return { success: false, error: error.message || "Failed to delete request" };
  }
}

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

export async function submitArticle(data: {
  title: string;
  category: string;
  publishDate?: string;
  journal?: string;
  summary: string;
  conclusions?: string;
  authors: string;
  institution?: string;
  email?: string;
  documentUrl?: string;
  externalUrl?: string;
}) {
  try {
    const response = await apiClient("/healthcare-professionals/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to submit article" };
    }

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: resData.data };
  } catch (error: any) {
    console.error("Error submitting article:", error);
    return { success: false, error: error.message || "Failed to submit article" };
  }
}

export async function submitResource(data: {
  title: string;
  category?: string;
  desc: string;
  fileUrl: string;
  size?: string;
  format?: string;
  author?: string;
  email?: string;
}) {
  try {
    const response = await apiClient("/healthcare-professionals/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to submit resource" };
    }

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: resData.data };
  } catch (error: any) {
    console.error("Error submitting resource:", error);
    return { success: false, error: error.message || "Failed to submit resource" };
  }
}

export async function submitPartnerRequest(data: {
  applicantName: string;
  email: string;
  phone?: string;
  institution: string;
  organizationType?: string;
  researchArea: string;
  proposal: string;
  website?: string;
  documentUrl?: string;
}) {
  try {
    const response = await apiClient("/healthcare-professionals/research-partners/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to submit partner request" };
    }

    const partnerReq = resData.data;

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: partnerReq };
  } catch (error: any) {
    console.error("Error submitting partner request:", error);
    return { success: false, error: error.message || "Failed to submit partner request" };
  }
}

export async function getHealthcarePortalContent() {
  try {
    const response = await apiClient("/healthcare-professionals/portal-content");
    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message, data: { articles: [], resources: [], partners: [] } };
    }

    return {
      success: true,
      data: resData.data,
    };
  } catch (error: any) {
    console.error("Error fetching healthcare portal content:", error);
    return { success: false, error: error.message, data: { articles: [], resources: [], partners: [] } };
  }
}

export async function getAllHealthcareAdminData() {
  try {
    await requireAdmin();

    const response = await apiClient("/healthcare-professionals/admin/all");
    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return {
        success: false,
        error: resData.message,
        data: { articles: [], resources: [], partnerRequests: [], volunteerRequests: [] },
      };
    }

    return {
      success: true,
      data: resData.data,
    };
  } catch (error: any) {
    console.error("Error fetching admin healthcare data:", error);
    return {
      success: false,
      error: error.message,
      data: { articles: [], resources: [], partnerRequests: [], volunteerRequests: [] },
    };
  }
}

export async function approveResearchArticle(id: string) {
  try {
    await requireAdmin();

    const response = await apiClient(`/healthcare-professionals/articles/${id}/approve`, {
      method: "PATCH",
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to approve article" };
    }

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: resData.data };
  } catch (error: any) {
    console.error("Error approving article:", error);
    return { success: false, error: error.message };
  }
}

export async function rejectResearchArticle(id: string) {
  try {
    await requireAdmin();

    const response = await apiClient(`/healthcare-professionals/articles/${id}/reject`, {
      method: "PATCH",
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to reject article" };
    }

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: resData.data };
  } catch (error: any) {
    console.error("Error rejecting article:", error);
    return { success: false, error: error.message };
  }
}

export async function approveResource(id: string) {
  try {
    await requireAdmin();

    const response = await apiClient(`/healthcare-professionals/resources/${id}/approve`, {
      method: "PATCH",
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to approve resource" };
    }

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: resData.data };
  } catch (error: any) {
    console.error("Error approving resource:", error);
    return { success: false, error: error.message };
  }
}

export async function rejectResource(id: string) {
  try {
    await requireAdmin();

    const response = await apiClient(`/healthcare-professionals/resources/${id}/reject`, {
      method: "PATCH",
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to reject resource" };
    }

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: resData.data };
  } catch (error: any) {
    console.error("Error rejecting resource:", error);
    return { success: false, error: error.message };
  }
}

export async function approveResearchPartnerRequest(id: string) {
  try {
    await requireAdmin();

    const response = await apiClient(`/healthcare-professionals/research-partners/request/${id}/approve`, {
      method: "PATCH",
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to approve partner request" };
    }

    const req = resData.data;

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: req };
  } catch (error: any) {
    console.error("Error approving research partner request:", error);
    return { success: false, error: error.message };
  }
}

export async function rejectResearchPartnerRequest(id: string, reason?: string) {
  try {
    await requireAdmin();

    const response = await apiClient(`/healthcare-professionals/research-partners/request/${id}/reject`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to reject partner request" };
    }

    const req = resData.data;

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: req };
  } catch (error: any) {
    console.error("Error rejecting research partner request:", error);
    return { success: false, error: error.message };
  }
}

export async function approveVolunteerDoctorRequest(id: string) {
  try {
    await requireAdmin();

    const response = await apiClient(`/healthcare-professionals/volunteer-doctors/request/${id}/approve`, {
      method: "PATCH",
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to approve volunteer doctor request" };
    }

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: resData.data };
  } catch (error: any) {
    console.error("Error approving volunteer doctor request:", error);
    return { success: false, error: error.message };
  }
}

export async function rejectVolunteerDoctorRequest(id: string) {
  try {
    await requireAdmin();

    const response = await apiClient(`/healthcare-professionals/volunteer-doctors/request/${id}/reject`, {
      method: "PATCH",
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to reject volunteer doctor request" };
    }

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: resData.data };
  } catch (error: any) {
    console.error("Error rejecting volunteer doctor request:", error);
    return { success: false, error: error.message };
  }
}

"use server";

import { auth } from "@/auth";
import { Role } from "@/types/enums";
import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/apiClient";

// Helper for admin auth check
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privilege required.");
  }
  return session.user;
}

// ==========================================
// SPONSOR BANNERS ACTIONS
// ==========================================
export async function getSponsorBanners(onlyActive: boolean = false) {
  try {
    const res = await apiClient(`/sidebar-widgets/banners?onlyActive=${onlyActive}`, { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || "Failed to fetch sponsor banners" };
    }
    const resData = await res.json();
    return { success: true, banners: resData.data || [] };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch sponsor banners" };
  }
}

export async function createSponsorBanner(data: {
  logoUrl?: string;
  imageUrl?: string;
  title: string;
  description: string;
  destinationLink?: string;
  isActive?: boolean;
}) {
  try {
    await requireAdmin();

    const res = await apiClient("/sidebar-widgets/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to create sponsor banner" };
    }

    revalidatePath("/");
    return { success: true, banner: resData.data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create sponsor banner" };
  }
}

export async function updateSponsorBanner(id: string, data: {
  logoUrl?: string | null;
  imageUrl?: string | null;
  title?: string;
  description?: string;
  destinationLink?: string | null;
  isActive?: boolean;
}) {
  try {
    await requireAdmin();

    const res = await apiClient(`/sidebar-widgets/banners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to update sponsor banner" };
    }

    revalidatePath("/");
    return { success: true, banner: resData.data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update sponsor banner" };
  }
}

export async function deleteSponsorBanner(id: string) {
  try {
    await requireAdmin();

    const res = await apiClient(`/sidebar-widgets/banners/${id}`, {
      method: "DELETE",
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to delete sponsor banner" };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete sponsor banner" };
  }
}

export async function reorderSponsorBanners(orderedIds: string[]) {
  try {
    await requireAdmin();

    const res = await apiClient("/sidebar-widgets/banners/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to reorder sponsor banners" };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reorder sponsor banners" };
  }
}

// ==========================================
// CELEBRITY TESTIMONIALS ACTIONS
// ==========================================
export async function getCelebrityTestimonials(onlyActive: boolean = false) {
  try {
    const res = await apiClient(`/sidebar-widgets/testimonials?onlyActive=${onlyActive}`, { cache: "no-store" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || "Failed to fetch testimonials" };
    }
    const resData = await res.json();
    return { success: true, testimonials: resData.data || [] };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch testimonials" };
  }
}

export async function createCelebrityTestimonial(data: {
  videoUrl: string;
  thumbnailUrl?: string;
  name: string;
  profession: string;
  duration?: string;
  quote: string;
  description?: string;
  isActive?: boolean;
}) {
  try {
    await requireAdmin();

    const res = await apiClient("/sidebar-widgets/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to create testimonial" };
    }

    revalidatePath("/");
    return { success: true, testimonial: resData.data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create testimonial" };
  }
}

export async function updateCelebrityTestimonial(id: string, data: {
  videoUrl?: string;
  thumbnailUrl?: string | null;
  name?: string;
  profession?: string;
  duration?: string | null;
  quote?: string;
  description?: string | null;
  isActive?: boolean;
}) {
  try {
    await requireAdmin();

    const res = await apiClient(`/sidebar-widgets/testimonials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to update testimonial" };
    }

    revalidatePath("/");
    return { success: true, testimonial: resData.data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update testimonial" };
  }
}

export async function deleteCelebrityTestimonial(id: string) {
  try {
    await requireAdmin();

    const res = await apiClient(`/sidebar-widgets/testimonials/${id}`, {
      method: "DELETE",
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to delete testimonial" };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete testimonial" };
  }
}

export async function reorderCelebrityTestimonials(orderedIds: string[]) {
  try {
    await requireAdmin();

    const res = await apiClient("/sidebar-widgets/testimonials/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to reorder testimonials" };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reorder testimonials" };
  }
}

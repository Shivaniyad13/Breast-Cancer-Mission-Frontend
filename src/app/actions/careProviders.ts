"use server";

import { auth } from "@/auth";
import { apiClient } from "@/lib/apiClient";
import { Role } from "@/types/enums";
import { revalidatePath } from "next/cache";

export async function getPublicCareProviders() {
  try {
    const response = await apiClient("/care-providers");
    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to fetch care providers." };
    }

    return { success: true, data: resData.data };
  } catch (error: any) {
    console.error("Error fetching public care providers:", error);
    return { success: false, error: "Failed to fetch care providers." };
  }
}

export async function getAllCareProvidersAdmin() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized access." };
    }

    const response = await apiClient("/care-providers/admin/all");
    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to fetch care providers." };
    }

    return { success: true, data: resData.data };
  } catch (error: any) {
    console.error("Error fetching admin care providers:", error);
    return { success: false, error: "Failed to fetch care providers." };
  }
}

export async function createCareProvider(data: {
  name: string;
  category: string;
  specialization: string;
  city: string;
  state?: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
  hours?: string;
  about: string;
  facilities: string[];
  rating?: number;
  reviews?: number;
  isVerified?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized access." };
    }

    const response = await apiClient("/care-providers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to create care provider." };
    }

    revalidatePath("/care/care-providers");
    revalidatePath("/admin/care-providers");

    return { success: true, data: resData.data };
  } catch (error: any) {
    console.error("Error creating care provider:", error);
    return { success: false, error: "Failed to create care provider." };
  }
}

export async function updateCareProvider(
  id: string,
  data: {
    name?: string;
    category?: string;
    specialization?: string;
    city?: string;
    state?: string;
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
    hours?: string;
    about?: string;
    facilities?: string[];
    rating?: number;
    reviews?: number;
    isVerified?: boolean;
    isPublished?: boolean;
    sortOrder?: number;
  }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized access." };
    }

    const response = await apiClient(`/care-providers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to update care provider." };
    }

    revalidatePath("/care/care-providers");
    revalidatePath("/admin/care-providers");

    return { success: true, data: resData.data };
  } catch (error: any) {
    console.error("Error updating care provider:", error);
    return { success: false, error: "Failed to update care provider." };
  }
}

export async function deleteCareProvider(id: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized access." };
    }

    const response = await apiClient(`/care-providers/${id}`, {
      method: "DELETE",
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to delete care provider." };
    }

    revalidatePath("/care/care-providers");
    revalidatePath("/admin/care-providers");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting care provider:", error);
    return { success: false, error: "Failed to delete care provider." };
  }
}

export async function togglePublishCareProvider(id: string, isPublished: boolean) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized access." };
    }

    const response = await apiClient(`/care-providers/${id}/publish`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished }),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to update publication status." };
    }

    revalidatePath("/care/care-providers");
    revalidatePath("/admin/care-providers");

    return { success: true, data: resData.data };
  } catch (error: any) {
    console.error("Error toggling publish care provider:", error);
    return { success: false, error: "Failed to update publication status." };
  }
}

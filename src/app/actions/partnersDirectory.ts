"use server";

import { apiClient } from "@/lib/apiClient";

export async function getPartnerDirectory() {
  try {
    const response = await apiClient("/partnerships/directory");
    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to fetch directory.", all: [] };
    }

    return { success: true, all: resData.data };
  } catch (error: any) {
    console.error("Error in getPartnerDirectory:", error);
    return { success: false, error: error.message || "Failed to fetch directory.", all: [] };
  }
}

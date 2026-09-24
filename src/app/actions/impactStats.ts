"use server";

import { apiClient } from "@/lib/apiClient";

export async function getImpactStats() {
  try {
    const res = await apiClient("/analytics/impact-stats");
    if (!res.ok) {
      throw new Error("Failed to fetch impact stats from backend.");
    }
    const body = await res.json();
    return {
      success: true,
      stats: body.data,
    };
  } catch (error: any) {
    console.error("Error in getImpactStats:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch impact stats.",
      stats: {
        totalPartners: 0,
        doctors: 0,
        hospitals: 0,
        campaigns: 0,
        stories: 0,
        webinars: 0,
        ngo: 0,
      },
    };
  }
}

"use server";

import { apiClient } from "@/lib/apiClient";
import { auth } from "@/auth";
import { Role } from "@/types/enums";

/**
 * Retrieves complete aggregated analytics overview for Admin.
 * Strictly protected for ADMIN role users.
 */
export async function getAnalyticsOverviewAction() {
  const session = await auth();

  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Only Administrators can access analytics.");
  }

  const res = await apiClient("/analytics/overview");
  if (!res.ok) {
    throw new Error("Failed to fetch analytics overview from server.");
  }

  const body = await res.json();
  return body.data;
}

/**
 * Public action to record lightweight pageview (privacy-conscious, no PII stored)
 */
export async function recordPageViewAction(path: string) {
  if (!path || typeof path !== "string") return { success: false };

  const sanitizedPath = path.trim().split("?")[0].substring(0, 255);

  if (
    sanitizedPath.startsWith("/admin") ||
    sanitizedPath.startsWith("/api") ||
    sanitizedPath.startsWith("/_next") ||
    sanitizedPath.includes(".")
  ) {
    return { success: false };
  }

  try {
    const res = await apiClient("/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: sanitizedPath }),
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

/**
 * Public action to record video play event
 */
export async function recordVideoPlayAction(
  videoIdentifier: string,
  title?: string,
  category?: string
) {
  if (!videoIdentifier || typeof videoIdentifier !== "string") return { success: false };

  const sanitizedId = videoIdentifier.trim().substring(0, 255);
  const sanitizedTitle = (title || "Awareness Video").trim().substring(0, 255);
  const sanitizedCategory = (category || "AWARENESS").trim().substring(0, 100);

  try {
    const res = await apiClient("/analytics/videoplay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoIdentifier: sanitizedId,
        title: sanitizedTitle,
        category: sanitizedCategory,
      }),
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}
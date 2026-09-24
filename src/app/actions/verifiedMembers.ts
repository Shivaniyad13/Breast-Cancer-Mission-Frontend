"use server";

import { apiClient } from "@/lib/apiClient";

export async function getVerifiedMembers() {
  try {
    const response = await apiClient("/memberships/verified");
    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return { success: false, members: [] };
    }

    return { success: true, members: resData.data };
  } catch (error) {
    console.error("Error fetching verified members:", error);
    return { success: false, members: [] };
  }
}

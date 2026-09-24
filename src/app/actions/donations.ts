"use server";

import { auth } from "@/auth";
import { apiClient } from "@/lib/apiClient";
import { Role, DonationStatus } from "@/types/enums";
import { revalidatePath } from "next/cache";

export async function getAvailableCampaignsAction() {
  try {
    const res = await apiClient("/campaigns");
    const data = await res.json();
    if (res.ok && data.data) {
      const campaigns = data.data.map((c: any) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        status: c.status,
      }));
      return { success: true, campaigns };
    }
    return { success: false, campaigns: [], error: data.message || "Failed to fetch campaigns" };
  } catch (error: any) {
    console.error("Error fetching campaigns:", error);
    return { success: false, campaigns: [], error: error.message };
  }
}

export async function createDonationAction(data: {
  campaignId?: string | null;
  amount: number;
  currency?: string;
  paymentGatewayId?: string;
  isAnonymous?: boolean;
  donorName?: string | null;
  donorEmail?: string | null;
  donorPhone?: string | null;
  message?: string | null;
  status?: DonationStatus;
  name?: string;
  email?: string;
  phone?: string;
  is_anonymous?: boolean;
  transaction_id?: string;
  payment_status?: string;
}) {
  try {
    const session = await auth();
    const donorId = session?.user?.id || null;

    const payload = {
      campaignId: data.campaignId || undefined,
      donorId: donorId || undefined,
      amount: data.amount,
      currency: data.currency || "INR",
      paymentGatewayId: data.paymentGatewayId || data.transaction_id || `UPI-${Date.now()}`,
      isAnonymous: data.isAnonymous ?? data.is_anonymous ?? false,
      donorName: data.donorName || data.name || session?.user?.name || undefined,
      donorEmail: data.donorEmail || data.email || session?.user?.email || undefined,
      donorPhone: data.donorPhone || data.phone || undefined,
      message: data.message || undefined,
      status: data.status || DonationStatus.SUCCESSFUL,
    };

    const res = await apiClient("/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseData = await res.json();

    if (!res.ok) {
      return { success: false, error: responseData.message || responseData.error || "Failed to process donation" };
    }

    const donation = responseData.data || responseData;

    revalidatePath("/donate");
    revalidatePath("/dashboard");
    revalidatePath("/admin/donations");

    return {
      success: true,
      donation: {
        ...donation,
        amount: Number(donation.amount),
      },
    };
  } catch (error: any) {
    console.error("Error creating donation:", error);
    return { success: false, error: error.message || "Failed to process donation" };
  }
}

export async function getPublicDonationsAction(params?: {
  limit?: number;
  page?: number;
  status?: string;
  search?: string;
}) {
  try {
    const query = new URLSearchParams();
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.page) query.set("page", params.page.toString());
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);

    const endpoint = `/donations${query.toString() ? `?${query.toString()}` : ""}`;
    const res = await apiClient(endpoint);
    const data = await res.json();

    if (res.ok && data.data) {
      const donationsList = Array.isArray(data.data) ? data.data : (data.data.donations || []);
      const formatted = donationsList.map((d: any) => {
        const isCompleted =
          d.status === DonationStatus.SUCCESSFUL ||
          d.status === DonationStatus.COMPLETED;
        return {
          id: d.id,
          name: d.isAnonymous ? "Anonymous" : d.donorName || d.donor?.name || "Anonymous Supporter",
          donorName: d.donorName,
          email: d.donorEmail || d.donor?.email || "",
          donorEmail: d.donorEmail,
          organization: undefined,
          amount: Number(d.amount),
          message: d.message || undefined,
          is_anonymous: d.isAnonymous,
          isAnonymous: d.isAnonymous,
          created_at: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
          createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
          status: d.status,
          payment_status: isCompleted ? "completed" : (d.status ? d.status.toLowerCase() : "pending"),
          user_id: d.donorId || undefined,
          user: d.donor
            ? {
                id: d.donor.id,
                name: d.donor.name || "Anonymous",
                email: d.donor.email || "",
                image: d.donor.image || undefined,
              }
            : undefined,
          campaign: d.campaign,
        };
      });

      return { success: true, donations: formatted };
    }

    return { success: false, donations: [], error: data.message || "Failed to fetch donations" };
  } catch (error: any) {
    console.error("Error fetching public donations:", error);
    return { success: false, donations: [], error: error.message };
  }
}

export async function getDonationStatsAction() {
  try {
    const res = await apiClient("/donations/stats");
    const data = await res.json();

    if (res.ok && data.data) {
      const stats = data.data;
      return {
        success: true,
        total_donations: stats.total_donations ?? stats.totalDonations ?? 0,
        totalDonations: stats.totalDonations ?? stats.total_donations ?? 0,
        total_amount: stats.total_amount ?? stats.totalAmount ?? 0,
        totalAmount: stats.totalAmount ?? stats.total_amount ?? 0,
        average_donation: stats.average_donation ?? stats.averageDonation ?? 0,
        averageDonation: stats.averageDonation ?? stats.average_donation ?? 0,
        top_donation: stats.top_donation ?? stats.topDonation ?? stats.highest_donation ?? 0,
        highest_donation: stats.highest_donation ?? stats.highestDonation ?? 0,
        topDonation: stats.topDonation ?? stats.top_donation ?? 0,
        highestDonation: stats.highestDonation ?? stats.highest_donation ?? 0,
        recent_donations: stats.recent_donations ?? stats.recentDonations ?? 0,
        recentDonations: stats.recentDonations ?? stats.recent_donations ?? 0,
      };
    }

    return {
      success: false,
      total_donations: 0,
      totalDonations: 0,
      total_amount: 0,
      totalAmount: 0,
      average_donation: 0,
      averageDonation: 0,
      top_donation: 0,
      highest_donation: 0,
      topDonation: 0,
      highestDonation: 0,
      recent_donations: 0,
      recentDonations: 0,
      error: data.message,
    };
  } catch (error: any) {
    console.error("Error fetching donation stats:", error);
    return {
      success: false,
      total_donations: 0,
      totalDonations: 0,
      total_amount: 0,
      totalAmount: 0,
      average_donation: 0,
      averageDonation: 0,
      top_donation: 0,
      highest_donation: 0,
      topDonation: 0,
      highestDonation: 0,
      recent_donations: 0,
      recentDonations: 0,
      error: error.message,
    };
  }
}

export async function getMyDonationsAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: true, donations: [] };
    }

    const res = await apiClient("/donations/my");
    const data = await res.json();

    if (res.ok && data.data) {
      const formatted = data.data.map((d: any) => ({
        ...d,
        amount: Number(d.amount),
      }));
      return { success: true, donations: formatted };
    }

    return { success: false, donations: [] };
  } catch (error: any) {
    console.error("Error fetching user donations:", error);
    return { success: false, donations: [], error: error.message };
  }
}

export async function getAdminDonationsAction(filters?: {
  search?: string;
  status?: string;
  donationType?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized access", donations: [] };
    }

    const query = new URLSearchParams();
    if (filters?.search) query.set("search", filters.search);
    if (filters?.status) query.set("status", filters.status);
    if (filters?.donationType) query.set("donationType", filters.donationType);

    const endpoint = `/donations/admin/all${query.toString() ? `?${query.toString()}` : ""}`;
    const res = await apiClient(endpoint);
    const data = await res.json();

    if (res.ok && data.data) {
      const donationsList = Array.isArray(data.data) ? data.data : (data.data.donations || []);
      const formatted = donationsList.map((d: any) => ({
        ...d,
        amount: Number(d.amount),
      }));
      return { success: true, donations: formatted };
    }

    return { success: false, donations: [], error: data.message };
  } catch (error: any) {
    console.error("Error fetching admin donations:", error);
    return { success: false, donations: [], error: error.message };
  }
}

export async function updateDonationStatusAction(id: string, status: DonationStatus) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized access" };
    }

    const res = await apiClient(`/donations/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.message || "Failed to update donation status" };
    }

    const updated = data.data || data;

    revalidatePath("/admin/donations");
    revalidatePath("/donate");
    revalidatePath("/dashboard");

    return {
      success: true,
      donation: {
        ...updated,
        amount: Number(updated.amount),
      },
    };
  } catch (error: any) {
    console.error("Error updating donation status:", error);
    return { success: false, error: error.message || "Failed to update donation status" };
  }
}

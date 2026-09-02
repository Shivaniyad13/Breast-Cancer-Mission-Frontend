"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Role, DonationStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getAvailableCampaignsAction() {
  try {
    const campaigns = await db.campaign.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      },
    });
    return { success: true, campaigns };
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

    let validDonorId: string | null = null;
    if (donorId) {
      const userExists = await db.user.findUnique({ where: { id: donorId } });
      if (userExists) {
        validDonorId = donorId;
      }
    }

    let campaignId: string | null = data.campaignId || null;

    if (campaignId) {
      const campaign = await db.campaign.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        console.warn(`Campaign ID ${campaignId} not found, proceeding with general donation`);
        campaignId = null;
      }
    }

    const initialStatus = data.status || DonationStatus.SUCCESSFUL;
    const paymentGatewayId =
      data.paymentGatewayId || data.transaction_id || `UPI-${Date.now()}`;

    const donation = await db.$transaction(
      async (tx) => {
        // Check if a donation with this paymentGatewayId already exists
        const existing = await tx.donation.findUnique({
          where: { paymentGatewayId },
          include: {
            campaign: {
              select: { id: true, title: true, slug: true },
            },
          },
        });

        if (existing) {
          return existing;
        }

        const created = await tx.donation.create({
          data: {
            campaignId,
            donorId: validDonorId,
            donorName: data.donorName || data.name || session?.user?.name || null,
            donorEmail: data.donorEmail || data.email || session?.user?.email || null,
            donorPhone: data.donorPhone || data.phone || null,
            message: data.message || null,
            amount: new Prisma.Decimal(data.amount),
            currency: data.currency || "INR",
            paymentGatewayId,
            isAnonymous: data.isAnonymous ?? data.is_anonymous ?? false,
            status: initialStatus,
          },
          include: {
            campaign: {
              select: { id: true, title: true, slug: true },
            },
          },
        });

        // Increment campaign amountRaised ONLY if campaignId exists and status is SUCCESSFUL
        if (initialStatus === DonationStatus.SUCCESSFUL && campaignId) {
          await tx.campaign.update({
            where: { id: campaignId },
            data: {
              amountRaised: {
                increment: data.amount,
              },
            },
          });
        }

        return created;
      },
      {
        maxWait: 10000,
        timeout: 20000,
      }
    );

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
    const limit = params?.limit || 100;
    const page = params?.page || 1;
    const skip = (page - 1) * limit;

    const donations = await db.donation.findMany({
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
      include: {
        campaign: {
          select: { id: true, title: true, slug: true },
        },
        donor: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    const formatted = donations.map((d) => {
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
        created_at: d.createdAt.toISOString(),
        createdAt: d.createdAt.toISOString(),
        status: d.status,
        payment_status: isCompleted ? "completed" : d.status.toLowerCase(),
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
  } catch (error: any) {
    console.error("Error fetching public donations:", error);
    return { success: false, donations: [], error: error.message };
  }
}

export async function getDonationStatsAction() {
  try {
    const aggregate = await db.donation.aggregate({
      where: {
        status: {
          in: [DonationStatus.SUCCESSFUL, DonationStatus.COMPLETED],
        },
      },
      _count: { id: true },
      _sum: { amount: true },
      _avg: { amount: true },
      _max: { amount: true },
    });

    const totalDonations = aggregate._count.id || 0;
    const totalAmount = Number(aggregate._sum.amount || 0);
    const averageDonation = Math.round(Number(aggregate._avg.amount || 0));
    const highestDonation = Number(aggregate._max.amount || 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentDonationsCount = await db.donation.count({
      where: {
        status: {
          in: [DonationStatus.SUCCESSFUL, DonationStatus.COMPLETED],
        },
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    return {
      success: true,
      total_donations: totalDonations,
      totalDonations: totalDonations,
      total_amount: totalAmount,
      totalAmount: totalAmount,
      average_donation: averageDonation,
      averageDonation: averageDonation,
      top_donation: highestDonation,
      highest_donation: highestDonation,
      topDonation: highestDonation,
      highestDonation: highestDonation,
      recent_donations: recentDonationsCount,
      recentDonations: recentDonationsCount,
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

    const donations = await db.donation.findMany({
      where: { donorId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        campaign: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    const formatted = donations.map((d) => ({
      ...d,
      amount: Number(d.amount),
    }));

    return { success: true, donations: formatted };
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

    const whereConditions: Prisma.DonationWhereInput[] = [];

    if (filters?.status && filters.status !== "ALL") {
      whereConditions.push({ status: filters.status as DonationStatus });
    }

    if (filters?.donationType === "GENERAL") {
      whereConditions.push({ campaignId: null });
    } else if (filters?.donationType === "CAMPAIGN") {
      whereConditions.push({ campaignId: { not: null } });
    }

    if (filters?.search && filters.search.trim() !== "") {
      const q = filters.search.trim();
      whereConditions.push({
        OR: [
          { donorName: { contains: q, mode: "insensitive" } },
          { donorEmail: { contains: q, mode: "insensitive" } },
          { donorPhone: { contains: q, mode: "insensitive" } },
          { paymentGatewayId: { contains: q, mode: "insensitive" } },
          { campaign: { title: { contains: q, mode: "insensitive" } } },
        ],
      });
    }

    const where: Prisma.DonationWhereInput =
      whereConditions.length > 0 ? { AND: whereConditions } : {};

    const donations = await db.donation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        campaign: {
          select: { id: true, title: true, slug: true },
        },
        donor: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const formatted = donations.map((d) => ({
      ...d,
      amount: Number(d.amount),
    }));

    return { success: true, donations: formatted };
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

    const donation = await db.donation.findUnique({ where: { id } });
    if (!donation) {
      return { success: false, error: "Donation not found" };
    }

    const updated = await db.$transaction(async (tx) => {
      const updatedDonation = await tx.donation.update({
        where: { id },
        data: { status },
        include: {
          campaign: {
            select: { id: true, title: true, slug: true },
          },
          donor: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      // Increment campaign amountRaised ONLY if campaignId exists and status transitions to SUCCESSFUL
      if (
        status === DonationStatus.SUCCESSFUL &&
        donation.status !== DonationStatus.SUCCESSFUL &&
        donation.campaignId
      ) {
        await tx.campaign.update({
          where: { id: donation.campaignId },
          data: {
            amountRaised: {
              increment: donation.amount,
            },
          },
        });
      }

      return updatedDonation;
    });

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

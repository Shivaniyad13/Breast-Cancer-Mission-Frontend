"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role } from "@prisma/client";

/**
 * Retrieves complete aggregated analytics overview for Admin.
 * Strictly protected for ADMIN role users.
 */
export async function getAnalyticsOverviewAction() {
  const session = await auth();

  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Only Administrators can access analytics.");
  }

  const [
    totalPageViews,
    topPageViewsGrouped,
    totalUsers,
    usersByRoleGrouped,
    newUsersThisMonth,
    totalWebinarRegistrations,
    totalAttendees,
    totalCertificatesIssued,
    webinarsList,
    totalVideoPlays,
    topVideoPlaysGrouped,
    topArticles,
    totalArticleViewsAggregate,
    successfulDonationsCount,
    totalDonationAmountAggregate,
    campaignsList,
    individualTotal,
    individualPending,
    individualVerified,
    individualRejected,
    // 👇 NAYE 4 VARIABLES (volunteers)
    volunteerTotal,
    volunteerPending,
    volunteerVerified,
    volunteerRejected,
  ] = await Promise.all([
    // 1. Website Visits
    db.pageView.count(),
    db.pageView.groupBy({
      by: ["path"],
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 5,
    }),

    // 2. User Registrations
    db.user.count(),
    db.user.groupBy({
      by: ["role"],
      _count: { role: true },
    }),
    db.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),

    // 3. Webinar Analytics
    db.webinarRegistration.count(),
    db.attendance.count({
      where: {
        OR: [{ status: "PRESENT" }, { durationMinutes: { gt: 0 } }],
      },
    }),
    db.certificate.count(),
    db.webinar.findMany({
      select: {
        id: true,
        title: true,
        date: true,
        status: true,
        maxSeats: true,
        _count: {
          select: {
            registrations: true,
            attendance: true,
            certificates: true,
          },
        },
      },
      orderBy: { date: "desc" },
      take: 10,
    }),

    // 4. Video Play Views
    db.videoPlay.count(),
    db.videoPlay.groupBy({
      by: ["videoIdentifier", "title", "category"],
      _count: { videoIdentifier: true },
      orderBy: { _count: { videoIdentifier: "desc" } },
      take: 10,
    }),

    // 5. Awareness Articles
    db.article.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        views: true,
        readTime: true,
      },
      orderBy: { views: "desc" },
      take: 5,
    }),
    db.article.aggregate({
      _sum: { views: true },
    }),

    // 6. Donations & Campaigns
    db.donation.count({
      where: {
        status: { in: ["SUCCESSFUL", "COMPLETED"] },
      },
    }),
    db.donation.aggregate({
      where: {
        status: { in: ["SUCCESSFUL", "COMPLETED"] },
      },
      _sum: { amount: true },
    }),
    db.campaign.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        fundingGoal: true,
        amountRaised: true,
        _count: {
          select: {
            donations: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),

    // 7. Individual Members Analytics
    db.individualMember.count(),
    db.individualMember.count({ where: { status: "PENDING" } }),
    db.individualMember.count({ where: { status: "VERIFIED" } }),
    db.individualMember.count({ where: { status: "REJECTED" } }),

    // 👇 8. Volunteers Analytics (NAYA SECTION)
    db.volunteerApplication.count(),
    db.volunteerApplication.count({ where: { status: "PENDING" } }),
    db.volunteerApplication.count({ where: { status: "VERIFIED" } }),
    db.volunteerApplication.count({ where: { status: "REJECTED" } }),
  ]);

  // Format top pages
  const topPages = topPageViewsGrouped.map((item) => ({
    path: item.path,
    views: item._count.path,
  }));

  // Format roles
  const usersByRole = usersByRoleGrouped.reduce(
    (acc, item) => {
      acc[item.role] = item._count.role;
      return acc;
    },
    {} as Record<string, number>
  );

  // Calculate attendance rate percentage
  const attendanceRate =
    totalWebinarRegistrations > 0
      ? Math.round((totalAttendees / totalWebinarRegistrations) * 100)
      : 0;

  // Format top video plays
  const topVideos = topVideoPlaysGrouped.map((item) => ({
    videoIdentifier: item.videoIdentifier,
    title: item.title,
    category: item.category,
    playCount: item._count.videoIdentifier,
  }));

  return {
    visits: {
      totalVisits: totalPageViews,
      topPages,
    },
    users: {
      totalUsers,
      newUsersThisMonth,
      usersByRole,
    },
    webinars: {
      totalRegistrations: totalWebinarRegistrations,
      totalAttendees,
      attendanceRate,
      totalCertificatesIssued,
      webinarsList: webinarsList.map((w) => ({
        id: w.id,
        title: w.title,
        date: w.date ? w.date.toISOString() : null,
        status: w.status,
        maxSeats: w.maxSeats,
        registrationsCount: w._count.registrations,
        attendanceCount: w._count.attendance,
        certificatesCount: w._count.certificates,
      })),
    },
    videos: {
      totalVideoPlays,
      topVideos,
    },
    articles: {
      totalArticleViews: totalArticleViewsAggregate._sum.views || 0,
      topArticles,
    },
    donations: {
      successfulDonationsCount,
      totalDonationAmount: Number(totalDonationAmountAggregate._sum.amount || 0),
      campaignsList: campaignsList.map((c) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        status: c.status,
        fundingGoal: Number(c.fundingGoal),
        amountRaised: Number(c.amountRaised),
        donationsCount: c._count.donations,
      })),
    },
    individualMembers: {
      total: individualTotal,
      pending: individualPending,
      verified: individualVerified,
      rejected: individualRejected,
    },
    // 👇 NAYA SECTION — volunteers
    volunteers: {
      total: volunteerTotal,
      pending: volunteerPending,
      verified: volunteerVerified,
      rejected: volunteerRejected,
    },
  };
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
    await db.pageView.create({
      data: { path: sanitizedPath },
    });
    return { success: true };
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
    await db.videoPlay.create({
      data: {
        videoIdentifier: sanitizedId,
        title: sanitizedTitle,
        category: sanitizedCategory,
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const revalidate = 300;

// GET /api/volunteers/stats
export async function GET() {
  try {
    const now = new Date();

    const [volunteers, campaigns, reachedAggregate, events] = await Promise.all([
      db.volunteerApplication.count({
        where: {
          status: "VERIFIED",
        },
      }),
      db.volunteerEvent.count({
        where: {
          eventDate: {
            lte: now,
          },
        },
      }),
      db.volunteerEvent.aggregate({
        _sum: {
          peopleReached: true,
        },
      }),
      db.volunteerEvent.count(),
    ]);

    const reached = reachedAggregate._sum.peopleReached || 0;

    return NextResponse.json(
      {
        success: true,
        data: {
          volunteers,
          campaigns,
          reached,
          events,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in GET /api/volunteers/stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch volunteer stats",
      },
      { status: 500 }
    );
  }
}

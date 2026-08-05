import { NextResponse } from "next/server";
import { getDonationStatsAction } from "@/app/actions/donations";

export async function GET() {
  try {
    const result = await getDonationStatsAction();

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to fetch stats" }, { status: 400 });
    }

    return NextResponse.json({
      message: "Donation stats fetched successfully",
      data: {
        total_donations: result.total_donations,
        totalDonations: result.totalDonations,
        total_amount: result.total_amount,
        totalAmount: result.totalAmount,
        average_donation: result.average_donation,
        averageDonation: result.averageDonation,
        top_donation: result.top_donation,
        highest_donation: result.highest_donation,
        topDonation: result.topDonation,
        highestDonation: result.highestDonation,
        recent_donations: result.recent_donations,
        recentDonations: result.recentDonations,
      },
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch donation stats" },
      { status: 500 }
    );
  }
}

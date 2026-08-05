import { NextResponse } from "next/server";
import { getMyDonationsAction } from "@/app/actions/donations";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const result = await getMyDonationsAction();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      message: "User donations fetched successfully",
      data: result.donations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch user donations" },
      { status: 500 }
    );
  }
}

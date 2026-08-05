import { NextResponse } from "next/server";
import { createDonationAction, getPublicDonationsAction, getAdminDonationsAction } from "@/app/actions/donations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createDonationAction(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "Donation processed successfully",
        data: result.donation,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create donation" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const limit = searchParams.get("limit");
    const page = searchParams.get("page");
    const isAdmin = searchParams.get("admin") === "true";

    let result;
    if (isAdmin) {
      result = await getAdminDonationsAction({ search, status });
    } else {
      result = await getPublicDonationsAction({
        search,
        status,
        limit: limit ? parseInt(limit, 10) : 100,
        page: page ? parseInt(page, 10) : 1,
      });
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      message: "Donations fetched successfully",
      donations: result.donations,
      data: result.donations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch donations" },
      { status: 500 }
    );
  }
}

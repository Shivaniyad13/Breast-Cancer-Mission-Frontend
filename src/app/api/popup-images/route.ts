import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const images = [
      {
        src: "/images/chhath-puja.png",
        alt: "Chhath Puja Greetings",
      },
    ];

    return NextResponse.json(
      { images },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load popup images" },
      { status: 500 }
    );
  }
}
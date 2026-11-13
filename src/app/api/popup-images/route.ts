import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Direct single image path
    const images = [
      {
        src: "/images/Chhath Puja Greetings by Cancer Mukt Bharat.png",
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
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = (formData.get("file") || formData.get("video")) as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No video file provided in upload request." },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const backendFormData = new FormData();
    backendFormData.append("file", file);

    const backendRes = await fetch(`${backendUrl}/upload`, {
      method: "POST",
      body: backendFormData,
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      const url = data.data?.url || data.url;
      return NextResponse.json({ url }, { status: 200 });
    }

    return NextResponse.json({ error: "Backend video upload failed" }, { status: 500 });
  } catch (err: any) {
    console.error("Error handling video upload:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during video upload." },
      { status: 500 }
    );
  }
}


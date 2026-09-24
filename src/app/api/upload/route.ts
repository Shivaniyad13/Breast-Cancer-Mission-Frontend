import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
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
      return NextResponse.json({ url });
    }

    // Fallback in case backend is unreachable: Data URL
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");
    const mimeType = file.type || "image/png";
    return NextResponse.json({ url: `data:${mimeType};base64,${base64Data}` });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}


import { NextResponse } from "next/server";
import { apiClient } from "@/lib/apiClient";

// GET /api/volunteers/gallery?status=APPROVED
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status") || "APPROVED";
    const targetStatus = (statusParam === "APPROVED" || statusParam === "VERIFIED") ? "VERIFIED" : statusParam;

    const response = await apiClient(`/volunteers/gallery?status=${targetStatus}&limit=12`);
    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return NextResponse.json(
        {
          success: false,
          error: resData.message || resData.error || "Failed to fetch gallery submissions",
        },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json({ success: true, data: resData.data }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/volunteers/gallery:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch gallery submissions",
      },
      { status: 500 }
    );
  }
}

// Helper to save uploaded image via Express upload API
async function processImageUpload(file: File): Promise<string> {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${backendUrl}/upload`, {
    method: "POST",
    body: formData,
  });

  if (res.ok) {
    const resData = await res.json();
    return resData.data?.url || resData.url;
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64Data = buffer.toString("base64");
  const mimeType = file.type || "image/png";
  return `data:${mimeType};base64,${base64Data}`;
}

// POST /api/volunteers/gallery
export async function POST(request: Request) {
  try {
    const meRes = await apiClient("/auth/me", {
      headers: { cookie: request.headers.get("cookie") || "" },
    });

    if (!meRes.ok) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const meData = await meRes.json();
    const userId = meData.data?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const sessRes = await apiClient(`/volunteers/session?userId=${userId}`);
    const sessData = await sessRes.json();
    const volunteer = sessData.data;

    if (!volunteer || !volunteer.volunteerId || (volunteer.volunteerStatus !== "VERIFIED" && volunteer.volunteerStatus !== "APPROVED")) {
      return NextResponse.json(
        {
          success: false,
          error: "Only verified volunteers can submit gallery photos",
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const image = (formData.get("image") || formData.get("file")) as File | null;
    const title = formData.get("title") as string | null;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image file is required" },
        { status: 400 }
      );
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (image.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (image.type && !allowedTypes.includes(image.type.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "Invalid image format. Only JPG, PNG, and WEBP are allowed" },
        { status: 400 }
      );
    }

    const imageUrl = await processImageUpload(image);

    const response = await apiClient("/volunteers/gallery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify({
        volunteerId: volunteer.volunteerId,
        title: title.trim(),
        imageUrl,
      }),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return NextResponse.json(
        { success: false, error: resData.message || resData.error || "Failed to upload gallery photo" },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: resData.data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/volunteers/gallery:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to upload gallery photo",
      },
      { status: 500 }
    );
  }
}


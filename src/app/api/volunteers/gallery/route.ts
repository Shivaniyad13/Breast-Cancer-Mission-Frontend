import { NextResponse } from "next/server";
import { z } from "zod";
import { apiClient } from "@/lib/apiClient";

// GET /api/volunteers/gallery?status=APPROVED
export async function GET() {
  try {
    const response = await apiClient("/volunteers/gallery?status=VERIFIED&limit=12");
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

const gallerySubmissionSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email address").max(254),
  caption: z.string().trim().max(1000).optional(),
  consent: z.literal("true", { error: "Consent is required before submitting" }),
});

// Store submitted media through the backend upload service.
async function processMediaUpload(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient("/upload/volunteer-media", {
    method: "POST",
    body: formData,
  });
  const resData = await res.json();
  if (!res.ok) {
    throw new Error(resData.message || resData.error || "Failed to upload media");
  }
  const url = resData.data?.url || resData.url;
  if (typeof url !== "string" || !url) {
    throw new Error("Media upload service did not return a file URL");
  }
  return url;
}

// POST /api/volunteers/gallery
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const media = (formData.get("media") || formData.get("image") || formData.get("file")) as File | null;
    const validation = gallerySubmissionSchema.safeParse({
      title: formData.get("title"),
      name: formData.get("name"),
      email: formData.get("email"),
      caption: formData.get("caption") || undefined,
      consent: formData.get("consent"),
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues.map((issue) => issue.message).join(", "),
        },
        { status: 400 }
      );
    }

    if (!media || media.size === 0) {
      return NextResponse.json(
        { success: false, error: "Photo or video file is required" },
        { status: 400 }
      );
    }

    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];
    const mediaType = media.type.startsWith("video/") ? "video" : "image";
    if (
      (mediaType === "image" && !allowedImageTypes.includes(media.type.toLowerCase())) ||
      (mediaType === "video" && !allowedVideoTypes.includes(media.type.toLowerCase()))
    ) {
      return NextResponse.json(
        { success: false, error: "Only JPG, PNG, WEBP, MP4, WEBM, and MOV files are allowed" },
        { status: 400 }
      );
    }

    const maxSize = mediaType === "video" ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (media.size > maxSize) {
      return NextResponse.json(
        { success: false, error: mediaType === "video" ? "Video size exceeds 50MB limit" : "Photo size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const mediaUrl = await processMediaUpload(media);

    const response = await apiClient("/volunteers/gallery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        submitterName: validation.data.name,
        submitterEmail: validation.data.email,
        title: validation.data.title,
        caption: validation.data.caption,
        mediaType,
        imageUrl: mediaUrl,
        consent: validation.data.consent === "true",
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

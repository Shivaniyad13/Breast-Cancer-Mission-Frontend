import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";

// GET /api/volunteers/gallery?status=APPROVED
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status") || "APPROVED";
    const targetStatus = (statusParam === "APPROVED" || statusParam === "VERIFIED") ? "VERIFIED" : (statusParam as any);

    const submissions = await db.gallerySubmission.findMany({
      where: {
        status: targetStatus,
      },
      include: {
        volunteer: {
          select: {
            fullName: true,
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const data = submissions.map((sub) => ({
      id: sub.id,
      title: sub.title,
      imageUrl: sub.imageUrl,
      caption: sub.caption || "",
      fullName: sub.volunteer?.fullName || "Volunteer",
      city: sub.volunteer?.city || "",
      status: sub.status,
      createdAt: sub.createdAt,
    }));

    return NextResponse.json({ success: true, data }, { status: 200 });
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

// Helper to save uploaded image
async function processImageUpload(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 1. Try Cloudinary if configured
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const isCloudinaryConfigured =
    cloudName && apiKey && cloudName !== "demo" && apiKey !== "1234567890";

  if (isCloudinaryConfigured) {
    try {
      const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "volunteer_gallery",
            resource_type: "auto",
          },
          (error, result) => {
            if (error || !result) {
              return reject(error || new Error("Cloudinary upload failed"));
            }
            resolve({ secure_url: result.secure_url });
          }
        );
        uploadStream.end(buffer);
      });

      return uploadResult.secure_url;
    } catch (cloudinaryErr) {
      console.warn("Cloudinary upload failed, falling back to disk/data URL:", cloudinaryErr);
    }
  }

  // 2. Try writing to local disk (/public/uploads)
  // TODO: Configure S3 / Vercel Blob / Cloudinary for production persistence
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const fileExt = path.extname(file.name) || ".jpg";
    const filename = `${file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "_")}-${uniqueSuffix}${fileExt}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);
    return `/uploads/${filename}`;
  } catch (fsErr: any) {
    console.warn("Local disk write failed, falling back to Data URL:", fsErr?.message || fsErr);
    const base64Data = buffer.toString("base64");
    const mimeType = file.type || "image/png";
    return `data:${mimeType};base64,${base64Data}`;
  }
}

// POST /api/volunteers/gallery
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check for VERIFIED volunteer application
    const volunteer = await db.volunteerApplication.findFirst({
      where: {
        userId: session.user.id,
        status: "VERIFIED",
      },
    });

    if (!volunteer) {
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

    // Max 5MB validation
    const MAX_SIZE = 5 * 1024 * 1024;
    if (image.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Allowed mime types (jpg/png/webp)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (image.type && !allowedTypes.includes(image.type.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "Invalid image format. Only JPG, PNG, and WEBP are allowed" },
        { status: 400 }
      );
    }

    const imageUrl = await processImageUpload(image);

    const submission = await db.gallerySubmission.create({
      data: {
        volunteerId: volunteer.id,
        title: title.trim(),
        imageUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: submission,
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

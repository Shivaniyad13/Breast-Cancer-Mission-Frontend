import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Allowed formats and maximum size (100MB)
const ALLOWED_EXTENSIONS = [".mp4", ".mov", ".webm"];
const ALLOWED_MIME_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

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

    // 1. File Extension & Type Validation
    const fileName = file.name || "video.mp4";
    const ext = path.extname(fileName).toLowerCase();
    const fileType = file.type;

    const isExtensionValid = ALLOWED_EXTENSIONS.includes(ext);
    const isMimeTypeValid = ALLOWED_MIME_TYPES.includes(fileType) || fileType.startsWith("video/");

    if (!isExtensionValid && !isMimeTypeValid) {
      return NextResponse.json(
        { error: `Invalid file format (${ext || fileType}). Only MP4, MOV, and WEBM video formats are supported.` },
        { status: 400 }
      );
    }

    // 2. File Size Validation (Max 100MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        { error: `File size (${sizeMB} MB) exceeds the maximum limit of 100MB.` },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Cloudinary Upload Process
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const isConfigured = cloudName && apiKey && cloudName !== "demo" && apiKey !== "1234567890";

    if (isConfigured) {
      try {
        const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "video",
              folder: "success-stories",
              upload_preset: process.env.NEXT_PUBLIC_UPLOAD_PRESET || undefined,
            },
            (error, result) => {
              if (error || !result) {
                return reject(error || new Error("Failed to retrieve upload result from Cloudinary."));
              }
              resolve({ secure_url: result.secure_url });
            }
          );
          uploadStream.end(buffer);
        });

        return NextResponse.json({ url: uploadResult.secure_url }, { status: 200 });
      } catch (cloudinaryError: any) {
        console.warn("Cloudinary upload fallback triggered:", cloudinaryError?.message || cloudinaryError);
        // Fall back to local file storage if Cloudinary credentials are not reachable
      }
    }

    // Fallback: Save file to public/uploads/videos for local preview & testing
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "videos");
    await mkdir(uploadsDir, { recursive: true });

    const safeFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadsDir, safeFileName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/videos/${safeFileName}`;
    return NextResponse.json({ url: publicUrl }, { status: 200 });

  } catch (err: any) {
    console.error("Error handling video upload:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during video upload." },
      { status: 500 }
    );
  }
}

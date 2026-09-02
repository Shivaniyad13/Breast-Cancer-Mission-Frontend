import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Try Cloudinary if configured
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const isCloudinaryConfigured = cloudName && apiKey && cloudName !== "demo" && apiKey !== "1234567890";

    if (isCloudinaryConfigured) {
      try {
        const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "receipts",
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

        return NextResponse.json({ url: uploadResult.secure_url });
      } catch (cloudinaryErr) {
        console.warn("Cloudinary upload failed, falling back to disk/data URL:", cloudinaryErr);
      }
    }

    // 2. Try writing to local disk (for local development)
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
      const fileExt = path.extname(file.name) || ".jpg";
      const filename = `${file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "_")}-${uniqueSuffix}${fileExt}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);
      const fileUrl = `/uploads/${filename}`;

      return NextResponse.json({ url: fileUrl });
    } catch (fsErr: any) {
      console.warn("Local disk write failed (read-only filesystem on Vercel/mobile), falling back to Data URL:", fsErr?.message || fsErr);

      // 3. Fallback for read-only filesystems (Vercel / Serverless deployments)
      const base64Data = buffer.toString("base64");
      const mimeType = file.type || "image/png";
      const dataUrl = `data:${mimeType};base64,${base64Data}`;

      return NextResponse.json({ url: dataUrl });
    }
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}

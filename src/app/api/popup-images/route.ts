import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);

export async function GET() {
  try {
    // Path update kiya gaya hai: public/images/popup
    const popupDirectory = join(process.cwd(), "public", "images", "popup");
    const entries = await readdir(popupDirectory, { withFileTypes: true });

    const images = entries
      .filter(
        (entry) =>
          entry.isFile() &&
          imageExtensions.has(entry.name.slice(entry.name.lastIndexOf(".")).toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((entry) => ({
        // URL path update kiya gaya hai: /images/popup/
        src: `/images/popup/${encodeURIComponent(entry.name)}`,
        alt: entry.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
      }));

    return NextResponse.json(
      { images },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    // Console error message bhi update kiya gaya hai
    console.error("Failed to read public/images/popup images:", error);
    return NextResponse.json(
      { error: "Failed to load popup images" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
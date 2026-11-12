import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);

export async function GET() {
  try {
    const popupDirectory = join(process.cwd(), "public", "popup");
    const entries = await readdir(popupDirectory, { withFileTypes: true });
    const images = entries
      .filter(
        (entry) =>
          entry.isFile() &&
          imageExtensions.has(entry.name.slice(entry.name.lastIndexOf(".")).toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((entry) => ({
        src: `/popup/${encodeURIComponent(entry.name)}`,
        alt: entry.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
      }));

    return NextResponse.json(
      { images },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Failed to read public/popup images:", error);
    return NextResponse.json(
      { error: "Failed to load popup images" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

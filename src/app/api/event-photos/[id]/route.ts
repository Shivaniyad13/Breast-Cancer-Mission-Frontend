import { eventPhotoIds } from "@/lib/eventPhotos";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!eventPhotoIds.includes(id)) {
    return new Response("Event photo not found", { status: 404 });
  }

  const imageResponse = await fetch(
    `https://lh3.googleusercontent.com/d/${id}=w2048`,
    { cache: "force-cache" }
  );
  const contentType = imageResponse.headers.get("content-type");
  if (!imageResponse.ok || !contentType?.startsWith("image/")) {
    return new Response("Failed to fetch event photo", { status: 502 });
  }

  return new Response(imageResponse.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}

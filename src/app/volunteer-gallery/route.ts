import { POST as submitGallery } from "@/app/api/volunteers/gallery/route";

export async function POST(request: Request) {
  return submitGallery(request);
}

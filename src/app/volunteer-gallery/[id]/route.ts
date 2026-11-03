import { PATCH as updateGallery } from "@/app/api/volunteers/gallery/[id]/route";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return updateGallery(request, context);
}

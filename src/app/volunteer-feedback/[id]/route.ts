import {
  DELETE as deleteFeedback,
  PATCH as updateFeedback,
} from "@/app/api/volunteers/feedback/[id]/route";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return updateFeedback(request, context);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return deleteFeedback(request, context);
}

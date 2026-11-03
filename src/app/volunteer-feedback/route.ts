import { POST as submitFeedback } from "@/app/api/volunteers/feedback/route";

export async function POST(request: Request) {
  return submitFeedback(request);
}

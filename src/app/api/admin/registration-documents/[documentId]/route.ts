import { apiClient } from "@/lib/apiClient";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await params;
  const response = await apiClient(`/admin/registration-documents/${encodeURIComponent(documentId)}`);
  if (!response.ok || !response.body) {
    return new Response("Verification document unavailable", { status: response.status || 404 });
  }

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") || "application/octet-stream",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

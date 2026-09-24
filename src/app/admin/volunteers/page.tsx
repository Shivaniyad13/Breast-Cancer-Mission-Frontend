import { auth } from "@/auth";
import { apiClient } from "@/lib/apiClient";
import { redirect } from "next/navigation";
import { AdminNavTabs } from "@/components/admin/AdminNavTabs";
import VolunteersAdminClient from "./VolunteersAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminVolunteersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  let serializableApplications: any[] = [];
  let serializableFeedbacks: any[] = [];
  let serializableGallery: any[] = [];
  let serializableEvents: any[] = [];

  try {
    const res = await apiClient("/volunteers/admin/all");
    if (res.ok) {
      const body = await res.json();
      if (body.success && body.data) {
        serializableApplications = body.data.applications || [];
        serializableFeedbacks = body.data.feedbacks || [];
        serializableGallery = body.data.gallery || [];
        serializableEvents = body.data.events || [];
      }
    }
  } catch (error) {
    console.error("Error fetching admin volunteer data:", error);
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 space-y-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 text-sm">
            Manage volunteer applications, community stories, gallery media, and events.
          </p>
        </div>
        <AdminNavTabs />
      </div>

      <VolunteersAdminClient
        initialApplications={serializableApplications}
        initialFeedbacks={serializableFeedbacks}
        initialGallery={serializableGallery}
        initialEvents={serializableEvents}
      />
    </div>
  );
}

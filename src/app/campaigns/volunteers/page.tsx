import { Metadata } from "next";
import { auth } from "@/auth";
import { apiClient } from "@/lib/apiClient";
import VolunteersClient, {
  VolunteerSession,
  VolunteerFeedback,
  VolunteerStats,
  VolunteerEvent,
  GalleryItem,
} from "./VolunteersClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Become a Volunteer | Breast Cancer Awareness Mission",
  description:
    "Join our active volunteer network. Spreading breast cancer awareness, coordinating checkup camps, and supporting recovery group campaigns to save lives.",
};

export default async function VolunteersPage() {
  let initialSession: VolunteerSession = null;
  let initialFeedback: VolunteerFeedback[] = [];
  let initialStats: VolunteerStats = {
    volunteers: 0,
    campaigns: 0,
    events: 0,
    reached: 0,
  };
  let initialEvents: VolunteerEvent[] = [];
  let initialGallery: GalleryItem[] = [];

  try {
    const session = await auth();

    if (session?.user?.id) {
      const res = await apiClient(`/volunteers/session?userId=${session.user.id}`);
      if (res.ok) {
        const body = await res.json();
        if (body.success && body.data) {
          initialSession = body.data;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching initial session for VolunteersPage:", error);
  }

  try {
    const res = await apiClient("/volunteers/feedback?status=VERIFIED&limit=6");
    if (res.ok) {
      const body = await res.json();
      if (body.success && Array.isArray(body.data)) {
        initialFeedback = body.data;
      }
    }
  } catch (error) {
    console.error("Error fetching initial feedback for VolunteersPage:", error);
  }

  try {
    const res = await apiClient("/volunteers/stats");
    if (res.ok) {
      const body = await res.json();
      if (body.success && body.data) {
        initialStats = body.data;
      }
    }
  } catch (error) {
    console.error("Error fetching initial stats for VolunteersPage:", error);
  }

  try {
    const vIdParam = initialSession?.volunteerId ? `&volunteerId=${initialSession.volunteerId}` : "";
    const res = await apiClient(`/volunteers/events?isOpen=true${vIdParam}`);
    if (res.ok) {
      const body = await res.json();
      if (body.success && Array.isArray(body.data)) {
        initialEvents = body.data;
      }
    }
  } catch (error) {
    console.error("Error fetching initial events for VolunteersPage:", error);
  }

  try {
    const res = await apiClient("/volunteers/gallery?status=VERIFIED&limit=12");
    if (res.ok) {
      const body = await res.json();
      if (body.success && Array.isArray(body.data)) {
        initialGallery = body.data;
      }
    }
  } catch (error) {
    console.error("Error fetching initial gallery for VolunteersPage:", error);
  }

  return (
    <VolunteersClient
      initialSession={initialSession}
      initialFeedback={initialFeedback}
      initialStats={initialStats}
      initialEvents={initialEvents}
      initialGallery={initialGallery}
    />
  );
}

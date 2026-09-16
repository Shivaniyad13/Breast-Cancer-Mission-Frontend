import { Metadata } from "next";
import { auth } from "@/auth";
import { db } from "@/lib/db";
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

function getInitials(name: string) {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

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
      const userId = session.user.id;
      const role = (session.user.role as any) || "USER";

      const volunteer = await db.volunteerApplication.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      let certificateCode: string | null = null;
      if (
        volunteer &&
        (volunteer.status === "VERIFIED" || (volunteer.status as any) === "APPROVED")
      ) {
        const cert = await db.volunteerCertificate.findFirst({
          where: { volunteerId: volunteer.id },
        });
        certificateCode = cert?.certificateCode || null;
      }

      initialSession = {
        userId,
        role,
        volunteerStatus: volunteer ? volunteer.status : "NOT_APPLIED",
        volunteerId: volunteer?.id,
        certificateCode,
        fullName: volunteer?.fullName || session.user.name || "",
      };
    }
  } catch (error) {
    console.error("Error fetching initial session for VolunteersPage:", error);
  }

  try {
    const rawFeedback = await db.volunteerFeedback.findMany({
      where: { status: "VERIFIED" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        volunteer: {
          select: {
            fullName: true,
            city: true,
            interest: true,
          },
        },
      },
    });

    initialFeedback = rawFeedback.map((item) => ({
      id: item.id,
      name: item.volunteer?.fullName || "Anonymous Volunteer",
      interest: item.volunteer?.interest || "outreach",
      city: item.volunteer?.city || "",
      rating: item.rating,
      review: item.message,
      initials: getInitials(item.volunteer?.fullName || "Volunteer"),
    }));
  } catch (error) {
    console.error("Error fetching initial feedback for VolunteersPage:", error);
  }

  try {
    const [verifiedVolunteers, totalEvents, pastEvents, reachedAgg] = await Promise.all([
      db.volunteerApplication.count({ where: { status: "VERIFIED" } }),
      db.volunteerEvent.count(),
      db.volunteerEvent.count({ where: { eventDate: { lte: new Date() } } }),
      db.volunteerEvent.aggregate({ _sum: { peopleReached: true } }),
    ]);

    initialStats = {
      volunteers: verifiedVolunteers,
      campaigns: pastEvents,
      events: totalEvents,
      reached: reachedAgg._sum.peopleReached || 0,
    };
  } catch (error) {
    console.error("Error fetching initial stats for VolunteersPage:", error);
  }

  try {
    const events = await db.volunteerEvent.findMany({
      where: { isOpen: true, eventDate: { gte: new Date() } },
      orderBy: { eventDate: "asc" },
      take: 6,
      include: {
        applications: {
          select: { id: true, volunteerId: true },
        },
      },
    });

    initialEvents = events.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      location: e.location,
      eventDate: e.eventDate.toISOString(),
      slots: e.slots,
      filledSlots: e.applications.length,
      interestKey: e.interestKey,
      alreadyApplied: false,
    }));

    if (initialSession?.volunteerId) {
      const myApps = await db.volunteerEventApplication.findMany({
        where: { volunteerId: initialSession.volunteerId },
        select: { eventId: true },
      });
      const appliedSet = new Set(myApps.map((a) => a.eventId));
      initialEvents.forEach((e) => {
        e.alreadyApplied = appliedSet.has(e.id);
      });
    }
  } catch (error) {
    console.error("Error fetching initial events for VolunteersPage:", error);
  }

  try {
    const submissions = await db.gallerySubmission.findMany({
      where: { status: "VERIFIED" },
      orderBy: { createdAt: "desc" },
      take: 12,
      include: {
        volunteer: {
          select: { fullName: true },
        },
      },
    });

    initialGallery = submissions.map((s) => ({
      id: s.id,
      src: s.imageUrl,
      title: s.title,
      submittedBy: s.volunteer?.fullName || "Volunteer",
    }));
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





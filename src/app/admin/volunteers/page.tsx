import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminNavTabs } from "@/components/admin/AdminNavTabs";
import VolunteersAdminClient from "./VolunteersAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminVolunteersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [applications, feedbacks, gallerySubmissions, events] = await Promise.all([
    db.volunteerApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { email: true },
        },
      },
    }),
    db.volunteerFeedback.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        volunteer: {
          select: { fullName: true, city: true },
        },
      },
    }),
    db.gallerySubmission.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        volunteer: {
          select: { fullName: true },
        },
      },
    }),
    db.volunteerEvent.findMany({
      orderBy: { eventDate: "asc" },
      include: {
        applications: {
          where: { status: "VERIFIED" },
          select: { id: true },
        },
      },
    }),
  ]);

  const serializableApplications = applications.map((app) => ({
    id: app.id,
    fullName: app.fullName,
    email: app.user?.email || app.email,
    phone: app.phone,
    city: app.city,
    age: app.age,
    occupation: app.occupation,
    interest: app.interest,
    availability: app.availability,
    motivation: app.motivation,
    status: app.status,
    createdAt: app.createdAt.toISOString(),
  }));

  const serializableFeedbacks = feedbacks.map((fb) => ({
    id: fb.id,
    volunteerName: fb.volunteer?.fullName || "Anonymous",
    city: fb.volunteer?.city || "",
    rating: fb.rating,
    message: fb.message,
    status: fb.status,
    createdAt: fb.createdAt.toISOString(),
  }));

  const serializableGallery = gallerySubmissions.map((g) => ({
    id: g.id,
    title: g.title,
    imageUrl: g.imageUrl,
    submittedBy: g.volunteer?.fullName || "Volunteer",
    status: g.status,
    createdAt: g.createdAt.toISOString(),
  }));

  const serializableEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    location: e.location,
    eventDate: e.eventDate.toISOString(),
    slots: e.slots,
    filledSlots: e.applications ? e.applications.length : e.filledSlots,
    interestKey: e.interestKey,
    isOpen: e.isOpen,
  }));

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

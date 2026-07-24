import { auth } from "@/auth";
import { getWebinarById } from "@/app/actions/webinars";
import WebinarMeetingPlayer from "@/components/webinars/WebinarMeetingPlayer";
import { redirect, notFound } from "next/navigation";

export const revalidate = 0; // Dynamic rendering

interface JoinWebinarPageProps {
  params: Promise<{ id: string }>;
}

export default async function JoinWebinarPage({ params }: JoinWebinarPageProps) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;
  const webinar = await getWebinarById(id);

  if (!webinar) {
    notFound();
  }

  // Security: Check if user is registered
  const isRegistered = webinar.registrations.some((r) => r.userId === session.user.id);
  if (!isRegistered && session.user.role !== "ADMIN") {
    redirect(`/webinars/${id}`);
  }

  return (
    <WebinarMeetingPlayer
      webinarId={webinar.id}
      webinarTitle={webinar.title}
      speakerName={webinar.speakerName}
      meetingLink={webinar.meetingLink}
    />
  );
}

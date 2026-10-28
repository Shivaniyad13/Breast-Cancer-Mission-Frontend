import { auth } from "@/auth";
import { getWebinarById } from "@/app/actions/webinars";
import WebinarJoinWidget from "@/components/webinars/WebinarJoinWidget";
import { 
  Calendar, Clock, MapPin, Users, Award, ShieldCheck, 
  Globe, ChevronRight, HelpCircle, Info, Stethoscope
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getYouTubeVideoId } from "@/lib/youtube";
import { calculateWebinarDurationMinutes, formatDurationHumanReadable } from "@/lib/webinarPricing";
import { getWebinarLiveLinks } from "@/lib/webinarLiveLinks";
import WebinarLivePlatformLinks from "@/components/webinars/WebinarLivePlatformLinks";

export const revalidate = 0; // Dynamic rendering

interface WebinarDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function WebinarDetailsPage({ params }: WebinarDetailsPageProps) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const userId = session?.user?.id;

  const { id } = await params;
  const webinar = await getWebinarById(id);

  if (!webinar) {
    notFound();
  }

  const isRegistered = (webinar.registrations || []).some((r: any) => r.userId === userId);
  const registrationCount = webinar.registrations?.length || 0;
  const platformLiveLinks = getWebinarLiveLinks(webinar);
  const youtubeLiveLink = platformLiveLinks.find((link) => link.platform === "YouTube Live");
  const liveYoutubeVideoId = youtubeLiveLink ? getYouTubeVideoId(youtubeLiveLink.url) : null;
  const isLive = new Date() >= new Date(webinar.startTime)
    && new Date() <= new Date(webinar.endTime)
    && webinar.status === "PUBLISHED";

  // Format Dates
  const startDateTime = new Date(webinar.startTime);
  const endDateTime = new Date(webinar.endTime);
  const fullDateStr = new Date(webinar.date).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const startTimeStr = startDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTimeStr = endDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const duration = formatDurationHumanReadable(
    calculateWebinarDurationMinutes(startDateTime, endDateTime)
  );

  const faqs = Array.isArray(webinar.faqs) ? webinar.faqs : [];
  const learningOutcomesList = webinar.learningOutcomes
    ? webinar.learningOutcomes.split("\n").filter((outcome: string) => outcome.trim())
    : [];
  const agendaList = webinar.agenda
    ? webinar.agenda.split("\n").filter((item: string) => item.trim())
    : [];

  const isOffline = webinar.webinarMode.toLowerCase() === "offline" || webinar.webinarMode.toLowerCase() === "hybrid";

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/20 to-white py-10 text-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8 max-w-6xl">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
          <Link href="/webinars" className="hover:text-primary transition-colors">Webinars</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-700 line-clamp-1">{webinar.title}</span>
        </div>

        {/* Hero Section Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-pink-100/50 shadow-md bg-white h-64 md:h-80 flex items-center justify-center">
          {webinar.bannerImage ? (
            <img src={webinar.bannerImage} alt={webinar.title} className="object-contain h-full w-full" />
          ) : (
            <div className="text-center text-primary/30 flex flex-col items-center">
              <Award className="h-24 w-24 stroke-[1.1] mb-2 text-primary/45" />
              <span className="text-xs font-bold text-primary/60">Educational Platform</span>
            </div>
          )}

          {/* Banner Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent flex flex-col justify-end p-6 ">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex gap-2">
                <span className="bg-primary text-white text-[11px] font-bold px-2.5 py-1 rounded-full ">
                  {webinar.webinarMode}
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full ">
                  {webinar.category}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight font-heading">
                {webinar.title}
              </h1>
            </div>
          </div>
        </div>

        {isLive && platformLiveLinks.length > 0 && (
          <section className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-800">Watch Live Webinar</h2>
                <p className="mt-1 text-sm text-slate-600">{webinar.description}</p>
              </div>
              <WebinarLivePlatformLinks links={platformLiveLinks} />
            </div>
            {liveYoutubeVideoId && (
              <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-950">
                <iframe
                  src={`https://www.youtube.com/embed/${liveYoutubeVideoId}?autoplay=1&mute=1`}
                  title={`${webinar.title} live stream`}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </section>
        )}

        {/* Content Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Details (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview */}
            <div className="bg-white rounded-2xl border border-pink-50 p-6 shadow-sm space-y-4">
              <h2 className="font-heading text-lg font-bold text-slate-800 border-b border-pink-55/60 pb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" /> Seminar Overview
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-semibold">
                {webinar.description}
              </p>
              {webinar.fullContent && webinar.fullContent !== webinar.description && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                  {webinar.fullContent}
                </p>
              )}
            </div>

            {/* Doctor Profile Section */}
            <div className="bg-white rounded-2xl border border-pink-50 p-6 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between border-b border-pink-55/60 pb-3 gap-2">
                <h2 className="font-heading text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" /> Speaker Profile
                </h2>
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" /> Verified Person
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="h-28 w-28 rounded-2xl bg-pink-50 flex items-center justify-center font-bold text-primary overflow-hidden shrink-0 border-2 border-pink-100 shadow-sm mx-auto sm:mx-0">
                  {webinar.speakerImage ? (
                    <img src={webinar.speakerImage} alt={webinar.speakerName} className="object-contain h-full w-full" />
                  ) : (
                    <span className="text-3xl">{webinar.speakerName.charAt(0)}</span>
                  )}
                </div>

                <div className="space-y-4 flex-1 text-center sm:text-left">
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-400 ">Hosted by:</p>
                    <h3 className="text-xl font-bold text-slate-800">{webinar.speakerName}</h3>
                    {(webinar.speakerQualification || webinar.speakerSpecialization) && (
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-xs font-bold">
                        {webinar.speakerQualification && (
                          <span className="bg-pink-50 border border-pink-100 text-primary px-2.5 py-0.5 rounded-full">
                            {webinar.speakerQualification}
                          </span>
                        )}
                        {webinar.speakerSpecialization && (
                          <span className="bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full">
                            {webinar.speakerSpecialization}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {webinar.speakerHospital && (
                    <p className="text-xs font-semibold text-slate-600">{webinar.speakerHospital}</p>
                  )}

                  {webinar.speakerBio && (
                    <p className="text-xs text-slate-500 leading-relaxed italic bg-pink-50/20 rounded-2xl p-4 border border-pink-50/50">
                      {webinar.speakerBio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {learningOutcomesList.length > 0 && (
              <div className="bg-white rounded-2xl border border-pink-50 p-6 shadow-sm space-y-4">
                <h2 className="font-heading text-lg font-bold text-slate-800 border-b border-pink-55/60 pb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" /> Learning Outcomes
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 font-semibold">
                  {learningOutcomesList.map((outcome: string, i: number) => (
                    <li key={i} className="flex gap-2.5 items-start">
                      <span className="h-5 w-5 bg-pink-100 text-primary rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                        {i + 1}
                      </span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {agendaList.length > 0 && (
              <div className="bg-white rounded-2xl border border-pink-50 p-6 shadow-sm space-y-4">
                <h2 className="font-heading text-lg font-bold text-slate-800 border-b border-pink-55/60 pb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" /> Webinar Agenda
                </h2>
                <div className="relative border-l-2 border-pink-100 ml-3 pl-6 space-y-6 py-2 text-xs sm:text-sm">
                  {agendaList.map((item: string, i: number) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-primary border-4 border-white shadow-sm" />
                      <p className="font-semibold text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {webinar.eligibility && (
              <div className="bg-white rounded-2xl border border-pink-50 p-6 shadow-sm space-y-4">
                <h2 className="font-heading text-lg font-bold text-slate-800 border-b border-pink-55/60 pb-3 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Eligibility
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold whitespace-pre-line">
                  {webinar.eligibility}
                </p>
              </div>
            )}

            {faqs.length > 0 && (
              <div className="bg-white rounded-2xl border border-pink-50 p-6 shadow-sm space-y-4">
                <h2 className="font-heading text-lg font-bold text-slate-800 border-b border-pink-55/60 pb-3 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" /> Frequently Asked Questions
                </h2>
                <div className="space-y-4 text-xs sm:text-sm">
                  {faqs.map((faq: any, i: number) => (
                    <div key={i} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0 space-y-1.5">
                      <p className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="text-primary font-bold">Q.</span> {faq.q}
                      </p>
                      <p className="text-slate-500 leading-relaxed pl-4 font-semibold">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Widget (Right Column) */}
          <div className="space-y-6">
            
            {/* Join or Register Widget */}
            <WebinarJoinWidget
              webinarId={webinar.id}
              webinarTitle={webinar.title}
              platformLiveLinks={platformLiveLinks}
              startTimeStr={startDateTime.toISOString()}
              endTimeStr={endDateTime.toISOString()}
              isRegistered={isRegistered}
              isLoggedIn={isLoggedIn}
              currentUser={session?.user}
            />

            {/* Timing details Card */}
            <div className="bg-white rounded-2xl border border-pink-50 p-6 shadow-sm space-y-4 text-xs text-slate-600 font-semibold">
              <h3 className="font-heading text-sm font-bold text-slate-800 border-b border-pink-50 pb-2">Meeting Details</h3>
              
              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Date</span>
                  <span className="font-bold text-slate-800">{new Date(webinar.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Timing</span>
                  <span className="font-bold text-slate-800">{startTimeStr} - {endTimeStr}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Duration</span>
                  <span className="font-bold text-slate-800">{duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Language</span>
                  <span className="font-bold text-slate-800">{webinar.language || "English"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Platform</span>
                  <span className="font-bold text-slate-800">{webinar.meetingPlatform || "Zoom Meeting"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Seats Capacity</span>
                  <span className="font-bold text-slate-800">{webinar.maxSeats} slots</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Portal Registrations</span>
                  <span className="font-bold text-slate-800">{registrationCount} / {webinar.maxSeats}</span>
                </div>
              </div>
            </div>

            {/* Offline location check */}
            {isOffline && (
              <div className="bg-white rounded-2xl border border-pink-50 p-6 shadow-sm space-y-4">
                <h3 className="font-heading text-sm font-bold text-slate-800 border-b border-pink-50 pb-2">Offline Venue</h3>
                <div className="space-y-3 text-xs text-slate-600 font-semibold">
                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">{webinar.venue}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{webinar.city}, {webinar.state}, {webinar.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Organizer Info */}
            <div className="bg-white rounded-2xl border border-pink-50 p-6 shadow-sm space-y-2.5 text-[11px] text-slate-500 leading-relaxed font-bold">
              {webinar.organizerDetails && (
                <>
                  <h4 className="font-bold text-slate-700">Organizer Details</h4>
                  <p>{webinar.organizerDetails}</p>
                </>
              )}
              <p className="font-bold text-primary mt-1">Support Desk: admin@cmba.in</p>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}

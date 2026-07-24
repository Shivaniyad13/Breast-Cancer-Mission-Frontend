import { auth } from "@/auth";
import { getWebinarById } from "@/app/actions/webinars";
import WebinarJoinWidget from "@/components/webinars/WebinarJoinWidget";
import { 
  Calendar, Clock, MapPin, Users, Award, ShieldCheck, 
  Video, Globe, ChevronRight, HelpCircle, Info, Stethoscope, Landmark 
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

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

  const isRegistered = webinar.registrations.some((r) => r.userId === userId);
  const remainingSeats = Math.max(webinar.maxSeats - webinar.registrations.length, 0);

  // Format Dates
  const fullDateStr = new Date(webinar.date).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const startTimeStr = new Date(webinar.startTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTimeStr = new Date(webinar.endTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Default FAQs
  const defaultFaqs = [
    {
      q: "Who should attend this webinar?",
      a: "This webinar is open to anyone wishing to learn about breast cancer prevention, self-examinations, and clinical guidelines. It is especially beneficial for student volunteers and family caregivers.",
    },
    {
      q: "How do I claim my certificate?",
      a: "You must attend the live webinar meeting inside the platform for at least 80% of its total duration. Once completed, your certificate will automatically generate and appear in Dashboard -> My Certificates.",
    },
    {
      q: "What tools do I need for this webinar?",
      a: "An active internet connection and a laptop or smartphone. The meeting room is fully embedded in our platform, so you do not need to install external apps like Zoom or Teams.",
    },
    {
      q: "Is registration free?",
      a: "Yes, all breast cancer awareness seminars conducted by Breast Cancer Awareness Mission and Khushi Centre are completely free of charge to promote public health education.",
    },
  ];

  const faqs = (webinar.faqs as any[])?.length ? (webinar.faqs as any[]) : defaultFaqs;

  // Split Objectives / Learning outcomes text
  const learningOutcomesList = webinar.learningOutcomes
    ? webinar.learningOutcomes.split("\n").filter(Boolean)
    : webinar.objectives
      ? webinar.objectives.split("\n").filter(Boolean)
      : [
          "Understand the early signs and symptoms of breast cancer",
          "Learn proper step-by-step techniques for monthly self breast exams",
          "Recognize risk factors and available diagnostic channels",
          "Empower student volunteers to run local awareness drives",
        ];

  const agendaList = webinar.agenda
    ? webinar.agenda.split("\n").filter(Boolean)
    : [
        "00:00 - Introduction & Welcome note",
        "00:15 - Clinical guidelines by Lead Oncologist",
        "00:45 - Practical Demonstration: Self Examinations",
        "01:05 - Strategic NGO partnerships explanation",
        "01:20 - Open Q&A Session",
      ];

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
        <div className="relative rounded-3xl overflow-hidden border border-pink-100/50 shadow-md bg-gradient-to-r from-pink-100 to-rose-200 h-64 md:h-80 flex items-center justify-center">
          {webinar.bannerImage ? (
            <img src={webinar.bannerImage} alt={webinar.title} className="object-cover h-full w-full" />
          ) : (
            <div className="text-center text-primary/30 flex flex-col items-center">
              <Award className="h-24 w-24 stroke-[1.1] mb-2 animate-pulse text-primary/45" />
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary/60">Educational Platform</span>
            </div>
          )}

          {/* Banner Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent flex flex-col justify-end p-6 md:p-10">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex gap-2">
                <span className="bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {webinar.webinarMode}
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {webinar.category}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight font-heading">
                {webinar.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Content Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Details (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview */}
            <div className="bg-white rounded-3xl border border-pink-50 p-6 md:p-8 shadow-sm space-y-4">
              <h2 className="font-heading text-lg font-bold text-slate-800 border-b border-pink-55/60 pb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" /> Seminar Overview
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                {webinar.fullContent || webinar.description}
              </p>
            </div>

            {/* Doctor Profile Section */}
            <div className="bg-white rounded-3xl border border-pink-50 p-6 md:p-8 shadow-sm space-y-5">
              <h2 className="font-heading text-lg font-bold text-slate-800 border-b border-pink-55/60 pb-3 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" /> Instructing Doctor Profile
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="h-28 w-28 rounded-3xl bg-pink-50 flex items-center justify-center font-black text-primary overflow-hidden shrink-0 border-2 border-pink-100 shadow-sm mx-auto sm:mx-0">
                  {webinar.speakerImage ? (
                    <img src={webinar.speakerImage} alt={webinar.speakerName} className="object-cover h-full w-full" />
                  ) : (
                    <span className="text-3xl">{webinar.speakerName.charAt(0)}</span>
                  )}
                </div>

                <div className="space-y-4 flex-1 text-center sm:text-left">
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-black text-slate-800">{webinar.speakerName}</h3>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-xs font-bold">
                      <span className="bg-pink-50 border border-pink-100 text-primary px-2.5 py-0.5 rounded-full">
                        {webinar.speakerQualification || "MD / Oncologist"}
                      </span>
                      <span className="bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full">
                        {webinar.speakerSpecialization || "Oncology Specialist"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-slate-600">
                    <Landmark className="h-4 w-4 text-primary shrink-0" />
                    <span>{webinar.speakerHospital || "GRS Strategic Healthcare"}</span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed italic bg-pink-50/20 rounded-2xl p-4 border border-pink-50/50">
                    {webinar.speakerBio || "Oncologist dedicated to public health and early detection awareness campaigns."}
                  </p>
                </div>
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="bg-white rounded-3xl border border-pink-50 p-6 md:p-8 shadow-sm space-y-4">
              <h2 className="font-heading text-lg font-bold text-slate-800 border-b border-pink-55/60 pb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" /> Learning Outcomes
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 font-semibold">
                {learningOutcomesList.map((outcome, i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <span className="h-5 w-5 bg-pink-100 text-primary rounded-full flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-sm">
                      {i + 1}
                    </span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Agenda */}
            <div className="bg-white rounded-3xl border border-pink-50 p-6 md:p-8 shadow-sm space-y-4">
              <h2 className="font-heading text-lg font-bold text-slate-800 border-b border-pink-55/60 pb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Webinar Agenda
              </h2>
              <div className="relative border-l-2 border-pink-100 ml-3 pl-6 space-y-6 py-2 text-xs sm:text-sm">
                {agendaList.map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-primary border-4 border-white shadow-sm" />
                    <p className="font-semibold text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div className="bg-white rounded-3xl border border-pink-50 p-6 md:p-8 shadow-sm space-y-4">
              <h2 className="font-heading text-lg font-bold text-slate-800 border-b border-pink-55/60 pb-3 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Eligibility
              </h2>
              <p className="text-xs sm:text-sm text-slate-655 leading-relaxed font-semibold">
                {webinar.eligibility || "This educational webinar is open to anyone wishing to learn about breast cancer prevention, physical self-examinations, and clinical checkup guidelines. It is highly recommended for student volunteers, public caregivers, and healthcare workers."}
              </p>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-3xl border border-pink-50 p-6 md:p-8 shadow-sm space-y-4">
              <h2 className="font-heading text-lg font-bold text-slate-800 border-b border-pink-55/60 pb-3 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" /> Frequently Asked Questions
              </h2>
              <div className="space-y-4 text-xs sm:text-sm">
                {faqs.map((faq, i) => (
                  <div key={i} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0 space-y-1.5">
                    <p className="font-bold text-slate-850 flex items-center gap-2">
                      <span className="text-primary font-black">Q.</span> {faq.q}
                    </p>
                    <p className="text-slate-550 leading-relaxed pl-4 font-semibold">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Widget (Right Column) */}
          <div className="space-y-6">
            
            {/* Join or Register Widget */}
            <WebinarJoinWidget
              webinarId={webinar.id}
              webinarTitle={webinar.title}
              startTimeStr={webinar.startTime.toISOString()}
              endTimeStr={webinar.endTime.toISOString()}
              isRegistered={isRegistered}
              isLoggedIn={isLoggedIn}
              currentUser={session?.user}
            />

            {/* Timing details Card */}
            <div className="bg-white rounded-3xl border border-pink-50 p-6 shadow-sm space-y-4 text-xs text-slate-600 font-semibold">
              <h3 className="font-heading text-sm font-bold text-slate-800 border-b border-pink-50 pb-2">Meeting Details</h3>
              
              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Date</span>
                  <span className="font-bold text-slate-800">{new Date(webinar.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Timing</span>
                  <span className="font-bold text-slate-850">{startTimeStr} - {endTimeStr}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Duration</span>
                  <span className="font-bold text-slate-805">
                    {Math.max((webinar.endTime.getTime() - webinar.startTime.getTime()) / 60000, 30)} Minutes
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Language</span>
                  <span className="font-bold text-slate-805">{webinar.language || "English"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Platform</span>
                  <span className="font-bold text-slate-805">{webinar.meetingPlatform || "Zoom Meeting"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Seats Capacity</span>
                  <span className="font-bold text-slate-805">{webinar.maxSeats} slots</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Seats Left</span>
                  <span className="font-bold text-slate-805">{remainingSeats} remaining</span>
                </div>
              </div>
            </div>

            {/* Offline location check */}
            {isOffline && (
              <div className="bg-white rounded-3xl border border-pink-50 p-6 shadow-sm space-y-4">
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
            <div className="bg-white rounded-3xl border border-pink-50 p-6 shadow-sm space-y-2.5 text-[10px] text-slate-450 leading-relaxed font-bold">
              <h4 className="font-bold uppercase tracking-wider text-slate-700">Organizer Details</h4>
              <p>
                {webinar.organizerDetails || "This session is conducted by Breast Cancer Campaign System and the Khushi Centre for Rehabilitation & Research."}
              </p>
              <p className="font-bold text-primary mt-1">Support Desk: webinars@grsawareness.org</p>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}

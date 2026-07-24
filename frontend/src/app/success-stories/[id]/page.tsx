import Link from "next/link";
import { notFound } from "next/navigation";
import { getSuccessStoryById } from "@/app/actions/successStories";
import { 
  ArrowLeft, 
  MapPin, 
  Hospital, 
  Calendar, 
  Heart, 
  Quote,
  ShieldCheck,
  Award,
  Sparkles,
  FileImage
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessStoryPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0; // Dynamic server page

export default async function SuccessStoryDetailPage({ params }: SuccessStoryPageProps) {
  const { id } = await params;
  const result = await getSuccessStoryById(id);

  if (!result.success || !result.story) {
    notFound();
  }

  const story = result.story;
  const paragraphs = story.completeStory.split("\n\n").filter(Boolean);

  // Recovery Timeline Builder - Parse or generate standard milestone sequences
  const timelineMilestones = [
    {
      title: "First Screening & Self-Check",
      description: "Self-examination led to detecting physical anomalies, highlighting the importance of regular screening awareness.",
      icon: <ShieldCheck className="h-5 w-5 text-pink-600" />,
      color: "bg-pink-100 border-pink-300 text-pink-600"
    },
    {
      title: "Clinical Diagnosis & Hospital Intake",
      description: `Officially diagnosed at ${story.treatmentHospital || "associate healthcare center"}. Oncology consultation established custom medical action steps.`,
      icon: <Hospital className="h-5 w-5 text-purple-600" />,
      color: "bg-purple-100 border-purple-300 text-purple-600"
    },
    {
      title: "Active Oncological Therapy Cycle",
      description: "Completed surgical, chemotherapy, or targeted radiation regimens as prescribed by lead physicians.",
      icon: <Heart className="h-5 w-5 text-rose-600" />,
      color: "bg-rose-100 border-rose-300 text-rose-600"
    },
    {
      title: "Full Recovery & Advocacy Launch",
      description: "Declared in remission. Commenced health lecturing, mentoring other cancer patients, and volunteering for awareness campaigns.",
      icon: <Award className="h-5 w-5 text-emerald-600" />,
      color: "bg-emerald-100 border-emerald-300 text-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Navigation header */}
        <div className="flex justify-between items-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home Page
          </Link>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Verified Story
          </span>
        </div>

        {/* Hero Header Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-pink-600 to-purple-700 rounded-3xl text-white shadow-xl p-8 md:p-12">
          {/* Background circles */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/15 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-6">
            <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur rounded-full text-xs font-black uppercase tracking-wider">
              {story.roleType === "Patient" ? "Survivor Journey" : "Family Member Testimony"}
            </span>

            <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {story.storyTitle}
            </h1>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-pink-100 pt-2 border-t border-white/20">
              <span className="font-bold">{story.fullName}</span>
              {story.age && (
                <>
                  <span>•</span>
                  <span>Age {story.age}</span>
                </>
              )}
              <span>•</span>
              <span className="inline-flex items-center gap-0.5">
                <MapPin className="h-4 w-4" /> {story.city}, {story.state}
              </span>
              {story.treatmentHospital && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-0.5">
                    <Hospital className="h-4 w-4" /> {story.treatmentHospital}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Full Journey & Media (8 Cols) */}
          <div className="lg:col-span-8 space-y-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm">
            
            {/* Quote box */}
            {paragraphs[0] && (
              <div className="relative pl-10 pr-4 py-2 border-l-4 border-pink-500 bg-pink-50/20 dark:bg-pink-950/10 rounded-r-2xl">
                <Quote className="absolute left-3 top-2 h-6 w-6 text-pink-400 opacity-60 rotate-180" />
                <p className="text-lg italic font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                  "{paragraphs[0]}"
                </p>
              </div>
            )}

            {/* Complete Story text blocks */}
            <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-base font-normal">
              <h2 className="font-heading text-2xl font-bold text-slate-800 dark:text-slate-100">
                The Complete Journey
              </h2>
              {paragraphs.slice(1).map((para, idx) => (
                <p key={idx} className="whitespace-pre-wrap">
                  {para}
                </p>
              ))}
            </div>

            {/* Video Player */}
            {story.videoUrl && (
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="font-heading text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <VideoIcon className="h-5 w-5 text-pink-600" /> Video Testimonial
                </h3>
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
                  <video 
                    src={story.videoUrl} 
                    controls 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Image Gallery */}
            {story.imageUrls.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="font-heading text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <FileImage className="h-5 w-5 text-pink-600" /> Shared Journey Media
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {story.imageUrls.map((url, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner group">
                      <img 
                        src={url} 
                        alt={`${story.fullName} journey media`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>

          {/* Right Column: Recovery Timeline (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
              <h3 className="font-heading text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-6">
                <Calendar className="h-5 w-5 text-pink-600" /> Timeline of Recovery
              </h3>

              <div className="relative pl-4 space-y-8 border-l border-slate-200 dark:border-slate-800 ml-3">
                {timelineMilestones.map((milestone, idx) => (
                  <div key={idx} className="relative">
                    
                    {/* Circle Node */}
                    <div className={`absolute -left-7 top-0 h-6 w-6 rounded-full border-2 flex items-center justify-center ${milestone.color} shadow-sm`}>
                      {milestone.icon}
                    </div>

                    <div className="space-y-1.5 pl-2">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-none">
                        {milestone.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Callout */}
            <div className="bg-pink-50/50 dark:bg-pink-950/10 border border-pink-100 dark:border-pink-950/60 p-6 rounded-3xl space-y-4">
              <h4 className="font-bold text-sm text-pink-800 dark:text-pink-400">Need support or want to make a difference?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                If you or a loved one is currently navigating breast cancer, we provide verified fundraising tools, connection with registered NGOs, and oncology checkups.
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/campaigns">
                  <Button size="sm" className="w-full bg-pink-600 hover:bg-pink-700 text-white text-xs">
                    Explore Support Campaigns
                  </Button>
                </Link>
                <Link href="/success-stories/share">
                  <Button size="sm" variant="outline" className="w-full border-pink-200 text-pink-700 dark:border-pink-900 dark:text-pink-400 text-xs">
                    Share Your Journey
                  </Button>
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

// Inline replacement for video icon
function VideoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  );
}

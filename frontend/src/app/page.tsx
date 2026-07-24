import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getApprovedSuccessStories } from "@/app/actions/successStories";
import { getSponsorBanners, getCelebrityTestimonials } from "@/app/actions/rightSidebarWidgets";
import { getLiveUpdates } from "@/app/actions/liveUpdates";
import HeroLeftSidebar, { LiveUpdatesWidget, StoryPlayerWidget } from "@/components/layout/HeroLeftSidebar";
import HeroRightSidebar from "@/components/layout/HeroRightSidebar";
import AwarenessCarousel from "@/components/layout/AwarenessCarousel";
import {
  Ribbon,
  ShieldCheck,
  Award,
  Heart,
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
  Radio
} from "lucide-react";

export const revalidate = 0; // Dynamic server component

export default async function Home() {
  // Fetch approved success stories (will seed database automatically if empty)
  const storiesResult = await getApprovedSuccessStories();
  const stories = storiesResult.success && storiesResult.stories ? storiesResult.stories : [];

  // Fetch right sidebar sponsor banners and celebrity testimonials
  const bannersRes = await getSponsorBanners(true);
  const testimonialsRes = await getCelebrityTestimonials(true);

  const banners = bannersRes.success && bannersRes.banners ? bannersRes.banners : [];
  const testimonials = testimonialsRes.success && testimonialsRes.testimonials ? testimonialsRes.testimonials : [];

  // Fetch live updates for left sidebar bottom
  const liveUpdatesRes = await getLiveUpdates(true);
  const liveUpdates = liveUpdatesRes.success && liveUpdatesRes.updates ? liveUpdatesRes.updates : [];

  return (
    <div className="flex flex-col w-full min-h-screen">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 md:py-32 min-h-[90vh] flex items-center justify-center">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* <source src="/cancer video.webm" type="video/mp4" /> */}
          Your browser does not support the video tag.
        </video>

        {/* Pink Dark Overlay */}
        <div className="absolute inset-0 bg-black/45"></div>

        {/* Pink Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/20 via-pink-800/10 to-background/90"></div>

        {/* Hero Content Grid (Left Sidebar, Centered Content, Right Sidebar) */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-10">
          <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-8 items-center w-full">

            {/* LEFT FLOATING SIDEBAR (Desktop/Tablet) */}
            <div className="hidden md:block md:col-span-3">
              <HeroLeftSidebar stories={stories as any} updates={liveUpdates as any} />
            </div>

            {/* CENTER HERO CONTENT (Perfectly centered on all views) */}
            <div className="col-span-12 md:col-span-6 text-center space-y-6 max-w-xl mx-auto flex flex-col justify-center items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 backdrop-blur-md border border-pink-300/20 text-pink-100 text-xs font-semibold tracking-wider uppercase">
                <Ribbon className="h-4 w-4" />
                Breast Cancer Awareness Mission
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Connecting Communities for <br className="hidden sm:inline" />
                <span className="text-pink-300">
                  Breast Cancer Mission
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-md">
                A trusted unified healthcare portal. Spreading early physical diagnosis
                knowledge, hosting expert webinars, and coordinating verified
                crowdfunding support for patients.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2 w-full max-w-sm">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white shadow-xl cursor-pointer"
                  >
                    Join Campaign
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/campaigns" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white text-white bg-white/10 backdrop-blur-md hover:bg-white/20 cursor-pointer"
                  >
                    Support Patients
                  </Button>
                </Link>
              </div>
            </div>

            {/* RIGHT FLOATING SIDEBAR (Desktop/Tablet) */}
            <div className="hidden md:block md:col-span-3">
              <HeroRightSidebar banners={banners as any} testimonials={testimonials as any} />
            </div>

          </div>
        </div>
      </section>

      {/* MOBILE-ONLY PANELS SLIDER CONTAINER */}
      <div className="block md:hidden px-4 py-8 bg-slate-50 dark:bg-slate-950/40 space-y-8 border-b border-slate-100 dark:border-slate-900">

        {/* Mobile Left Sidebar - Stories */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-pink-600 uppercase tracking-widest px-1 flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 fill-pink-600 text-pink-600" /> Patient Success Stories
          </h3>
          <div className="flex overflow-x-auto pb-2 gap-4 snap-x snap-mandatory scroll-smooth no-scrollbar">
            <div className="w-[85vw] flex-shrink-0 snap-center">
              <StoryPlayerWidget stories={stories as any} />
            </div>
          </div>
        </div>

        {/* Mobile Left Sidebar - Live Updates */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-pink-600 uppercase tracking-widest px-1 flex items-center gap-1">
            <Radio className="h-3.5 w-3.5 text-pink-600" /> Live Updates Hub
          </h3>
          <div className="flex overflow-x-auto pb-2 gap-4 snap-x snap-mandatory scroll-smooth no-scrollbar">
            <div className="w-[85vw] flex-shrink-0 snap-center">
              <LiveUpdatesWidget updates={liveUpdates as any} />
            </div>
          </div>
        </div>

        {/* Mobile Right Sidebar Widgets */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-pink-600 uppercase tracking-widest px-1 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-pink-600" /> Highlights & Testimonials
          </h3>
          <div className="flex overflow-x-auto pb-2 gap-4 snap-x snap-mandatory scroll-smooth no-scrollbar">
            <div className="w-[85vw] flex-shrink-0 snap-center">
              <HeroRightSidebar banners={banners as any} testimonials={testimonials as any} />
            </div>
          </div>
        </div>
      </div>

      {/* SHARE YOUR SUCCESS STORY CTA SECTION */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl shadow-xl text-white py-10 px-8 sm:px-12">
            {/* Glow circles */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-white/15 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-bold uppercase tracking-wider">
                  Share Your Success Story
                </span>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight">
                  Has Cancer Awareness Touched Your Life?
                </h2>
                <p className="text-pink-100 max-w-xl text-xs md:text-sm leading-relaxed">
                  Every battle fought is a reminder of hope. Whether you are a survivor or a supportive family member, sharing your journey of recovery can inspire thousands of others to detect early and seek timely medical care.
                </p>
              </div>

              <Link href="/success-stories/share" className="flex-shrink-0 w-full md:w-auto">
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-white hover:bg-slate-100 text-pink-700 font-extrabold shadow-lg hover:shadow-xl active:scale-95 transition-all text-sm px-8 h-12 rounded-xl cursor-pointer"
                >
                  Share Your Story
                  <Heart className="ml-2 h-4 w-4 fill-pink-600 text-pink-600 animate-pulse" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Module Overview cards */}
      <section className="py-20 sm:py-28 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            A Unified Platform For Awareness & Care
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Bringing together patients, medical experts, verified NGOs, and volunteer networks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 flex flex-col space-y-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Awareness Hub</h3>
            <p className="text-sm text-muted-foreground flex-1">
              Access early detection physical test timers, interactive quizzes, and verified medical blogs written by licensed oncologists.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 flex flex-col space-y-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">FundLife Crowdfunding</h3>
            <p className="text-sm text-muted-foreground flex-1">
              Launch fundraising campaigns for cancer treatments. Contributions flow directly to hospital bank accounts to prevent fraud.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 flex flex-col space-y-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">NGO & Doctor Connect</h3>
            <p className="text-sm text-muted-foreground flex-1">
              Every campaign undergoes direct document reviews by registered NGOs, ensuring transparent fundraising channels.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 flex flex-col space-y-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">QR Certifications</h3>
            <p className="text-sm text-muted-foreground flex-1">
              Receive cryptographically signed PDF certificates upon quiz completions and webinar attendance with instant QR verification.
            </p>
          </div>
        </div>
      </section>

      {/* Partner Organizations Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 to-blue-50/40 dark:from-slate-900 dark:to-slate-800/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 text-xs font-semibold uppercase tracking-widest">
              Backed By
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Our Partner Organizations
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Proudly supported by leading corporations committed to social responsibility and healthcare excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Card – GRS India Corporation */}
            <div className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 h-40 px-6 py-5 border-b border-slate-100 dark:border-slate-700">
                <img
                  src="/grs-group-logo.jpg"
                  alt="GRS India Corporation Logo"
                  className="max-h-24 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col flex-1 p-5 space-y-2">
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-800 dark:text-slate-100">
                  GRS India Group.
                </h3>
                <a
                  href="https://grsindiacorporation.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors mt-2"
                >
                  Visit website <span aria-hidden>→</span>
                </a>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>

            {/* Card – Khushi Centre */}
            <div className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 h-40 px-6 py-5 border-b border-slate-100 dark:border-slate-700">
                <img
                  src="/khushi-logo.jpg"
                  alt="Khushi Centre for Rehabilitation & Research Logo"
                  className="max-h-24 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col flex-1 p-5 space-y-2">
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-800 dark:text-slate-100">
                  Khushi Centre for Rehabilitation &amp; Research
                </h3>
                <a
                  href="https://khushicentre.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors mt-2"
                >
                  Visit website <span aria-hidden>→</span>
                </a>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          </div>
        </div>
      </section>

      {/* Slideshow/Carousel Section */}
      <AwarenessCarousel />

    </div>
  );
}

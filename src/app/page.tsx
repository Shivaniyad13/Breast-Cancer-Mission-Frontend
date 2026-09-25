import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getApprovedSuccessStories } from "@/app/actions/successStories";
import {
  getSponsorBanners,
  getCelebrityTestimonials,
} from "@/app/actions/rightSidebarWidgets";
import { getLiveUpdates } from "@/app/actions/liveUpdates";
import {
  LiveUpdatesWidget,
  StoryPlayerWidget,
} from "@/components/layout/HeroLeftSidebar";
import LiveBreastCancerUpdatesFeed from "@/components/layout/LiveBreastCancerUpdatesFeed";
import CelebrityTestimonials from "@/components/layout/CelebrityTestimonials";
import OurTeam from "@/components/layout/OurTeam";
import TrustedPartnersCarousel from "@/components/layout/TrustedPartnersCarousel";
import ApocanTeaser from "@/components/apocan-teaser";
import ApocanPopup from "@/components/apocan-popup";
import {
  Ribbon,
  ShieldCheck,
  Award,
  Heart,
  ArrowRight,
  BookOpen,
  Radio,
} from "lucide-react";

export const revalidate = 0;

export default async function Home() {
  const storiesResult = await getApprovedSuccessStories();
  const stories =
    storiesResult.success && storiesResult.stories ? storiesResult.stories : [];

  const bannersRes = await getSponsorBanners(true);
  const testimonialsRes = await getCelebrityTestimonials(true);

  const banners =
    bannersRes.success && bannersRes.banners ? bannersRes.banners : [];
  const testimonials =
    testimonialsRes.success && testimonialsRes.testimonials
      ? testimonialsRes.testimonials
      : [];

  const liveUpdatesRes = await getLiveUpdates(true);
  const liveUpdates =
    liveUpdatesRes.success && liveUpdatesRes.updates
      ? liveUpdatesRes.updates
      : [];

  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden">
      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden pt-2 sm:pt-4 md:pt-6 lg:pt-8 pb-12 sm:pb-16 md:pb-24 lg:pb-32 min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center">
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

        <div className="absolute inset-0 bg-black/45"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/20 via-pink-800/10 to-background/90"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center w-full">
            {/* LEFT — LIVE UPDATES FEED */}
            <div className="hidden md:block md:col-span-3">
              <LiveBreastCancerUpdatesFeed updates={liveUpdates as any} />
            </div>

            {/* CENTER — HERO CONTENT */}
            <div className="col-span-12 md:col-span-6 text-center space-y-5 sm:space-y-6 max-w-xl mx-auto flex flex-col justify-center items-center px-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 backdrop-blur-md border border-pink-300/20 text-pink-100 text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
                <Ribbon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Cancer Mukt Bharat Abhiyan</span>
              </div>

              <h1 className="font-heading text-[26px] leading-[1.15] sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Break the Silence, Beat the Cancer:{" "}
                <span className="text-pink-300 block sm:inline">
                  A Cancer Mukt Bharat.
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-md px-2">
                A trusted unified healthcare portal. Spreading early physical
                diagnosis knowledge, hosting expert webinars, and coordinating
                verified crowdfunding support for patients.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2 w-full max-w-sm mx-auto px-2">
                <Link href="/webinars" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white shadow-xl cursor-pointer text-sm sm:text-base"
                  >
                    Join Webinar
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>

                <Link href="/donate" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white text-white bg-white/10 backdrop-blur-md hover:bg-white/20 cursor-pointer text-sm sm:text-base"
                  >
                    Support Patients
                  </Button>
                </Link>
              </div>
            </div>

            {/* RIGHT — CELEBRITY TESTIMONIALS */}
            <div className="hidden md:block md:col-span-3">
              <CelebrityTestimonials testimonials={testimonials as any} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ MOBILE-ONLY PANELS ============ */}
      <div className="block md:hidden px-4 py-8 bg-pink-50/50 space-y-8 border-b border-pink-100">
        <div className="space-y-3">
          <h3 className="text-xs font-black text-pink-600 uppercase tracking-widest px-1 flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-pink-600 shrink-0" />
            <span>Live Breast Cancer Updates</span>
          </h3>
          <div className="w-full">
            <LiveBreastCancerUpdatesFeed updates={liveUpdates as any} />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-black text-pink-600 uppercase tracking-widest px-1 flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-pink-600 shrink-0" />
            <span>Celebrity Testimonials</span>
          </h3>
          <div className="w-full">
            <CelebrityTestimonials testimonials={testimonials as any} />
          </div>
        </div>
      </div>

      {/* ============ APOCAN TEASER ============ */}
      <ApocanTeaser />

      {/* ============ SHARE SUCCESS STORY CTA ============ */}
      <section className="py-10 sm:py-12 bg-white border-b border-pink-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 rounded-2xl sm:rounded-3xl shadow-xl text-white py-8 sm:py-10 px-5 sm:px-8 md:px-12">
            <div className="absolute -top-32 -left-32 w-72 h-72 sm:w-80 sm:h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-72 h-72 sm:w-80 sm:h-80 bg-white/15 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-4 text-center md:text-left">
                <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  Share Your Success Story
                </span>
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                  Has Cancer Awareness Touched Your Life?
                </h2>
                <p className="text-pink-100 max-w-xl text-xs sm:text-sm leading-relaxed">
                  Every battle fought is a reminder of hope. Whether you are a
                  survivor or a supportive family member, sharing your journey
                  of recovery can inspire thousands of others to detect early
                  and seek timely medical care.
                </p>
              </div>

              <Link
                href="/success-stories/share"
                className="flex-shrink-0 w-full md:w-auto"
              >
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-white hover:bg-pink-50 text-pink-700 font-extrabold shadow-lg hover:shadow-xl active:scale-95 transition-all text-sm px-6 sm:px-8 h-11 sm:h-12 rounded-xl cursor-pointer"
                >
                  Share Your Story
                  <Heart className="ml-2 h-4 w-4 fill-pink-600 text-pink-600 animate-pulse" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MODULE OVERVIEW CARDS ============ */}
      <section className="py-14 sm:py-20 md:py-28 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 px-2 leading-tight">
            A Unified Platform For Awareness &amp; Care
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base px-2">
            Bringing together patients, medical experts, verified NGOs, and
            volunteer networks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          <div className="p-5 sm:p-6 rounded-2xl border border-pink-100 bg-white shadow-sm hover:shadow-md hover:border-pink-200 transition-all duration-300 flex flex-col space-y-3 sm:space-y-4">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Awareness Hub
            </h3>
            <p className="text-sm text-slate-600 flex-1 leading-relaxed">
              Access early detection physical test timers, interactive quizzes,
              and verified medical blogs written by licensed oncologists.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl border border-pink-100 bg-white shadow-sm hover:shadow-md hover:border-pink-200 transition-all duration-300 flex flex-col space-y-3 sm:space-y-4">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              FundLife Crowdfunding
            </h3>
            <p className="text-sm text-slate-600 flex-1 leading-relaxed">
              Launch fundraising campaigns for cancer treatments. Contributions
              flow directly to hospital bank accounts to prevent fraud.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl border border-pink-100 bg-white shadow-sm hover:shadow-md hover:border-pink-200 transition-all duration-300 flex flex-col space-y-3 sm:space-y-4">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              NGO &amp; Doctor Connect
            </h3>
            <p className="text-sm text-slate-600 flex-1 leading-relaxed">
              Every campaign undergoes direct document reviews by registered
              NGOs, ensuring transparent fundraising channels.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl border border-pink-100 bg-white shadow-sm hover:shadow-md hover:border-pink-200 transition-all duration-300 flex flex-col space-y-3 sm:space-y-4">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
              <Award className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              QR Certifications
            </h3>
            <p className="text-sm text-slate-600 flex-1 leading-relaxed">
              Receive cryptographically signed PDF certificates upon quiz
              completions and webinar attendance with instant QR verification.
            </p>
          </div>
        </div>
      </section>

      {/* ============ OUR TEAM ============ */}
      <OurTeam />

      {/* ============ PARTNER ORGANIZATIONS ============ */}
      <section className="py-14 sm:py-20 md:py-28 bg-gradient-to-b from-pink-50/40 via-white to-pink-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 px-2 leading-tight">
              Our Partner Organizations
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 max-w-6xl mx-auto">
            <div className="group bg-white rounded-xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg hover:border-pink-300 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
              <div className="h-28 sm:h-32 flex items-center justify-center bg-pink-50/30 border-b border-pink-100 p-4">
                <img
                  src="/images/grs-group-logo.jpeg"
                  alt="GRS India Private Limited"
                  className="max-h-16 sm:max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col flex-1 p-3 sm:p-4 text-center items-center">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 leading-snug">
                  GRS India Private Limited
                </h3>
                <a
                  href="https://www.grsgroup.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-2 inline-flex items-center text-pink-600 font-semibold hover:text-pink-700 text-xs sm:text-sm"
                >
                  Visit Website →
                </a>
              </div>
            </div>

            <div className="group bg-white rounded-xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg hover:border-pink-300 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
              <div className="h-28 sm:h-32 flex items-center justify-center bg-pink-50/30 border-b border-pink-100 p-4">
                <img
                  src="/images/mission bharat.jpeg"
                  alt="Mission Bharat"
                  className="max-h-16 sm:max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col flex-1 p-3 sm:p-4 text-center items-center">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 leading-snug">
                  Mission Bharat
                </h3>
                <a
                  href="https://missionbharat.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-2 inline-flex items-center text-pink-600 font-semibold hover:text-pink-700 text-xs sm:text-sm"
                >
                  Visit Website →
                </a>
              </div>
            </div>

            <div className="group bg-white rounded-xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg hover:border-pink-300 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
              <div className="h-28 sm:h-32 flex items-center justify-center bg-pink-50/30 border-b border-pink-100 p-4">
                <img
                  src="/images/khushi-logo.jpg"
                  alt="Khushi Centre"
                  className="max-h-16 sm:max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col flex-1 p-3 sm:p-4 text-center items-center">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 leading-snug">
                  Khushi Centre for Rehabilitation &amp; Research
                </h3>
                <a
                  href="https://khushicentre.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-2 inline-flex items-center text-pink-600 font-semibold hover:text-pink-700 text-xs sm:text-sm"
                >
                  Visit Website →
                </a>
              </div>
            </div>

            <div className="group bg-white rounded-xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg hover:border-pink-300 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
              <div className="h-28 sm:h-32 flex items-center justify-center bg-pink-50/30 border-b border-pink-100 p-4">
                <img
                  src="/images/corporation.jpeg"
                  alt="GRS India Corporation"
                  className="max-h-16 sm:max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col flex-1 p-3 sm:p-4 text-center items-center">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 leading-snug">
                  GRS India Corporation
                </h3>
                <a
                  href="https://grsindiacorporation.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-2 inline-flex items-center text-pink-600 font-semibold hover:text-pink-700 text-xs sm:text-sm"
                >
                  Visit Website →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUSTED PARTNERS CAROUSEL ============ */}
      <TrustedPartnersCarousel />

      {/* ============ POPUP ============ */}
      <ApocanPopup />
    </div>
  );
}
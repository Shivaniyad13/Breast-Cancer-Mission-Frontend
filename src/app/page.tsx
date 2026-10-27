import Link from "next/link";
import { Button } from "@/components/ui/button";
import HomeBanner from "@/components/layout/HomeBanner";
import LiveBreastCancerUpdatesFeed from "@/components/layout/LiveBreastCancerUpdatesFeed";
import CelebrityTestimonials from "@/components/layout/CelebrityTestimonials";
import OurTeam from "@/components/layout/OurTeam";
import TrustedPartnersCarousel from "@/components/layout/TrustedPartnersCarousel";
import SurvivorStoryCardSection from "@/components/layout/SurvivorStoryCardSection";
import {
  Ribbon,
  ShieldCheck,
  Award,
  Heart,
  ArrowRight,
  BookOpen,
  Radio,
  Timer,
  CheckCircle,
  Play,
} from "lucide-react";

export const revalidate = 0; // Dynamic so newly submitted stories appear immediately

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden">
      <HomeBanner />
      <div className="flex justify-center px-4 py-4 sm:py-5">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdQ8wrh2SRpPUxF6GOginPFVeSPIDeIoiNq8trduB5IOPAmJw/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-pink-600 px-8 text-sm font-bold text-white shadow-sm transition-colors hover:bg-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
        >
          Register for Delhi University Abhiyan
        </a>
      </div>

      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden pt-2 sm:pt-4 md:pt-6 lg:pt-8 pb-10 md:pb-14 lg:pb-20 min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center">
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
              <LiveBreastCancerUpdatesFeed />
            </div>

            {/* CENTER — HERO CONTENT */}
            <div className="col-span-12 md:col-span-6 text-center space-y-5 sm:space-y-6 max-w-xl mx-auto flex flex-col justify-center items-center px-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-pink-200 text-pink-700 text-xs font-medium tracking-wide">
                <Ribbon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Cancer Mukt Bharat Abhiyan</span>
              </div>

              <h1 className="font-heading text-[26px] leading-[1.15] sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                Break the Silence, Beat the Cancer:{" "}
                <span className="text-pink-600 block sm:inline">
                  A Cancer Mukt Bharat.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md px-2">
                A trusted healthcare portal for early detection guidance, expert
                webinars, and verified crowdfunding support for patients.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2 w-full max-w-sm mx-auto px-2">
                <Link href="/webinars" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white shadow-sm cursor-pointer text-sm sm:text-base"
                  >
                    Join Webinar
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>

                <Link href="/donate" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-pink-300 text-pink-700 bg-white hover:bg-pink-50 cursor-pointer text-sm sm:text-base"
                  >
                    Support Patients
                  </Button>
                </Link>
              </div>
            </div>

            {/* RIGHT — CELEBRITY TESTIMONIALS */}
            <div className="hidden md:block md:col-span-3">
              <CelebrityTestimonials />
            </div>
          </div>
        </div>
      </section>

      {/* ============ BREAST SELF-EXAMINATION GUIDE ============ */}
      <section className="bg-gradient-to-b from-pink-50/60 via-white to-white py-12 sm:py-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-3xl space-y-3 text-center sm:mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-100 px-3 py-1 text-xs font-bold text-pink-700">
              <Timer className="h-4 w-4" />
              Cancer Mukt Bharat Abhiyan
            </span>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              Breast Self-Examination Guide
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Learn the basic steps of becoming familiar with your body and noticing changes. This guide is for awareness and does not replace professional medical advice or screening.
            </p>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-5 lg:gap-8">
            <div className="overflow-hidden rounded-2xl border border-pink-100 bg-slate-950 shadow-md lg:col-span-3">
              <div className="flex items-center gap-2 bg-white px-4 py-3">
                <Play className="h-4 w-4 fill-primary text-primary" />
                <h3 className="text-sm font-bold text-slate-800">BSE Video Guide</h3>
              </div>
              <video
                src="https://res.cloudinary.com/cmqbtzgw/video/upload/v1789020972/euhbbZb3sNXxgOi6g2MF_42G6uUncFHU.mp4"
                controls
                playsInline
                preload="metadata"
                className="aspect-video w-full object-contain"
              />
            </div>

            <div className="space-y-3 lg:col-span-2">
              {[
                { title: "Visual inspection", detail: "Look in a mirror with your arms relaxed and notice visible changes in shape or skin." },
                { title: "Arms-raised check", detail: "Raise your arms and look for changes in the breast or nipple area." },
                { title: "Check while lying down", detail: "Use the pads of your fingers and a consistent pattern to feel each breast and underarm." },
                { title: "Check while standing", detail: "Repeat a gentle, systematic check while standing or in the shower." },
                { title: "Track changes", detail: "Note changes and contact a healthcare professional if you notice something unusual." },
              ].map((step, index) => (
                <div key={step.title} className="flex gap-3 rounded-xl border border-pink-100 bg-white p-3.5 shadow-sm">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-800">{step.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-600">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-col items-center gap-3 text-center">
            <p className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              For step-by-step instructions and the interactive timer, open the full guide.
            </p>
            <Link href="/learn/bse-guide">
              <Button className="bg-pink-600 font-semibold text-white shadow-sm hover:bg-pink-700">
                Open Interactive BSE Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ MOBILE-ONLY PANELS ============ */}
      <div className="block md:hidden px-4 py-8 bg-pink-50/50 space-y-8 border-b border-pink-100">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-pink-700 tracking-wide px-1 flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-pink-600 shrink-0" />
            <span>Live Breast Cancer Updates</span>
          </h3>
          <div className="w-full">
            <LiveBreastCancerUpdatesFeed />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-pink-700 tracking-wide px-1 flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-pink-600 shrink-0" />
            <span>Celebrity Testimonials</span>
          </h3>
          <div className="w-full">
            <CelebrityTestimonials />
          </div>
        </div>
      </div>
      {/* ============ SHARE SUCCESS STORY CTA ============ */}
      <section className="py-10 sm:py-12 bg-white border-b border-pink-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-pink-50 border border-pink-100 rounded-2xl sm:rounded-2xl shadow-sm text-slate-800 py-8 sm:py-10 px-5 sm:px-8 md:px-12">
            <div className="absolute -top-32 -left-32 w-72 h-72 sm:w-80 sm:h-80 bg-pink-100/60 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-72 h-72 sm:w-80 sm:h-80 bg-pink-100/70 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-4 text-center md:text-left">
                <span className="inline-block px-3 py-1 bg-white border border-pink-100 text-pink-700 rounded-full text-xs font-medium tracking-wide">
                  Share Your Success Story
                </span>
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight leading-tight text-slate-900">
                  Has Cancer Awareness Touched Your Life?
                </h2>
                <p className="text-slate-600 max-w-xl text-sm leading-relaxed">
                  Whether you are a survivor or a family member, sharing your
                  journey can encourage others to get checked early and seek
                  timely medical care.
                </p>
              </div>

              <Link
                href="/success-stories/share"
                className="flex-shrink-0 w-full md:w-auto"
              >
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-pink-600 hover:bg-pink-700 text-white font-medium shadow-sm transition-colors text-sm px-6 sm:px-8 h-11 sm:h-12 rounded-lg cursor-pointer"
                >
                  Share Your Story
                  <Heart className="ml-2 h-4 w-4 fill-white text-white" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SURVIVOR SUCCESS STORIES (IMAGE 2 STYLE) ============ */}
      <SurvivorStoryCardSection />

      {/* ============ MODULE OVERVIEW CARDS ============ */}
      <section className="py-12 md:py-16 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 px-2 leading-tight">
            One Platform for Awareness &amp; Care
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base px-2">
            Bringing together patients, medical experts, verified NGOs, and
            volunteer networks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          <div className="p-6 rounded-2xl border border-pink-100 bg-white shadow-sm hover:shadow-md hover:border-pink-200 transition-[box-shadow,border-color] duration-200 flex flex-col space-y-3 sm:space-y-4">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-slate-900">
              Awareness Hub
            </h3>
            <p className="text-sm text-slate-600 flex-1 leading-relaxed">
              Guided self-exam timers, interactive quizzes, and medical articles
              written by licensed oncologists.
            </p>
            <Link href="/learn/bse-guide" className="w-full">
              <Button
                variant="outline"
                className="w-full border-pink-200 text-pink-700 hover:bg-pink-50 font-semibold"
              >
                Learn Breast Self-Examination
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="p-6 rounded-2xl border border-pink-100 bg-white shadow-sm hover:shadow-md hover:border-pink-200 transition-[box-shadow,border-color] duration-200 flex flex-col space-y-3 sm:space-y-4">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-slate-900">
              FundLife Crowdfunding
            </h3>
            <p className="text-sm text-slate-600 flex-1 leading-relaxed">
              Launch fundraising campaigns for cancer treatments. Contributions
              flow directly to hospital bank accounts to prevent fraud.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-pink-100 bg-white shadow-sm hover:shadow-md hover:border-pink-200 transition-[box-shadow,border-color] duration-200 flex flex-col space-y-3 sm:space-y-4">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-slate-900">
              NGO &amp; Doctor Connect
            </h3>
            <p className="text-sm text-slate-600 flex-1 leading-relaxed">
              Registered NGOs review the documents of every campaign, keeping
              fundraising transparent.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-pink-100 bg-white shadow-sm hover:shadow-md hover:border-pink-200 transition-[box-shadow,border-color] duration-200 flex flex-col space-y-3 sm:space-y-4">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
              <Award className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-slate-900">
              QR Certifications
            </h3>
            <p className="text-sm text-slate-600 flex-1 leading-relaxed">
              Earn PDF certificates for quiz completions and webinar attendance,
              with instant QR verification.
            </p>
          </div>
        </div>
      </section>

      {/* ============ OUR TEAM ============ */}
      {/* { <OurTeam />  } */}

      {/* ============ PARTNER ORGANIZATIONS ============ */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-pink-50/40 via-white to-pink-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 px-2 leading-tight">
              Our Partner Organizations
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 max-w-6xl mx-auto">
            <div className="group bg-white rounded-xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg hover:border-pink-300 transition-[box-shadow,border-color] duration-200 flex flex-col h-full">
              <div className="h-28 sm:h-32 flex items-center justify-center bg-pink-50/30 border-b border-pink-100 p-4">
                <img
                  src="/images/grs-group-logo.jpeg"
                  alt="GRS India Private Limited"
                  className="max-h-16 sm:max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col flex-1 p-3 sm:p-4 text-center items-center">
                <h3 className="font-heading text-sm sm:text-base font-semibold text-slate-900 mb-1 leading-snug">
                  GRS India Private Limited
                </h3>
                <a
                  href="https://www.grsgroup.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-2 inline-flex items-center text-pink-600 font-medium hover:text-pink-800 text-xs sm:text-sm"
                >
                  Visit Website →
                </a>
              </div>
            </div>

            <div className="group bg-white rounded-xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg hover:border-pink-300 transition-[box-shadow,border-color] duration-200 flex flex-col h-full">
              <div className="h-28 sm:h-32 flex items-center justify-center bg-pink-50/30 border-b border-pink-100 p-4">
                <img
                  src="/images/mission-bharat.png"
                  alt="Mission Bharat"
                  className="max-h-16 sm:max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col flex-1 p-3 sm:p-4 text-center items-center">
                <h3 className="font-heading text-sm sm:text-base font-semibold text-slate-900 mb-1 leading-snug">
                  Mission Bharat
                </h3>
                <a
                  href="https://missionbharat.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-2 inline-flex items-center text-pink-600 font-medium hover:text-pink-800 text-xs sm:text-sm"
                >
                  Visit Website →
                </a>
              </div>
            </div>

            <div className="group bg-white rounded-xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg hover:border-pink-300 transition-[box-shadow,border-color] duration-200 flex flex-col h-full">
              <div className="h-28 sm:h-32 flex items-center justify-center bg-pink-50/30 border-b border-pink-100 p-4">
                <img
                  src="/images/khushi-logo.jpg"
                  alt="Khushi Centre"
                  className="max-h-16 sm:max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col flex-1 p-3 sm:p-4 text-center items-center">
                <h3 className="font-heading text-sm sm:text-base font-semibold text-slate-900 mb-1 leading-snug">
                  Khushi Centre for Rehabilitation &amp; Research
                </h3>
                <a
                  href="https://khushicentre.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-2 inline-flex items-center text-pink-600 font-medium hover:text-pink-800 text-xs sm:text-sm"
                >
                  Visit Website →
                </a>
              </div>
            </div>

            <div className="group bg-white rounded-xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg hover:border-pink-300 transition-[box-shadow,border-color] duration-200 flex flex-col h-full">
              <div className="h-28 sm:h-32 flex items-center justify-center bg-pink-50/30 border-b border-pink-100 p-4">
                <img
                  src="/images/corporation.png"
                  alt="Department of Social work "
                  className="max-h-16 sm:max-h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col flex-1 p-3 sm:p-4 text-center items-center">
                <h3 className="font-heading text-sm sm:text-base font-semibold text-slate-900 mb-1 leading-snug">
                  Department of Social Work
                  University of Delhi
                </h3>
                <a
                  href="https://www.du.ac.in/index.php?page=department-of-social-work"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-2 inline-flex items-center text-pink-600 font-medium hover:text-pink-800 text-xs sm:text-sm"
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
    </div>
  );
}
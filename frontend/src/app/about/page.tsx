import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Ribbon,
  Heart,
  ShieldCheck,
  Users,
  Award,
  BookOpen,
  ChevronRight,
  Target,
  ArrowRight,
  TrendingUp
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | GRS Breast Cancer Awareness Mission",
  description: "Learn about the GRS Breast Cancer Mission platform, our goals, pillars, and how we bring together patients, doctors, NGOs, and donors to spread awareness and support care.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-white to-rose-50/30 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blur blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] left-5 w-60 h-60 bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-20 relative z-10">

        {/* Section 1: Hero Header */}
        <section className="text-center space-y-4 max-w-3xl mx-auto" aria-labelledby="about-hero-title">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider">
            <Ribbon className="h-4 w-4 animate-pulse" />
            About Our Mission
          </div>
          <h1 id="about-hero-title" className="font-heading text-4xl sm:text-5xl font-black text-slate-800 leading-tight">
            Breast Cancer <span className="text-primary">Mission </span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            An enterprise-grade digital ecosystem designed to connect patients, healthcare professionals, donors, and non-profit organizations into a unified front against breast cancer.
          </p>
        </section>

        {/* Section 2: Mission & Vision Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8" aria-label="Mission and Vision">
          {/* Card 1: Our Mission */}
          <Card className="group bg-white/70 backdrop-blur-md border border-pink-100 hover:border-pink-200 hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between p-2">
            <CardHeader className="p-6 pb-2">
              <div className="h-12 w-12 rounded-2xl bg-pink-50 text-primary flex items-center justify-center border border-pink-100 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-6 w-6" />
              </div>
              <CardTitle className="font-heading text-2xl font-bold mt-4 text-slate-800">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Our purpose is twofold: first, to democratize breast health literacy by providing verified self-examination guides,  Breast cancer webinars, and health quizzes. Second, to provide trusted financial support for breast cancer patients through a secure, transparent crowdfunding platform verified by NGOs and administrators.
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Our Vision */}
          <Card className="group bg-white/70 backdrop-blur-md border border-pink-200 hover:border-pink-300 hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between p-2 ring-1 ring-pink-100/50">
            <CardHeader className="p-6 pb-2">
              <div className="h-12 w-12 rounded-2xl bg-pink-100 text-primary flex items-center justify-center border border-pink-200 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-6 w-6 fill-primary/10" />
              </div>
              <CardTitle className="font-heading text-2xl font-bold mt-4 text-slate-800">
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                We envision a world where breast cancer is detected early enough to be fully treatable, and where no individual is denied life-saving medical care due to lack of funds. Through digital empowerment, clinical partnerships, and crowd support, we aim to bridge the gap between healthcare systems and local communities.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 3: Stat Indicators */}
        <section className="bg-white/40 border border-pink-100/60 rounded-3xl p-8 backdrop-blur-md" aria-label="Platform Highlights">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-3xl sm:text-4xl font-extrabold text-primary">100K+</p>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Educational Target</p>
            </div>
            <div className="space-y-2 border-l border-pink-100/50">
              <p className="text-3xl sm:text-4xl font-extrabold text-primary">100%</p>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">NGO-Verified Cases</p>
            </div>
            {/* <div className="space-y-2 max-sm:border-t max-sm:pt-4 md:border-l border-pink-100/50">
              <p className="text-3xl sm:text-4xl font-extrabold text-primary">Secure</p>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Razorpay Payments</p>
            </div> */}
            <div className="space-y-2 max-sm:border-t max-sm:pt-4 border-l border-pink-100/50">
              <p className="text-3xl sm:text-4xl font-extrabold text-primary">QR-Code</p>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Verifiable Certificates</p>
            </div>
          </div>
        </section>

        {/* Section 4: Three Core Pillars */}
        <section className="space-y-10" aria-labelledby="about-pillars-title">
          <div className="text-center space-y-2">
            <h2 id="about-pillars-title" className="font-heading text-3xl font-bold text-slate-800">
              How the Platform Works
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto">
              Our digital system integrates awareness tools with secure crowdfunding channels, closing the loop from knowledge to care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Pillar 1 */}
            <div className="bg-white/80 border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 bg-pink-50 text-primary rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-800 mb-2">1. Spread Knowledge</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Access step-by-step Breast Self-Examination (BSE) guides with built-in timers. Attend webinars  and health care providers with oncologists and complete awareness quizzes to earn certified PDF credentials.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white/80 border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 bg-pink-50 text-primary rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-800 mb-2">2. Verify & Endorse</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Crowdfunding campaigns undergo double-signature verification: NGO endorsement and administrative audit. This ensures donations are routed directly to hospital billing codes.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white/80 border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 bg-pink-50 text-primary rounded-xl flex items-center justify-center mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-800 mb-2">3. Unify Stakeholders</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect doctors ,Healthcare Providers,NGOs, survivors,  volunteers, and sponsors into a cooperative ecosystem to coordinate support programs and educational active  webinar series.
              </p>
            </div>

          </div>
        </section>

        {/* Section 5: Call to Action (CTA) */}
        <section className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl" aria-label="Join our mission">
          {/* Subtle background graphics */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(219,39,119,0.15),transparent_60%)]" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider">
                <Award className="h-4 w-4" /> Become an Ambassador
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Help Us Make a Difference Today
              </h2>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                Whether you want to learn, volunteer your time in local campaigns, organize clinical webinars, or donate to support verified oncology treatments, there is a place for you.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-end w-full">
              <Link href="/register" className="w-full">
                <Button
                  id="about-cta-get-started"
                  className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-11 px-6 rounded-xl shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-0"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/learn" className="w-full">
                <Button
                  id="about-cta-learn-more"
                  variant="outline"
                  className="w-full border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white font-bold h-11 px-6 rounded-xl transition-all duration-200 cursor-pointer bg-transparent"
                >
                  Explore Awareness Hub
                </Button>
              </Link>
            </div>
          </div>


        </section>

      </div>

      {/* Clinical Disclaimer */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 flex gap-3 text-xs text-slate-500 max-w-4xl mx-auto leading-relaxed">
        <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
        <p>
          <strong>Medical Disclaimer:</strong> The information provided on this platform is for educational and campaign purposes only. It should not be used as a substitute for professional clinical advice, diagnosis, or treatment. Always consult with a licensed physician or oncologist regarding health concerns.
        </p>
      </div>

    </div>


  );
}

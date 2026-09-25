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
  description: "Learn about the GRS Cancer Mukt Bharat Abhiyan platform, our goals, pillars, and how we bring together patients, doctors, NGOs, and donors to spread awareness and support care.",
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
          
          <h1
            id="about-hero-title"
            className="font-heading text-4xl sm:text-5xl font-black text-slate-800 leading-tight"
          >
            <span className="text-primary">About</span> Us
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Empowering Communities, Defeating Breast Cancer Together
            Welcome to the official web portal of Cancer Mukt Bharat Abhiyan—an enterprise-grade digital ecosystem uniting patients, healthcare professionals, donors, and  organizations in a shared mission to eliminate the burden of breast cancer.
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
                The breast cancer mission under the <strong>Cancer Mukt Bharat Abhiyan</strong> is a comprehensive nationwide initiative dedicated to reducing mortality through early detection, community empowerment, and structural healthcare support.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5 marker:text-primary">
                <li>Break social stigmas and promote regular breast self-examinations across communities.</li>
                <li>Deploy grassroots screening camps to catch diagnoses in early, highly curable stages.</li>
                <li>Enable affordable mammography access and dedicated digital helplines.</li>
                <li>Ensure end-to-end patient navigation — from diagnosis to oncological care, financial aid, and holistic counseling.</li>
              </ul>
              <p className="text-sm text-slate-600 leading-relaxed">
                Together, these efforts foster a truly supportive ecosystem for patients and their families.
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
                The vision for breast cancer under the <strong>Cancer Mukt Bharat Abhiyan</strong> is to drastically reduce late-stage diagnoses and mortality rates through accessible, affordable, and inclusive early-detection tools for every woman across India.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5 marker:text-primary">
                <li>Eradicate social stigmas and normalize open conversations through grassroots outreach.</li>
                <li>Bridge healthcare gaps via mobile screening units and public-private partnerships.</li>
                <li>Ensure seamless pathways from initial diagnosis to affordable treatment and survivorship care.</li>
                <li>Foster a proactive healthcare culture centered on timely intervention and comprehensive support.</li>
              </ul>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ultimately, no woman or man should face their battle alone — breast cancer must be caught in its earliest, most treatable stages.
              </p>
            </CardContent>
          </Card>
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500 border border-pink-500 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                <Award className="h-4 w-4" /> Become an Ambassador
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-primary">
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
                  className="w-full bg-pink-500 border-pink-500 text-white hover:bg-pink-600 hover:border-pink-600 hover:text-white font-bold h-11 px-6 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Explore Awareness Hub
                </Button>
              </Link>
            </div>
          </div>


        </section>

      </div>

      

    </div>


  );
}
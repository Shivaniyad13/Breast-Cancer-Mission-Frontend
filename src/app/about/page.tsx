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
    <div className="bg-gradient-to-tr from-pink-50 via-white to-rose-50/30 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blur blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] left-5 w-60 h-60 bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">

        {/* Section 1: Hero Header */}
        <section className="text-center space-y-4 max-w-3xl mx-auto" aria-labelledby="about-hero-title">

          <h1
            id="about-hero-title"
            className="font-heading font-bold text-slate-800 leading-tight text-3xl sm:text-4xl"
          >
            <span className="text-primary">About</span> Us
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Welcome to the official portal of Cancer Mukt Bharat Abhiyan. It brings patients, healthcare professionals, donors, and organizations together to reduce the burden of cancer.
          </p>
        </section>

        {/* Section 2: Mission & Vision Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Mission and Vision">
          {/* Card 1: Our Mission */}
          <Card className="group bg-white/70 backdrop-blur-md border border-pink-100 hover:border-pink-200 hover:shadow-md rounded-2xl overflow-hidden flex flex-col justify-between">
            <CardHeader className="p-6 pb-2">
              <div className="h-12 w-12 rounded-2xl bg-pink-50 text-primary flex items-center justify-center border border-pink-100 ">
                <Target className="h-6 w-6" />
              </div>
              <CardTitle className="font-heading text-2xl font-bold mt-4 text-slate-800">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                The breast cancer mission under the <strong>Cancer Mukt Bharat Abhiyan</strong> is a nationwide initiative to reduce mortality through early detection, community awareness, and better access to healthcare.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5 marker:text-primary">
                <li>Break social stigmas and promote regular breast self-examinations across communities.</li>
                <li>Run grassroots screening camps so cancer is found at an early, more curable stage.</li>
                <li>Enable affordable mammography access and dedicated digital helplines.</li>
                <li>Guide patients from diagnosis to treatment, financial aid, and counseling.</li>
              </ul>
              <p className="text-sm text-slate-600 leading-relaxed">
                Together, these efforts support patients and their families at every step.
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Our Vision */}
          <Card className="group bg-white/70 backdrop-blur-md border border-pink-200 hover:border-pink-300 hover:shadow-md rounded-2xl overflow-hidden flex flex-col justify-between ring-1 ring-pink-100/50">
            <CardHeader className="p-6 pb-2">
              <div className="h-12 w-12 rounded-2xl bg-pink-100 text-primary flex items-center justify-center border border-pink-200 ">
                <Heart className="h-6 w-6 fill-primary/10" />
              </div>
              <CardTitle className="font-heading text-2xl font-bold mt-4 text-slate-800">
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                The vision for breast cancer under the <strong>Cancer Mukt Bharat Abhiyan</strong> is to reduce late-stage diagnoses and mortality through accessible, affordable early-detection tools for every woman across India.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5 marker:text-primary">
                <li>Reduce stigma and make open conversations normal through grassroots outreach.</li>
                <li>Bridge healthcare gaps via mobile screening units and public-private partnerships.</li>
                <li>Make the path from diagnosis to affordable treatment and survivorship care easier.</li>
                <li>Build a culture of timely check-ups and early intervention.</li>
              </ul>
              <p className="text-sm text-slate-600 leading-relaxed">
                No one should face breast cancer alone, and it is best caught at the earliest, most treatable stage.
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
              Awareness tools and verified crowdfunding work together, from knowledge to care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Pillar 1 */}
            <div className="bg-white/80 border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 bg-pink-50 text-primary rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-800 mb-2">1. Spread Knowledge</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Access step-by-step Breast Self-Examination (BSE) guides with built-in timers. Attend webinars with oncologists and other healthcare providers, and complete awareness quizzes to earn certified PDF credentials.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white/80 border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 bg-pink-50 text-primary rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-800 mb-2">2. Verify &amp; Endorse</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every crowdfunding campaign is verified twice: an NGO endorsement and an administrative audit. Donations are routed directly to hospital billing.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white/80 border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 bg-pink-50 text-primary rounded-xl flex items-center justify-center mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-800 mb-2">3. Unify Stakeholders</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect doctors, healthcare providers, NGOs, survivors, volunteers, and sponsors so support programs and webinar series are coordinated in one place.
              </p>
            </div>

          </div>
        </section>

        {/* Section 5: Call to Action (CTA) */}
        <section className="bg-pink-50 border border-pink-100 rounded-2xl p-6 sm:p-8 text-slate-800 relative overflow-hidden shadow-sm" aria-label="Join our mission">

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-pink-200 text-pink-700 text-xs font-semibold">
                <Award className="h-4 w-4" /> Become an Ambassador
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight leading-tight text-slate-900">
                Help Us Make a Difference Today
              </h2>
              <p className="text-slate-600 text-sm max-w-xl leading-relaxed">
                Whether you want to learn, volunteer your time in local campaigns, organize clinical webinars, or donate to support verified oncology treatments, there is a place for you.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-end w-full">
              <Link href="/register" className="w-full">
                <Button
                  id="about-cta-get-started"
                  className="w-full bg-primary hover:bg-pink-700 text-white font-semibold h-11 px-6 rounded-lg cursor-pointer border-0"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/learn" className="w-full">
                <Button
                  id="about-cta-learn-more"
                  variant="outline"
                  className="w-full bg-white border-pink-200 text-pink-700 hover:bg-pink-50 font-semibold h-11 px-6 rounded-lg cursor-pointer"
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
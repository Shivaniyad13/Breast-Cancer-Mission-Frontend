import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Ribbon,
  ShieldCheck,
  Users,
  Award,
  Target,
  ArrowRight,
  Eye,
  Megaphone,
  Leaf,
  Search,
  Microscope,
  HandHeart,
  BarChart3,
  HeartHandshake,
  GraduationCap,
  Activity,
  Sparkles,
  Stethoscope,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Cancer Mukt Bharat Abhiyan",
  description:
    "Learn about the Cancer Mukt Bharat Abhiyan — a citizen-led national movement under Mission Bharat – Viksit Bharat 2047 to reduce the cancer burden through awareness, prevention, early detection, accessible care and survivorship support.",
};

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-tr from-pink-50 via-white to-rose-50/30 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blur blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] left-5 w-60 h-60 bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">

        {/* Section 1: Hero Header */}
        <section
          className="text-center space-y-4 max-w-3xl mx-auto"
          aria-labelledby="about-hero-title"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-pink-200 text-pink-700 text-xs font-semibold">
            <Ribbon className="h-4 w-4" /> An Initiative of Mission Bharat – Viksit Bharat 2047
          </span>

          <h1
            id="about-hero-title"
            className="font-heading font-bold text-slate-800 leading-tight text-3xl sm:text-4xl"
          >
            <span className="text-primary">About</span> Us
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Cancer Mukt Bharat Abhiyan is a citizen-led national movement that brings together government
            institutions, healthcare professionals, research organisations, educational institutions, civil
            society, industry and communities to reduce the burden of cancer across India.
          </p>

          <p className="text-slate-500 text-sm italic max-w-2xl mx-auto">
            &ldquo;Leaving No One Behind — From Cancer Awareness to Prevention, Early Detection, Treatment
            and Survivorship.&rdquo;
          </p>
        </section>

        {/* Section 2: Vision & Mission Cards */}
        <section
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          aria-label="Vision and Mission"
        >
          {/* Card 1: Vision */}
          <Card className="group bg-white/70 backdrop-blur-md border border-pink-100 hover:border-pink-200 hover:shadow-md rounded-2xl overflow-hidden flex flex-col justify-between">
            <CardHeader className="p-6 pb-2">
              <div className="h-12 w-12 rounded-2xl bg-pink-50 text-primary flex items-center justify-center border border-pink-100">
                <Eye className="h-6 w-6" />
              </div>
              <CardTitle className="font-heading text-2xl font-bold mt-4 text-slate-800">
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                To build a <strong>Cancer Mukt Bharat</strong> where every citizen has the knowledge,
                opportunity and access needed to prevent cancer, detect it early, receive timely and
                affordable quality treatment, and live with dignity, hope and support.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Aligned with the vision of <strong>Viksit Bharat 2047</strong>, the Abhiyan seeks to foster
                a healthier, more resilient and cancer-aware India through citizen participation, scientific
                research, innovation, equitable healthcare and collective national action.
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Mission */}
          <Card className="group bg-white/70 backdrop-blur-md border border-pink-200 hover:border-pink-300 hover:shadow-md rounded-2xl overflow-hidden flex flex-col justify-between ring-1 ring-pink-100/50">
            <CardHeader className="p-6 pb-2">
              <div className="h-12 w-12 rounded-2xl bg-pink-100 text-primary flex items-center justify-center border border-pink-200">
                <Target className="h-6 w-6" />
              </div>
              <CardTitle className="font-heading text-2xl font-bold mt-4 text-slate-800">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                To establish a nationwide, citizen-led and collaborative movement that brings together
                government institutions, healthcare professionals, research organisations, educational
                institutions, civil society, industry and communities to reduce the burden of cancer through
                prevention, early diagnosis, accessible care and sustained support for patients and
                survivors.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 3: Strategic Objectives */}
        <section className="space-y-10" aria-labelledby="about-objectives-title">
          <div className="text-center space-y-2">
            <h2
              id="about-objectives-title"
              className="font-heading text-3xl font-bold text-slate-800"
            >
              Strategic Objectives
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto">
              Nine focus areas that drive our national mission — from awareness to survivorship.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <Megaphone className="h-5 w-5" />,
                title: "Awareness & Education",
                desc: "Make cancer literacy a people's movement through schools, universities, workplaces, villages and communities.",
              },
              {
                icon: <Leaf className="h-5 w-5" />,
                title: "Prevention & Healthy Living",
                desc: "Promote tobacco cessation, healthy nutrition, physical activity and awareness of preventable cancer risks.",
              },
              {
                icon: <Search className="h-5 w-5" />,
                title: "Early Detection & Screening",
                desc: "Encourage timely, evidence-based screening and prompt referral, with particular emphasis on breast, cervical and oral cancers.",
              },
              {
                icon: <Stethoscope className="h-5 w-5" />,
                title: "Accessible & Affordable Care",
                desc: "Facilitate access to diagnosis, treatment, specialist consultations and relevant government healthcare schemes.",
              },
              {
                icon: <HeartHandshake className="h-5 w-5" />,
                title: "Women's Health & Equity",
                desc: "Advance Leaving No Woman Behind, ensuring that women and underserved communities are not excluded from cancer awareness and care.",
              },
              {
                icon: <Microscope className="h-5 w-5" />,
                title: "Scientific Research & Innovation",
                desc: "Encourage indigenous medical devices, responsible AI, digital health, improved diagnostics and collaborative clinical research.",
              },
              {
                icon: <HandHeart className="h-5 w-5" />,
                title: "Patient Support & Survivorship",
                desc: "Promote counselling, rehabilitation, palliative care, family support and dignity for cancer patients and survivors.",
              },
              {
                icon: <Users className="h-5 w-5" />,
                title: "Citizen Participation & Partnerships",
                desc: "Build a national coalition of government agencies, hospitals, universities, research institutions, NGOs, industry and volunteers.",
              },
              {
                icon: <BarChart3 className="h-5 w-5" />,
                title: "Evidence-Based Monitoring",
                desc: "Develop measurable indicators to track awareness, screening, referral, access to care and programme outcomes.",
              },
            ].map((obj) => (
              <div
                key={obj.title}
                className="bg-white/80 border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 bg-pink-50 text-primary rounded-xl flex items-center justify-center mb-3">
                  {obj.icon}
                </div>
                <h3 className="font-heading text-sm font-bold text-slate-800 mb-1.5">
                  {obj.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{obj.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Core Implementation Framework */}
        <section className="space-y-10" aria-labelledby="about-framework-title">
          <div className="text-center space-y-2">
            <h2
              id="about-framework-title"
              className="font-heading text-3xl font-bold text-slate-800"
            >
              Core Implementation Framework
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto">
              Four interconnected pillars that guide our work on the ground.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <GraduationCap className="h-5 w-5" />,
                title: "Awareness, Education & Orientation",
                desc: "Create informed citizens, trained volunteers and cancer-aware communities.",
              },
              {
                icon: <ShieldCheck className="h-5 w-5" />,
                title: "Prevention, Screening & Early Diagnosis",
                desc: "Connect communities with qualified healthcare professionals and appropriate screening and referral services.",
              },
              {
                icon: <Sparkles className="h-5 w-5" />,
                title: "Research, Innovation & Indigenous Technology",
                desc: "Promote validated, affordable and accessible cancer-related technologies through research partnerships.",
              },
              {
                icon: <Activity className="h-5 w-5" />,
                title: "Treatment, Rehabilitation & Survivorship",
                desc: "Support timely care, patient navigation, psychosocial rehabilitation and survivorship.",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="bg-white/80 border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 bg-pink-50 text-primary rounded-xl flex items-center justify-center mb-4">
                  {pillar.icon}
                </div>
                <h3 className="font-heading text-base font-bold text-slate-800 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Guiding Principles */}
        <section className="space-y-10" aria-labelledby="about-principles-title">
          <div className="text-center space-y-2">
            <h2
              id="about-principles-title"
              className="font-heading text-3xl font-bold text-slate-800"
            >
              Our Guiding Principles
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto">
              The values that anchor every initiative, partnership and programme under the Abhiyan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { hindi: "जनभागीदारी", english: "Citizen participation" },
              { hindi: "वैज्ञानिक दृष्टिकोण", english: "Scientific approach" },
              { hindi: "समानता एवं समावेशन", english: "Equity and inclusion" },
              { hindi: "नवाचार एवं आत्मनिर्भरता", english: "Innovation and self-reliance" },
              { hindi: "सेवा, संवेदना एवं सहयोग", english: "Service, compassion and collaboration" },
              { hindi: "पारदर्शिता एवं जवाबदेही", english: "Transparency and accountability" },
            ].map((principle) => (
              <div
                key={principle.english}
                className="bg-white/80 border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <p className="font-heading text-lg font-bold text-primary mb-1">
                  {principle.hindi}
                </p>
                <p className="text-sm text-slate-600">{principle.english}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Our Pledge */}
        <section
          className="bg-pink-50 border border-pink-100 rounded-2xl p-6 sm:p-8 text-slate-800 relative overflow-hidden shadow-sm"
          aria-label="Our pledge"
        >
          <div className="relative z-10 space-y-4 max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-pink-200 text-pink-700 text-xs font-semibold">
              <Award className="h-4 w-4" /> Our Pledge
            </span>
            <blockquote className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed italic">
              &ldquo;Together, we pledge to build a Cancer Mukt Bharat by 2047 through awareness,
              prevention, early detection, scientific innovation, accessible healthcare and compassionate
              support — leaving no individual, no woman and no community behind.&rdquo;
            </blockquote>
          </div>
        </section>

        {/* Section 7: Call to Action */}
        <section
          className="bg-white border border-pink-100 rounded-2xl p-6 sm:p-8 text-slate-800 relative overflow-hidden shadow-sm"
          aria-label="Join our mission"
        >
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-semibold">
                <Users className="h-4 w-4" /> Be a Part of the Movement
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight leading-tight text-slate-900">
                Help Us Make a Difference Today
              </h2>
              <p className="text-slate-600 text-sm max-w-xl leading-relaxed">
                Whether you want to learn, volunteer in local campaigns, organize clinical webinars,
                contribute to research, or donate to support verified oncology treatments — there is a
                place for you in the Abhiyan.
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

        {/* Institutional Identity Footer */}
        <p className="text-center text-xs text-slate-500 leading-relaxed">
          Cancer Mukt Bharat Abhiyan | An initiative of Mission Bharat – Viksit Bharat 2047 | Leaving No
          One Behind.
        </p>
      </div>
    </div>
  );
}
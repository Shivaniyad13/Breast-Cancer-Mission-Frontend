"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Ribbon,
  Heart,
  Users,
  Award,
  BookOpen,
  Bell,
  Video,
  Activity,
  Stethoscope,
  Calendar,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  Check,
  Star,
  Info,
  Sparkles,
  ChevronDown,
  MapPin,
  Clock,
  TrendingUp,
  X
} from "lucide-react";

// Why Volunteer Cards
const whyVolunteerList = [
  {
    title: "Spread Breast Cancer Awareness",
    description: "Educate women about monthly self-exams, distribute visual care kits, and break traditional societal taboos around breast wellness.",
    icon: <Ribbon className="h-6 w-6 text-primary" />
  },
  {
    title: "Support Community Events",
    description: "Actively coordinate public walkathons, manage mobile checkup camp logistics, and register attendees for diagnostic tests.",
    icon: <Users className="h-6 w-6 text-primary" />
  },
  {
    title: "Inspire Hope & Strength",
    description: "Stand in solidarity with active cancer patients, lead recovery circles, and share survivor stories of resilience.",
    icon: <Heart className="h-6 w-6 text-primary" />
  },
  {
    title: "Make a Positive Impact",
    description: "Directly contribute to lowering cancer mortality rates by helping make diagnostics accessible to underprivileged areas.",
    icon: <Sparkles className="h-6 w-6 text-primary" />
  }
];

// Opportunities List
const opportunitiesList = [
  {
    title: "Community Awareness Volunteer",
    description: "Distribute visual guides, talk about early self-exams in schools, and coordinate regional outreach programmes.",
    location: "Field Outreach",
    commitment: "Event Based",
    interestKey: "outreach"
  },
  {
    title: "Health Camp Volunteer",
    description: "Manage queues, register patients, and coordinate diagnostics schedules alongside licensed doctors during free camps.",
    location: "Medical Camps",
    commitment: "Part Time",
    interestKey: "camps"
  },
  {
    title: "Campaign Event Coordinator",
    description: "Lead the logistical planning for Pink Ribbon walks, seminar locations, and coordinate with NGO support teams.",
    location: "City Headquarters",
    commitment: "Full Time",
    interestKey: "events"
  },
  {
    title: "Social Media Awareness Advocate",
    description: "Create infographics, write patient recovery articles, and amplify webinar registrations online.",
    location: "Remote / Online",
    commitment: "Part Time",
    interestKey: "media"
  },
  {
    title: "Fundraising Volunteer",
    description: "Help connect patients needing treatment to donors, manage ledger updates, and coordinate with verifying NGOs.",
    location: "Regional Centers",
    commitment: "Part Time",
    interestKey: "fundraising"
  },
  {
    title: "Educational Workshop Presenter",
    description: "Train volunteers and distribute Khushi Tactile Care kits. Guide participants through clinical self-exam rules.",
    location: "Institutions & Centers",
    commitment: "Event Based",
    interestKey: "workshops"
  }
];

// Volunteer Activities
const volunteerActivities = [
  {
    title: "Awareness Walkathons",
    description: "Mobilizing youth groups and survivors in cities to walk for breast cancer awareness and gather treatment funds.",
    src: "/images/community_walk.png"
  },
  {
    title: "Mobile Screening Camps",
    description: "Setting up regional camps where partners provide free mammograms and clinical exams to families in need.",
    src: "/images/mammography_screening.png"
  },
  {
    title: "Interactive Training Seminars",
    description: "Conducting classroom sessions instructing local leaders how to use tactile visual check planners.",
    src: "/images/15.png"
  },
  {
    title: "Support Circles Coordination",
    description: "Organizing weekend survivor meetups to share stories and restore mental peace in a caring environment.",
    src: "/images/support_group.png"
  }
];

// Testimonials Placeholders
const testimonialsList = [
  {
    name: "Sanya Roy",
    role: "Campus Ambassador",
    review: "Volunteering with the campaign enabled us to train 200+ college students on Breast Self-Examination. The cert validation is highly appreciated by students.",
    initials: "SR"
  },
  {
    name: "Rohan Deshmukh",
    role: "Camp Coordinator",
    review: "Coordinating the mobile screening camps in Pune was life-changing. We helped 50 underprivileged women access free diagnostic mammograms.",
    initials: "RD"
  },
  {
    name: "Dr. Anjali Sen",
    role: "Oncology Counsellor",
    review: "As a professional counsellor, contributing time to host support meetups is a wonderful path to give back to patients and families.",
    initials: "AS"
  }
];

// FAQs List
const faqsList = [
  {
    q: "Who can become a volunteer?",
    a: "Anyone aged 18 or above who wants to support breast cancer awareness can register. No prior medical background is required, as we offer structured orientations."
  },
  {
    q: "Is there any registration fee?",
    a: "No, volunteering is completely free of charge. We welcome your support, energy, and advocacy."
  },
  {
    q: "Do volunteers receive certificates?",
    a: "Yes, GRS issues secure, QR-coded PDF certificates to recognize active campaign participation and webinar training completion."
  },
  {
    q: "Can students volunteer?",
    a: "Absolutely. Many volunteers are college students who run awareness drives on their campuses or support remote social media campaigns."
  },
  {
    q: "How much time do I need to contribute?",
    a: "We offer full-time, part-time, and event-based options. You can contribute as little as 2 hours a week for remote advocate roles, or join full-day weekend drives."
  }
];

// Volunteer Gallery Grid (11.png to 17.png)
const galleryImages = [
  { src: "/images/11.png", title: "Global Ribbons Drive" },
  { src: "/images/12.png", title: "Clinic Diagnostics Camp" },
  { src: "/images/13.png", title: "Support Group Circle" },
  { src: "/images/14.png", title: "Walkathon Mobilization" },
  { src: "/images/15.png", title: "Interactive Workshop Session" },
  { src: "/images/16.png", title: "Survivor Support Network" },
  { src: "/images/17.png", title: "Wellness Daily Advocacy" }
];

export default function VolunteersClient() {
  const formRef = useRef<HTMLDivElement>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<typeof galleryImages[0] | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    age: "",
    occupation: "",
    interest: "outreach",
    availability: "flexible",
    motivation: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Prepared for future DB integration:
  // const [volunteerStats, setVolunteerStats] = useState({ volunteers: 500, campaigns: 100, reached: 10000, events: 50 });

  const scrollToForm = (interest?: string) => {
    if (interest) {
      setFormData((prev) => ({ ...prev, interest }));
    }
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone number is required";
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
      nextErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.city.trim()) nextErrors.city = "City is required";
    if (!formData.age.trim()) {
      nextErrors.age = "Age is required";
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 16 || ageNum > 100) {
        nextErrors.age = "Age must be between 16 and 100";
      }
    }
    if (!formData.occupation.trim()) nextErrors.occupation = "Occupation is required";
    if (!formData.motivation.trim()) nextErrors.motivation = "Please tell us why you want to volunteer";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Prepared for future PostgreSQL and Prisma integration:
      console.log("Submitting Volunteer Application:", formData);
      setFormSubmitted(true);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      city: "",
      age: "",
      occupation: "",
      interest: "outreach",
      availability: "flexible",
      motivation: ""
    });
    setFormSubmitted(false);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="flex-1 w-full bg-white text-slate-800 font-sans selection:bg-pink-100 selection:text-pink-700 overflow-x-hidden relative">

      {/* Decorative background blur blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200/25 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[75vh] flex items-center py-20 overflow-hidden">

        {/* Background Image with Dark & Pink Tint Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/community_walk.png"
            alt="Volunteers Community Walkathon"
            fill
            priority
            className="object-cover object-center select-none"
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-pink-900/30 via-pink-800/10 to-background z-10" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-20 text-center lg:text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/20 backdrop-blur-md border border-pink-300/25 text-pink-100 text-xs font-semibold uppercase tracking-wider"
          >
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            Join the Movement
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight"
          >
            Become a <span className="text-pink-300">Volunteer</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed"
          >
            Together we can spread awareness, support breast cancer patients, organize campaigns, and make a meaningful impact in our communities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4"
          >
            <Button
              onClick={() => scrollToForm()}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full shadow-lg px-7 py-6 active:scale-95 transition-all cursor-pointer"
            >
              Get Started
            </Button>
            <a href="#opportunities">
              <Button
                variant="outline"
                className="border-white text-white bg-white/10 backdrop-blur-md hover:bg-white/20 font-bold rounded-full px-7 py-6 active:scale-95 transition-all cursor-pointer"
              >
                View Roles
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ================= WHY VOLUNTEER? ================= */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-14">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <Info className="h-3.5 w-3.5" /> Our Mission
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Why Volunteer With Us?
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Volunteers are the backbone of our outreach. Your commitment supports clinical access and diagnostics guidance.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {whyVolunteerList.map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="border-pink-100/50 bg-gradient-to-br from-white to-pink-50/[0.05] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-6 group hover:border-pink-300">
                  <div className="h-12 w-12 rounded-xl bg-pink-50 flex items-center justify-center border border-pink-100/30 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="font-heading text-xl font-bold mt-5 text-slate-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-3 font-medium">
                    {item.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ================= VOLUNTEER OPPORTUNITIES ================= */}
      <section id="opportunities" className="py-20 md:py-28 bg-gradient-to-b from-white to-pink-50/20 border-y border-pink-100/30 scroll-mt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/50 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Active Openings
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Volunteer Opportunities
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Explore open volunteer roles matching your expertise, location preference, and weekly availability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunitiesList.map((opp, idx) => (
              <Card key={idx} className="border-pink-100/40 bg-white shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col justify-between group hover:border-pink-300">
                <CardHeader className="p-6 pb-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-pink-50 px-2.5 py-1 rounded-md">
                      {opp.commitment}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {opp.location}
                    </span>
                  </div>
                  <CardTitle className="font-heading text-lg font-bold mt-4 text-slate-800 group-hover:text-primary transition-colors leading-tight">
                    {opp.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2 space-y-4">
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                    {opp.description}
                  </p>
                  <Button
                    onClick={() => scrollToForm(opp.interestKey)}
                    className="w-full bg-slate-50 hover:bg-primary hover:text-white border border-slate-100 text-slate-800 font-bold rounded-xl py-3.5 transition-all text-xs cursor-pointer active:scale-95"
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* ================= VOLUNTEER ACTIVITIES ================= */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <Activity className="h-3.5 w-3.5" /> Operations Logs
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Featured Activities In Action
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              A glimpse into the daily campaigns managed and executed by our dedicated volunteer teams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {volunteerActivities.map((act, idx) => (
              <Card key={idx} className="border-pink-100/30 bg-white hover:shadow-md transition-shadow rounded-2xl overflow-hidden group hover:border-pink-300">
                <div className="relative h-44 w-full bg-slate-100">
                  <Image
                    src={act.src}
                    alt={act.title}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 250px"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-heading font-bold text-slate-800 text-sm leading-tight group-hover:text-primary transition-colors">{act.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-normal font-medium">{act.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VOLUNTEER IMPACT ================= */}
      <section className="py-20 bg-gradient-to-br from-pink-500 to-rose-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12 relative z-10">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/10 text-white text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="h-3.5 w-3.5 text-pink-200" /> Community Milestones
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-white tracking-tight leading-tight">
              Our Collective Volunteer Impact
            </h2>
            <p className="text-pink-100 text-sm font-medium">
              We track campaign outreach and active volunteer stats to continuously audit regional support performance.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

            {/* Stat 1 */}
            <div className="text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">500+</div>
              <h4 className="text-xs sm:text-sm font-bold text-pink-100 uppercase tracking-widest">Volunteers</h4>
            </div>

            {/* Stat 2 */}
            <div className="text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">100+</div>
              <h4 className="text-xs sm:text-sm font-bold text-pink-100 uppercase tracking-widest">Campaigns</h4>
            </div>

            {/* Stat 3 */}
            <div className="text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">10K+</div>
              <h4 className="text-xs sm:text-sm font-bold text-pink-100 uppercase tracking-widest">People Reached</h4>
            </div>

            {/* Stat 4 */}
            <div className="text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">50+</div>
              <h4 className="text-xs sm:text-sm font-bold text-pink-100 uppercase tracking-widest">Events Organized</h4>
            </div>

          </div>
        </div>
      </section>

      {/* ================= VOLUNTEER JOURNEY ================= */}
      <section className="py-20 md:py-28 bg-white border-b border-pink-100/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-16">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <Activity className="h-3.5 w-3.5" /> Journey Roadmap
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Your Onboarding Journey
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              We guide each applicant through a structured timeline to verify compliance and prepare safety checks.
            </p>
          </div>

          {/* Timeline Process */}
          <div className="relative border-l border-pink-200 ml-4 md:ml-32 space-y-10">

            {/* Step 1 */}
            <div className="relative pl-8 md:pl-10">
              <div className="absolute -left-3 top-1.5 h-6 w-6 rounded-full bg-primary border-4 border-white shadow-sm flex items-center justify-center" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Step 01</span>
                <h4 className="font-heading text-base font-bold text-slate-800">Register Online</h4>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md font-medium leading-relaxed">
                  Fill out our modern registration form specifying your area of interest and weekly availability.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative pl-8 md:pl-10">
              <div className="absolute -left-3 top-1.5 h-6 w-6 rounded-full bg-primary border-4 border-white shadow-sm flex items-center justify-center" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Step 02</span>
                <h4 className="font-heading text-base font-bold text-slate-800">Application Review</h4>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md font-medium leading-relaxed">
                  Our regional campaign coordination team reviews your submission parameters to map you to openings.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative pl-8 md:pl-10">
              <div className="absolute -left-3 top-1.5 h-6 w-6 rounded-full bg-primary border-4 border-white shadow-sm flex items-center justify-center" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Step 03</span>
                <h4 className="font-heading text-base font-bold text-slate-800">Mission Orientation</h4>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md font-medium leading-relaxed">
                  Attend a short, interactive welcome webinar introducing campaign history, NGO guidelines, and core objectives.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative pl-8 md:pl-10">
              <div className="absolute -left-3 top-1.5 h-6 w-6 rounded-full bg-primary border-4 border-white shadow-sm flex items-center justify-center" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Step 04</span>
                <h4 className="font-heading text-base font-bold text-slate-800">Instructional Training</h4>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md font-medium leading-relaxed">
                  Familiarize yourself with self-exam timups and training guidelines included with the Khushi Care Kit.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative pl-8 md:pl-10">
              <div className="absolute -left-3 top-1.5 h-6 w-6 rounded-full bg-primary border-4 border-white shadow-sm flex items-center justify-center" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Step 05</span>
                <h4 className="font-heading text-base font-bold text-slate-800">Join Active Campaigns</h4>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md font-medium leading-relaxed">
                  Get deployed to field checkup camp registrations, walkathon operations, or write online media articles.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="relative pl-8 md:pl-10">
              <div className="absolute -left-3 top-1.5 h-6 w-6 rounded-full bg-primary border-4 border-white shadow-sm flex items-center justify-center" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Step 06</span>
                <h4 className="font-heading text-base font-bold text-slate-800">Receive Volunteer Certificate</h4>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md font-medium leading-relaxed">
                  Earn your secure, verifiably signed QR-coded PDF volunteer certificate after complete camp modules.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-pink-50/20 border-b border-pink-100/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/50 text-primary text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="h-3.5 w-3.5" /> Advocacy Stories
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Volunteer Testimonials
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Read direct testimonials from volunteers explaining their active campaign experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsList.map((test, idx) => (
              <Card key={idx} className="border-pink-100/40 bg-white p-6 rounded-2xl shadow-xs space-y-4 hover:shadow-md transition-all duration-300 relative group hover:border-pink-300">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-pink-100 text-primary flex items-center justify-center text-xs font-bold font-heading border border-pink-200/50 group-hover:scale-105 transition-transform">
                    {test.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">{test.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{test.role}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed italic font-medium">
                  &ldquo;{test.review}&rdquo;
                </p>
                <div className="flex gap-0.5 text-amber-400 pt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                  ))}
                </div>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* ================= VOLUNTEER GALLERY ================= */}
      <section className="py-20 md:py-28 bg-white scroll-mt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <Award className="h-3.5 w-3.5" /> Media Archive
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Volunteer Gallery
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Explore capturing moments from diagnostic camps, student assemblies, and regional public campaigns.
            </p>
          </div>

          {/* Grid Layout for Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryImages.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                onClick={() => setLightboxImage(img)}
                className="group cursor-pointer bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 relative aspect-square"
              >
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <h4 className="font-heading font-bold text-base leading-tight translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{img.title}</h4>
                  <p className="text-[10px] text-pink-100 mt-1 translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-75">Click to view details</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl relative border border-slate-200/10 cursor-default"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative aspect-[4/3] w-full bg-slate-900">
                <Image
                  src={lightboxImage.src}
                  alt={lightboxImage.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-heading text-xl font-extrabold text-slate-800 dark:text-slate-100">{lightboxImage.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Campaign Outreach Event Visual</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-pink-50/20 border-t border-pink-100/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="h-3.5 w-3.5" /> FAQ
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Quick answers concerning volunteer eligibility, travel support, and certificate queries.
            </p>
          </div>

          {/* Accordion Component */}
          <div className="space-y-4">
            {faqsList.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={idx} className="border border-pink-100/50 rounded-2xl bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-heading font-bold text-sm sm:text-base text-slate-800 hover:text-primary transition-colors cursor-pointer select-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-pink-50 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= VOLUNTEER REGISTRATION FORM ================= */}
      <section ref={formRef} className="py-20 md:py-28 bg-white scroll-mt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl space-y-10">

          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/50 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Registration Form
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Apply to Volunteer
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Submit your application below. We will map your profile to our active regional drives.
            </p>
          </div>

          <Card className="border-pink-100/60 bg-white shadow-xl rounded-3xl p-6 sm:p-10">
            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form
                  key="volunteer-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${errors.fullName ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-pink-100"
                          }`}
                        placeholder="Jane Doe"
                      />
                      {errors.fullName && <p className="text-[10px] text-rose-500 font-bold">{errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${errors.email ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-pink-100"
                          }`}
                        placeholder="jane@example.com"
                      />
                      {errors.email && <p className="text-[10px] text-rose-500 font-bold">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${errors.phone ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-pink-100"
                          }`}
                        placeholder="+91 9876543210"
                      />
                      {errors.phone && <p className="text-[10px] text-rose-500 font-bold">{errors.phone}</p>}
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${errors.city ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-pink-100"
                          }`}
                        placeholder="Pune"
                      />
                      {errors.city && <p className="text-[10px] text-rose-500 font-bold">{errors.city}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Age */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${errors.age ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-pink-100"
                          }`}
                        placeholder="24"
                        min="16"
                        max="100"
                      />
                      {errors.age && <p className="text-[10px] text-rose-500 font-bold">{errors.age}</p>}
                    </div>

                    {/* Occupation */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Occupation</label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${errors.occupation ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-pink-100"
                          }`}
                        placeholder="Student / Working Professional"
                      />
                      {errors.occupation && <p className="text-[10px] text-rose-500 font-bold">{errors.occupation}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Areas of Interest */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Areas of Interest</label>
                      <select
                        name="interest"
                        value={formData.interest}
                        onChange={handleInputChange}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-pink-100 bg-white"
                      >
                        <option value="outreach">Community Outreach</option>
                        <option value="camps">Health Camps</option>
                        <option value="events">Event Management</option>
                        <option value="media">Social Media Awareness</option>
                        <option value="fundraising">Fundraising support</option>
                        <option value="workshops">Educational Workshops</option>
                      </select>
                    </div>

                    {/* Availability Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Availability</label>
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-pink-100 bg-white"
                      >
                        <option value="flexible">Flexible</option>
                        <option value="weekends">Weekends only</option>
                        <option value="weekdays">Weekdays only</option>
                        <option value="evenings">Evenings only</option>
                        <option value="event">Event-based only</option>
                      </select>
                    </div>
                  </div>

                  {/* Why Volunteer */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Why do you want to volunteer?</label>
                    <textarea
                      name="motivation"
                      rows={4}
                      value={formData.motivation}
                      onChange={handleInputChange}
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all resize-none ${errors.motivation ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-pink-100"
                        }`}
                      placeholder="Share your goals or why you want to join our volunteer crew..."
                    />
                    {errors.motivation && <p className="text-[10px] text-rose-500 font-bold">{errors.motivation}</p>}
                  </div>

                  {/* Action Info Note */}
                  <div className="flex gap-2 p-4 rounded-xl bg-slate-50 text-slate-500 border border-slate-100">
                    <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <p className="text-[10px] leading-relaxed font-semibold">
                      Your inputs will be synced with our databases for audit verification. Coordinators will notify you about orientation webinar slots shortly.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl py-4 active:scale-95 transition-all text-sm uppercase tracking-wider cursor-pointer"
                  >
                    Become a Volunteer
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 space-y-6"
                >
                  <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-100 animate-bounce">
                    <Check className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-heading text-2xl font-black text-slate-800">Application Received!</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">
                      Thank you, <strong className="text-slate-800">{formData.fullName}</strong>. Your volunteer application for <strong className="text-slate-800 uppercase">{formData.interest}</strong> has been logged.
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Check your email inbox at <strong className="text-slate-700">{formData.email}</strong> for welcome messages and upcoming orientation webinar links.
                  </p>
                  <div className="pt-4 flex gap-3 justify-center">
                    <Button
                      onClick={resetForm}
                      className="bg-pink-600 hover:bg-pink-755 text-white font-bold rounded-full py-4 px-6 active:scale-95 transition-all text-xs uppercase cursor-pointer"
                    >
                      Submit Another
                    </Button>
                    <Link href="/">
                      <Button
                        variant="outline"
                        className="border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-full py-4 px-6 active:scale-95 transition-all text-xs uppercase"
                      >
                        Return Home
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-pink-500 to-rose-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[5%] w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-8 relative z-10">

          <div className="space-y-4">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Your Time Can Help Save Lives
            </h2>
            <p className="text-pink-100 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
              Become part of a structured framework providing diagnostic access, wellness workshops, and verified funding support to breast cancer patients.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
              onClick={() => scrollToForm()}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-primary font-bold rounded-full py-6 px-8 shadow-lg active:scale-95 transition-all text-sm uppercase tracking-wider cursor-pointer"
            >
              Become a Volunteer
            </Button>
            <Link href="/campaigns/awareness" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-white/40 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full py-6 px-8 active:scale-95 transition-all text-sm uppercase tracking-wider">
                Join Awareness Campaign
              </Button>
            </Link>
            <Link href="/webinars" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-white/40 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full py-6 px-8 active:scale-95 transition-all text-sm uppercase tracking-wider">
                Register for Webinar
              </Button>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

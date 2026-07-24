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
  ShieldCheck,
  Users,
  Award,
  Play,
  Pause,
  Clock,
  Video,
  Activity,
  Check,
  CheckCircle,
  Calendar,
  ArrowRight,
  ChevronRight,
  Info,
  X,
  HeartPulse,
  Sparkles,
  MapPin,
  TrendingUp
} from "lucide-react";

// Reusable data structure for Videos
const awarenessVideos = [
  {
    title: "Understanding Breast Cancer: Causes & Symptoms",
    duration: "9:25",
    description: "An expert medical briefing on what breast cancer is, how it develops inside tissue, potential causes, warning signs, and standard treatment workflows.",
    src: "/Breast Cancer_ What is it, Symptoms, Causes, Treatment _ Mass General Brigham.mp4",
    thumbnail: "/images/preventive_wellness.png"
  },
  {
    title: "Breast Self-Examination (BSE) Walkthrough",
    duration: "3:45",
    description: "Detailed medical walkthrough demonstrating correct examination motions, finger pressure, and inspection zones to maintain monthly checks.",
    src: "/cancer video.webm",
    thumbnail: "/images/support_group.png"
  },
  {
    title: "Khushi Tactile Care Kit Instructions",
    duration: "5:12",
    description: "Learn how to use checkup cards, timeline planners, and tactile exam aids included in the Khushi Care Kit to promote awareness.",
    src: "/cancer3.webm",
    thumbnail: "/images/survivor_strength.png"
  },
  {
    title: "Understanding Early Breast Cancer Screening",
    duration: "4:15",
    description: "A patient-centric guide explaining what to expect during a mammogram, clinical breast exam, or ultrasound diagnostics.",
    src: "/videoplayback.mp4",
    thumbnail: "/images/mammography_screening.png"
  }
];

// Gallery Images mapping
const galleryImages = [
  {
    src: "/images/11.png",
    title: "Hope & Solidarity",
    description: "The pink ribbon serves as a global beacon of solidarity, supporting those undergoing active care."
  },
  {
    src: "/images/12.png",
    title: "Clinical Screening Technologies",
    description: "Advanced mammography devices help radiologists identify abnormalities years before they become palpable lumps."
  },
  {
    src: "/images/13.png",
    title: "Empathetic Support Group Meetup",
    description: "Gathering survivors and advocates to build a community of comfort, share stories, and reinforce mental health."
  },
  {
    src: "/images/14.png",
    title: "Awareness Community Walkathon",
    description: "Mobilizing regional advocacy networks to march in unity, raising funds for clinical screenings."
  },
  {
    src: "/images/15.png",
    title: "Educational Oncology Webinars",
    description: "Onco-surgeons and medical specialists sharing clinical guidelines on preventive health and diagnostics."
  },
  {
    src: "/images/16.png",
    title: "Survivor Strength & Recovery",
    description: "Empowering recovery testimonials proving that early stage detection delivers positive treatment outcomes."
  },
  {
    src: "/images/17.png",
    title: "Wellness & Healthy Lifestyles",
    description: "Nurturing the body with a healthy diet, physical workouts, and stress-reduction routines to manage risk."
  }
];

export default function AwarenessClient() {
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<typeof galleryImages[0] | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoSelect = (idx: number) => {
    setActiveVideoIdx(idx);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.log("Video auto-play blocked or failed:", err);
      });
    }
  };

  // Framer Motion Animation Variants
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
      <section className="relative bg-gradient-to-b from-rose-50/40 via-white to-white py-20 md:py-28 border-b border-rose-100/30 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Info */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/75 border border-pink-200/50 text-pink-700 text-xs font-bold uppercase tracking-wider"
              >
                <Ribbon className="h-4 w-4 text-primary animate-pulse" />
                Campaign Awareness
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-800 leading-tight"
              >
                Breast Cancer <br />
                <span className="text-primary">Awareness</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium"
              >
                Creating awareness today can save lives tomorrow. Together we can encourage early detection, timely screening, and stronger communities.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4"
              >
                <a href="#why-awareness-matters">
                  <Button className="bg-primary hover:bg-primary/95 text-white font-semibold rounded-full shadow-md px-6 py-5 active:scale-95 transition-all">
                    Explore Pillars
                  </Button>
                </a>
                <a href="#awareness-gallery">
                  <Button variant="outline" className="border-pink-200 text-primary hover:bg-pink-50 font-semibold rounded-full px-6 py-5 active:scale-95 transition-all">
                    View Gallery
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* Hero Right Graphic */}
            <div className="lg:col-span-5 relative flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="w-full max-w-sm relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-pink-400/20 to-rose-300/20 rounded-3xl opacity-30 blur-2xl z-0" />
                <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-pink-100/60 shadow-xl bg-white p-2.5 z-10 hover:shadow-2xl transition-all duration-500">
                  <Image
                    src="/images/awareness_ribbon.png"
                    alt="Breast Cancer Pink Ribbon Banner"
                    fill
                    className="object-cover rounded-2xl"
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority
                  />
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                    <Heart className="h-3.5 w-3.5 text-primary fill-primary" />
                    Hope & Unity
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= WHY AWARENESS MATTERS ================= */}
      <section id="why-awareness-matters" className="py-20 md:py-28 bg-white scroll-mt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-14">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <Info className="h-3.5 w-3.5" /> Healthcare Pillars
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Why Awareness Matters
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Spreading core facts about breast oncology can make a profound difference in recovery rates and community support systems.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Card 1: Importance */}
            <motion.div variants={fadeInUp}>
              <Card className="border-pink-100/50 bg-gradient-to-br from-white to-pink-50/[0.05] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-6 group hover:border-pink-300">
                <div className="h-12 w-12 rounded-xl bg-pink-50 text-primary flex items-center justify-center border border-pink-100/30 group-hover:scale-110 transition-transform">
                  <Ribbon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold mt-5 text-slate-800">
                  Importance of Awareness
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">
                  Educating individuals removes social stigmas and encourages people to openly ask questions about breast health, identify anomalies, and consult professionals without fear.
                </p>
              </Card>
            </motion.div>

            {/* Card 2: Early Detection */}
            <motion.div variants={fadeInUp}>
              <Card className="border-pink-100/50 bg-gradient-to-br from-white to-pink-50/[0.05] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-6 group hover:border-pink-300">
                <div className="h-12 w-12 rounded-xl bg-pink-50 text-primary flex items-center justify-center border border-pink-100/30 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold mt-5 text-slate-800">
                  Benefits of Early Detection
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">
                  Diagnosing breast cancer at Stage I yields an outstanding 5-year survival rate of over 98%. Regular monthly exams and clinical screening schedules ensure early interventions.
                </p>
              </Card>
            </motion.div>

            {/* Card 3: Community Participation */}
            <motion.div variants={fadeInUp}>
              <Card className="border-pink-100/50 bg-gradient-to-br from-white to-pink-50/[0.05] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-6 group hover:border-pink-300">
                <div className="h-12 w-12 rounded-xl bg-pink-50 text-primary flex items-center justify-center border border-pink-100/30 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold mt-5 text-slate-800">
                  Community Participation
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">
                  Local campaigns, walks, and educational workshops coordinate networks of volunteers, NGOs, and hospitals to provide diagnostics directly to remote or underprivileged regions.
                </p>
              </Card>
            </motion.div>

            {/* Card 4: Supporting Survivors */}
            <motion.div variants={fadeInUp}>
              <Card className="border-pink-100/50 bg-gradient-to-br from-white to-pink-50/[0.05] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-6 group hover:border-pink-300">
                <div className="h-12 w-12 rounded-xl bg-pink-50 text-primary flex items-center justify-center border border-pink-100/30 group-hover:scale-110 transition-transform">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold mt-5 text-slate-800">
                  Supporting Survivors
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">
                  Fostering empathetic environments and peer support circles helps patients manage anxiety, share recovery milestones, and restore physical and mental wellness.
                </p>
              </Card>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ================= AWARENESS CAMPAIGNS ================= */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-pink-50/20 border-y border-pink-100/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/50 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Featured Drives
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Active Awareness Campaigns
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Discover our structured outreach programs designed to raise funds, educate regions, and supply medical resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Campaign 1 */}
            <Card className="border-pink-100/40 bg-white shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-pink-300">
              <div className="relative h-56 w-full bg-slate-100 border-b border-pink-50">
                <Image
                  src="/images/awareness_ribbon.png"
                  alt="Pink Ribbon Campaign"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-pink-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Hope Initiative
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">Pink Ribbon Campaign</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    The international emblem for breast cancer advocacy. We distribute awareness badges, posters, and informative flyers in offices and college campuses to spark critical wellness discussions.
                  </p>
                </div>
                <div className="pt-2">
                  <Link href="/campaigns">
                    <Button variant="ghost" className="p-0 hover:bg-transparent text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 group-hover:text-primary/80 transition-colors">
                      Learn More <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Campaign 2 */}
            <Card className="border-pink-100/40 bg-white shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-pink-300">
              <div className="relative h-56 w-full bg-slate-100 border-b border-pink-50">
                <Image
                  src="/images/mammography_screening.png"
                  alt="Early Detection Awareness"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-pink-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Diagnostics
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">Early Detection Awareness</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Focusing heavily on medical imaging. This drive encourages women over 40 to schedule regular mammograms, while helping low-income patient families obtain diagnostic slots.
                  </p>
                </div>
                <div className="pt-2">
                  <Link href="/diagnosis">
                    <Button variant="ghost" className="p-0 hover:bg-transparent text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 group-hover:text-primary/80 transition-colors">
                      Learn More <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Campaign 3 */}
            <Card className="border-pink-100/40 bg-white shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-pink-300">
              <div className="relative h-56 w-full bg-slate-100 border-b border-pink-50">
                <Image
                  src="/images/community_walk.png"
                  alt="Community Awareness Drives"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-pink-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Outreach
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">Community Awareness Drives</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Bringing healthcare information directly to people. We coordinate walks, street assemblies, and regional public campaigns to distribute educational kits and self-check cards.
                  </p>
                </div>
                <div className="pt-2">
                  <Link href="/campaigns">
                    <Button variant="ghost" className="p-0 hover:bg-transparent text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 group-hover:text-primary/80 transition-colors">
                      Learn More <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Campaign 4 */}
            <Card className="border-pink-100/40 bg-white shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-pink-300">
              <div className="relative h-56 w-full bg-slate-100 border-b border-pink-50">
                <Image
                  src="/images/preventive_wellness.png"
                  alt="Women's Health Awareness"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-pink-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Wellness
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">Women's Health Awareness</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Promoting a holistic view of health. Connecting nutritious eating, daily exercises, stress mitigation, and breast anatomy education to form a proactive lifestyle shield.
                  </p>
                </div>
                <div className="pt-2">
                  <Link href="/campaigns/education">
                    <Button variant="ghost" className="p-0 hover:bg-transparent text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 group-hover:text-primary/80 transition-colors">
                      Learn More <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* ================= AWARENESS GALLERY ================= */}
      <section id="awareness-gallery" className="py-20 md:py-28 bg-white scroll-mt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <Award className="h-3.5 w-3.5" /> Visual Moments
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Awareness Gallery
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Explore key moments captured from our global drives, diagnostic support camps, survivor support groups, and webinar tutorials.
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
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <h4 className="font-heading font-bold text-lg leading-tight translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{img.title}</h4>
                  <p className="text-xs text-pink-100 line-clamp-2 mt-1 translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-75">{img.description}</p>
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
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{lightboxImage.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= AWARENESS VIDEOS ================= */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-pink-50/20 border-y border-pink-100/30 scroll-mt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
          
          <div className="space-y-3 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider">
              <Video className="h-3.5 w-3.5" />
              Expert Video Playlist
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-slate-800">
              Interactive Video Guides
            </h3>
            <p className="text-slate-500 text-sm max-w-2xl font-medium">
              Understand breast self-examinations, oncological diagnostic pathways, and instruct your household in general prevention guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Video Player */}
            <div className="lg:col-span-8 bg-white border border-pink-100/50 rounded-3xl overflow-hidden shadow-sm flex flex-col">
              <div className="relative aspect-video bg-black w-full overflow-hidden">
                {awarenessVideos[activeVideoIdx].src ? (
                  <video
                    ref={videoRef}
                    key={awarenessVideos[activeVideoIdx].src}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  >
                    <source src={awarenessVideos[activeVideoIdx].src} type="video/mp4" />
                    <source src={awarenessVideos[activeVideoIdx].src} type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 p-6 text-center text-zinc-400 space-y-4">
                    <Video className="h-16 w-16 text-pink-500/80 animate-pulse" />
                    <div className="space-y-2">
                      <p className="text-white font-semibold text-lg">Oncology Video Unavailable</p>
                      <p className="text-xs text-zinc-500 max-w-sm">This video is currently being prepared for streaming. Check back soon for clinical expert details.</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-3">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest bg-pink-50 px-2.5 py-1 rounded-md">
                    Now Playing
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                    <Clock className="h-3.5 w-3.5" />
                    Duration: {awarenessVideos[activeVideoIdx].duration}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-800">
                  {awarenessVideos[activeVideoIdx].title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                  {awarenessVideos[activeVideoIdx].description}
                </p>
              </div>
            </div>

            {/* Playlist Sidebar */}
            <div className="lg:col-span-4 space-y-3">
              <div className="p-4 bg-pink-50/40 rounded-2xl border border-pink-100/30">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest block mb-1">
                  Playlist Walkthroughs
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Select a video below to start playing</span>
              </div>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {awarenessVideos.map((video, idx) => {
                  const isActive = idx === activeVideoIdx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleVideoSelect(idx)}
                      className={`w-full text-left flex items-start gap-3 p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "bg-pink-50/40 border-primary/50 shadow-xs"
                          : "bg-white border-slate-100 hover:border-pink-200/50 hover:bg-pink-50/10"
                      }`}
                    >
                      <div className="relative h-16 w-24 rounded-lg overflow-hidden shrink-0 bg-muted border border-slate-100">
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                        <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                          <Play className={`h-5 w-5 ${isActive ? "text-primary fill-primary scale-110" : "text-white"} transition-transform`} />
                        </div>
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9px] font-semibold text-slate-400 flex items-center gap-0.5">
                            <Clock className="h-2.5 w-2.5" />
                            {video.duration}
                          </span>
                          {isActive && (
                            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                          )}
                        </div>
                        <p className={`text-xs font-bold truncate ${isActive ? "text-primary" : "text-slate-800"}`}>
                          {video.title}
                        </p>
                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-snug">
                          {video.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= AWARENESS ACTIVITIES ================= */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <Activity className="h-3.5 w-3.5" /> Direct Activities
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Community Outreach Activities
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Join active volunteer operations that bring healthcare advocacy directly to neighborhoods and educational facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            
            {/* Activity 1 */}
            <div className="group bg-gradient-to-br from-white to-pink-50/[0.03] border border-slate-100 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:border-pink-200">
              <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden mb-5">
                <Image
                  src="/images/community_walk.png"
                  alt="Awareness Walks"
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 400px"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-pink-50 px-2.5 py-1 rounded-md">
                    Public Event
                  </span>
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Multiple Cities
                  </span>
                </div>
                <h4 className="font-heading text-lg font-bold text-slate-800">Awareness Walks</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Gathering survivors, students, and healthcare advocates to march down major avenues, display wellness guidelines, and build funding pledges.
                </p>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="group bg-gradient-to-br from-white to-pink-50/[0.03] border border-slate-100 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:border-pink-200">
              <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden mb-5">
                <Image
                  src="/images/awareness_ribbon.png"
                  alt="Pink October Events"
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 400px"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-pink-50 px-2.5 py-1 rounded-md">
                    Global Campaign
                  </span>
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Oct 1 - Oct 31
                  </span>
                </div>
                <h4 className="font-heading text-lg font-bold text-slate-800">Pink October Events</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Annual month-long drives with global entities to highlight breast wellness, host free clinics, write oncology columns, and generate resources.
                </p>
              </div>
            </div>

            {/* Activity 3 */}
            <div className="group bg-gradient-to-br from-white to-pink-50/[0.03] border border-slate-100 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:border-pink-200">
              <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden mb-5">
                <Image
                  src="/images/mammography_screening.png"
                  alt="Community Health Camps"
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 400px"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-pink-50 px-2.5 py-1 rounded-md">
                    Clinical Camp
                  </span>
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Doctor Screened
                  </span>
                </div>
                <h4 className="font-heading text-lg font-bold text-slate-800">Community Health Camps</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Collaborating with NGOs to establish mobile clinics, execute clinical breast palpations (CBE), and schedule mammography details for rural areas.
                </p>
              </div>
            </div>

            {/* Activity 4 */}
            <div className="group bg-gradient-to-br from-white to-pink-50/[0.03] border border-slate-100 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:border-pink-200">
              <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden mb-5">
                <Image
                  src="/images/15.png"
                  alt="Educational Workshops"
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 400px"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-pink-50 px-2.5 py-1 rounded-md">
                    Seminar
                  </span>
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <Users className="h-3 w-3" /> Kit Distribution
                  </span>
                </div>
                <h4 className="font-heading text-lg font-bold text-slate-800">Educational Workshops</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Direct hands-on sessions demonstrating correct self-examination steps, warning indicator checks, and detailing how the Khushi Tactile Care Kit aids home testing.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= AWARENESS TIPS ================= */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-pink-50/20 border-y border-pink-100/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/50 text-primary text-xs font-bold uppercase tracking-wider">
              <HeartPulse className="h-3.5 w-3.5" /> Self Care
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Essential Awareness Tips
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Actionable wellness steps recommend by medical experts to verify tissue health and control risk conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Tip 1 */}
            <div className="bg-white border border-pink-100/30 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex gap-4 items-start group hover:border-pink-400 duration-300">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-pink-50 text-primary flex items-center justify-center border border-pink-100/20 group-hover:scale-105 transition-transform">
                <Check className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-slate-800 text-base">Monthly Breast Self Examination</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                  Select a set day monthly to examine your breasts in front of a mirror, check for shape changes, skin dimpling, or nipple discharge.
                </p>
              </div>
            </div>

            {/* Tip 2 */}
            <div className="bg-white border border-pink-100/30 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex gap-4 items-start group hover:border-pink-400 duration-300">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-pink-50 text-primary flex items-center justify-center border border-pink-100/20 group-hover:scale-105 transition-transform">
                <Check className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-slate-800 text-base">Get Regular Screenings</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                  Women over 40 should schedule annual mammograms. Younger women should get a Clinical Breast Exam (CBE) from a doctor every 1-3 years.
                </p>
              </div>
            </div>

            {/* Tip 3 */}
            <div className="bg-white border border-pink-100/30 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex gap-4 items-start group hover:border-pink-400 duration-300">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-pink-50 text-primary flex items-center justify-center border border-pink-100/20 group-hover:scale-105 transition-transform">
                <Check className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-slate-800 text-base">Maintain a Healthy Lifestyle</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                  Manage body weight, engage in daily aerobic exercises, limit alcohol intake, avoid smoking, and eat healthy fibrous nutrients.
                </p>
              </div>
            </div>

            {/* Tip 4 */}
            <div className="bg-white border border-pink-100/30 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex gap-4 items-start group hover:border-pink-400 duration-300">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-pink-50 text-primary flex items-center justify-center border border-pink-100/20 group-hover:scale-105 transition-transform">
                <Check className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-slate-800 text-base">Consult a Doctor Immediately</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                  If you feel any unusual lump, localized pain, swelling, skin puckering, dimpling, or nipple discharge, schedule an expert checkup.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= STATISTICS SECTION ================= */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="h-3.5 w-3.5" /> Impact Metrics
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Key Diagnostic & Support Statistics
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Verifiable oncology data proving the value of early screenings and community education networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Stat 1 */}
            <div className="bg-gradient-to-br from-white to-pink-50/[0.03] border border-pink-100/30 rounded-3xl p-8 text-center space-y-3 hover:shadow-lg transition-all duration-300 relative group hover:border-pink-300">
              <div className="text-5xl font-black text-primary tracking-tight group-hover:scale-105 transition-transform">
                98%<span className="text-primary/70 text-2xl font-bold">+</span>
              </div>
              <h4 className="font-heading font-bold text-slate-800 text-base">Stage I Survival Rate</h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                Early detection significantly improves treatment outcomes, delivering over 98% five-year survival indices.
              </p>
            </div>

            {/* Stat 2 */}
            <div className="bg-gradient-to-br from-white to-pink-50/[0.03] border border-pink-100/30 rounded-3xl p-8 text-center space-y-3 hover:shadow-lg transition-all duration-300 relative group hover:border-pink-300">
              <div className="text-5xl font-black text-primary tracking-tight group-hover:scale-105 transition-transform">
                40<span className="text-primary/70 text-2xl font-bold"> Yrs</span>
              </div>
              <h4 className="font-heading font-bold text-slate-800 text-base">Recommended Screening</h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                Regular screening helps identify breast cancer at an earlier stage. Women should get annual mammograms starting at 40.
              </p>
            </div>

            {/* Stat 3 */}
            <div className="bg-gradient-to-br from-white to-pink-50/[0.03] border border-pink-100/30 rounded-3xl p-8 text-center space-y-3 hover:shadow-lg transition-all duration-300 relative group hover:border-pink-300">
              <div className="text-5xl font-black text-primary tracking-tight group-hover:scale-105 transition-transform">
                70%<span className="text-primary/70 text-2xl font-bold">+</span>
              </div>
              <h4 className="font-heading font-bold text-slate-800 text-base">Campaign Impact</h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                Awareness campaigns encourage timely medical consultation, driving direct increases in early physical screens.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-pink-500 to-rose-600 text-white relative overflow-hidden">
        {/* Abstract shapes inside CTA */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[5%] w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-8 relative z-10">
          
          <div className="space-y-4">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Together We Can Spread Awareness
            </h2>
            <p className="text-pink-100 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
              Help us educate communities, support early checkup camps, and direct verified financial resources to cancer patient treatment plans.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-white hover:bg-slate-50 text-primary font-bold rounded-full py-6 px-8 shadow-lg active:scale-95 transition-all text-sm uppercase tracking-wider">
                Join Campaign
              </Button>
            </Link>
            <Link href="/campaigns" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-white/40 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full py-6 px-8 active:scale-95 transition-all text-sm uppercase tracking-wider">
                Become a Volunteer
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

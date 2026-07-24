"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Ribbon,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Play,
  Clock,
  Video,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

const cancerTypes = [
  {
    id: "preventive-wellness",
    title: "Self-Exam & Wellness",
    description: "Monthly self-examinations are the first line of defense. Learn standard breast cancer physical checkup routines and healthy wellness guidelines.",
    precautions: [
      "Perform monthly breast self-exams.",
      "Look for changes in shape, size, or texture.",
      "Maintain active exercise & healthy weight.",
      "Consult an expert immediately for any lumps."
    ],
    image: "/images/preventive_wellness.png",
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    link: "/learn" // Redirects to BSE-related guide / learn page
  },
  {
    id: "clinical-screenings",
    title: "Clinical Mammography Screenings",
    description: "Regular clinical checks and mammograms help detect changes early, long before they can be felt. Essential for women over 40.",
    precautions: [
      "Schedule annual mammograms after age 40.",
      "Get clinical breast exams every 1-3 years under 40.",
      "Consult doctors for personalized risk assessments.",
      "Discuss any family medical history of breast cancer."
    ],
    image: "/images/mammography_screening.png",
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    link: "/campaigns/breast-cancer"
  },
  {
    id: "support-group",
    title: "Support & Rehabilitation",
    description: "Navigating breast cancer is a journey best shared. Connect with professional counselors, medical facilitators, and survivor support groups.",
    precautions: [
      "Join certified peer-to-peer support groups.",
      "Access medical counseling and recovery advice.",
      "Participate in family awareness workshops.",
      "Engage in mental wellness & stress relief sessions."
    ],
    image: "/images/support_group.png",
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    link: "/campaigns/breast-cancer"
  },
  {
    id: "community-advocacy",
    title: "Community Outreach & Advocacy",
    description: "Join our active volunteer networks to spread breast cancer awareness in local communities, distribute care kits, and raise screening funds.",
    precautions: [
      "Volunteer for local screening camp coordination.",
      "Spread early detection materials in workplaces.",
      "Participate in Pink Ribbon walks & advocacy.",
      "Facilitate crowdfunding and clinical logistics."
    ],
    image: "/images/community_walk.png",
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    link: "/campaigns/breast-cancer"
  }
];

const kitVideos = [
  {
    title: "Breast Self-Examination (BSE) Walkthrough",
    duration: "3:45",
    description: "Detailed medical walkthrough demonstrating correct examination motions, finger pressure, and inspection zones.",
    src: "/cancer video.webm",
    thumbnail: "/images/preventive_wellness.png"
  },
  {
    title: "Khushi Tactile Care Kit Instructions",
    duration: "5:12",
    description: "Learn how to use the checkup cards, timeline planners, and tactile exam aids included in the Khushi Care Kit.",
    src: "/cancer3.webm",
    thumbnail: "/images/mammography_screening.png"
  },
  {
    title: "Early Screening Guidance by Oncologists",
    duration: "8:30",
    description: "Experienced medical practitioners explain screening frequencies, mammography, and answer common early patient questions.",
    src: "",
    thumbnail: "/images/support_group.png"
  }
];

export default function CampaignsPage() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoChange = (idx: number) => {
    setActiveVideoIndex(idx);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.log("Auto-play blocked or failed:", err);
      });
    }
  };

  return (
    <div className="flex-1 w-full bg-gradient-to-b from-muted/50 to-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Hub Header */}
        <div id="membership" className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Khushi Centre Initiatives
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground"
          >
            Our Active Campaigns & Programmes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base sm:text-lg"
          >
            Khushi&apos;s initiatives are evidence-based and guided by a holistic vision of Peace, Prosperity, and Resilience. Support or volunteer for our featured campaigns below.
          </motion.p>
        </div>

        {/* FEATURED: Breast Cancer Awareness Campaign */}
        <motion.div
          id="awareness"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-6 sm:p-10 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          {/* Decorative pink gradient background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl -z-10 group-hover:scale-110 transition-transform duration-500" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Highlight Callout Detail */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <Ribbon className="h-4 w-4" />
                Featured Highlight Campaign
              </span>

              <div className="space-y-3">
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  Breast Cancer Awareness Campaign
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Join our international-grade healthcare campaign. We are spreading crucial physical self-examination guidelines, organizing free clinical screening camps, and raising verified medical funds for underprivileged patient treatments.
                </p>
              </div>

              {/* Progress Bar Widget */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm font-semibold">
                  <span className="text-muted-foreground">Collected: <strong className="text-foreground">₹6,20,000</strong></span>
                  <span className="text-primary">Goal: ₹15,00,000</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "41.3%" }}
                    transition={{ delay: 0.8, duration: 1.2 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
                <p className="text-xs text-muted-foreground italic">
                  * 41% raised from 240+ verified donors. Direct hospital disbursement transfers.
                </p>
              </div>

              {/* Action Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/campaigns/breast-cancer">
                  <Button className="bg-primary hover:bg-primary/95 text-white font-semibold shadow-md active:scale-95 transition-all">
                    View Campaign Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/donate">
                  <Button variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-semibold active:scale-95 transition-all">
                    Donate Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* Campaign Visual Mock Illustration */}
            <div className="lg:col-span-5 flex items-center justify-center p-4">
              <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/5 border border-primary/10 w-full max-w-sm text-center space-y-4 shadow-inner">
                <Ribbon className="h-16 w-16 text-primary mx-auto animate-pulse" />
                <div className="space-y-1">
                  <p className="text-lg font-bold text-foreground">Together We Can Fight</p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Breast Cancer Campaign</p>
                </div>
                <div className="py-2 border-t border-border flex justify-around text-xs font-semibold">
                  <div>
                    <p className="text-primary font-bold text-base">500+</p>
                    <p className="text-muted-foreground text-[10px]">RSVP&apos;d</p>
                  </div>
                  <div className="border-x border-border/80 px-4">
                    <p className="text-primary font-bold text-base">100%</p>
                    <p className="text-muted-foreground text-[10px]">Audited</p>
                  </div>
                  <div>
                    <p className="text-primary font-bold text-base">₹50L</p>
                    <p className="text-muted-foreground text-[10px]">Pledges</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* REDESIGNED: Grid of Breast Cancer Mission Campaigns */}
        <div id="education" className="space-y-8">
          <div className="border-b border-border pb-4 flex justify-between items-end">
            <h3 className="font-heading text-2xl font-bold text-foreground">Breast Cancer Mission & Prevention</h3>
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              {cancerTypes.length} Core Areas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cancerTypes.map((camp, idx) => {
              return (
                <motion.div
                  key={camp.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx + 0.3 }}
                  className="group flex flex-col justify-between p-6 rounded-3xl border border-border/60 bg-card hover:border-pink-300/60 dark:hover:border-pink-900/50 hover:shadow-xl hover:shadow-pink-100/30 dark:hover:shadow-pink-950/10 hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Realistic image display at top of card */}
                    <div className="relative h-48 sm:h-52 w-full rounded-2xl overflow-hidden mb-2 bg-muted border border-border/40">
                      <Image
                        src={camp.image}
                        alt={camp.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={idx < 2}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                        <Ribbon className="h-3 w-3" />
                        Mission Initiative
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {camp.title}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {camp.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border/50">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider block">Precautions & Guidelines:</span>
                      <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                        {camp.precautions.map((prec, pIdx) => (
                          <li key={pIdx} className="leading-relaxed">
                            {prec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 mt-auto">
                    {camp.link ? (
                      <Link href={camp.link}>
                        <Button variant="ghost" className="p-0 hover:bg-transparent text-primary text-xs font-bold tracking-wide uppercase flex items-center gap-1 group-hover:gap-1.5 transition-all">
                          Learn More & Support
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="ghost" className="p-0 hover:bg-transparent text-muted-foreground text-xs font-bold tracking-wide uppercase flex items-center gap-1 transition-all cursor-default">
                        Awareness Info Only
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* NEW: Breast Cancer Care  & Video Section */}
        <div id="volunteers" className="space-y-8 pt-12 border-t border-border/80">
          <div className="space-y-3 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-xs font-bold uppercase tracking-wider">
              <Video className="h-3.5 w-3.5" />
              Khushi Care  & Video Guides
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">❤️ Our Journey of Hope & Healing</h3>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
              Understand breast self-examinations (BSE) and explore the step-by-step video guides included with the Khushi Care Kit for early detection and prevention.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Video Player Container */}
            <div className="lg:col-span-8 bg-card border border-border/60 rounded-3xl overflow-hidden shadow-md flex flex-col">
              <div className="relative aspect-video bg-black w-full overflow-hidden group/player">
                {kitVideos[activeVideoIndex].src ? (
                  <video
                    ref={videoRef}
                    key={kitVideos[activeVideoIndex].src} // helps react identify source change
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                    autoPlay={activeVideoIndex > 0} // Autoplay on switch
                    preload="metadata"
                  >
                    <source src={kitVideos[activeVideoIndex].src} type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 p-6 text-center text-zinc-400 space-y-4">
                    <Video className="h-16 w-16 text-pink-500/80 animate-pulse" />
                    <div className="space-y-2">
                      <p className="text-white font-semibold text-lg">Oncologist Insights Video</p>
                      <p className="text-xs text-zinc-500 max-w-sm">This video is currently being prepared for streaming. Check back soon for clinical expert details.</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-3">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-500 uppercase tracking-widest bg-pink-50 dark:bg-pink-950/40 px-2.5 py-1 rounded-md">
                    Active Walkthrough
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Duration: {kitVideos[activeVideoIndex].duration}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-foreground">
                  {kitVideos[activeVideoIndex].title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {kitVideos[activeVideoIndex].description}
                </p>
              </div>
            </div>

            {/* Playlist Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 bg-muted/40 rounded-2xl border border-border/40">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                  Playlist Walkthroughs
                </span>
                <span className="text-[10px] text-muted-foreground">Select a video below to start playing</span>
              </div>

              <div className="space-y-3">
                {kitVideos.map((video, idx) => {
                  const isActive = idx === activeVideoIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleVideoChange(idx)}
                      className={`w-full text-left flex items-start gap-3 p-3 rounded-2xl border transition-all duration-300 ${isActive
                        ? "bg-pink-500/5 border-pink-500/30 shadow-xs"
                        : "bg-card border-border/60 hover:border-pink-200/50 hover:bg-pink-500/[0.01]"
                        }`}
                    >
                      <div className="relative h-16 w-24 rounded-lg overflow-hidden shrink-0 bg-muted border border-border/40">
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                        <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                          <Play className={`h-5 w-5 ${isActive ? "text-pink-400 fill-pink-400 scale-110" : "text-white"} transition-transform`} />
                        </div>
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-0.5">
                            <Clock className="h-2.5 w-2.5" />
                            {video.duration}
                          </span>
                          {isActive && (
                            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-pink-500 animate-ping" />
                          )}
                        </div>
                        <p className={`text-xs font-bold truncate ${isActive ? "text-pink-600 dark:text-pink-400" : "text-foreground"}`}>
                          {video.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground line-clamp-2">
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

      </div>
    </div>
  );
}

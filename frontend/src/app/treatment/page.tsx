"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ribbon,
  ArrowRight,
  Sparkles,
  Activity,
  HeartHandshake,
  ClipboardCheck,
  UserRoundCheck,
  Phone,
  MessageCircle,
  Calendar,
  ChevronDown,
  Info,
  ShieldCheck,
  Check,
  Leaf,
  CheckCircle2,
  ArrowDown,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  Video,
  Clock,
  Play
} from "lucide-react";

const diagnosisMethods = {
  mammography: {
    title: "Mammography (X-Ray Screening)",
    description: "A Mammogram is a specialized, low-dose breast X-ray that creates highly detailed images of internal tissues. It is widely considered the gold standard for early-stage screening, capable of detecting abnormal growths, microcalcifications, or architectural distortions up to two years before they can be physically felt by a hand examination.",
    recom: "Recommended annually for all women aged 40 and above, or earlier for individuals with a known familial history of breast oncology.",
    benefits: [
      "Finds early calcifications & micro-lumps",
      "Most validated early-stage screening tool",
      "Fast, outpatient clinical procedure"
    ]
  },
  ultrasound: {
    title: "Breast Ultrasound (Sonography)",
    description: "Breast Ultrasound utilizes high-frequency sonic waves to generate live, detailed cross-sectional views of breast structure. This modality is extremely effective at distinguishing between solid masses (which require further investigation) and fluid-filled simple cysts (which are typically benign). It is also widely used as a supplementary tool for younger women who have dense breast tissue where mammograms might be less clear.",
    recom: "Typically ordered by clinicians as a diagnostic follow-up to check specific lumps felt during self-exams or highlighted in mammograms.",
    benefits: [
      "Completely radiation-free technology",
      "Differentiates fluid cysts from solid lumps",
      "Ideal for dense breast profiles"
    ]
  },
  mri: {
    title: "Breast MRI (Magnetic Resonance)",
    description: "Breast Magnetic Resonance Imaging (MRI) employs powerful magnetic fields and radio wave pulses to produce highly comprehensive, three-dimensional diagnostic records of the soft tissues. It provides exceptional contrast, making it crucial for detailed staging of confirmed cases, mapping out exact tumor dimensions before surgical lumpectomy, or checking the integrity of breast implants.",
    recom: "Indicated primarily for high-risk patients with genetic predispositions (BRCA1/BRCA2) or for clinical staging post-biopsy.",
    benefits: [
      "Extremely high-sensitivity soft-tissue contrast",
      "Measures exact margins of tumor tissue",
      "Evaluates treatment response post-chemo"
    ]
  },
  biopsy: {
    title: "Breast Biopsy (Pathology Confirmation)",
    description: "A Biopsy is the definitive diagnostic procedure to confirm whether a lump contains malignant or benign cells. During a biopsy, a specialist uses a hollow core needle or fine needle aspiration (often guided by ultrasound or mammogram imaging) to extract minor tissue cylinders. These samples are sent directly to a pathology laboratory where cellular structure is examined under a microscope.",
    recom: "Performed whenever non-invasive imaging scans show highly suspicious structural changes or indeterminate findings.",
    benefits: [
      "The definitive confirmatory check",
      "Identifies hormone receptors (ER, PR, HER2)",
      "Determines the exact tumor grading"
    ]
  }
};

const diagnosisVideos = [
  {
    title: "Early Screening Guidance by Clinical Experts",
    duration: "8:30",
    description: "Oncologists explain standard diagnostic pathways, clinical screening protocols, mammography frequencies, and answer general early consultation inquiries.",
    src: "/VID-20260715-WA0006.mp4"
  },
  {
    title: "Breast Self-Examination (BSE) Guided Checkup",
    duration: "3:45",
    description: "Detailed medical walkthrough demonstrating correct examination motions, fingers pressure, and inspection zones.",
    src: "/cancer video.webm"
  },
  {
    title: "Khushi Tactile Care Kit Instructions",
    duration: "5:12",
    description: "Learn how to use the checkup cards, timeline trackers, and tactile exam aids included in the Khushi Care Kit.",
    src: "/cancer3.webm"
  }
];

// Horizontal steps for Section 7
const treatmentJourneySteps = [
  { step: "01", label: "Registration", desc: "Patient onboarding and profile setup." },
  { step: "02", label: "Assessment", desc: "Detailed document review & screening." },
  { step: "03", label: "Consultation", desc: "Virtual or clinic oncologist session." },
  { step: "04", label: "Care Planning", desc: "Custom clinical & supportive mapping." },
  { step: "05", label: "Active Monitoring", desc: "Regular follow-ups & dose balancing." },
  { step: "06", label: "Recovery Support", desc: "Post-care strength & rehabilitation." }
];

// Trust items for Section 6
const trustPillars = [
  { title: "Research Focus", desc: "Continuous research in Ayurvedic oncology formulations.", icon: ShieldCheck },
  { title: "Traditional Knowledge", desc: "Authentic formulations rooted in text-based herbology.", icon: Leaf },
  { title: "Quality Manufacturing", desc: "State-of-the-art GMP certified facilities.", icon: CheckCircle2 },
  { title: "Patient Support", desc: "Dedicated counselor lines and doctor connects.", icon: HeartHandshake },
  { title: "Natural Ingredients", desc: "Organically grown, pure herbs tested for heavy metals.", icon: Sparkles },
  { title: "Continuous Innovation", desc: "Evolving products for enhanced cellular absorption.", icon: Activity }
];

export default function TreatmentPage() {
  const [videoMuted, setVideoMuted] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: "", email: "", phone: "", date: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [activeDiagTab, setActiveDiagTab] = useState<string>("mammography");
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoChange = (idx: number) => {
    setActiveVideoIndex(idx);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setBookingOpen(false);
      setFormSubmitted(false);
      setBookingForm({ name: "", email: "", phone: "", date: "", message: "" });
    }, 2500);
  };

  return (
    <div className="flex-1 w-full bg-white text-slate-800 font-sans selection:bg-pink-100 selection:text-pink-700 overflow-x-hidden">

      {/* ================================================
          SECTION 1 - HERO VIDEO
         ================================================ */}
      <section className="relative h-[90vh] md:h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted={videoMuted}
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/VID-20260715-WA0006.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video Overlay - Dark with slight pink gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-pink-950/20 z-10" />

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20 space-y-6 max-w-4xl pt-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/20 backdrop-blur-md border border-pink-400/30 text-pink-100 text-xs font-bold uppercase tracking-wider"
          >
            <Ribbon className="h-3.5 w-3.5 text-pink-400 animate-pulse" />
            Integrative Healthcare
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight"
          >
            Every Life Deserves <span className="text-pink-300">Hope.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            We believe every patient deserves compassionate care, advanced research, and continuous support throughout the treatment journey.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
          >
            <a href="#overview-story">
              <Button size="lg" className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full shadow-lg shadow-pink-600/20 px-8">
                Learn About Treatment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="#contact-specialist">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white bg-white/10 hover:bg-white/20 font-semibold rounded-full backdrop-blur-sm px-8">
                Talk to Our Expert
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Mute/Unmute Float Control */}
        <button
          onClick={() => setVideoMuted(!videoMuted)}
          className="absolute bottom-8 right-8 z-20 h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer shadow-md"
          title={videoMuted ? "Unmute Background" : "Mute Background"}
        >
          {videoMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-white/60 text-[10px] tracking-widest font-bold uppercase animate-bounce">
          <span>Scroll</span>
          <ArrowDown className="h-3 w-3" />
        </div>
      </section>

      {/* ================================================
          SECTION 2 - EMOTIONAL STORY
         ================================================ */}
      <section id="overview-story" className="py-24 bg-gradient-to-b from-rose-50/20 via-white to-rose-50/10 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Column: Large Emotional Image */}
            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-pink-400 to-purple-400 rounded-3xl opacity-20 blur-xl -z-10" />
              <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl border border-pink-100">
                <Image
                  src="/image.png"
                  alt="Compassionate patient support care"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* Right Column: Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block">
                Our Philosophy
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                You Are Not Fighting <span className="text-pink-600">Alone.</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Facing a breast cancer diagnosis is a profound and emotional journey that impacts the entire family structure. We walk by your side at every step. We integrate advanced clinical research with deeply supportive, patient-first care pathways to maximize healing capacity.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                By nurturing emotional health, providing evidence-based wellness guidelines, and introducing holistic support mechanisms, we aim to build resilience, restore vitality, and keep the flame of hope burning brightly.
              </p>

              {/* Animated Quote Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-2xl border border-pink-100 bg-white/70 backdrop-blur-md shadow-lg shadow-pink-100/20 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-pink-500 to-purple-500" />
                <p className="text-pink-700 italic font-semibold text-sm sm:text-base">
                  &ldquo;Cancer may change your life, but it doesn&apos;t define your future.&rdquo;
                </p>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mt-2">
                  Supportive Care Core
                </span>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================
          SECTION 3 - COMPREHENSIVE DIAGNOSTICS & VIDEOS
         ================================================ */}
      <section id="diagnosis" className="py-24 bg-white border-y border-rose-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-16">
          
          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block">
              Clinical Standards
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
              Breast Cancer Diagnosis Options
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Early and accurate diagnosis is critical. Learn about standard clinical pathways, when they are recommended, and explore patient video walkthroughs.
            </p>
          </div>

          {/* Diagnostic Modalities Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Vertical Tabs */}
            <div className="lg:col-span-4 flex flex-col gap-2.5">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 px-1">
                Diagnostic Modalities
              </h4>
              {(Object.keys(diagnosisMethods) as Array<keyof typeof diagnosisMethods>).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveDiagTab(key)}
                  className={`w-full p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex items-center justify-between group ${
                    activeDiagTab === key
                      ? "bg-pink-50/60 border-pink-200 text-pink-700 shadow-xs"
                      : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="font-bold text-sm sm:text-base tracking-tight">
                    {key === "mammography" && "Mammography"}
                    {key === "ultrasound" && "Ultrasound"}
                    {key === "mri" && "Breast MRI"}
                    {key === "biopsy" && "Biopsy Confirmation"}
                  </span>
                  <ArrowRight className={`h-4 w-4 transition-transform ${
                    activeDiagTab === key 
                      ? "translate-x-1 text-pink-600" 
                      : "text-slate-300 group-hover:translate-x-1 group-hover:text-slate-400"
                  }`} />
                </button>
              ))}
            </div>

            {/* Right Column: Tab Content */}
            <Card className="lg:col-span-8 border-slate-100 bg-slate-50/20 p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-100/50 text-pink-700 text-[10px] font-bold uppercase tracking-wider">
                  {activeDiagTab === "biopsy" ? "Invasive Diagnostic" : "Non-Invasive Imaging"}
                </span>
                <h3 className="font-heading text-2xl font-black text-slate-800 tracking-tight">
                  {diagnosisMethods[activeDiagTab as keyof typeof diagnosisMethods].title}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {diagnosisMethods[activeDiagTab as keyof typeof diagnosisMethods].description}
                </p>
                
                <div className="p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/10 space-y-1">
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" /> Clinical Recommendation Criteria
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {diagnosisMethods[activeDiagTab as keyof typeof diagnosisMethods].recom}
                  </p>
                </div>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-3 pt-2">
                <h4 className="font-heading text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Key Benefits & Clinical Value
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {diagnosisMethods[activeDiagTab as keyof typeof diagnosisMethods].benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

          </div>

          {/* Videos Subsection */}
          <div className="space-y-8 pt-8 border-t border-slate-100">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                <Video className="h-3.5 w-3.5" />
                Clinical Video Walkthroughs
              </span>
              <h3 className="font-heading text-2xl font-bold text-slate-800">
                Early Screening & Consultation Video Guides
              </h3>
              <p className="text-slate-500 text-sm max-w-2xl">
                Explore the official patient screening walkthroughs and self-examination video instructions. Select any video below to load it into the player.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Main Player Container */}
              <div className="lg:col-span-8 bg-card border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col bg-white">
                <div className="relative aspect-video bg-black w-full overflow-hidden">
                  {diagnosisVideos[activeVideoIndex].src ? (
                    <video
                      ref={videoRef}
                      key={diagnosisVideos[activeVideoIndex].src}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                      autoPlay={activeVideoIndex > 0}
                      preload="metadata"
                    >
                      <source src={diagnosisVideos[activeVideoIndex].src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-400 space-y-4">
                      <Video className="h-16 w-16 text-pink-500/80 animate-pulse" />
                      <p className="text-white font-semibold">Video Not Available</p>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-3 bg-white">
                  <div className="flex flex-wrap gap-2 items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-2.5 py-1 rounded-md">
                      Active Walkthrough
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Duration: {diagnosisVideos[activeVideoIndex].duration}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">
                    {diagnosisVideos[activeVideoIndex].title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {diagnosisVideos[activeVideoIndex].description}
                  </p>
                </div>
              </div>

              {/* Sidebar: Video Selectors */}
              <div className="lg:col-span-4 space-y-4">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Video className="h-4.5 w-4.5 text-pink-500" />
                  Select Walkthrough Video
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {diagnosisVideos.map((vid, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleVideoChange(idx)}
                      className={`flex gap-3.5 p-3 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${
                        activeVideoIndex === idx
                          ? "bg-pink-50/50 border-pink-200 shadow-xs"
                          : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                      }`}
                    >
                      <div className="h-14 w-20 shrink-0 rounded-xl bg-slate-100 border border-slate-200/50 relative overflow-hidden flex items-center justify-center">
                        <Play className="h-4.5 w-4.5 text-pink-500 fill-pink-500" />
                        <div className="absolute bottom-1 right-1 bg-black/75 px-1 py-0.5 rounded text-[8px] text-white font-bold">
                          {vid.duration}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-bold text-xs text-slate-800 line-clamp-1">
                          {vid.title}
                        </h5>
                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                          {vid.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================================================
          SECTION 4 -  APOCAN TREATMENT
         ================================================ */}
      <section className="py-24 bg-gradient-to-b from-rose-50/10 via-white to-purple-50/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left: Premium Product Showcase Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-purple-300 rounded-3xl opacity-10 blur-2xl z-0" />
              <div className="relative bg-white/60 backdrop-blur-xl border border-pink-100 p-8 sm:p-10 rounded-3xl shadow-xl w-full max-w-sm text-center space-y-6 z-10">

                {/* Visual Representation of Apocan */}
                <div className="relative w-48 h-48 mx-auto bg-gradient-to-tr from-pink-50 to-rose-100 rounded-2xl border border-pink-100 flex items-center justify-center overflow-hidden group shadow-inner">
                  <Ribbon className="h-24 w-24 text-pink-400 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Apocan
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold tracking-widest text-amber-600 uppercase bg-amber-50 px-2.5 py-0.5 rounded-md inline-block border border-amber-200/40">
                    Premium Wellness Kit
                  </span>
                  <h3 className="font-heading text-2xl font-black text-slate-900">  Advance APOCAN Capsule </h3>
                  <p className="text-xs text-muted-foreground">Natural Supportive Formulation</p>
                </div>

                <div className="py-2 border-t border-border flex justify-around text-xs font-semibold text-slate-700">
                  <div>
                    <p className="text-pink-600 font-bold text-base">Pure</p>
                    <p className="text-[9px] text-muted-foreground uppercase">Herbal</p>
                  </div>
                  <div className="border-x border-border/80 px-4">
                    <p className="text-pink-600 font-bold text-base">GMP</p>
                    <p className="text-[9px] text-muted-foreground uppercase">Certified</p>
                  </div>
                  <div>
                    <p className="text-pink-600 font-bold text-base">Safe</p>
                    <p className="text-[9px] text-muted-foreground uppercase">Heavy-Metal Tested</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Product Narrative & Traditional Ingredients */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block">
                Ayurvedic Supportive Care
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                APOCAN Advance Capsule
              </h2>
              <p className="text-slate-500 font-semibold text-sm sm:text-base">
                Natural Support Inspired by Ayurvedic Principles
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Apocan is developed as a holistic botanical support kit designed to complement the body&apos;s natural strength and recovery cycle during healing phases. Drawing upon classical Ayurvedic knowledge, this product focuses on systemic restoration and tissue support.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our approach emphasizes cellular health, metabolic cleansing, and immunity protection without relying on harsh synthetic chemicals. It serves as supportive wellness care, and detailed dosage and timing should always be aligned with professional oncologist instructions.
              </p>

              {/* Beautiful Ingredient Cards Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-2xs hover:border-pink-200 transition-colors flex items-start gap-3">
                  <Leaf className="h-5 w-5 text-pink-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">Haridra (Curcuma)</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Cell health & free radical shield.</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-2xs hover:border-pink-200 transition-colors flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-pink-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">Guduchi (Giloy)</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Immunomodulating wellness support.</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-2xs hover:border-pink-200 transition-colors flex items-start gap-3">
                  <Activity className="h-5 w-5 text-pink-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">Marica (Black Pepper)</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Digestive Agni & bio-absorption.</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-2xs hover:border-pink-200 transition-colors flex items-start gap-3">
                  <HeartHandshake className="h-5 w-5 text-pink-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">Tulasi (Holy Basil)</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Vital adaptogen for physical stress.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================================================
          SECTION 6 - WHY PATIENTS TRUST US
         ================================================ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block">
              Our Core Pillars
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
              Why Patients Trust Us
            </h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">
              We stand for certified clinical rigor, safe manufacturing standards, and compassionate counselor availability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trustPillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-pink-200 hover:shadow-lg shadow-2xs transition-all duration-300"
                >
                  <div className="h-10 w-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================
          SECTION 7 - TREATMENT JOURNEY
         ================================================ */}
      <section className="py-24 bg-gradient-to-b from-rose-50/15 via-white to-rose-50/15 border-t border-rose-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full inline-block">
              Workflow Steps
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
              Patient Journey Workflow
            </h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">
              Our structured step-by-step care timeline designed to keep patients informed and monitored throughout.
            </p>
          </div>

          {/* Horizontal Step Timeline on Desktop, stacked on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">

            {/* Desktop Connective Line */}
            <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-dashed bg-pink-200 -z-10" />

            {treatmentJourneySteps.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-pink-200 hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                  <span className="h-7 w-7 rounded-lg bg-pink-500 text-white text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">
                    Step {idx + 1}
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm">
                    {item.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
          SECTION 8 - FREQUENTLY ASKED QUESTIONS
         ================================================ */}
      <section className="py-24 bg-white max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block">
            Common Inquiries
          </span>
          <h2 className="font-heading text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Custom Accordion */}
        <div className="space-y-4">
          {[
            {
              q: "Who should consult before taking this product?",
              a: "Any patient diagnosed with breast cancer or undergoing active clinical medical treatments (chemotherapy, radiation therapy, immunotherapy) must consult their primary oncology practitioner before integrating Apocan or Apocan Advance."
            },
            {
              q: "Can it be taken alongside conventional medical treatment?",
              a: "Apocan is designed as a supportive wellness formulation. However, we advise patients to share our ingredient sheet with their licensed physician to structure appropriate dosage timing and avoid potential metabolic cross-reactions."
            },
            {
              q: "How should it be used?",
              a: "Usage must be strictly guided by a registered Ayurvedic practitioner or physician. Standard support dosages typically involve taking the designated tablets/liquids post-meals with warm water twice a day, or as indicated on the prescription."
            },
            {
              q: "What are the storage instructions?",
              a: "Store the products in a dry, cool environment away from direct exposure to solar heat or humidity. Secure the containers tightly after opening, and store safely out of reach of children."
            },
            {
              q: "What are the important precautions?",
              a: "If you observe any discomfort, nausea, skin rashes, or metabolic changes upon intake, immediately halt use and report details to a medical specialist. Do not exceed the advised daily intake thresholds."
            }
          ].map((item, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-100 rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:border-pink-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center p-5 text-left font-semibold text-slate-800 text-sm sm:text-base cursor-pointer hover:bg-slate-50/50"
                >
                  <span>{item.q}</span>
                  <div className="h-6 w-6 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center transition-transform duration-300">
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 bg-slate-50/30 text-xs sm:text-sm text-slate-500 p-5 leading-relaxed"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================
          SECTION 9 - MEDICAL DISCLAIMER
         ================================================ */}
      {/* <section className="py-12 bg-white max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-500/[0.03] border border-amber-500/25 flex flex-col sm:flex-row gap-4 items-start shadow-xs">
          <Info className="h-8 w-8 text-amber-500 shrink-0 mt-1" />
          <div className="space-y-2">
            <h4 className="font-bold text-amber-800 uppercase tracking-widest text-xs">
              Important Notice & Medical Disclaimer
            </h4>
            <p className="text-xs sm:text-sm text-amber-700/80 leading-relaxed">
              The information and botanical showcases displayed on this platform are for educational and awareness purposes only. 
              Treatment decisions should always be taken in consultation with qualified healthcare professionals. 
              The products shown should not be interpreted as guaranteed cures or replacements for prescribed medical care.
            </p>
          </div>
        </div>
      </section> */}

      {/* ================================================
          SECTION 10 - CONTACT SPECIALISTS (CTA)
         ================================================ */}
      <section id="contact-specialist" className="py-24 bg-gradient-to-b from-rose-50/10 via-white to-rose-50/20 text-center relative border-t border-rose-100/30">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block">
            Support Hotline
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
            Need Guidance?
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto">
            Talk with our specialized counselors or medical coordinators to understand patient alignment and product formulations.
          </p>

          {/* Quick Action buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <a href="tel:+918001234567" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                Call Coordinator
              </Button>
            </a>
            <a href="https://wa.me/918001234567" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 flex items-center justify-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </Button>
            </a>
            <Button
              size="lg"
              onClick={() => setBookingOpen(true)}
              className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white rounded-full px-6 flex items-center justify-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Book Consultation
            </Button>
          </div>
        </div>

        {/* Modal Booking Form */}
        <AnimatePresence>
          {bookingOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-100 shadow-2xl relative"
              >
                <button
                  onClick={() => setBookingOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer h-8 w-8 flex items-center justify-center rounded-full bg-slate-50"
                >
                  &times;
                </button>

                {!formSubmitted ? (
                  <form onSubmit={handleBookingSubmit} className="space-y-4 text-left">
                    <div className="space-y-1 text-center pb-2 border-b">
                      <h4 className="font-bold text-lg text-slate-800">Book Free Consultation</h4>
                      <p className="text-xs text-muted-foreground">Submit your details and a coordinator will call you back.</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Name</label>
                      <input
                        type="text"
                        required
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                        className="w-full text-sm p-3 rounded-xl border border-slate-200 outline-hidden focus:border-pink-500 bg-slate-50/50"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                        className="w-full text-sm p-3 rounded-xl border border-slate-200 outline-hidden focus:border-pink-500 bg-slate-50/50"
                        placeholder="Contact number"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Date Preference</label>
                      <input
                        type="date"
                        required
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                        className="w-full text-sm p-3 rounded-xl border border-slate-200 outline-hidden focus:border-pink-500 bg-slate-50/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Message / Diagnosis Stage</label>
                      <textarea
                        value={bookingForm.message}
                        onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                        className="w-full text-sm p-3 rounded-xl border border-slate-200 outline-hidden focus:border-pink-500 bg-slate-50/50 h-20 resize-none"
                        placeholder="Brief notes (optional)"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-xl py-3 mt-2">
                      Submit Request
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                      <Check className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800">Booking Request Submitted!</p>
                      <p className="text-xs text-muted-foreground">Our oncology care coordinator will contact you shortly.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* ================================================
          SECONDARY PAGES FOOTER LINKS
         ================================================ */}
      <section className="bg-slate-50 py-12 border-t border-slate-200/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Ribbon className="h-5 w-5 text-pink-500" />
            <span className="font-heading font-bold text-sm text-slate-800">Healthcare Core Values:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-500">
            <span className="hover:text-pink-600 transition-colors">Hope</span>
            <span>&bull;</span>
            <span className="hover:text-pink-600 transition-colors">Research</span>
            <span>&bull;</span>
            <span className="hover:text-pink-600 transition-colors">Compassion</span>
            <span>&bull;</span>
            <span className="hover:text-pink-600 transition-colors">Innovation</span>
            <span>&bull;</span>
            <span className="hover:text-pink-600 transition-colors">Patient Care</span>
          </div>
        </div>
      </section>

    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WebinarRegisterButton from "@/components/webinars/WebinarRegisterButton";
import Link from "next/link";
import { 
  Ribbon, 
  Heart, 
  Users, 
  Calendar, 
  Award, 
  ShieldCheck, 
  Plus, 
  Minus,
  CheckCircle,
  FileText,
  AlertCircle,
  ArrowRight,
  BookOpen,
  MapPin,
  Mail,
  Phone,
  Send,
  Download,
  Share2,
  IndianRupee,
  ChevronRight,
  Sparkles,
  Info,
  Activity,
  HeartPulse,
  HeartCrack,
  Clock,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BreastCancerCampaignPage() {
  // Session User State
  const [currentUser, setCurrentUser] = useState<any>(null);
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const session = await res.json();
          if (session?.user) {
            setCurrentUser(session.user);
          }
        }
      } catch (e) {
        console.error("Failed to fetch session", e);
      }
    };
    fetchSession();
  }, []);

  // 1. Navbar Scroll Shrink state
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Hero Slider Autoplay state
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // 3. Donation and Calculator widgets states
  const [goal] = useState(1500000);
  const [collected, setCollected] = useState(620000);
  const [selectedDonation, setSelectedDonation] = useState<number | null>(2500);
  const [customDonation, setCustomDonation] = useState("");
  const [showDonateSuccess, setShowDonateSuccess] = useState(false);
  const [donating, setDonating] = useState(false);
  const [donorsCount, setDonorsCount] = useState(242);

  // 4. Testimonial tabs states
  const [activeStoryTab, setActiveStoryTab] = useState<"patient" | "volunteer" | "doctor">("patient");

  // 5. Accordion FAQs states
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  // 6. Doctor Consultation webinar slot modal states
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingEmail, setBookingEmail] = useState("");

  // 7. General contact request states
  const [contactSuccess, setContactSuccess] = useState(false);

  // Form submits handlers
  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = selectedDonation || parseFloat(customDonation);
    if (!amount || amount <= 0) return;

    setDonating(true);
    setTimeout(() => {
      setCollected((prev) => prev + amount);
      setDonorsCount((prev) => prev + 1);
      setDonating(false);
      setShowDonateSuccess(true);
      setTimeout(() => setShowDonateSuccess(false), 4000);
    }, 1500);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingEmail) return;
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedDoctor(null);
      setBookingEmail("");
    }, 2500);
  };

  // Slides configuration
  const slides = [
    {
      title: "Together We Can Fight Breast Cancer",
      subtitle: "Early Detection Saves Lives. Empower yourself with guidelines, diagnostics, and support networks.",
      tag: "Campaign & Khushi Collaboration",
      imageText: "Pink Ribbon Hope",
      primaryBtn: "Join Campaign",
      primaryLink: "#volunteer",
      secondaryBtn: "Donate Now",
      secondaryLink: "/donate",
      themeColor: "from-pink-500/20 via-purple-500/10 to-background"
    },
    {
      title: "Spread Awareness & Support Patients",
      subtitle: "Early staging diagnostics yield up to 95% survival ratios. Helping financially weak patients with direct hospital payouts.",
      tag: "Clinical Staging Support",
      imageText: "Clinician Patient Consultation",
      primaryBtn: "Learn Self-Exam Guide",
      primaryLink: "#breast-cancer-info",
      secondaryBtn: "Support Patients",
      secondaryLink: "/donate",
      themeColor: "from-emerald-500/10 via-pink-500/10 to-background"
    },
    {
      title: "Doctors, Researchers & Hospitals",
      subtitle: "Working together to map clinical statistics, distribute resources, and publish peer-reviewed academic papers.",
      tag: "Academic Medical Group",
      imageText: "Medical Laboratory Science",
      primaryBtn: "View Research Papers",
      primaryLink: "#research",
      secondaryBtn: "Meet Doctors",
      secondaryLink: "#doctors",
      themeColor: "from-purple-500/20 via-blue-500/10 to-background"
    },
    {
      title: "Support Financially Weak Patients",
      subtitle: "100% audited donations routed straight to associated hospital clearing bank accounts. No personal channel fraud.",
      tag: "Transparent Crowdfunding",
      imageText: "Community Fundraising Drive",
      primaryBtn: "Donate to Hospital Fund",
      primaryLink: "/donate",
      secondaryBtn: "Tax Exempt Details",
      secondaryLink: "#faq",
      themeColor: "from-amber-500/15 via-rose-500/10 to-background"
    },
    {
      title: "Become an Active Volunteer",
      subtitle: "Attend wellness seminars, complete campaigns checks, and receive your QR-verified digital participation certificate.",
      tag: "Volunteer Community Core",
      imageText: "Students Awareness Camp",
      primaryBtn: "Become Volunteer",
      primaryLink: "#volunteer",
      secondaryBtn: "Preview Certificates",
      secondaryLink: "#certificate",
      themeColor: "from-cyan-500/15 via-purple-500/10 to-background"
    }
  ];

  // Testimonials database
  const stories = {
    patient: {
      name: "Meera Krishnan",
      role: "Mastectomy Survivor & Advocate",
      story: "When I was diagnosed with Stage II breast cancer, chemotherapy costs seemed impossible. Through this campaign, my surgical expenses were directly cleared to the hospital. Today, I am cancer-free and volunteer my time to guide other rural patients.",
      badge: "Stage II Survivor",
      color: "from-pink-500 to-rose-600"
    },
    volunteer: {
      name: "Rahul Verma",
      role: "Noida Campus Volunteer Lead",
      story: "I helped distribute self-check brochures and organized awareness webinars in three nearby sectors. Getting the verified digital certificate was highly motivating. It's rewarding to see young women feel empowered instead of scared.",
      badge: "Youth Leader",
      color: "from-purple-500 to-indigo-600"
    },
    doctor: {
      name: "Dr. Ananya Roy",
      role: "Lead Surgical Oncologist",
      story: "Clinical stigma is the biggest enemy of oncology. By joining our campaign & Khushi, we bypass intermediate barriers. Our clinical webinars educate thousands of women, and the platform audits diagnostic slips in hours.",
      badge: "Medical Advisor",
      color: "from-emerald-500 to-teal-600"
    }
  };

  const faqs = [
    {
      q: "What is the physical Breast Self-Examination (BSE) schedule?",
      a: "Women over 20 should perform a BSE monthly, ideally 3 to 5 days after their menstruation ends when breasts are least tender. Consistent self-inspection helps detect anomalies, skin dimpling, or micro-lumps early."
    },
    {
      q: "How do we ensure crowdfunding donation safety?",
      a: "We route payouts directly to registered hospital bank accounts instead of personal wallets. Compliance teams audit the medical bill estimates, treatment charts, and hospital receipts before clearing any donation disbursement."
    },
    {
      q: "How can I obtain the verified digital certificate?",
      a: "Once you attend our scheduled awareness webinars or volunteer walks, or clear our cancer screening quizzes with a score of 80% or above, a unique, cryptographically signed certificate with a validation QR code will be sent to your email."
    },
    {
      q: "Can I donate anonymously and qualify for tax exemptions?",
      a: "Yes. You can select the anonymous donor checkbox. Because Khushi Centre is a verified trust, all donations are fully eligible for 80G tax benefits under Indian laws. Receipts are issued instantly via email."
    }
  ];

  return (
    <div className="flex-1 w-full bg-background font-sans selection:bg-primary/20 text-foreground overflow-x-hidden">
      
      {/* 1. STICKY SCROLL-SHRUNK NAVBAR */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-md shadow-md border-b border-border" 
          : "bg-transparent border-b border-transparent"
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-20 sm:h-22">
            
            {/* Dual Logos Branding - Left aligned */}
            <Link href="/" className="flex items-center gap-2 group z-10">
              <div className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-xl border border-primary/10 shadow-xs">
                <Ribbon className="h-5 w-5 text-primary animate-pulse" />
                <span className="font-heading text-sm font-extrabold tracking-tight text-foreground">
                  Khushi <span className="text-primary">Centre</span>
                </span>
                <span className="text-muted-foreground text-xs font-semibold px-1 border-l border-border">
                  Campaign
                </span>
              </div>
              <span className="hidden xl:inline-block text-[10px] text-muted-foreground font-bold tracking-wider uppercase bg-muted/60 px-2 py-1 rounded-md">
                An Initiative by Khushi Centre
              </span>
            </Link>

            {/* Menu Links - Centered */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-muted-foreground absolute left-1/2 -translate-x-1/2 z-0">
              <a href="#hero" className="hover:text-primary transition-colors">Home</a>
              <a href="#about" className="hover:text-primary transition-colors">About</a>
              <a href="#breast-cancer-info" className="hover:text-primary transition-colors">Breast Cancer</a>
              <a href="#doctors" className="hover:text-primary transition-colors">Doctors</a>
              <a href="#research" className="hover:text-primary transition-colors">Research</a>
              <a href="#events" className="hover:text-primary transition-colors">Events</a>
              <a href="#volunteer" className="hover:text-primary transition-colors">Volunteer</a>
              <Link href="/donate" className="hover:text-primary transition-colors">Donate</Link>
              <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
            </nav>

            {/* Right side CTA actions - Right aligned */}
            <div className="flex items-center gap-2 z-10">
              <Link href="/login" className="hidden sm:inline-block">
                <Button variant="ghost" className="text-xs font-bold uppercase hover:bg-primary/10 hover:text-primary transition-colors">
                  Login
                </Button>
              </Link>
              <Link href="/register" className="hidden sm:inline-block">
                <Button variant="outline" className="text-xs font-bold uppercase hover:bg-muted/80 transition-colors">
                  Register
                </Button>
              </Link>
              <Link href="/donate">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase px-4 py-2 shadow-md shadow-emerald-600/10">
                  Donate Now
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* 2. HERO AUTOPLAY SLIDER */}
      <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-slate-950 text-white" id="hero">
        
        {/* Carousel slide transition wrapper */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].themeColor} flex items-center`}
          >
            {/* Visual background pattern grids */}
            <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            {/* Highlighted Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Text Content */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <motion.span 
                    initial={{ y: -15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-wider"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {slides[currentSlide].tag}
                  </motion.span>
                  
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15]"
                  >
                    {slides[currentSlide].title}
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed"
                  >
                    {slides[currentSlide].subtitle}
                  </motion.p>

                  <motion.div 
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap gap-3 pt-2"
                  >
                    <a href={slides[currentSlide].primaryLink}>
                      <Button size="lg" className="bg-primary hover:bg-primary/95 text-white font-bold tracking-wide shadow-lg shadow-primary/35">
                        {slides[currentSlide].primaryBtn}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                    <a href={slides[currentSlide].secondaryLink}>
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 font-bold bg-transparent">
                        {slides[currentSlide].secondaryBtn}
                      </Button>
                    </a>
                  </motion.div>
                </div>

                {/* Graphic Visual Representation Placeholder */}
                <div className="lg:col-span-5 hidden lg:flex items-center justify-center p-6">
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative w-full max-w-sm aspect-square rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-8 text-center space-y-4 shadow-2xl backdrop-blur-md"
                  >
                    <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <Ribbon className="h-16 w-16 text-primary animate-pulse" />
                    <div className="space-y-1">
                      <p className="font-heading text-lg font-bold">{slides[currentSlide].imageText}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Medical Support Graph</p>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-loading-bar" style={{ width: "80%" }} />
                    </div>
                  </motion.div>
                </div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === index ? "w-8 bg-primary" : "w-2.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* 3. CAMPAIGN STATISTICS */}
      <section className="relative z-20 bg-background py-12 border-y border-border shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center items-center">
            {[
              { val: "25,000+", label: "People Reached" },
              { val: "45+", label: "Doctors Connected" },
              { val: "12+", label: "Researchers" },
              { val: "850+", label: "Volunteers" },
              { val: "150+", label: "Patients Supported" },
              { val: `₹${(collected / 100000).toFixed(1)}L`, label: "Funds Raised" }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-3xl font-extrabold text-primary font-heading tracking-tight">{stat.val}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ABOUT CAMPAIGN */}
      <section className="py-20 bg-card border-b border-border" id="about">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Graphic Representation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-square rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-transparent border border-border flex flex-col items-center justify-center p-8 text-center space-y-4 shadow-inner">
                <Users className="h-16 w-16 text-primary" />
                <div className="space-y-1">
                  <p className="font-heading font-bold text-foreground text-lg">Khushi & Partners Synergy</p>
                  <p className="text-xs text-muted-foreground">Certified Staging & Financial Clearing</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                  A direct partnership mapping patient diagnostics with active volunteers, providing certified webinars and transparent hospital payouts.
                </p>
              </div>
            </div>

            {/* Campaign Core Mission / Vision */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs text-primary font-bold uppercase tracking-wider">About Joint Platform</span>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  Why Breast Cancer Awareness Matters
                </h2>
              </div>
              
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Breast cancer is the leading cancer diagnosis among Indian women, often diagnosed too late due to visual stigma and financial gaps. 
                Our mission is to combine the medical-research network of our partners with the community rehabilitation outreach of **Khushi Centre** to create a secure, educational, and fundraising pipeline.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-base text-foreground flex items-center gap-1.5">
                    <Heart className="h-5 w-5 text-primary" />
                    Our Mission
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    To deliver peer-reviewed self-screening booklets, organize webinars, and fund direct treatments for underprivileged families.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-base text-foreground flex items-center gap-1.5">
                    <Award className="h-5 w-5 text-primary" />
                    Our Vision
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    A society where early stage detection is a routine checkup and cancer treatments are accessible without financial distress.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WHY THIS CAMPAIGN */}
      <section className="py-20 bg-muted/15 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Pillars of Action</h2>
            <p className="text-sm text-muted-foreground">Six operational frameworks driving our collaborative campaign.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              { title: "Spread Awareness", desc: "Coordinating rural wellness camps and distributing monthly self-check guides.", icon: Ribbon },
              { title: "Early Detection", desc: "Hosting self-screening guides and training quizzes to ensure zero-stage diagnostic warnings.", icon: ShieldCheck },
              { title: "Patient Support", desc: "Routing 100% audited donations directly to designated hospital accounts.", icon: Heart },
              { title: "Research Collaboration", desc: "Publishing statistical trends and clinical staging reports with oncologists.", icon: BookOpen },
              { title: "Doctor Network", desc: "Connecting verified medical practitioners to schedule webinars and review records.", icon: Users },
              { title: "Community Engagement", desc: "Enrolling volunteers to lead awareness webinars and local walking campaigns.", icon: Activity },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl border border-border bg-card shadow-xs hover:shadow-md transition-shadow duration-300 space-y-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. BREAST CANCER INFORMATION */}
      <section className="py-20 bg-card border-b border-border" id="breast-cancer-info">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Breast Cancer Hub & Staging</h2>
            <p className="text-sm text-muted-foreground">Understand warning signs and screening diagnostics to protect yourself and your family.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Symptoms", desc: "Hard lumps, changes in skin texture, dimpling, nipple inversion, or discharge.", icon: AlertCircle, color: "from-pink-500/10 to-pink-500/5" },
              { title: "Risk Factors", desc: "Genetic factors (BRCA1/BRCA2 mutation), age over 40, family oncology logs, lifestyle.", icon: HeartCrack, color: "from-purple-500/10 to-purple-500/5" },
              { title: "Stages", desc: "Stage 0 (Non-invasive) to Stage IV (Metastatic). Diagnostics keep treatments highly effective.", icon: Ribbon, color: "from-rose-500/10 to-rose-500/5" },
              { title: "Diagnosis", desc: "Diagnostic Mammography, clinical ultrasounds, or surgical breast tissue biopsies.", icon: FileText, color: "from-blue-500/10 to-blue-500/5" },
              { title: "Treatment", desc: "Surgical oncology, chemotherapy cycles, targeted radiation therapy, and hormonal therapy.", icon: HeartPulse, color: "from-emerald-500/10 to-emerald-500/5" },
              { title: "Prevention", desc: "Active lifestyle, scheduled screening tests, maintaining body weight, avoiding alcohol.", icon: ShieldCheck, color: "from-indigo-500/10 to-indigo-500/5" },
              { title: "Self Breast Exam", desc: "Perform monthly checks 3 days post-menstruation. Review guidelines via webinar sheets.", icon: Award, color: "from-amber-500/10 to-amber-500/5" }
            ].map((infoItem, idx) => {
              const Icon = infoItem.icon;
              return (
                <Card key={idx} className="border-border bg-card shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className={`h-24 bg-gradient-to-br ${infoItem.color} border-b border-border/40 p-4 flex items-end justify-between`}>
                    <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center text-primary shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Medical Guide</span>
                  </div>
                  <CardHeader className="space-y-2">
                    <CardTitle className="font-heading text-lg font-bold text-foreground">{infoItem.title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {infoItem.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 text-xs font-semibold p-0">
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. MEET OUR DOCTORS */}
      <section className="py-20 bg-muted/15 border-b border-border" id="doctors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Meet Our Specialist Panel</h2>
            <p className="text-sm text-muted-foreground">Peer-reviewed surgical oncologists guiding early screening camp modules.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Dr. Ananya Roy", spec: "Surgical Oncologist", exp: "12+ Years Exp", hospital: "Max Healthcare" },
              { name: "Dr. Sandeep Mehta", spec: "Radiation Oncologist", exp: "15+ Years Exp", hospital: "Medanta Medicity" },
              { name: "Dr. Priya Deshmukh", spec: "Oncoplastic Surgeon", exp: "9+ Years Exp", hospital: "Fortis Hospital" }
            ].map((docItem, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-border bg-card text-center space-y-4 relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                  <Users className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading text-lg font-bold text-foreground">{docItem.name}</h4>
                  <p className="text-xs text-primary font-semibold">{docItem.spec}</p>
                  <p className="text-[11px] text-muted-foreground">{docItem.hospital} | {docItem.exp}</p>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setSelectedDoctor(docItem.name)}>
                    Book Webinar
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-xs text-primary font-bold">
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Booking Dialog Modal Simulation */}
        <AnimatePresence>
          {selectedDoctor && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card w-full max-w-md p-6 rounded-2xl border border-border shadow-xl space-y-4"
              >
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <h3 className="font-heading font-bold text-lg text-foreground">Register Webinar Seat</h3>
                  <button onClick={() => setSelectedDoctor(null)} className="text-muted-foreground hover:text-foreground text-sm font-semibold">✕</button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Confirm reservation slot for the medical checkup and staging guidelines webinar led by <strong className="text-foreground">{selectedDoctor}</strong>.
                </p>
                
                {bookingSuccess ? (
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-semibold border border-emerald-500/20 text-center flex items-center justify-center gap-1.5">
                    <CheckCircle className="h-4.5 w-4.5" />
                    Webinar reservation locked! Confirmation sent to mail.
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="bookingEmail">Email Address</Label>
                      <Input 
                        id="bookingEmail" 
                        type="email" 
                        placeholder="you@example.com" 
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        required 
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary text-white text-xs font-bold uppercase py-5">
                      Confirm Webinar Slot
                    </Button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 8. RESEARCH SECTION */}
      <section className="py-20 bg-card border-b border-border" id="research">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Latest Clinical Publications</h2>
            <p className="text-sm text-muted-foreground">Read peer-reviewed oncology studies and medical materials co-published by campaign researchers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Mammography Staging Accuracy Trends", author: "Dr. Ananya Roy", type: "Research Paper", journal: "National Cancer Review" },
              { title: "Mastectomy Reconstruction Guidelines", author: "Dr. Priya Deshmukh", type: "Clinical Study", journal: "Medical Science Journal" },
              { title: "BSE Training Efficacy in Rural Sectors", author: "Khushi Rehab Group", type: "Medical Article", journal: "Global Health Review" }
            ].map((pub, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-border bg-muted/20 space-y-4 shadow-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="inline-flex px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 text-[9px] font-bold uppercase">
                    {pub.type}
                  </span>
                  <h4 className="font-heading font-bold text-base text-foreground leading-snug">{pub.title}</h4>
                  <p className="text-xs text-muted-foreground">Authored by {pub.author} | {pub.journal}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 text-xs font-semibold p-0 w-max mt-4">
                  Read Article
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. EVENTS SECTION */}
      <section className="py-20 bg-muted/15 border-b border-border" id="events">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Upcoming Webinars & Camps</h2>
            <p className="text-sm text-muted-foreground">Register to join walkathons, webinars, and free rural screening camps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Community Walkathon", date: "Oct 15, 2026", loc: "Khushi Rehab, Delhi", type: "Awareness Walk" },
              { title: "Self Check Webinar", date: "Oct 20, 2026", loc: "Online Zoom Room", type: "Upcoming Webinar" },
              { title: "Free Mammography Camp", date: "Nov 02, 2026", loc: "Community Hall, Noida", type: "Health Camp" },
              { title: "Oncology Discussion", date: "Nov 15, 2026", loc: "Medanta Seminar Hall", type: "Seminar Session" }
            ].map((evt, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-border bg-card space-y-4 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                    {evt.type}
                  </span>
                  <h4 className="font-heading font-bold text-base text-foreground">{evt.title}</h4>
                  <div className="space-y-1.5 text-xs text-muted-foreground font-semibold">
                    <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" /> {evt.date}</p>
                    <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> {evt.loc}</p>
                  </div>
                </div>
                <WebinarRegisterButton
                  webinarId="look-up-by-title"
                  webinarTitle={evt.title}
                  currentUser={currentUser}
                  buttonText="Register Seat"
                  className="w-full text-xs font-semibold mt-4 py-2 h-auto"
                  variant="outline"
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 11. VOLUNTEER SECTION */}
      <section className="py-20 bg-muted/15 border-b border-border" id="volunteer">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs text-primary font-bold uppercase tracking-wider">Join Advocacy</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Become an Active Advocate
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Join our network of college student volunteers, survivors, and advocates. By running local health camps, distributing pamphlets, or coordinating webinars, you help save lives through education.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Coordinate physical checkups camps.",
                  "Publish training quiz scores sheets.",
                  "Earn QR-verified digital certificates.",
                  "Host local webinars with oncologists."
                ].map((act, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Volunteer sign up console */}
            <div className="lg:col-span-5">
              <Card className="border-border bg-card p-6 space-y-4">
                <h3 className="font-heading font-bold text-lg text-foreground">Advocate Registration</h3>
                {contactSuccess ? (
                  <div className="p-4 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-semibold border border-emerald-500/20 text-center flex items-center justify-center gap-1.5 animate-in zoom-in-95">
                    <CheckCircle className="h-4.5 w-4.5" />
                    Application submitted successfully! Check your email.
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setContactSuccess(true); setTimeout(() => setContactSuccess(false), 2500); }} className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="volName">Name</Label>
                      <Input id="volName" placeholder="Jane Doe" required className="bg-background" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="volEmail">Email Address</Label>
                      <Input id="volEmail" type="email" placeholder="jane@example.com" required className="bg-background" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="volPhone">Phone Number</Label>
                      <Input id="volPhone" placeholder="+91 99999 99999" required className="bg-background" />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/95 text-white font-bold uppercase text-xs py-5">
                      Submit Volunteer Code
                    </Button>
                  </form>
                )}
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* 12. CERTIFICATE SECTION */}
      <section className="py-20 bg-card border-b border-border" id="certificate">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Glassmorphic Certificate Preview */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl border-4 border-double border-primary/30 bg-card shadow-lg text-center space-y-6 relative">
                <Ribbon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 text-primary/3 -z-10 animate-pulse" />
                
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-primary">Certificate of Excellence</p>
                  <h3 className="font-heading font-serif text-xl sm:text-2xl text-foreground italic">Breast Cancer Awareness Ambassador</h3>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">Presented to</p>
                  <p className="font-heading text-lg font-bold text-foreground border-b border-border/80 max-w-xs mx-auto pb-1 italic">Jane Doe</p>
                </div>

                <p className="text-[11px] text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  For completing the Khushi Centre physical examination webinar and volunteer quizzes, verifying high-stage awareness skills.
                </p>

                <div className="flex justify-between items-end pt-4 text-[9px] text-muted-foreground font-bold">
                  <div className="text-left space-y-0.5">
                    <p className="text-foreground">Dr. Ananya Roy</p>
                    <p className="border-t border-border pt-0.5">Medical Director</p>
                  </div>
                  {/* Mock QR code design */}
                  <div className="h-12 w-12 border border-border p-1 bg-white rounded flex items-center justify-center">
                    <div className="h-10 w-10 bg-slate-900 flex items-center justify-center text-white text-[8px] font-bold">QR</div>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className="text-foreground">GRS-2026-Ambassador</p>
                    <p className="border-t border-border pt-0.5">Verification ID</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
                Verified Digital Certificate Preview
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Users who complete campaign awareness webinars, wellness screening programs, educational quizzes, or active volunteer camps will receive a verified digital participation certificate.
              </p>
              
              <div className="space-y-3 text-xs sm:text-sm text-muted-foreground font-semibold">
                <p className="flex items-center gap-1.5"><Award className="h-4.5 w-4.5 text-primary animate-pulse" /> Cryptographically signed SHA-256 validation hashes.</p>
                <p className="flex items-center gap-1.5"><Download className="h-4.5 w-4.5 text-primary" /> Downloadable PDF formats with dynamic name overlays.</p>
                <p className="flex items-center gap-1.5"><Share2 className="h-4.5 w-4.5 text-primary" /> Direct metadata references for LinkedIn records.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 13. SUCCESS STORIES */}
      <section className="py-20 bg-muted/15 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Stories of Hope & Resilience</h2>
            <p className="text-sm text-muted-foreground">True testimonials from patients, advocates, and surgeons using our unified hub.</p>
          </div>

          <div className="space-y-6">
            {/* Story Tabs */}
            <div className="flex justify-center border-b border-border pb-1 gap-2">
              {(["patient", "volunteer", "doctor"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveStoryTab(tab)}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                    activeStoryTab === tab 
                      ? "border-primary text-primary" 
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab} Story
                </button>
              ))}
            </div>

            {/* Testimonial panels */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs text-center space-y-4">
              <span className="inline-flex px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                {stories[activeStoryTab].badge}
              </span>
              <p className="text-sm sm:text-base text-foreground italic leading-relaxed max-w-2xl mx-auto">
                &ldquo;{stories[activeStoryTab].story}&rdquo;
              </p>
              <div>
                <p className="font-heading font-bold text-base text-foreground">{stories[activeStoryTab].name}</p>
                <p className="text-xs text-muted-foreground">{stories[activeStoryTab].role}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. FAQ ACCORDION */}
      <section className="py-20 bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h2>
            <p className="text-sm text-muted-foreground">Find answers regarding diagnostic camps, verified certifications, and payout channels.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-border rounded-xl bg-muted/20 overflow-hidden">
                <button
                  onClick={() => setActiveFaqIndex(activeFaqIndex === idx ? null : idx)}
                  className="w-full px-5 py-4 flex justify-between items-center text-left text-sm sm:text-base font-bold text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {activeFaqIndex === idx ? (
                    <Minus className="h-4 w-4 text-primary shrink-0 ml-2" />
                  ) : (
                    <Plus className="h-4 w-4 text-primary shrink-0 ml-2" />
                  )}
                </button>
                <AnimatePresence>
                  {activeFaqIndex === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-2 bg-card/60">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. CONTACT SECTION */}
      <section className="py-20 bg-muted/15 border-b border-border" id="contact">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-5 space-y-6">
              <h3 className="font-heading text-2xl font-bold text-foreground">Contact Campaign</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Get in touch for diagnostic registrations, physical check guides, or sponsorship coordinates.
              </p>
              
              <div className="space-y-3 text-xs sm:text-sm text-muted-foreground font-semibold">
                <div className="flex items-center gap-2">
                  <Mail className="h-4.5 w-4.5 text-primary" />
                  <span>support@grsawareness.org</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4.5 w-4.5 text-primary" />
                  <span>+91 92173 96124 | 0120-4814793</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4.5 w-4.5 text-primary" />
                  <span>Sector 62, Noida, UP, India</span>
                </div>
              </div>
            </div>

            {/* Simple Contact Feedback forms */}
            <div className="md:col-span-7">
              <Card className="border-border bg-card p-6 space-y-4">
                {bookingSuccess ? (
                  <div className="p-4 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-semibold border border-emerald-500/20 text-center flex items-center justify-center gap-1.5 animate-in zoom-in-95">
                    <CheckCircle className="h-4.5 w-4.5" />
                    Message sent successfully!
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setBookingSuccess(true); setTimeout(() => setBookingSuccess(false), 2500); }} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="contactName">Name</Label>
                        <Input id="contactName" placeholder="Jane" required className="bg-background" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="contactEmail">Email</Label>
                        <Input id="contactEmail" type="email" placeholder="jane@example.com" required className="bg-background" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="contactMsg">Message</Label>
                      <textarea id="contactMsg" rows={3} placeholder="How can we help you?" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/95 text-white font-bold uppercase text-xs py-5 flex items-center justify-center gap-1.5">
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                )}
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* 16. FOOTER DETAILS */}
      <footer className="border-t border-slate-800 bg-slate-950 text-slate-200 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2">
                <Ribbon className="h-6 w-6 text-primary animate-pulse" />
                <span className="font-heading text-lg font-extrabold tracking-tight">
                  Khushi Centre
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                A collaborative diagnostic screening initiative designed by Khushi Centre for Rehabilitation & Research supporting direct hospital payouts and certified webinars.
              </p>
              <div className="text-slate-400 space-y-1.5 text-xs font-semibold">
                <p>Khushi Reg: Noida Trust Sector-62</p>
                <p>Partner Corp: Healthcare Systems India</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-primary">Emergency Helpline</h4>
              <p className="text-xs text-slate-400">National Oncology Support Direct Dial:</p>
              <p className="text-xl font-bold text-slate-100">1800-22-1995</p>
              <div className="flex gap-3 text-xs text-slate-400 font-bold pt-2">
                <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
                <Link href="/campaigns" className="hover:text-primary transition-colors">All Projects</Link>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-primary">Newsletter</h4>
              <p className="text-xs text-slate-400">Receive monthly clinical self-screening guidelines.</p>
              <div className="flex gap-2">
                <Input type="email" placeholder="you@example.com" className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 h-9 text-xs" />
                <Button size="sm" className="bg-primary hover:bg-primary/95 text-white h-9 text-xs font-semibold">Join</Button>
              </div>
            </div>

          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Khushi Centre. All rights reserved. Peer-reviewed medical disclaimers apply.
          </div>
        </div>
      </footer>

    </div>
  );
}

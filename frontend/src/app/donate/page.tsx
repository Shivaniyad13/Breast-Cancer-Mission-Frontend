"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Ribbon,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Info,
  Users,
  TrendingUp,
  HeartHandshake,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
  Lock,
  Globe,
  Plus,
  Minus,
  Sparkles,
  HelpCircle,
  QrCode,
  Check,
  CheckCircle,
  FileText,
  Medal,
  Crown,
  Gem,
  Sprout
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface SurvivorStory {
  name: string;
  age: number;
  city: string;
  badge: string;
  story: string;
  quote: string;
  impact: string;
  image: string;
}

interface Testimonial {
  name: string;
  role: string;
  message: string;
  rating: number;
  image: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ImpactTier {
  amount: number;
  description: string;
  details: string;
  icon: React.ReactNode;
}

export default function DonatePage() {
  // ----------------------------------------------------
  // States
  // ----------------------------------------------------
  const [giveOnce, setGiveOnce] = useState<boolean>(true);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(5000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [donorPhone, setDonorPhone] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");

  // App states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [animatedTotalRaised, setAnimatedTotalRaised] = useState<number>(7800000);
  const [donorCount, setDonorCount] = useState<number>(3829);

  // Active Story Index
  const [activeStoryIdx, setActiveStoryIdx] = useState<number>(0);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState<number>(0);
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);

  // Form reference for scrolling
  const formRef = useRef<HTMLDivElement>(null);

  const donationTiers = [
    {
      amount: 1000,
      name: "Bronze",
      emoji: "🥉",
      icon: Medal,
      selectedBg: "bg-orange-50/40 border-orange-500 text-orange-950",
      borderClass: "border-slate-200 hover:border-slate-350 hover:shadow-sm",
      iconColor: "text-orange-500"
    },
    {
      amount: 2000,
      name: "Silver",
      emoji: "🥈",
      icon: Medal,
      selectedBg: "bg-slate-55/35 border-slate-500 text-slate-950",
      borderClass: "border-slate-200 hover:border-slate-350 hover:shadow-sm",
      iconColor: "text-slate-400"
    },
    {
      amount: 5000,
      name: "Gold",
      emoji: "🥇",
      icon: Award,
      selectedBg: "bg-amber-50/50 border-amber-500 text-amber-950",
      borderClass: "border-slate-200 hover:border-slate-350 hover:shadow-sm",
      iconColor: "text-amber-500"
    },
    {
      amount: 10000,
      name: "Diamond",
      emoji: "💎",
      icon: Gem,
      selectedBg: "bg-cyan-50/40 border-cyan-500 text-cyan-950",
      borderClass: "border-slate-200 hover:border-slate-350 hover:shadow-sm",
      iconColor: "text-cyan-500"
    },
    {
      amount: 10000, // sentinel base
      name: "More+",
      emoji: "➕",
      icon: Plus,
      selectedBg: "bg-pink-50/40 border-pink-500 text-pink-950",
      borderClass: "border-slate-200 hover:border-slate-350 hover:shadow-sm",
      iconColor: "text-pink-500",
      isPlatinum: true
    }
  ];

  const getActiveImpact = () => {
    const amt = selectedAmount || parseFloat(customAmount) || 0;
    if (amt === 1000) {
      return {
        title: "Bronze Supporter",
        desc: "Provides crucial funds to organize local breast cancer awareness campaigns, educating women about early detection and symptoms.",
        icon: Medal,
        color: "text-orange-700 bg-orange-50 border border-orange-100",
      };
    } else if (amt === 2000) {
      return {
        title: "Silver Supporter",
        desc: "Sponsors complete breast cancer self-exam guidance booklets, awareness kits, and educational resources for families.",
        icon: Medal,
        color: "text-slate-700 bg-slate-100/50 border border-slate-200/60",
      };
    } else if (amt === 5000) {
      return {
        title: "Gold Supporter",
        desc: "Sponsors professional breast screenings, mammograms, and clinical consultations to catch signs early.",
        icon: Award,
        color: "text-amber-700 bg-amber-50 border border-amber-100",
      };
    } else if (amt === 10000 && selectedAmount !== null) {
      return {
        title: "Diamond Supporter",
        desc: "Contributes directly to oncology treatments, surgical diagnostics, and essential chemotherapy packages for patients.",
        icon: Gem,
        color: "text-cyan-700 bg-cyan-50 border border-cyan-100",
      };
    } else if (amt > 10000 || selectedAmount === null) {
      return {
        title: "Custom Support (More+)",
        desc: amt >= 10001
          ? `Your custom donation of ₹${amt.toLocaleString()} provides elite funding for advanced cancer care, patient surgical treatment, and outreach programs.`
          : "Please specify your custom donation amount above ₹10,000.",
        icon: Plus,
        color: "text-pink-705 bg-pink-50 border border-pink-100",
      };
    } else if (amt > 0) {
      return {
        title: "Awareness & Education Outreach",
        desc: `Your custom donation of ₹${amt.toLocaleString()} helps distribute early-detection booklets to rural and remote areas.`,
        icon: Heart,
        color: "text-slate-700 bg-slate-100/50 border border-slate-200/60",
      };
    }
    return null;
  };

  const activeImpact = getActiveImpact();

  // ----------------------------------------------------
  // Mock Data
  // ----------------------------------------------------
  const impactTiers: ImpactTier[] = [
    {
      amount: 500,
      description: "Awareness Material",
      details: "Provides comprehensive printed and digital breast cancer awareness booklets and guidance for one underprivileged rural family.",
      icon: <FileText className="h-6 w-6 text-pink-600" />
    },
    {
      amount: 1000,
      description: "One Screening",
      details: "Funds one clinical breast examination and mammogram referral for a woman at a local community outreach health camp.",
      icon: <Heart className="h-6 w-6 text-pink-600" />
    },
    {
      amount: 2500,
      description: "Diagnostic Support",
      details: "Covers crucial pathology tests, biopsies, and initial oncologist consultation charges for high-risk symptomatic women.",
      icon: <Sparkles className="h-6 w-6 text-pink-600" />
    },
    {
      amount: 5000,
      description: "Treatment Assistance",
      details: "Contributes directly to chemotherapy drugs, target hormones, and post-surgery rehabilitation for patients under active care.",
      icon: <HeartHandshake className="h-6 w-6 text-pink-600" />
    },
    {
      amount: 10000,
      description: "Community Screening Camp",
      details: "Sponsors a local clinical screening event with professional oncology nurses and primary diagnosis equipment for 15+ women.",
      icon: <Users className="h-6 w-6 text-pink-600" />
    }
  ];

  const survivorStories: SurvivorStory[] = [
    {
      name: "Shagufta Ali's Breast Cancer Journey",
      age: 36,
      city: "New Delhi",
      badge: "Stage II Breast Cancer Survivor",
      story: "Diagnosed at 35,Shagufta was terrified she wouldn't see her two young daughters grow up. Her husband's modest salary couldn't cover the intensive chemotherapy cycles. Through the Breast Cancer Mission Platform, her treatment cost was funded, giving her a second chance.",
      quote: "The Breast Cancer Mission Platform didn't just fund my medicines; they stood by me like a family when I had lost all hope of survival.",
      impact: "Mastectomy surgery & 6 chemo cycles fully funded.",
      image: "/images/Cancer Patients.jpg"
    },
    {
      name: "Lakshmi Devi",
      age: 49,
      city: "Gurugram",
      badge: "Stage III Survivor & Advocate",
      story: "Lakshmi felt a lump but delayed consulting due to financial constraints and stigma. The Breast Cancer Mission Platform's local awareness camp screened her, detected the tumor in Stage III, and immediately enrolled her in emergency radiation therapy.",
      quote: "If not for that free screening camp in our village, I wouldn't have been alive today. It saved my family.",
      impact: "Free mammography screening, biopsy, and emergency radiation therapy.",
      image: "/images/Cancer Patients1.jpg"
    },
    {
      name: "Simran Sethi's Breast Cancer Journey",
      age: 42,
      city: "Noida",
      badge: "Early-stage Survivor",
      story: "An active school teacher, Simran was diagnosed early. The diagnostic expenses were cleared by donor contributions, allowing her to get immediate treatment before the cancer could spread.",
      quote: "Early detection is truly the biggest cure. Because donors funded my diagnostic tests, my recovery was quick and successful.",
      impact: "Fully funded advanced 3D mammogram and oncology consulting.",
      image: "https://corporate.webassets.siemens-healthineers.com/262160eaeebed9a5/098254bafbc6/v/252df6659aad/siemens-healthineers_breast_cancer_simran_sethi_wall.jpg",
    }
  ];

  const trustCards = [
    {
      title: "100% Dedicated",
      description: "Every campaign and resource is strictly focused on breast cancer prevention, treatment, and survivor support.",
      icon: <Ribbon className="h-8 w-8 text-pink-600" />
    },
    {
      title: "Transparent Fund Usage",
      description: "We publish annual financial audits. Every rupee directly clears medical bills at partner hospitals.",
      icon: <TrendingUp className="h-8 w-8 text-pink-600" />
    },
    {
      title: "Verified NGO Partner",
      description: "Registered non-profit. All transactions comply with legal compliance, providing valid tax exemption.",
      icon: <ShieldCheck className="h-8 w-8 text-pink-600" />
    },
    {
      title: "Secure Payments",
      description: "Industry-standard SSL encryption and secure UPI/Card gateways protect your personal and payment details.",
      icon: <Lock className="h-8 w-8 text-pink-600" />
    },
    {
      title: "Medical Expert Support",
      description: "Our advisory board consists of certified senior oncologists guiding our screening and treatment protocols.",
      icon: <Award className="h-8 w-8 text-pink-600" />
    },
    {
      title: "Community Outreach",
      description: "Active mobile testing vans and rural camps bringing diagnosis to the doorstep of underprivileged women.",
      icon: <Globe className="h-8 w-8 text-pink-600" />
    }
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Dr. Jyoti Bajpai",
      role: "Senior Oncologist, Associated Hospital",
      message: "The biggest barrier to cancer recovery in India is financial dropout. The Breast Cancer Mission Platform fills this critical gap by ensuring patients never stop chemotherapy midway due to lack of funds. Their impact is real and scientifically critical.",
      rating: 5,
      image: "/images/cancer_research.png"
    },
    {
      name: "Meera Krishnan",
      role: "Volunteer & Breast Cancer Survivor",
      message: "After surviving Stage II cancer through Breast Cancer Mission Platform support, I committed my life to guiding others. Today, I volunteer in screening camps. It's beautiful to see donors saving families every single day.",
      rating: 5,
      image: "/images/volunteers.png"
    },
    {
      name: "Anand Verma",
      role: "Monthly Sustaining Donor",
      message: "I chose to support the Breast Cancer Mission Platform because of their transparency. I receive regular patient recovery updates, letting me know exactly how my monthly contribution is directly keeping someone's mother or sister alive.",
      rating: 5,
      image: "/images/volunteers1.jpg"
    }
  ];

  const faqs: FAQItem[] = [
    {
      question: "Where does my donation go?",
      answer: "Your donation is directly transferred to our partner oncological centers to cover chemotherapy drugs, surgical mastectomy fees, reconstructive therapy, and primary screening camps. We maintain zero-profit patient-directed disbursements."
    },
    {
      question: "Is my payment secure?",
      answer: "Yes, absolutely. We use Razorpay and SBI secure payment gateways with 256-bit SSL encryption. We do not store your credit card details or UPI PINs on our servers."
    },
    {
      question: "Will I receive a donation tax certificate?",
      answer: "Yes. The Breast Cancer Mission Platform is a registered NGO under Section 80G of the Income Tax Act. You will receive an automated 80G receipt and donation certificate on your registered email address within 24 hours of transaction completion."
    },
    {
      question: "Can I donate anonymously?",
      answer: "Yes. If you check the 'Donate anonymously' option on the donation card, your name and email will be hidden from public logs and patient-facing records. It will remain strictly confidential for internal audit purposes only."
    },
    {
      question: "Can organizations/corporates donate?",
      answer: "Yes, we accept corporate donations, CSR grants, and employee-giving partnerships. You can fill in your organization's name during donation, and we will issue a corporate tax certificate and detailed CSR impact report."
    }
  ];

  const galleryItems = [
    { image: "/images/community_walk.png", title: "Awareness Walk 2025", desc: "500+ participants raising awareness." },
    { image: "/images/volunteers.png", title: "Volunteer Training", desc: "Preparing survivors to counsel new patients." },
    { image: "/images/support_group.png", title: "Survivor Support Group", desc: "Weekly group therapy and counseling." },
    { image: "/images/awareness1.png", title: "Rural Screening Camp", desc: "Free clinical screening in Alwar, Rajasthan." },
    { image: "/images/awareness2.png", title: "Hospital Visit", desc: "Distributing prosthetic kits to postoperative patients." },
    { image: "/images/awareness3.png", title: "Early Detection Seminar", desc: "Educating college students on self-examination." }
  ];

  // ----------------------------------------------------
  // Auto-scroll Carousels
  // ----------------------------------------------------
  useEffect(() => {
    const storyInterval = setInterval(() => {
      setActiveStoryIdx((prev) => (prev + 1) % survivorStories.length);
    }, 8000);

    const testimonialInterval = setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => {
      clearInterval(storyInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  // ----------------------------------------------------
  // Scroll to Form helper
  // ----------------------------------------------------
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleImpactSelect = (amt: number) => {
    setSelectedAmount(amt);
    setCustomAmount("");
    scrollToForm();
  };

  // ----------------------------------------------------
  // Handlers
  // ----------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedAmount === null) {
      const amt = parseFloat(customAmount);
      if (isNaN(amt) || amt <= 10000) {
        alert("Custom donation amount must be greater than ₹10,000.");
        return;
      }
    }

    const finalAmount = selectedAmount || parseFloat(customAmount);
    if (!finalAmount || finalAmount <= 0) {
      alert("Please select or enter a valid donation amount.");
      return;
    }
    if (!donorName || !donorEmail || !donorPhone) {
      alert("Please fill in your name, email, and phone number.");
      return;
    }

    if (paymentMethod === "upi") {
      setShowQRModal(true);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessModal(true);
        // Add to statistics
        setAnimatedTotalRaised((prev) => prev + finalAmount);
        setDonorCount((prev) => prev + 1);
      }, 2000);
    }
  };

  const handleConfirmUPIPayment = () => {
    setShowQRModal(false);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
      const finalAmount = selectedAmount || parseFloat(customAmount) || 2500;
      setAnimatedTotalRaised((prev) => prev + finalAmount);
      setDonorCount((prev) => prev + 1);
    }, 1500);
  };

  return (
    <div className="flex-1 w-full bg-gradient-to-br from-[#FFF5F8] via-[#FCE7F3] to-[#FDF2F8] selection:bg-pink-200 selection:text-pink-800 overflow-x-hidden">
      {/* ----------------------------------------------------
          1. HERO SECTION
          ---------------------------------------------------- */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Video/Image Overlay */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover pointer-events-none"
            poster="/images/community_walk.png"
          >
            <source src="/videoplayback.mp4" type="video/mp4" />
            <source src="/cancer3.webm" type="video/webm" />
          </video>
          {/* Deep premium overlay with pink/purple/dark shades */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/70 to-pink-950/50 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10 py-20 text-center sm:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 backdrop-blur-xs border border-pink-500/30 text-pink-300 text-xs font-semibold uppercase tracking-wider"
              >
                <Heart className="h-4 w-4 text-pink-400 fill-pink-400 animate-pulse" />
                Breast Cancer Mission Platform
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight"
              >
                Your Kindness <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400">
                  Can Save a Life.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed"
              >
                Every single donation supports mobile screening camps, free mammograms, medical expert support, patient surgery assistance, and hope for underprivileged families.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start"
              >
                <Button
                  onClick={scrollToForm}
                  className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-pink-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
                >
                  Donate Now
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Button>
                <a href="#survivor-stories" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="border-slate-400 text-pinkl hover:bg-white/10 font-bold px-8 py-6 rounded-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer text-base w-full"
                  >
                    Read Survivor Stories
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* Right Counter Panels (Animated Stats) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { label: "Women Screened", value: "18,450+", desc: "Early checkups completed", delay: 0.2 },
                { label: "Awareness Camps", value: "154+", desc: "Rural & school drives", delay: 0.3 },
                { label: "Donations Raised", value: "₹85 L+", desc: "100% verified care", delay: 0.4 },
                { label: "Lives Saved", value: "3,820+", desc: "Patients cancer-free", delay: 0.5 }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: stat.delay }}
                  className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl hover:bg-white/15 transition-all flex flex-col justify-between text-left"
                >
                  <p className="text-[9px] sm:text-xs text-pink-300 font-bold tracking-widest uppercase">{stat.label}</p>
                  <div className="my-1.5 sm:my-2">
                    <p className="text-xl sm:text-3xl font-black text-white tracking-tight">{stat.value}</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 sm:mt-1 font-medium leading-tight">{stat.desc}</p>
                  </div>
                  <div className="h-1.5 w-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          2. SURVIVOR STORIES CAROUSEL
          ---------------------------------------------------- */}
      <section id="survivor-stories" className="py-20 bg-gradient-to-b from-slate-900 to-purple-950 text-white relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-5">
          <Ribbon className="h-[500px] w-[500px] text-pink-500 absolute -top-20 -right-20" />
          <Heart className="h-[400px] w-[400px] text-purple-500 absolute bottom-10 -left-20" />
        </div>

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider border border-pink-500/20">
              <Users className="h-4 w-4" />
              Survivor Stories
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Real Struggles. <span className="text-pink-400">Real Victories.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Your donation gives mothers, wives, and daughters a chance to win their battle and share their testimony.
            </p>
          </div>

          {/* Carousel Body */}
          <div className="relative bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 md:p-12 pb-16 sm:pb-8 md:pb-12 backdrop-blur-lg shadow-2xl overflow-hidden min-h-[480px] flex items-center">

            {/* Story Elements */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStoryIdx}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full"
              >

                {/* Photo */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-3 border-pink-500/30 shadow-2xl group">
                    <img
                      src={survivorStories[activeStoryIdx].image}
                      alt={survivorStories[activeStoryIdx].name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 bg-pink-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-md tracking-wider shadow-md">
                      {survivorStories[activeStoryIdx].badge}
                    </span>
                  </div>
                </div>

                {/* Narrative & Quote */}
                <div className="md:col-span-7 space-y-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-pink-400 uppercase tracking-widest">Featured Story</p>
                    <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-white">
                      {survivorStories[activeStoryIdx].name}, <span className="text-slate-300 font-normal">{survivorStories[activeStoryIdx].age} yrs</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-medium tracking-wide flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                      Home: {survivorStories[activeStoryIdx].city}
                    </p>
                  </div>

                  <p className="text-slate-300 text-sm md:text-base leading-relaxed italic">
                    &ldquo;{survivorStories[activeStoryIdx].story}&rdquo;
                  </p>

                  <div className="p-4 rounded-xl bg-pink-500/10 border-l-4 border-pink-500">
                    <p className="text-pink-300 font-serif italic text-sm md:text-base leading-relaxed">
                      &ldquo;{survivorStories[activeStoryIdx].quote}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                      {survivorStories[activeStoryIdx].impact}
                    </span>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots and Arrows */}
            <div className="absolute bottom-6 right-6 md:right-12 flex items-center gap-4 z-20">
              <div className="flex gap-1.5">
                {survivorStories.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStoryIdx(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${activeStoryIdx === idx ? "w-6 bg-pink-500" : "w-2 bg-white/30 hover:bg-white/50"
                      }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveStoryIdx((prev) => (prev - 1 + survivorStories.length) % survivorStories.length)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActiveStoryIdx((prev) => (prev + 1) % survivorStories.length)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          3. DONATION IMPACT SECTION
          ---------------------------------------------------- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider border border-pink-100">
              <TrendingUp className="h-4 w-4 text-pink-600" />
              Direct Impact Breakdown
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              See the Power of Your Contribution
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              Every single rupee the Breast Cancer Mission Platform receives is optimized to support early screening, diagnostics, or active surgery. Select a tier below to see the impact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {impactTiers.map((tier, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8, scale: 1.02 }}
                className="flex flex-col justify-between p-6 rounded-3xl bg-slate-50 border border-slate-200/60 shadow-xs hover:shadow-lg hover:border-pink-300 hover:bg-pink-50/50 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-white shadow-xs border border-slate-200/50 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-transform">
                    {tier.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-black text-slate-800 font-heading font-black">₹{tier.amount.toLocaleString()}</p>
                    <p className="text-sm font-bold text-pink-600 uppercase tracking-wider">{tier.description}</p>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">{tier.details}</p>
                </div>

                <div className="pt-6">
                  <Button
                    onClick={() => handleImpactSelect(tier.amount)}
                    className="w-full bg-white hover:bg-pink-600 hover:text-white border border-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl transition-all shadow-xs group-hover:border-pink-500/20 cursor-pointer"
                  >
                    Select &amp; Help
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          4. WHY DONATE TO BREAST CANCER MISSION
          ---------------------------------------------------- */}
      <section className="py-20 bg-gradient-to-b from-pink-50/30 via-purple-50/20 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider border border-purple-100">
              <Shield className="h-4 w-4 text-purple-600" />
              Trust &amp; Credibility
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Donate to Breast Cancer Mission?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              We stand as a trusted, verified partner, ensuring that your generosity is treated with the utmost respect and transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trustCards.map((card, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="p-3 rounded-2xl bg-pink-50 border border-pink-100/50 shrink-0">
                  {card.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800 text-base font-heading leading-tight">{card.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          5. TESTIMONIALS SLIDER
          ---------------------------------------------------- */}
      <section className="py-20 bg-slate-900 text-white relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-3 mb-12">
            <p className="text-xs font-bold text-pink-400 uppercase tracking-widest">Heartfelt Reviews</p>
            <h2 className="font-heading text-3xl font-extrabold text-white">Words of Hope &amp; Care</h2>
          </div>

          {/* Testimonial card */}
          <div className="relative bg-white/5 border border-white/10 p-8 sm:p-10 rounded-3xl backdrop-blur-md shadow-xl text-center">

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonialIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* 5 stars */}
                <div className="flex justify-center gap-1">
                  {[...Array(testimonials[activeTestimonialIdx].rating)].map((_, i) => (
                    <Heart key={i} className="h-4 w-4 text-pink-500 fill-pink-500" />
                  ))}
                </div>

                <p className="text-slate-200 text-base sm:text-lg italic leading-relaxed">
                  &ldquo;{testimonials[activeTestimonialIdx].message}&rdquo;
                </p>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-pink-500/50 shadow-md">
                    <img
                      src={testimonials[activeTestimonialIdx].image}
                      alt={testimonials[activeTestimonialIdx].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{testimonials[activeTestimonialIdx].name}</h4>
                    <p className="text-xs text-pink-300 font-medium">{testimonials[activeTestimonialIdx].role}</p>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* Testimonials controls */}
            <div className="flex justify-center gap-1.5 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonialIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${activeTestimonialIdx === idx ? "w-6 bg-pink-500" : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          6. MODERN DONATION CARD
          ---------------------------------------------------- */}
      <section ref={formRef} className="py-20 bg-gradient-to-b from-white to-pink-50/20 relative">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <span className="text-pink-600 font-bold text-xs uppercase tracking-widest bg-pink-50/80 px-4 py-1.5 rounded-full border border-pink-100 inline-block shadow-sm">
              🌱 Impact Tiers
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-heading text-slate-800 tracking-tight">
              Select Your Donation Tier
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">
              Every single donation supports mobile screening camps, free mammograms, medical expert support, patient surgery assistance, and hope for underprivileged families.
            </p>
          </div>

          {/* Simplified Donation Tier Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-16 items-stretch">
            {donationTiers.map((tier) => {
              const isPlatinum = tier.isPlatinum === true;
              const isSelected = isPlatinum
                ? selectedAmount === null
                : selectedAmount === tier.amount;
              const displayAmt = isPlatinum ? "Custom Amount" : `₹${tier.amount.toLocaleString()}`;

              return (
                <button
                  key={tier.name}
                  type="button"
                  onClick={() => {
                    if (isPlatinum) {
                      setSelectedAmount(null);
                      const val = parseFloat(customAmount);
                      if (isNaN(val) || val <= 10000) {
                        setCustomAmount("15000");
                      }
                    } else {
                      setSelectedAmount(tier.amount);
                      setCustomAmount("");
                    }
                  }}
                  className={`relative p-6 rounded-[20px] border text-center flex flex-col justify-center items-center gap-3.5 h-full min-h-[145px] cursor-pointer transition-all duration-250 ${
                    isSelected
                      ? `${tier.selectedBg} border-2 shadow-sm`
                      : "bg-white border-slate-200 text-slate-800 hover:border-slate-350 hover:shadow-sm"
                  } ${isPlatinum ? "col-span-2 sm:col-span-1" : ""}`}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-2xl leading-none">{tier.emoji}</span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {tier.name}
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-slate-800 leading-none">
                    {displayAmt}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left Column: Image with emotional quote */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl aspect-4/5">
                <img
                  src="/images/support_group.png"
                  alt="Breast cancer support group holding hands"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-950/80 via-pink-900/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <div className="flex gap-1.5">
                    <Heart className="h-5 w-5 text-pink-400 fill-pink-400" />
                    <span className="text-xs uppercase font-bold tracking-wider">A Circle of Hope</span>
                  </div>
                  <p className="font-serif italic text-sm md:text-base leading-relaxed">
                    &ldquo;When a woman battles cancer, the entire family suffers. Saving a mother is saving the home. Your action directly impacts lives.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Premium Glassmorphism Donation Form */}
            <div className="lg:col-span-7">
              <div className="bg-white/80 backdrop-blur-xl border border-pink-100/50 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">

                {/* Header info */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold text-slate-800 font-heading">Complete Your Donation</h3>
                    <p className="text-xs text-slate-500">100% secure, transparent hospital payout.</p>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100">
                    <ShieldCheck className="h-4 w-4" /> SECURE DONATION
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Frequency Toggle */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Donation Type</Label>
                    <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setGiveOnce(true)}
                        className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${giveOnce
                          ? "bg-white text-pink-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                          }`}
                      >
                        Give Once
                      </button>
                      <button
                        type="button"
                        onClick={() => setGiveOnce(false)}
                        className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${!giveOnce
                          ? "bg-white text-pink-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                          }`}
                      >
                        <Heart className="h-3 w-3 fill-pink-600 text-pink-600" />
                        Monthly Support
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Impact Statement Section */}
                  <div className="overflow-hidden">
                    <AnimatePresence mode="wait">
                      {activeImpact && (
                        <motion.div
                          key={selectedAmount || customAmount || "empty"}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="bg-gradient-to-r from-pink-50/30 via-rose-50/10 to-purple-50/30 backdrop-blur-sm border border-pink-100/40 rounded-2xl p-4 sm:p-5 flex items-start gap-4 shadow-sm"
                        >
                          <div className={`p-3 rounded-xl shrink-0 ${activeImpact.color}`}>
                            <activeImpact.icon className="h-6 w-6" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-[10px] font-black text-pink-600 uppercase tracking-widest">
                              Your Contribution Makes a Difference
                            </h4>
                            <p className="text-slate-800 text-sm font-extrabold">
                              {activeImpact.title}
                            </p>
                            <p className="text-slate-500 text-xs leading-relaxed font-medium">
                              {activeImpact.desc}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Custom Amount Input - Revealed when More+ is selected */}
                  <AnimatePresence>
                    {selectedAmount === null && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-1.5 overflow-hidden"
                      >
                        <Label htmlFor="custom-amt" className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                          Specify Custom Donation Amount (₹)
                        </Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                          <Input
                            id="custom-amt"
                            type="number"
                            placeholder="Enter custom amount (above ₹10,000)"
                            value={customAmount}
                            min={10001}
                            onChange={(e) => {
                              setCustomAmount(e.target.value);
                            }}
                            className="pl-8 py-6 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-semibold"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">INR</span>
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400">
                          Donation must be strictly greater than ₹10,000.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Personal Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="donor-name" className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                        Full Name
                      </Label>
                      <Input
                        id="donor-name"
                        placeholder="e.g. Shalini Roy"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="py-5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="donor-email" className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                        Email Address
                      </Label>
                      <Input
                        id="donor-email"
                        type="email"
                        placeholder="e.g. shalini@example.com"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="py-5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="donor-phone" className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                        Phone Number
                      </Label>
                      <Input
                        id="donor-phone"
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        className="py-5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="organization" className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                        Organization (Optional)
                      </Label>
                      <Input
                        id="organization"
                        placeholder="e.g. Private Ltd"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="py-5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Anonymous Donation Toggle */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="anonymous-chk"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-slate-300 text-pink-600 focus:ring-pink-500 h-4 w-4"
                    />
                    <Label htmlFor="anonymous-chk" className="text-xs font-bold text-slate-600 uppercase tracking-wider cursor-pointer">
                      Make this donation anonymously
                    </Label>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <Label htmlFor="donor-msg" className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                      Message / Prayer for the Patient (Optional)
                    </Label>
                    <Textarea
                      id="donor-msg"
                      placeholder="Send details of support, positive affirmations, or prayers..."
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
                    />
                  </div>

                  {/* Payment Gateway Grid */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                      Choose Payment Method
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "upi", label: "UPI (Scan QR)", desc: "GPay, PhonePe, Paytm" },
                        { id: "card", label: "Credit/Debit Card", desc: "Visa, Master, RuPay" },
                        { id: "netbanking", label: "Net Banking", desc: "SBI, HDFC, ICICI" },
                        { id: "wallet", label: "Wallets", desc: "Paytm, Mobikwik" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPaymentMethod(item.id)}
                          className={`p-3 rounded-xl border flex flex-col justify-center items-center text-center cursor-pointer transition-all ${paymentMethod === item.id
                            ? "border-pink-500 bg-pink-50/30 text-pink-600 ring-2 ring-pink-500/20"
                            : "border-slate-200 hover:border-pink-200 bg-white"
                            }`}
                        >
                          <span className="text-xs font-bold font-heading">{item.label}</span>
                          <span className="text-[9px] text-slate-400 font-medium mt-0.5 leading-tight">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Large Pink Action Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold py-6 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-pink-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-base font-bold"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        Connecting to Secure Gateway...
                      </span>
                    ) : (
                      <>
                        <Heart className="h-5 w-5 fill-white text-white" />
                        Donate Now (₹{(selectedAmount || parseFloat(customAmount) || 0).toLocaleString()})
                      </>
                    )}
                  </Button>

                </form>

                {/* 80G Tax Exemption Note */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/50 flex gap-2 text-xs text-slate-500">
                  <Info className="h-4.5 w-4.5 text-pink-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>80G Tax Benefits:</strong> Indian residents receive 50% tax deduction under Section 80G. An automated certificate is emailed with your receipt.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          7. GALLERY OF HOPE
          ---------------------------------------------------- */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-6xl">

          <div className="text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-pink-400 text-xs font-bold uppercase tracking-wider border border-white/10">
              <Sparkles className="h-4 w-4 text-pink-500" />
              Gallery of Hope
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Camps, Counseling &amp; Compassion
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              A visual glimpse of our awareness campaigns, free mammography checks, community care volunteers, and patient support circles.
            </p>
          </div>

          {/* Gallery grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryItems.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="relative h-64 rounded-3xl overflow-hidden border border-white/10 shadow-lg group"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay hover effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6" />

                {/* Details shown always on mobile, or on hover on desktop */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-950/90 to-transparent md:bg-none md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-bold text-white text-base leading-tight font-heading">{item.title}</h4>
                  <p className="text-xs text-pink-300 mt-1 font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
          8. FAQ SECTION
          ---------------------------------------------------- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">

          <div className="text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider border border-pink-100">
              <HelpCircle className="h-4 w-4 text-pink-600" />
              Frequently Asked Questions
            </div>
            <h2 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
              Have Questions? We Have Answers.
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Everything you need to know about transactional compliance, safety certifications, tax deductions, and anonymous giving.
            </p>
          </div>

          {/* Accordion Layout */}
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 bg-white"
                >
                  <button
                    onClick={() => setActiveFaqIdx(isOpen ? null : idx)}
                    className="w-full py-5 px-6 flex justify-between items-center text-left font-bold text-slate-800 hover:text-pink-600 hover:bg-slate-50/50 transition-colors cursor-pointer select-none outline-hidden"
                  >
                    <span className="font-heading text-sm sm:text-base leading-tight">{faq.question}</span>
                    <span className="shrink-0 p-1 bg-slate-100 rounded-lg ml-4">
                      {isOpen ? <Minus className="h-4 w-4 text-pink-600" /> : <Plus className="h-4 w-4 text-slate-500" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-1 text-slate-500 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                          {faq.answer}
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

      {/* ----------------------------------------------------
          9. FINAL CALL-TO-ACTION & FOOTER ACCENT
          ---------------------------------------------------- */}
      <section className="relative py-24 bg-gradient-to-r from-pink-950 via-slate-900 to-purple-950 text-white overflow-hidden text-center">
        {/* BG Survivor Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/community_walk.png"
            alt="Smiling Breast Cancer Survivors and Donors"
            className="w-full h-full object-cover opacity-15 pointer-events-none mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90" />
        </div>

        <div className="container mx-auto px-4 max-w-4xl relative z-10 space-y-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-block p-4 rounded-full bg-pink-600/10 border border-pink-500/20"
          >
            <Heart className="h-10 w-10 text-pink-500 fill-pink-500 animate-pulse" />
          </motion.div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-2xl mx-auto">
            Someone is Waiting for a Second Chance at Life.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Your generosity today can become someone&apos;s tomorrow. Together, we can defeat breast cancer, one family at a time.
          </p>

          <div className="pt-4">
            <Button
              onClick={scrollToForm}
              className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold px-10 py-7 rounded-2xl shadow-xl shadow-pink-600/20 transition-all hover:scale-105 active:scale-95 text-base cursor-pointer"
            >
              Donate Now
            </Button>
          </div>

          <p className="text-xs text-pink-400 font-bold tracking-widest uppercase pt-6">
            &ldquo;Every Donation Creates Hope. Every Hope Saves a Life.&rdquo;
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------
          MODAL: SECURE UPI QR SCANNER
          ---------------------------------------------------- */}
      <AnimatePresence>
        {showQRModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-sm border border-pink-100 flex flex-col"
            >
              {/* SBI & Khushi Heading */}
              <div className="bg-slate-50 px-6 pt-6 pb-3 flex flex-col items-center gap-2 border-b border-slate-100 text-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png"
                  alt="State Bank of India"
                  className="h-8 w-auto object-contain"
                />
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest leading-relaxed">
                  Breast Cancer Mission Platform Campaign
                </h4>
                <p className="text-[10px] text-slate-400 font-medium font-mono">Hospital Bank Payout System</p>
              </div>

              {/* Amount Display */}
              <div className="py-4 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Amount to Transfer</p>
                <p className="text-3xl font-black text-slate-800 tracking-tight mt-0.5 font-heading font-black">
                  ₹{(selectedAmount || parseFloat(customAmount) || 2500).toLocaleString()}
                </p>
              </div>

              {/* QR Image */}
              <div className="px-8 pb-4 flex flex-col items-center justify-center">
                <div className="border border-slate-200/60 rounded-2xl p-2 bg-white shadow-md">
                  <img
                    src="/khushi-upi-qr.png"
                    alt="Khushi Centre UPI QR Code - Scan to Pay"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <p className="text-[10px] text-slate-400 text-center mt-3 max-w-xs font-medium">
                  Scan with any UPI app (GPay, PhonePe, Paytm, BHIM) to make your direct transfer.
                </p>
              </div>

              {/* UPI Address */}
              <div className="bg-slate-50 px-6 py-3 text-center border-y border-slate-100">
                <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">UPI ID</p>
                <p className="text-xs font-mono font-bold text-slate-700 select-all">49122452@sbi</p>
              </div>

              {/* Confirm Buttons */}
              <div className="p-4 bg-white flex flex-col gap-2">
                <Button
                  onClick={handleConfirmUPIPayment}
                  className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-xl text-sm cursor-pointer"
                >
                  I Have Completed the Transfer
                </Button>
                <button
                  type="button"
                  onClick={() => setShowQRModal(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors py-1.5 cursor-pointer"
                >
                  Cancel &amp; Change Method
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------
          MODAL: DONATION SUCCESS CONGRATULATIONS
          ---------------------------------------------------- */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md text-center border border-pink-100 space-y-6"
            >
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="h-10 w-10 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-800 font-heading">Thank You, {donorName || "Kind Soul"}!</h3>
                <p className="text-pink-600 font-bold text-xs uppercase tracking-widest">Donation Received Successfully</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 text-left">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your donation of <strong>₹{(selectedAmount || parseFloat(customAmount) || 2500).toLocaleString()}</strong> has been directly cleared to the hospital payout vault.
                </p>
                <div className="h-px bg-slate-200/60 my-1" />
                <p className="text-[11px] text-slate-400 leading-relaxed flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> An automated tax-exempt 80G certificate has been dispatched to <strong>{donorEmail}</strong>.
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Receipt Copy reference: <span className="font-mono text-[10px]">#BCMP-TXN-{Math.floor(100000 + Math.random() * 900000)}</span>
                </p>
              </div>

              <Button
                onClick={() => {
                  setShowSuccessModal(false);
                  // Reset form fields
                  setDonorName("");
                  setDonorEmail("");
                  setDonorPhone("");
                  setOrganization("");
                  setMessage("");
                  setIsAnonymous(false);
                  setCustomAmount("");
                  setSelectedAmount(2500);
                }}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold py-4 rounded-xl cursor-pointer"
              >
                Close &amp; Return
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

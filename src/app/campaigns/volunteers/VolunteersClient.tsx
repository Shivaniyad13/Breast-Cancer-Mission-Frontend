"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutUserAction } from "@/app/actions/auth";
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
  X,
  ShieldCheck,
  Upload,
  Download,
  LogOut,
  AlertTriangle,
  FileText,
  Loader2
} from "lucide-react";

export type VolunteerSession = {
  userId: string;
  role: "USER" | "VOLUNTEER" | "ADMIN";
  volunteerStatus: "NOT_APPLIED" | "PENDING" | "VERIFIED" | "REJECTED" | "UNVERIFIED";
  volunteerId?: string;
  certificateCode?: string | null;
  fullName?: string;
} | null;

export type VolunteerFeedback = {
  id: string;
  name: string;
  interest: string;
  city: string;
  rating: number;
  review: string;
  initials: string;
};

export type VolunteerStats = {
  volunteers: number;
  campaigns: number;
  events: number;
  reached: number;
};

export type VolunteerEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  slots: number;
  filledSlots: number;
  interestKey: string;
  alreadyApplied: boolean;
};

export type GalleryItem = {
  id?: string;
  src: string;
  title: string;
  submittedBy?: string;
};

interface VolunteersClientProps {
  initialSession?: VolunteerSession;
  initialFeedback?: VolunteerFeedback[];
  initialStats?: VolunteerStats;
  initialEvents?: VolunteerEvent[];
  initialGallery?: GalleryItem[];
}

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

const interestToRole: Record<string, string> = {
  outreach: "Community Outreach Volunteer",
  camps: "Health Camp Volunteer",
  events: "Campaign Coordinator",
  media: "Media Advocate",
  fundraising: "Fundraising Volunteer",
  workshops: "Workshop Presenter",
};

const getRoleLabel = (interest: string) =>
  interestToRole[interest] || "Volunteer";

const formatStat = (n: number): string => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K+`;
  return n.toString();
};

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

// TODO: Remove FALLBACK_GALLERY once enough real submissions exist
const FALLBACK_GALLERY: GalleryItem[] = [
  { src: "/images/11.png", title: "Global Ribbons Drive" },
  { src: "/images/12.png", title: "Clinic Diagnostics Camp" },
  { src: "/images/13.png", title: "Support Group Circle" },
  { src: "/images/14.png", title: "Walkathon Mobilization" },
  { src: "/images/15.png", title: "Interactive Workshop Session" },
  { src: "/images/16.png", title: "Survivor Support Network" },
  { src: "/images/17.png", title: "Wellness Daily Advocacy" }
];

export default function VolunteersClient({
  initialSession = null,
  initialFeedback = [],
  initialStats = { volunteers: 0, campaigns: 0, events: 0, reached: 0 },
  initialEvents = [],
  initialGallery = [],
}: VolunteersClientProps) {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [session, setSession] = useState<VolunteerSession>(initialSession);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const galleryItems = initialGallery.length > 0 ? initialGallery : FALLBACK_GALLERY;
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);
  const [applyingEventId, setApplyingEventId] = useState<string | null>(null);

  // Modals state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // Feedback form state inside modal
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Gallery upload form state inside modal
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string | null>(null);
  const [gallerySubmitting, setGallerySubmitting] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [gallerySuccess, setGallerySuccess] = useState(false);

  const handleGalleryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setGalleryError(null);
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setGalleryError("File size exceeds 5MB limit.");
        setGalleryFile(null);
        setGalleryPreview(null);
        return;
      }
      setGalleryFile(file);
      setGalleryPreview(URL.createObjectURL(file));
    } else {
      setGalleryFile(null);
      setGalleryPreview(null);
    }
  };

  const handleEventApply = async (eventId: string) => {
    setApplyingEventId(eventId);
    try {
      const res = await fetch(`/api/volunteers/events/${eventId}/apply`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        router.refresh();
      } else {
        alert(json.error || "Failed to apply for event.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to apply for event.");
    } finally {
      setApplyingEventId(null);
    }
  };

  // Application Form States
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
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitApiError, setSubmitApiError] = useState<string | null>(null);

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
      nextErrors.phone = "Please enter a valid phone number (e.g. +91 9876543210)";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitApiError(null);

    if (validateForm()) {
      setFormSubmitting(true);
      try {
        const res = await fetch("/api/volunteers/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            age: parseInt(formData.age, 10),
          }),
        });
        const result = await res.json();
        if (result.success) {
          setFormSubmitted(true);
        } else {
          setSubmitApiError(result.error || "Application submission failed.");
        }
      } catch (err: any) {
        setSubmitApiError(err.message || "Failed to submit application.");
      } finally {
        setFormSubmitting(false);
      }
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
    setSubmitApiError(null);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    if (!feedbackMessage.trim()) {
      setFeedbackError("Please write a message before submitting.");
      return;
    }

    setFeedbackSubmitting(true);
    try {
      const res = await fetch("/api/volunteers/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: feedbackRating,
          message: feedbackMessage.trim(),
        }),
      });
      const result = await res.json();
      if (result.success) {
        setFeedbackSuccess(true);
        setFeedbackMessage("");
      } else {
        setFeedbackError(result.error || "Failed to submit feedback.");
      }
    } catch (err: any) {
      setFeedbackError(err.message || "Something went wrong.");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGalleryError(null);
    if (!galleryTitle.trim()) {
      setGalleryError("Photo title is required.");
      return;
    }
    if (!galleryFile) {
      setGalleryError("Please select an image file.");
      return;
    }

    const payload = new FormData();
    payload.append("title", galleryTitle.trim());
    payload.append("image", galleryFile);

    setGallerySubmitting(true);
    try {
      const res = await fetch("/api/volunteers/gallery", {
        method: "POST",
        body: payload,
      });
      const result = await res.json();
      if (result.success) {
        setGallerySuccess(true);
        setGalleryTitle("");
        setGalleryFile(null);
        if (galleryPreview) {
          URL.revokeObjectURL(galleryPreview);
          setGalleryPreview(null);
        }
        router.refresh();
      } else {
        setGalleryError(result.error || "Failed to upload photo.");
      }
    } catch (err: any) {
      setGalleryError(err.message || "Failed to upload photo.");
    } finally {
      setGallerySubmitting(false);
    }
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
      <div className="absolute top-20 right-10 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse duration-[8000ms]" />
      <div className="absolute top-1/3 left-5 w-80 h-80 bg-rose-50/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-5 w-96 h-96 bg-pink-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ================= HERO SECTION (centered, no background color) ================= */}
      <section className="relative min-h-[75vh] flex items-center py-20 overflow-hidden bg-white">

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">

          {/* Centered content */}
          <div className="flex flex-col items-center text-center space-y-6">

            {/* Badge + Session bar — centered */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/60 border border-pink-200/50 text-primary text-xs font-bold uppercase tracking-wider"
              >
                <Activity className="h-4 w-4 text-primary animate-pulse" />
                Join the Movement
              </motion.div>

              {/* Session State Badge & Actions */}
              {!session ? (
                <Link href="/volunteer/login">
                 <Button
  variant="ghost"
  className="text-xs font-bold uppercase tracking-wider text-white bg-primary hover:bg-pink-600 hover:text-white border border-primary rounded-full px-4 py-1.5 transition-all"
>
  Login as Volunteer
</Button>
                </Link>
              ) : session.volunteerStatus === "PENDING" ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-primary text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="h-4 w-4 text-primary animate-bounce" />
                  Your volunteer application is under review
                </div>
              ) : session.volunteerStatus === "VERIFIED" ? (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 border border-pink-200/50 text-primary text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Verified Volunteer
                  </div>
                  <Button
                    onClick={() => setShowFeedbackModal(true)}
                    className="bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-full px-3.5 py-1.5"
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                    Submit Feedback
                  </Button>
                  <Button
                    onClick={() => setShowGalleryModal(true)}
                    className="bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-full px-3.5 py-1.5"
                  >
                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                    Upload to Gallery
                  </Button>
                  {session.certificateCode && (
                    <Link
                      href="/campaigns/volunteers/certificate"
                      className="inline-flex items-center bg-white hover:bg-pink-50 text-primary text-xs font-bold uppercase tracking-wider border border-pink-200 rounded-full px-3.5 py-1.5 transition-all"
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Download Certificate
                    </Link>
                  )}
                  <Button
                    onClick={async () => {
                      await logoutUserAction();
                      window.location.href = "/";
                    }}
                    variant="ghost"
                    className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-primary border border-slate-200 rounded-full px-3 py-1.5"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : null}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-800 leading-[1.1]"
            >
              Become a <span className="bg-gradient-to-r from-primary via-rose-500 to-pink-600 bg-clip-text text-transparent">Volunteer</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Together we can spread awareness, support breast cancer patients, organize campaigns, and make a meaningful impact in our communities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="pt-2 flex flex-wrap justify-center gap-4"
            >
              <Button
                onClick={() => scrollToForm()}
                className="bg-primary hover:bg-primary/95 text-white font-bold rounded-full shadow-md shadow-pink-100 hover:shadow-lg hover:shadow-pink-200/50 px-8 py-6 active:scale-95 transition-all text-sm tracking-wide cursor-pointer"
              >
                Get Started
              </Button>
              <a href="#opportunities">
                <Button
                  variant="outline"
                  className="border-pink-200 text-primary bg-white hover:bg-pink-50/60 font-bold rounded-full px-8 py-6 active:scale-95 transition-all text-sm tracking-wide cursor-pointer"
                >
                  View Roles
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= WHY VOLUNTEER? ================= */}
      <section className="py-20 md:py-28 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-16">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
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
                <Card className="border-pink-100/60 bg-gradient-to-br from-white to-pink-50/[0.03] shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl p-8 hover:border-pink-300 group">
                  <div className="h-14 w-14 rounded-2xl bg-pink-50 flex items-center justify-center border border-pink-100/40 group-hover:scale-105 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="font-heading text-xl font-bold mt-6 text-slate-800">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-3 font-medium">
                    {item.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ================= VOLUNTEER OPPORTUNITIES ================= */}
      <section id="opportunities" className="py-20 md:py-28 bg-gradient-to-b from-white to-rose-50/30 border-t border-rose-100/20 scroll-mt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-16">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Active Openings
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Volunteer Opportunities
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Explore open volunteer roles matching your expertise, location preference, and weekly availability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunitiesList.map((opp, idx) => (
              <Card key={idx} className="border-pink-100/60 bg-gradient-to-br from-white to-pink-50/[0.03] shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl flex flex-col justify-between group hover:border-pink-300 hover:-translate-y-1">
                <CardHeader className="p-6 pb-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-pink-50 px-2.5 py-1 rounded-md border border-pink-100/40">
                      {opp.commitment}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary" /> {opp.location}
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
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-full py-6 transition-all text-xs cursor-pointer active:scale-95 shadow-md shadow-pink-100"
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* ================= VOLUNTEER IMPACT ================= */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-pink-500 to-rose-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[5%] w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12 relative z-10">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 border border-white/10 text-white text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="h-3.5 w-3.5 text-pink-200" /> Community Milestones
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Our Collective Volunteer Impact
            </h2>
            <p className="text-pink-100 text-sm sm:text-base font-medium">
              We track campaign outreach and active volunteer stats to continuously audit regional support performance.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">{formatStat(initialStats.volunteers)}</div>
              <h4 className="text-xs sm:text-sm font-bold text-pink-100 uppercase tracking-widest">Volunteers</h4>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">{formatStat(initialStats.campaigns)}</div>
              <h4 className="text-xs sm:text-sm font-bold text-pink-100 uppercase tracking-widest">Campaigns</h4>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">{formatStat(initialStats.reached)}</div>
              <h4 className="text-xs sm:text-sm font-bold text-pink-100 uppercase tracking-widest">People Reached</h4>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">{formatStat(initialStats.events)}</div>
              <h4 className="text-xs sm:text-sm font-bold text-pink-100 uppercase tracking-widest">Events Organized</h4>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OPEN VOLUNTEER CALLS (UPCOMING EVENTS) ================= */}
      {initialEvents.length > 0 && (
        <section className="py-20 md:py-28 bg-gradient-to-b from-rose-50/30 to-white border-t border-rose-100/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
                <Calendar className="h-3.5 w-3.5" /> Upcoming Events
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800">
                Open Volunteer Calls
              </h2>
              <p className="text-slate-500 text-sm sm:text-base font-medium">
                Join our upcoming drives and camps — sign up for a slot before they fill.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {initialEvents.map((event) => {
                const isFull = event.filledSlots >= event.slots;

                return (
                  <motion.div key={event.id} variants={fadeInUp}>
                    <Card className="border-pink-100/60 bg-gradient-to-br from-white to-pink-50/[0.03] shadow-sm hover:shadow-md rounded-3xl p-6 flex flex-col justify-between h-full group hover:border-pink-300 transition-all hover:-translate-y-1">
                      <div className="space-y-3">
                        <h3 className="font-heading font-bold text-lg text-slate-800 group-hover:text-primary transition-colors leading-snug">
                          {event.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap gap-3 text-[10px] text-slate-400 font-semibold pt-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-primary" /> {event.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-primary" />{" "}
                            {new Date(event.eventDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-primary" /> {event.filledSlots}/{event.slots} slots
                          </span>
                        </div>
                      </div>

                      <div className="pt-6 mt-4 border-t border-pink-50">
                        {!session ? (
                          <Link href="/volunteer/login">
                            <Button
                              variant="outline"
                              className="w-full border-pink-200 text-primary hover:bg-pink-50/60 font-bold text-xs rounded-full py-5"
                            >
                              Login to Apply
                            </Button>
                          </Link>
                        ) : session.volunteerStatus === "PENDING" ? (
                          <Button
                            disabled
                            className="w-full bg-slate-100 text-slate-400 font-bold text-xs rounded-full py-5 cursor-not-allowed border border-slate-200"
                          >
                            Awaiting Verification
                          </Button>
                        ) : event.alreadyApplied ? (
                          <div className="w-full text-center py-3 bg-pink-50 text-primary border border-pink-100 font-bold text-xs rounded-full">
                            Applied ✓
                          </div>
                        ) : isFull ? (
                          <div className="w-full text-center py-3 bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs rounded-full">
                            Slots Full
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleEventApply(event.id)}
                            disabled={applyingEventId === event.id}
                            className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-full py-5 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-pink-100"
                          >
                            {applyingEventId === event.id ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Applying...
                              </>
                            ) : (
                              "Apply for Slot"
                            )}
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* ================= VOLUNTEER TESTIMONIALS / FEEDBACK ================= */}
      <section className="py-20 md:py-28 bg-white border-t border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="h-3.5 w-3.5" /> Community Feedback
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800">
              Voices of Our Volunteers
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Real experiences shared by our verified volunteer champions across India.
            </p>
          </div>

          {initialFeedback.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {initialFeedback.map((fb) => (
                <motion.div key={fb.id} variants={fadeInUp}>
                  <Card className="border-pink-100/60 bg-gradient-to-br from-white to-pink-50/[0.03] shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between h-full hover:border-pink-300 group">
                    <div className="space-y-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < fb.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm italic font-medium leading-relaxed">
                        "{fb.review}"
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-6 border-t border-pink-50 mt-6">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-rose-400 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-md">
                        {fb.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-heading font-bold text-slate-800 text-sm truncate">{fb.name}</h4>
                        <p className="text-[11px] text-slate-400 font-medium truncate">
                          {getRoleLabel(fb.interest)}{fb.city ? ` · ${fb.city}` : ""}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="border-2 border-dashed border-pink-200 bg-pink-50/30 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-3 max-w-xl mx-auto">
              <MessageSquare className="h-8 w-8 text-pink-400" />
              <h3 className="font-heading font-bold text-lg text-slate-700">No stories yet</h3>
              <p className="text-xs text-slate-500 max-w-sm font-medium">
                Be the first to share your volunteer experience.
              </p>
              {initialSession?.volunteerStatus === "VERIFIED" && (
                <Button
                  onClick={() => setShowFeedbackModal(true)}
                  className="mt-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-full px-5 py-2.5 active:scale-95 transition-all cursor-pointer shadow-md shadow-pink-100"
                >
                  Share Your Story
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ================= VOLUNTEER REGISTRATION FORM ================= */}
      <section ref={formRef} className="py-20 md:py-28 bg-gradient-to-b from-white to-rose-50/30 border-t border-rose-100/20 scroll-mt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl space-y-10">

          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Registration Form
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800">
              Apply to Volunteer
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Submit your application below. We will map your profile to our active regional drives.
            </p>
          </div>

          <Card className="border-pink-100/60 bg-white shadow-xl rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-rose-500 to-pink-600" />
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
                  {submitApiError && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
                      {submitApiError}
                    </div>
                  )}

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

                  {/* Motivation */}
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
                  <div className="flex gap-2 p-4 rounded-xl bg-pink-50/40 text-slate-500 border border-pink-100/50">
                    <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <p className="text-[10px] leading-relaxed font-semibold">
                      Your inputs will be synced with our databases for audit verification. Coordinators will notify you about orientation webinar slots shortly.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-full py-6 active:scale-95 transition-all text-sm uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-pink-100"
                  >
                    {formSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      "Become a Volunteer"
                    )}
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
                  <div className="h-16 w-16 rounded-full bg-pink-50 text-primary flex items-center justify-center mx-auto border border-pink-100 animate-bounce">
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
                      className="bg-primary hover:bg-primary/95 text-white font-bold rounded-full py-6 px-6 active:scale-95 transition-all text-xs uppercase cursor-pointer shadow-md shadow-pink-100"
                    >
                      Submit Another
                    </Button>
                    <Link href="/">
                      <Button
                        variant="outline"
                        className="border-pink-200 text-primary hover:bg-pink-50/60 font-bold rounded-full py-6 px-6 active:scale-95 transition-all text-xs uppercase"
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

      {/* ================= VOLUNTEER GALLERY / MEDIA ARCHIVE ================= */}
      <section className="py-20 md:py-28 bg-white border-t border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold uppercase tracking-wider">
                <Video className="h-3.5 w-3.5" /> Media Archive
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800">
                Volunteer Gallery
              </h2>
              <p className="text-slate-500 text-sm sm:text-base font-medium">
                Highlights from our nationwide awareness drives, screening camps, and community events.
              </p>
            </div>
            {initialSession?.volunteerStatus === "VERIFIED" && (
              <Button
                onClick={() => setShowGalleryModal(true)}
                className="bg-primary hover:bg-primary/95 text-white font-bold rounded-full px-6 py-6 text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer active:scale-95 transition-all shadow-md shadow-pink-100"
              >
                <Upload className="h-4 w-4" />
                Upload Photo
              </Button>
            )}
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {galleryItems.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                variants={fadeInUp}
                onClick={() => setLightboxImage(item)}
                className="relative aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border border-pink-100/60 bg-slate-100"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                  <h4 className="text-white font-heading font-bold text-sm leading-snug">
                    {item.title}
                  </h4>
                  {item.submittedBy && (
                    <p className="text-[11px] text-pink-100 mt-1 font-medium">
                      Submitted by {item.submittedBy}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= FEEDBACK SUBMIT MODAL ================= */}
      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-pink-100"
            >
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setFeedbackSuccess(false);
                  setFeedbackError(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-pink-50 text-slate-400 hover:text-primary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-pink-50 text-primary flex items-center justify-center border border-pink-100/40">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">Volunteer Feedback</h3>
                  <p className="text-xs text-slate-500 font-medium">Share your campaign experience with the community</p>
                </div>
              </div>

              {feedbackSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-pink-50 text-primary flex items-center justify-center mx-auto border border-pink-100">
                    <Check className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-base">Feedback Submitted!</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Thank you! Your feedback has been sent for admin review and will appear on the public board once approved.
                  </p>
                  <Button
                    onClick={() => {
                      setShowFeedbackModal(false);
                      setFeedbackSuccess(false);
                    }}
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-full py-5 shadow-md shadow-pink-100"
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                  {feedbackError && (
                    <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                      {feedbackError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Star Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className="p-1.5 focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-7 w-7 ${
                              star <= feedbackRating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Your Experience Message
                    </label>
                    <textarea
                      rows={4}
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder="Share highlights from your volunteer drive or campaign work..."
                      className="w-full border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary transition-all resize-none font-medium"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={feedbackSubmitting}
                    className="w-full py-6 bg-primary hover:bg-primary/95 text-white font-bold rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-pink-100"
                  >
                    {feedbackSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= GALLERY UPLOAD MODAL ================= */}
      <AnimatePresence>
        {showGalleryModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-pink-100"
            >
              <button
                onClick={() => {
                  setShowGalleryModal(false);
                  setGallerySuccess(false);
                  setGalleryError(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-pink-50 text-slate-400 hover:text-primary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-pink-50 text-primary flex items-center justify-center border border-pink-100/40">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">Upload to Gallery</h3>
                  <p className="text-xs text-slate-500 font-medium">Share drive photos with campaign supporters</p>
                </div>
              </div>

              {gallerySuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-pink-50 text-primary flex items-center justify-center mx-auto border border-pink-100">
                    <Check className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-base">Photo Uploaded!</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Your photo has been uploaded and sent for admin review. It will be published to the gallery upon approval.
                  </p>
                  <Button
                    onClick={() => {
                      setShowGalleryModal(false);
                      setGallerySuccess(false);
                    }}
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-full py-5 shadow-md shadow-pink-100"
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleGallerySubmit} className="space-y-5">
                  {galleryError && (
                    <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                      {galleryError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Photo Title
                    </label>
                    <input
                      type="text"
                      required
                      value={galleryTitle}
                      onChange={(e) => setGalleryTitle(e.target.value)}
                      placeholder="e.g. Pune Health Camp Awareness Drive"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Select Image (Max 5MB, JPG/PNG/WEBP)
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      required
                      onChange={handleGalleryFileSelect}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-pink-50 file:text-primary hover:file:bg-pink-100 transition-all cursor-pointer border border-slate-200 rounded-xl p-2"
                    />
                  </div>

                  {galleryPreview && (
                    <div className="rounded-2xl overflow-hidden max-h-48 border border-pink-100 relative aspect-video">
                      <Image
                        src={galleryPreview}
                        alt="Upload Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={gallerySubmitting}
                    className="w-full py-6 bg-primary hover:bg-primary/95 text-white font-bold rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-pink-100"
                  >
                    {gallerySubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading Photo...
                      </>
                    ) : (
                      "Submit for Review"
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative aspect-video w-full bg-black">
                <Image
                  src={lightboxImage.src}
                  alt={lightboxImage.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-6 bg-slate-900 text-white space-y-1">
                <h3 className="font-heading font-bold text-lg text-white">
                  {lightboxImage.title}
                </h3>
                {lightboxImage.submittedBy && (
                  <p className="text-xs text-slate-400">
                    Submitted by {lightboxImage.submittedBy}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-rose-50/30 border-t border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="h-3.5 w-3.5" /> FAQ Accordion
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Quick answers about volunteering, campaigns, and community involvement.
            </p>
          </div>

          <div className="space-y-4">
            {faqsList.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={idx} className="border border-pink-100/60 rounded-3xl bg-white overflow-hidden shadow-sm hover:border-pink-300 transition-all">
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

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-pink-500 to-rose-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[5%] w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-8 relative z-10">

          <div className="space-y-4">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ready to Make a Difference?
            </h2>
            <p className="text-pink-100 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
              Join our volunteer community today and help us spread breast cancer awareness, organize screening camps, and support patients across India.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
              onClick={() => scrollToForm()}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-primary font-bold rounded-full py-6 px-8 shadow-lg active:scale-95 transition-all text-sm uppercase tracking-wider cursor-pointer"
            >
              Become a Volunteer
            </Button>
            <Link href="/donate" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white/40 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full py-6 px-8 active:scale-95 transition-all text-sm uppercase tracking-wider cursor-pointer"
              >
                Support Our Cause
              </Button>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
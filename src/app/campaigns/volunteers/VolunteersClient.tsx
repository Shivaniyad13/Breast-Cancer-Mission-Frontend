"use client";

import { useState, useRef, useEffect } from "react";
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
  MessageCircle,
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
  likes: number;
  commentCount: number;
  comments: VolunteerFeedbackComment[];
};

export type VolunteerFeedbackComment = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
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
  mediaType?: "image" | "video";
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

const interestToRole: Record<string, string> = {
  public: "Community Member",
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
  const [feedbackItems, setFeedbackItems] = useState(initialFeedback);
  const [feedbackVisitorKey, setFeedbackVisitorKey] = useState<string | null>(null);
  const [likedFeedbackIds, setLikedFeedbackIds] = useState<string[]>([]);
  const [feedbackLikeCounts, setFeedbackLikeCounts] = useState<Record<string, number>>(
    Object.fromEntries(initialFeedback.map((feedback) => [feedback.id, feedback.likes]))
  );
  const [feedbackCommentCounts, setFeedbackCommentCounts] = useState<Record<string, number>>(
    Object.fromEntries(initialFeedback.map((feedback) => [feedback.id, feedback.commentCount]))
  );
  const [feedbackComments, setFeedbackComments] = useState<Record<string, VolunteerFeedbackComment[]>>(
    Object.fromEntries(initialFeedback.map((feedback) => [feedback.id, feedback.comments]))
  );
  const [expandedFeedbackIds, setExpandedFeedbackIds] = useState<string[]>([]);
  const [expandedCommentsIds, setExpandedCommentsIds] = useState<string[]>([]);
  const [commentNames, setCommentNames] = useState<Record<string, string>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [commentAuthorTokens, setCommentAuthorTokens] = useState<Record<string, string>>({});
  const [commentSubmittingId, setCommentSubmittingId] = useState<string | null>(null);
  const [commentErrors, setCommentErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let visitorKey = window.localStorage.getItem("cmba-feedback-visitor-key");
    if (!visitorKey) {
      visitorKey = window.crypto.randomUUID();
      window.localStorage.setItem("cmba-feedback-visitor-key", visitorKey);
    }
    setFeedbackVisitorKey(visitorKey);

    try {
      const savedLikes: unknown = JSON.parse(
        window.localStorage.getItem("cmba-feedback-liked-ids") || "[]"
      );
      if (Array.isArray(savedLikes) && savedLikes.every((id) => typeof id === "string")) {
        setLikedFeedbackIds(savedLikes);
      }
    } catch (error) {
      console.error("Could not read saved feedback likes:", error);
    }

    try {
      const savedTokens: unknown = JSON.parse(
        window.localStorage.getItem("cmba-feedback-comment-tokens") || "{}"
      );
      if (
        savedTokens !== null &&
        typeof savedTokens === "object" &&
        !Array.isArray(savedTokens) &&
        Object.values(savedTokens).every((token) => typeof token === "string")
      ) {
        setCommentAuthorTokens(savedTokens as Record<string, string>);
      }
    } catch (error) {
      console.error("Could not read saved comment edit tokens:", error);
    }
  }, []);

  // Gallery is now solely driven by verified backend submissions (no hardcoded fallback)
  const galleryItems = initialGallery;
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);
  const [applyingEventId, setApplyingEventId] = useState<string | null>(null);

  // Modals state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // Feedback form state inside modal
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackConsent, setFeedbackConsent] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Gallery upload form state inside modal
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryName, setGalleryName] = useState("");
  const [galleryEmail, setGalleryEmail] = useState("");
  const [galleryConsent, setGalleryConsent] = useState(false);
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string | null>(null);
  const [gallerySubmitting, setGallerySubmitting] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [gallerySuccess, setGallerySuccess] = useState(false);

  const handleGalleryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setGalleryError(null);
    if (file) {
      const maxSize = file.type.startsWith("video/") ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setGalleryError(file.type.startsWith("video/") ? "Video size exceeds 50MB limit." : "Photo size exceeds 5MB limit.");
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
    availability: "Anchoring",
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
      availability: "Anchoring",
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
    if (!feedbackName.trim() || !feedbackEmail.trim() || !feedbackConsent) {
      setFeedbackError("Enter your name and email, and agree to public display of your feedback.");
      return;
    }

    setFeedbackSubmitting(true);
    try {
      const res = await fetch("/volunteer-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: feedbackName.trim(),
          email: feedbackEmail.trim(),
          rating: feedbackRating,
          message: feedbackMessage.trim(),
          consent: feedbackConsent,
        }),
      });
      const result = await res.json();
      if (result.success) {
        const name = feedbackName.trim();
        const id = result.data?.id;
        if (typeof id !== "string") {
          throw new Error("Feedback was submitted, but its public entry could not be loaded. Please refresh the page.");
        }
        const newFeedback: VolunteerFeedback = {
          id,
          name,
          interest: "public",
          city: "",
          rating: feedbackRating,
          review: feedbackMessage.trim(),
          initials: name
            .split(/\s+/)
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          likes: 0,
          commentCount: 0,
          comments: [],
        };
        setFeedbackItems((items) => [newFeedback, ...items.filter((item) => item.id !== id)]);
        setFeedbackLikeCounts((counts) => ({ ...counts, [id]: 0 }));
        setFeedbackCommentCounts((counts) => ({ ...counts, [id]: 0 }));
        setFeedbackComments((comments) => ({ ...comments, [id]: [] }));
        setFeedbackSuccess(true);
        setFeedbackMessage("");
        router.refresh();
      } else {
        setFeedbackError(result.error || "Failed to submit feedback.");
      }
    } catch (err) {
      setFeedbackError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const handleFeedbackLike = async (feedbackId: string) => {
    if (!feedbackVisitorKey) return;
    const liked = !likedFeedbackIds.includes(feedbackId);
    try {
      const response = await fetch(`/volunteer-feedback/${feedbackId}/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorKey: feedbackVisitorKey, liked }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not save your like.");
      }

      setFeedbackLikeCounts((counts) => ({ ...counts, [feedbackId]: result.data.likes }));
      const nextIds = liked
        ? [...likedFeedbackIds, feedbackId]
        : likedFeedbackIds.filter((id) => id !== feedbackId);
      setLikedFeedbackIds(nextIds);
      window.localStorage.setItem("cmba-feedback-liked-ids", JSON.stringify(nextIds));
    } catch (error) {
      console.error("Could not update feedback like:", error);
      alert(error instanceof Error ? error.message : "Could not save your like.");
    }
  };

  const handleToggleFeedbackComments = async (feedbackId: string) => {
    if (expandedCommentsIds.includes(feedbackId)) {
      setExpandedCommentsIds((ids) => ids.filter((id) => id !== feedbackId));
      return;
    }

    try {
      const response = await fetch(`/volunteer-feedback/${feedbackId}/comments`);
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not load comments.");
      }
      setFeedbackComments((comments) => ({ ...comments, [feedbackId]: result.data }));
      setCommentErrors((errors) => ({ ...errors, [feedbackId]: "" }));
      setExpandedCommentsIds((ids) => [...ids, feedbackId]);
    } catch (error) {
      console.error("Could not load feedback comments:", error);
      setCommentErrors((errors) => ({
        ...errors,
        [feedbackId]: error instanceof Error ? error.message : "Could not load comments.",
      }));
    }
  };

  const handleFeedbackCommentSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    feedbackId: string
  ) => {
    event.preventDefault();
    const name = commentNames[feedbackId]?.trim() || "";
    const message = commentDrafts[feedbackId]?.trim() || "";
    if (!name || !message) {
      setCommentErrors((errors) => ({ ...errors, [feedbackId]: "Enter your name and comment." }));
      return;
    }

    setCommentSubmittingId(feedbackId);
    setCommentErrors((errors) => ({ ...errors, [feedbackId]: "" }));
    const authorToken = window.crypto.randomUUID();
    try {
      const response = await fetch(`/volunteer-feedback/${feedbackId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, authorToken }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not submit comment.");
      }

      setFeedbackComments((comments) => ({
        ...comments,
        [feedbackId]: [...(comments[feedbackId] || []), result.data],
      }));
      setFeedbackCommentCounts((counts) => ({
        ...counts,
        [feedbackId]: (counts[feedbackId] || 0) + 1,
      }));
      const nextTokens = { ...commentAuthorTokens, [result.data.id]: authorToken };
      setCommentAuthorTokens(nextTokens);
      window.localStorage.setItem("cmba-feedback-comment-tokens", JSON.stringify(nextTokens));
      setCommentDrafts((drafts) => ({ ...drafts, [feedbackId]: "" }));
    } catch (error) {
      console.error("Could not submit feedback comment:", error);
      setCommentErrors((errors) => ({
        ...errors,
        [feedbackId]: error instanceof Error ? error.message : "Could not submit comment.",
      }));
    } finally {
      setCommentSubmittingId(null);
    }
  };

  const handleEditFeedbackComment = async (
    feedbackId: string,
    comment: VolunteerFeedbackComment
  ) => {
    const authorToken = commentAuthorTokens[comment.id];
    if (!authorToken) return;
    const message = window.prompt("Edit your comment:", comment.message);
    if (message === null || !message.trim() || message.trim() === comment.message) return;

    try {
      const response = await fetch(
        `/volunteer-feedback/${feedbackId}/comments/${comment.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: message.trim(), authorToken }),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not edit your comment.");
      }
      setFeedbackComments((comments) => ({
        ...comments,
        [feedbackId]: (comments[feedbackId] || []).map((item) =>
          item.id === comment.id ? result.data : item
        ),
      }));
      setCommentErrors((errors) => ({ ...errors, [feedbackId]: "" }));
    } catch (error) {
      console.error("Could not edit feedback comment:", error);
      setCommentErrors((errors) => ({
        ...errors,
        [feedbackId]: error instanceof Error ? error.message : "Could not edit your comment.",
      }));
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGalleryError(null);
    if (!galleryTitle.trim()) {
      setGalleryError("A title is required.");
      return;
    }
    if (!galleryName.trim() || !galleryEmail.trim() || !galleryConsent) {
      setGalleryError("Enter your name and email, and confirm permission to publish this media if approved.");
      return;
    }
    if (!galleryFile) {
      setGalleryError("Please select a photo or video.");
      return;
    }

    const payload = new FormData();
    payload.append("title", galleryTitle.trim());
    payload.append("name", galleryName.trim());
    payload.append("email", galleryEmail.trim());
    payload.append("consent", String(galleryConsent));
    payload.append("media", galleryFile);

    setGallerySubmitting(true);
    try {
      const res = await fetch("/volunteer-gallery", {
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
      <section className="relative min-h-[75vh] flex items-center py-12 overflow-hidden bg-white">

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">

          {/* Centered content */}
          <div className="flex flex-col items-center text-center space-y-6">

            {/* Badge + Session bar — centered */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/60 border border-pink-200/50 text-primary text-xs font-bold "
              >
                <Activity className="h-4 w-4 text-primary " />
                Join the Movement
              </motion.div>

              {/* Session State Badge & Actions */}
              {!session ? (
                <Link href="/volunteer/login">
                  <Button
                    variant="ghost"
                    className="text-xs font-bold text-white bg-primary hover:bg-pink-600 hover:text-white border border-primary rounded-lg px-4 py-1.5 transition-all"
                  >
                    Login as Volunteer
                  </Button>
                </Link>
              ) : session.volunteerStatus === "PENDING" ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-primary text-xs font-bold ">
                  <AlertTriangle className="h-4 w-4 text-primary " />
                  Your volunteer application is under review
                </div>
              ) : session.volunteerStatus === "VERIFIED" ? (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 border border-pink-200/50 text-primary text-xs font-bold ">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Verified Volunteer
                  </div>
                  <Button
                    onClick={() => setShowFeedbackModal(true)}
                    className="bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-full px-3.5 py-1.5"
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                    Submit Feedback
                  </Button>
                  <Button
                    onClick={() => setShowGalleryModal(true)}
                    className="bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-full px-3.5 py-1.5"
                  >
                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                    Upload to Gallery
                  </Button>
                  {session.certificateCode && (
                    <Link
                      href="/campaigns/volunteers/certificate"
                      className="inline-flex items-center bg-white hover:bg-pink-50 text-primary text-xs font-bold border border-pink-200 rounded-full px-3.5 py-1.5 transition-all"
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
                    className="text-xs font-bold text-slate-600 hover:text-primary border border-slate-200 rounded-full px-3 py-1.5"
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
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-800 leading-[1.1]"
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
                className="bg-primary hover:bg-primary/95 text-white font-bold rounded-full shadow-md shadow-pink-100 hover:shadow-lg hover:shadow-pink-200/50 px-8 py-6 transition-all text-sm tracking-wide cursor-pointer"
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= WHY VOLUNTEER? ================= */}
      <section className="py-12 md:py-16 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-10">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold ">
              <Info className="h-3.5 w-3.5" /> Our Mission
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight leading-tight">
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
                <Card className="border-pink-100/60 bg-gradient-to-br from-white to-pink-50/[0.03] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-6 hover:border-pink-300 group">
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

      {/* ================= VOLUNTEER IMPACT ================= */}
      <section className="py-12 md:py-16 bg-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[5%] w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8 relative z-10">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 border border-white/10 text-white text-xs font-bold ">
              <TrendingUp className="h-3.5 w-3.5 text-pink-200" /> Community Milestones
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Our Collective Volunteer Impact
            </h2>
            <p className="text-pink-100 text-sm sm:text-base font-medium">
              We track campaign outreach and active volunteer stats to continuously audit regional support performance.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-bold text-white tracking-tight">{formatStat(initialStats.volunteers)}</div>
              <h4 className="text-xs sm:text-sm font-bold text-pink-100 ">Volunteers</h4>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-bold text-white tracking-tight">{formatStat(initialStats.campaigns)}</div>
              <h4 className="text-xs sm:text-sm font-bold text-pink-100 ">Campaigns</h4>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-bold text-white tracking-tight">{formatStat(initialStats.reached)}</div>
              <h4 className="text-xs sm:text-sm font-bold text-pink-100 ">People Reached</h4>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-bold text-white tracking-tight">{formatStat(initialStats.events)}</div>
              <h4 className="text-xs sm:text-sm font-bold text-pink-100 ">Events Organized</h4>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OPEN VOLUNTEER CALLS (UPCOMING EVENTS) ================= */}
      {initialEvents.length > 0 && (
        <section className="py-12 md:py-16 bg-gradient-to-b from-rose-50/30 to-white border-t border-rose-100/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold ">
                <Calendar className="h-3.5 w-3.5" /> Upcoming Events
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-800">
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
              className={initialEvents.length === 1 ? "grid grid-cols-1 gap-6" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}
            >
              {initialEvents.map((event) => {
                const isFull = event.filledSlots >= event.slots;

                return (
                  <motion.div key={event.id} variants={fadeInUp}>
                    <Card className={`border-pink-100/60 bg-gradient-to-br from-white to-pink-50/[0.03] shadow-sm hover:shadow-md rounded-2xl p-6 flex h-full group hover:border-pink-300 transition-all ${initialEvents.length === 1 ? "flex-col md:flex-row md:items-center md:gap-8 md:p-6" : "flex-col justify-between"}`}>
                      <div className={`space-y-3 ${initialEvents.length === 1 ? "md:flex-1" : ""}`}>
                        <h3 className="font-heading font-bold text-lg text-slate-800 group-hover:text-primary transition-colors leading-snug">
                          {event.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 font-semibold pt-2">
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

                      <div className={`pt-6 mt-4 border-t border-pink-50 ${initialEvents.length === 1 ? "md:w-56 md:shrink-0 md:pt-0 md:mt-0 md:border-t-0 md:border-l md:pl-8" : ""}`}>
                        {!session ? (
                          <Link href="/volunteer/login">
                            <Button
                              variant="outline"
                              className="w-full border-pink-200 text-primary hover:bg-pink-50/60 font-bold text-xs rounded-lg py-5"
                            >
                              Login to Apply
                            </Button>
                          </Link>
                        ) : session.volunteerStatus === "PENDING" ? (
                          <Button
                            disabled
                            className="w-full bg-slate-100 text-slate-400 font-bold text-xs rounded-lg py-5 cursor-not-allowed border border-slate-200"
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
                            className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-full py-5 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-pink-100"
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
      <section id="community-feedback" className="py-12 md:py-16 bg-white border-t border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold ">
              <MessageSquare className="h-3.5 w-3.5" /> Community Feedback
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-800">
              Voices of Our Volunteers
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Share your experience with the community. Feedback appears here as soon as you submit it.
            </p>
            <Button
              onClick={() => setShowFeedbackModal(true)}
              className="mt-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-full px-5 py-2.5 transition-all cursor-pointer shadow-md shadow-pink-100"
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
              Share Feedback
            </Button>
          </div>

          {feedbackItems.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
            >
              {feedbackItems.map((fb) => (
                <motion.div key={fb.id} variants={fadeInUp} className="min-w-0">
                  <Card className="h-full min-h-[230px] border-pink-100/60 bg-gradient-to-br from-white to-pink-50/[0.03] shadow-sm hover:shadow-md transition-all duration-300 rounded-lg p-4 sm:p-5 flex flex-col hover:border-pink-300 group">
                    <div className="min-w-0 space-y-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < fb.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                              }`}
                          />
                        ))}
                      </div>
                      <p className={`${expandedFeedbackIds.includes(fb.id) ? "" : "line-clamp-6"} break-words text-slate-600 text-xs sm:text-sm italic font-medium leading-relaxed`}>
                        &ldquo;{fb.review}&rdquo;
                      </p>
                      {fb.review.length > 240 && (
                        <button
                          type="button"
                          onClick={() => setExpandedFeedbackIds((ids) =>
                            ids.includes(fb.id) ? ids.filter((id) => id !== fb.id) : [...ids, fb.id]
                          )}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          {expandedFeedbackIds.includes(fb.id) ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-pink-50">
                      <div className="flex min-w-0 items-center gap-3">
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

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => handleFeedbackLike(fb.id)}
                          disabled={!feedbackVisitorKey}
                          aria-pressed={likedFeedbackIds.includes(fb.id)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                            likedFeedbackIds.includes(fb.id)
                              ? "border-rose-200 bg-rose-50 text-rose-600"
                              : "border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-600"
                          }`}
                        >
                          <Heart className={`h-3.5 w-3.5 ${likedFeedbackIds.includes(fb.id) ? "fill-current" : ""}`} />
                          {feedbackLikeCounts[fb.id] || 0}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleFeedbackComments(fb.id)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-primary/30 hover:text-primary"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          {feedbackCommentCounts[fb.id] || 0} comments
                        </button>
                      </div>

                      {expandedCommentsIds.includes(fb.id) && (
                        <div className="mt-4 space-y-3">
                          <div className="max-h-48 space-y-3 overflow-y-auto">
                            {(feedbackComments[fb.id] || []).length ? (
                              feedbackComments[fb.id].map((comment) => (
                                <div key={comment.id} className="rounded-lg bg-slate-50 p-3">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <p className="break-words text-xs font-bold text-slate-700">{comment.name}</p>
                                      <p className="mt-1 break-words text-xs leading-relaxed text-slate-600">{comment.message}</p>
                                    </div>
                                    {commentAuthorTokens[comment.id] && (
                                      <button
                                        type="button"
                                        onClick={() => handleEditFeedbackComment(fb.id, comment)}
                                        className="shrink-0 text-[11px] font-semibold text-primary hover:underline"
                                      >
                                        Edit
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-500">No comments yet. Start the conversation.</p>
                            )}
                          </div>

                          <form onSubmit={(event) => handleFeedbackCommentSubmit(event, fb.id)} className="space-y-2">
                            <input
                              value={commentNames[fb.id] || ""}
                              onChange={(event) => setCommentNames((names) => ({ ...names, [fb.id]: event.target.value }))}
                              maxLength={100}
                              required
                              aria-label="Your name"
                              placeholder="Your name"
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-primary"
                            />
                            <textarea
                              value={commentDrafts[fb.id] || ""}
                              onChange={(event) => setCommentDrafts((drafts) => ({ ...drafts, [fb.id]: event.target.value }))}
                              maxLength={1000}
                              required
                              rows={2}
                              aria-label="Write a comment"
                              placeholder="Write a comment..."
                              className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-primary"
                            />
                            {commentErrors[fb.id] && (
                              <p role="alert" className="text-xs text-rose-600">{commentErrors[fb.id]}</p>
                            )}
                            <Button type="submit" size="sm" disabled={commentSubmittingId === fb.id} className="h-8 text-xs">
                              {commentSubmittingId === fb.id ? "Posting..." : "Post comment"}
                            </Button>
                          </form>
                        </div>
                      )}
                      {commentErrors[fb.id] && !expandedCommentsIds.includes(fb.id) && (
                        <p role="alert" className="mt-2 text-xs text-rose-600">{commentErrors[fb.id]}</p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="border-2 border-dashed border-pink-200 bg-pink-50/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 max-w-xl mx-auto">
              <MessageSquare className="h-8 w-8 text-pink-400" />
              <h3 className="font-heading font-bold text-lg text-slate-700">No stories yet</h3>
              <p className="text-xs text-slate-500 max-w-sm font-medium">
                Be the first to share your volunteer experience.
              </p>
              <Button
                onClick={() => setShowFeedbackModal(true)}
                className="mt-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-full px-5 py-2.5 transition-all cursor-pointer shadow-md shadow-pink-100"
              >
                Share Your Story
              </Button>
            </div>
          )}
        </div>
      </section>

      
      {/* ================= VOLUNTEER GALLERY / MEDIA ARCHIVE ================= */}
      <section className="py-12 md:py-16 bg-white border-t border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold ">
                <Video className="h-3.5 w-3.5" /> Media Archive
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-800">
                Volunteer Gallery
              </h2>
              <p className="text-slate-500 text-sm sm:text-base font-medium">
                Highlights from our nationwide awareness drives, screening camps, and community events.
              </p>
            </div>
            <Button
              onClick={() => setShowGalleryModal(true)}
              className="bg-primary hover:bg-primary/95 text-white font-bold rounded-full px-6 py-6 text-xs flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer transition-all shadow-md shadow-pink-100"
            >
              <Upload className="h-4 w-4" />
              Share Photo or Video
            </Button>
          </div>

          {galleryItems.length > 0 ? (
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
                  className="relative aspect-square min-w-0 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border border-pink-100/60 bg-slate-900"
                >
                  {item.mediaType === "video" ? (
                    <video
                      src={item.src}
                      muted
                      playsInline
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-contain"
                    />
                  )}
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
          ) : (
            <div className="border-2 border-dashed border-pink-200 bg-pink-50/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 max-w-xl mx-auto">
              <Video className="h-8 w-8 text-pink-400" />
              <h3 className="font-heading font-bold text-lg text-slate-700">No media yet</h3>
              <p className="text-xs text-slate-500 max-w-sm font-medium">
                Anyone can share a campaign photo or video. Submissions appear here after admin approval.
              </p>
              <Button
                onClick={() => setShowGalleryModal(true)}
                className="mt-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-full px-5 py-2.5 transition-all cursor-pointer shadow-md shadow-pink-100"
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Share First Photo or Video
              </Button>
            </div>
          )}
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
              className="bg-white rounded-2xl p-4 sm:p-6 max-w-lg w-full max-h-[90dvh] overflow-y-auto shadow-lg relative border border-pink-100"
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
                    Thank you! Your feedback is published on the community board immediately. No admin approval is required.
                  </p>
                  <Button
                    onClick={() => {
                      setShowFeedbackModal(false);
                      setFeedbackSuccess(false);
                      document.getElementById("community-feedback")?.scrollIntoView({ behavior: "smooth" });
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
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={feedbackName}
                      onChange={(e) => setFeedbackName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Email Address (not shown publicly)
                    </label>
                    <input
                      type="email"
                      required
                      maxLength={254}
                      value={feedbackEmail}
                      onChange={(e) => setFeedbackEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
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
                            className={`h-7 w-7 ${star <= feedbackRating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Your Experience Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      maxLength={2000}
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder="Share highlights from your volunteer drive or campaign work..."
                      className="w-full border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary transition-all resize-none font-medium"
                    />
                  </div>
                  <label className="flex items-start gap-2 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      required
                      checked={feedbackConsent}
                      onChange={(e) => setFeedbackConsent(e.target.checked)}
                      className="mt-0.5 accent-primary"
                    />
                    <span>I agree that my feedback and name will be shown publicly when submitted.</span>
                  </label>

                  <Button
                    type="submit"
                    disabled={feedbackSubmitting}
                    className="w-full py-5 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-md shadow-pink-100"
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
              className="bg-white rounded-2xl p-4 sm:p-6 max-w-lg w-full max-h-[90dvh] overflow-y-auto shadow-lg relative border border-pink-100"
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
                  <h4 className="font-bold text-slate-800 text-base">Media Submitted!</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Your photo or video has been sent for admin review. It will be published to the gallery upon approval.
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
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={galleryName}
                      onChange={(e) => setGalleryName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Email Address (not shown publicly)
                    </label>
                    <input
                      type="email"
                      required
                      maxLength={254}
                      value={galleryEmail}
                      onChange={(e) => setGalleryEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Photo or Video Title
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={120}
                      value={galleryTitle}
                      onChange={(e) => setGalleryTitle(e.target.value)}
                      placeholder="e.g. Pune Health Camp Awareness Drive"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-primary transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Select Photo (Max 5MB) or Video (Max 50MB)
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                      required
                      onChange={handleGalleryFileSelect}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-pink-50 file:text-primary hover:file:bg-pink-100 transition-all cursor-pointer border border-slate-200 rounded-xl p-2"
                    />
                  </div>

                  {galleryPreview && (
                    <div className="rounded-lg overflow-hidden max-h-48 border border-pink-100 relative aspect-video bg-slate-900">
                      {galleryFile?.type.startsWith("video/") ? (
                        <video src={galleryPreview} controls className="h-full w-full object-contain" />
                      ) : (
                        <Image
                          src={galleryPreview}
                          alt="Upload Preview"
                          fill
                          sizes="(max-width: 640px) 90vw, 448px"
                          className="object-contain"
                        />
                      )}
                    </div>
                  )}

                  <label className="flex items-start gap-2 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      required
                      checked={galleryConsent}
                      onChange={(e) => setGalleryConsent(e.target.checked)}
                      className="mt-0.5 accent-primary"
                    />
                    <span>I confirm I have permission to share this media, and it may be shown publicly if approved by the admin.</span>
                  </label>

                  <Button
                    type="submit"
                    disabled={gallerySubmitting}
                    className="w-full py-5 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-md shadow-pink-100"
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
              className="relative max-w-3xl w-full max-h-[90dvh] bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-white/10"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative aspect-video w-full bg-black">
                {lightboxImage.mediaType === "video" ? (
                  <video src={lightboxImage.src} controls autoPlay className="h-full w-full object-contain" />
                ) : (
                  <Image
                    src={lightboxImage.src}
                    alt={lightboxImage.title}
                    fill
                    className="object-contain"
                  />
                )}
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


      {/* ================= VOLUNTEER REGISTRATION FORM ================= */}
      <section ref={formRef} className="py-12 md:py-16 bg-gradient-to-b from-white to-rose-50/30 border-t border-rose-100/20 scroll-mt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl space-y-10">

          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold ">
              <Sparkles className="h-3.5 w-3.5" /> Registration Form
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-800">
              Apply to Volunteer
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Submit your application below. We will map your profile to our active regional drives.
            </p>
          </div>

          <Card className="border-pink-100/60 bg-white shadow-md rounded-2xl p-6 relative overflow-hidden">
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
                      <label className="text-xs font-bold text-slate-500 ">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${errors.fullName ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-pink-100"
                          }`}
                        placeholder="Jane Doe"
                      />
                      {errors.fullName && <p className="text-[11px] text-rose-500 font-bold">{errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${errors.email ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-pink-100"
                          }`}
                        placeholder="jane@example.com"
                      />
                      {errors.email && <p className="text-[11px] text-rose-500 font-bold">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${errors.phone ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-pink-100"
                          }`}
                        placeholder="+91 9876543210"
                      />
                      {errors.phone && <p className="text-[11px] text-rose-500 font-bold">{errors.phone}</p>}
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${errors.city ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-pink-100"
                          }`}
                        placeholder="Pune"
                      />
                      {errors.city && <p className="text-[11px] text-rose-500 font-bold">{errors.city}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Age */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ">Age</label>
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
                      {errors.age && <p className="text-[11px] text-rose-500 font-bold">{errors.age}</p>}
                    </div>

                    {/* Occupation */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ">Occupation</label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${errors.occupation ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-pink-100"
                          }`}
                        placeholder="Student / Working Professional"
                      />
                      {errors.occupation && <p className="text-[11px] text-rose-500 font-bold">{errors.occupation}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Areas of Interest */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ">Areas of Interest</label>
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

                    {/* Preferred Volunteer Team */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ">Preferred Volunteer Team</label>
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-pink-100 bg-white"
                      >
                        <option value="Anchoring">Anchoring</option>
                        <option value="Felicitation team">Felicitation team</option>
                        <option value="Photography">Photography</option>
                        <option value="Food distribution">Food distribution</option>
                        <option value="Volunteering support">Volunteering support</option>
                        <option value="Registration desk">Registration desk</option>
                        <option value="Media Management & PR">Media Management &amp; PR</option>
                        <option value="Report and Documentation">Report and Documentation</option>
                        <option value="Stage preparation">Stage preparation</option>
                      </select>
                    </div>
                  </div>

                  {/* Motivation */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ">Why do you want to volunteer?</label>
                    <textarea
                      name="motivation"
                      rows={4}
                      value={formData.motivation}
                      onChange={handleInputChange}
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all resize-none ${errors.motivation ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-pink-100"
                        }`}
                      placeholder="Share your goals or why you want to join our volunteer crew..."
                    />
                    {errors.motivation && <p className="text-[11px] text-rose-500 font-bold">{errors.motivation}</p>}
                  </div>

                  {/* Action Info Note */}
                  <div className="flex gap-2 p-4 rounded-xl bg-pink-50/40 text-slate-500 border border-pink-100/50">
                    <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <p className="text-[11px] leading-relaxed font-semibold">
                      Your inputs will be synced with our databases for audit verification. Coordinators will notify you about orientation webinar slots shortly.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-lg py-5 transition-all text-sm cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-pink-100"
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
                  <div className="h-16 w-16 rounded-full bg-pink-50 text-primary flex items-center justify-center mx-auto border border-pink-100 ">
                    <Check className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-heading text-2xl font-bold text-slate-800">Application Received!</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">
                      Thank you, <strong className="text-slate-800">{formData.fullName}</strong>. Your volunteer application for <strong className="text-slate-800 ">{formData.interest}</strong> has been logged.
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Check your email inbox at <strong className="text-slate-700">{formData.email}</strong> for welcome messages and upcoming orientation webinar links.
                  </p>
                  <div className="pt-4 flex gap-3 justify-center">
                    <Button
                      onClick={resetForm}
                      className="bg-primary hover:bg-primary/95 text-white font-bold rounded-lg py-5 px-6 transition-all text-xs cursor-pointer shadow-md shadow-pink-100"
                    >
                      Submit Another
                    </Button>
                    <Link href="/">
                      <Button
                        variant="outline"
                        className="border-pink-200 text-primary hover:bg-pink-50/60 font-bold rounded-lg py-5 px-6 transition-all text-xs "
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


      {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-rose-50/30 border-t border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-8">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold ">
              <HelpCircle className="h-3.5 w-3.5" /> FAQ Accordion
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight leading-tight">
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
                <div key={idx} className="border border-pink-100/60 rounded-2xl bg-white overflow-hidden shadow-sm hover:border-pink-300 transition-all">
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
      <section className="py-10 md:py-14 bg-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[5%] w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-8 relative z-10">

          <div className="space-y-4">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight leading-tight text-pink-500">
              Ready to Make a Difference?
            </h2>
            <p className="text-pink-100 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
              Join our volunteer community today and help us spread breast cancer awareness, organize screening camps, and support patients across India.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
              onClick={() => scrollToForm()}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-primary font-bold rounded-full py-6 px-8 shadow-lg transition-all text-sm cursor-pointer"
            >
              Become a Volunteer
            </Button>
            <Link href="/donate" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white/40 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg py-5 px-6 transition-all text-sm cursor-pointer"
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
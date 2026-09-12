"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Stethoscope, BookOpen, Video, Plus, Calendar, Clock, 
  MapPin, Users, Edit3, Trash2, Eye, CheckCircle, ShieldCheck, 
  FileText, Activity, AlertCircle, Sparkles, Building2, Check, X, ExternalLink,
  Tag, Info
} from "lucide-react";
import { createDoctorArticleAction, updateDoctorArticleAction, deleteDoctorArticleAction } from "@/app/actions/articles";
import { createDoctorWebinarAction, updateDoctorWebinarAction, deleteDoctorWebinarAction } from "@/app/actions/webinars";
import { resubmitDoctorVerificationAction } from "@/app/actions/doctor";
import { calculateWebinarDurationMinutes, calculateMinimumAllowedPrice, formatDurationHumanReadable } from "@/lib/webinarPricing";
import Link from "next/link";
import DoctorProfileModal from "./DoctorProfileModal";

interface DoctorDashboardProps {
  initialData: {
    doctor: {
      id: string;
      doctorId: string;
      name: string;
      email: string | null;
      specialty: string;
      hospitalAffiliation: string;
      medicalLicenseNumber: string;
      verificationStatus: any;
      rejectionReason?: string | null;
      verificationDocument?: string | null;
    };
    stats: {
      totalArticlesPublished: number;
      draftArticles: number;
      totalWebinarsCreated: number;
      upcomingWebinars: number;
      completedWebinars: number;
    };
    myArticles: any[];
    myWebinars: any[];
    recentActivity: any[];
  };
}

export default function DoctorDashboard({ initialData }: DoctorDashboardProps) {
  const [data, setData] = useState(initialData);

  // Article Modal States
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [viewingArticle, setViewingArticle] = useState<any>(null);
  const [articleForm, setArticleForm] = useState({
    title: "",
    category: "Clinical Guidance",
    excerpt: "",
    content: "",
    fileUrl: "",
    featuredImage: "",
    specialty: data.doctor.specialty || "Oncology Specialist",
    status: "PENDING" as "PENDING" | "DRAFT" | "APPROVED",
  });
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Webinar Modal States
  const [isWebinarModalOpen, setIsWebinarModalOpen] = useState(false);
  const [editingWebinar, setEditingWebinar] = useState<any>(null);
  const [viewingWebinar, setViewingWebinar] = useState<any>(null);
  const [webinarForm, setWebinarForm] = useState({
    title: "",
    description: "",
    category: "Clinical Awareness",
    date: new Date().toISOString().split("T")[0],
    startTime: "14:00",
    endTime: "15:00",
    webinarMode: "Online",
    venue: "Online Room 1",
    meetingLink: "https://zoom.us/j/grs-oncology-stream",
    maxSeats: 100,
    status: "PUBLISHED",
    webinarType: "FREE" as "FREE" | "PAID",
    registrationPrice: 49,
  });

  // Dynamic live pricing & duration calculation
  const startDateTimeStr = `${webinarForm.date}T${webinarForm.startTime || "10:00"}:00`;
  const endDateTimeStr = `${webinarForm.date}T${webinarForm.endTime || "11:00"}:00`;
  const calculatedDuration = calculateWebinarDurationMinutes(startDateTimeStr, endDateTimeStr);
  const platformMinimumPrice = calculateMinimumAllowedPrice(calculatedDuration);
  const humanDurationStr = formatDurationHumanReadable(calculatedDuration);
  const isTimeInvalid = calculatedDuration <= 0;
  const isPriceInvalid =
    webinarForm.webinarType === "PAID" &&
    (Number(webinarForm.registrationPrice) < platformMinimumPrice || isNaN(Number(webinarForm.registrationPrice)));

  // Doctor Profile View Modal State
  const [isSelfProfileModalOpen, setIsSelfProfileModalOpen] = useState(false);

  // Doctor Verification Resubmit Modal State
  const [isResubmitModalOpen, setIsResubmitModalOpen] = useState(false);
  const [resubmitForm, setResubmitForm] = useState({
    medicalLicenseNumber: data.doctor.medicalLicenseNumber || "",
    hospitalAffiliation: data.doctor.hospitalAffiliation || "",
    specialty: data.doctor.specialty || "",
    verificationDocument: data.doctor.verificationDocument || "",
  });
  const [resubmitLoading, setResubmitLoading] = useState(false);
  const [resubmitError, setResubmitError] = useState<string | null>(null);

  const handleResubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setResubmitLoading(true);
    setResubmitError(null);

    try {
      const res = await resubmitDoctorVerificationAction(resubmitForm);
      if (res.error) {
        setResubmitError(res.error);
      } else {
        setIsResubmitModalOpen(false);
        alert("Your professional credentials have been resubmitted for administration verification.");
        window.location.reload();
      }
    } catch (err: any) {
      setResubmitError(err.message || "Failed to resubmit verification.");
    } finally {
      setResubmitLoading(false);
    }
  };

  // Form submitting indicator
  const [submitting, setSubmitting] = useState(false);

  // ----------------ARTICLE HANDLERS----------------
  const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const resData = await res.json();
      if (resData.url) {
        setArticleForm((prev) => ({ ...prev, fileUrl: resData.url }));
      } else {
        alert(resData.error || "File upload failed");
      }
    } catch (err: any) {
      alert("Error uploading file: " + err.message);
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const resData = await res.json();
      if (resData.url) {
        setArticleForm((prev) => ({ ...prev, featuredImage: resData.url }));
      } else {
        alert(resData.error || "Image upload failed");
      }
    } catch (err: any) {
      alert("Error uploading image: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const openNewArticleModal = () => {
    setEditingArticle(null);
    setArticleForm({
      title: "",
      category: "Clinical Guidance",
      excerpt: "",
      content: "",
      fileUrl: "",
      featuredImage: "",
      specialty: data.doctor.specialty || "Oncology Specialist",
      status: "PENDING",
    });
    setIsArticleModalOpen(true);
  };

  const openEditArticleModal = (article: any) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title,
      category: article.category || "Clinical Guidance",
      excerpt: article.excerpt || "",
      content: article.content || "",
      fileUrl: article.fileUrl || "",
      featuredImage: article.featuredImage || "",
      specialty: article.specialty || data.doctor.specialty || "Oncology Specialist",
      status: article.status === "DRAFT" ? "DRAFT" : (article.status || "PENDING"),
    });
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = async (statusOverride?: "PENDING" | "DRAFT") => {
    if (!articleForm.title || (!articleForm.content && !articleForm.fileUrl)) {
      alert("Please enter article title and either full content or upload a PDF document.");
      return;
    }

    setSubmitting(true);
    try {
      const targetStatus = statusOverride || articleForm.status;

      if (editingArticle) {
        const res = await updateDoctorArticleAction(editingArticle.id, {
          title: articleForm.title,
          category: articleForm.category,
          excerpt: articleForm.excerpt,
          content: articleForm.content,
          fileUrl: articleForm.fileUrl,
          featuredImage: articleForm.featuredImage,
          specialty: articleForm.specialty,
          status: targetStatus,
        });

        if (res.error) {
          alert(res.error);
        } else {
          setIsArticleModalOpen(false);
          window.location.reload();
        }
      } else {
        const res = await createDoctorArticleAction({
          title: articleForm.title,
          category: articleForm.category,
          excerpt: articleForm.excerpt,
          content: articleForm.content,
          fileUrl: articleForm.fileUrl,
          featuredImage: articleForm.featuredImage,
          specialty: articleForm.specialty,
          status: targetStatus,
        });

        if (res.error) {
          alert(res.error);
        } else {
          setIsArticleModalOpen(false);
          window.location.reload();
        }
      }
    } catch (e: any) {
      alert(e.message || "Failed to save article.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;

    try {
      const res = await deleteDoctorArticleAction(articleId);
      if (res.error) {
        alert(res.error);
      } else {
        window.location.reload();
      }
    } catch (e: any) {
      alert(e.message || "Failed to delete article.");
    }
  };

  // ----------------WEBINAR HANDLERS----------------
  const openNewWebinarModal = () => {
    setEditingWebinar(null);
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    setWebinarForm({
      title: "",
      description: "",
      category: "Clinical Awareness",
      date: tomorrow,
      startTime: "14:00",
      endTime: "15:00",
      webinarMode: "Online",
      venue: "Online Stream",
      meetingLink: "https://zoom.us/j/grs-doctor-room",
      maxSeats: 100,
      status: "PUBLISHED",
      webinarType: "FREE",
      registrationPrice: 49,
    });
    setIsWebinarModalOpen(true);
  };

  const openEditWebinarModal = (webinar: any) => {
    setEditingWebinar(webinar);
    const dateStr = webinar.rawDate ? new Date(webinar.rawDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
    setWebinarForm({
      title: webinar.title,
      description: webinar.description || "",
      category: webinar.category || "General",
      date: dateStr,
      startTime: webinar.startTime || "14:00",
      endTime: webinar.endTime || "15:00",
      webinarMode: webinar.webinarMode || "Online",
      venue: webinar.venue || "Online Room",
      meetingLink: webinar.meetingLink || "",
      maxSeats: webinar.maxSeats || 100,
      status: webinar.status || "PUBLISHED",
      webinarType: webinar.webinarType || "FREE",
      registrationPrice: webinar.registrationPrice || 49,
    });
    setIsWebinarModalOpen(true);
  };

  const handleSaveWebinar = async () => {
    if (!webinarForm.title || !webinarForm.date) {
      alert("Please specify webinar title and scheduled date.");
      return;
    }

    if (isTimeInvalid) {
      alert("Invalid schedule: End time must be later than start time.");
      return;
    }

    if (webinarForm.webinarType === "PAID" && isPriceInvalid) {
      alert(`Registration price (₹${webinarForm.registrationPrice}) cannot be lower than the platform minimum of ₹${platformMinimumPrice} for a ${calculatedDuration}-minute webinar.`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: webinarForm.title,
        description: webinarForm.description,
        category: webinarForm.category,
        date: webinarForm.date,
        startTime: startDateTimeStr,
        endTime: endDateTimeStr,
        webinarMode: webinarForm.webinarMode,
        venue: webinarForm.venue,
        meetingLink: webinarForm.meetingLink,
        maxSeats: webinarForm.maxSeats,
        status: webinarForm.status,
        webinarType: webinarForm.webinarType,
        registrationPrice: webinarForm.webinarType === "PAID" ? Number(webinarForm.registrationPrice) : 0,
      };

      if (editingWebinar) {
        const res = await updateDoctorWebinarAction(editingWebinar.id, payload);
        if (!res.success) {
          alert((res as any).error || "Failed to update webinar");
        } else {
          setIsWebinarModalOpen(false);
          window.location.reload();
        }
      } else {
        const res = await createDoctorWebinarAction(payload);
        if (!res.success) {
          alert((res as any).error || "Failed to create webinar");
        } else {
          setIsWebinarModalOpen(false);
          window.location.reload();
        }
      }
    } catch (e: any) {
      alert(e.message || "Failed to save webinar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWebinar = async (webinarId: string) => {
    if (!confirm("Are you sure you want to delete this webinar? All registrations will be removed.")) return;

    try {
      const res = await deleteDoctorWebinarAction(webinarId);
      if (res.error) {
        alert(res.error);
      } else {
        window.location.reload();
      }
    } catch (e: any) {
      alert(e.message || "Failed to delete webinar.");
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. DOCTOR PROFILE BANNER & QUICK ACTIONS */}
      <div className="bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-900/40 relative overflow-hidden">
        
        {/* Background glow graphics */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          
          {/* Left Doctor Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="h-20 w-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-lg text-primary">
              <Stethoscope className="h-10 w-10 text-pink-400" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Dr. {data.doctor.name}
                </h1>
                {data.doctor.verificationStatus === "VERIFIED" ? (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> VERIFIED DOCTOR
                  </span>
                ) : data.doctor.verificationStatus === "PENDING" ? (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> PENDING VERIFICATION
                  </span>
                ) : (
                  <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> VERIFICATION REJECTED
                  </span>
                )}
              </div>

              <p className="text-pink-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <span>{data.doctor.specialty}</span>
                <span className="text-pink-400">•</span>
                <span className="text-slate-300">{data.doctor.hospitalAffiliation}</span>
              </p>

              <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-mono">
                <span className="bg-white/10 px-2.5 py-0.5 rounded-md text-pink-300 font-bold">
                  Doctor ID: {data.doctor.doctorId}
                </span>
                <span>License No: {data.doctor.medicalLicenseNumber}</span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap gap-3 shrink-0 w-full sm:w-auto">
            <Button 
              onClick={openNewArticleModal}
              className="flex-1 sm:flex-initial bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-lg px-5 py-2.5 text-xs flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102"
            >
              <Plus className="h-4 w-4" /> Write Article
            </Button>
            <Button 
              onClick={() => {
                if (data.doctor.verificationStatus !== "VERIFIED") {
                  alert(`Doctor Verification Required: Your account is currently ${data.doctor.verificationStatus}. Only verified healthcare professionals can create or manage webinars.`);
                  return;
                }
                openNewWebinarModal();
              }}
              disabled={data.doctor.verificationStatus !== "VERIFIED"}
              variant="outline"
              className={`flex-1 sm:flex-initial border-white/20 font-bold rounded-xl px-5 py-2.5 text-xs flex items-center justify-center gap-2 transition-all ${
                data.doctor.verificationStatus === "VERIFIED"
                  ? "bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  : "bg-slate-800/80 text-slate-400 cursor-not-allowed opacity-60"
              }`}
              title={data.doctor.verificationStatus !== "VERIFIED" ? "Doctor verification required to create webinars" : "Create New Live Webinar"}
            >
              <Video className="h-4 w-4" /> Create Webinar
            </Button>
            <Button
              onClick={() => setIsSelfProfileModalOpen(true)}
              variant="ghost"
              className="px-3 text-pink-300 hover:text-white hover:bg-white/10 rounded-xl"
              title="Preview Doctor Card"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ----------------DOCTOR IDENTITY VERIFICATION NOTICE CARD---------------- */}
      {data.doctor.verificationStatus === "PENDING" && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-900 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5">
              <Clock className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-amber-800 uppercase tracking-wider">Verification Pending</span>
                <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">UNDER REVIEW</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                Your professional credentials are under review. Webinar creation will become available once your account is verified by our administration team.
              </p>
            </div>
          </div>
        </div>
      )}

      {data.doctor.verificationStatus === "REJECTED" && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-red-900 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-red-600 text-white rounded-xl shrink-0 mt-0.5">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-red-700 uppercase tracking-wider">Verification Rejected</span>
                <span className="bg-red-200 text-red-900 text-[10px] font-black px-2 py-0.5 rounded-full">ACTION REQUIRED</span>
              </div>
              <p className="text-xs text-red-800 font-medium">
                <strong>Reason for Rejection:</strong> "{data.doctor.rejectionReason || "Please review and correct your professional license details."}"
              </p>
              <p className="text-xs text-slate-600">
                Your verification request was not approved. Please update your professional information below and resubmit for admin review.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsResubmitModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl px-4 py-2.5 shrink-0 shadow-sm cursor-pointer"
          >
            Update &amp; Resubmit Credentials
          </Button>
        </div>
      )}

      {data.doctor.verificationStatus === "VERIFIED" && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex items-center gap-3 text-emerald-900 shadow-sm">
          <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <p className="font-extrabold text-xs text-emerald-800 uppercase tracking-wider">Account Verified</p>
            <p className="text-xs sm:text-sm font-medium text-slate-700">
              Your professional credentials have been verified. You can now create and manage webinars.
            </p>
          </div>
        </div>
      )}

      {/* 2. STATS COUNTERS GRID (REQUIREMENT 2 & 8) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        {/* Counter 1: Total Articles Published */}
        <Card className="rounded-2xl border-pink-100/80 bg-white/80 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Articles Published</span>
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-heading text-2xl font-black text-slate-800">{data.stats.totalArticlesPublished}</span>
            <span className="text-[10px] text-emerald-600 font-bold">Published</span>
          </div>
        </Card>

        {/* Counter 2: Total Webinars Created */}
        <Card className="rounded-2xl border-pink-100/80 bg-white/80 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Webinars Created</span>
            <Video className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-heading text-2xl font-black text-slate-800">{data.stats.totalWebinarsCreated}</span>
            <span className="text-[10px] text-slate-400 font-medium">Total</span>
          </div>
        </Card>

        {/* Counter 3: Upcoming Webinars */}
        <Card className="rounded-2xl border-pink-100/80 bg-white/80 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Upcoming Webinars</span>
            <Calendar className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-heading text-2xl font-black text-slate-800">{data.stats.upcomingWebinars}</span>
            <span className="text-[10px] text-amber-600 font-bold">Scheduled</span>
          </div>
        </Card>

        {/* Counter 4: Completed Webinars */}
        <Card className="rounded-2xl border-pink-100/80 bg-white/80 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Completed Webinars</span>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-heading text-2xl font-black text-slate-800">{data.stats.completedWebinars}</span>
            <span className="text-[10px] text-emerald-600 font-bold">Finished</span>
          </div>
        </Card>

        {/* Counter 5: Draft Articles */}
        <Card className="rounded-2xl border-pink-100/80 bg-white/80 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-shadow col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Draft Articles</span>
            <FileText className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-heading text-2xl font-black text-slate-800">{data.stats.draftArticles}</span>
            <span className="text-[10px] text-slate-500 font-medium">Pending</span>
          </div>
        </Card>

      </div>

      {/* 3. DOCTOR HISTORY TAB SYSTEM (REQUIREMENT 5) */}
      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList className="bg-pink-50/60 border border-pink-100 p-1.5 rounded-2xl flex overflow-x-auto whitespace-nowrap justify-start w-full sm:w-auto">
          <TabsTrigger value="articles" className="font-bold text-xs uppercase py-2 px-5 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xs">
            <BookOpen className="h-4 w-4 mr-1.5" /> My Articles ({data.myArticles.length})
          </TabsTrigger>
          <TabsTrigger value="webinars" className="font-bold text-xs uppercase py-2 px-5 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xs">
            <Video className="h-4 w-4 mr-1.5" /> My Webinars ({data.myWebinars.length})
          </TabsTrigger>
          <TabsTrigger value="activity" className="font-bold text-xs uppercase py-2 px-5 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xs">
            <Activity className="h-4 w-4 mr-1.5" /> Recent Activity
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: MY ARTICLES HISTORY (REQUIREMENT 5.A) */}
        <TabsContent value="articles">
          <Card className="rounded-3xl border border-pink-100 shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b border-pink-50 p-6 bg-slate-50/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-heading text-lg font-black text-slate-800">My Clinical Articles &amp; Publications</CardTitle>
                <CardDescription className="text-xs text-slate-500">Manage, edit, or publish oncology articles authored under your doctor profile.</CardDescription>
              </div>
              <Button onClick={openNewArticleModal} size="sm" className="bg-primary text-white font-bold rounded-xl text-xs py-2 px-4 shadow-sm flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" /> New Article
              </Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {data.myArticles.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <BookOpen className="h-10 w-10 text-pink-200 mx-auto" />
                  <p className="text-xs font-semibold text-slate-500">You haven't written any articles yet.</p>
                  <Button onClick={openNewArticleModal} variant="outline" className="border-pink-200 text-slate-700 font-bold text-xs rounded-xl">
                    Write Your First Article
                  </Button>
                </div>
              ) : (
                <table className="w-full text-xs text-left text-slate-600 border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] uppercase text-slate-400 font-black bg-slate-50/80">
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Publish Date</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.myArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-pink-50/30 transition-colors">
                        <td className="p-4 font-bold text-slate-800 max-w-xs">
                          <p className="line-clamp-1">{art.title}</p>
                          <p className="text-[10px] text-slate-400 font-normal line-clamp-1 mt-0.5">{art.excerpt}</p>
                        </td>
                        <td className="p-4">
                          <span className="bg-pink-50 text-primary border border-pink-100 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {art.category}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 font-medium">{art.publishDate}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            art.status === "APPROVED" || art.status === "PUBLISHED"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : art.status === "REJECTED"
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : art.status === "DRAFT"
                              ? "bg-slate-100 text-slate-500 border border-slate-200"
                              : "bg-amber-50 text-amber-600 border border-amber-200"
                          }`}>
                            {art.status === "PENDING" ? "PENDING REVIEW" : art.status}
                          </span>
                          {art.status === "REJECTED" && art.rejectionReason && (
                            <p className="text-[9px] text-red-500 italic mt-0.5 line-clamp-1" title={art.rejectionReason}>
                              {art.rejectionReason}
                            </p>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button 
                              onClick={() => setViewingArticle(art)} 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 px-2 text-slate-600 hover:text-primary hover:bg-pink-50 rounded-lg text-xs"
                              title="View Article"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              onClick={() => openEditArticleModal(art)} 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 px-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs"
                              title="Edit Article"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              onClick={() => handleDeleteArticle(art.id)} 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 px-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs"
                              title="Delete Article"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: MY WEBINARS HISTORY (REQUIREMENT 5.B) */}
        <TabsContent value="webinars">
          <Card className="rounded-3xl border border-pink-100 shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b border-pink-50 p-6 bg-slate-50/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-heading text-lg font-black text-slate-800">My Hosted Webinars</CardTitle>
                <CardDescription className="text-xs text-slate-500">Manage live streams, scheduled sessions, and attendee counts.</CardDescription>
              </div>
              <Button onClick={openNewWebinarModal} size="sm" className="bg-primary text-white font-bold rounded-xl text-xs py-2 px-4 shadow-sm flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" /> Create Webinar
              </Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {data.myWebinars.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Video className="h-10 w-10 text-pink-200 mx-auto" />
                  <p className="text-xs font-semibold text-slate-500">You haven't scheduled any webinars yet.</p>
                  <Button onClick={openNewWebinarModal} variant="outline" className="border-pink-200 text-slate-700 font-bold text-xs rounded-xl">
                    Create Your First Webinar
                  </Button>
                </div>
              ) : (
                <table className="w-full text-xs text-left text-slate-600 border-collapse min-w-[850px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] uppercase text-slate-400 font-black bg-slate-50/80">
                      <th className="p-4">Webinar Title</th>
                      <th className="p-4">Access Type</th>
                      <th className="p-4">Date &amp; Time</th>
                      <th className="p-4">Meeting Room / Link</th>
                      <th className="p-4 text-center">Attendees</th>
                      <th className="p-4 text-center">Approval Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.myWebinars.map((web) => (
                      <tr key={web.id} className="hover:bg-pink-50/30 transition-colors">
                        <td className="p-4 font-bold text-slate-800 max-w-xs">
                          <p className="line-clamp-1">{web.title}</p>
                          <span className="text-[9px] text-slate-400 uppercase font-semibold">{web.category}</span>
                        </td>
                        <td className="p-4">
                          {web.webinarType === "PAID" ? (
                            <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 shadow-xs">
                              <Tag className="h-3 w-3" /> PAID • ₹{web.registrationPrice}
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                              FREE
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-slate-600 font-medium">
                          <div className="flex items-center gap-1 text-slate-700 font-semibold">
                            <Calendar className="h-3 w-3 text-primary shrink-0" /> {web.date}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                            <Clock className="h-2.5 w-2.5 shrink-0" /> {web.startTime} - {web.endTime}
                          </div>
                        </td>
                        <td className="p-4 max-w-[200px]">
                          {web.meetingLink ? (
                            <a href={web.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono text-[11px] truncate block">
                              {web.meetingLink}
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">{web.venue || "Online"}</span>
                          )}
                        </td>
                        <td className="p-4 text-center font-bold text-slate-800">
                          <span className="bg-pink-50 text-primary px-2.5 py-1 rounded-lg text-xs border border-pink-100 inline-flex items-center gap-1">
                            <Users className="h-3 w-3" /> {web.registeredUsersCount} / {web.maxSeats}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {web.approvalStatus === "APPROVED" ? (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-emerald-600" /> APPROVED
                            </span>
                          ) : web.approvalStatus === "PENDING_APPROVAL" ? (
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1" title="Awaiting platform approval">
                              <Clock className="h-3 w-3 text-amber-500" /> PENDING APPROVAL
                            </span>
                          ) : (
                            <span className="bg-red-50 text-red-700 border border-red-200 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 text-red-500" /> REJECTED
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button 
                              onClick={() => setViewingWebinar(web)} 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 px-2 text-slate-600 hover:text-primary hover:bg-pink-50 rounded-lg text-xs"
                              title="View Webinar Details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              onClick={() => openEditWebinarModal(web)} 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 px-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs"
                              title="Edit Webinar"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              onClick={() => handleDeleteWebinar(web.id)} 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 px-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs"
                              title="Delete Webinar"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: RECENT ACTIVITY */}
        <TabsContent value="activity">
          <Card className="rounded-3xl border border-pink-100 shadow-sm bg-white p-6 space-y-4">
            <h3 className="font-heading text-lg font-black text-slate-800">Recent Publishing &amp; Webinar Activity</h3>
            {data.recentActivity.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No recent activity recorded.</p>
            ) : (
              <div className="space-y-3">
                {data.recentActivity.map((act, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl text-white ${act.type === "ARTICLE" ? "bg-pink-500" : "bg-purple-600"}`}>
                        {act.type === "ARTICLE" ? <BookOpen className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{act.title}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">{act.type} • Status: {act.status}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(act.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* ----------------MODAL 1: WRITE / EDIT ARTICLE---------------- */}
      <Dialog open={isArticleModalOpen} onOpenChange={setIsArticleModalOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-3xl p-6 border border-pink-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> {editingArticle ? "Edit Article / Resource" : "Upload Article / Educational Resource"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-xs">
            {/* Title */}
            <div className="space-y-1">
              <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Article Title *</label>
              <input
                type="text"
                placeholder="e.g. Breast Self-Examination Guide & Early Detection"
                value={articleForm.title}
                onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Specialty & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Category</label>
                <select
                  value={articleForm.category}
                  onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none"
                >
                  <option>Clinical Guidance</option>
                  <option>Screening &amp; Care</option>
                  <option>Prevention &amp; Diet</option>
                  <option>Patient Support</option>
                  <option>Surgical Innovations</option>
                  <option>Educational Resource</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Doctor Specialty</label>
                <input
                  type="text"
                  placeholder="e.g. Surgical Oncology Specialist"
                  value={articleForm.specialty}
                  onChange={(e) => setArticleForm({ ...articleForm, specialty: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Author Name Display */}
            <div className="space-y-1">
              <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Author Name (Verified Doctor)</label>
              <input
                type="text"
                disabled
                value={`Dr. ${data.doctor.name || "Medical Specialist"}`}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-100 text-slate-500 font-semibold cursor-not-allowed"
              />
            </div>

            {/* PDF / Document Upload */}
            <div className="space-y-2 p-3 bg-pink-50/30 border border-pink-100 rounded-2xl">
              <label className="font-black uppercase text-[10px] text-pink-700 tracking-wider flex items-center justify-between">
                <span>PDF / Document Attachment</span>
                {articleForm.fileUrl && <span className="text-emerald-600 flex items-center gap-1 font-bold"><CheckCircle className="h-3 w-3" /> Attached</span>}
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  id="pdf-upload-input"
                  className="hidden"
                  onChange={handlePdfFileUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("pdf-upload-input")?.click()}
                  disabled={uploadingPdf}
                  className="w-full sm:w-auto border-pink-200 text-pink-700 hover:bg-pink-100 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {uploadingPdf ? "Uploading PDF..." : articleForm.fileUrl ? "Change PDF File" : "Upload PDF / Document"}
                </Button>
                {articleForm.fileUrl && (
                  <a
                    href={articleForm.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary font-bold hover:underline truncate max-w-xs"
                  >
                    View Uploaded File
                  </a>
                )}
              </div>
              <p className="text-[10.5px] text-slate-500">Attach a PDF handbook, patient checklist, or resource guide for patients to download.</p>
            </div>

            {/* Short Summary / Excerpt */}
            <div className="space-y-1">
              <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Short Description / Summary *</label>
              <input
                type="text"
                placeholder="Brief 1-2 sentence overview shown on the resource card."
                value={articleForm.excerpt}
                onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Optional Cover Image */}
            <div className="space-y-1">
              <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Optional Cover Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://... or upload image"
                  value={articleForm.featuredImage}
                  onChange={(e) => setArticleForm({ ...articleForm, featuredImage: e.target.value })}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none"
                />
                <input
                  type="file"
                  accept="image/*"
                  id="cover-img-input"
                  className="hidden"
                  onChange={handleCoverImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("cover-img-input")?.click()}
                  disabled={uploadingImage}
                  className="border-slate-200 text-slate-600 text-xs rounded-xl"
                >
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-1">
              <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Full Article Content / Notes</label>
              <textarea
                rows={5}
                placeholder="Type detailed medical guidelines, research findings, or clinical advice here..."
                value={articleForm.content}
                onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none resize-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Approval Notice:</strong> Articles submitted by doctors are assigned a status of <strong>PENDING</strong> and must be reviewed and approved by an administrator before appearing on the public Care Provider page.
              </span>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button 
              variant="outline" 
              onClick={() => handleSaveArticle("DRAFT")}
              disabled={submitting || uploadingPdf || uploadingImage}
              className="border-slate-200 text-slate-700 font-bold text-xs rounded-xl px-4"
            >
              Save as Draft
            </Button>
            <Button 
              onClick={() => handleSaveArticle("PENDING")}
              disabled={submitting || uploadingPdf || uploadingImage}
              className="bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl px-5"
            >
              {submitting ? "Submitting..." : "Submit for Admin Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------MODAL 2: CREATE / EDIT WEBINAR---------------- */}
      <Dialog open={isWebinarModalOpen} onOpenChange={setIsWebinarModalOpen}>
        <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-pink-100 shadow-2xl flex flex-col gap-0 overflow-hidden">
          <DialogHeader className="pb-3 sm:pb-4 border-b border-pink-50 shrink-0">
            <DialogTitle className="font-heading text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
              <Video className="h-4 sm:h-5 w-4 sm:w-5 text-primary shrink-0" />
              <span className="truncate">{editingWebinar ? "Edit Webinar" : "Create New Live Webinar"}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-3 sm:py-4 pr-1 sm:pr-2 space-y-4 text-xs sm:text-sm custom-scrollbar">
            {editingWebinar?.approvalStatus === "REJECTED" && editingWebinar?.approvalRejectionReason && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs space-y-1 text-red-800">
                <p className="font-bold uppercase text-[10px] text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> Resubmission Notice
                </p>
                <p className="font-medium">Previous Rejection Reason: "{editingWebinar.approvalRejectionReason}"</p>
                <p className="text-[10.5px] text-slate-600">Once updated and saved, this webinar will be automatically resubmitted for platform admin approval.</p>
              </div>
            )}

            {/* 1. WEBINAR ACCESS TYPE */}
            <div className="space-y-2 p-3 sm:p-4 bg-pink-50/40 rounded-2xl border border-pink-100">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <label className="font-black uppercase text-[10px] sm:text-xs text-slate-500 tracking-wider">Webinar Access Type *</label>
                <span className="text-pink-600 font-bold tracking-normal text-[11px] sm:text-xs font-mono">
                  {webinarForm.webinarType === "FREE" ? "Free Access" : `Paid Access (Min ₹${platformMinimumPrice})`}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setWebinarForm({ ...webinarForm, webinarType: "FREE" })}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer min-h-[44px] ${
                    webinarForm.webinarType === "FREE"
                      ? "bg-white border-primary shadow-xs ring-1 ring-primary/20 text-slate-800"
                      : "bg-white/50 border-slate-200 text-slate-500 hover:bg-white"
                  }`}
                >
                  <div className="pr-2">
                    <p className="font-bold text-xs sm:text-sm">FREE Webinar</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight">Open to all users with instant approval</p>
                  </div>
                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${webinarForm.webinarType === "FREE" ? "border-primary bg-primary text-white" : "border-slate-300"}`}>
                    {webinarForm.webinarType === "FREE" && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWebinarForm({
                      ...webinarForm,
                      webinarType: "PAID",
                      registrationPrice: Math.max(webinarForm.registrationPrice, platformMinimumPrice || 49),
                    });
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer min-h-[44px] ${
                    webinarForm.webinarType === "PAID"
                      ? "bg-white border-purple-600 shadow-xs ring-1 ring-purple-600/20 text-slate-800"
                      : "bg-white/50 border-slate-200 text-slate-500 hover:bg-white"
                  }`}
                >
                  <div className="pr-2">
                    <p className="font-bold text-xs sm:text-sm text-purple-700">PAID Webinar</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight">Paid entry, requires platform approval</p>
                  </div>
                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${webinarForm.webinarType === "PAID" ? "border-purple-600 bg-purple-600 text-white" : "border-slate-300"}`}>
                    {webinarForm.webinarType === "PAID" && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>
              </div>
            </div>

            {/* 2. PRICING & DURATION SECTION (FOR PAID WEBINARS) */}
            {webinarForm.webinarType === "PAID" && (
              <div className="p-3 sm:p-4 bg-purple-50/50 border border-purple-100 rounded-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="font-bold text-xs sm:text-sm text-purple-900 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-purple-600 shrink-0" /> Pricing &amp; Duration Policy
                  </span>
                  <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full ${isTimeInvalid ? "bg-red-100 text-red-600" : "bg-purple-100 text-purple-700"}`}>
                    {isTimeInvalid ? "Invalid Time Selection" : `Duration: ${humanDurationStr}`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="font-black uppercase text-[10px] sm:text-xs text-slate-500 tracking-wider">
                      Platform Minimum Price
                    </label>
                    <div className="px-3 py-2 bg-purple-100/70 border border-purple-200 rounded-xl text-xs sm:text-sm font-black text-purple-900 flex items-center justify-between min-h-[42px]">
                      <span>Policy Minimum</span>
                      <span className="text-sm sm:text-base font-extrabold">₹{platformMinimumPrice}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-black uppercase text-[10px] sm:text-xs text-slate-500 tracking-wider">
                      Registration Price (₹) *
                    </label>
                    <input
                      type="number"
                      min={platformMinimumPrice}
                      step="1"
                      placeholder={`Min ₹${platformMinimumPrice}`}
                      value={webinarForm.registrationPrice}
                      onChange={(e) => setWebinarForm({ ...webinarForm, registrationPrice: parseFloat(e.target.value) || 0 })}
                      className={`w-full px-3 py-2 border rounded-xl text-xs sm:text-sm font-bold bg-white focus:outline-none min-h-[42px] ${
                        isPriceInvalid ? "border-red-500 text-red-600 focus:ring-1 focus:ring-red-500" : "border-purple-200 text-slate-800 focus:border-purple-600"
                      }`}
                    />
                  </div>
                </div>

                {isPriceInvalid && (
                  <p className="text-[11px] sm:text-xs text-red-600 font-bold flex items-start gap-1.5 break-words">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>Price must be at least ₹{platformMinimumPrice} for a {calculatedDuration}-minute webinar.</span>
                  </p>
                )}

                {isTimeInvalid && (
                  <p className="text-[11px] sm:text-xs text-red-600 font-bold flex items-start gap-1.5 break-words">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>End time must be later than start time.</span>
                  </p>
                )}

                <div className="p-2.5 sm:p-3 bg-white/80 rounded-xl border border-purple-100 text-[10.5px] sm:text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                  <Info className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Note:</strong> Paid webinars require platform approval before becoming publicly available. Payment and payout functionality will be added in a future phase.
                  </span>
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1">
              <label className="font-black uppercase text-[10px] sm:text-xs text-slate-500 tracking-wider">Webinar Title *</label>
              <input
                type="text"
                placeholder="e.g. Modern Surgical Advances in Breast Reconstruction"
                value={webinarForm.title}
                onChange={(e) => setWebinarForm({ ...webinarForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none min-h-[42px]"
              />
            </div>

            {/* Date & Time */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <label className="font-black uppercase text-[10px] sm:text-xs text-slate-500 tracking-wider">Scheduled Date &amp; Time *</label>
                <span className={`text-[10px] sm:text-xs font-bold ${isTimeInvalid ? "text-red-500" : "text-slate-500"}`}>
                  {humanDurationStr}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div className="space-y-1">
                  <input
                    type="date"
                    value={webinarForm.date}
                    onChange={(e) => setWebinarForm({ ...webinarForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none min-h-[40px]"
                  />
                </div>

                <div className="space-y-1">
                  <input
                    type="time"
                    value={webinarForm.startTime}
                    onChange={(e) => setWebinarForm({ ...webinarForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none min-h-[40px]"
                  />
                </div>

                <div className="space-y-1">
                  <input
                    type="time"
                    value={webinarForm.endTime}
                    onChange={(e) => setWebinarForm({ ...webinarForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none min-h-[40px]"
                  />
                </div>
              </div>
            </div>

            {/* Category & Max Seats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1">
                <label className="font-black uppercase text-[10px] sm:text-xs text-slate-500 tracking-wider">Category</label>
                <select
                  value={webinarForm.category}
                  onChange={(e) => setWebinarForm({ ...webinarForm, category: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none min-h-[40px]"
                >
                  <option>Clinical Awareness</option>
                  <option>Screening Drive</option>
                  <option>Patient Q&amp;A</option>
                  <option>Surgical Symposium</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-black uppercase text-[10px] sm:text-xs text-slate-500 tracking-wider">Max Attendees</label>
                <input
                  type="number"
                  value={webinarForm.maxSeats}
                  onChange={(e) => setWebinarForm({ ...webinarForm, maxSeats: parseInt(e.target.value) || 100 })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none min-h-[40px]"
                />
              </div>
            </div>

            {/* Meeting Link */}
            <div className="space-y-1">
              <label className="font-black uppercase text-[10px] sm:text-xs text-slate-500 tracking-wider">Meeting Room / Link</label>
              <input
                type="text"
                placeholder="https://zoom.us/j/123456789"
                value={webinarForm.meetingLink}
                onChange={(e) => setWebinarForm({ ...webinarForm, meetingLink: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none font-mono min-h-[40px]"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="font-black uppercase text-[10px] sm:text-xs text-slate-500 tracking-wider">Webinar Overview</label>
              <textarea
                rows={3}
                placeholder="Describe key learning outcomes and agenda for attendees..."
                value={webinarForm.description}
                onChange={(e) => setWebinarForm({ ...webinarForm, description: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none resize-none"
              />
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-slate-100 shrink-0 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsWebinarModalOpen(false)}
              className="w-full sm:w-auto border-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 min-h-[42px]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveWebinar}
              disabled={submitting}
              className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white font-bold text-xs sm:text-sm rounded-xl px-6 py-2.5 min-h-[42px] shadow-xs"
            >
              {submitting ? "Saving..." : editingWebinar ? "Update Webinar" : "Create Webinar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------MODAL 3: VIEW ARTICLE DETAILS---------------- */}
      <Dialog open={!!viewingArticle} onOpenChange={() => setViewingArticle(null)}>
        <DialogContent className="max-w-2xl bg-white rounded-3xl p-6 border border-pink-100 shadow-2xl space-y-4">
          {viewingArticle && (
            <>
              <DialogHeader>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-pink-50 text-primary border border-pink-100 rounded-full w-fit">
                  {viewingArticle.category}
                </span>
                <DialogTitle className="font-heading text-xl font-black text-slate-800 mt-2">
                  {viewingArticle.title}
                </DialogTitle>
                <div className="text-xs text-slate-400 flex items-center gap-3 pt-1">
                  <span>Author: Dr. {data.doctor.name} (Verified)</span>
                  <span>•</span>
                  <span>Published: {viewingArticle.publishDate}</span>
                </div>
              </DialogHeader>

              <div className="prose prose-pink max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed max-h-[50vh] overflow-y-auto bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {viewingArticle.content}
              </div>

              <DialogFooter className="flex justify-between items-center pt-2">
                <Link href={`/learn/articles/${viewingArticle.slug}`} target="_blank">
                  <Button variant="outline" className="text-xs font-bold border-pink-200 text-slate-700 flex items-center gap-1 rounded-xl">
                    Open Public Page <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
                <Button onClick={() => setViewingArticle(null)} className="bg-slate-800 text-white font-bold text-xs rounded-xl px-4">
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ----------------MODAL 4: VIEW WEBINAR DETAILS---------------- */}
      <Dialog open={!!viewingWebinar} onOpenChange={() => setViewingWebinar(null)}>
        <DialogContent className="max-w-xl bg-white rounded-3xl p-6 border border-pink-100 shadow-2xl space-y-4">
          {viewingWebinar && (
            <>
              <DialogHeader>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-full w-fit">
                  {viewingWebinar.category}
                </span>
                <DialogTitle className="font-heading text-lg font-black text-slate-800 mt-2">
                  {viewingWebinar.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Date &amp; Time:</span>
                    <span>{viewingWebinar.date} ({viewingWebinar.startTime} - {viewingWebinar.endTime})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Access Type:</span>
                    <span className="font-bold text-slate-900">
                      {viewingWebinar.webinarType === "PAID" ? `PAID (₹${viewingWebinar.registrationPrice})` : "FREE"}
                    </span>
                  </div>
                  {viewingWebinar.webinarType === "PAID" && (
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Platform Policy Min:</span>
                      <span className="text-purple-700 font-bold">₹{viewingWebinar.minimumAllowedPrice}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Duration:</span>
                    <span>{formatDurationHumanReadable(viewingWebinar.durationMinutes)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Approval Status:</span>
                    <span className={`font-bold uppercase ${viewingWebinar.approvalStatus === "APPROVED" ? "text-emerald-600" : viewingWebinar.approvalStatus === "PENDING_APPROVAL" ? "text-amber-600" : "text-red-600"}`}>
                      {viewingWebinar.approvalStatus}
                    </span>
                  </div>

                  {viewingWebinar.approvalStatus === "REJECTED" && viewingWebinar.approvalRejectionReason && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl space-y-1 text-xs text-red-700">
                      <p className="font-bold uppercase text-[10px] text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" /> Rejection Reason from Platform Admin:
                      </p>
                      <p className="font-medium bg-white/70 p-2 rounded-lg border border-red-100">{viewingWebinar.approvalRejectionReason}</p>
                      <p className="text-[10.5px] text-slate-500 italic pt-0.5">Tip: Edit this webinar to fix the required details and resubmit for admin approval.</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Registered Users:</span>
                    <span className="font-bold text-primary">{viewingWebinar.registeredUsersCount} / {viewingWebinar.maxSeats}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Meeting Link:</span>
                    <a href={viewingWebinar.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primary font-mono text-[11px] hover:underline">
                      {viewingWebinar.meetingLink}
                    </a>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-slate-800 uppercase text-[10px] text-slate-400">Overview</p>
                  <p className="leading-relaxed bg-pink-50/20 p-3 rounded-xl border border-pink-50">{viewingWebinar.description || "No overview provided."}</p>
                </div>
              </div>

              <DialogFooter className="flex justify-end gap-2 pt-2">
                <Link href={`/webinars/${viewingWebinar.id}`} target="_blank">
                  <Button variant="outline" className="text-xs font-bold border-pink-200 text-slate-700 flex items-center gap-1 rounded-xl">
                    Public Page <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
                <Button onClick={() => setViewingWebinar(null)} className="bg-slate-800 text-white font-bold text-xs rounded-xl px-4">
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Doctor Public Card Preview Modal */}
      <DoctorProfileModal
        doctorIdOrId={data.doctor.doctorId}
        isOpen={isSelfProfileModalOpen}
        onClose={() => setIsSelfProfileModalOpen(false)}
      />

      {/* ----------------MODAL 5: RESUBMIT VERIFICATION DETAILS---------------- */}
      <Dialog open={isResubmitModalOpen} onOpenChange={setIsResubmitModalOpen}>
        <DialogContent className="max-w-lg bg-white rounded-3xl p-6 border border-pink-100 shadow-2xl space-y-4">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black text-slate-800 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Update &amp; Resubmit Verification Credentials
            </DialogTitle>
          </DialogHeader>

          {resubmitError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {resubmitError}
            </div>
          )}

          <form onSubmit={handleResubmitVerification} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Medical License / Registration Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. MCI-98765 / State Registration ID"
                value={resubmitForm.medicalLicenseNumber}
                onChange={(e) => setResubmitForm({ ...resubmitForm, medicalLicenseNumber: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-slate-800 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Hospital / Clinic Affiliation *</label>
              <input
                type="text"
                required
                placeholder="e.g. AIIMS Delhi / Apollo Specialty Hospital"
                value={resubmitForm.hospitalAffiliation}
                onChange={(e) => setResubmitForm({ ...resubmitForm, hospitalAffiliation: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-slate-800 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Medical Specialty *</label>
              <input
                type="text"
                required
                placeholder="e.g. Surgical Oncology / Radiation Oncologist"
                value={resubmitForm.specialty}
                onChange={(e) => setResubmitForm({ ...resubmitForm, specialty: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-slate-800 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Verification Document Link (Optional)</label>
              <input
                type="text"
                placeholder="Public PDF or Cloudinary certificate URL (Optional)"
                value={resubmitForm.verificationDocument}
                onChange={(e) => setResubmitForm({ ...resubmitForm, verificationDocument: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-slate-800 font-medium"
              />
              <p className="text-[10.5px] text-slate-500 italic">
                Upload your medical registration certificate or license document URL for faster verification. Accepted formats: PDF, JPG, PNG.
              </p>
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsResubmitModalOpen(false)} disabled={resubmitLoading} className="rounded-xl text-xs font-bold">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={resubmitLoading}
                className="bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl px-5 shadow-md cursor-pointer"
              >
                {resubmitLoading ? "Submitting..." : "Resubmit Credentials"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}

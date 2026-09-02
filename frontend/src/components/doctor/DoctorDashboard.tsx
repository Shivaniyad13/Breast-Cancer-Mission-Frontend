"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Stethoscope, BookOpen, Video, Plus, Calendar, Clock, 
  MapPin, Users, Edit3, Trash2, Eye, CheckCircle, ShieldCheck, 
  FileText, Activity, AlertCircle, Sparkles, Building2, Check, X, ExternalLink
} from "lucide-react";
import { createDoctorArticleAction, updateDoctorArticleAction, deleteDoctorArticleAction } from "@/app/actions/articles";
import { createDoctorWebinarAction, updateDoctorWebinarAction, deleteDoctorWebinarAction } from "@/app/actions/webinars";
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
    status: "PUBLISHED" as "PUBLISHED" | "DRAFT",
  });

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
  });

  // Doctor Profile View Modal State
  const [isSelfProfileModalOpen, setIsSelfProfileModalOpen] = useState(false);

  // Form submitting indicator
  const [submitting, setSubmitting] = useState(false);

  // ----------------ARTICLE HANDLERS----------------
  const openNewArticleModal = () => {
    setEditingArticle(null);
    setArticleForm({
      title: "",
      category: "Clinical Guidance",
      excerpt: "",
      content: "",
      status: "PUBLISHED",
    });
    setIsArticleModalOpen(true);
  };

  const openEditArticleModal = (article: any) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title,
      category: article.category,
      excerpt: article.excerpt || "",
      content: article.content,
      status: article.status === "DRAFT" ? "DRAFT" : "PUBLISHED",
    });
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = async (statusOverride?: "PUBLISHED" | "DRAFT") => {
    if (!articleForm.title || !articleForm.content) {
      alert("Please enter article title and full content.");
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
    });
    setIsWebinarModalOpen(true);
  };

  const handleSaveWebinar = async () => {
    if (!webinarForm.title || !webinarForm.date) {
      alert("Please specify webinar title and scheduled date.");
      return;
    }

    setSubmitting(true);
    try {
      const startDateTime = `${webinarForm.date}T${webinarForm.startTime || "10:00"}:00`;
      const endDateTime = `${webinarForm.date}T${webinarForm.endTime || "11:00"}:00`;

      const payload = {
        title: webinarForm.title,
        description: webinarForm.description,
        category: webinarForm.category,
        date: webinarForm.date,
        startTime: startDateTime,
        endTime: endDateTime,
        webinarMode: webinarForm.webinarMode,
        venue: webinarForm.venue,
        meetingLink: webinarForm.meetingLink,
        maxSeats: webinarForm.maxSeats,
        status: webinarForm.status,
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
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Verified Doctor
                </span>
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
              onClick={openNewWebinarModal}
              variant="outline"
              className="flex-1 sm:flex-initial bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold rounded-xl px-5 py-2.5 text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Video className="h-4 w-4 text-pink-300" /> Create Webinar
            </Button>
            <Button
              onClick={() => setIsSelfProfileModalOpen(true)}
              variant="ghost"
              className="text-pink-200 hover:text-white hover:bg-white/10 font-semibold rounded-xl text-xs px-3"
            >
              View Public Card
            </Button>
          </div>
        </div>
      </div>

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
                            art.status === "PUBLISHED" 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}>
                            {art.status}
                          </span>
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
                      <th className="p-4">Date &amp; Time</th>
                      <th className="p-4">Meeting Room / Link</th>
                      <th className="p-4 text-center">Attendees</th>
                      <th className="p-4 text-center">Status</th>
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
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            web.status === "PUBLISHED" 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                              : web.status === "COMPLETED"
                              ? "bg-blue-50 text-blue-600 border border-blue-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}>
                            {web.status}
                          </span>
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
        <DialogContent className="max-w-2xl bg-white rounded-3xl p-6 border border-pink-100 shadow-2xl space-y-4">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> {editingArticle ? "Edit Article" : "Write New Clinical Article"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-xs">
            {/* Title */}
            <div className="space-y-1">
              <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Article Title *</label>
              <input
                type="text"
                placeholder="e.g. Early Mammography Protocols for High-Risk Patients"
                value={articleForm.title}
                onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Category & Status */}
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
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Author (Auto-linked)</label>
                <input
                  type="text"
                  disabled
                  value={`Dr. ${data.doctor.name} (Verified Doctor)`}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-100 text-slate-400 font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-1">
              <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Short Summary / Excerpt</label>
              <input
                type="text"
                placeholder="Brief 1-2 sentence overview for the listing card."
                value={articleForm.excerpt}
                onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Content */}
            <div className="space-y-1">
              <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Full Content (Markdown Supported) *</label>
              <textarea
                rows={8}
                placeholder="Type detailed medical guidelines, research findings, or clinical advice here..."
                value={articleForm.content}
                onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none resize-none"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button 
              variant="outline" 
              onClick={() => handleSaveArticle("DRAFT")}
              disabled={submitting}
              className="border-slate-200 text-slate-700 font-bold text-xs rounded-xl px-4"
            >
              Save as Draft
            </Button>
            <Button 
              onClick={() => handleSaveArticle("PUBLISHED")}
              disabled={submitting}
              className="bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl px-5"
            >
              {submitting ? "Publishing..." : "Publish Article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------MODAL 2: CREATE / EDIT WEBINAR---------------- */}
      <Dialog open={isWebinarModalOpen} onOpenChange={setIsWebinarModalOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-3xl p-6 border border-pink-100 shadow-2xl space-y-4">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black text-slate-800 flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" /> {editingWebinar ? "Edit Webinar" : "Create New Live Webinar"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-xs">
            {/* Title */}
            <div className="space-y-1">
              <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Webinar Title *</label>
              <input
                type="text"
                placeholder="e.g. Modern Surgical Advances in Breast Reconstruction"
                value={webinarForm.title}
                onChange={(e) => setWebinarForm({ ...webinarForm, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Scheduled Date *</label>
                <input
                  type="date"
                  value={webinarForm.date}
                  onChange={(e) => setWebinarForm({ ...webinarForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Start Time</label>
                <input
                  type="time"
                  value={webinarForm.startTime}
                  onChange={(e) => setWebinarForm({ ...webinarForm, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">End Time</label>
                <input
                  type="time"
                  value={webinarForm.endTime}
                  onChange={(e) => setWebinarForm({ ...webinarForm, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Category & Max Seats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Category</label>
                <select
                  value={webinarForm.category}
                  onChange={(e) => setWebinarForm({ ...webinarForm, category: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:border-primary focus:outline-none"
                >
                  <option>Clinical Awareness</option>
                  <option>Screening Drive</option>
                  <option>Patient Q&amp;A</option>
                  <option>Surgical Symposium</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Max Attendees</label>
                <input
                  type="number"
                  value={webinarForm.maxSeats}
                  onChange={(e) => setWebinarForm({ ...webinarForm, maxSeats: parseInt(e.target.value) || 100 })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Meeting Link */}
            <div className="space-y-1">
              <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Meeting Room / Link</label>
              <input
                type="text"
                placeholder="https://zoom.us/j/123456789"
                value={webinarForm.meetingLink}
                onChange={(e) => setWebinarForm({ ...webinarForm, meetingLink: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:border-primary focus:outline-none font-mono"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">Webinar Overview</label>
              <textarea
                rows={4}
                placeholder="Describe key learning outcomes and agenda for attendees..."
                value={webinarForm.description}
                onChange={(e) => setWebinarForm({ ...webinarForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:border-primary focus:outline-none resize-none"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button 
              variant="outline" 
              onClick={() => setIsWebinarModalOpen(false)}
              className="border-slate-200 text-slate-700 font-bold text-xs rounded-xl px-4"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveWebinar}
              disabled={submitting}
              className="bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl px-5"
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

    </div>
  );
}

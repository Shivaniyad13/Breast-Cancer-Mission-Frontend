"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, PenTool, CheckCircle2, User, 
  Calendar, ShieldAlert, ChevronRight, Bookmark, ShieldCheck, Stethoscope 
} from "lucide-react";
import { createDoctorArticleAction } from "@/app/actions/articles";
import DoctorProfileModal from "@/components/doctor/DoctorProfileModal";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  content: string;
  readTime: string;
  publishDate: string;
  doctorId?: string | null;
  doctorName: string;
  doctorSpecialty: string;
  doctorVerificationStatus: string;
}

interface ArticlesClientProps {
  initialArticles: ArticleItem[];
  user: any;
}

export default function ArticlesClient({ initialArticles, user }: ArticlesClientProps) {
  const isDoctorOrAdmin = user?.role === "DOCTOR" || user?.role === "ADMIN";
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  // Form State for Publish Article
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Clinical Guidance");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handlePublish = async (status: "PUBLISHED" | "DRAFT") => {
    if (!title || !content) {
      alert("Please provide an article title and full content.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createDoctorArticleAction({
        title,
        category,
        excerpt,
        content,
        status,
      });

      if (res.error) {
        alert(res.error);
      } else {
        alert(status === "PUBLISHED" ? "Article published successfully!" : "Article saved as draft!");
        window.location.reload();
      }
    } catch (e: any) {
      alert(e.message || "Failed to publish article.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 relative">
      
      {/* Doctor Profile View Modal */}
      <DoctorProfileModal
        doctorIdOrId={selectedDoctorId}
        isOpen={!!selectedDoctorId}
        onClose={() => setSelectedDoctorId(null)}
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="h-4 w-4 text-primary" />
          Medical Publications
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-800">
          Awareness <span className="text-primary">Articles &amp; Blogs</span>
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto">
          Browse peer-reviewed articles authored by verified oncology doctors, or publish clinical guidelines to educate patients and caregivers.
        </p>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
            <TabsTrigger value="browse" className="px-6 py-2 rounded-xl text-xs font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xs">
              Browse Articles
            </TabsTrigger>
            <TabsTrigger value="publish" className="px-6 py-2 rounded-xl text-xs font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xs">
              Publish Article
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: BROWSE ARTICLES (REQUIREMENT 6) */}
        <TabsContent value="browse" className="space-y-6">
          {articles.length === 0 ? (
            <div className="text-center py-16 bg-white/60 rounded-3xl border border-pink-100 p-8 space-y-3">
              <BookOpen className="h-12 w-12 text-pink-300 mx-auto" />
              <h3 className="font-heading text-lg font-bold text-slate-700">No Articles Published Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Be the first doctor to publish clinical guidance and screening guidelines for patients.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((art) => (
                <Card key={art.id} className="group bg-white/80 backdrop-blur-md border border-pink-50 hover:border-pink-200 hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between">
                  <CardHeader className="p-6 pb-0 space-y-2">
                    <span className="bg-pink-50 border border-pink-100 text-primary text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider w-fit">
                      {art.category}
                    </span>
                    <h4 className="font-heading text-base font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2">
                      {art.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    
                    {/* REQUIREMENT 6: WRITTEN BY DR. {NAME} (VERIFIED DOCTOR) */}
                    <div className="border-t border-slate-100 pt-3 flex flex-col gap-1 text-[11px]">
                      <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                        Written by:
                      </div>
                      <button
                        onClick={() => art.doctorId && setSelectedDoctorId(art.doctorId)}
                        className="flex items-center gap-1.5 font-extrabold text-slate-800 hover:text-primary transition-colors text-left group/doc cursor-pointer"
                      >
                        <Stethoscope className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="group-hover/doc:underline">Dr. {art.doctorName}</span>
                      </button>
                      
                      <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] mt-0.5">
                        <ShieldCheck className="h-3 w-3" /> Verified Doctor
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3 shrink-0" /> {art.publishDate}</span>
                        <span className="flex items-center gap-1 font-semibold text-slate-500"><Bookmark className="h-3 w-3 shrink-0" /> {art.readTime}</span>
                      </div>
                    </div>

                    <Link href={`/learn/articles/${art.slug}`} className="block">
                      <Button variant="outline" className="w-full border-pink-200 text-slate-700 hover:bg-pink-50 rounded-xl text-xs py-2 h-auto flex items-center justify-center gap-1 transition-all font-bold">
                        Read Full Article <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: PUBLISH ARTICLE FORM (REQUIREMENT 3) */}
        <TabsContent value="publish">
          {!isDoctorOrAdmin ? (
            <Card className="bg-white/80 backdrop-blur-md border border-pink-100 shadow-xl rounded-3xl p-8 max-w-lg mx-auto text-center space-y-6">
              <div className="h-14 w-14 bg-pink-50 text-primary rounded-2xl flex items-center justify-center border border-pink-100 mx-auto">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h4 className="font-heading text-xl font-bold text-slate-800">Credential Verification Required</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  To maintain clinical accuracy, only registered <strong>Doctors</strong> or <strong>Administrators</strong> can write and publish awareness guidelines.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                {user ? (
                  <p className="text-xs text-slate-500">Your current role: <strong className="text-primary uppercase">{user.role}</strong>. Only Doctors can publish articles.</p>
                ) : (
                  <Link href={`/login?callbackUrl=${encodeURIComponent("/learn/articles")}`} className="w-full">
                    <Button className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-md py-2.5 h-auto text-sm">
                      Login as Doctor
                    </Button>
                  </Link>
                )}
                <Link href="/learn" className="text-xs text-muted-foreground hover:text-primary transition-colors hover:underline pt-2">
                  ← Back to Awareness Hub
                </Link>
              </div>
            </Card>
          ) : (
            <Card className="bg-white/80 backdrop-blur-md border border-pink-100 shadow-xl rounded-3xl max-w-2xl mx-auto overflow-hidden">
              <CardHeader className="p-6 border-b border-pink-50 bg-white/40">
                <CardTitle className="font-heading text-lg font-black text-slate-800 flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-primary" /> Publish Medical Guide
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Your article will automatically be linked to your Doctor profile and published on the platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* Article Title Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Article Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Early Screening Protocols for Hereditary Breast Cancer" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white/40 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                {/* Category & Auto-linked Author */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Category</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white/40 focus:border-primary focus:outline-none transition-colors"
                    >
                      <option>Clinical Guidance</option>
                      <option>Screening & Care</option>
                      <option>Prevention & Diet</option>
                      <option>Patient Support</option>
                      <option>Surgical Innovations</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Author (Auto-linked Session)</label>
                    <input 
                      type="text" 
                      disabled
                      value={`Dr. ${user?.name || user?.email || "Verified Doctor"}`} 
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-100 text-slate-500 cursor-not-allowed font-bold"
                    />
                  </div>
                </div>

                {/* Article Excerpt */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Brief Summary / Excerpt</label>
                  <input 
                    type="text" 
                    placeholder="A short 1-2 sentence description summarizing the article." 
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white/40 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                {/* Article Body */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Full Content (Markdown Supported) *</label>
                  <textarea 
                    rows={8}
                    placeholder="Type clinical guidelines, screening tips, or treatment options here..." 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white/40 focus:border-primary focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 flex gap-2.5 items-start text-xs text-slate-600">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  <p>Your Doctor ID will automatically be saved with this article. No manual author entry needed.</p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handlePublish("DRAFT")}
                    disabled={submitting}
                    className="border-pink-200 text-slate-700 hover:bg-pink-50 rounded-xl text-xs py-2 px-5 h-auto font-bold"
                  >
                    Save Draft
                  </Button>
                  <Button 
                    onClick={() => handlePublish("PUBLISHED")}
                    disabled={submitting}
                    className="bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-md text-xs py-2 px-6 h-auto flex items-center gap-1.5"
                  >
                    <PenTool className="h-4 w-4" /> {submitting ? "Publishing..." : "Publish Article"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

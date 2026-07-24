import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Ribbon, BookOpen, PenTool, CheckCircle2, User, 
  Calendar, ShieldAlert, ChevronRight, Bookmark 
} from "lucide-react";

export const revalidate = 0; // Dynamic rendering to check role-based credentials

interface Article {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

const MOCK_ARTICLES: Article[] = [
  {
    title: "Understanding Breast Cancer Staging: A Guide for Patients",
    slug: "understanding-breast-cancer-staging",
    excerpt: "Learn about TNM classification, staging from Stage 0 to Stage IV, and how oncology teams determine the most effective treatment pipelines.",
    category: "Clinical Guidance",
    author: "Dr. Ananya Sen, MD (Oncology)",
    date: "July 12, 2026",
    readTime: "6 min read"
  },
  {
    title: "Top 5 Lifestyle Habits to Lower Breast Cancer Risk",
    slug: "lifestyle-habits-lower-breast-cancer-risk",
    excerpt: "Discover evidence-based research regarding diet, weight maintenance, physical exercises, and alcohol intake reduction to optimize risk profiles.",
    category: "Prevention & Diet",
    author: "Dr. Rajesh Varma, MD (Preventative Health)",
    date: "July 10, 2026",
    readTime: "4 min read"
  },
  {
    title: "Why Early Detection Mammography Saves Lives",
    slug: "why-early-detection-mammography-saves-lives",
    excerpt: "Demystifying mammograms: understanding the radiation safety, recommended screening intervals, and what to expect during your first imaging session.",
    category: "Screening & Care",
    author: "Dr. Sarah D'Souza, Radiologist",
    date: "July 08, 2026",
    readTime: "5 min read"
  }
];

export default async function ArticlesPage() {
  const session = await auth();
  const user = session?.user;
  const isDoctorOrAdmin = user?.role === "DOCTOR" || user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-white to-rose-50/30 py-16 px-4 sm:px-6 lg:px-8">
      {/* Decorative background blur blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-10 relative">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="h-4 w-4 text-primary" />
            Medical Publications
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-800">
            Awareness <span className="text-primary">Articles & Blogs</span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto">
            Browse peer-reviewed articles written by registered medical practitioners and campaign contributors, or publish guidelines to raise campaign awareness.
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

          {/* TAB 1: BROWSE ARTICLES */}
          <TabsContent value="browse" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_ARTICLES.map((art, idx) => (
                <Card key={idx} className="group bg-white/80 backdrop-blur-md border border-pink-50 hover:border-pink-200 hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between">
                  <CardHeader className="p-6 pb-0">
                    <span className="bg-pink-50 border border-pink-100 text-primary text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider w-fit">
                      {art.category}
                    </span>
                    <h4 className="font-heading text-base font-bold text-slate-800 mt-3 group-hover:text-primary transition-colors line-clamp-2">
                      {art.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-3 mt-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="border-t border-slate-100 pt-3 flex flex-col gap-1 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1 font-bold text-slate-600">
                        <User className="h-3 w-3 text-primary shrink-0" /> {art.author}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3 shrink-0" /> {art.date}</span>
                        <span className="flex items-center gap-1 font-semibold text-slate-500"><Bookmark className="h-3 w-3 shrink-0" /> {art.readTime}</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full border-pink-200 text-slate-700 hover:bg-pink-50 rounded-xl text-xs py-1.5 h-auto flex items-center justify-center gap-1 transition-all">
                      Read Article <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB 2: PUBLISH ARTICLE FORM */}
          <TabsContent value="publish">
            {!isDoctorOrAdmin ? (
              <Card className="bg-white/80 backdrop-blur-md border border-pink-100 shadow-xl rounded-3xl p-8 max-w-lg mx-auto text-center space-y-6">
                <div className="h-14 w-14 bg-pink-50 text-primary rounded-2xl flex items-center justify-center border border-pink-100 mx-auto">
                  <ShieldAlert className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-heading text-xl font-bold text-slate-800">Credential Verification Required</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    To maintain clinical accuracy and prevent misinformation, only verified <strong>Doctors</strong> or <strong>Administrators</strong> can write and publish awareness guidelines.
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  {user ? (
                    <p className="text-xs text-slate-500">Your current role: <strong className="text-primary uppercase">{user.role}</strong>. Please contact support to update your medical credentials.</p>
                  ) : (
                    <Link href={`/login?callbackUrl=${encodeURIComponent("/learn/articles")}`} className="w-full">
                      <Button className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-md py-2.5 h-auto text-sm">
                        Login as Medical Professional
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
                    <PenTool className="h-5 w-5 text-primary" /> Publish a New Medical Guide
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Draft your oncology or breast cancer prevention guidelines. They will instantly appear on the platform directory.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Article Title Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Article Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Early Screening Protocols for Hereditary Cancer" 
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white/40 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Category</label>
                      <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white/40 focus:border-primary focus:outline-none transition-colors">
                        <option>Screening & Care</option>
                        <option>Clinical Guidance</option>
                        <option>Prevention & Diet</option>
                        <option>Patient Support</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Author Tag (Verified)</label>
                      <input 
                        type="text" 
                        disabled
                        value={user?.name || user?.email || "Verified Doctor"} 
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50 text-slate-400 cursor-not-allowed font-semibold"
                      />
                    </div>
                  </div>

                  {/* Article Excerpt */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Brief Summary / Excerpt</label>
                    <input 
                      type="text" 
                      placeholder="A short 1-2 sentence description summarizing the article." 
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white/40 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Article Body */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Full Content (Markdown Supported)</label>
                    <textarea 
                      rows={8}
                      placeholder="Type details guidelines here..." 
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white/40 focus:border-primary focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Simulated submission (can connect to database action in future phases) */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/50 flex gap-2.5 items-start text-xs text-slate-500">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <p>Upon clicking publish, the article will be cataloged under your medical practitioner profile for clinical peer review.</p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" className="border-pink-200 text-slate-700 hover:bg-pink-50 rounded-xl text-xs py-2 px-5 h-auto font-bold">
                      Save Draft
                    </Button>
                    <Button className="bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-md text-xs py-2 px-6 h-auto flex items-center gap-1.5">
                      <PenTool className="h-4 w-4" /> Publish Article
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

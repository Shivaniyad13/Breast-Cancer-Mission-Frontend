"use client";

import { useState } from "react";
import {
  Upload,
  Download,
  FileText,
  CheckCircle2,
  ArrowRight,
  Award,
  Users2,
  BookOpen,
  X,
  Sparkles,
  Search,
  HelpCircle,
  ChevronDown,
  Building2,
  ExternalLink,
  Loader2,
  Check,
  Globe,
} from "lucide-react";
import {
  submitArticle,
  submitResource,
  submitPartnerRequest,
} from "@/app/actions/healthcareProfessionals";

interface ClientProps {
  initialData?: {
    articles?: any[];
    resources?: any[];
    partners?: any[];
  };
}

export default function HealthcareProfessionalsClient({
  initialData = {},
}: ClientProps) {
  const articles = initialData.articles || [];
  const resources = initialData.resources || [];
  const partners = initialData.partners || [];

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedArticleModal, setSelectedArticleModal] = useState<any | null>(
    null
  );

  // Modal Open States
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Form Submitting States
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Article Form State
  const [articleForm, setArticleForm] = useState({
    title: "",
    authors: "",
    email: "",
    institution: "",
    category: "Oncology",
    summary: "",
    conclusions: "",
    documentUrl: "",
  });

  // Resource Form State
  const [resourceForm, setResourceForm] = useState({
    title: "",
    author: "",
    email: "",
    category: "Clinical Guidelines",
    desc: "",
    fileUrl: "",
    format: "PDF",
  });

  // Partner Form State
  const [partnerForm, setPartnerForm] = useState({
    applicantName: "",
    email: "",
    phone: "",
    institution: "",
    organizationType: "Academic",
    researchArea: "",
    proposal: "",
    website: "",
  });

  // Category Options
  const categories = [
    "All",
    "Oncology",
    "Early Detection",
    "Clinical Trials",
    "Guidelines",
    "Surgical",
  ];

  // Filtered Articles
  const filteredArticles = articles.filter((art: any) => {
    const matchesSearch =
      art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.authors?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.institution?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // File Upload Helper
  const handleFileUpload = async (
    file: File,
    target: "article" | "resource"
  ) => {
    setUploadingFile(true);
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        if (target === "article") {
          setArticleForm((prev) => ({ ...prev, documentUrl: data.url }));
        } else {
          setResourceForm((prev) => ({ ...prev, fileUrl: data.url }));
        }
      } else {
        setErrorMsg("Failed to upload file. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg("File upload error: " + err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  // Submit Article Handler
  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await submitArticle(articleForm);
    setSubmitting(false);

    if (res.success) {
      setSuccessMsg("Your article has been submitted for admin approval!");
      setTimeout(() => {
        setIsArticleModalOpen(false);
        setSuccessMsg("");
        setArticleForm({
          title: "",
          authors: "",
          email: "",
          institution: "",
          category: "Oncology",
          summary: "",
          conclusions: "",
          documentUrl: "",
        });
      }, 2000);
    } else {
      setErrorMsg(res.error || "Failed to submit article.");
    }
  };

  // Submit Resource Handler
  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await submitResource(resourceForm);
    setSubmitting(false);

    if (res.success) {
      setSuccessMsg(
        "Your clinical resource has been submitted for admin approval!"
      );
      setTimeout(() => {
        setIsResourceModalOpen(false);
        setSuccessMsg("");
        setResourceForm({
          title: "",
          author: "",
          email: "",
          category: "Clinical Guidelines",
          desc: "",
          fileUrl: "",
          format: "PDF",
        });
      }, 2000);
    } else {
      setErrorMsg(res.error || "Failed to submit resource.");
    }
  };

  // Submit Partner Request Handler
  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await submitPartnerRequest(partnerForm);
    setSubmitting(false);

    if (res.success) {
      setSuccessMsg(
        "Your partnership proposal has been submitted to the admin team!"
      );
      setTimeout(() => {
        setIsPartnerModalOpen(false);
        setSuccessMsg("");
        setPartnerForm({
          applicantName: "",
          email: "",
          phone: "",
          institution: "",
          organizationType: "Academic",
          researchArea: "",
          proposal: "",
          website: "",
        });
      }, 2000);
    } else {
      setErrorMsg(res.error || "Failed to submit partner request.");
    }
  };

  // Hardcoded FAQs
  const faqs = [
    {
      q: "Is publishing research on this platform free?",
      a: "Yes, publishing clinical articles, research summaries, and practice resources is completely free for verified medical professionals.",
    },
    {
      q: "How long does the admin approval process take?",
      a: "Submissions are reviewed by our moderation committee within 24 to 48 hours to ensure content quality and compliance.",
    },
    {
      q: "Will I receive credit and copyright for my work?",
      a: "Absolutely. Full authorship credit, institutional affiliation, and copyright ownership remain strictly with you and your co-authors.",
    },
    {
      q: "What file formats and sizes are supported?",
      a: "We support PDF documents up to 10MB in size for research papers, guidelines, and diagnostic resources.",
    },
    {
      q: "Who can view and download published materials?",
      a: "All approved publications are open-access, allowing doctors, oncologists, researchers, and students nationwide to learn and download.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 1: HERO */}
      {/* ---------------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-pink-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs sm:text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Doctor & Clinician Knowledge Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Share Your Research, <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-300">
              Reach Thousands of Doctors
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
            Publish your oncology research, clinical protocols, and diagnostic
            guides. Join India's leading open-access medical repository for
            breast cancer professionals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setIsArticleModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold shadow-lg shadow-pink-900/30 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <Upload className="w-5 h-5" />
              Submit Your Article
            </button>
            <button
              onClick={() => setIsResourceModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <FileText className="w-5 h-5 text-pink-300" />
              Share a Resource
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto border-t border-white/10 pt-8">
            <div className="flex items-center justify-center gap-2 text-slate-300 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>100% Free Publishing</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-300 text-sm font-medium">
              <Award className="w-5 h-5 text-pink-400 shrink-0" />
              <span>Author Recognition Badge</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-300 text-sm font-medium">
              <Globe className="w-5 h-5 text-sky-400 shrink-0" />
              <span>Open Access Visibility</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 2: WHY PUBLISH WITH US? */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Why Publish With Mission Breast Cancer?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Empower clinicians nationwide with your findings while growing your
            professional impact.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Personal Branding
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Establish thought leadership among oncology professionals and
              clinicians nationwide.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Google Visibility
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Submissions are structured for discoverability across search
              engines and clinical indexers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Author Certificate
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Receive verified digital author credentials for every approved
              study and clinical guide.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
              <Users2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Doctor Network
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Connect with an expansive network of surgical oncologists,
              radiologists, and path experts.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 3: PUBLISHED ARTICLES */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-100/60 rounded-3xl mb-16 border border-slate-200/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Peer-Reviewed & Submitted Studies</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Published Research & Studies
            </h2>
          </div>

          {/* Search bar */}
          {articles.length > 0 && (
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search title, author, institution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Category Tabs — only show if articles exist */}
        {articles.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art: any) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticleModal(art)}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-pink-50 text-pink-700 text-xs font-semibold border border-pink-200/60">
                      {art.category || "General"}
                    </span>
                    <span className="text-xs text-slate-400">
                      {art.publishDate || "2026"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-500 mb-3 italic">
                    {art.journal || "Submitted Article"}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {art.authors ? art.authors.charAt(0).toUpperCase() : "D"}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {art.authors}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {art.institution || "Healthcare Professional"}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-pink-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0">
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          // Premium Empty State — No articles in DB
          <div className="relative overflow-hidden text-center py-20 px-6 bg-gradient-to-br from-pink-50 via-white to-purple-50 rounded-3xl border-2 border-dashed border-pink-200">
            <div className="absolute top-0 right-0 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <BookOpen className="w-10 h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                Be the First to Publish
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Ye platform abhi apne pehle research contributors ka intezaar
                kar raha hai. Aap India ke un doctors me shamil ho jo breast
                cancer research ko aage badha rahe hain.
              </p>
              <button
                onClick={() => setIsArticleModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-sm font-semibold shadow-lg shadow-pink-200 inline-flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Submit Your Research
              </button>
            </div>
          </div>
        ) : (
          // No results in search/filter
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800 mb-1">
              No articles match your search
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Try a different keyword or category.
            </p>
          </div>
        )}
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 4: CLINICAL RESOURCES */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Practice Guidelines & Worksheets</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Clinical Resources & Toolkits
            </h2>
          </div>
          <button
            onClick={() => setIsResourceModalOpen(true)}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Upload className="w-4 h-4 text-pink-400" />
            Share a Resource
          </button>
        </div>

        {resources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res: any) => (
              <div
                key={res.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200/60">
                      {res.category || "Clinical Tool"}
                    </span>
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {res.format || "PDF"} • {res.size || "1 MB"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {res.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {res.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 truncate max-w-[150px]">
                    By {res.author || "Medical Contributor"}
                  </span>
                  {res.fileUrl && res.fileUrl !== "#" ? (
                    <a
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-400 text-xs font-semibold flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" /> N/A
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Premium Empty State — No resources
          <div className="relative overflow-hidden text-center py-16 px-6 bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl border-2 border-dashed border-purple-200">
            <div className="relative z-10 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                No Resources Shared Yet
              </h3>
              <p className="text-sm text-slate-600 mb-5">
                Clinical guidelines, protocols, aur patient toolkits share
                karke apne colleagues ki madad karein.
              </p>
              <button
                onClick={() => setIsResourceModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-md inline-flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Share First Resource
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 5: RESEARCH PARTNERS */}
      {/* ---------------------------------------------------------------------- */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider block mb-2">
                Institutional Collaboration
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Research & Hospital Partners
              </h2>
            </div>
            <button
              onClick={() => setIsPartnerModalOpen(true)}
              className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all shrink-0"
            >
              <Building2 className="w-4 h-4" />
              Become a Partner
            </button>
          </div>

          {partners.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((p: any) => (
                <div
                  key={p.id}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/40 backdrop-blur-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center mb-4">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-pink-400 font-medium mb-3">
                      {p.institution || p.researchArea}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed mb-4">
                      {p.description ||
                        "Leading institutional collaborator advancing clinical trials and oncology research."}
                    </p>
                  </div>
                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors pt-3 border-t border-white/10"
                    >
                      <span>Visit Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Empty state for partners
            <div className="text-center py-12 border-2 border-dashed border-white/20 rounded-3xl">
              <Building2 className="w-12 h-12 text-pink-400/50 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">
                No Partners Yet
              </h3>
              <p className="text-sm text-slate-400 mb-5 max-w-md mx-auto">
                Apne institution ko is national research network se jodein aur
                breast cancer care ko aage badhayein.
              </p>
              <button
                onClick={() => setIsPartnerModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                Become a Partner
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 6: FAQ */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Publishing Guidelines & FAQ
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-semibold text-slate-900 flex items-center justify-between gap-4 text-sm sm:text-base cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                    openFaq === idx ? "rotate-180 text-pink-600" : ""
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 7: FINAL CTA */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-16">
        <div className="rounded-3xl bg-gradient-to-r from-pink-600 to-rose-700 text-white p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
              Ready to Share Your Knowledge?
            </h2>
            <p className="text-pink-100 text-sm sm:text-base mb-8 leading-relaxed">
              Contribute your research paper or clinical guideline today and
              help elevate breast cancer care across India.
            </p>
            <button
              onClick={() => setIsArticleModalOpen(true)}
              className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg text-sm sm:text-base transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-5 h-5 text-pink-400" />
              Submit Your First Article
            </button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL 1: ARTICLE SUBMISSION */}
      {/* ---------------------------------------------------------------------- */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-slate-200">
            <button
              onClick={() => setIsArticleModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Submit Research Article
                </h3>
                <p className="text-xs text-slate-500">
                  Submitted articles require admin moderation prior to
                  publishing.
                </p>
              </div>
            </div>

            {successMsg ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-base font-bold text-emerald-900 mb-1">
                  Submission Received
                </h4>
                <p className="text-xs sm:text-sm text-emerald-700">
                  {successMsg}
                </p>
              </div>
            ) : (
              <form onSubmit={handleArticleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adjuvant Chemotherapy Response in Triple Negative Cancer"
                    value={articleForm.title}
                    onChange={(e) =>
                      setArticleForm({ ...articleForm, title: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Author Name(s) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Ramesh Gupta"
                      value={articleForm.authors}
                      onChange={(e) =>
                        setArticleForm({
                          ...articleForm,
                          authors: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Author Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="doctor@hospital.org"
                      value={articleForm.email}
                      onChange={(e) =>
                        setArticleForm({ ...articleForm, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Institution / Hospital
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tata Memorial Hospital"
                      value={articleForm.institution}
                      onChange={(e) =>
                        setArticleForm({
                          ...articleForm,
                          institution: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={articleForm.category}
                      onChange={(e) =>
                        setArticleForm({
                          ...articleForm,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none bg-white"
                    >
                      <option value="Oncology">Oncology</option>
                      <option value="Early Detection">Early Detection</option>
                      <option value="Clinical Trials">Clinical Trials</option>
                      <option value="Guidelines">Guidelines</option>
                      <option value="Surgical">Surgical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Abstract / Summary *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide a concise summary of your research methods, findings, and clinical relevance..."
                    value={articleForm.summary}
                    onChange={(e) =>
                      setArticleForm({ ...articleForm, summary: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PDF Document Upload
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0], "article");
                      }
                    }}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                  />
                  {uploadingFile && (
                    <p className="text-xs text-pink-600 mt-1">
                      Uploading document...
                    </p>
                  )}
                  {articleForm.documentUrl && (
                    <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> File attached
                      successfully
                    </p>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsArticleModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploadingFile}
                    className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs sm:text-sm font-semibold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      "Submit Article"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL 2: RESOURCE SUBMISSION */}
      {/* ---------------------------------------------------------------------- */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-slate-200">
            <button
              onClick={() => setIsResourceModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Share Clinical Resource
                </h3>
                <p className="text-xs text-slate-500">
                  Share guidelines, checklists, toolkits, or protocols.
                </p>
              </div>
            </div>

            {successMsg ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-base font-bold text-emerald-900 mb-1">
                  Resource Submitted
                </h4>
                <p className="text-xs sm:text-sm text-emerald-700">
                  {successMsg}
                </p>
              </div>
            ) : (
              <form onSubmit={handleResourceSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chemotherapy Safety Checklist 2026"
                    value={resourceForm.title}
                    onChange={(e) =>
                      setResourceForm({ ...resourceForm, title: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Author / Contributor Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Sunita Rao"
                      value={resourceForm.author}
                      onChange={(e) =>
                        setResourceForm({
                          ...resourceForm,
                          author: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="doctor@hospital.org"
                      value={resourceForm.email}
                      onChange={(e) =>
                        setResourceForm({
                          ...resourceForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={resourceForm.category}
                    onChange={(e) =>
                      setResourceForm({
                        ...resourceForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                  >
                    <option value="Clinical Guidelines">
                      Clinical Guidelines
                    </option>
                    <option value="Diagnostic Tool">Diagnostic Tool</option>
                    <option value="Protocol">Protocol</option>
                    <option value="Patient Handout">Patient Handout</option>
                    <option value="CME Material">CME Material</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe how clinicians should use this resource..."
                    value={resourceForm.desc}
                    onChange={(e) =>
                      setResourceForm({ ...resourceForm, desc: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Upload Resource File *
                  </label>
                  <input
                    type="file"
                    required={!resourceForm.fileUrl}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0], "resource");
                      }
                    }}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {uploadingFile && (
                    <p className="text-xs text-purple-600 mt-1">
                      Uploading file...
                    </p>
                  )}
                  {resourceForm.fileUrl && (
                    <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> File attached ready for
                      submission
                    </p>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsResourceModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploadingFile}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      "Submit Resource"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL 3: PARTNER REQUEST */}
      {/* ---------------------------------------------------------------------- */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-slate-200">
            <button
              onClick={() => setIsPartnerModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Become a Research Partner
                </h3>
                <p className="text-xs text-slate-500">
                  Collaborate with our national breast cancer research network.
                </p>
              </div>
            </div>

            {successMsg ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-base font-bold text-emerald-900 mb-1">
                  Proposal Submitted
                </h4>
                <p className="text-xs sm:text-sm text-emerald-700">
                  {successMsg}
                </p>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Applicant Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Vivek Sharma"
                      value={partnerForm.applicantName}
                      onChange={(e) =>
                        setPartnerForm({
                          ...partnerForm,
                          applicantName: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="partner@institution.org"
                      value={partnerForm.email}
                      onChange={(e) =>
                        setPartnerForm({
                          ...partnerForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Institution Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cancer Research Institute"
                      value={partnerForm.institution}
                      onChange={(e) =>
                        setPartnerForm({
                          ...partnerForm,
                          institution: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Research Area *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Genomic Screening & Trials"
                      value={partnerForm.researchArea}
                      onChange={(e) =>
                        setPartnerForm({
                          ...partnerForm,
                          researchArea: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://institution.org"
                    value={partnerForm.website}
                    onChange={(e) =>
                      setPartnerForm({
                        ...partnerForm,
                        website: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Collaboration Proposal *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Outline your research goals, joint trial interest, or institutional collaboration scope..."
                    value={partnerForm.proposal}
                    onChange={(e) =>
                      setPartnerForm({
                        ...partnerForm,
                        proposal: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsPartnerModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs sm:text-sm font-semibold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      "Submit Proposal"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* ARTICLE DETAIL MODAL */}
      {/* ---------------------------------------------------------------------- */}
      {selectedArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-slate-200">
            <button
              onClick={() => setSelectedArticleModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="px-2.5 py-1 rounded-md bg-pink-100 text-pink-700 text-xs font-semibold border border-pink-200 inline-block mb-3">
              {selectedArticleModal.category || "General"}
            </span>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-snug">
              {selectedArticleModal.title}
            </h3>

            <p className="text-xs text-slate-500 mb-4">
              Published: {selectedArticleModal.publishDate || "2026"} •{" "}
              {selectedArticleModal.journal || "Submitted Study"}
            </p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {selectedArticleModal.authors
                  ? selectedArticleModal.authors.charAt(0)
                  : "D"}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {selectedArticleModal.authors}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedArticleModal.institution || "Healthcare Professional"}
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Abstract
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedArticleModal.summary}
                </p>
              </div>

              {selectedArticleModal.conclusions && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Conclusions
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-pink-50/50 p-3 rounded-lg border border-pink-100">
                    {selectedArticleModal.conclusions}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              {selectedArticleModal.documentUrl &&
              selectedArticleModal.documentUrl !== "#" ? (
                <a
                  href={selectedArticleModal.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download PDF Paper
                </a>
              ) : (
                <span className="text-xs text-slate-400 italic">
                  No PDF attached
                </span>
              )}

              <button
                onClick={() => setSelectedArticleModal(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
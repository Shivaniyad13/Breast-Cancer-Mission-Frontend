"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Search,
  Globe,
  MapPin,
  Activity,
  Check,
  X,
  ChevronDown,
  Heart,
  Shield,
  Award,
  Users2,
  GraduationCap,
  Microscope,
  Zap,
  Pill,
  Image as ImageIcon,
  Video,
  ArrowRight,
  Upload,
  Play,
  Ribbon,
  Clock,
  Handshake,
  Share2,
  Stethoscope,
  Sparkles,
  Brain,
  AlertCircle,
  Dna,
  Compass,
  User,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getActiveGalleryItems } from "@/app/actions/gallery";
import { getActiveVideoStories } from "@/app/actions/videoStories";
import { getPartnerDirectory } from "@/app/actions/partnersDirectory";
import { getImpactStats } from "@/app/actions/impactStats";
import { getPublicSuccessStories } from "@/app/actions/successStories";
import { submitPartnershipRequest } from "@/app/actions/partnerships";

// ----------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------
interface PartnerOrg {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  desc: string;
  city: string;
  website: string;
  coverImage: string;
  logoIcon: React.ComponentType<any>;
}

interface SuccessStory {
  id: string;
  orgName: string;
  orgPhoto: string;
  eventImage: string;
  beforeAfter: string;
  screenedCount: string;
  patientsHelped: string;
  eventsCount: string;
  quote: string;
  directorName: string;
}

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
  eventDate?: Date | string | null;
}

interface VideoStory {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  description?: string | null;
}

interface FAQItem {
  question: string;
  answer: string;
}

// ----------------------------------------------------------------------
// Constants & Static Data
// ----------------------------------------------------------------------

const faqsData: FAQItem[] = [
  {
    question: "How can my organization become a partner?",
    answer:
      "You can submit an application form in the 'Partnership Application' section. Provide your organization's type, license, website, and area of interest (e.g. mobile camps, CSR funding). Our administrative panel will contact you to schedule an initial review.",
  },
  {
    question: "Who can apply to join the partner network?",
    answer:
      "We accept partnership requests from cancer specialty hospitals, diagnostic screening laboratories, women empowerment NGOs, survivor groups, academic research universities, corporate CSR divisions, and government public health programs.",
  },
  {
    question: "Is there any fee required to join?",
    answer:
      "No, GRS Cancer Mukt Bharat Abhiyan charges no registration or membership fees to join the Partner Network. Our alliances are built on shared clinical resources, community screening drives, and voluntary collaborations.",
  },
  {
    question: "Can international organizations collaborate?",
    answer:
      "Yes. GRS actively collaborates with international oncology groups, universities, and pharmaceutical companies for research, clinical trial enrollment, and educational webinars.",
  },
  {
    question: "Can universities join research projects?",
    answer:
      "Yes. Academic medical colleges and biotechnology labs can integrate GRS tumor board staging data to execute clinical trials, tissue studies, and survivorship research.",
  },
  {
    question: "How long does the approval process take?",
    answer:
      "The onboarding cycle takes approximately 2-3 weeks. This includes initial credential checks, tumor board alignment reviews, and drafting standard operational plans for regional screening camp logistics.",
  },
];

// Collaboration areas shown as checkboxes in the Partnership Application form
const COLLABORATION_AREA_OPTIONS = [
  "Awareness Campaigns",
  "Mobile Screening Camps",
  "Academic Research Collaboration",
  "Genetic BRCA Screening",
  "Rural Outpatient Care Support",
  "Patient Navigation Program",
  "Financial Mastectomy Assistance",
  "Rehabilitation & Lymphedema",
  "Corporate CSR Funding",
] as const;

function formatMetric(num: number): string {
  if (num === undefined || num === null || num === 0) return "0";
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k+`;
  return `${num}+`;
}

export default function PartnerOrganizationsPage() {
  // ----------------------------------------------------------------------
  // State variables
  // ----------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Success story slider index
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  // DB Fetched Data & Loading States
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [videoStories, setVideoStories] = useState<VideoStory[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);

  const [directory, setDirectory] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalPartners: 0,
    doctors: 0,
    hospitals: 0,
    campaigns: 0,
    stories: 0,
    webinars: 0,
    ngo: 0,
  });

  useEffect(() => {
    getActiveGalleryItems().then((res) => {
      if (res.success && res.items) setGalleryItems(res.items as any);
      setGalleryLoading(false);
    });
    getActiveVideoStories().then((res) => {
      if (res.success && res.stories) setVideoStories(res.stories as any);
      setVideoLoading(false);
    });
    getPartnerDirectory().then((res) => {
      if (res.success) setDirectory(res.all || []);
    });
    getImpactStats().then((res) => {
      if (res.success && res.stats) setStats(res.stats);
    });
    getPublicSuccessStories().then((res) => {
      if (res.success) setStories(res.stories || []);
    });
  }, []);

  // Modals state
  const [detailsModal, setDetailsModal] = useState<PartnerOrg | null>(null);
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);
  const [activePlayVideo, setActivePlayVideo] = useState<VideoStory | null>(null);
  const [partnerFormOpen, setPartnerFormOpen] = useState(false);

  // Application Form State
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("Hospital");
  const [orgWeb, setOrgWeb] = useState("");
  const [orgContact, setOrgContact] = useState("");
  const [orgDesignation, setOrgDesignation] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [orgCity, setOrgCity] = useState("");
  const [orgState, setOrgState] = useState("");
  const [orgCollabAreas, setOrgCollabAreas] = useState<string[]>([]);
  const [orgMessage, setOrgMessage] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // ----------------------------------------------------------------------
  // Autoplay interval for success stories
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (stories.length === 0) return;
    const storyInterval = setInterval(() => {
      setActiveStoryIdx((prev) => (prev + 1) % stories.length);
    }, 9000);
    return () => clearInterval(storyInterval);
  }, [stories.length]);

  // Filter partners
  const filteredPartners = directory.filter((partner) => {
    const matchesSearch =
      (partner.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (partner.subcategory || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (partner.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (partner.desc || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || partner.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "all", label: "All Partners" },
    { value: "hospital", label: "Hospitals & Diagnostics" },
    { value: "ngo", label: "NGOs & Support Groups" },
    { value: "research", label: "Research & Medical Colleges" },
    { value: "corporate", label: "Corporate CSR Partners" },
    { value: "government", label: "Government Agencies" },
  ];

  const handleCollabToggle = (area: string) => {
    if (orgCollabAreas.includes(area)) {
      setOrgCollabAreas((prev) => prev.filter((a) => a !== area));
    } else {
      setOrgCollabAreas((prev) => [...prev, area]);
    }
  };

  const [uploadedDocUrl, setUploadedDocUrl] = useState("");
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await apiClient("/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) setUploadedDocUrl(data.url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !orgContact || !orgEmail || !orgPhone) {
      alert(
        "Please fill organization name, contact representative, email, and phone."
      );
      return;
    }
    setFormLoading(true);
    try {
      const res = await submitPartnershipRequest({
        organizationName: orgName,
        organizationType: orgType,
        contactPersonName: orgContact,
        designation: orgDesignation,
        email: orgEmail,
        phone: orgPhone,
        website: orgWeb,
        city: orgCity,
        state: orgState,
        country: "India",
        category: orgCollabAreas.join(", ") || "General",
        description: orgMessage,
        reason: orgCollabAreas.join(", "),
        termsAccepted: true,
        logoUrl: "",
        documentUrl: uploadedDocUrl,
      });
      if (res.success) {
        setFormSuccess(true);
      } else {
        alert(res.error || "Submission failed. Please try again.");
      }
    } catch (err: any) {
      alert(err.message || "Unexpected error occurred.");
    } finally {
      setFormLoading(false);
    }
  };

  const resetAppForm = () => {
    setPartnerFormOpen(false);
    setOrgName("");
    setOrgType("Hospital");
    setOrgWeb("");
    setOrgContact("");
    setOrgDesignation("");
    setOrgEmail("");
    setOrgPhone("");
    setOrgCity("");
    setOrgState("");
    setOrgCollabAreas([]);
    setOrgMessage("");
    setFormSuccess(false);
    setUploadedDocUrl("");
    setUploadingDoc(false);
  };

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex-1 w-full bg-slate-50 text-slate-805 selection:bg-pink-105 selection:text-pink-700 overflow-x-hidden">

      {/* ----------------------------------------------------------------------
          1. HERO SECTION (Looping Background Video)
          ---------------------------------------------------------------------- */}
   <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-white">
  {/* White Hero Background */}
  <div className="absolute inset-0 z-0 bg-white" />

  <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10 py-24 text-center">
    <div className="flex items-center justify-center">
      {/* Centered Hero Content */}
      <div className="w-full max-w-4xl mx-auto space-y-6 flex flex-col items-center">

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-xs font-bold uppercase tracking-wider"
        >
          <Handshake className="h-4 w-4 text-pink-500" />
          Collaborative Impact Network
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight"
        >
          Together We Create <br />

          <span className="text-pink-600 font-heading">
            Greater Impact.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-600 text-base sm:text-lg leading-relaxed font-sans max-w-2xl mx-auto"
        >
          Strong partnerships between healthcare providers, NGOs,
          research institutions, corporate organizations, and communities
          help improve breast cancer awareness, research, treatment, and
          patient care.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-2"
        >
          <Button
            onClick={() => setPartnerFormOpen(true)}
            className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-pink-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
          >
            Become a Partner
            <ArrowRight className="h-5 w-5 ml-1.5" />
          </Button>

          <Button
            variant="outline"
            onClick={() => scrollToId("partner-network-directory")}
            className="border-pink-500 text-pink-600 hover:bg-pink-50 hover:text-pink-700 font-bold px-8 py-6 rounded-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
          >
            Explore Our Network
          </Button>
        </motion.div>

      </div>
    </div>
  </div>
</section>

      {/* ----------------------------------------------------------------------
          2. WHY PARTNERSHIPS MATTER
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-10 right-0 w-80 h-80 bg-pink-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider border border-pink-100">
              <Shield className="h-4 w-4" />
              Strategic Alliances
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Why Collaborative Partnership Matters
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Achieving early breast screening and clinical staging diagnostics requires the synchrony of hospitals, survivor NGOs, universities, and corporate CSR funding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Early Screening Diagnostics",
                desc: "Hospitals and diagnostic centers join forces to subsidize screening packages and 3D tomosynthesis reviews.",
                icon: Activity,
                color: "bg-blue-50 border-blue-200 text-blue-600",
              },
              {
                title: "Academic Genetics Research",
                desc: "Universities and biotech labs analyze GRS patient databases to map regional BRCA1/2 penetrance indexes.",
                icon: Microscope,
                color: "bg-purple-50 border-purple-200 text-purple-600",
              },
              {
                title: "Grassroots Awareness Outreach",
                desc: "Local women empowerment NGOs manage community walks, school seminars, and screening camp coordinates.",
                icon: Users2,
                color: "bg-pink-50 border-pink-200 text-pink-600",
              },
              {
                title: "CSR Funding & Therapeutics",
                desc: "Corporate pharmaceuticals sponsor chemotherapy drug reserves, ensuring patient treatment never drop out.",
                icon: Award,
                color: "bg-emerald-50 border-emerald-200 text-emerald-600",
              },
              {
                title: "Affordable Treatment",
                desc: "Subsidy alliances directly clear surgical oncology and radiotherapy bills at partner hospitals.",
                icon: Pill,
                color: "bg-cyan-50 border-cyan-200 text-cyan-600",
              },
              {
                title: "Rehabilitation Care",
                desc: "Specialty physical therapists guide post-operative mobilization and lymphedema compression clinics.",
                icon: Sparkles,
                color: "bg-rose-50 border-rose-200 text-rose-600",
              },
              {
                title: "Mental Health Support",
                desc: "Clinical psychologists host weekly therapy circles, helping survivors cope with chemotherapy trauma.",
                icon: Brain,
                color: "bg-teal-50 border-teal-200 text-teal-600",
              },
              {
                title: "Rural Outreach Camps",
                desc: "Public health agencies support mobile vans delivering diagnostics to remote, low-income areas.",
                icon: MapPin,
                color: "bg-sky-50 border-sky-200 text-sky-600",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/50 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${item.color} border shadow-2xs`}>
                    {React.createElement(item.icon, { className: "h-5.5 w-5.5" })}
                  </div>
                  <h4 className="font-heading text-sm font-extrabold text-slate-800 mt-6 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-slate-500 text-xs mt-2.5 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          3. OUR PARTNER NETWORK (DIRECTORY)
          ---------------------------------------------------------------------- */}
      <section id="partner-network-directory" className="py-24 bg-gradient-to-b from-slate-50 to-pink-50/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
              <Search className="h-4 w-4" />
              Member Directory
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Explore Our Collaborative Network
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Find verified medical facilities, oncology researchers, advocacy organizations, and technology partners working with GRS. Search by keyword or city.
            </p>
          </div>

          {/* Search Panel */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-md mb-12 space-y-6">
            <div className="relative">
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search partner organization by name, category, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-slate-50 border-slate-200 h-12 rounded-xl focus-visible:ring-pink-500 text-sm font-sans"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-250/20">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer select-none ${selectedCategory === cat.value
                    ? "bg-pink-600 border-pink-600 text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:border-slate-350 text-slate-650"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Partner Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {directory.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-pink-200 p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm col-span-full">
                  <div className="h-16 w-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto text-pink-500">
                    <Building2 className="h-12 w-12 text-pink-300" />
                  </div>
                  <h3 className="font-heading text-xl font-extrabold text-slate-800">
                    Partner Directory Coming Soon
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-sans max-w-md mx-auto">
                    Our partner network is growing. Verified hospitals, NGOs, research institutes, and CSR partners will appear here.
                  </p>
                </div>
              ) : filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => (
                  <motion.div
                    key={partner.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white hover:bg-slate-50 rounded-3xl p-5 border border-slate-200/40 shadow-xs hover:shadow-lg hover:border-pink-300 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Logo and Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-100 text-pink-600 shrink-0">
                          {partner.logoIcon ? (
                            React.createElement(partner.logoIcon, { className: "h-5.5 w-5.5" })
                          ) : (
                            <Building2 className="h-5.5 w-5.5" />
                          )}
                        </div>
                        <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wider font-heading">
                          {partner.subcategory || partner.category}
                        </span>
                      </div>

                      {/* Cover Photo */}
                      <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-200/50">
                        {partner.coverImage ? (
                          <img
                            src={partner.coverImage}
                            alt={partner.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400">
                            <Building2 className="h-12 w-12 text-slate-300" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>

                      {/* Header */}
                      <h4 className="font-heading text-base font-extrabold text-slate-800 leading-snug pr-2 group-hover:text-pink-600 transition-colors">
                        {partner.name}
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed font-sans mt-3 line-clamp-3">
                        {partner.desc}
                      </p>
                    </div>

                    {/* Bottom details / CTA */}
                    <div className="mt-6 pt-4 border-t border-slate-200/50 space-y-3">
                      <div className="flex justify-between items-center text-xs text-slate-400 font-sans">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {partner.city || "India"}
                        </span>
                        {partner.website ? (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            Website
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-300 font-semibold">
                            Verified Network
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setDetailsModal(partner)}
                        className="w-full rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs h-10 cursor-pointer"
                      >
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center space-y-4">
                  <AlertCircle className="h-12 w-12 text-slate-350 mx-auto" />
                  <h3 className="font-heading text-lg font-bold text-slate-700">
                    No Partners Found
                  </h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto font-sans">
                    We couldn&apos;t find any organizations matching &ldquo;{searchQuery}&rdquo;. Try widening your filters.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-5 py-2 rounded-xl cursor-pointer"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 
----------------------------------------------------------------------
          5. IMPACT DASHBOARD
          ---------------------------------------------------------------------- */}
      

      {/* ----------------------------------------------------------------------
          7. GALLERY (Masonry Grid with Lightbox)
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider border border-pink-100">
              <ImageIcon className="h-4 w-4" />
              Event Gallery
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Breast Cancer Alliance Event Gallery
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Browse realistic imagery documenting awareness walks, medical workshops, diagnostics camps, and lab research. Click to expand.
            </p>
          </div>

          {/* Gallery Content */}
          {galleryLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-slate-100 bg-slate-100 aspect-4/3 animate-pulse"
                />
              ))}
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-pink-200 p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
              <div className="h-16 w-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto text-pink-500">
                <ImageIcon className="h-12 w-12 text-pink-300" />
              </div>
              <h3 className="font-heading text-xl font-extrabold text-slate-800">
                Event Gallery Coming Soon
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-sans max-w-md mx-auto">
                We&apos;re capturing moments from upcoming awareness drives, screening camps, and research events. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxImage(item)}
                  className="relative rounded-3xl overflow-hidden border border-slate-200/50 bg-slate-100 aspect-4/3 shadow-2xs hover:shadow-md cursor-pointer group transition-shadow"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.caption}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                    <span className="px-2 py-0.5 rounded bg-pink-600 text-[8px] font-bold uppercase tracking-wider self-start mb-2 font-heading">
                      {item.category}
                    </span>
                    <p className="text-xs font-bold font-sans line-clamp-2">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          8. VIDEO STORIES
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-gradient-to-tr from-pink-50/40 via-purple-50/15 to-blue-50/30 border-y border-slate-200/55">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
              <Video className="h-4 w-4" />
              Oncology Broadcasts
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Partner Video Stories
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-sans">
              Play documentary snippets, oncologist interviews, and NGO campaign highlights.
            </p>
          </div>

          {/* Video Stories Content */}
          {videoLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 p-4 animate-pulse space-y-3"
                >
                  <div className="h-44 bg-slate-200 rounded-2xl w-full" />
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : videoStories.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-pink-200 p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
              <div className="h-16 w-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto text-pink-500">
                <Video className="h-12 w-12 text-pink-300" />
              </div>
              <h3 className="font-heading text-xl font-extrabold text-slate-800">
                Video Stories Coming Soon
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-sans max-w-md mx-auto">
                We&apos;re documenting awareness drives, survivor journeys, and partner interviews. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videoStories.map((vid) => (
                <div
                  key={vid.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                  {/* Thumbnail with overlay play */}
                  <div className="relative h-44 bg-slate-950">
                    {vid.thumbnailUrl ? (
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center text-slate-400 gap-2">
                        <Video className="h-10 w-10 text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Video Broadcast
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button
                        onClick={() => setActivePlayVideo(vid)}
                        className="p-3.5 rounded-full bg-white/90 text-pink-600 hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center"
                      >
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 font-sans space-y-1">
                    <span className="text-[9px] font-bold text-pink-650 uppercase tracking-wider font-heading">
                      {vid.category}
                    </span>
                    <h4 className="font-heading text-xs sm:text-sm font-extrabold text-slate-800 line-clamp-2 leading-snug group-hover:text-pink-600 transition-colors">
                      {vid.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          9. HOW TO BECOME A PARTNER (Timeline)
          ---------------------------------------------------------------------- */}


      {/* ----------------------------------------------------------------------
          10. PARTNERSHIP BENEFITS
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider border border-pink-100">
              <Award className="h-4 w-4" />
              Member Benefits
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Partnership Benefits Overview
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              We provide strategic branding visibility, shared oncological databases, and corporate CSR audits for our members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { title: "Brand Visibility", icon: Globe, desc: "Logo listing in our portal directory and press recognition." },
              { title: "Community Impact", icon: Heart, desc: "Contribute to diagnostics screening camps in low-income districts." },
              { title: "CSR Recognition", icon: Award, desc: "Detailed CSR impact audits and verified IT exemption certifications." },
              { title: "Medical Alliance", icon: Stethoscope, desc: "Coordinate oncology referrals with certified tumor boards." },
              { title: "Joint Staging Research", icon: Microscope, desc: "Publish collaborative BRCA mutational registries abstracts." },
              { title: "Awareness Programs", icon: Ribbon, desc: "Direct joint campaigns, webinars, and regional walks." },
              { title: "Volunteer Projects", icon: Users2, desc: "Offer your clinical staff direct mobile camp volunteering routes." },
              { title: "Expert Networking", icon: Share2, desc: "Connect with global researchers and hospital directors." },
              { title: "Digital Innovation", icon: Zap, desc: "Utilize health technology interfaces and AI diagnostic triage." },
              { title: "Shared Resources", icon: Handshake, desc: "Access screening devices, checklists, and templates." },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-205/50 rounded-3xl p-5 hover:bg-white hover:shadow-md hover:border-pink-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="h-9 w-9 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 shrink-0 mb-5">
                  {React.createElement(benefit.icon, { className: "h-4.5 w-4.5" })}
                </div>
                <div>
                  <h4 className="font-heading text-xs sm:text-sm font-extrabold text-slate-800 leading-tight">
                    {benefit.title}
                  </h4>
                  <p className="text-slate-500 text-[11px] mt-2 leading-relaxed font-sans">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          12. PARTNERSHIP APPLICATION
          ---------------------------------------------------------------------- */}
      <section id="partnership-application-section" className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider border border-pink-100">
              <Building2 className="h-4 w-4" />
              Onboarding Form
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Partnership Request Application
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Submit your institutional credentials and selected areas of interest to connect with GRS Cancer Mukt Bharat Abhiyan.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-205/50 shadow-md">
            {!formSuccess ? (
              <form onSubmit={handleAppSubmit} className="space-y-6 font-sans">
                {/* Organization details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                      Organization Name
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Apex Diagnostics Lab"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="bg-white border-slate-200 h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                      Organization Type
                    </label>
                    <select
                      value={orgType}
                      onChange={(e) => setOrgType(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-pink-500 text-xs font-semibold text-slate-700 cursor-pointer appearance-none"
                    >
                      <option value="Hospital">Hospital / Oncology Center</option>
                      <option value="NGO">Non-Profit NGO / Support Group</option>
                      <option value="Research">University / Biotechnology Lab</option>
                      <option value="Corporate">Corporate CSR Sponsor</option>
                      <option value="Government">Government Public Health Department</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                      Official Website URL
                    </label>
                    <Input
                      type="url"
                      placeholder="e.g. https://apex-labs.org"
                      value={orgWeb}
                      onChange={(e) => setOrgWeb(e.target.value)}
                      className="bg-white border-slate-200 h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                      Contact Representative
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="Enter representative name"
                      value={orgContact}
                      onChange={(e) => setOrgContact(e.target.value)}
                      className="bg-white border-slate-200 h-10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                      Representative Title
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. CSR Director"
                      value={orgDesignation}
                      onChange={(e) => setOrgDesignation(e.target.value)}
                      className="bg-white border-slate-200 h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                      Official Email ID
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="name@organization.org"
                      value={orgEmail}
                      onChange={(e) => setOrgEmail(e.target.value)}
                      className="bg-white border-slate-200 h-10 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765-43210"
                      value={orgPhone}
                      onChange={(e) => setOrgPhone(e.target.value)}
                      className="bg-white border-slate-200 h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                      City
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={orgCity}
                      onChange={(e) => setOrgCity(e.target.value)}
                      className="bg-white border-slate-200 h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                      State
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Maharashtra"
                      value={orgState}
                      onChange={(e) => setOrgState(e.target.value)}
                      className="bg-white border-slate-200 h-10 rounded-xl"
                    />
                  </div>
                </div>

                {/* Checklist of areas */}
                <div className="space-y-3 pt-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-heading">
                    Areas of Collaboration
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {COLLABORATION_AREA_OPTIONS.map((area) => {
                      const checked = orgCollabAreas.includes(area);
                      return (
                        <button
                          type="button"
                          key={area}
                          onClick={() => handleCollabToggle(area)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left cursor-pointer transition-all ${checked
                            ? "bg-pink-100/50 border-pink-500 text-pink-700 shadow-2xs font-semibold"
                            : "bg-white border-slate-200 text-slate-500 text-xs"
                            }`}
                        >
                          <div
                            className={`h-4 w-4 rounded flex items-center justify-center border shrink-0 ${checked
                              ? "bg-pink-600 border-pink-600 text-white"
                              : "border-slate-300"
                              }`}
                          >
                            {checked && <Check className="h-3 w-3" />}
                          </div>
                          <span className="text-[11px] leading-tight select-none">
                            {area}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Real file upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-heading">
                    Upload Organization Profile (PDF)
                  </label>
                  <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-white text-center">
                    <input
                      type="file"
                      id="partner-doc-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleDocUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="partner-doc-upload"
                      className="cursor-pointer block"
                    >
                      {uploadingDoc ? (
                        <Loader2 className="h-5 w-5 text-pink-500 mx-auto mb-2 animate-spin" />
                      ) : (
                        <Upload className="h-5 w-5 text-slate-400 mx-auto mb-2" />
                      )}
                      <p className="text-[10px] font-bold text-slate-500 font-heading">
                        {uploadedDocUrl
                          ? "Uploaded ✔"
                          : "Choose File or Drag & Drop"}
                      </p>
                      <p className="text-[8px] text-slate-400 mt-1 font-sans">
                        Max 5MB · PDF, DOCX
                      </p>
                    </label>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                    Collaboration Intent / Message
                  </label>
                  <textarea
                    placeholder="Briefly state your partnership goals and resources details"
                    value={orgMessage}
                    onChange={(e) => setOrgMessage(e.target.value)}
                    className="w-full h-20 px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-pink-500 text-xs font-semibold text-slate-700 cursor-pointer"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold h-11 rounded-xl cursor-pointer"
                >
                  {formLoading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting Proposal...
                    </>
                  ) : (
                    "Submit Partnership Request"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="h-14 w-14 rounded-full bg-emerald-50 border-2 border-emerald-250 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="h-7 w-7 animate-pulse" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-800">
                  Proposal Transmitted
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-sans">
                  Thank you, <span className="font-bold">{orgContact}</span>. Your
                  collaborative proposal for{" "}
                  <span className="font-bold">{orgName}</span> has been securely
                  logged. The GRS administrative board will reach out to you
                  within 3 business days.
                </p>
                <Button
                  onClick={resetAppForm}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-6 py-2 rounded-xl cursor-pointer mt-4"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          13. FAQ
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider border border-pink-100">
              <MessageSquare className="h-4 w-4" />
              Onboarding FAQ
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Partnership FAQ
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-sans">
              Find answers regarding volunteer requirements, corporate CSR structures, and academic staging projects.
            </p>
          </div>

          <div className="space-y-4">
            {faqsData.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/50 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer font-bold text-slate-805 hover:text-pink-600 transition-colors font-heading"
                  >
                    <span className="text-sm sm:text-base tracking-tight leading-tight">
                      {faq.question}
                    </span>
                    <div className="shrink-0 ml-4 font-sans">
                      {isOpen ? (
                        <div className="p-1 rounded-full bg-pink-100 text-pink-600">
                          <X className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="p-1 rounded-full bg-white text-slate-400 border border-slate-200">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-1 text-slate-550 text-xs sm:text-sm leading-relaxed border-t border-slate-200/40 font-sans">
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

      {/* ----------------------------------------------------------------------
          14. FINAL CTA (Background Video Loop)
          ---------------------------------------------------------------------- */}
      <section className="py-28 bg-slate-950 text-white relative overflow-hidden">
        {/* Static CTA Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-slate-900 to-pink-950">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-pink-950/50" />
        </div>

        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center space-y-8">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider border border-pink-500/20"
          >
            <Heart className="h-4 w-4 text-pink-400 fill-pink-400 animate-pulse" />
            Unite for Cure
          </motion.div>

          <h2 className="font-heading text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Together, We Can Save More Lives.
          </h2>

          <p className="text-slate-350 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
            Every partnership strengthens our mission to reduce the burden of breast cancer through awareness, research, innovation, treatment, and compassionate care.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              onClick={() => {
                setPartnerFormOpen(true);
                scrollToId("partnership-application-section");
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-450 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-pink-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
            >
              Become a Partner
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setOrgName("Teleconsultation Specialist Inquiry");
                setPartnerFormOpen(true);
                scrollToId("partnership-application-section");
              }}
              className="w-full sm:w-auto border-slate-500 text-pink-600 to-rose-500 hover:bg-pink/10 font-bold px-8 py-6 rounded-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
            >
              Contact Partnership Team
            </Button>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          MODALS / POP-UPS (DETAILS, LIGHTBOX, VIDEO PLAYER)
          ---------------------------------------------------------------------- */}

      {/* 1. Partner Details Modal */}
      <AnimatePresence>
        {detailsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailsModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-3xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl z-10"
            >
              <button
                onClick={() => setDetailsModal(null)}
                className="absolute top-5 right-5 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded bg-pink-50 text-pink-650 text-[10px] font-bold uppercase tracking-wider font-heading">
                  {detailsModal.subcategory}
                </span>
                <span className="text-[10px] text-slate-400 font-bold font-sans flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {detailsModal.city}
                </span>
              </div>

              <h3 className="font-heading text-lg sm:text-xl font-extrabold text-slate-800 leading-tight">
                {detailsModal.name}
              </h3>

              <div className="mt-4 space-y-4 font-sans text-slate-650">
                <p className="text-xs sm:text-sm leading-relaxed">
                  {detailsModal.desc}
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                    Onboarding Target Areas
                  </p>
                  <p className="text-xs leading-relaxed text-slate-600">
                    Collaborating on diagnostic imaging checks, genetic staging indexes, and subsidies clearings.
                  </p>
                </div>

                <div className="pt-4 flex gap-3 border-t border-slate-100">
                  <a
                    href={detailsModal.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold h-10 rounded-xl cursor-pointer">
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Web Link
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDetailsModal(null);
                      setOrgName(detailsModal.name);
                      setPartnerFormOpen(true);
                      scrollToId("partnership-application-section");
                    }}
                    className="w-full rounded-xl border-slate-200 text-slate-750 font-bold h-10 cursor-pointer"
                  >
                    Contact Partner
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Lightbox Image Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full z-10 flex flex-col items-center gap-3"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black max-h-[75vh] w-full">
                <img
                  src={lightboxImage.imageUrl}
                  alt={lightboxImage.caption}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-white text-xs font-bold text-center bg-black/60 px-4 py-2 rounded-xl backdrop-blur-xs font-sans">
                {lightboxImage.caption}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Interactive Video Player Modal */}
      <AnimatePresence>
        {activePlayVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePlayVideo(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative max-w-2xl w-full z-10 bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <button
                onClick={() => setActivePlayVideo(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white z-20 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              <div className="aspect-video bg-slate-950 w-full relative">
                <video
                  controls
                  autoPlay
                  src={activePlayVideo.videoUrl}
                  className="w-full h-full object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-4 bg-slate-900 text-white font-sans space-y-1">
                <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider font-heading">
                  {activePlayVideo.category}
                </span>
                <h4 className="text-sm font-bold font-heading">
                  {activePlayVideo.title}
                </h4>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
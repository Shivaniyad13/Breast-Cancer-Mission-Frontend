"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Search,
  Mail,
  Phone,
  Globe,
  MapPin,
  Activity,
  Check,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
  Shield,
  Award,
  BookOpen,
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
  Star,
  Ribbon,
  Clock,
  HeartPulse,
  Handshake,
  Share2,
  Stethoscope,
  Sparkles,
  Brain,
  AlertCircle,
  Dna,
  Compass,
  User,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  src: string;
  caption: string;
  category: string;
}

interface VideoStory {
  id: string;
  title: string;
  category: string;
  src: string;
  thumbnail: string;
}

interface Testimonial {
  id: string;
  name: string;
  designation: string;
  organization: string;
  rating: number;
  quote: string;
  colorClass: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------
const partnersData: PartnerOrg[] = [
  // Hospitals
  {
    id: "part-1",
    name: "Apollo Proton & Oncology Research Hospital",
    category: "hospital",
    subcategory: "Cancer Hospitals",
    desc: "A globally accredited tertiary oncology facility partnering on state-of-the-art targeted radiation and proton treatments.",
    city: "Chennai",
    website: "https://apollo-proton.com",
    coverImage: "/images/13.png",
    logoIcon: Stethoscope
  },
  {
    id: "part-2",
    name: "Apex Comprehensive Diagnostics & Breast Clinic",
    category: "hospital",
    subcategory: "Diagnostic Centers",
    desc: "Provides complimentary automated breast ultrasound screening kits and digital tomosynthesis scans in collaborative outreach drives.",
    city: "New Delhi",
    website: "https://apex-breastclinic.org",
    coverImage: "/images/3d_tomosynthesis.png",
    logoIcon: Activity
  },
  {
    id: "part-3",
    name: "Tata Cancer Care Affiliate Center",
    category: "hospital",
    subcategory: "Cancer Hospitals",
    desc: "Subsidizes neoadjuvant chemotherapy cycles and complex double mastectomies for GRS program referrals.",
    city: "Mumbai",
    website: "https://tata-affiliate.in",
    coverImage: "/images/14.png",
    logoIcon: Building2
  },

  // NGOs
  {
    id: "part-4",
    name: "Sangini Breast Cancer Support Group",
    category: "ngo",
    subcategory: "Cancer Support Groups",
    desc: "Survivor-led NGO providing postoperative emotional counseling, clinical prosthetics distribution, and patient lodging.",
    city: "Noida",
    website: "https://sangini-breastsupport.org",
    coverImage: "/images/support_group.png",
    logoIcon: Heart
  },
  {
    id: "part-5",
    name: "Stree Shakti Women Empowerment League",
    category: "ngo",
    subcategory: "Women Empowerment NGOs",
    desc: "Conducts monthly grassroots awareness programs and breast self-examination workshops in rural communities.",
    city: "Gurugram",
    website: "https://stree-shakti.org",
    coverImage: "/images/volunteers.png",
    logoIcon: Users2
  },

  // Research
  {
    id: "part-6",
    name: "National Institute of Cancer Genomics",
    category: "research",
    subcategory: "Cancer Research Institutes",
    desc: "Collaborates on sequencing hereditary BRCA1 & BRCA2 mutations across low-income patient cohorts.",
    city: "Bangalore",
    website: "https://nicg-research.org",
    coverImage: "/images/cancer_research.png",
    logoIcon: Microscope
  },
  {
    id: "part-7",
    name: "Apex Medical College Clinical Trials Wing",
    category: "research",
    subcategory: "Clinical Trial Centers",
    desc: "Enrolls eligible metastatic breast cancer patients into immunotherapy checkpoint clinical trials.",
    city: "Kolkata",
    website: "https://apexmed-clinicaltrials.in",
    coverImage: "/images/15.png",
    logoIcon: GraduationCap
  },

  // Corporate
  {
    id: "part-8",
    name: "Novartis Biotech CSR Division",
    category: "corporate",
    subcategory: "Pharmaceutical Companies",
    desc: "Sponsors target hormone therapeutics and funds local patient navigation programs through annual CSR grants.",
    city: "Hyderabad",
    website: "https://novartis-csr.com",
    coverImage: "/images/12.png",
    logoIcon: Award
  },
  {
    id: "part-9",
    name: "Microsoft Health Technology Partners",
    category: "corporate",
    subcategory: "Technology Partners",
    desc: "Provides cloud database clusters for mobile screening diagnostics and funds AI diagnostic staging projects.",
    city: "Bangalore",
    website: "https://microsoft.com/health-csr",
    coverImage: "/images/ai_screening.png",
    logoIcon: Zap
  },

  // Government
  {
    id: "part-10",
    name: "National Public Health Staging Council",
    category: "government",
    subcategory: "Public Health Programs",
    desc: "Directs state-level integration of cancer registries and supports GRS rural mobile health testing vehicles.",
    city: "New Delhi",
    website: "https://nhp-staging.gov.in",
    coverImage: "/images/community_walk.png",
    logoIcon: Shield
  }
];

const successStoriesData: SuccessStory[] = [
  {
    id: "ss-1",
    orgName: "Novartis Biotech & GRS Mobile Drive",
    orgPhoto: "/images/12.png",
    eventImage: "/images/volunteers.png",
    beforeAfter: "Initially, village women in Alwar had no screening access. Through Novartis CSR funding and GRS mobile vans, we established local mammography screening stations, detecting 18 silent tumors in early stage-I.",
    screenedCount: "3,200+ Women",
    patientsHelped: "18 Patients Treated",
    eventsCount: "12 Mobile Camps",
    quote: "Sponsoring GRS mobile diagnostics has been our most high-impact CSR decision. We witnessed breast cancer awareness translate to survival in real-time.",
    directorName: "Ms. Ananya Sen, CSR Director"
  },
  {
    id: "ss-2",
    orgName: "Sangini NGO & GRS Support Alliance",
    orgPhoto: "/images/support_group.png",
    eventImage: "/images/survivor_strength.png",
    beforeAfter: "Post-mastectomy patients in government hospitals lacked rehabilitation. We joined forces to distribute custom compression sleeves and run support groups, mitigating chronic lymphedema cases.",
    screenedCount: "1,500+ Counseling Sessions",
    patientsHelped: "450+ Sleeve Kits Distributed",
    eventsCount: "24 Recovery Circles",
    quote: "Our alliance with GRS Breast Cancer Mission bridged the gap between post-surgical discharge and true survivorship rehabilitation.",
    directorName: "Dr. Meera Krishnan, Founder"
  }
];

const galleryItemsData: GalleryItem[] = [
  { id: "gal-1", src: "/images/community_walk.png", caption: "Pink Ribbon Awareness Walk 2025", category: "Walks" },
  { id: "gal-2", src: "/images/volunteers.png", caption: "Mobile Screening Camp in Rajasthan", category: "Camps" },
  { id: "gal-3", src: "/images/14.png", caption: "Oncology Specialists Consult at Clinic", category: "Medical" },
  { id: "gal-4", src: "/images/support_group.png", caption: "Survivor Recovery Support Session", category: "Outreach" },
  { id: "gal-5", src: "/images/cancer_research.png", caption: "Oncological Staging Research Lab", category: "Research" },
  { id: "gal-6", src: "/images/preventive_wellness.png", caption: "Patient Rehabilitation Workshop", category: "Workshops" }
];

const videoStoriesData: VideoStory[] = [
  { id: "vid-1", title: "GRS Rural Mobile Screening Documentary", category: "Community Programs", src: "/videoplayback.mp4", thumbnail: "/images/volunteers.png" },
  { id: "vid-2", title: "Dr. Aurag on Staging & Collaboration Impact", category: "Partner Interviews", src: "/euhbbZb3sNXxgOi6g2MF+42G6uUncFHU.mp4", thumbnail: "/images/13.png" },
  { id: "vid-3", title: "Novartis CSR Impact & Corporate Networking", category: "CSR Activities", src: "/videoplayback.mp4", thumbnail: "/images/12.png" },
  { id: "vid-4", title: "Sangini NGO Support Circles & Healing Journeys", category: "Survivor Stories", src: "/videoplayback.mp4", thumbnail: "/images/support_group.png" }
];

const testimonialsData: Testimonial[] = [
  {
    id: "test-1",
    name: "Dr. Sudheer Kumar",
    designation: "Medical Director",
    organization: "Apex Comprehensive Cancer Center",
    rating: 5,
    quote: "Collaborating with GRS has allowed us to coordinate complex surgical cases efficiently. The patient navigation program is outstanding.",
    colorClass: "from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-200/50"
  },
  {
    id: "test-2",
    name: "Ms. Shalini Gupta",
    designation: "Head of CSR",
    organization: "Microsoft Health Initiatives",
    rating: 5,
    quote: "Our technology partnership with GRS has enabled safe diagnostic data hubs, helping mobile screening vans target high-risk areas.",
    colorClass: "from-pink-500/10 to-rose-500/10 text-pink-600 border-pink-200/50"
  },
  {
    id: "test-3",
    name: "Prof. Rajesh Dev",
    designation: "Head of Genomics Research",
    organization: "National Institute of Cancer Genomics",
    rating: 5,
    quote: "GRS patient registries have provided vital genomic markers data, enabling us to publish breakthrough BRCA1/2 penetrance studies.",
    colorClass: "from-purple-500/10 to-indigo-500/10 text-purple-600 border-purple-200/50"
  }
];

const faqsData: FAQItem[] = [
  {
    question: "How can my organization become a partner?",
    answer: "You can submit an application form in the 'Partnership Application' section. Provide your organization's type, license, website, and area of interest (e.g. mobile camps, CSR funding). Our administrative panel will contact you to schedule an initial review."
  },
  {
    question: "Who can apply to join the partner network?",
    answer: "We accept partnership requests from cancer specialty hospitals, diagnostic screening laboratories, women empowerment NGOs, survivor groups, academic research universities, corporate CSR divisions, and government public health programs."
  },
  {
    question: "Is there any fee required to join?",
    answer: "No, GRS Breast Cancer Mission charges no registration or membership fees to join the Partner Network. Our alliances are built on shared clinical resources, community screening drives, and voluntary collaborations."
  },
  {
    question: "Can international organizations collaborate?",
    answer: "Yes. GRS actively collaborates with international oncology groups, universities, and pharmaceutical companies for research, clinical trial enrollment, and educational webinars."
  },
  {
    question: "Can universities join research projects?",
    answer: "Yes. Academic medical colleges and biotechnology labs can integrate GRS tumor board staging data to execute clinical trials, tissue studies, and survivorship research."
  },
  {
    question: "How long does the approval process take?",
    answer: "The onboarding cycle takes approximately 2-3 weeks. This includes initial credential checks, tumor board alignment reviews, and drafting standard operational plans for regional screening camp logistics."
  }
];

export default function PartnerOrganizationsPage() {
  // ----------------------------------------------------------------------
  // State variables
  // ----------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Success story slider index
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  // Modals state
  const [detailsModal, setDetailsModal] = useState<PartnerOrg | null>(null);
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);
  const [activePlayVideo, setActivePlayVideo] = useState<VideoStory | null>(null);
  const [partnerFormOpen, setPartnerFormOpen] = useState(false);

  // Testimonial slider state
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

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
  // Autoplay intervals
  // ----------------------------------------------------------------------
  useEffect(() => {
    const storyInterval = setInterval(() => {
      setActiveStoryIdx(prev => (prev + 1) % successStoriesData.length);
    }, 9000);

    const testimonialInterval = setInterval(() => {
      setActiveTestimonialIdx(prev => (prev + 1) % testimonialsData.length);
    }, 7000);

    return () => {
      clearInterval(storyInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  // Filter partners
  const filteredPartners = partnersData.filter(partner => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.desc.toLowerCase().includes(searchQuery.toLowerCase());

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
    { value: "government", label: "Government Agencies" }
  ];

  const handleCollabToggle = (area: string) => {
    if (orgCollabAreas.includes(area)) {
      setOrgCollabAreas(prev => prev.filter(a => a !== area));
    } else {
      setOrgCollabAreas(prev => [...prev, area]);
    }
  };

  const handleAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !orgContact || !orgEmail || !orgPhone) {
      alert("Please fill in organization name, contact representative, email, and phone.");
      return;
    }
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormSuccess(true);
    }, 1500);
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
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover pointer-events-none filter brightness-[0.3] contrast-105"
            poster="/images/community_walk.png"
          >
            <source src="/videoplayback.mp4" type="video/mp4" />
          </video>
          {/* Deep premium overlay with pink/purple/dark shades */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/65 to-pink-955/45 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-95" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10 py-24 text-center sm:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-8 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 backdrop-blur-md border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider"
              >
                <Handshake className="h-4 w-4 text-pink-400" />
                Collaborative Impact Network
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
              >
                Together We Create <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-purple-450 font-heading">
                  Greater Impact.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-slate-300 text-base sm:text-lg leading-relaxed font-sans max-w-2xl"
              >
                Strong partnerships between healthcare providers, NGOs, research institutions, corporate organizations, and communities help improve breast cancer awareness, research, treatment, and patient care.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start pt-2"
              >
                <Button
                  onClick={() => setPartnerFormOpen(true)}
                  className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-pink-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
                >
                  Become a Partner
                  <ArrowRight className="h-5 w-5 ml-1.5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => scrollToId("partner-network-directory")}
                  className="border-slate-400 text-pink-600 to rose-500 hover:bg-pink/10 hover:text-pink font-bold px-8 py-6 rounded-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
                >
                  Explore Our Network
                </Button>
              </motion.div>
            </div>

            {/* Right Side Stats Panel */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              {[
                { label: "NGOs & Partners", value: "120+", delay: 0.2 },
                { label: "Hospitals Connected", value: "50+", delay: 0.3 },
                { label: "Awareness Drives", value: "300+", delay: 0.4 },
                { label: "Women Screened", value: "25k+", delay: 0.5 }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: stat.delay }}
                  className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl hover:bg-white/15 transition-all flex flex-col justify-between text-left"
                >
                  <p className="text-[10px] text-pink-300 font-bold tracking-widest uppercase font-heading">{stat.label}</p>
                  <p className="text-3xl font-black text-white tracking-tight font-heading mt-3">{stat.value}</p>
                  <div className="h-1.5 w-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mt-3" />
                </motion.div>
              ))}
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
                color: "bg-blue-50 border-blue-200 text-blue-600"
              },
              {
                title: "Academic Genetics Research",
                desc: "Universities and biotech labs analyze GRS patient databases to map regional BRCA1/2 penetrance indexes.",
                icon: Microscope,
                color: "bg-purple-50 border-purple-200 text-purple-600"
              },
              {
                title: "Grassroots Awareness Outreach",
                desc: "Local women empowerment NGOs manage community walks, school seminars, and screening camp coordinates.",
                icon: Users2,
                color: "bg-pink-50 border-pink-200 text-pink-600"
              },
              {
                title: "CSR Funding & Therapeutics",
                desc: "Corporate pharmaceuticals sponsor chemotherapy drug reserves, ensuring patient treatment never drop out.",
                icon: Award,
                color: "bg-emerald-50 border-emerald-200 text-emerald-600"
              },
              {
                title: "Affordable Treatment",
                desc: "Subsidy alliances directly clear surgical oncology and radiotherapy bills at partner hospitals.",
                icon: Pill,
                color: "bg-cyan-50 border-cyan-200 text-cyan-600"
              },
              {
                title: "Rehabilitation Care",
                desc: "Specialty physical therapists guide post-operative mobilization and lymphedema compression clinics.",
                icon: Sparkles,
                color: "bg-rose-50 border-rose-200 text-rose-600"
              },
              {
                title: "Mental Health Support",
                desc: "Clinical psychologists host weekly therapy circles, helping survivors cope with chemotherapy trauma.",
                icon: Brain,
                color: "bg-teal-50 border-teal-200 text-teal-600"
              },
              {
                title: "Rural Outreach Camps",
                desc: "Public health agencies support mobile vans delivering diagnostics to remote, low-income areas.",
                icon: MapPin,
                color: "bg-sky-50 border-sky-200 text-sky-600"
              }
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
                  <h4 className="font-heading text-sm font-extrabold text-slate-800 mt-6 leading-tight">{item.title}</h4>
                  <p className="text-slate-500 text-xs mt-2.5 leading-relaxed font-sans">{item.desc}</p>
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
              {filteredPartners.length > 0 ? (
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
                          {React.createElement(partner.logoIcon, { className: "h-5.5 w-5.5" })}
                        </div>
                        <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wider font-heading">
                          {partner.subcategory}
                        </span>
                      </div>

                      {/* Cover Photo */}
                      <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-200/50">
                        <img
                          src={partner.coverImage}
                          alt={partner.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
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
                          {partner.city}
                        </span>
                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold">
                          <Globe className="h-3.5 w-3.5" />
                          Website
                        </a>
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
                  <h3 className="font-heading text-lg font-bold text-slate-700">No Partners Found</h3>
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

      {/* ----------------------------------------------------------------------
          4. SUCCESS STORIES (Slider)
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-purple-950 text-white relative">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider border border-pink-500/20">
              <Award className="h-4 w-4 animate-pulse" />
              Impact Milestones
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Partnership Success Stories
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              Real outcomes from neoadjuvant chemotherapy sponsorships and diagnostic outreach events.
            </p>
          </div>

          {/* Autoplay Slider */}
          <div className="relative bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 md:p-12 backdrop-blur-lg shadow-2xl overflow-hidden min-h-[480px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStoryIdx}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full"
              >
                {/* Event Image */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-3 border-pink-500/30 shadow-2xl group">
                    <img
                      src={successStoriesData[activeStoryIdx].eventImage}
                      alt={successStoriesData[activeStoryIdx].orgName}
                      className="w-full h-full object-cover transition-transform duration-705 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 bg-pink-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-md tracking-wider shadow-md font-heading">
                      Featured Impact
                    </span>
                  </div>
                </div>

                {/* Info & Quote */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-pink-400 uppercase tracking-widest font-heading">Alliance Success</p>
                    <h3 className="font-heading text-2xl font-extrabold text-white">
                      {successStoriesData[activeStoryIdx].orgName}
                    </h3>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed font-sans">
                    {successStoriesData[activeStoryIdx].beforeAfter}
                  </p>

                  {/* Impact Badges */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                      {successStoriesData[activeStoryIdx].screenedCount}
                    </span>
                    <span className="text-[10px] font-bold text-blue-450 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
                      {successStoriesData[activeStoryIdx].patientsHelped}
                    </span>
                    <span className="text-[10px] font-bold text-purple-405 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                      {successStoriesData[activeStoryIdx].eventsCount}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-pink-500/10 border-l-4 border-pink-500 italic">
                    <p className="text-pink-300 font-serif text-sm leading-relaxed">
                      &ldquo;{successStoriesData[activeStoryIdx].quote}&rdquo;
                    </p>
                    <p className="text-slate-400 text-xs font-bold font-heading mt-2 uppercase tracking-wide">
                      — {successStoriesData[activeStoryIdx].directorName}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Selector dots */}
            <div className="absolute bottom-6 right-6 md:right-12 flex items-center gap-2 z-20">
              {successStoriesData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStoryIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${activeStoryIdx === idx ? "w-6 bg-pink-500" : "w-2 bg-white/30 hover:bg-white/50"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          5. IMPACT DASHBOARD
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
              <Activity className="h-4 w-4" />
              Accumulated Metrics
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              GRS Alliance Impact Dashboard
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Consolidated statistics validating early diagnostics screenings, medical camps, and patient treatment clearings.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {[
              { value: "120+", label: "Partners", sub: "NGOs/Corporates" },
              { value: "500+", label: "Doctors", sub: "Verified Specialists" },
              { value: "50+", label: "Hospitals", sub: "Treatment Units" },
              { value: "300+", label: "Programs", sub: "Awareness events" },
              { value: "25k+", label: "Screened", sub: "Mammographies/US" },
              { value: "5,000+", label: "Supported", sub: "Patient Journeys" },
              { value: "100+", label: "Camps", sub: "Rural mobile units" }
            ].map((dash, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-205/50 rounded-2xl p-5 flex flex-col justify-between hover:bg-white hover:shadow-md hover:border-pink-300 transition-all duration-300"
              >
                <div className="h-1 w-6 bg-pink-500 rounded-full" />
                <div className="my-5">
                  <h4 className="text-2xl font-black text-slate-800 tracking-tight font-heading">{dash.value}</h4>
                  <p className="text-xs font-bold text-slate-700 mt-2 font-heading">{dash.label}</p>
                </div>
                <p className="text-[10px] text-slate-400 font-sans leading-tight">{dash.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          6. COLLABORATION AREAS
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-blue-50/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider border border-purple-100">
              <Share2 className="h-4 w-4" />
              Opportunities
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Active Collaboration Fields
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              We invite partners to plug their medical databases or administrative networks into these 13 fields.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Awareness Campaigns", icon: Ribbon, desc: "Pink Ribbon conferences, college drives, and village physical counseling." },
              { title: "Mobile Screening Camps", icon: Activity, desc: "Sponsor vans carrying automated breast ultrasounds (ABUS) to high-risk hubs." },
              { title: "Research Collaboration", icon: Microscope, desc: "Evaluate breast pathology cell counting and clinical neoadjuvant treatment response." },
              { title: "Genetic Screening Programs", icon: Dna, desc: "Fund sequencing tests for BRCA1/BRCA2 mutation carriers." },
              { title: "Rural Healthcare", icon: MapPin, desc: "Deliver diagnostics tools and consulting doctors directly to remote districts." },
              { title: "Patient Navigation", icon: Compass, desc: "Guide patients through clinical staging charts, biopsies, and scheduling." },
              { title: "Financial Assistance", icon: Handshake, desc: "Route corporate CSR funds or NGO grants to cover patient surgical mastectomy bills." },
              { title: "Rehabilitation Programs", icon: Sparkles, desc: "Coordinate arm mobilization and postoperative lymphedema compression." },
              { title: "Community Outreach", icon: Users2, desc: "Enlist community leaders to eliminate social breast cancer screening stigmas." },
              { title: "Volunteer Programs", icon: User, desc: "Join campaigns as tele-consulting specialists, diagnostic nurses, or walk marshals." },
              { title: "Digital Health Innovation", icon: Zap, desc: "Develop digital reporting portal and AI diagnostic triage models." },
              { title: "AI Research Integration", icon: Brain, desc: "Unify digital pathology counting algorithms with clinical registries." },
              { title: "Medical Education", icon: GraduationCap, desc: "Fund continuing medical education (CME) seminars for rural physicians." }
            ].map((collab, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-2xs hover:shadow-md hover:border-pink-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-pink-600 transition-colors">
                    {React.createElement(collab.icon, { className: "h-5 w-5" })}
                  </div>
                  <h4 className="font-heading text-sm font-extrabold text-slate-800 mt-6 leading-tight">{collab.title}</h4>
                  <p className="text-slate-500 text-xs mt-2.5 leading-relaxed font-sans">{collab.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
              GRS Alliance Event Gallery
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Browse realistic imagery documenting awareness walks, medical workshops, diagnostics camps, and lab research. Click to expand.
            </p>
          </div>

          {/* Masonry-like Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItemsData.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightboxImage(item)}
                className="relative rounded-3xl overflow-hidden border border-slate-200/50 bg-slate-100 aspect-4/3 shadow-2xs hover:shadow-md cursor-pointer group transition-shadow"
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <span className="px-2 py-0.5 rounded bg-pink-600 text-[8px] font-bold uppercase tracking-wider self-start mb-2 font-heading">
                    {item.category}
                  </span>
                  <p className="text-xs font-bold font-sans line-clamp-2">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoStoriesData.map((vid) => (
              <div
                key={vid.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Thumbnail with overlay play */}
                <div className="relative h-44 bg-slate-950">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
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
                  <span className="text-[9px] font-bold text-pink-650 uppercase tracking-wider font-heading">{vid.category}</span>
                  <h4 className="font-heading text-xs sm:text-sm font-extrabold text-slate-800 line-clamp-2 leading-snug group-hover:text-pink-600 transition-colors">
                    {vid.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          9. HOW TO BECOME A PARTNER (Timeline)
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-purple-950 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider border border-pink-500/20">
              <Clock className="h-4 w-4" />
              Onboarding Path
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Partnership Onboarding Path
            </h2>
            <p className="text-slate-350 text-sm sm:text-base leading-relaxed font-sans">
              We review credentials and align timelines to execute community drives. Here is our 6-step integration roadmap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative">
            {/* Desktop timeline connecting line */}
            <div className="hidden md:block absolute top-7 left-10 right-10 h-1 bg-white/10 z-0" />

            {[
              { step: "01", title: "Submit Request", desc: "File an application detailing your organization's focus and collaboration interest." },
              { step: "02", title: "Initial Review", desc: "Our administrative team schedules a consultation call to discuss parameters." },
              { step: "03", title: "Approval Gate", desc: "The GRS medical/NGO advisory board evaluates credential qualifications." },
              { step: "04", title: "Project Planning", desc: "Draft regional logistics plans for mobile screening camps or research registry schemas." },
              { step: "05", title: "Implementation", desc: "Establish clinic lines, sponsor chemotherapy supplies, or publish genomic abstracts." },
              { step: "06", title: "Impact Registry", desc: "Compile treatment outcomes and screen numbers into our transparent logs." }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-3">
                <div className="h-14 w-14 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-heading text-base font-black text-pink-400 shadow-md">
                  {item.step}
                </div>
                <h4 className="font-heading text-sm font-extrabold text-white">{item.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed font-sans max-w-[150px] mx-auto md:max-w-none">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              { title: "Shared Resources", icon: Handshake, desc: "Access screening devices, checklists, and templates." }
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-205/50 rounded-3xl p-5 hover:bg-white hover:shadow-md hover:border-pink-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="h-9 w-9 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 shrink-0 mb-5">
                  {React.createElement(benefit.icon, { className: "h-4.5 w-4.5" })}
                </div>
                <div>
                  <h4 className="font-heading text-xs sm:text-sm font-extrabold text-slate-800 leading-tight">{benefit.title}</h4>
                  <p className="text-slate-500 text-[11px] mt-2 leading-relaxed font-sans">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          11. PARTNER TESTIMONIALS
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-slate-900 text-white relative">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-widest font-heading">Feedback</span>
            <h2 className="font-heading text-3xl font-extrabold text-white">Words of Collaborative Trust</h2>
          </div>

          <div className="relative bg-white/5 border border-white/10 p-8 sm:p-12 rounded-3xl backdrop-blur-md shadow-xl text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonialIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex justify-center gap-1.5">
                  {[...Array(testimonialsData[activeTestimonialIdx].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-slate-200 text-base sm:text-lg leading-relaxed italic font-serif">
                  &ldquo;{testimonialsData[activeTestimonialIdx].quote}&rdquo;
                </p>

                <div className="border-t border-white/10 pt-6 mt-6">
                  <h4 className="text-white font-bold font-heading text-base leading-tight">
                    {testimonialsData[activeTestimonialIdx].name}
                  </h4>
                  <p className="text-pink-300 text-xs font-semibold mt-1 font-sans">
                    {testimonialsData[activeTestimonialIdx].designation} &bull; {testimonialsData[activeTestimonialIdx].organization}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider arrows */}
            <div className="absolute bottom-6 right-6 md:right-12 flex gap-2">
              <button
                onClick={() => setActiveTestimonialIdx((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={() => setActiveTestimonialIdx((prev) => (prev + 1) % testimonialsData.length)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </button>
            </div>
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
              Submit your institutional credentials and selected areas of interest to connect with GRS Breast Cancer Mission.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-205/50 shadow-md">
            {!formSuccess ? (
              <form onSubmit={handleAppSubmit} className="space-y-6 font-sans">
                {/* Organization details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Organization Name</label>
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
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Organization Type</label>
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
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Official Website URL</label>
                    <Input
                      type="url"
                      placeholder="e.g. https://apex-labs.org"
                      value={orgWeb}
                      onChange={(e) => setOrgWeb(e.target.value)}
                      className="bg-white border-slate-200 h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Contact Representative</label>
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
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Representative Title</label>
                    <Input
                      type="text"
                      placeholder="e.g. CSR Director"
                      value={orgDesignation}
                      onChange={(e) => setOrgDesignation(e.target.value)}
                      className="bg-white border-slate-200 h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Official Email ID</label>
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
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Phone Number</label>
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
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">City</label>
                    <Input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={orgCity}
                      onChange={(e) => setOrgCity(e.target.value)}
                      className="bg-white border-slate-200 h-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">State</label>
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
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-heading">Areas of Collaboration</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Awareness Campaigns",
                      "Mobile Screening Camps",
                      "Academic Research Collaboration",
                      "Genetic BRCA Screening",
                      "Rural Outpatient Care Support",
                      "Patient Navigation Program",
                      "Financial Mastectomy Assistance",
                      "Rehabilitation & Lymphedema",
                      "Corporate CSR Funding"
                    ].map((area) => {
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
                          <div className={`h-4 w-4 rounded flex items-center justify-center border shrink-0 ${checked ? "bg-pink-600 border-pink-600 text-white" : "border-slate-300"}`}>
                            {checked && <Check className="h-3 w-3" />}
                          </div>
                          <span className="text-[11px] leading-tight select-none">{area}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated file upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-heading">Upload Organization Profile (PDF)</label>
                  <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-white text-center cursor-pointer hover:bg-slate-50 transition-colors">
                    <Upload className="h-5 w-5 text-slate-450 mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-slate-500 font-heading">Choose File or Drag &amp; Drop</p>
                    <p className="text-[8px] text-slate-400 mt-1 font-sans">Max size: 5MB &bull; Format: PDF, DOCX</p>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Collaboration Intent / Message</label>
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
                <h3 className="font-heading text-lg font-bold text-slate-800">Proposal Transmitted</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-sans">
                  Thank you, <span className="font-bold">{orgContact}</span>. Your collaborative proposal for <span className="font-bold">{orgName}</span> has been securely logged. The GRS administrative board will reach out to you within 3 business days.
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
                    <span className="text-sm sm:text-base tracking-tight leading-tight">{faq.question}</span>
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
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover pointer-events-none filter brightness-[0.25]"
            poster="/images/volunteers.png"
          >
            <source src="/videoplayback.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-955/60 to-transparent" />
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
                <p className="text-xs sm:text-sm leading-relaxed">{detailsModal.desc}</p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Onboarding Target Areas</p>
                  <p className="text-xs leading-relaxed text-slate-600">
                    Collaborating on diagnostic imaging checks, genetic staging indexes, and subsidies clearings.
                  </p>
                </div>

                <div className="pt-4 flex gap-3 border-t border-slate-100">
                  <a href={detailsModal.website} target="_blank" rel="noopener noreferrer" className="w-full">
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
                <img src={lightboxImage.src} alt={lightboxImage.caption} className="w-full h-full object-contain" />
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
                  className="w-full h-full object-cover"
                >
                  <source src={activePlayVideo.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-4 bg-slate-900 text-white font-sans space-y-1">
                <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider font-heading">{activePlayVideo.category}</span>
                <h4 className="text-sm font-bold font-heading">{activePlayVideo.title}</h4>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

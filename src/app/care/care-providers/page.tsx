"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPublicApprovedArticlesAction } from "@/app/actions/articles";
import { getPublicCareProviders } from "@/app/actions/careProviders";
import {
  Search,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Star,
  Ribbon,
  Download,
  Info,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  ArrowRight,
  Activity,
  Heart,
  ShieldAlert,
  Users2,
  User,
  Stethoscope,
  FileText,
  AlertCircle,
  MessageSquare,
  Home,
  Clock,
  Dna,
  Sparkles,
  Layers,
  Apple,
  Brain,
  Zap,
  Pill,
  Microscope,
  Check,
  ChevronDown,
  X,
  HeartPulse,
  BookOpen,
  Building2,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ----------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------
interface Specialist {
  id: string;
  name: string;
  desc: string;
  role: string;
  colorClass: string;
  icon: React.ComponentType<any>;
}

interface CareService {
  id: string;
  name: string;
  category: string;
  specialization: string;
  city: string;
  state?: string | null;
  phone: string;
  email: string;
  address: string;
  website?: string | null;
  hours?: string | null;
  about: string;
  facilities: string[];
  rating: number;
  reviews: number;
  isVerified: boolean;
  isPublished: boolean;
}

interface JourneyStep {
  step: string;
  title: string;
  desc: string;
  icon: React.ComponentType<any>;
}

interface SupportService {
  title: string;
  desc: string;
  features: string[];
  icon: React.ComponentType<any>;
  gradientClass: string;
}

interface PatientResource {
  title: string;
  size: string;
  format: string;
  desc: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

const GALLERY_ITEMS = [
  { name: "Dr.Anurag Srivastav", dept: "Medical Oncology", img: "/team8.jpg" },
  { name: "Dr.Navneet Kaur", dept: "Genetics Lab", img: "/photo.jpg" },
  { name: "Dr. Rahul Bhardavaj", dept: "Patient Support", img: "/photo.jpg" },
  { name: "Dr. Ashok Sharma ", dept: "Community Outreach", img: "/photo.jpg" },
  { name: "Dr. Nandani Bhojraj", dept: "Operations & HR", img: "/photo.jpg" },
  { name: "Dr. U.P Sahi", dept: "Diagnostic Imaging", img: "/photo.jpg" },
  { name: "Dr. Ashok Ved", dept: "Public Advocacy", img: "/photo.jpg" },
  { name: "Dr. Ashutosh Pathankar", dept: "Family Counselling", img: "/photo.jpg" },
  { name: "Dr. Sanjay Mahesawari", dept: "Molecular Research", img: "/photo.jpg" },
  { name: "Dr. Shilpa Rao", dept: "Campaign Logistics", img: "/photo.jpg" },
  { name: "Dr. Anita Shrotia", dept: "Patient Support", img: "/photo.jpg" },
  { name: "Dr. Abhishek Sankar", dept: "Patient Support", img: "/photo.jpg" },
  { name: "Dr. Sushil Jain", dept: "Patient Support", img: "/photo.jpg" },
  { name: "Dr. Nikhil", dept: "Patient Support", img: "/photo.jpg" },
  { name: "Dr. Neraj", dept: "Patient Support", img: "/photo.jpg" },
  { name: "Dr. P.C Sharma", dept: "Patient Support", img: "/photo.jpg" },
  { name: "Dr. Hari Shukla", dept: "Patient Support", img: "/photo.jpg" },
];

const specialistsData: Specialist[] = [
  {
    id: "breast-surgeon",
    name: "Breast Surgeon",
    icon: Stethoscope,
    desc: "A surgical oncologist specializing in removing breast tumors, performing mastectomies, lumpectomies, and node biopsies.",
    role: "Performs precise surgical excisions, designs surgical margins, and coordinates reconstruction.",
    colorClass: "bg-pink-50/50 border-pink-100/60 text-pink-600"
  },
  {
    id: "medical-oncologist",
    name: "Medical Oncologist",
    icon: Pill,
    desc: "A specialist who treats breast cancer using systemic therapies like chemotherapy, targeted therapy, and immunotherapy.",
    role: "Designs chemo regimens, manages treatment side effects, and monitors patient systemic response.",
    colorClass: "bg-purple-50/50 border-purple-100/60 text-purple-600"
  },
  {
    id: "radiation-oncologist",
    name: "Radiation Oncologist",
    icon: Zap,
    desc: "Uses high-energy radiation beams to target and destroy remaining microscopic cancer cells post-surgery.",
    role: "Configures exact radiation dosage mapping and schedules localized radiotherapy cycles.",
    colorClass: "bg-blue-50/50 border-blue-100/60 text-blue-600"
  },
  {
    id: "plastic-surgeon",
    name: "Plastic & Reconstructive Surgeon",
    icon: Layers,
    desc: "Restores breast shape, symmetry, and appearance using implants or natural tissue flaps after mastectomy.",
    role: "Performs oncoplastic reconstruction, tissue transfer, and aesthetic symmetrical reshaping.",
    colorClass: "bg-rose-50/50 border-rose-100/60 text-rose-600"
  },
  {
    id: "radiologist",
    name: "Radiologist",
    icon: Activity,
    desc: "An imaging specialist who interprets mammograms, breast ultrasounds, MRIs, and performs image-guided biopsies.",
    role: "Analyzes screening scans, identifies abnormalities, and guides needle localization biopsy procedures.",
    colorClass: "bg-cyan-50/50 border-cyan-100/60 text-cyan-600"
  },
  {
    id: "pathologist",
    name: "Pathologist",
    icon: Microscope,
    desc: "Analyzes breast tissue biopsy samples under a microscope to confirm cancer, identify grade, and hormone receptors.",
    role: "Performs immunohistochemistry, determines ER/PR/HER2 status, and provides the diagnostic report.",
    colorClass: "bg-indigo-50/50 border-indigo-100/60 text-indigo-600"
  },
  {
    id: "oncology-nurse",
    name: "Oncology Nurse",
    icon: HeartPulse,
    desc: "Provides expert clinical nursing care, administers chemotherapy drugs, and manages symptom support during cycles.",
    role: "Monitors vitals, educates on medication side effects, and offers comforting bedside care.",
    colorClass: "bg-pink-50/50 border-pink-100/60 text-pink-600"
  },
  {
    id: "genetic-counselor",
    name: "Genetic Counselor",
    icon: Dna,
    desc: "Assesses genetic risk profiles (e.g., BRCA1/BRCA2 mutation tests) for patients and their family members.",
    role: "Analyzes hereditary health history, explains risk assessment scores, and assists in gene-preventative plans.",
    colorClass: "bg-violet-50/50 border-violet-100/60 text-violet-600"
  },
  {
    id: "physiotherapist",
    name: "Physiotherapist",
    icon: Sparkles,
    desc: "Helps patients restore arm mobility, prevent lymphedema, and rebuild physical strength after surgery.",
    role: "Designs lymphatic drainage exercises, shoulder mobility programs, and physical recovery tracking.",
    colorClass: "bg-emerald-50/50 border-emerald-100/60 text-emerald-600"
  },
  {
    id: "nutritionist",
    name: "Nutritionist / Dietitian",
    icon: Apple,
    desc: "Curates tailored oncology nutritional plans to maintain strength, manage weight, and boost immunity.",
    role: "Develops meal plans for treatment cycles, recommends digestive remedies, and guides post-cancer diets.",
    colorClass: "bg-amber-50/50 border-amber-100/60 text-amber-600"
  },
  {
    id: "psychologist",
    name: "Clinical Psychologist",
    icon: Brain,
    desc: "Supports patients and families coping with the emotional stress, anxiety, and trauma of cancer diagnosis.",
    role: "Conducts individual therapy sessions, grief counseling, and cognitive behavioral therapy (CBT).",
    colorClass: "bg-teal-50/50 border-teal-100/60 text-teal-600"
  },
  {
    id: "palliative-specialist",
    name: "Palliative Care Specialist",
    icon: HeartHandshake,
    desc: "Focuses on optimizing quality of life by managing pain, physical symptoms, and treatment stress.",
    role: "Prescribes advanced symptom relief management, coordinates holistic support, and comfort plans.",
    colorClass: "bg-red-50/50 border-red-100/60 text-red-600"
  },
  {
    id: "social-worker",
    name: "Social Worker & Navigator",
    icon: HeartHandshake,
    desc: "Guides patients through treatment scheduling, healthcare system navigation, and financial assistance schemes.",
    role: "Helps verify NGO grants, manages hospital insurance claims, and arranges support group logistics.",
    colorClass: "bg-sky-50/50 border-sky-100/60 text-sky-600"
  }
];

const journeyStepsData: JourneyStep[] = [
  { step: "01", title: "Self-Examination", desc: "Perform monthly breast self-exams to detect unusual lumps, skin dimpling, or nipple changes early.", icon: Ribbon },
  { step: "02", title: "Mammography", desc: "Schedule annual screenings for women aged 40+, or earlier if high-risk, to detect microscopic changes.", icon: Activity },
  { step: "03", title: "Clinical Exam", desc: "Visit a gynecologist or breast specialist for a physical evaluation if symptoms or lump arises.", icon: User },
  { step: "04", title: "Biopsy & Pathology", desc: "Extract tumor cells via needle biopsy to analyze cell types, tumor grade, and hormone receptors.", icon: Microscope },
  { step: "05", title: "Treatment Plan", desc: "Collaborate with a multidisciplinary tumor board to define chemotherapy, surgery, and radiation stages.", icon: Stethoscope },
  { step: "06", title: "Breast Surgery", desc: "Remove the tumor (lumpectomy) or the whole breast (mastectomy), often combined with lymph node checks.", icon: Layers },
  { step: "07", title: "Chemotherapy", desc: "Administer systemic drugs orally or intravenously to target and kill fast-dividing cancer cells.", icon: Pill },
  { step: "08", title: "Radiation Therapy", desc: "Expose target breast margins to energy beams, destroying microscopic cells remaining after surgery.", icon: Zap },
  { step: "09", title: "Hormone Therapy", desc: "Block estrogen/HER2 pathways using medication (like Tamoxifen or Herceptin) to prevent recurrence.", icon: HeartPulse },
  { step: "10", title: "Rehabilitation", desc: "Engage in lymphedema prevention therapy, physical shoulder exercises, and reconstructive healing.", icon: Sparkles },
  { step: "11", title: "Follow-up Care", desc: "Receive surveillance scans, blood work, and oncological follow-up appointments every 3-6 months.", icon: ShieldCheck }
];

const supportServicesData: SupportService[] = [
  { title: "Emotional Counseling", desc: "Professional therapists guiding you through shock, anxiety, and depression to build mental resilience.", features: ["One-on-one sessions", "Stress relief therapy", "Caregiver support"], icon: Brain, gradientClass: "from-pink-500/5 to-rose-500/5 text-pink-600 border-pink-100/60" },
  { title: "Nutrition Guidance", desc: "Tailored dietary advice to maintain cellular strength, digest food easily, and boost immunity.", features: ["Cycle-specific meal plans", "Nausea mitigation diets", "Weight management"], icon: Apple, gradientClass: "from-amber-500/5 to-orange-500/5 text-amber-600 border-amber-100/60" },
  { title: "Survivorship Programs", desc: "Providing transition support, helping survivors return to work, stay healthy, and advocate.", features: ["Transition guidance", "Healthy life coaching", "Advocacy meetups"], icon: Ribbon, gradientClass: "from-purple-500/5 to-indigo-500/5 text-purple-600 border-purple-100/60" },
  { title: "Financial Assistance", desc: "Connecting families to government schemes, healthcare insurance, and verified NGO treatment grants.", features: ["NGO subsidy routing", "Insurance facilitation", "Crowdfunding tools"], icon: HeartHandshake, gradientClass: "from-emerald-500/5 to-teal-500/5 text-emerald-600 border-emerald-100/60" },
  { title: "Family Support Systems", desc: "Counseling spouses, children, and close relatives on how to care for patients without burning out.", features: ["Family group therapy", "Youth coping toolkits", "Respite care help"], icon: Users2, gradientClass: "from-blue-500/5 to-sky-500/5 text-blue-600 border-blue-100/60" },
  { title: "Fertility Counseling", desc: "Expert guidance on egg freezing and reproductive options before starting chemotherapy.", features: ["Egg preservation routing", "Hormonal consults", "Family planning advice"], icon: Dna, gradientClass: "from-pink-500/5 to-purple-500/5 text-pink-600 border-pink-100/60" },
  { title: "Physical Rehabilitation", desc: "Restoring physical upper-body range of motion and checking for postoperative muscular stiffness.", features: ["Shoulder exercises", "Lymphedema detection", "Posture alignment"], icon: Sparkles, gradientClass: "from-cyan-500/5 to-teal-500/5 text-cyan-600 border-cyan-100/60" },
  { title: "Pain & Symptom Control", desc: "Advanced therapeutic techniques to manage severe nausea, fatigue, neuropathy, and cancer pain.", features: ["Neuropathy remedies", "Advanced pain blocks", "Nausea management"], icon: HeartPulse, gradientClass: "from-red-500/5 to-rose-500/5 text-red-600 border-red-100/60" },
  { title: "Support Groups", desc: "Weekly physical and digital peer circles to share cancer stories, exchange recovery advice, and heal.", features: ["Survivor-led sessions", "Digital chat forums", "Art therapy events"], icon: MessageSquare, gradientClass: "from-violet-500/5 to-fuchsia-500/5 text-violet-600 border-violet-100/60" },
  { title: "Oncology Home Care", desc: "Nurses visiting your residence for PICC line dressing, port flushes, injections, and care management.", features: ["PICC line flushes", "Injection scheduling", "Vitals checks at home"], icon: Home, gradientClass: "from-sky-500/5 to-indigo-500/5 text-sky-600 border-sky-100/60" }
];

const patientResourcesData: PatientResource[] = [
  { title: "Breast Self-Examination Guide", size: "2.4 MB", format: "PDF", desc: "Visual step-by-step instructions on performing monthly self-exams, showing what to feel and watch for." },
  { title: "Breast Cancer Treatment Checklist", size: "1.8 MB", format: "PDF", desc: "A workbook to record consultations, chemotherapy cycles, scan dates, and medication dosage calendars." },
  { title: "Questions to Ask Your Doctor", size: "820 KB", format: "PDF", desc: "A guide detailing critical questions about biopsy reports, surgical margins, and treatment pathways." },
  { title: "Nutrition & Diet Oncology Guide", size: "3.1 MB", format: "PDF", desc: "Easy recipes, nausea-fighting foods, and dietary protocols compiled by specialized oncology dietitians." },
  { title: "Post-Surgical Recovery Handbook", size: "4.2 MB", format: "PDF", desc: "Exercises for shoulder mobility, drain bulb records, and lymphedema prevention steps after surgery." },
  { title: "Mental Wellness & Coping Guide", size: "1.5 MB", format: "PDF", desc: "Mindfulness methods, breathing exercises, and emotional coping pathways for cancer anxiety." },
  { title: "Survivorship Care & Follow-Up Plan", size: "2.0 MB", format: "PDF", desc: "A guide on routine health check schedules, hormonal therapy control, and living healthy after recovery." }
];

const faqsData: FAQItem[] = [
  { question: "How do I choose the right breast cancer specialist?", answer: "A certified breast surgeon or surgical oncologist should be your first consult for a suspicious lump. When diagnosed, they will coordinate with a medical oncologist and a radiation oncologist. It is ideal to choose specialists who work within a multidisciplinary team or host tumor boards, ensuring all angles of your biology are discussed collectively." },
  { question: "When should I see a medical oncologist?", answer: "You should see a medical oncologist immediately after receiving a tissue biopsy report confirming cancer cells. They will assess hormone receptor parameters (ER, PR, HER2 status) and design any necessary systemic therapies, such as pre-surgery (neoadjuvant) chemotherapy to shrink tumors, or post-surgery (adjuvant) chemotherapy." },
  { question: "What is the role of a breast surgeon?", answer: "A breast surgeon specializes specifically in breast physiology, conservative breast surgeries (lumpectomies), and breast mastectomies. They remove cancer cell margins, evaluate lymph nodes, and coordinate closely with reconstructive surgeons for form restoration." },
  { question: "Can I get a second opinion?", answer: "Yes. Getting a second opinion is a standard and highly encouraged protocol in oncology. It ensures the staging is accurate and validates the proposed treatment plan. Any reputable specialist will gladly support you sharing your pathology slides and imaging records with another center." },
  { question: "How often should I undergo screening?", answer: "For healthy women of average risk, standard guidelines recommend clinical examinations and mammograms annually starting at age 40. If you have a family history of breast cancer (BRCA gene mutations), screening should begin earlier (often at age 25 or 30) using alternate diagnostic methods like breast MRIs." },
  { question: "What support services are available?", answer: "Our network connects you with free patient navigation services, government funding subsidies, emotional counseling, home nursing support (port flushes), post-operative physiotherapy, and weekly survivor-led support groups to guide you through recovery." }
];

export default function CareProvidersPage() {
  // ----------------------------------------------------------------------
  // State variables
  // ----------------------------------------------------------------------
  const [doctorArticles, setDoctorArticles] = useState<any[]>([]);
  const [articlesLoading, setArticlesLoading] = useState<boolean>(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadApprovedArticles() {
      try {
        setArticlesLoading(true);
        const data = await getPublicApprovedArticlesAction();
        if (isMounted) {
          setDoctorArticles(data || []);
          setArticlesError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setArticlesError("Unable to load doctor articles at this time.");
        }
      } finally {
        if (isMounted) {
          setArticlesLoading(false);
        }
      }
    }
    loadApprovedArticles();
    return () => { isMounted = false; };
  }, []);

  const [careProviders, setCareProviders] = useState<CareService[]>([]);
  const [providersLoading, setProvidersLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadProviders() {
      try {
        setProvidersLoading(true);
        const res = await getPublicCareProviders();
        if (isMounted && res.success) {
          setCareProviders(res.data || []);
        }
      } catch (err) {
        console.error("Providers load error", err);
      } finally {
        if (isMounted) setProvidersLoading(false);
      }
    }
    loadProviders();
    return () => { isMounted = false; };
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const [selectedSpecialist, setSelectedSpecialist] = useState<string>("breast-surgeon");
  const [activeJourneyStep, setActiveJourneyStep] = useState<number>(0);
  const [detailsModal, setDetailsModal] = useState<CareService | null>(null);

  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const [helpRequestOpen, setHelpRequestOpen] = useState(false);
  const [helpName, setHelpName] = useState("");
  const [helpPhone, setHelpPhone] = useState("");
  const [helpMessage, setHelpMessage] = useState("");
  const [helpSuccess, setHelpSuccess] = useState(false);
  const [helpLoading, setHelpLoading] = useState(false);

  const [downloadingResource, setDownloadingResource] = useState<string | null>(null);
  const [downloadedResources, setDownloadedResources] = useState<Record<string, boolean>>({});

  // ----------------------------------------------------------------------
  // Helpers / Handlers
  // ----------------------------------------------------------------------
  const handleDownload = (title: string) => {
    setDownloadingResource(title);
    setTimeout(() => {
      setDownloadingResource(null);
      setDownloadedResources(prev => ({ ...prev, [title]: true }));
      setTimeout(() => {
        setDownloadedResources(prev => ({ ...prev, [title]: false }));
      }, 3000);
    }, 1500);
  };

  const handleHelpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpName || !helpPhone) {
      alert("Please fill in your name and phone number.");
      return;
    }
    setHelpLoading(true);
    setTimeout(() => {
      setHelpLoading(false);
      setHelpSuccess(true);
    }, 1200);
  };

  const resetHelpForm = () => {
    setHelpRequestOpen(false);
    setHelpName("");
    setHelpPhone("");
    setHelpMessage("");
    setHelpSuccess(false);
  };

  const filteredServices = careProviders.filter(service => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;

    const matchesCity =
      selectedCity === "all" || service.city.toLowerCase() === selectedCity.toLowerCase();

    return matchesSearch && matchesCategory && matchesCity;
  });

  const categories = [
    { value: "all", label: "All Services" },
    { value: "hospitals", label: "Hospitals & Cancer Centers" },
    { value: "diagnostics", label: "Mammography & Diagnostics" },
    { value: "clinics", label: "Screening Clinics" },
    { value: "chemotherapy", label: "Chemotherapy Centers" },
    { value: "radiation", label: "Radiation Centers" },
    { value: "genetics", label: "Genetic Testing" },
    { value: "rehab", label: "Rehabilitation" },
    { value: "homecare", label: "Home Health Care" },
    { value: "counseling", label: "Mental Health Support" },
    { value: "palliative", label: "Palliative Care" }
  ];

  const cities = ["All", "Mumbai", "New Delhi", "Gurugram", "Noida", "Bangalore", "Chennai", "Hyderabad", "Kolkata"];

  const currentSpecialist = specialistsData.find(s => s.id === selectedSpecialist) || specialistsData[0];

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex-1 w-full bg-white text-slate-800 font-sans selection:bg-pink-100 selection:text-pink-700 overflow-x-hidden relative">

      {/* Decorative background blur blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse duration-[8000ms]" />
      <div className="absolute top-1/3 left-5 w-80 h-80 bg-rose-50/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-5 w-96 h-96 bg-pink-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-b from-rose-50/50 via-white to-white py-16 md:py-24 overflow-hidden border-b border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
          <div className="space-y-6 text-center">

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100/60 border border-pink-200/50 text-pink-700 text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <Ribbon className="h-3.5 w-3.5 text-primary animate-pulse" />
              Trusted Care Network
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-800 leading-[1.1]"
            >
              Find the Right Care, <br />
              <span className="bg-gradient-to-r from-primary via-rose-500 to-pink-600 bg-clip-text text-transparent">
                Every Step of Your Journey.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto font-medium"
            >
              Connect with trusted healthcare providers, breast oncology specialists, diagnostic screening centers, and support networks dedicated to breast cancer recovery and survival.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="pt-4 flex flex-wrap justify-center gap-4"
            >
              <Button
                onClick={() => scrollToId("care-services-directory")}
                className="bg-primary hover:bg-primary/95 text-white font-bold rounded-full shadow-md shadow-pink-100 hover:shadow-lg hover:shadow-pink-200/50 px-8 py-6 active:scale-95 transition-all text-sm tracking-wide cursor-pointer"
              >
                Find a Care Provider
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollToId("support-services-section")}
                className="border-pink-200 text-primary hover:bg-pink-50/60 font-bold rounded-full px-8 py-6 active:scale-95 transition-all text-sm tracking-wide cursor-pointer"
              >
                Get Support
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== 2. WHY CHOICE MATTERS ==================== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              Why Choice Matters
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 leading-tight tracking-tight">
              Coordinated Care Improves Survival Outcomes
            </h2>

            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Breast cancer treatment is highly specialized. A coordinated, multidisciplinary medical team ensures custom chemotherapy, precise radiation, and surgical accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div whileHover={{ y: -5 }} className="p-6 rounded-3xl bg-gradient-to-br from-pink-500/5 to-rose-500/5 border border-pink-100/60 shadow-sm flex flex-col justify-between">
                <div className="h-12 w-12 rounded-2xl bg-white border border-pink-100/60 flex items-center justify-center shadow-sm">
                  <Activity className="h-6 w-6 text-pink-600" />
                </div>
                <div className="mt-8">
                  <h4 className="text-4xl font-black text-slate-800 tracking-tight">90%+</h4>
                  <p className="text-xs font-bold text-pink-600 uppercase tracking-widest mt-1">Survival Rate</p>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed font-medium">With early stage clinical diagnostics and local screenings.</p>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border border-purple-100/60 shadow-sm flex flex-col justify-between">
                <div className="h-12 w-12 rounded-2xl bg-white border border-purple-100/60 flex items-center justify-center shadow-sm">
                  <Users2 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="mt-8">
                  <h4 className="text-4xl font-black text-slate-800 tracking-tight">30%</h4>
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mt-1">Better Outcome</p>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed font-medium">Observed in patients treated under formal multidisciplinary tumor boards.</p>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/5 to-sky-500/5 border border-blue-100/60 shadow-sm flex flex-col justify-between">
                <div className="h-12 w-12 rounded-2xl bg-white border border-blue-100/60 flex items-center justify-center shadow-sm">
                  <HeartHandshake className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-8">
                  <h4 className="text-4xl font-black text-slate-800 tracking-tight">24/7</h4>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Patient Support</p>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed font-medium">Continuous navigation mapping support from diagnosis to survivorship.</p>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="p-6 rounded-3xl bg-gradient-to-br from-cyan-500/5 to-teal-500/5 border border-cyan-100/60 shadow-sm flex flex-col justify-between">
                <div className="h-12 w-12 rounded-2xl bg-white border border-cyan-100/60 flex items-center justify-center shadow-sm">
                  <ShieldAlert className="h-6 w-6 text-cyan-600" />
                </div>
                <div className="mt-8">
                  <h4 className="text-4xl font-black text-slate-800 tracking-tight">Zero</h4>
                  <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mt-1">Stigma Care</p>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed font-medium">Compassionate mental counseling focusing strictly on patient comfort.</p>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                A Unified Front Against Breast Cancer
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-medium">
                Fighting cancer requires more than just a single physician. It calls for an integrated alliance of medical, surgical, and supportive care providers. In modern breast oncology, the key to successful treatment lies in the custom synergy of these specialists.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  { title: "Early Diagnosis and Accurate Staging", desc: "Mammography screening clinics and pathologists work together to recognize cancerous anomalies before they advance." },
                  { title: "Subtle Surgical & Reconstructive Work", desc: "Breast surgeons remove cancer cell margins, while reconstructive surgeons restore alignment, physical form, and self-confidence." },
                  { title: "Holistic Counseling and Rehabilitation", desc: "Mental health therapists and lymphedema physiotherapists help restore functional mobility and clear internal emotional strain." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                    <div className="h-6 w-6 rounded-full bg-pink-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm font-heading">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. MULTIDISCIPLINARY CARE TEAM ==================== */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-rose-50/30 border-t border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider border border-purple-100/60">
              <Users2 className="h-3.5 w-3.5" />
              The Care Specialist Team
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Meet Your Multidisciplinary Care Team
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Click on any specialist category below to understand their dedicated responsibilities in your therapeutic journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-4 lg:pb-0 scrollbar-none max-h-[500px] lg:overflow-y-auto pr-0 lg:pr-3">
              {specialistsData.map((spec) => {
                const SpecIcon = spec.icon;
                const isSelected = selectedSpecialist === spec.id;
                return (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedSpecialist(spec.id)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl border text-left cursor-pointer transition-all shrink-0 select-none ${isSelected
                      ? "bg-pink-50/40 border-primary/50 shadow-sm scale-[1.02]"
                      : "bg-white border-slate-100 hover:border-pink-200/50 hover:bg-pink-50/10 text-slate-650"
                      }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? "bg-pink-100 text-pink-600" : "bg-slate-50 text-slate-400"}`}>
                      <SpecIcon className="h-5 w-5" />
                    </div>
                    <span className={`text-sm font-bold tracking-tight whitespace-nowrap font-heading ${isSelected ? "text-primary" : "text-slate-700"}`}>{spec.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7 h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedSpecialist}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-8 border border-pink-100/60 shadow-sm relative overflow-hidden"
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-100/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                    <div className={`p-4 rounded-2xl ${currentSpecialist.colorClass} border shrink-0`}>
                      {React.createElement(currentSpecialist.icon, { className: "h-8 w-8" })}
                    </div>
                    <div>
                      <h3 className="font-heading text-2xl font-black text-slate-800">{currentSpecialist.name}</h3>
                      <span className="text-xs font-bold text-pink-600 uppercase tracking-widest font-heading">Core Care Unit</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-heading">Specialty Focus</h4>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium">{currentSpecialist.desc}</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 font-heading">Key Responsibilities</h4>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">{currentSpecialist.role}</p>
                    </div>

                    <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                      <Info className="h-4 w-4 text-pink-500 shrink-0" />
                      Our partner clinics map direct consultations with certified specialists.
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. MEET OUR EXPERT TEAM (GALLERY) ==================== */}
      <section id="expert-team-gallery" className="py-20 md:py-28 bg-white border-t border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold uppercase tracking-wider">
              <Users2 className="h-3.5 w-3.5" />
              Our Team
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Meet Our Expert Team
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Dedicated specialists committed to your care – from diagnosis to recovery and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GALLERY_ITEMS.map((person, idx) => {
              const hasImage = Boolean(person.img) && !failedImages.has(idx);

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-slate-50 border border-pink-100/60 hover:border-pink-200"
                >
                  <div className="aspect-[4/5] w-full overflow-hidden bg-slate-100 relative">
                    {hasImage ? (
                      <img
                        src={person.img}
                        alt={person.name}
                        onError={() => {
                          setFailedImages(prev => {
                            const next = new Set(prev);
                            next.add(idx);
                            return next;
                          });
                        }}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 flex items-center justify-center">
                        <div className="h-24 w-24 rounded-full bg-white/80 border-2 border-pink-200 flex items-center justify-center shadow-sm">
                          <User className="h-12 w-12 text-pink-500" strokeWidth={1.8} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-[2px]">
                    <h4 className="text-white font-heading text-base font-bold leading-tight text-center">
                      {person.name}
                    </h4>
                  </div>

                  <div className="absolute inset-0 bg-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 5. CARE SERVICES DIRECTORY ==================== */}
      <section id="care-services-directory" className="py-20 md:py-28 bg-gradient-to-b from-white to-rose-50/30 border-t border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold uppercase tracking-wider">
              <Search className="h-3.5 w-3.5" />
              Provider Search
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Verified Breast Cancer Care Directory
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Find hospitals, diagnostics labs, home care nursing services, and mental health counseling support near you. Filter by category or search by city.
            </p>
          </div>

          <div className="mb-8 p-4 rounded-2xl bg-amber-50/50 border border-amber-100/60 flex gap-3 items-start max-w-3xl mx-auto">
            <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
              <strong>Informational Directory Only:</strong> This directory is provided purely for awareness and educational purposes. We do not facilitate bookings or appointments. Please contact the respective provider directly using the phone or email details listed.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-pink-100/60 shadow-sm mb-12 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 relative">
                <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by center name, city, or specialization (e.g. Apex, Delhi)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-white border-slate-200 h-13 rounded-2xl focus-visible:ring-pink-500"
                />
              </div>

              <div className="md:col-span-4 relative">
                <MapPin className="absolute left-4.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full h-13 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-pink-500 transition-colors text-sm font-medium text-slate-700 cursor-pointer appearance-none"
                >
                  <option value="all">All Cities</option>
                  {cities.filter(c => c !== "All").map(city => (
                    <option key={city} value={city.toLowerCase()}>{city}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="border-t border-pink-100/40 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3 font-heading">Filter by Category</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer select-none ${selectedCategory === cat.value
                      ? "bg-primary border-primary text-white shadow-sm"
                      : "bg-white border-slate-100 hover:border-pink-200/50 hover:bg-pink-50/10 text-slate-650"
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providersLoading ? (
              <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 border border-pink-100/40 animate-pulse space-y-4">
                    <div className="h-4 w-20 bg-slate-200 rounded" />
                    <div className="h-6 w-3/4 bg-slate-200 rounded" />
                    <div className="h-12 w-full bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : careProviders.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-gradient-to-br from-pink-50/50 to-white rounded-3xl border-2 border-dashed border-pink-200/60 space-y-3 p-8">
                <Building2 className="h-12 w-12 text-pink-400 mx-auto mb-2" />
                <h3 className="font-heading text-xl font-extrabold text-slate-800">Directory Coming Soon</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
                  We are building a verified list of breast cancer care centers across India. Real hospitals, diagnostics, and support services will appear here soon.
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <motion.div
                      key={service.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="group bg-white hover:bg-pink-50/10 rounded-3xl p-6 border border-pink-100/60 shadow-sm hover:shadow-md hover:border-pink-200 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 rounded-full bg-slate-100/50 text-slate-600 text-[10px] font-bold uppercase tracking-wider group-hover:bg-pink-100/60 group-hover:text-pink-700 border border-transparent font-heading">
                            {service.category.toUpperCase()}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold text-slate-800">{service.rating}</span>
                            <span className="text-[10px] text-slate-400 font-medium">({service.reviews})</span>
                          </div>
                        </div>

                        <h4 className="font-heading text-lg font-extrabold text-slate-800 group-hover:text-pink-600 transition-colors leading-snug line-clamp-2">
                          {service.name}
                        </h4>
                        <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5 font-sans">
                          <Stethoscope className="h-3.5 w-3.5 text-pink-500 shrink-0" />
                          {service.specialization}
                        </p>

                        <div className="space-y-2 mt-4 pt-4 border-t border-pink-100/40 text-xs text-slate-500 font-medium">
                          <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                            <span className="line-clamp-1">{service.city} &bull; {service.address}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                            <span>{service.phone}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                            <span className="line-clamp-1">{service.email}</span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-pink-100/40">
                        <Button
                          variant="outline"
                          onClick={() => setDetailsModal(service)}
                          className="w-full rounded-xl border-pink-200 text-primary hover:bg-pink-50/60 font-semibold cursor-pointer h-10"
                        >
                          <Info className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-slate-300 mx-auto" />
                    <h3 className="font-heading text-lg font-bold text-slate-700">No Providers Found</h3>
                    <p className="text-slate-400 text-sm max-w-md mx-auto font-medium">
                      We couldn&apos;t find any clinics or diagnostic centers matching &ldquo;{searchQuery}&rdquo;. Try widening your filters or selecting &apos;All Cities&apos;.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setSelectedCity("all");
                      }}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>

      {/* ==================== 6. TREATMENT JOURNEY TIMELINE ==================== */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-900 to-purple-950 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider border border-pink-500/20">
              <Activity className="h-3.5 w-3.5" />
              Patient Path Roadmap
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Breast Cancer Treatment Journey
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-medium">
              Every patient&apos;s timeline is unique, but cancer staging and execution generally follow these 11 milestones. Select a step to read details.
            </p>
          </div>

          <div className="relative mb-10 pb-4 overflow-x-auto scrollbar-none">
            <div className="hidden md:block absolute top-7 left-8 right-8 h-1 bg-white/10 z-0" />

            <div className="flex md:justify-between items-center min-w-[1000px] md:min-w-0 relative z-10 px-4">
              {journeyStepsData.map((stepItem, idx) => {
                const StepIcon = stepItem.icon;
                const isSelected = activeJourneyStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveJourneyStep(idx)}
                    className="flex flex-col items-center gap-2 focus:outline-none cursor-pointer shrink-0"
                  >
                    <div
                      className={`h-14 w-14 rounded-full border-3 flex items-center justify-center transition-all duration-300 ${isSelected
                        ? "bg-pink-600 border-pink-400 scale-110 shadow-lg shadow-pink-600/30 text-white"
                        : "bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-400"
                        }`}
                    >
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <span className={`text-[10px] font-bold tracking-wider uppercase ${isSelected ? "text-pink-400" : "text-slate-500"} font-heading`}>
                      Step {stepItem.step}
                    </span>
                    <span className={`text-xs font-bold text-center max-w-[90px] truncate ${isSelected ? "text-white" : "text-slate-400"} font-heading`}>
                      {stepItem.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeJourneyStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 text-pink-500/10 font-black text-8xl md:text-9xl pointer-events-none select-none">
                {journeyStepsData[activeJourneyStep].step}
              </div>

              <div className="flex items-center gap-3.5 mb-6">
                <div className="p-3 rounded-2xl bg-pink-500/20 border border-pink-500/30 text-pink-400">
                  {React.createElement(journeyStepsData[activeJourneyStep].icon, { className: "h-7 w-7" })}
                </div>
                <div>
                  <span className="text-pink-400 text-xs font-bold uppercase tracking-widest font-heading">Journey Milestone</span>
                  <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">{journeyStepsData[activeJourneyStep].title}</h3>
                </div>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl font-medium">
                {journeyStepsData[activeJourneyStep].desc}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 border-t border-white/10 pt-6">
                <span className="text-xs text-slate-400 font-medium">Want to know what care providers offer this phase?</span>
                <Button
                  size="sm"
                  onClick={() => {
                    const lookup: Record<number, string> = {
                      0: "clinics", 1: "diagnostics", 2: "clinics", 3: "diagnostics",
                      4: "hospitals", 5: "hospitals", 6: "chemotherapy", 7: "radiation",
                      8: "hospitals", 9: "rehab", 10: "palliative"
                    };
                    setSelectedCategory(lookup[activeJourneyStep] || "all");
                    scrollToId("care-services-directory");
                  }}
                  className="bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
                >
                  Search Related Providers
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ==================== 7. SUPPORT SERVICES ==================== */}
      <section id="support-services-section" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold uppercase tracking-wider">
              <HeartHandshake className="h-3.5 w-3.5" />
              Integrated Support
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Compassionate Patient Support Services
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              We extend medical treatments by connecting you to specialized clinical counselors, oncology dietitians, survivor peer circles, and financial aid systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportServicesData.map((support, idx) => {
              const SupportIcon = support.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`p-6 rounded-3xl border bg-gradient-to-br ${support.gradientClass} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
                >
                  <div className="space-y-4">
                    <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center shadow-sm border border-pink-100/40">
                      <SupportIcon className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <h4 className="font-heading text-base font-extrabold text-slate-800 leading-tight">{support.title}</h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">{support.desc}</p>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-1.5 border-t border-pink-100/40 pt-4 text-[11px] text-slate-500 font-medium font-sans">
                    {support.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 8. DOCTOR ARTICLES & RESOURCES ==================== */}
      <section id="doctor-articles-section" className="py-20 md:py-28 bg-gradient-to-b from-white to-rose-50/30 border-y border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold uppercase tracking-wider">
              <FileText className="h-3.5 w-3.5 text-pink-600" />
              Verified Expert Advice
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Doctor Articles &amp; Resources
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Explore trusted articles and educational resources shared by verified healthcare professionals to help you make informed decisions about breast cancer care.
            </p>
          </div>

          {articlesLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-pink-100/40 shadow-sm animate-pulse space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-20 bg-slate-200 rounded" />
                    <div className="h-3 w-16 bg-slate-100 rounded" />
                  </div>
                  <div className="h-6 w-3/4 bg-slate-200 rounded" />
                  <div className="h-12 w-full bg-slate-100 rounded" />
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                    <div className="h-9 w-9 bg-slate-200 rounded-full" />
                    <div className="space-y-1 flex-1">
                      <div className="h-3 w-24 bg-slate-200 rounded" />
                      <div className="h-2.5 w-16 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="h-10 w-full bg-slate-200 rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {!articlesLoading && articlesError && (
            <div className="bg-white rounded-3xl p-8 border border-red-100/60 text-center space-y-3 max-w-md mx-auto shadow-sm">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
              <h3 className="font-heading text-base font-bold text-slate-800">Notice</h3>
              <p className="text-xs text-slate-500 font-medium">{articlesError}</p>
            </div>
          )}

          {!articlesLoading && !articlesError && doctorArticles.length === 0 && (
            <div className="bg-white rounded-3xl p-12 border border-pink-100/60 text-center space-y-4 max-w-xl mx-auto shadow-sm">
              <div className="h-16 w-16 rounded-full bg-pink-50/60 border border-pink-100/40 text-pink-600 flex items-center justify-center mx-auto">
                <Stethoscope className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-extrabold text-slate-800">
                No doctor articles are available yet.
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                New educational resources from our registered healthcare professionals will appear here once reviewed and approved by our medical administration team.
              </p>
            </div>
          )}

          {!articlesLoading && !articlesError && doctorArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctorArticles.map((art) => (
                <div
                  key={art.id}
                  className="bg-white rounded-3xl p-6 border border-pink-100/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group relative"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-pink-50/60 text-pink-700 text-[10px] font-bold uppercase tracking-wider font-heading border border-pink-100/40">
                        {art.fileUrl ? <FileText className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                        {art.fileUrl ? "PDF ARTICLE" : "DOCTOR ARTICLE"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold font-sans">{art.publishDate}</span>
                    </div>

                    <h4 className="font-heading text-lg font-extrabold text-slate-800 leading-snug group-hover:text-pink-600 transition-colors line-clamp-2">
                      {art.title}
                    </h4>

                    <p className="text-slate-500 text-xs leading-relaxed font-medium line-clamp-3">
                      {art.excerpt}
                    </p>

                    <div className="pt-3 border-t border-pink-100/40 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-pink-50/60 text-pink-600 border border-pink-100/40 flex items-center justify-center font-bold text-xs shrink-0 font-heading">
                        <Stethoscope className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-800 truncate font-heading">{art.doctorName}</p>
                        <p className="text-[10px] text-slate-400 font-medium truncate font-sans">{art.doctorSpecialty}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-pink-100/40">
                    {art.fileUrl ? (
                      <a href={art.fileUrl} target="_blank" rel="noreferrer" className="w-full inline-block">
                        <Button className="w-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold text-xs py-3 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all shadow-sm">
                          <Download className="h-4 w-4 shrink-0" />
                          Download Doctor Article
                        </Button>
                      </a>
                    ) : (
                      <Button
                        onClick={() => alert(`Title: ${art.title}\nAuthor: ${art.doctorName} (${art.doctorSpecialty})\n\n${art.content}`)}
                        className="w-full bg-slate-50/60 hover:bg-pink-600 text-slate-700 hover:text-white border border-pink-100/40 text-xs font-bold py-3 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all"
                      >
                        <BookOpen className="h-4 w-4 shrink-0" />
                        Download Doctor Article
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================== 9. FAQ ==================== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="h-3.5 w-3.5" />
              FAQ Help Desk
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Care Provider FAQ
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Find instant answers to major patient queries regarding specialist matching, medical opinions, and tumor diagnostics.
            </p>
          </div>

          <div className="bg-white/80 border border-pink-100/60 rounded-3xl p-5 sm:p-8 shadow-sm space-y-4">
            {faqsData.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0 pt-3 first:pt-0">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center text-left py-2 font-heading font-bold text-sm sm:text-base text-slate-800 hover:text-primary transition-colors cursor-pointer select-none outline-none"
                  >
                    <span>{faq.question}</span>
                    <span className="text-slate-400 shrink-0 ml-4">
                      {isOpen ? (
                        <div className="p-1 rounded-full bg-pink-100 text-pink-600">
                          <X className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="p-1 rounded-full bg-white text-slate-400 border border-slate-200">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      )}
                    </span>
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
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-2.5 pr-6 font-medium border-t border-slate-200/40">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 10. EMERGENCY & HELPLINE ==================== */}
      <section id="emergency-helpline-section" className="py-16 md:py-24 bg-gradient-to-br from-pink-500 to-rose-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[5%] w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                <AlertCircle className="h-3.5 w-3.5 animate-bounce" />
                Emergency Contact
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Need Immediate Care Assistance?
              </h2>
              <p className="text-pink-100 text-sm sm:text-base font-medium leading-relaxed">
                If you are facing immediate postsurgical complications, severe oncology side-effects, or require diagnostic scheduling help, connect with the support desk instantly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <a href="tel:18002031066" className="flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-colors cursor-pointer">
                  <div className="p-3 rounded-xl bg-white/20 text-white shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-pink-100 uppercase tracking-widest font-bold font-heading">Cancer Care Helpline</p>
                    <p className="text-lg font-black text-white tracking-tight font-heading">1800-203-1066</p>
                    <p className="text-[10px] text-pink-100 font-medium">Apollo Cancer Centres • 24×7</p>
                  </div>
                </a>

                <a href="tel:9599687085" className="flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-colors cursor-pointer">
                  <div className="p-3 rounded-xl bg-white/20 text-white shrink-0">
                    <HeartPulse className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-pink-100 uppercase tracking-widest font-bold font-heading">Breast Cancer Helpline</p>
                    <p className="text-lg font-black text-white tracking-tight font-heading">95996 87085</p>
                    <p className="text-[10px] text-pink-100 font-medium">Cancer Mukt Bharat • 24×7</p>
                  </div>
                </a>
              </div>

              <div className="pt-4 border-t border-white/20">
                <p className="text-[11px] text-pink-100 uppercase tracking-widest font-bold font-heading mb-3">Additional Support</p>
                <div className="flex flex-wrap gap-3">
                  <a href="tel:9355520202" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-xs text-white hover:bg-white/20 transition-colors">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-semibold">93555 20202</span>
                    <span className="text-[10px] text-pink-100">• National Cancer</span>
                  </a>
                  <a href="tel:14416" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-xs text-white hover:bg-white/20 transition-colors">
                    <Brain className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-semibold">14416</span>
                    <span className="text-[10px] text-pink-100">• Tele MANAS (Mental Health)</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4">
              <a href="tel:18002031066" className="w-full">
                <Button className="w-full bg-white hover:bg-slate-50 text-primary font-bold rounded-full py-6 px-6 shadow-lg active:scale-95 transition-all text-xs uppercase tracking-wider cursor-pointer">
                  <Phone className="h-4 w-4 mr-2 shrink-0" />
                  Call Helpline Now
                </Button>
              </a>

              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("hospitals");
                  scrollToId("care-services-directory");
                }}
                className="w-full border-white/40 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full py-6 px-6 active:scale-95 transition-all text-xs uppercase tracking-wider cursor-pointer"
              >
                Find Nearest Hospital
              </Button>

              <Button
                onClick={() => setHelpRequestOpen(true)}
                className="w-full bg-white hover:bg-slate-50 text-primary font-bold rounded-full py-6 px-6 shadow-lg active:scale-95 transition-all text-xs uppercase tracking-wider cursor-pointer"
              >
                Request Care Assistance
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MODALS ==================== */}

      {/* 1. Care Provider Details Modal */}
      <AnimatePresence>
        {detailsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailsModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-pink-100/60 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setDetailsModal(null)}
                className="absolute top-5 right-5 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <span className="inline-block px-2.5 py-0.5 rounded bg-pink-50/60 text-pink-700 text-[10px] font-bold uppercase tracking-wider mb-3 font-heading border border-pink-100/40">
                {detailsModal.category.toUpperCase()}
              </span>

              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-800 pr-8 leading-tight">
                {detailsModal.name}
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5 font-sans">
                <Stethoscope className="h-4 w-4 text-pink-500" />
                {detailsModal.specialization}
              </p>

              <div className="mt-6 space-y-4 font-sans">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">About the Provider</h4>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed font-medium">
                    {detailsModal.about}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100/60 flex gap-2 items-start">
                  <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                    This directory is for <strong>informational purposes only</strong>. We do not facilitate bookings or appointments. Please contact the provider directly using the details below.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Operational Hours</h5>
                    <p className="text-slate-700 text-xs font-medium flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {detailsModal.hours}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Address Location</h5>
                    <p className="text-slate-700 text-xs font-medium flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{detailsModal.address}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-heading">Available Facilities</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {detailsModal.facilities.map((fac, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-pink-500/5 text-pink-700 border border-pink-500/10 text-[10px] font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-pink-600" />
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-6 mt-6">
                  <a href={`tel:${detailsModal.phone}`} className="w-full">
                    <Button variant="outline" className="w-full rounded-xl border-pink-200 text-primary hover:bg-pink-50/60 font-bold h-11 cursor-pointer">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Provider
                    </Button>
                  </a>
                  <a href={`mailto:${detailsModal.email}`} className="w-full">
                    <Button variant="outline" className="w-full rounded-xl border-pink-200 text-primary hover:bg-pink-50/60 font-bold h-11 cursor-pointer">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Provider
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Request Assistance Modal */}
      <AnimatePresence>
        {helpRequestOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetHelpForm}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-pink-100/60 shadow-2xl z-10"
            >
              <button
                onClick={resetHelpForm}
                className="absolute top-5 right-5 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {!helpSuccess ? (
                <>
                  <h3 className="font-heading text-xl font-extrabold text-slate-800 leading-tight">
                    Request Care Assistance
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Fill out details, and our patient navigator will contact you to assist with scheduling, funding, or counseling.
                  </p>

                  <form onSubmit={handleHelpSubmit} className="space-y-4 mt-6 font-sans">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Your Name</label>
                      <Input
                        type="text"
                        required
                        placeholder="Enter full name"
                        value={helpName}
                        onChange={(e) => setHelpName(e.target.value)}
                        className="bg-slate-50/50 border-pink-100/60 h-10 rounded-xl focus-visible:ring-pink-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Phone Number</label>
                      <Input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={helpPhone}
                        onChange={(e) => setHelpPhone(e.target.value)}
                        className="bg-slate-50/50 border-pink-100/60 h-10 rounded-xl focus-visible:ring-pink-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Brief Message / Needs</label>
                      <textarea
                        required
                        placeholder="Describe what help you require (e.g. screening camps, diagnostic funding, counseling)"
                        value={helpMessage}
                        onChange={(e) => setHelpMessage(e.target.value)}
                        className="w-full h-20 px-3 py-2 bg-slate-50/50 border border-pink-100/60 rounded-xl outline-none focus:border-pink-500 transition-colors text-xs font-medium text-slate-700 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={helpLoading}
                      className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-11 rounded-xl cursor-pointer mt-2 shadow-md shadow-pink-100 active:scale-95 transition-all"
                    >
                      {helpLoading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Request"
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="h-14 w-14 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="h-7 w-7 animate-pulse" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-800">Request Received</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
                    Thank you, <span className="font-bold">{helpName}</span>. Your request has been queued. Our patient counselor will contact you within 24 hours at <span className="font-bold">{helpPhone}</span> to guide you.
                  </p>
                  <Button
                    onClick={resetHelpForm}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-6 py-2 rounded-xl cursor-pointer mt-4"
                  >
                    Done
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
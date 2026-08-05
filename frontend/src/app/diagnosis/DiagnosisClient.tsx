"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ribbon,
  Stethoscope,
  CheckCircle2,
  Play,
  Pause,
  Maximize,
  Volume2,
  VolumeX,
  ShieldCheck,
  Plus,
  Minus,
  ArrowRight,
  Briefcase,
  Video,
  Clock,
  ExternalLink,
  ChevronRight,
  Download,
  AlertCircle,
  HelpCircle,
  Building,
  Info,
  Globe,
  Loader2
} from "lucide-react";
import { submitCollaborationRequest } from "@/app/actions/diagnosis";

interface FAQItem {
  q: string;
  a: string;
}

interface ArticleItem {
  title: string;
  link: string;
}

interface DiagnosisTechnology {
  id: string;
  name: string;
  category: string;
  shortOverview: string;
  accuracy: string | null;
  purpose: string;
  advantages: string;
  limitations: string;
  recommendedGroup: string;
  imageUrl: string | null;
  introVideoUrl: string | null;
  animationVideoUrl: string | null;
  explainerVideoUrl: string | null;
  workflow: string | null;
  stepByStep: string | null;
  preparation: string | null;
  duration: string | null;
  benefits: string | null;
  risks: string | null;
  whoShouldTake: string | null;
  faqs: any;
  relatedArticles: any;
  brochureUrl: string | null;
  manufacturerName: string;
  manufacturerLogoUrl: string | null;
  manufacturerOverview: string | null;
  manufacturerWebsite: string | null;
  manufacturerCountry: string | null;
  manufacturerSpecialization: string | null;
  collaborationStatus: string | null;
  isActive: boolean;
}

// ----------------------------------------------------------------------------
//  MOCK DATA – replace with real API data if available
// ----------------------------------------------------------------------------
const MOCK_TECHNOLOGIES: DiagnosisTechnology[] = [
  {
    id: "tech-1",
    name: "Digital Mammography (2D)",
    category: "Mammography",
    shortOverview: "Standard low‑dose X‑ray imaging for early detection of microcalcifications and masses.",
    accuracy: "92.3%",
    purpose: "Primary screening tool for asymptomatic women; detects abnormalities years before palpation.",
    advantages: "Fast, cost‑effective, widely available, and the most validated screening method.",
    limitations: "May be less sensitive in dense breast tissue; requires compression.",
    recommendedGroup: "Women aged 40+ annually; earlier if family history.",
    imageUrl: "/images/mammography_screening.png",
    introVideoUrl: "/videoplayback.mp4",
    animationVideoUrl: null,
    explainerVideoUrl: null,
    workflow: "Patient stands in front of the machine; breast is compressed between two plates; two views per breast are taken.",
    stepByStep: "1. Patient changes into gown.\n2. Technician positions breast on imaging plate.\n3. Compression applied for a few seconds.\n4. Image captured; repeated for other view and breast.",
    preparation: "Avoid deodorant, powder, or lotion on day of exam. Wear a two‑piece outfit.",
    duration: "~15 minutes",
    benefits: "High sensitivity for calcifications; quick results; low radiation dose.",
    risks: "Mild discomfort; false positives/negatives.",
    whoShouldTake: "All women over 40; earlier if high‑risk (BRCA, strong family history).",
    faqs: JSON.stringify([
      { q: "Is mammography painful?", a: "Some women find the compression uncomfortable, but it only lasts a few seconds." },
      { q: "How often should I get a mammogram?", a: "Annually from age 40; consult your doctor for personalized schedule." }
    ]),
    relatedArticles: JSON.stringify([
      { title: "ACR Mammography Guidelines", link: "https://www.acr.org/Clinical-Resources/Mammography" }
    ]),
    brochureUrl: null,
    manufacturerName: "Hologic",
    manufacturerLogoUrl: null,
    manufacturerOverview: "Global leader in women's health, providing innovative mammography systems.",
    manufacturerWebsite: "https://www.hologic.com",
    manufacturerCountry: "USA",
    manufacturerSpecialization: "Breast imaging & diagnostics",
    collaborationStatus: "Active",
    isActive: true
  },
  {
    id: "tech-2",
    name: "Digital 3D Mammography (DBT)",
    category: "3D Mammography",
    shortOverview: "Advanced three‑dimensional breast imaging providing higher accuracy for dense tissue.",
    accuracy: "96.4%",
    purpose: "Improves cancer detection, especially in dense breasts, by reducing overlapping tissue.",
    advantages: "Higher sensitivity; fewer call‑backs; better specificity.",
    limitations: "Slightly higher radiation dose than 2D; more expensive.",
    recommendedGroup: "Women with dense breast tissue; those at elevated risk.",
    imageUrl: "/images/mammography_screening.png",
    introVideoUrl: "/Breast Cancer_ What is it, Symptoms, Causes, Treatment _ Mass General Brigham.mp4",
    animationVideoUrl: null,
    explainerVideoUrl: null,
    workflow: "Similar to 2D but the X‑ray tube moves in an arc, capturing multiple images from different angles.",
    stepByStep: "1. Same preparation as 2D.\n2. Breast is compressed once.\n3. Machine sweeps over the breast, taking multiple low‑dose exposures.\n4. Images are reconstructed into 3D slices.",
    preparation: "Same as 2D mammography.",
    duration: "~15‑20 minutes",
    benefits: "Detects cancers earlier; reduces false positives; especially valuable for dense tissue.",
    risks: "Slightly higher radiation; may still miss subtle lesions.",
    whoShouldTake: "Recommended for women with dense breasts or those who have had prior call‑backs.",
    faqs: JSON.stringify([
      { q: "Is 3D mammography better than 2D?", a: "It has been shown to detect more cancers and reduce false alarms." },
      { q: "Is the radiation higher?", a: "It is slightly higher than 2D but still within safe limits." }
    ]),
    relatedArticles: JSON.stringify([
      { title: "Tomosynthesis Benefits", link: "https://www.breastcancer.org/screening/tomosynthesis" }
    ]),
    brochureUrl: null,
    manufacturerName: "Hologic",
    manufacturerLogoUrl: null,
    manufacturerOverview: "Pioneer of 3D mammography technology with Genius 3D Mammography™.",
    manufacturerWebsite: "https://www.hologic.com",
    manufacturerCountry: "USA",
    manufacturerSpecialization: "Breast imaging & diagnostics",
    collaborationStatus: "Active",
    isActive: true
  },
  {
    id: "tech-3",
    name: "Breast Ultrasound (Sonography)",
    category: "Ultrasound",
    shortOverview: "Uses high‑frequency sound waves to produce real‑time images; radiation‑free.",
    accuracy: "89.7%",
    purpose: "Differentiates fluid‑filled cysts from solid masses; often used as follow‑up.",
    advantages: "No radiation; good for dense breasts; can guide biopsies.",
    limitations: "Operator‑dependent; may miss small calcifications.",
    recommendedGroup: "Younger women (under 40) with palpable lumps; dense breasts.",
    imageUrl: "/images/abus_system.png",
    introVideoUrl: "/cancer video.webm",
    animationVideoUrl: null,
    explainerVideoUrl: null,
    workflow: "A handheld transducer is moved over the breast after applying a gel; images are viewed in real‑time.",
    stepByStep: "1. Patient lies on back with arm above head.\n2. Gel applied to breast.\n3. Transducer moved in systematic pattern.\n4. Images captured and recorded.",
    preparation: "No special preparation needed.",
    duration: "~15‑30 minutes",
    benefits: "Non‑invasive; painless; can guide needle biopsies.",
    risks: "No known risks.",
    whoShouldTake: "Used as a diagnostic tool for suspicious findings on mammogram or physical exam.",
    faqs: JSON.stringify([
      { q: "Is ultrasound painful?", a: "No, it is painless and uses no radiation." },
      { q: "Can ultrasound replace mammography?", a: "No, it is complementary, not a replacement." }
    ]),
    relatedArticles: JSON.stringify([
      { title: "Breast Ultrasound Basics", link: "https://www.radiologyinfo.org/en/info/breastus" }
    ]),
    brochureUrl: null,
    manufacturerName: "GE Healthcare",
    manufacturerLogoUrl: null,
    manufacturerOverview: "Leading provider of ultrasound systems for radiology and obstetrics.",
    manufacturerWebsite: "https://www.gehealthcare.com",
    manufacturerCountry: "USA",
    manufacturerSpecialization: "Medical imaging and diagnostics",
    collaborationStatus: "Active",
    isActive: true
  },
  {
    id: "tech-4",
    name: "Breast MRI (Magnetic Resonance)",
    category: "Breast MRI",
    shortOverview: "Highly sensitive soft‑tissue imaging using magnetic fields; no ionizing radiation.",
    accuracy: "95.2%",
    purpose: "Staging known cancers, evaluating extent of disease, screening high‑risk patients.",
    advantages: "Excellent soft‑tissue contrast; can detect contralateral cancers.",
    limitations: "Expensive; requires IV contrast; false‑positive rate.",
    recommendedGroup: "High‑risk women (BRCA carriers, strong family history); implant evaluation.",
    imageUrl: "/images/breast_mri.png",
    introVideoUrl: "/euhbbZb3sNXxgOi6g2MF+42G6uUncFHU.mp4",
    animationVideoUrl: null,
    explainerVideoUrl: null,
    workflow: "Patient lies prone in the MRI scanner; contrast dye injected; multiple sequences acquired.",
    stepByStep: "1. Patient changes into gown; removes metal.\n2. Prone position on MRI table.\n3. IV placed for contrast.\n4. Machine takes images before and after contrast.",
    preparation: "Avoid caffeine; inform about kidney function; remove all metal.",
    duration: "~30‑45 minutes",
    benefits: "Very sensitive for invasive cancers; useful for evaluating response to neoadjuvant therapy.",
    risks: "Claustrophobia; allergic reaction to contrast; false positives.",
    whoShouldTake: "High‑risk screening; pre‑surgical planning; problematic mammograms.",
    faqs: JSON.stringify([
      { q: "Is MRI better than mammography?", a: "It is more sensitive but not used for routine screening due to cost and false positives." },
      { q: "Can I have an MRI if I have metal implants?", a: "Only non‑ferromagnetic implants are safe; check with radiology." }
    ]),
    relatedArticles: JSON.stringify([
      { title: "Breast MRI Guidelines", link: "https://www.cancer.gov/types/breast/mri-fact-sheet" }
    ]),
    brochureUrl: null,
    manufacturerName: "Siemens Healthineers",
    manufacturerLogoUrl: null,
    manufacturerOverview: "Global leader in advanced MRI systems for precision medicine.",
    manufacturerWebsite: "https://www.siemens-healthineers.com",
    manufacturerCountry: "Germany",
    manufacturerSpecialization: "MRI and diagnostic imaging",
    collaborationStatus: "Active",
    isActive: true
  },
  {
    id: "tech-5",
    name: "AI‑Powered Mammography Analysis",
    category: "AI Screenings",
    shortOverview: "Artificial intelligence algorithms assist radiologists by flagging suspicious regions.",
    accuracy: "97.1% (CADe)",
    purpose: "Reduce missed cancers and decrease reading time.",
    advantages: "Can detect subtle patterns; reduces human error.",
    limitations: "Requires large training datasets; may have biases.",
    recommendedGroup: "Supplemental to radiologist interpretation in all screening programs.",
    imageUrl: "/images/mammography_screening.png",
    introVideoUrl: "/fCJDcVOcf4mwHu6auQwh+9LaEZi9UTik.mp4",
    animationVideoUrl: null,
    explainerVideoUrl: null,
    workflow: "AI software analyzes mammography images and highlights regions of concern for radiologist review.",
    stepByStep: "1. Mammogram acquired digitally.\n2. AI model processes images.\n3. Suspicious areas highlighted on viewer.\n4. Radiologist reviews with AI overlay.",
    preparation: "Same as standard mammography.",
    duration: "Processing in seconds; total time unchanged.",
    benefits: "Improves detection rates; reduces recall rates.",
    risks: "Over‑reliance on AI; false positives.",
    whoShouldTake: "All women undergoing mammography; especially in high‑volume centers.",
    faqs: JSON.stringify([
      { q: "Does AI replace the radiologist?", a: "No, it acts as a second reader to aid decision‑making." },
      { q: "Is AI accurate for all breast types?", a: "Performance can vary; ongoing improvements." }
    ]),
    relatedArticles: JSON.stringify([
      { title: "AI in Breast Imaging", link: "https://www.rsna.org/ai" }
    ]),
    brochureUrl: null,
    manufacturerName: "Google Health",
    manufacturerLogoUrl: null,
    manufacturerOverview: "Developing AI tools for breast cancer screening with high performance.",
    manufacturerWebsite: "https://health.google",
    manufacturerCountry: "USA",
    manufacturerSpecialization: "Healthcare AI & imaging",
    collaborationStatus: "Active",
    isActive: true
  },
  {
    id: "tech-6",
    name: "Contrast‑Enhanced Mammography (CEM)",
    category: "Other Scans",
    shortOverview: "Combines mammography with contrast agent to highlight tumor vascularity.",
    accuracy: "93.8%",
    purpose: "Assess extent of disease and evaluate response to therapy.",
    advantages: "Lower cost than MRI; better availability.",
    limitations: "Radiation exposure (dual‑energy); contrast side effects.",
    recommendedGroup: "Patients with dense breasts or equivocal MRI findings.",
    imageUrl: "/images/mammography_screening.png",
    introVideoUrl: "/cancer3.webm",
    animationVideoUrl: null,
    explainerVideoUrl: null,
    workflow: "Iodinated contrast injected intravenously; dual‑energy images acquired.",
    stepByStep: "1. IV contrast given.\n2. Dual‑energy mammograms taken.\n3. Recombined image shows contrast uptake.",
    preparation: "Check renal function; similar prep to CT contrast.",
    duration: "~20 minutes",
    benefits: "Provides functional information; useful when MRI is unavailable.",
    risks: "Contrast allergy; radiation exposure.",
    whoShouldTake: "Patients needing staging or assessment of residual disease.",
    faqs: JSON.stringify([
      { q: "Is CEM similar to MRI?", a: "It provides comparable sensitivity to MRI but with less time and cost." },
      { q: "Are there side effects?", a: "Rare allergic reactions to contrast; temporary taste changes." }
    ]),
    relatedArticles: JSON.stringify([
      { title: "CEM in Practice", link: "https://www.ajronline.org/doi/full/10.2214/AJR.19.22565" }
    ]),
    brochureUrl: null,
    manufacturerName: "General Electric",
    manufacturerLogoUrl: null,
    manufacturerOverview: "Offers CEM solutions integrated with mammography platforms.",
    manufacturerWebsite: "https://www.gehealthcare.com",
    manufacturerCountry: "USA",
    manufacturerSpecialization: "Breast imaging technologies",
    collaborationStatus: "Active",
    isActive: true
  }
];

const diagnosisMethods = {
  mammography: {
    title: "Mammography (X-Ray Screening)",
    description: "A Mammogram is a specialized, low-dose breast X-ray that creates highly detailed images of internal tissues. It is widely considered the gold standard for early-stage screening, capable of detecting abnormal growths, microcalcifications, or architectural distortions up to two years before they can be physically felt by a hand examination.",
    recom: "Recommended annually for all women aged 40 and above, or earlier for individuals with a known familial history of breast oncology.",
    imageUrl: "/images/mammography_screening.png",
    benefits: [
      "Finds early calcifications & micro-lumps",
      "Most validated early-stage screening tool",
      "Fast, outpatient clinical procedure"
    ]
  },
  ultrasound: {
    title: "Breast Ultrasound (Sonography)",
    description: "Breast Ultrasound utilizes high-frequency sonic waves to generate live, detailed cross-sectional views of breast structure. This modality is extremely effective at distinguishing between solid masses (which require further investigation) and fluid-filled simple cysts (which are typically benign). It is also widely used as a supplementary tool for younger women who have dense breast tissue where mammograms might be less clear.",
    recom: "Typically ordered by clinicians as a diagnostic follow-up to check specific lumps felt during self-exams or highlighted in mammograms.",
    imageUrl: "/images/abus_system.png",
    benefits: [
      "Completely radiation-free technology",
      "Differentiates fluid cysts from solid lumps",
      "Ideal for dense breast profiles"
    ]
  },
  mri: {
    title: "Breast MRI (Magnetic Resonance)",
    description: "Breast Magnetic Resonance Imaging (MRI) employs powerful magnetic fields and radio wave pulses to produce highly comprehensive, three-dimensional diagnostic records of the soft tissues. It provides exceptional contrast, making it crucial for detailed staging of confirmed cases, mapping out exact tumor dimensions before surgical lumpectomy, or checking the integrity of breast implants.",
    recom: "Indicated primarily for high-risk patients with genetic predispositions (BRCA1/BRCA2) or for clinical staging post-biopsy.",
    imageUrl: "/images/breast_mri.png",
    benefits: [
      "Extremely high-sensitivity soft-tissue contrast",
      "Measures exact margins of tumor tissue",
      "Evaluates treatment response post-chemo"
    ]
  },
  biopsy: {
    title: "Breast Biopsy (Pathology Confirmation)",
    description: "A Biopsy is the definitive diagnostic procedure to confirm whether a lump contains malignant or benign cells. During a biopsy, a specialist uses a hollow core needle or fine needle aspiration (often guided by ultrasound or mammogram imaging) to extract minor tissue cylinders. These samples are sent directly to a pathology laboratory where cellular structure is examined under a microscope.",
    recom: "Performed whenever non-invasive imaging scans show highly suspicious structural changes or indeterminate findings.",
    imageUrl: "/images/diagonysis.jpg",
    benefits: [
      "The definitive confirmatory check",
      "Identifies hormone receptors (ER, PR, HER2)",
      "Determines the exact tumor grading"
    ]
  }
};

const diagnosisVideos = [
  {
    title: "Early Screening Guidance by Clinical Experts",
    duration: "8:30",
    description: "Oncologists explain standard diagnostic pathways, clinical screening protocols, mammography frequencies, and answer general early consultation inquiries.",
    src: "/yPVvi64woY74YzOBqwhF+MmgUBXyBdEg.mp4"
  },
  {
    title: "Breast Self-Examination (BSE) Guided Checkup",
    duration: "3:45",
    description: "Detailed medical walkthrough demonstrating correct examination motions, fingers pressure, and inspection zones.",
    src: "/euhbbZb3sNXxgOi6g2MF+42G6uUncFHU.mp4"
  },
  {
    title: "Khushi Tactile Care Kit Instructions",
    duration: "5:12",
    description: "Learn how to use the checkup cards, timeline trackers, and tactile exam aids included in the Khushi Care Kit.",
    src: "/VID-20260715-WA0006.mp4"
  }
];

interface DiagnosisClientProps {
  initialTechnologies: DiagnosisTechnology[];
}

export default function DiagnosisClient({ initialTechnologies }: DiagnosisClientProps) {
  // Use mock data if no initial technologies passed from server
  const [technologies] = useState<DiagnosisTechnology[]>(
    initialTechnologies && initialTechnologies.length > 0 ? initialTechnologies : MOCK_TECHNOLOGIES
  );
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [activeDiagTab, setActiveDiagTab] = useState<string>("mammography");
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const diagVideoRef = useRef<HTMLVideoElement>(null);

  const handleDiagVideoChange = (idx: number) => {
    setActiveVideoIndex(idx);
    if (diagVideoRef.current) {
      diagVideoRef.current.load();
    }
  };

  // Interaction Modals
  const [selectedTech, setSelectedTech] = useState<DiagnosisTechnology | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCollabOpen, setIsCollabOpen] = useState(false);

  // Custom video players state
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [mutedVideoId, setMutedVideoId] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // Collaboration Form state
  const [collabTechName, setCollabTechName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");
  const [collabType, setCollabType] = useState("Equipment Supply");
  const [description, setDescription] = useState("");
  const [brochureUrl, setBrochureUrl] = useState("");
  const [companyProfileUrl, setCompanyProfileUrl] = useState("");
  const [consent, setConsent] = useState(false);

  // Form status helpers
  const [formPending, setFormPending] = useState(false);
  const [formMessage, setFormMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  // Accordion details index
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Filter Categories
  const categories = ["All", "Mammography", "3D Mammography", "Ultrasound", "Breast MRI", "AI Screenings", "Other Scans"];

  const filteredTechnologies = selectedCategory === "All"
    ? technologies
    : technologies.filter(t => t.category === selectedCategory || (selectedCategory === "Other Scans" && !["Mammography", "3D Mammography", "Ultrasound", "Breast MRI", "AI Screenings"].includes(t.category)));

  // Custom Play/Pause Controls
  const togglePlayVideo = (id: string) => {
    const el = videoRefs.current[id];
    if (!el) return;
    if (playingVideoId === id) {
      el.pause();
      setPlayingVideoId(null);
    } else {
      if (playingVideoId && videoRefs.current[playingVideoId]) {
        videoRefs.current[playingVideoId]?.pause();
      }
      el.play();
      setPlayingVideoId(id);
    }
  };

  const toggleMuteVideo = (id: string) => {
    const el = videoRefs.current[id];
    if (!el) return;
    el.muted = !el.muted;
    if (el.muted) {
      setMutedVideoId(id);
    } else {
      setMutedVideoId(null);
    }
  };

  const handleFullscreen = (id: string) => {
    const el = videoRefs.current[id];
    if (el && el.requestFullscreen) {
      el.requestFullscreen();
    }
  };

  // Document Uploads for Collab Request Form
  const handleCollabDocUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "brochure" | "profile") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(type);
    setFormMessage(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        if (type === "brochure") setBrochureUrl(data.url);
        if (type === "profile") setCompanyProfileUrl(data.url);
        setFormMessage({ text: `${file.name} uploaded successfully!`, type: "success" });
      } else {
        setFormMessage({ text: data.error || "Upload failed.", type: "error" });
      }
    } catch {
      setFormMessage({ text: "Error uploading document.", type: "error" });
    } finally {
      setUploadingDoc(null);
    }
  };

  // Submit Collaboration Request
  const handleCollabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setFormMessage({ text: "You must consent to the privacy guidelines.", type: "error" });
      return;
    }
    setFormPending(true);
    setFormMessage(null);
    try {
      const res = await submitCollaborationRequest({
        organizationName: orgName,
        companyName,
        contactPerson,
        designation,
        email,
        phone,
        country,
        website: website || undefined,
        technologyName: collabTechName,
        collaborationType: collabType,
        description,
        brochureUrl: brochureUrl || undefined,
        companyProfileUrl: companyProfileUrl || undefined,
        consent
      });

      if (res.success) {
        setFormMessage({
          text: "Collaboration request submitted successfully! Our administrative panel will review your proposal and contact you via email shortly. Your request status is marked as PENDING.",
          type: "success"
        });
        // Reset fields
        setOrgName("");
        setCompanyName("");
        setContactPerson("");
        setDesignation("");
        setEmail("");
        setPhone("");
        setCountry("");
        setWebsite("");
        setDescription("");
        setBrochureUrl("");
        setCompanyProfileUrl("");
        setConsent(false);
      } else {
        setFormMessage({ text: res.error || "Submission failed. Please try again.", type: "error" });
      }
    } catch (err: any) {
      setFormMessage({ text: err.message || "An unexpected error occurred.", type: "error" });
    } finally {
      setFormPending(false);
    }
  };

  // Open Collaboration Dialog and pre-populate Tech name
  const openCollabDialog = (techName = "") => {
    setCollabTechName(techName);
    setFormMessage(null);
    setIsCollabOpen(true);
  };

  // Learn More details modal opener
  const openDetailsDialog = (tech: DiagnosisTechnology) => {
    setSelectedTech(tech);
    setOpenFaqIndex(null);
    setIsDetailOpen(true);
  };

  return (
    <div className="flex-1 w-full bg-slate-50 text-slate-800 font-sans selection:bg-pink-100 selection:text-pink-700 overflow-x-hidden">

      {/* ========================================================
          1. HERO SECTION
          ======================================================== */}
      <section className="relative bg-slate-950 py-24 md:py-36 overflow-hidden flex items-center justify-center border-b border-pink-500/10 min-h-[60vh]">
        {/* Background Visual Grid / Circles */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(219,39,119,0.12),transparent_60%)] z-0" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-wider"
          >
            <Ribbon className="h-4 w-4 animate-pulse text-pink-500" />
            Global Diagnostic Directory
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-heading text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight"
          >
            Breast Cancer <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-sky-300">
              Diagnosis Technologies
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto"
          >
            Explore the latest diagnostic technologies used worldwide for early breast cancer detection and understand how each examination is performed. Partner with us to spread clinical guidelines.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="pt-4"
          >
            <a href="#diagnosis-modalities">
              <Button size="lg" className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-full px-8 py-6 text-base cursor-pointer shadow-lg shadow-pink-600/20 hover:scale-105 transition-all">
                Explore Diagnosis Methods
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      <section id="overview-story" className="py-24 bg-gradient-to-b from-rose-50/20 via-white to-rose-50/10 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Column: Large Emotional Image */}
            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-pink-400 to-purple-400 rounded-3xl opacity-20 blur-xl -z-10" />
              <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl border border-pink-100">
                <Image
                  src="/image.png"
                  alt="Compassionate patient support care"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* Right Column: Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block">
                Our Philosophy
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                You Are Not Fighting <span className="text-pink-600">Alone.</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Facing a breast cancer diagnosis is a profound and emotional journey that impacts the entire family structure. We walk by your side at every step. We integrate advanced clinical research with deeply supportive, patient-first care pathways to maximize healing capacity.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                By nurturing emotional health, providing evidence-based wellness guidelines, and introducing holistic support mechanisms, we aim to build resilience, restore vitality, and keep the flame of hope burning brightly.
              </p>

              {/* Animated Quote Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-2xl border border-pink-100 bg-white/70 backdrop-blur-md shadow-lg shadow-pink-100/20 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-pink-500 to-purple-500" />
                <p className="text-pink-700 italic font-semibold text-sm sm:text-base">
                  &ldquo;Cancer may change your life, but it doesn&apos;t define your future.&rdquo;
                </p>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mt-2">
                  Supportive Care Core
                </span>
              </motion.div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================
          DIAGNOSTIC MODALITIES TABBED LAYOUT & VIDEOS
          ======================================================== */}
      <section id="diagnosis-modalities" className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-16">

          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block">
              Clinical Standards
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
              Breast Cancer Diagnosis Options
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Early and accurate diagnosis is critical. Learn about standard clinical pathways, when they are recommended, and explore patient video walkthroughs.
            </p>
          </div>

          {/* Diagnostic Modalities Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Left Column: Vertical/Horizontal Tabs */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2.5 pb-3 lg:pb-0 max-w-full no-scrollbar shrink-0">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 px-1 lg:block hidden">
                Diagnostic Modalities
              </h4>
              {(Object.keys(diagnosisMethods) as Array<keyof typeof diagnosisMethods>).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveDiagTab(key)}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex items-center justify-between gap-4 shrink-0 lg:shrink ${activeDiagTab === key
                      ? "bg-pink-50/60 border-pink-200 text-pink-700 shadow-xs"
                      : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200 text-slate-700"
                    }`}
                >
                  <span className="font-bold text-xs sm:text-sm md:text-base tracking-tight whitespace-nowrap">
                    {key === "mammography" && "Mammography"}
                    {key === "ultrasound" && "Ultrasound"}
                    {key === "mri" && "Breast MRI"}
                    {key === "biopsy" && "Biopsy Confirmation"}
                  </span>
                  <ArrowRight className={`h-4 w-4 transition-transform lg:block hidden ${activeDiagTab === key
                      ? "translate-x-1 text-pink-600"
                      : "text-slate-300 group-hover:translate-x-1 group-hover:text-slate-400"
                    }`} />
                </button>
              ))}
            </div>

            {/* Right Column: Tab Content */}
            <Card className="lg:col-span-8 border-slate-100 bg-slate-50/20 p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-7 space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-100/50 text-pink-700 text-[10px] font-bold uppercase tracking-wider">
                    {activeDiagTab === "biopsy" ? "Invasive Diagnostic" : "Non-Invasive Imaging"}
                  </span>
                  <h3 className="font-heading text-2xl font-black text-slate-800 tracking-tight">
                    {diagnosisMethods[activeDiagTab as keyof typeof diagnosisMethods].title}
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {diagnosisMethods[activeDiagTab as keyof typeof diagnosisMethods].description}
                  </p>

                  <div className="p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/10 space-y-1">
                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1">
                      <Info className="h-3.5 w-3.5" /> Clinical Recommendation Criteria
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {diagnosisMethods[activeDiagTab as keyof typeof diagnosisMethods].recom}
                    </p>
                  </div>
                </div>

                {/* Modality Image */}
                <div className="md:col-span-5 relative aspect-square w-full rounded-2xl overflow-hidden border border-pink-100/30 shadow-xs bg-white flex items-center justify-center">
                  <Image
                    src={diagnosisMethods[activeDiagTab as keyof typeof diagnosisMethods].imageUrl}
                    alt={diagnosisMethods[activeDiagTab as keyof typeof diagnosisMethods].title}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-3 pt-2">
                <h4 className="font-heading text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Key Benefits & Clinical Value
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {diagnosisMethods[activeDiagTab as keyof typeof diagnosisMethods].benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

          </div>
          {/* Videos Subsection */}
          <div className="space-y-8 pt-8 border-t border-slate-100">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                <Video className="h-3.5 w-3.5" />
                Clinical Video Walkthroughs
              </span>
              <h3 className="font-heading text-2xl font-bold text-slate-800">
                Early Screening & Consultation Video Guides
              </h3>
              <p className="text-slate-500 text-sm max-w-2xl">
                Explore the official patient screening walkthroughs and self-examination video instructions. Select any video below to load it into the player.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Main Player Container */}
              <div className="lg:col-span-8 bg-card border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col bg-white">
                <div className="relative aspect-video bg-black w-full overflow-hidden">
                  {diagnosisVideos[activeVideoIndex].src ? (
                    <video
                      ref={diagVideoRef}
                      key={diagnosisVideos[activeVideoIndex].src}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                      autoPlay={activeVideoIndex > 0}
                      preload="metadata"
                    >
                      <source src={diagnosisVideos[activeVideoIndex].src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-400 space-y-4">
                      <Video className="h-16 w-16 text-pink-500/80 animate-pulse" />
                      <p className="text-white font-semibold">Video Not Available</p>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-3 bg-white">
                  <div className="flex flex-wrap gap-2 items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-2.5 py-1 rounded-md">
                      Active Walkthrough
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Duration: {diagnosisVideos[activeVideoIndex].duration}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">
                    {diagnosisVideos[activeVideoIndex].title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {diagnosisVideos[activeVideoIndex].description}
                  </p>
                </div>
              </div>

              {/* Sidebar: Video Selectors */}
              <div className="lg:col-span-4 space-y-4">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Video className="h-4.5 w-4.5 text-pink-500" />
                  Select Walkthrough Video
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {diagnosisVideos.map((vid, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDiagVideoChange(idx)}
                      className={`flex gap-3.5 p-3 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${activeVideoIndex === idx
                          ? "bg-pink-50/50 border-pink-200 shadow-xs"
                          : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                        }`}
                    >
                      <div className="h-14 w-20 shrink-0 rounded-xl bg-slate-100 border border-slate-200/50 relative overflow-hidden flex items-center justify-center">
                        <Play className="h-4.5 w-4.5 text-pink-500 fill-pink-500" />
                        <div className="absolute bottom-1 right-1 bg-black/75 px-1 py-0.5 rounded text-[8px] text-white font-bold">
                          {vid.duration}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-bold text-xs text-slate-800 line-clamp-1">
                          {vid.title}
                        </h5>
                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                          {vid.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>


    </div>
  );
}
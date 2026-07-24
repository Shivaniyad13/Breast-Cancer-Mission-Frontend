"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ribbon,
  Sparkles,
  Info,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Video,
  Clock,
  Play,
  ArrowRight,
  ChevronRight,
  BookOpen,
  AlertCircle,
  HeartCrack,
  FileText,
  FileDown,
  Stethoscope,
  Activity,
  Layers,
  Search,
  ExternalLink,
  Plus,
  Minus
} from "lucide-react";

// Reusable data structure for Videos
const educationalVideos = [
  {
    title: "Breast Self-Examination (BSE) Walkthrough",
    duration: "3:45",
    description: "Detailed medical walkthrough demonstrating correct examination motions, finger pressure, and inspection zones.",
    src: "/cancer video.webm",
    thumbnail: "/images/preventive_wellness.png"
  },
  {
    title: "Khushi Tactile Care Kit Instructions",
    duration: "5:12",
    description: "Learn how to use the checkup cards, timeline planners, and tactile exam aids included in the Khushi Care Kit.",
    src: "/cancer3.webm",
    thumbnail: "/images/mammography_screening.png"
  },
  {
    title: "Understanding Early Breast Cancer Screening",
    duration: "4:15",
    description: "A patient-centric guide to understanding what to expect during a mammogram, clinical breast exam, or ultrasound.",
    src: "/videoplayback.mp4",
    thumbnail: "/images/survivor_strength.png"
  }
];

// Reusable data structure for FAQs
const faqsList = [
  {
    q: "What is breast cancer?",
    a: "Breast cancer is a disease in which cells in the breast grow out of control. It usually starts in the lobules (the glands that produce milk) or the ducts (the passages that carry milk from the glands to the nipple). These mutated cells can form a tumor that can often be seen on an X-ray or felt as a lump. If left untreated, cancerous cells can invade surrounding healthy tissue or spread to other parts of the body (metastasis)."
  },
  {
    q: "Can breast cancer be prevented?",
    a: "While breast cancer cannot be completely prevented, you can significantly reduce your risk by adopting a healthy lifestyle. This includes maintaining a healthy weight, staying physically active, limiting alcohol intake, avoiding smoking, and breastfeeding if possible. Regular clinical screenings and monthly self-examinations are vital, as detecting cancer at Stage I yields a survival rate of over 98%."
  },
  {
    q: "Who is at higher risk?",
    a: "Risk factors include being female, aging (particularly over 40), personal or family history of breast cancer, dense breast tissue, genetic mutations (such as BRCA1 and BRCA2 genes), early onset of menstruation (before age 12), late menopause, and lifestyle factors. Having risk factors does not mean you will get cancer, but it increases the importance of early and regular screenings."
  },
  {
    q: "How often should screening be done?",
    a: "It is recommended that women over 20 perform a Breast Self-Examination (BSE) monthly. A Clinical Breast Examination (CBE) should be performed by a healthcare professional every 1 to 3 years for women aged 20-39, and annually for women 40 and older. Mammography screening is recommended annually or biennially for women starting at age 40, or earlier if they have high-risk factors."
  }
];

const preventionItems = [
  { id: "weight", text: "Maintain a healthy body weight for your height & frame.", desc: "Reduces fat tissues that can produce excess estrogen levels." },
  { id: "exercise", text: "Incorporate at least 150 minutes of moderate exercise weekly.", desc: "Regular physical activity strengthens the immune system and regulates hormone levels." },
  { id: "alcohol", text: "Limit or avoid alcohol consumption entirely.", desc: "Alcohol can increase estrogen levels and damage cell DNA." },
  { id: "breastfeed", text: "Breastfeed if possible for protective benefits.", desc: "Lowers total lifetime menstrual cycles, reducing estrogen exposure." },
  { id: "bse", text: "Perform monthly breast self-examinations (BSE).", desc: "Builds breast tissue familiarity to catch subtle anomalies early." },
  { id: "screening", text: "Consult an oncologist for clinical screenings.", desc: "Enables early professional diagnosis (mammograms, clinical exams)." }
];

const riskFactors = {
  uncontrollable: [
    { title: "Age & Gender", desc: "Being female and over 40 carries higher statistically documented risk.", icon: ShieldCheck },
    { title: "Genetic Mutations", desc: "Inherited mutations in BRCA1 and BRCA2 genes significantly increase lifetime risk.", icon: AlertCircle },
    { title: "Family History", desc: "First-degree relatives (mother, sister, daughter) diagnosed with breast cancer increases risk.", icon: Info },
    { title: "Dense Breast Tissue", desc: "More connective tissue than fatty tissue makes it harder to spot lumps on mammograms.", icon: Layers }
  ],
  controllable: [
    { title: "Physical Inactivity", desc: "A sedentary lifestyle increases overall metabolic and estrogen risks.", icon: Activity },
    { title: "Body Weight", desc: "Being overweight or obese after menopause increases risk as fat tissue produces estrogen.", icon: Activity },
    { title: "Alcohol Intake", desc: "Regular alcohol consumption is directly linked to an increased risk of breast cancer.", icon: HeartCrack },
    { title: "Hormone Therapy", desc: "Certain hormone replacement therapies (HRT) taken during menopause can elevate risk.", icon: HelpCircle }
  ]
};

const symptomsData = [
  {
    title: "Hard Lump",
    desc: "A new, painless, firm, or hard lump with irregular edges is the most common warning sign.",
    tip: "Though some lumps are soft or round, any new mass should be immediately checked by a medical expert."
  },
  {
    title: "Tissue Swelling",
    desc: "Swelling of all or part of a breast, even if no distinct lump is felt.",
    tip: "It may cause a feeling of tightness or visible size difference between breasts."
  },
  {
    title: "Skin Dimpling",
    desc: "Skin dimpling, puckering, or texture changes resembling an orange peel (peau d'orange).",
    tip: "This is caused by cancer cells blocking lymph vessels in the skin."
  },
  {
    title: "Nipple Retraction",
    desc: "The nipple turning inward (inversion) or experiencing persistent nipple pain.",
    tip: "If a previously normal nipple suddenly retracts, it requires swift clinical evaluation."
  },
  {
    title: "Redness & Flaking",
    desc: "Redness, scaling, flaking, or thickening of the nipple or breast skin.",
    tip: "Often mimics skin infections or eczema, but should be properly diagnosed."
  },
  {
    title: "Unusual Discharge",
    desc: "Nipple discharge other than breast milk, particularly if it is bloody or sudden.",
    tip: "Discharge from only one breast or that occurs spontaneously needs immediate investigation."
  }
];

const cancerTypesData = [
  {
    id: "dcis",
    name: "Ductal Carcinoma In Situ",
    abbrev: "DCIS",
    category: "Non-Invasive (Stage 0)",
    desc: "DCIS is the earliest stage of breast cancer. The abnormal cells are confined entirely inside the milk ducts and have not invaded surrounding breast tissue.",
    outlook: "Highly treatable and curable with standard localized therapies.",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
  },
  {
    id: "idc",
    name: "Invasive Ductal Carcinoma",
    abbrev: "IDC",
    category: "Invasive (Most Common)",
    desc: "IDC starts in the milk ducts, breaks through the duct walls, and grows into surrounding breast tissues. From there, it may metastasize through the lymphatic system.",
    outlook: "Accounts for about 80% of all invasive breast cancers.",
    badgeColor: "bg-pink-100 text-pink-800 border-pink-200"
  },
  {
    id: "ilc",
    name: "Invasive Lobular Carcinoma",
    abbrev: "ILC",
    category: "Invasive (Second Common)",
    desc: "ILC begins in the milk-producing glands (lobules) and spreads to surrounding breast tissues. It can be harder to detect via mammogram than IDC.",
    outlook: "Often presents as a thickening of tissue rather than a distinct lump.",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200"
  },
  {
    id: "tnbc",
    name: "Triple-Negative Breast Cancer",
    abbrev: "TNBC",
    category: "Invasive (Aggressive)",
    desc: "TNBC lacks estrogen, progesterone, and HER2 receptors. Because of this, hormone therapy and targeted drugs are not effective against it.",
    outlook: "Requires chemotherapy or immunotherapy. Tends to grow and spread faster.",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200"
  }
];

const flowchartSteps = [
  {
    id: 0,
    title: "Assess Risk Factors",
    subtitle: "Identify Predisposition",
    icon: Stethoscope,
    color: "rose"
  },
  {
    id: 1,
    title: "Practice Prevention",
    subtitle: "Adopt Proactive Habits",
    icon: ShieldCheck,
    color: "pink"
  },
  {
    id: 2,
    title: "Monitor Symptoms",
    subtitle: "Watch for Warning Signs",
    icon: AlertCircle,
    color: "amber"
  },
  {
    id: 3,
    title: "Understand Types",
    subtitle: "Pathology & Staging",
    icon: BookOpen,
    color: "purple"
  }
];

export default function EducationClient() {
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSymptomIdx, setSelectedSymptomIdx] = useState<number | null>(null);
  const [activeTypeTab, setActiveTypeTab] = useState("dcis");
  const [preventionChecklist, setPreventionChecklist] = useState({
    weight: false,
    exercise: false,
    alcohol: false,
    breastfeed: false,
    bse: false,
    screening: false,
  });

  const handleVideoSelect = (idx: number) => {
    setActiveVideoIdx(idx);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.log("Video auto-play blocked or failed:", err);
      });
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <div className="flex-1 w-full bg-white text-slate-800 font-sans selection:bg-pink-100 selection:text-pink-700 overflow-x-hidden relative">
      
      {/* Decorative background blur blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-40 left-10 w-72 h-72 bg-rose-200/25 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-gradient-to-b from-rose-50/40 via-white to-white py-16 md:py-24 border-b border-rose-100/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Info */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider"
              >
                <Ribbon className="h-3.5 w-3.5 text-primary animate-pulse" />
                Educational Resources
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-800 leading-tight"
              >
                Breast Cancer <br />
                <span className="text-primary">Education</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium"
              >
                Knowledge is the first step toward prevention and early detection. Learn about breast anatomy, cancer development, risk management, and screening paths.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4"
              >
                <a href="#what-is-breast-cancer">
                  <Button className="bg-primary hover:bg-primary/95 text-white font-semibold rounded-full shadow-md px-6 active:scale-95 transition-all">
                    Start Learning
                  </Button>
                </a>
                <a href="#video-library">
                  <Button variant="outline" className="border-pink-200 text-primary hover:bg-pink-50 font-semibold rounded-full px-6 active:scale-95 transition-all">
                    Watch Videos
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* Hero Right Image Banner */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="absolute -inset-2 bg-gradient-to-tr from-pink-400 to-rose-300 rounded-3xl opacity-15 blur-2xl z-0" />
              <div className="relative aspect-[4/3] w-full max-w-md rounded-3xl overflow-hidden border border-pink-100/60 shadow-xl bg-white p-2 z-10">
                <Image
                  src="/images/cancer_research.png"
                  alt="Medical Cancer Research Banner"
                  fill
                  className="object-cover rounded-2xl"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= WHAT IS BREAST CANCER? ================= */}
      <section id="what-is-breast-cancer" className="py-16 md:py-24 bg-white scroll-mt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative aspect-[4/3] w-full max-w-sm rounded-3xl overflow-hidden border border-slate-100 shadow-lg bg-muted">
                <Image
                  src="/images/preventive_wellness.png"
                  alt="What is breast cancer"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 350px"
                />
              </div>
            </div>

            {/* Educational Info Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold uppercase tracking-wider">
                <Info className="h-3 w-3" /> Core Overview
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 leading-tight">
                What is Breast Cancer?
              </h2>
              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Breast cancer is a clinical disease in which normal cells in the breast mutate and divide in an uncontrolled, rapid fashion. This aberrant growth forms a dense mass of cells known as a <strong>tumor</strong>.
                </p>
                <p>
                  <strong>How it develops:</strong> The breast is composed of three main parts: lobules (glands that produce milk), ducts (tubes that carry milk to the nipple), and connective tissue. Most breast cancers begin in the ducts (ductal carcinoma) or the lobules (lobular carcinoma). The cancer can spread outside the breast through blood vessels and lymph channels, a process known as metastasis.
                </p>
                <p>
                  <strong>Importance of Awareness:</strong> Breast cancer is highly treatable if detected in its localized, early stages (Stage I), showing a five-year survival rate of over <strong>98%</strong>. Being aware of how your breasts normally look and feel is essential for identifying warning signs early.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE EDUCATION JOURNEY FLOWCHART ================= */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-pink-50/20 border-y border-pink-100/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/50 text-primary text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" /> Clinical Pillars
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Breast Cancer Education Journey
            </h2>
            <p className="text-sm text-slate-600">
              An interactive clinical flowchart guiding you from risk assessment and prevention to early symptoms and staging.
            </p>
          </div>

          {/* Desktop Flowchart Diagram */}
          <div className="relative hidden md:flex items-center justify-between w-full max-w-4xl mx-auto px-8 py-4 mb-8">
            <svg className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 -z-10" pointerEvents="none">
              {/* Base track */}
              <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="#F1F5F9" strokeWidth="4" strokeLinecap="round" />
              
              {/* Active filled line */}
              <motion.line
                x1="5%"
                y1="50%"
                x2={`${5 + activeStep * 30}%`}
                y2="50%"
                stroke="var(--color-primary, oklch(0.6 0.22 350))"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ x2: "5%" }}
                animate={{ x2: `${5 + activeStep * 30}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </svg>

            {flowchartSteps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === activeStep;
              const isCompleted = idx < activeStep;
              
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                >
                  <motion.div
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive
                        ? "bg-white border-primary shadow-[0_0_15px_rgba(219,39,119,0.3)] text-primary scale-110"
                        : isCompleted
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-slate-200 text-slate-400 hover:border-pink-300 hover:text-pink-500"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-6 w-6" />
                    
                    <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      isActive || isCompleted ? "bg-primary text-white" : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}>
                      {idx + 1}
                    </span>
                  </motion.div>
                  
                  <div className="text-center mt-3 max-w-[120px]">
                    <p className={`text-xs font-bold transition-colors ${isActive ? "text-primary font-black" : "text-slate-700 group-hover:text-slate-900"}`}>
                      {step.title}
                    </p>
                    <p className="text-[9px] font-semibold text-slate-400 mt-0.5">
                      {step.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile Flowchart Selectors */}
          <div className="flex md:hidden flex-col gap-3 max-w-sm mx-auto mb-6">
            {flowchartSteps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === activeStep;
              
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`flex items-center gap-4 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? "bg-pink-50/50 border-primary/50 shadow-xs"
                      : "bg-white border-slate-100"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
                    isActive ? "bg-white border-primary text-primary" : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${isActive ? "text-primary" : "text-slate-700"}`}>
                      Step {idx + 1}: {step.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">{step.subtitle}</p>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${isActive ? "rotate-90 text-primary" : ""}`} />
                </button>
              );
            })}
          </div>

          {/* Interactive Step Content Display */}
          <div className="relative mt-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-pink-100/50 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden"
              >
                {activeStep === 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-rose-50 pb-4">
                      <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-slate-800">Assess Your Risk Factors</h3>
                        <p className="text-xs text-slate-500 font-medium">Understanding what increases statistical likelihood helps with proactive planning.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Uncontrollable Group */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-rose-700 font-bold text-sm bg-rose-50/50 px-3 py-1.5 rounded-lg w-fit">
                          <AlertCircle className="h-4 w-4" />
                          <span>Uncontrollable Risk Factors</span>
                        </div>
                        <p className="text-xs text-slate-500">These are biological or genetic aspects that cannot be altered, necessitating closer clinical screening schedules.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {riskFactors.uncontrollable.map((item, idx) => {
                            const ItemIcon = item.icon;
                            return (
                              <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-2 hover:border-rose-200 transition-all">
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 rounded-lg bg-white shadow-xs text-rose-500 flex items-center justify-center">
                                    <ItemIcon className="h-4 w-4" />
                                  </div>
                                  <span className="text-xs font-bold text-slate-800">{item.title}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Controllable Group */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
                          <ShieldCheck className="h-4 w-4" />
                          <span>Modifiable Lifestyle Factors</span>
                        </div>
                        <p className="text-xs text-slate-500">These are behaviors or lifestyle choices that you can actively modify to reduce your overall risk index.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {riskFactors.controllable.map((item, idx) => {
                            const ItemIcon = item.icon;
                            return (
                              <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-2 hover:border-emerald-200 transition-all">
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 rounded-lg bg-white shadow-xs text-emerald-500 flex items-center justify-center">
                                    <ItemIcon className="h-4 w-4" />
                                  </div>
                                  <span className="text-xs font-bold text-slate-800">{item.title}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="bg-pink-50/40 border border-pink-100/50 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between mt-4">
                      <div className="space-y-1 text-center sm:text-left">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 justify-center sm:justify-start">
                          <Ribbon className="h-4 w-4 text-primary animate-pulse" />
                          Have family history or concerns?
                        </h4>
                        <p className="text-[11px] text-slate-500">Consult with certified genetic counselors to evaluate BRCA1 or BRCA2 mutations.</p>
                      </div>
                      <button
                        onClick={() => setActiveStep(1)}
                        className="bg-primary hover:bg-primary/95 text-white font-bold text-[11px] py-2 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        See Prevention Steps <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-pink-50 pb-4">
                      <div className="h-10 w-10 rounded-xl bg-pink-50 text-primary flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-slate-800">Practice Preventive Action</h3>
                        <p className="text-xs text-slate-500 font-medium">Adopt protective habits and take charge of modifiable risks.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Checklist */}
                      <div className="lg:col-span-7 space-y-4">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Daily Wellness Checklist</h4>
                        <p className="text-xs text-slate-500">Tick off the protective actions you are actively incorporating into your routine to track your preventive alignment.</p>
                        
                        <div className="space-y-2.5">
                          {preventionItems.map((item) => {
                            const isChecked = preventionChecklist[item.id as keyof typeof preventionChecklist];
                            return (
                              <label
                                key={item.id}
                                className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                                  isChecked
                                    ? "bg-pink-50/20 border-primary/30 shadow-2xs"
                                    : "bg-slate-50/50 border-slate-100 hover:border-pink-200"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    setPreventionChecklist({
                                      ...preventionChecklist,
                                      [item.id]: e.target.checked
                                    });
                                  }}
                                  className="mt-0.5 rounded text-primary focus:ring-primary h-4.5 w-4.5 border-slate-300 cursor-pointer"
                                />
                                <div className="min-w-0 ml-1">
                                  <p className={`text-xs font-bold ${isChecked ? "text-primary" : "text-slate-700"}`}>
                                    {item.text}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Progress Tracker Card */}
                      <div className="lg:col-span-5 bg-gradient-to-tr from-pink-500/5 via-rose-500/[0.01] to-transparent border border-pink-100 p-6 rounded-3xl text-center space-y-5">
                        <div className="mx-auto w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-primary relative">
                          <Sparkles className="h-8 w-8 animate-pulse" />
                          {Object.values(preventionChecklist).every(Boolean) && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                              ✓
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="font-heading text-base font-bold text-slate-800">Your Wellness Alignment</h4>
                          <p className="text-[11px] text-slate-500 px-4">
                            Building healthy habits incrementally creates substantial long-term preventive barriers.
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          {(() => {
                            const checkedCount = Object.values(preventionChecklist).filter(Boolean).length;
                            const checkedPercent = Math.round((checkedCount / preventionItems.length) * 100);
                            return (
                              <>
                                <div className="flex items-center justify-between text-xs font-bold px-1">
                                  <span className="text-slate-500">Progress</span>
                                  <span className="text-primary">{checkedPercent}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                  <motion.div
                                    className="bg-primary h-full rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${checkedPercent}%` }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </div>
                                <div className="pt-2 text-xs font-semibold text-slate-500">
                                  {checkedCount === 0 ? (
                                    <span className="text-slate-400">Select habits to begin tracking!</span>
                                  ) : checkedCount < preventionItems.length ? (
                                    <span className="text-pink-600">Great job! {preventionItems.length - checkedCount} more healthy habits to add.</span>
                                  ) : (
                                    <span className="text-emerald-600 font-bold flex items-center gap-1 justify-center">
                                      <CheckCircle className="h-4 w-4" /> Perfect alignment! Maintain these habits!
                                    </span>
                                  )}
                                </div>
                              </>
                            );
                          })()}
                        </div>

                        <button
                          onClick={() => setActiveStep(2)}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          Learn to Spot Symptoms <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-amber-50 pb-4">
                      <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-slate-800">Identify Common Symptoms</h3>
                        <p className="text-xs text-slate-500 font-medium">Regular observation allows you to recognize early physical abnormalities.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {symptomsData.map((symptom, idx) => {
                        const isSelected = selectedSymptomIdx === idx;
                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedSymptomIdx(selectedSymptomIdx === idx ? null : idx)}
                            className={`border p-4 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between min-h-[140px] relative overflow-hidden select-none ${
                              isSelected
                                ? "bg-amber-50/30 border-amber-300 shadow-2xs"
                                : "bg-white border-slate-100 hover:border-amber-200 hover:shadow-2xs"
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                  isSelected ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-500 group-hover:bg-amber-50 group-hover:text-amber-700"
                                }`}>
                                  Symptom 0{idx + 1}
                                </span>
                                <span className="text-[10px] font-semibold text-primary underline opacity-0 group-hover:opacity-100 transition-opacity">
                                  {isSelected ? "Hide Tip" : "View Tip"}
                                </span>
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-800">{symptom.title}</h4>
                              <p className="text-[11px] text-slate-505 leading-relaxed">{symptom.desc}</p>
                            </div>

                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden border-t border-amber-100 mt-3 pt-2"
                                >
                                  <p className="text-[10px] text-amber-800 leading-relaxed font-medium bg-amber-50/50 p-2 rounded-lg">
                                    <strong>Oncology Tip:</strong> {symptom.tip}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex gap-3 items-start mt-4">
                      <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-rose-800">Critical Warning Guidelines</h4>
                        <p className="text-[11px] text-rose-700 leading-relaxed">
                          A lump is often firm, painless, and has irregular borders. However, some can be soft, tender, and round. If you notice <strong>any</strong> persistent visual or texture anomaly, please consult an oncologist right away. Do not wait for symptoms to worsen.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setActiveStep(3)}
                        className="bg-primary hover:bg-primary/95 text-white font-bold text-xs py-2 px-5 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        Study Pathological Types <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-purple-50 pb-4">
                      <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-slate-800">Understand Pathological Types</h3>
                        <p className="text-xs text-slate-500 font-medium">Breast cancer is classified based on site of origin and invasiveness markers.</p>
                      </div>
                    </div>

                    {/* Tab Selectors */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-slate-100 pb-4">
                      {cancerTypesData.map((type) => {
                        const isSelected = activeTypeTab === type.id;
                        return (
                          <button
                            key={type.id}
                            onClick={() => setActiveTypeTab(type.id)}
                            className={`py-2 px-3 text-center rounded-xl font-bold text-xs transition-all cursor-pointer ${
                              isSelected
                                ? "bg-purple-600 text-white shadow-xs"
                                : "bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100"
                            }`}
                          >
                            <span className="block text-sm">{type.abbrev}</span>
                            <span className="text-[8px] opacity-75 block mt-0.5 truncate">{type.category}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Type Detail Card */}
                    {(() => {
                      const currentType = cancerTypesData.find((t) => t.id === activeTypeTab) || cancerTypesData[0];
                      return (
                        <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center gap-2.5">
                              <h4 className="font-heading text-base font-bold text-slate-800">{currentType.name}</h4>
                              <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full uppercase shrink-0 ${currentType.badgeColor}`}>
                                {currentType.category}
                              </span>
                            </div>
                            
                            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                              <p>{currentType.desc}</p>
                              <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-1.5 shadow-2xs">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Clinical Outlook</span>
                                <p className="text-xs text-slate-600 font-medium">{currentType.outlook}</p>
                              </div>
                            </div>
                          </div>

                          {/* Diagnostic Journey Sidebar */}
                          <div className="bg-white border border-purple-100/50 rounded-2xl p-5 shadow-2xs space-y-4">
                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diagnostic Pathway</h5>
                            <p className="text-[11px] text-slate-500 leading-relaxed">If cells show suspicious characteristics, oncologists use a standardized workflow to diagnose:</p>
                            
                            <div className="relative pl-6 space-y-3.5 border-l-2 border-slate-100 text-[11px]">
                              <div className="relative">
                                <div className="absolute -left-[30px] top-0.5 w-3 h-3 rounded-full bg-primary border-2 border-white shadow-2xs" />
                                <span className="font-bold text-slate-800 block">1. Self-Exam / CBE</span>
                                <span className="text-slate-400 font-semibold block text-[10px]">Initial tactile detection</span>
                              </div>
                              <div className="relative">
                                <div className="absolute -left-[30px] top-0.5 w-3 h-3 rounded-full bg-slate-300 border-2 border-white shadow-2xs" />
                                <span className="font-bold text-slate-800 block">2. Imaging (Mammogram/US)</span>
                                <span className="text-slate-400 font-semibold block text-[10px]">Internal structural confirmation</span>
                              </div>
                              <div className="relative">
                                <div className="absolute -left-[30px] top-0.5 w-3 h-3 rounded-full bg-slate-300 border-2 border-white shadow-2xs" />
                                <span className="font-bold text-slate-800 block">3. Biopsy Test</span>
                                <span className="text-slate-400 font-semibold block text-[10px]">Definitive cellular pathology check</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="flex justify-between items-center pt-2">
                      <button
                        onClick={() => setActiveStep(0)}
                        className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs py-2.5 px-4 rounded-xl shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        Back to Start
                      </button>
                      <Link href="/diagnosis">
                        <Button className="bg-primary hover:bg-primary/95 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer">
                          Explore Diagnostics Hub <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ================= BREAST SELF-EXAMINATION (BSE) ================= */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="bg-gradient-to-tr from-pink-500/5 via-rose-500/[0.02] to-transparent border border-pink-100 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden group">
            
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl -z-10 group-hover:scale-105 transition-transform duration-500" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                  <Clock className="h-4 w-4" />
                  Paced Self-Screening
                </span>

                <div className="space-y-3">
                  <h2 className="font-heading text-3xl font-extrabold text-slate-800 tracking-tight">
                    Breast Self-Examination (BSE)
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Performing a regular Breast Self-Examination (BSE) helps you build body familiarity. It is a critical habit that allows you to notice any sudden deviations, texture changes, or surface anomalies quickly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-600 font-medium">
                  <div className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Why perform BSE?</p>
                      <p className="text-slate-500 mt-1">To spot warning signs early between clinical doctor screens.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">When to perform?</p>
                      <p className="text-slate-500 mt-1">Monthly, 3 to 5 days after your period ends when tissue is softest.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                  <Link href="/learn/bse-guide">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md text-xs py-2.5 h-auto px-5 flex items-center gap-1.5 active:scale-95 transition-all">
                      Launch Interactive Guide
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/learn/quiz">
                    <Button variant="outline" className="border-pink-200 text-primary hover:bg-pink-50 font-bold rounded-xl text-xs py-2.5 h-auto px-5 active:scale-95 transition-all">
                      Test Your Knowledge
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Graphical Visual */}
              <div className="lg:col-span-4 flex items-center justify-center p-4">
                <div className="relative p-6 rounded-2xl bg-white border border-pink-100 shadow-sm w-full max-w-xs text-center space-y-4">
                  <div className="h-14 w-14 rounded-full bg-pink-50 flex items-center justify-center text-primary mx-auto animate-pulse">
                    <Ribbon className="h-7 w-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">Interactive Walkthrough</p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Self-Exam Timers Included</p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed px-2">
                    Features visual instruction segments and a pacing timer for each side.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= EARLY DETECTION ================= */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-pink-50/20 border-t border-pink-100/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/50 text-primary text-[10px] font-bold uppercase tracking-wider">
              <Stethoscope className="h-3 w-3" /> Screening Guidelines
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Early Detection Methods
            </h2>
            <p className="text-sm text-slate-600">
              Learn about early clinical screening tools used to confirm or rule out cancer cells.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Mammography Card */}
            <Card className="border-pink-100/40 bg-white/70 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow rounded-2xl">
              <div className="h-24 bg-gradient-to-br from-pink-500/10 to-pink-500/5 border-b border-pink-50/50 p-4 flex items-end justify-between rounded-t-2xl">
                <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-xs">
                  <Layers className="h-5 w-5" />
                </div>
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Imaging Scan</span>
              </div>
              <CardHeader className="space-y-1.5 p-5">
                <CardTitle className="font-heading text-lg font-bold text-slate-800">Mammography</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Low-dose breast X-ray panels designed to capture detailed internal structures, uncovering micro-calcifications long before they are palpable.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 p-5">
                <Link href="/diagnosis">
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 text-xs font-semibold p-0 flex items-center gap-1">
                    Learn Details <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* CBE Card */}
            <Card className="border-pink-100/40 bg-white/70 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow rounded-2xl">
              <div className="h-24 bg-gradient-to-br from-pink-500/10 to-pink-500/5 border-b border-pink-50/50 p-4 flex items-end justify-between rounded-t-2xl">
                <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-xs">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Physical Exam</span>
              </div>
              <CardHeader className="space-y-1.5 p-5">
                <CardTitle className="font-heading text-lg font-bold text-slate-800">Clinical Breast Exam</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-semibold leading-relaxed">
                  A physical palpation exam conducted by a physician or trained healthcare worker during routine physical health checkups.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 p-5">
                <Link href="/diagnosis">
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 text-xs font-semibold p-0 flex items-center gap-1">
                    Learn Details <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Ultrasound Card */}
            <Card className="border-pink-100/40 bg-white/70 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow rounded-2xl">
              <div className="h-24 bg-gradient-to-br from-pink-500/10 to-pink-500/5 border-b border-pink-50/50 p-4 flex items-end justify-between rounded-t-2xl">
                <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-xs">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Sonic Imaging</span>
              </div>
              <CardHeader className="space-y-1.5 p-5">
                <CardTitle className="font-heading text-lg font-bold text-slate-800">Ultrasound</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Uses safe, radiation-free high frequency sound waves to examine tissue, helpful for younger patients or for telling dense cysts from solid tumors.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 p-5">
                <Link href="/diagnosis">
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 text-xs font-semibold p-0 flex items-center gap-1">
                    Learn Details <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* MRI Card */}
            <Card className="border-pink-100/40 bg-white/70 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow rounded-2xl">
              <div className="h-24 bg-gradient-to-br from-pink-500/10 to-pink-500/5 border-b border-pink-50/50 p-4 flex items-end justify-between rounded-t-2xl">
                <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-xs">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Magnetic Resonance</span>
              </div>
              <CardHeader className="space-y-1.5 p-5">
                <CardTitle className="font-heading text-lg font-bold text-slate-800">MRI Scan</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Advanced 3D magnetic wave mapping. Reserved for staging confirmed cancer cases, screening high-risk patients, or evaluating breast implants.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 p-5">
                <Link href="/diagnosis">
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 text-xs font-semibold p-0 flex items-center gap-1">
                    Learn Details <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Biopsy Card */}
            <Card className="border-pink-100/40 bg-white/70 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow rounded-2xl">
              <div className="h-24 bg-gradient-to-br from-pink-500/10 to-pink-500/5 border-b border-pink-50/50 p-4 flex items-end justify-between rounded-t-2xl">
                <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-xs">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Pathology test</span>
              </div>
              <CardHeader className="space-y-1.5 p-5">
                <CardTitle className="font-heading text-lg font-bold text-slate-800">Biopsy</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-semibold leading-relaxed">
                  The definitive confirmatory check. A hollow core needle extracts minor cell tissue from a lump to be analyzed under a microscope in a pathology lab.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 p-5">
                <Link href="/diagnosis">
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 text-xs font-semibold p-0 flex items-center gap-1">
                    Learn Details <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

          </div>

          <div className="text-center pt-2">
            <Link href="/diagnosis">
              <Button className="bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl text-xs py-2.5 h-auto px-6 shadow-sm flex items-center gap-1.5 mx-auto active:scale-95 transition-all">
                View Comprehensive Diagnosis Roadmap
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ================= EDUCATIONAL VIDEO PLAYLIST ================= */}
      <section id="video-library" className="py-16 md:py-24 bg-white border-b border-pink-100/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-10">
          
          <div className="space-y-3 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider">
              <Video className="h-3.5 w-3.5" />
              Educational Video Library
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800">
              Interactive Video Guides
            </h3>
            <p className="text-slate-500 text-sm max-w-2xl">
              Watch self-examination demonstrations and oncologist briefings to familiarize yourself with breast wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Video Player */}
            <div className="lg:col-span-8 bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-sm flex flex-col">
              <div className="relative aspect-video bg-black w-full overflow-hidden">
                {educationalVideos[activeVideoIdx].src ? (
                  <video
                    ref={videoRef}
                    key={educationalVideos[activeVideoIdx].src}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  >
                    <source src={educationalVideos[activeVideoIdx].src} type="video/mp4" />
                    <source src={educationalVideos[activeVideoIdx].src} type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 p-6 text-center text-zinc-400 space-y-4">
                    <Video className="h-16 w-16 text-pink-500/80 animate-pulse" />
                    <div className="space-y-2">
                      <p className="text-white font-semibold text-lg">Insight Video Unavailable</p>
                      <p className="text-xs text-zinc-500 max-w-sm">This video is currently being prepared for streaming. Check back soon for clinical expert details.</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-3">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest bg-pink-50 px-2.5 py-1 rounded-md">
                    Now Playing
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                    <Clock className="h-3.5 w-3.5" />
                    Duration: {educationalVideos[activeVideoIdx].duration}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-800">
                  {educationalVideos[activeVideoIdx].title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {educationalVideos[activeVideoIdx].description}
                </p>
              </div>
            </div>

            {/* Playlist Sidebar */}
            <div className="lg:col-span-4 space-y-3">
              <div className="p-4 bg-pink-50/30 rounded-2xl border border-pink-100/30">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest block mb-1">
                  Playlist Walkthroughs
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Select a video below to start playing</span>
              </div>

              <div className="space-y-3">
                {educationalVideos.map((video, idx) => {
                  const isActive = idx === activeVideoIdx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleVideoSelect(idx)}
                      className={`w-full text-left flex items-start gap-3 p-3 rounded-2xl border transition-all duration-300 ${
                        isActive
                          ? "bg-pink-50/40 border-primary/50 shadow-xs"
                          : "bg-white border-slate-100 hover:border-pink-200/50 hover:bg-pink-50/10"
                      }`}
                    >
                      <div className="relative h-16 w-24 rounded-lg overflow-hidden shrink-0 bg-muted border border-slate-100">
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                        <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                          <Play className={`h-5 w-5 ${isActive ? "text-primary fill-primary scale-110" : "text-white"} transition-transform`} />
                        </div>
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9px] font-semibold text-slate-400 flex items-center gap-0.5">
                            <Clock className="h-2.5 w-2.5" />
                            {video.duration}
                          </span>
                          {isActive && (
                            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                          )}
                        </div>
                        <p className={`text-xs font-bold truncate ${isActive ? "text-primary" : "text-slate-800"}`}>
                          {video.title}
                        </p>
                        <p className="text-[10px] text-slate-400 line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= DOWNLOAD RESOURCES ================= */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-pink-50/20 border-b border-pink-100/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/50 text-primary text-[10px] font-bold uppercase tracking-wider">
              <FileDown className="h-3 w-3" /> Reference Vault
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Download Resources
            </h2>
            <p className="text-sm text-slate-600">
              Access educational brochures, posters, and diagnostic check sheet PDFs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Resource 1 */}
            <div className="bg-white border border-pink-50/50 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-lg bg-pink-50 text-primary flex items-center justify-center border border-pink-100/20">
                  <FileText className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Awareness Brochure</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Printable trifold brochure outlining general symptoms and physical checkpoints.
                </p>
              </div>
              <Button variant="outline" className="w-full border-pink-100 text-primary hover:bg-pink-50/50 text-xs font-bold py-2 h-auto rounded-xl mt-6 flex items-center justify-center gap-1.5">
                <FileDown className="h-3.5 w-3.5" /> Download PDF
              </Button>
            </div>

            {/* Resource 2 */}
            <div className="bg-white border border-pink-50/50 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-lg bg-pink-50 text-primary flex items-center justify-center border border-pink-100/20">
                  <FileText className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">BSE Step-by-Step PDF</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  A high-resolution visual layout of the 5 examination steps for bedroom mirror guidance.
                </p>
              </div>
              <Button variant="outline" className="w-full border-pink-100 text-primary hover:bg-pink-50/50 text-xs font-bold py-2 h-auto rounded-xl mt-6 flex items-center justify-center gap-1.5">
                <FileDown className="h-3.5 w-3.5" /> Download PDF
              </Button>
            </div>

            {/* Resource 3 */}
            <div className="bg-white border border-pink-50/50 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-lg bg-pink-50 text-primary flex items-center justify-center border border-pink-100/20">
                  <FileText className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Campaign Infographics</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  A clean graphic diagram of breast cancer staging details and survival rate trends.
                </p>
              </div>
              <Button variant="outline" className="w-full border-pink-100 text-primary hover:bg-pink-50/50 text-xs font-bold py-2 h-auto rounded-xl mt-6 flex items-center justify-center gap-1.5">
                <FileDown className="h-3.5 w-3.5" /> Download PDF
              </Button>
            </div>

            {/* Resource 4 */}
            <div className="bg-white border border-pink-50/50 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-lg bg-pink-50 text-primary flex items-center justify-center border border-pink-100/20">
                  <FileText className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Printable Campaign Posters</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Breast Cancer Awareness posters designed for community boards or campus notices.
                </p>
              </div>
              <Button variant="outline" className="w-full border-pink-100 text-primary hover:bg-pink-50/50 text-xs font-bold py-2 h-auto rounded-xl mt-6 flex items-center justify-center gap-1.5">
                <FileDown className="h-3.5 w-3.5" /> Download PDF
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/50 text-primary text-[10px] font-bold uppercase tracking-wider">
              <HelpCircle className="h-3.5 w-3.5" /> FAQ Accordion
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600">
              Browse quick oncology-verified responses to common screening questions.
            </p>
          </div>

          <div className="bg-white/80 border border-pink-100 rounded-3xl p-5 sm:p-8 shadow-xs space-y-4">
            {faqsList.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0 pt-3 first:pt-0">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center text-left py-2 font-heading font-bold text-sm sm:text-base text-slate-800 hover:text-primary transition-colors cursor-pointer select-none outline-none"
                  >
                    <span>{faq.q}</span>
                    <span className="text-slate-400 shrink-0 ml-4">
                      {isOpen ? <Minus className="h-4.5 w-4.5 text-primary" /> : <Plus className="h-4.5 w-4.5" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-2.5 pr-6">
                          {faq.a}
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

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-16 bg-gradient-to-tr from-pink-500 to-rose-600 text-white relative overflow-hidden">
        {/* Background grids */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-white/5 rounded-full filter blur-2xl pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-8 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
            <Ribbon className="h-3.5 w-3.5 fill-white text-pink-600 animate-pulse" />
            Empowerment Initiative
          </span>

          <div className="space-y-3">
            <h2 className="font-heading text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Early Education Saves Lives
            </h2>
            <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Equip yourself with diagnostic paths, support registered clinical webinars, and join local active campaign walks to defeat oncology barriers.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link href="/diagnosis">
              <Button className="bg-white hover:bg-slate-50 text-slate-800 font-bold px-6 py-2.5 h-auto text-xs sm:text-sm rounded-full shadow-lg active:scale-95 transition-all flex items-center gap-1">
                Learn About Diagnosis
              </Button>
            </Link>
            <Link href="/campaigns/breast-cancer">
              <Button variant="outline" className="border-white text-pink-600 hover:bg-white hover:text-pink-600 font-bold px-6 py-2.5 h-auto text-xs sm:text-sm rounded-full active:scale-95 transition-all">
                Join Awareness Campaign
              </Button>
            </Link>
            <Link href="/webinars">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 h-auto text-xs sm:text-sm rounded-full shadow-lg active:scale-95 transition-all">
                Register for Webinar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer footer element */}
      <footer className="bg-slate-50 border-t border-slate-200/50 py-10 px-4">
        <div className="container mx-auto max-w-4xl flex gap-3 text-[11px] text-slate-400 leading-relaxed justify-center items-start">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="max-w-2xl text-center">
            <strong>Clinical Disclaimer:</strong> The educational details shared on this portal are designed to spread public awareness and must not substitute formal medical advice, clinical diagnostics, or professional therapeutic guidance. Always seek counsel from a registered physician or oncology practitioner regarding symptoms or screenings.
          </p>
        </div>
      </footer>

    </div>
  );
}

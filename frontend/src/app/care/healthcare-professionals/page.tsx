"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Clock,
  Dna,
  Sparkles,
  Layers,
  Apple,
  Brain,
  Zap,
  Pill,
  Check,
  ChevronDown,
  X,
  HeartPulse,
  BookOpen,
  Award,
  Share2,
  GraduationCap,
  Microscope
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ----------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------
interface Guideline {
  id: string;
  title: string;
  summary: string;
  protocols: string[];
  evidenceLevel: string;
  references: string;
}

interface ResearchArticle {
  id: string;
  title: string;
  category: string;
  publishDate: string;
  journal: string;
  summary: string;
  conclusions: string;
  authors: string;
}

interface CMECourse {
  id: string;
  title: string;
  format: string;
  credits: string;
  duration: string;
  instructor: string;
  syllabus: string[];
}

interface SpecialistRole {
  id: string;
  name: string;
  responsibilities: string[];
  patientRole: string;
  collaboration: string;
  icon: React.ComponentType<any>;
}

interface DecisionWorkflowStep {
  step: string;
  title: string;
  desc: string;
  clinicalChecklist: string[];
  guidelinesLink: string;
}

interface ProfessionalResource {
  id: string;
  title: string;
  size: string;
  format: string;
  desc: string;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  speaker: string;
  format: string;
  location: string;
  credits: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------
const guidelinesData: Guideline[] = [
  {
    id: "gl-1",
    title: "Breast Cancer Screening Guidelines",
    summary: "Standard surveillance recommendations for average-risk, intermediate-risk, and high-risk hereditary gene carrier populations.",
    protocols: [
      "Average-risk: Annual digital mammography starting at age 40.",
      "High-risk (BRCA mutation): Annual breast MRI starting at age 25, followed by annual mammography starting at age 30.",
      "Intermediate-risk (dense breasts): Consider supplemental 3D tomosynthesis or automated breast ultrasound."
    ],
    evidenceLevel: "Category 1 (NCCN Aligned)",
    references: "NCCN Clinical Practice Guidelines in Oncology: Breast Cancer Screening v2.2025"
  },
  {
    id: "gl-2",
    title: "Early Detection Protocols",
    summary: "Clinical techniques for physical examinations, triage parameters for breast lumps, and referral indicators.",
    protocols: [
      "Conduct clinical breast examination (CBE) every 1-3 years for ages 25-39, and annually for age 40+.",
      "Immediate diagnostic workup for dominant masses, skin tethering, or bloody nipple discharge.",
      "Calculate 5-year and lifetime risk scores using the Gail Model during routine consultations."
    ],
    evidenceLevel: "Category 2A (ASCO Aligned)",
    references: "ASCO Breast Cancer Screening & Risk Assessment Guidelines 2024"
  },
  {
    id: "gl-3",
    title: "Diagnosis Workflow",
    summary: "Standard triple-assessment parameters comprising physical examination, diagnostic imaging, and core needle biopsy.",
    protocols: [
      "Image suspicious findings with bilateral mammography plus targeted ultrasound.",
      "Utilize BI-RADS assessment categories (BI-RADS 4 or 5 mandate biopsy).",
      "Perform image-guided core needle biopsy rather than fine-needle aspiration (FNA) for tissue architecture."
    ],
    evidenceLevel: "Category 1",
    references: "ESMO Clinical Practice Guidelines: Diagnosis and Staging of Primary Breast Cancer"
  },
  {
    id: "gl-4",
    title: "TNM Staging System",
    summary: "Clinical and pathological criteria for staging tumors, regional lymph node involvement, and distant metastasis.",
    protocols: [
      "T-stage: Categorize based on tumor dimension (T1 <= 20mm, T2 20-50mm, T3 > 50mm, T4 chest wall/skin involvement).",
      "N-stage: Pathological count of metastatic sentinel nodes (N1 1-3 nodes, N2 4-9 nodes, N3 >= 10 nodes).",
      "Incorporate biomolecular markers (ER, PR, HER2, and Ki-67) for prognostic stage grouping."
    ],
    evidenceLevel: "AJCC 8th Edition Standard",
    references: "AJCC Cancer Staging Manual: Breast Cancer Chapter (8th Ed.)"
  },
  {
    id: "gl-5",
    title: "Surgical Management",
    summary: "Criteria for Breast Conserving Surgery (BCS) versus Mastectomy, and Sentinel Lymph Node Biopsy protocols.",
    protocols: [
      "BCS preferred when negative surgical margins can be achieved with acceptable cosmetic outcomes.",
      "Conduct sentinel lymph node biopsy (SLNB) for clinically node-negative (cN0) patients to avoid axillary dissection.",
      "Indicate oncoplastic breast reconstruction concurrently or delayed post-radiotherapy."
    ],
    evidenceLevel: "Category 1 (NCCN Aligned)",
    references: "NCCN Guidelines: Surgical Management of Invasive Breast Cancer v1.2025"
  },
  {
    id: "gl-6",
    title: "Chemotherapy Guidelines",
    summary: "Standard protocols for anthracycline, taxane, and platinum-based neoadjuvant and adjuvant systemic chemotherapy.",
    protocols: [
      "Neoadjuvant chemotherapy indicated for HER2+ and triple-negative tumors >= T2 or N+ to achieve pathologic complete response.",
      "Adjuvant regimens typically involve Dose-Dense AC followed by Paclitaxel (DD-AC-T).",
      "Utilize genomic assays (e.g. Oncotype DX) to safely omit chemotherapy in ER+/HER2- node-negative patients."
    ],
    evidenceLevel: "Category 1 (ASCO Aligned)",
    references: "ASCO Clinical Practice Guideline: Systemic Therapy for Invasive Breast Cancer"
  },
  {
    id: "gl-7",
    title: "Radiation Therapy Protocols",
    summary: "Dosing and target mapping for Whole Breast Irradiation (WBI), hypofractionation, and post-mastectomy radiation (PMRT).",
    protocols: [
      "Post-lumpectomy WBI is mandatory to decrease local recurrence rates (Standard hypofractionated dose: 40-42.5 Gy in 15-16 fractions).",
      "PMRT indicated for tumors > 50mm or >= 4 positive axillary lymph nodes.",
      "Utilize deep inspiration breath hold (DIBH) techniques during left-breast radiation to protect myocardial tissues."
    ],
    evidenceLevel: "Category 1",
    references: "ASTRO Evidence-Based Guidelines for Radiation Therapy in Breast Cancer"
  },
  {
    id: "gl-8",
    title: "Hormone Therapy Protocols",
    summary: "Endocrine therapy algorithms for premenopausal and postmenopausal hormone receptor-positive (HR+) patients.",
    protocols: [
      "Premenopausal: Tamoxifen for 5-10 years. Consider ovarian function suppression (OFS) plus an Aromatase Inhibitor (AI) for high-risk.",
      "Postmenopausal: Aromatase Inhibitors (Letrozole, Anastrozole, or Exemestane) for 5 years.",
      "Monitor bone mineral density (DEXA scans) every 2 years for patients undergoing AI therapy."
    ],
    evidenceLevel: "Category 1 (ESMO Aligned)",
    references: "ESMO Clinical Guidelines: Endocrine Therapy for Hormone-Receptor Positive Breast Cancer"
  },
  {
    id: "gl-9",
    title: "Targeted Therapy Guidelines",
    summary: "Algorithms for HER2-targeted agents, CDK4/6 inhibitors, and PIK3CA-targeted therapies.",
    protocols: [
      "HER2-positive: Trastuzumab and Pertuzumab combined with chemotherapy. Adjuvant T-DM1 if residual disease exists post-neoadjuvant.",
      "ER+/HER2- metastatic: CDK4/6 inhibitors (Palbociclib, Ribociclib, or Abemaciclib) in combination with endocrine therapy.",
      "Screen for PIK3CA mutation to indicate Alpelisib in resistant HR+ advanced disease."
    ],
    evidenceLevel: "Category 1 (ASCO Aligned)",
    references: "ASCO/NCCN Joint Guidelines on Targeted Therapeutics in Breast Cancer"
  },
  {
    id: "gl-10",
    title: "Immunotherapy Guidelines",
    summary: "Indications for immune checkpoint inhibitors in Triple-Negative Breast Cancer (TNBC).",
    protocols: [
      "Indicate Pembrolizumab combined with chemotherapy neoadjuvantly for high-risk early-stage TNBC.",
      "Continue adjuvant single-agent Pembrolizumab for 9 cycles post-surgery.",
      "Verify PD-L1 expression (CPS >= 10) to indicate Pembrolizumab in metastatic TNBC."
    ],
    evidenceLevel: "Category 2A (FDA Approved)",
    references: "FDA / NCCN Immunotherapy Indications for Breast Carcinoma"
  },
  {
    id: "gl-11",
    title: "Survivorship Care",
    summary: "Protocols for managing long-term treatment sequelae, bone health, cardiovascular health, and distress screening.",
    protocols: [
      "Screen annually for lymphedema, sexual dysfunction, and cognitive changes ('chemobrain').",
      "Implement structured cardiovascular monitoring for patients previously exposed to Anthracyclines or Trastuzumab.",
      "Encourage regular physical activity (150 mins/week) and maintain optimal BMI to decrease recurrence risk."
    ],
    evidenceLevel: "Category 2A",
    references: "ACS / ASCO Breast Cancer Survivorship Care Guideline"
  },
  {
    id: "gl-12",
    title: "Follow-up Recommendations",
    summary: "Surveillance schedules for physical checkups, imaging scans, and laboratory parameters post-treatment.",
    protocols: [
      "Clinical checkups: Every 3-6 months for the first 3 years, every 6-12 months for years 4-5, and annually thereafter.",
      "Bilateral mammography: Annually, starting 6-12 months post-radiotherapy completion.",
      "Routine blood work, tumor markers (CA 15-3, CEA), and bone scans are NOT recommended for asymptomatic patients."
    ],
    evidenceLevel: "Category 1 (NCCN Aligned)",
    references: "NCCN Clinical Guidelines: Follow-up and Surveillance of Primary Breast Cancer"
  }
];

const researchArticlesData: ResearchArticle[] = [
  {
    id: "art-1",
    title: "AI-Driven Mammographic Staging: A Multi-Center Study",
    category: "Diagnostics & AI",
    publishDate: "June 15, 2026",
    journal: "Journal of Clinical Oncology",
    summary: "This study evaluates the accuracy of deep-learning algorithms in detecting microcalcifications and staging lesions in dense breast tissues across 15 global medical centers.",
    conclusions: "AI models achieved a sensitivity of 94.2% compared to 88.5% for traditional radiologist reviews, reducing false-positive biopsy referrals by 18.3%.",
    authors: "Dr. Elena Rostova, Dr. Amit Patel, et al."
  },
  {
    id: "art-2",
    title: "Trastuzumab Deruxtecan in HER2-Low Metastatic Breast Cancer",
    category: "Therapies",
    publishDate: "May 28, 2026",
    journal: "New England Journal of Medicine",
    summary: "A randomized Phase III trial comparing Trastuzumab Deruxtecan (T-DXd) against physician's choice chemotherapy in patients with HER2-low, hormone-receptor-positive metastatic breast cancer.",
    conclusions: "Progression-free survival was significantly longer in the T-DXd group (10.1 months) compared to standard chemotherapy (5.4 months), representing a milestone in target grouping.",
    authors: "Dr. Shanu Modi, Dr. Maria Jacot, et al."
  },
  {
    id: "art-3",
    title: "BRCA1 & BRCA2 Penetrance and Risk Reduction Mastectomy Outcomes",
    category: "Genetics",
    publishDate: "April 10, 2026",
    journal: "JAMA Oncology",
    summary: "A 10-year prospective registry evaluating the risk-reduction efficacy of bilateral prophylactic mastectomy in women carrying pathogenic BRCA1/BRCA2 mutations.",
    conclusions: "Prophylactic surgery reduced the breast cancer incidence rate by 99.1% in gene-positive carriers, with no deaths recorded due to breast cancer during the 10-year follow-up.",
    authors: "Dr. Susan Domchek, Dr. Mark Robson, et al."
  },
  {
    id: "art-4",
    title: "Neoadjuvant Pembrolizumab in Triple-Negative Breast Cancer (TNBC)",
    category: "Clinical Trials",
    publishDate: "March 22, 2026",
    journal: "The Lancet Oncology",
    summary: "Long-term event-free survival outcomes from the KEYNOTE-522 trial, evaluating neoadjuvant pembrolizumab plus chemotherapy followed by adjuvant pembrolizumab in TNBC.",
    conclusions: "The addition of pembrolizumab resulted in a statistically significant 37% reduction in disease recurrence or death compared to chemotherapy alone, confirming neoadjuvant checkpoint standards.",
    authors: "Dr. Peter Schmid, Dr. Javier Cortes, et al."
  },
  {
    id: "art-5",
    title: "Circulating Tumor DNA (ctDNA) for Molecular Recurrence Monitoring",
    category: "Genetics",
    publishDate: "February 18, 2026",
    journal: "Nature Medicine",
    summary: "Investigating the utility of personalized, tumor-informed ctDNA assays to detect molecular residual disease (MRD) and predict clinical relapse post-neoadjuvant treatment.",
    conclusions: "ctDNA detection preceded clinical recurrence by a median of 8.9 months, offering a critical window for early therapeutic intervention in high-risk patients.",
    authors: "Dr. Charles Coombes, Dr. Sarah-Jane Dawson, et al."
  },
  {
    id: "art-6",
    title: "Deep Learning in Digitized Pathology: Mitotic Figure Counting",
    category: "Diagnostics & AI",
    publishDate: "January 05, 2026",
    journal: "Modern Pathology",
    summary: "Developing and validating automated mitotic figure counting algorithms in whole-slide digitized pathology images to standardize Nottingham histological grading.",
    conclusions: "The neural network model matched consensus pathologist mitotic scores with an F1-score of 0.88, significantly reducing inter-observer grading variability in routine pathology.",
    authors: "Dr. Johan Hartman, Dr. Viktor Linder, et al."
  }
];

const cmeCoursesData: CMECourse[] = [
  {
    id: "cme-1",
    title: "Advanced Oncoplastic Breast Surgery Techniques",
    format: "Surgical Workshop",
    credits: "4.5 AMA PRA Category 1 Credits",
    duration: "4 Hours (Self-paced)",
    instructor: "Dr. Rajesh Dev, Senior Breast Surgeon",
    syllabus: [
      "Oncoplastic volume displacement techniques (Therapeutic mammoplasty).",
      "Sentinel node localization using indocyanine green (ICG) fluorescence.",
      "Achieving negative margins in lumpectomies: Margin shaving protocols."
    ]
  },
  {
    id: "cme-2",
    title: "Genomic Assays and Personalized Breast Oncology",
    format: "Online Course",
    credits: "2.0 AMA PRA Category 1 Credits",
    duration: "2 Hours (Video lectures + Quiz)",
    instructor: "Dr. Sandra Miller, Medical Geneticist",
    syllabus: [
      "Interpreting Oncotype DX Recurrence Scores in node-positive and node-negative disease.",
      "Clinical utility of MammaPrint, EndoPredict, and Prosigna assays.",
      "Case studies: Omitting adjuvant chemotherapy in HR+/HER2- patients."
    ]
  },
  {
    id: "cme-3",
    title: "Modern Management of Triple-Negative Breast Cancer",
    format: "Recorded Seminar",
    credits: "1.5 AMA PRA Category 1 Credits",
    duration: "90 Minutes",
    instructor: "Dr. Vivek Kumar, Medical Oncologist",
    syllabus: [
      "Molecular subtypes of TNBC and therapeutic implications.",
      "Combining checkpoint inhibitors with neoadjuvant taxane-carboplatin regimens.",
      "PARP inhibitors in gBRCA-mutated advanced triple-negative disease."
    ]
  }
];

const specialistRolesData: SpecialistRole[] = [
  {
    id: "breast-surgeon",
    name: "Breast Surgeon / Surgical Oncologist",
    icon: Stethoscope,
    responsibilities: [
      "Performs surgical excision of localized breast tumors (lumpectomy, mastectomy).",
      "Executes sentinel lymph node biopsy (SLNB) and axillary lymph node dissection (ALND).",
      "Coordinates immediate or delayed reconstruction options with plastic surgeons."
    ],
    patientRole: "Initial surgical evaluation, staging, tumor removal, and post-operative follow-up.",
    collaboration: "Leads surgical decisions in multidisciplinary tumor boards, coordinating with radiation and medical oncologists."
  },
  {
    id: "medical-oncologist",
    name: "Medical Oncologist",
    icon: Pill,
    responsibilities: [
      "Prescribes and manages neoadjuvant and adjuvant systemic chemotherapy regimens.",
      "Directs endocrine (hormonal) therapies and biological/targeted agents (HER2 inhibitors).",
      "Monitors systemic side effects, organ functions, and overall treatment tolerance."
    ],
    patientRole: "Manages chemotherapy sessions, targeted drug therapy, long-term survivorship endocrine plans.",
    collaboration: "Integrates systemic protocols post-surgery, verifying tumor receptor status with pathologists."
  },
  {
    id: "radiation-oncologist",
    name: "Radiation Oncologist",
    icon: Zap,
    responsibilities: [
      "Determines the necessity and target fields for adjuvant external beam radiation therapy.",
      "Calculates precise radiotherapy dosing, fraction spacing, and heart/lung shielding.",
      "Manages acute radiation dermatitis and long-term tissue fibrosis side effects."
    ],
    patientRole: "Conducts mapping CT scans, designs radiation masks, oversees daily radiotherapy fractions.",
    collaboration: "Works closely with breast surgeons to map surgical margins and clips for targeted boosts."
  },
  {
    id: "radiologist",
    name: "Radiologist",
    icon: Activity,
    responsibilities: [
      "Interprets screening and diagnostic mammograms, ultrasounds, and breast MRIs.",
      "Performs image-guided needle localization and stereotactic core biopsies.",
      "Assesses tumor size and regional lymph node involvement on baseline imaging scans."
    ],
    patientRole: "Conducts imaging examinations, localized biopsies, and tumor response surveillance scans.",
    collaboration: "Presents diagnostic imaging findings at multidisciplinary tumor boards to guide staging."
  },
  {
    id: "pathologist",
    name: "Pathologist",
    icon: Microscope,
    responsibilities: [
      "Analyzes biopsy cores and surgical specimens to verify cancer presence and histological type.",
      "Determines tumor grade, surgical margin clearance, and lymph node metastasis pathological counts.",
      "Tests tissue markers via immunohistochemistry for ER, PR, HER2, and Ki-67 indexes."
    ],
    patientRole: "Generates the definitive diagnostic pathology report, staging index, and mutation markers.",
    collaboration: "Validates diagnostic staging at tumor boards, ensuring specimen margins match surgeon clips."
  },
  {
    id: "genetic-counselor",
    name: "Genetic Counselor",
    icon: Dna,
    responsibilities: [
      "Evaluates patient family histories to identify hereditary breast cancer syndrome risks.",
      "Orders and interprets sequencing tests for BRCA1, BRCA2, PALB2, and other genes.",
      "Counsels patients on risk-reduction options (prophylactic surgeries, enhanced screening)."
    ],
    patientRole: "Provides hereditary risk analysis, pre-test and post-test genetic consultation.",
    collaboration: "Advises surgical and medical oncologists on BRCA-positive patient management algorithms."
  }
];

const decisionWorkflowStepsData: DecisionWorkflowStep[] = [
  {
    step: "01",
    title: "Patient Assessment",
    desc: "Initial clinical evaluation, medical history compilation, and lifetime risk assessment scoring.",
    clinicalChecklist: [
      "Record comprehensive family history (3 generations).",
      "Calculate Gail Model 5-year risk score.",
      "Perform bilateral physical breast examination."
    ],
    guidelinesLink: "Breast Cancer Screening Guidelines"
  },
  {
    step: "02",
    title: "Imaging Interpretation",
    desc: "Diagnostic mammography, high-resolution ultrasound, and breast MRI evaluation.",
    clinicalChecklist: [
      "Classify findings using BI-RADS scoring.",
      "Determine tumor size parameters on ultrasound.",
      "Assess contralateral breast with MRI if high-risk."
    ],
    guidelinesLink: "Diagnosis Workflow"
  },
  {
    step: "03",
    title: "Biopsy Review",
    desc: "Tissue extraction, tumor grading, and immunohistochemical marker analysis.",
    clinicalChecklist: [
      "Verify histologic type (Ductal vs. Lobular).",
      "Confirm ER, PR, and HER2 receptor status.",
      "Report Nottingham Histologic Grade."
    ],
    guidelinesLink: "Early Detection Protocols"
  },
  {
    step: "04",
    title: "Staging",
    desc: "Integrating clinical, imaging, and pathological parameters to define tumor stage.",
    clinicalChecklist: [
      "Apply AJCC 8th Edition staging criteria.",
      "Verify pathological lymph node counts.",
      "Confirm presence or absence of distant metastasis."
    ],
    guidelinesLink: "TNM Staging System"
  },
  {
    step: "05",
    title: "Treatment Planning",
    desc: "Structuring neoadjuvant, surgical, adjuvant, and endocrine therapy protocols.",
    clinicalChecklist: [
      "Select candidates for neoadjuvant chemotherapy.",
      "Assess eligibility for breast-conserving surgery.",
      "Review indications for genomic recurrence assays."
    ],
    guidelinesLink: "Surgical Management"
  },
  {
    step: "06",
    title: "Multidisciplinary Tumor Board",
    desc: "Collective specialist panel review to customize and validate treatment plans.",
    clinicalChecklist: [
      "Correlate radiologic findings with pathology specimens.",
      "Confirm surgical margins and node clearances.",
      "Agree on adjuvant chemotherapy/radiation sequences."
    ],
    guidelinesLink: "Chemotherapy Guidelines"
  },
  {
    step: "07",
    title: "Follow-up Planning",
    desc: "Defining long-term clinical checkups and imaging surveillance schedules.",
    clinicalChecklist: [
      "Schedule annual diagnostic mammograms.",
      "Plan clinical exams every 3-6 months for Year 1-3.",
      "Implement symptom surveillance guidelines."
    ],
    guidelinesLink: "Follow-up Recommendations"
  },
  {
    step: "08",
    title: "Survivorship Management",
    desc: "Addressing chronic side effects, cardiotoxicity monitoring, and supportive care.",
    clinicalChecklist: [
      "Perform regular DEXA bone density scans for AIs.",
      "Screen for and manage treatment-related lymphedema.",
      "Coordinate clinical psychologist referals."
    ],
    guidelinesLink: "Survivorship Care"
  }
];

const professionalResourcesData: ProfessionalResource[] = [
  {
    id: "res-1",
    title: "NCCN Breast Cancer Clinical Guidelines 2025",
    size: "4.8 MB",
    format: "PDF",
    desc: "Complete evidence-based algorithms for screening, staging, neoadjuvant, surgical, and adjuvant oncology."
  },
  {
    id: "res-2",
    title: "AJCC 8th Edition Breast Cancer Staging Reference",
    size: "1.2 MB",
    format: "PDF",
    desc: "Comprehensive tables mapping tumor sizes, nodal involvement, and biomarkers to prognostic stages."
  },
  {
    id: "res-3",
    title: "CAP Structured Pathology Reporting Template",
    size: "680 KB",
    format: "DOCX",
    desc: "College of American Pathologists checklist for reporting surgical resection specimens."
  },
  {
    id: "res-4",
    title: "BI-RADS Mammography Assessment Protocol Booklet",
    size: "3.5 MB",
    format: "PDF",
    desc: "Standardized imaging report lexicon, assessment codes (0-6), and recommendation guidelines."
  },
  {
    id: "res-5",
    title: "Adjuvant Endocrine Therapy Treatment Algorithms",
    size: "2.1 MB",
    format: "PDF",
    desc: "Decision flowcharts for premenopausal and postmenopausal HR+ patients under ASCO guidelines."
  },
  {
    id: "res-6",
    title: "Post-Treatment Oncology Follow-up Checklist",
    size: "420 KB",
    format: "PDF",
    desc: "A clinical chart reference listing examination schedules, scan intervals, and symptom checks."
  }
];

const eventsData: EventItem[] = [
  {
    id: "ev-1",
    title: "International Breast Cancer Symposium 2026",
    date: "September 12-14, 2026",
    speaker: "Keynote: Dr. Harold Varmus, Nobel Laureate",
    format: "Hybrid",
    location: "Tata Memorial Hall, Mumbai / Virtual",
    credits: "12.0 AMA PRA Category 1 Credits"
  },
  {
    id: "ev-2",
    title: "CDK4/6 Inhibitor Therapeutics: Clinical Cases",
    date: "August 05, 2026",
    speaker: "Dr. Priya Sen, Senior Medical Oncologist",
    format: "Virtual Webinar",
    location: "Online Zoom Portal",
    credits: "1.5 AMA PRA Category 1 Credits"
  },
  {
    id: "ev-3",
    title: "CME Workshop: Automated Breast Ultrasound (ABUS) in Dense Breasts",
    date: "August 20, 2026",
    speaker: "Dr. Karen Vance, Radiology Specialist",
    format: "In-Person Workshop",
    location: "Apex Diagnostics Center, New Delhi",
    credits: "3.0 AMA PRA Category 1 Credits"
  }
];

const faqsData: FAQItem[] = [
  {
    question: "How can I join the GRS Breast Cancer professional network?",
    answer: "You can click on 'Join Healthcare Network' in the Hero section or the final CTA. Fill out the membership form with your license number, specialty, and hospital affiliation. Once verified by our advisory board, your profile will be added to our referral network."
  },
  {
    question: "How can I submit my research or clinical trials?",
    answer: "Registered members can submit manuscripts, clinical trial abstracts, or digitized pathology case studies through the Research Collaboration portal. Under the Professional Community section, select 'Submit Research' to upload documents for board review."
  },
  {
    question: "Are CME certificates available for courses and webinars?",
    answer: "Yes. GRS is accredited to award Continuing Medical Education (CME) credits. After attending a qualifying webinar or completing a learning center module, you will be directed to a short evaluation quiz. A passing score of 70% or higher generates a downloadable CME PDF."
  },
  {
    question: "How do I participate in surgical workshops and symposia?",
    answer: "Upcoming workshops and symposia are listed under the 'Webinars & Upcoming Events' section. Simply click 'Register Now' on the event card, complete the license verification form, and you will receive an entry pass and study material link."
  },
  {
    question: "Can hospitals and universities collaborate with GRS?",
    answer: "Yes, we encourage institution-wide collaborations. We partner with hospitals for referral programs, universities for genomic research, and diagnostic labs for mobile screening drives. Select 'Become a Research Partner' to connect with our administrative team."
  },
  {
    question: "How can I become a volunteer specialist?",
    answer: "If you are a breast surgeon, radiologist, oncologist, or clinical counselor, you can volunteer to screen patients at our rural mobile camps or provide pro-bono tele-consultations. Click 'Become a Volunteer Doctor' in the community panel to sign up."
  }
];

export default function HealthcareProfessionalsPage() {
  // ----------------------------------------------------------------------
  // State variables
  // ----------------------------------------------------------------------
  const [researchSearch, setResearchSearch] = useState("");
  const [researchCategory, setResearchCategory] = useState("All");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Selection logic for decision workflow timeline
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(0);

  // Specialist roles detailed select
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>("breast-surgeon");

  // Modals state
  const [selectedGuideline, setSelectedGuideline] = useState<Guideline | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ResearchArticle | null>(null);
  const [joinNetworkOpen, setJoinNetworkOpen] = useState(false);
  const [cmeEnrollCourse, setCmeEnrollCourse] = useState<CMECourse | null>(null);
  const [eventRegisterItem, setEventRegisterItem] = useState<EventItem | null>(null);
  const [partnerRequestOpen, setPartnerRequestOpen] = useState(false);
  const [volunteerOpen, setVolunteerOpen] = useState(false);

  // Form inputs
  const [licenseNumber, setLicenseNumber] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorSpecialty, setDoctorSpecialty] = useState("Oncology");
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  // Partner form inputs
  const [partnerName, setPartnerName] = useState("");
  const [partnerInst, setPartnerInst] = useState("");
  const [partnerArea, setPartnerArea] = useState("Genomics");
  const [partnerMsg, setPartnerMsg] = useState("");
  const [partnerSuccess, setPartnerSuccess] = useState(false);
  const [partnerLoading, setPartnerLoading] = useState(false);

  // Volunteer form inputs
  const [volName, setVolName] = useState("");
  const [volEmail, setVolEmail] = useState("");
  const [volPhone, setVolPhone] = useState("");
  const [volSpec, setVolSpec] = useState("");
  const [volSuccess, setVolSuccess] = useState(false);
  const [volLoading, setVolLoading] = useState(false);

  // CME enrollment form
  const [cmeEmail, setCmeEmail] = useState("");
  const [cmeLicense, setCmeLicense] = useState("");
  const [cmeSuccess, setCmeSuccess] = useState(false);
  const [cmeLoading, setCmeLoading] = useState(false);

  // Event registration form
  const [eventEmail, setEventEmail] = useState("");
  const [eventLicense, setEventLicense] = useState("");
  const [eventSuccess, setEventSuccess] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);

  // Download states
  const [downloadingRes, setDownloadingRes] = useState<string | null>(null);
  const [downloadedRes, setDownloadedRes] = useState<Record<string, boolean>>({});

  // ----------------------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------------------
  const handleDownload = (id: string) => {
    setDownloadingRes(id);
    setTimeout(() => {
      setDownloadingRes(null);
      setDownloadedRes(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setDownloadedRes(prev => ({ ...prev, [id]: false }));
      }, 3000);
    }, 1500);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName || !doctorEmail || !licenseNumber) {
      alert("Please fill in all details.");
      return;
    }
    setJoinLoading(true);
    setTimeout(() => {
      setJoinLoading(false);
      setJoinSuccess(true);
    }, 1200);
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName || !partnerInst) {
      alert("Please fill in contact name and institution.");
      return;
    }
    setPartnerLoading(true);
    setTimeout(() => {
      setPartnerLoading(false);
      setPartnerSuccess(true);
    }, 1200);
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volName || !volEmail || !volPhone) {
      alert("Please complete the volunteer form.");
      return;
    }
    setVolLoading(true);
    setTimeout(() => {
      setVolLoading(false);
      setVolSuccess(true);
    }, 1200);
  };

  const handleCmeEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmeEmail || !cmeLicense) {
      alert("Please enter email and license.");
      return;
    }
    setCmeLoading(true);
    setTimeout(() => {
      setCmeLoading(false);
      setCmeSuccess(true);
    }, 1200);
  };

  const handleEventRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventEmail || !eventLicense) {
      alert("Please provide email and clinical license.");
      return;
    }
    setEventLoading(true);
    setTimeout(() => {
      setEventLoading(false);
      setEventSuccess(true);
    }, 1200);
  };

  const resetJoinForm = () => {
    setJoinNetworkOpen(false);
    setDoctorName("");
    setDoctorEmail("");
    setLicenseNumber("");
    setJoinSuccess(false);
  };

  const resetPartnerForm = () => {
    setPartnerRequestOpen(false);
    setPartnerName("");
    setPartnerInst("");
    setPartnerMsg("");
    setPartnerSuccess(false);
  };

  const resetVolunteerForm = () => {
    setVolunteerOpen(false);
    setVolName("");
    setVolEmail("");
    setVolPhone("");
    setVolSpec("");
    setVolSuccess(false);
  };

  const resetCmeForm = () => {
    setCmeEnrollCourse(null);
    setCmeEmail("");
    setCmeLicense("");
    setCmeSuccess(false);
  };

  const resetEventForm = () => {
    setEventRegisterItem(null);
    setEventEmail("");
    setEventLicense("");
    setEventSuccess(false);
  };

  // Research filter logic
  const filteredArticles = researchArticlesData.filter(article => {
    const matchesSearch =
      article.title.toLowerCase().includes(researchSearch.toLowerCase()) ||
      article.summary.toLowerCase().includes(researchSearch.toLowerCase()) ||
      article.authors.toLowerCase().includes(researchSearch.toLowerCase()) ||
      article.journal.toLowerCase().includes(researchSearch.toLowerCase());

    const matchesCategory =
      researchCategory === "All" || article.category === researchCategory;

    return matchesSearch && matchesCategory;
  });

  const researchCategories = ["All", "Diagnostics & AI", "Therapies", "Genetics", "Clinical Trials"];

  const currentSpecialist = specialistRolesData.find(s => s.id === selectedSpecialist) || specialistRolesData[0];

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex-1 w-full bg-slate-50 text-slate-800 selection:bg-pink-100 selection:text-pink-700 overflow-x-hidden">

      {/* ----------------------------------------------------------------------
          1. HERO SECTION
          ---------------------------------------------------------------------- */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/13.png"
            alt="Oncology team collaborating"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.38] contrast-105 pointer-events-none"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-pink-950/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-95" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10 py-24 text-center sm:text-left">
          <div className="max-w-3xl space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider"
            >
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              Evidence-Based Portal
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
            >
              Advancing Breast Cancer Care <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400">
                Through Knowledge &amp; Collaboration.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-350 text-base sm:text-lg lg:text-xl leading-relaxed font-sans"
            >
              Empowering healthcare professionals, surgeons, researchers, and medical students with peer-reviewed research, clinical practice guidelines, education, and clinical decision supports.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start pt-2"
            >
              <Button
                onClick={() => scrollToId("clinical-guidelines-section")}
                className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-blue-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
              >
                Explore Clinical Resources
                <ArrowRight className="h-5 w-5 ml-1.5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setJoinNetworkOpen(true)}
                className="border-slate-400 text-blue hover:bg-blue/10 hover:text-blue font-bold px-8 py-6 rounded-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
              >
                Join Professional Network
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          2. ABOUT BREAST CANCER RESEARCH
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-10 right-0 w-80 h-80 bg-blue-50/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-80 h-80 bg-purple-50/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
              <Activity className="h-4 w-4" />
              Research &amp; Efficacy
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Translating Research into Patient Survival
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Advancements in clinical trials, biomarkers, and digitized path counts translate directly to therapeutic success rates and surgical safety.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Metrics */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-blue-50/40 border border-blue-150/40 shadow-2xs flex flex-col justify-between hover:shadow-sm transition-all duration-300">
                <div className="h-10 w-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center">
                  <Microscope className="h-5 w-5 text-blue-600" />
                </div>
                <div className="mt-8">
                  <h4 className="text-3xl font-black text-slate-800 tracking-tight">100+</h4>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Research Projects</p>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Analyzing local genetic mutations, tissue staging indices, and bio-banking.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-purple-50/40 border border-purple-150/40 shadow-2xs flex flex-col justify-between hover:shadow-sm transition-all duration-300">
                <div className="h-10 w-10 rounded-xl bg-white border border-purple-200 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                </div>
                <div className="mt-8">
                  <h4 className="text-3xl font-black text-slate-800 tracking-tight">5,000+</h4>
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mt-1">CME Hours Awarded</p>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Supporting primary gynecologists and oncologists with modern training tools.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-pink-50/40 border border-pink-150/40 shadow-2xs flex flex-col justify-between hover:shadow-sm transition-all duration-300">
                <div className="h-10 w-10 rounded-xl bg-white border border-pink-200 flex items-center justify-center">
                  <Users2 className="h-5 w-5 text-pink-600" />
                </div>
                <div className="mt-8">
                  <h4 className="text-3xl font-black text-slate-800 tracking-tight">40+</h4>
                  <p className="text-xs font-bold text-pink-600 uppercase tracking-widest mt-1">Partner Institutions</p>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Collaborating with universities and hospitals for tumor genomic profiling.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-cyan-50/40 border border-cyan-150/40 shadow-2xs flex flex-col justify-between hover:shadow-sm transition-all duration-300">
                <div className="h-10 w-10 rounded-xl bg-white border border-cyan-200 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-cyan-600" />
                </div>
                <div className="mt-8">
                  <h4 className="text-3xl font-black text-slate-800 tracking-tight">100%</h4>
                  <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mt-1">Evidence-Based</p>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    All guidelines map direct validation under AJCC, NCCN, and ASCO benchmarks.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Information */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800">
                Fostering Collaboration Across Oncology Disciplines
              </h3>
              <p className="text-slate-650 leading-relaxed text-sm sm:text-base font-sans">
                Precision medicine is not built in isolation. Designing effective algorithms for triple-negative breast cancer (TNBC) or hormone-receptor-positive (HR+) disease relies on path diagnostics, biomarker analytics, and radiation dosing synchronization. Our portal coordinates these workflows in one central exchange.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  {
                    title: "Standardized Staging & Grading",
                    desc: "Incorporate AJCC 8th edition prognostic factors alongside Ki-67 and HER2 indices to ensure diagnostic consistency."
                  },
                  {
                    title: "Advanced Targeted Therapeutics",
                    desc: "Review trials for antibody-drug conjugates (ADCs) and CDK4/6 inhibitors to establish custom adjuvant options."
                  },
                  {
                    title: "Tumor Board Synchronization",
                    desc: "Utilize decision workflows to map patient parameters from physical triage down to post-treatment survivorship."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                      <Check className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm font-heading">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed font-sans">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          FEATURED CLINICAL VIDEO LECTURE (Dr. Aurag Recommendation)
          ---------------------------------------------------------------------- */}
      <section className="py-20 bg-gradient-to-tr from-blue-50/30 via-white to-purple-50/30 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-slate-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Video Player (Left/Top) */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden border border-slate-250 bg-slate-950 shadow-lg aspect-video">
                <video
                  controls
                  preload="metadata"
                  className="w-full h-full object-cover"
                  poster="/images/13.png"
                >
                  <source src="/euhbbZb3sNXxgOi6g2MF+42G6uUncFHU.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Video Information (Right/Bottom) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider">
                  <HeartPulse className="h-3.5 w-3.5" />
                  Clinical Briefing
                </div>
                <h3 className="font-heading text-2xl font-black text-slate-800 tracking-tight leading-tight">
                  Featured Staging &amp; Diagnosis Review
                </h3>
                <p className="text-xs text-slate-500 font-bold font-sans">
                  Recommended by <span className="text-blue-600">Dr. Aurag</span> — Breast Oncology Specialist &amp; Advisor
                </p>
              </div>

              <p className="text-slate-650 text-sm leading-relaxed font-sans">
                This comprehensive clinical video covers modern tumor board guidelines, biopsy evaluations, and targeted diagnostic screenings for primary care physicians and surgeons.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { title: "Standardized BI-RADS Staging", desc: "How to unify diagnostic scan results with clinical pathways." },
                  { title: "Early Detection Benchmarks", desc: "Criteria for immediate tissue biopsies and referral." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                      <Check className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-850 font-heading">{item.title}</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          3. CLINICAL GUIDELINES & BEST PRACTICES
          ---------------------------------------------------------------------- */}
      <section id="clinical-guidelines-section" className="py-24 bg-gradient-to-b from-slate-50 to-blue-50/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
              <FileText className="h-4 w-4" />
              Standard Practice
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Oncology Guidelines &amp; Clinical Protocols
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Access guidelines aligned with ASCO, NCCN, and ESMO benchmarks for diagnosis, surgery, systemic chemotherapy, and hormone therapies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guidelinesData.map((gl) => (
              <div
                key={gl.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-wider font-heading">
                      {gl.evidenceLevel}
                    </span>
                  </div>
                  <h4 className="font-heading text-base font-extrabold text-slate-805 group-hover:text-blue-600 transition-colors">
                    {gl.title}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-sans line-clamp-3">
                    {gl.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedGuideline(gl)}
                    className="w-full rounded-xl border-slate-250 text-slate-700 hover:bg-slate-50 font-bold text-xs py-2.5 h-10 cursor-pointer"
                  >
                    Read Protocols
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          4. RESEARCH & INNOVATION HUB
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider border border-pink-100">
              <Microscope className="h-4 w-4" />
              Oncology Innovation
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Research &amp; Innovation Board
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Explore the latest peer-reviewed studies, diagnostic AI trials, BRCA mutations registries, and emerging systemic therapy abstracts.
            </p>
          </div>

          {/* Search and category filters */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/50 shadow-md mb-12 space-y-5">
            <div className="relative">
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search research abstracts by title, keywords, authors, or journal..."
                value={researchSearch}
                onChange={(e) => setResearchSearch(e.target.value)}
                className="pl-12 bg-white border-slate-200 h-12 rounded-xl focus-visible:ring-blue-500 text-sm font-sans"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/50">
              {researchCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setResearchCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${researchCategory === cat
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-350 text-slate-650"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Research Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((art) => (
                  <motion.div
                    key={art.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-slate-50 hover:bg-white rounded-3xl p-6 border border-slate-200/40 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-0.5 rounded bg-pink-50 text-pink-650 text-[10px] font-bold uppercase tracking-wider font-heading">
                          {art.category}
                        </span>
                        <span className="text-[10px] text-slate-450 font-bold font-sans">{art.publishDate}</span>
                      </div>
                      <h4 className="font-heading text-base font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                        {art.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold font-heading mt-1.5 uppercase tracking-wide">
                        Journal: {art.journal}
                      </p>
                      <p className="text-slate-500 text-xs leading-relaxed font-sans mt-3 line-clamp-3">
                        {art.summary}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200/50">
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedArticle(art)}
                        className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 font-bold text-xs rounded-xl h-10 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        Read Abstract
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center space-y-4">
                  <AlertCircle className="h-12 w-12 text-slate-350 mx-auto animate-bounce" />
                  <h3 className="font-heading text-lg font-bold text-slate-700">No Articles Found</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto font-sans">
                    We couldn&apos;t find any oncology abstracts matching &ldquo;{researchSearch}&rdquo;. Try selecting &apos;All&apos; or modifying your terms.
                  </p>
                  <Button
                    onClick={() => {
                      setResearchSearch("");
                      setResearchCategory("All");
                    }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-5 py-2 rounded-xl cursor-pointer"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          5. PROFESSIONAL LEARNING CENTER
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-gradient-to-tr from-blue-50/40 via-purple-50/15 to-pink-50/30 border-y border-slate-200/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
              <GraduationCap className="h-4 w-4" />
              Continuing Education
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Professional Learning Center &amp; CME Catalog
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Earn certified CME credit hours by attending live surgical workshops, recorded tumor boards, and oncology diagnostic courses.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {cmeCoursesData.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-4 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider font-heading">
                      {course.format}
                    </span>
                    <span className="text-[10px] text-emerald-650 font-bold flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" />
                      {course.credits}
                    </span>
                  </div>
                  <h4 className="font-heading text-base font-extrabold text-slate-800 leading-snug">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    {course.instructor}
                  </p>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Syllabus Overview</h5>
                    <ul className="space-y-1.5 text-xs text-slate-500">
                      {course.syllabus.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                  <div className="text-center bg-slate-50 rounded-xl py-2 flex flex-col justify-center border border-slate-100">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Duration</span>
                    <span className="text-xs font-bold text-slate-700">{course.duration}</span>
                  </div>
                  <Button
                    onClick={() => setCmeEnrollCourse(course)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Enroll Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          6. MULTIDISCIPLINARY BREAST CANCER TEAM
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider border border-purple-100">
              <Users2 className="h-4 w-4" />
              Core Disciplines
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              The Multidisciplinary Tumor Board
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Click on any oncology role below to review their core diagnostic/surgical duties, patient interaction points, and clinical collaboration parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left selector */}
            <div className="lg:col-span-5 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-4 lg:pb-0 scrollbar-none max-h-[500px] lg:overflow-y-auto pr-0 lg:pr-3">
              {specialistRolesData.map((spec) => {
                const SpecIcon = spec.icon;
                const isSelected = selectedSpecialist === spec.id;
                return (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedSpecialist(spec.id)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left cursor-pointer transition-all shrink-0 select-none ${isSelected
                      ? "bg-white border-blue-500 text-blue-600 shadow-md scale-[1.02]"
                      : "bg-white border-slate-100 hover:border-slate-350 text-slate-650 shadow-xs"
                      }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? "bg-blue-100 text-blue-600" : "bg-slate-50 text-slate-400"}`}>
                      <SpecIcon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold tracking-tight whitespace-nowrap font-heading">{spec.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Display */}
            <div className="lg:col-span-7 h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedSpecialist}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-xl relative overflow-hidden"
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-100/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-blue-55 border border-blue-100 text-blue-600 shrink-0">
                      {React.createElement(currentSpecialist.icon, { className: "h-8 w-8" })}
                    </div>
                    <div>
                      <h3 className="font-heading text-2xl font-black text-slate-800">{currentSpecialist.name}</h3>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-heading">Board Discipline</span>
                    </div>
                  </div>

                  <div className="space-y-6 font-sans">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-heading">Core Clinical Duties</h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                        {currentSpecialist.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="h-4 w-4 rounded-full bg-blue-100 text-[10px] font-bold flex items-center justify-center shrink-0 text-blue-600 mt-0.5">{i + 1}</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 mb-1 font-heading">Patient Contact Role</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">{currentSpecialist.patientRole}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 mb-1 font-heading">Board Collaboration</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">{currentSpecialist.collaboration}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          7. CLINICAL DECISION SUPPORT
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-purple-950 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
              <Activity className="h-4 w-4" />
              Decision Algorithms
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Clinical Decision Support Pathway
            </h2>
            <p className="text-slate-350 text-sm sm:text-base leading-relaxed">
              Standardized workflow sequence from baseline history compilation up to post-surgical tissue margins review. Select a phase to see the checklist.
            </p>
          </div>

          {/* Horizontal Step Selector */}
          <div className="relative mb-10 pb-4 overflow-x-auto scrollbar-none">
            {/* Connector */}
            <div className="hidden md:block absolute top-7 left-8 right-8 h-1 bg-white/10 z-0" />

            <div className="flex md:justify-between items-center min-w-[900px] md:min-w-0 relative z-10 px-4">
              {decisionWorkflowStepsData.map((stepItem, idx) => {
                const isSelected = activeWorkflowStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveWorkflowStep(idx)}
                    className="flex flex-col items-center gap-2 focus:outline-none cursor-pointer shrink-0"
                  >
                    <div
                      className={`h-14 w-14 rounded-full border-3 flex items-center justify-center transition-all duration-300 font-heading text-base font-black ${isSelected
                        ? "bg-blue-600 border-blue-400 scale-110 shadow-lg shadow-blue-600/30 text-white"
                        : "bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-400"
                        }`}
                    >
                      {stepItem.step}
                    </div>
                    <span className={`text-[10px] font-bold tracking-wider uppercase ${isSelected ? "text-blue-400" : "text-slate-500"} font-heading`}>
                      Step {stepItem.step}
                    </span>
                    <span className={`text-xs font-bold text-center max-w-[100px] truncate ${isSelected ? "text-white" : "text-slate-400"} font-heading`}>
                      {stepItem.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Display Phase details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeWorkflowStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 text-blue-500/10 font-black text-8xl md:text-9xl pointer-events-none select-none">
                {decisionWorkflowStepsData[activeWorkflowStep].step}
              </div>

              <div className="flex items-center gap-3.5 mb-6">
                <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-blue-400 text-xs font-bold uppercase tracking-widest font-heading">Decision Node</span>
                  <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">{decisionWorkflowStepsData[activeWorkflowStep].title}</h3>
                </div>
              </div>

              <p className="text-slate-350 text-sm sm:text-base leading-relaxed max-w-3xl font-sans">
                {decisionWorkflowStepsData[activeWorkflowStep].desc}
              </p>

              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-heading">Clinical Checklist Guide</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {decisionWorkflowStepsData[activeWorkflowStep].clinicalChecklist.map((ch, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-300 text-xs sm:text-sm">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{ch}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">References Guideline: <span className="font-bold text-slate-300">{decisionWorkflowStepsData[activeWorkflowStep].guidelinesLink}</span></span>
                <Button
                  size="sm"
                  onClick={() => {
                    const matchedGL = guidelinesData.find(g => g.title === decisionWorkflowStepsData[activeWorkflowStep].guidelinesLink);
                    if (matchedGL) {
                      setSelectedGuideline(matchedGL);
                    } else {
                      scrollToId("clinical-guidelines-section");
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  View Full Guideline
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          8. PROFESSIONAL RESOURCES (DOWNLOADS SECTION)
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
              <Download className="h-4 w-4" />
              Medical Assets
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Standard Staging Guides &amp; Reporting Checklists
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Download clinical reference templates, AJCC staging charts, CAP pathology summaries, and patient education infographics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionalResourcesData.map((res) => (
              <div
                key={res.id}
                className="bg-slate-50 rounded-3xl p-6 border border-slate-200/50 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div className="space-y-3 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider font-heading">
                      {res.format}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{res.size}</span>
                  </div>
                  <h4 className="font-heading text-base font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {res.title}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{res.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/50">
                  <Button
                    onClick={() => handleDownload(res.id)}
                    className="w-full bg-white hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-250 text-xs font-bold py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all shadow-2xs"
                  >
                    {downloadingRes === res.id ? (
                      <>
                        <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Downloading...
                      </>
                    ) : downloadedRes[res.id] ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        Downloaded!
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 shrink-0" />
                        Download Asset
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          9. WEBINARS & UPCOMING EVENTS
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-gradient-to-tr from-pink-50/40 via-purple-50/15 to-blue-50/30 border-y border-slate-200/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider border border-pink-100">
              <Calendar className="h-4 w-4" />
              Clinical Events
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              CME Webinars &amp; Medical Conferences
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Register for upcoming oncology workshops, international symposia, and live CDK4/6 hormone therapies reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {eventsData.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div className="space-y-4 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-pink-50 text-pink-600 text-[10px] font-bold uppercase tracking-wider font-heading">
                      {ev.format}
                    </span>
                    <span className="text-[10px] text-emerald-650 font-bold flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 text-emerald-500" />
                      {ev.credits}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-heading text-base font-extrabold text-slate-800 group-hover:text-blue-650 transition-colors">
                      {ev.title}
                    </h4>
                    <p className="text-[10px] text-slate-450 font-bold font-sans flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {ev.date}
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed italic">
                    {ev.speaker}
                  </p>

                  <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 border-t border-slate-100 pt-3">
                    <MapPin className="h-3.5 w-3.5 text-slate-450 shrink-0" />
                    <span>Location: {ev.location}</span>
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Button
                    onClick={() => setEventRegisterItem(ev)}
                    className="w-full bg-blue-650 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer"
                  >
                    Register Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          10. RESEARCH COLLABORATION
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
                <Share2 className="h-4 w-4 animate-pulse" />
                Partner Networks
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Establish Research Partnerships &amp; Genomic Alliances
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
                We coordinate multi-institutional registries, sharing tumor staging profiles and localized BRCA penetration indices. We invite universities, labs, oncological clinics, and corporate health networks to establish research alliances.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  "Academic Medical Colleges",
                  "Pathology Diagnostic Laboratories",
                  "Cancer Specialty Hospitals",
                  "Genetics & Bio-Bank Research Groups"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-500 font-bold font-heading">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual Box */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/20 border border-slate-200/50 shadow-md text-center space-y-6">
              <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <HeartHandshake className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-lg font-black text-slate-805 leading-snug">Become a Collaborative Partner</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-sans">
                Submit an institutional request to integrate your research database, request clinical screening kits, or sponsor regional tumor registries.
              </p>
              <Button
                onClick={() => setPartnerRequestOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl cursor-pointer"
              >
                Become a Research Partner
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          11. HEALTHCARE PROFESSIONAL COMMUNITY
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-pink-50/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
              <Users2 className="h-4 w-4" />
              Expert Community
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Healthcare Professional Community Panels
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Contribute your clinical expertise to save lives. Volunteer for mobile testing vans or submit case reports to mentor younger breast specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Join Expert Panel",
                desc: "Provide clinical feedback on tumor databases, staging algorithms, or patient screening guidelines.",
                cta: "Apply for Panel",
                action: () => setJoinNetworkOpen(true)
              },
              {
                title: "Become a Volunteer Doctor",
                desc: "Support underprivileged women by administering clinical physical exams at mobile screening drives.",
                cta: "Volunteer Now",
                action: () => setVolunteerOpen(true)
              },
              {
                title: "Submit Research Abstracts",
                desc: "Upload tumor registries, genetic mutational registries, or digitized pathology summaries for board review.",
                cta: "Submit Abstract",
                action: () => setPartnerRequestOpen(true)
              },
              {
                title: "Publish Case Studies",
                desc: "Document rare triple-negative or metastatic breast cancer therapies for case-based education.",
                cta: "Publish Article",
                action: () => setPartnerRequestOpen(true)
              },
              {
                title: "Mentor Young Doctors",
                desc: "Guide postgraduate medical students, surgical residents, and oncology nurses through clinical paths.",
                cta: "Apply as Mentor",
                action: () => setJoinNetworkOpen(true)
              },
              {
                title: "Join Clinical Discussions",
                desc: "Participate in private peer-to-peer forums discussing complex chemotherapy and reconstructive cases.",
                cta: "Enter Forums",
                action: () => setJoinNetworkOpen(true)
              }
            ].map((panel, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3 font-sans">
                  <h4 className="font-heading text-base font-extrabold text-slate-800 leading-snug">{panel.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{panel.desc}</p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <Button
                    variant="ghost"
                    onClick={panel.action}
                    className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl h-10 cursor-pointer"
                  >
                    {panel.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          12. FREQUENTLY ASKED QUESTIONS
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider border border-pink-100">
              <MessageSquare className="h-4 w-4" />
              Accreditation FAQ
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Professional Network FAQs
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-sans">
              Find answers on CME certification delivery, clinical volunteering logs, and university staging collaborations.
            </p>
          </div>

          <div className="space-y-4">
            {faqsData.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/50 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer font-bold text-slate-800 hover:text-blue-600 transition-colors"
                  >
                    <span className="text-sm sm:text-base tracking-tight font-heading leading-tight">{faq.question}</span>
                    <div className="shrink-0 ml-4 font-sans">
                      {isOpen ? (
                        <div className="p-1 rounded-full bg-blue-100 text-blue-600">
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
          13. FINAL CALL TO ACTION (CTA)
          ---------------------------------------------------------------------- */}
      <section className="py-28 bg-slate-950 text-white relative overflow-hidden">
        {/* Background image overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/14.png"
            alt="Doctors consulting a patient"
            className="w-full h-full object-cover object-center filter brightness-[0.22] pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-955/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center space-y-8">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20"
          >
            <ShieldCheck className="h-4 w-4 text-blue-450 animate-pulse" />
            Empower Excellence
          </motion.div>

          <h2 className="font-heading text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Together, We Can Transform <br />
            Breast Cancer Care.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
            Collaborate, innovate, educate, and improve patient outcomes through knowledge sharing and evidence-based care. Join GRS medical panel.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              onClick={() => setJoinNetworkOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
            >
              Join Healthcare Network
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToId("clinical-guidelines-section")}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
            >
              Contact Medical Team
            </Button>

          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          MODALS & FORM POPUPS
          ---------------------------------------------------------------------- */}

      {/* 1. Clinical Guideline Details Modal */}
      <AnimatePresence>
        {selectedGuideline && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGuideline(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedGuideline(null)}
                className="absolute top-5 right-5 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <span className="inline-block px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-3 font-heading border border-blue-100">
                {selectedGuideline.evidenceLevel}
              </span>

              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-800 pr-8 leading-tight">
                {selectedGuideline.title}
              </h3>

              <div className="mt-6 space-y-4 font-sans text-slate-650">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">Protocol Summary</h4>
                  <p className="text-xs sm:text-sm mt-1 leading-relaxed">{selectedGuideline.summary}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-heading">Standard Clinical Protocols</h4>
                  <ul className="space-y-3 text-xs sm:text-sm">
                    {selectedGuideline.protocols.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-6 text-xs text-slate-400">
                  <p className="font-bold text-slate-450">Clinical References:</p>
                  <p className="italic mt-1 leading-relaxed">{selectedGuideline.references}</p>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={() => setSelectedGuideline(null)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl cursor-pointer"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Research Article Details Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-5 right-5 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-505 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center justify-between mb-3 pr-8">
                <span className="px-2.5 py-0.5 rounded bg-pink-50 text-pink-650 text-[10px] font-bold uppercase tracking-wider font-heading">
                  {selectedArticle.category}
                </span>
                <span className="text-[10px] text-slate-450 font-bold font-sans">{selectedArticle.publishDate}</span>
              </div>

              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-800 leading-tight">
                {selectedArticle.title}
              </h3>
              <p className="text-[11px] font-bold text-blue-600 mt-1 uppercase tracking-wide font-heading">
                Journal: {selectedArticle.journal}
              </p>

              <div className="mt-6 space-y-4 font-sans text-slate-650">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">Abstract Summary</h4>
                  <p className="text-xs sm:text-sm mt-1 leading-relaxed">{selectedArticle.summary}</p>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50/30 border border-blue-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 mb-2 font-heading">Study Conclusions</h4>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{selectedArticle.conclusions}</p>
                </div>

                <div className="text-xs text-slate-400 border-t border-slate-100 pt-4 mt-6">
                  <p className="font-bold text-slate-450">Lead Researchers / Authors:</p>
                  <p className="mt-1">{selectedArticle.authors}</p>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={() => setSelectedArticle(null)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl cursor-pointer"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Join Network Modal */}
      <AnimatePresence>
        {joinNetworkOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetJoinForm}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl z-10"
            >
              <button
                onClick={resetJoinForm}
                className="absolute top-5 right-5 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {!joinSuccess ? (
                <>
                  <h3 className="font-heading text-xl font-extrabold text-slate-800 leading-tight">
                    Join Professional Network
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-sans">
                    Register to access clinical forum logs, upload research studies, and qualify as a certified referral.
                  </p>

                  <form onSubmit={handleJoinSubmit} className="space-y-4 mt-6 font-sans">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Full Name</label>
                      <Input
                        type="text"
                        required
                        placeholder="e.g. Dr. Ramesh Kumar"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="bg-slate-50 border-slate-250 h-10 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Clinical License Number</label>
                      <Input
                        type="text"
                        required
                        placeholder="e.g. MCI-98765"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        className="bg-slate-50 border-slate-250 h-10 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Specialty Discipline</label>
                      <select
                        value={doctorSpecialty}
                        onChange={(e) => setDoctorSpecialty(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-250 rounded-xl outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 cursor-pointer appearance-none"
                      >
                        <option value="Oncology">Medical Oncology</option>
                        <option value="Surgery">Breast Surgery</option>
                        <option value="Radiology">Diagnostic Radiology</option>
                        <option value="Pathology">Clinical Pathology</option>
                        <option value="Research">Academic Research</option>
                        <option value="Nursing">Oncology Nursing</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Official Email ID</label>
                      <Input
                        type="email"
                        required
                        placeholder="e.g. ramesh.k@hospital.org"
                        value={doctorEmail}
                        onChange={(e) => setDoctorEmail(e.target.value)}
                        className="bg-slate-50 border-slate-250 h-10 rounded-xl"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={joinLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl cursor-pointer mt-2"
                    >
                      {joinLoading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Network Registration"
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="h-14 w-14 rounded-full bg-emerald-50 border-2 border-emerald-250 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="h-7 w-7 animate-pulse" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-800">Verification Pending</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-sans">
                    Thank you, <span className="font-bold">{doctorName}</span>. Your clinical credentials for license <span className="font-bold">{licenseNumber}</span> have been submitted to GRS Medical Board. You will receive activation details via email shortly.
                  </p>
                  <Button
                    onClick={resetJoinForm}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-705 font-bold px-6 py-2 rounded-xl cursor-pointer mt-4"
                  >
                    Done
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. CME Course Enrollment Modal */}
      <AnimatePresence>
        {cmeEnrollCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetCmeForm}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl z-10"
            >
              <button
                onClick={resetCmeForm}
                className="absolute top-5 right-5 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {!cmeSuccess ? (
                <>
                  <h3 className="font-heading text-xl font-extrabold text-slate-800 leading-tight">
                    CME Registration
                  </h3>
                  <p className="text-xs text-slate-550 mt-1 font-sans">
                    Register for course: <span className="font-bold text-blue-650">{cmeEnrollCourse.title}</span>.
                  </p>

                  <form onSubmit={handleCmeEnroll} className="space-y-4 mt-6 font-sans">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Medical License ID</label>
                      <Input
                        type="text"
                        required
                        placeholder="e.g. MCI-98765"
                        value={cmeLicense}
                        onChange={(e) => setCmeLicense(e.target.value)}
                        className="bg-slate-50 border-slate-250 h-10 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Official Email Address</label>
                      <Input
                        type="email"
                        required
                        placeholder="e.g. name@clinic.org"
                        value={cmeEmail}
                        onChange={(e) => setCmeEmail(e.target.value)}
                        className="bg-slate-50 border-slate-250 h-10 rounded-xl"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={cmeLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl cursor-pointer mt-2"
                    >
                      {cmeLoading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Registering...
                        </>
                      ) : (
                        "Confirm Enrollment"
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="h-14 w-14 rounded-full bg-emerald-50 border-2 border-emerald-250 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="h-7 w-7 animate-pulse" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-800">Enrollment Completed</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-sans">
                    You have successfully enrolled in <span className="font-bold">{cmeEnrollCourse.title}</span>. Your portal credentials and pre-reading materials have been sent to <span className="font-bold">{cmeEmail}</span>. Complete the module to receive your certified CME PDF.
                  </p>
                  <Button
                    onClick={resetCmeForm}
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

      {/* 5. Event Registration Modal */}
      <AnimatePresence>
        {eventRegisterItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetEventForm}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl z-10"
            >
              <button
                onClick={resetEventForm}
                className="absolute top-5 right-5 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {!eventSuccess ? (
                <>
                  <h3 className="font-heading text-xl font-extrabold text-slate-800 leading-tight">
                    Register for Event
                  </h3>
                  <p className="text-xs text-slate-550 mt-1 font-sans">
                    Secure entry for: <span className="font-bold text-pink-650">{eventRegisterItem.title}</span>.
                  </p>

                  <form onSubmit={handleEventRegister} className="space-y-4 mt-6 font-sans">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Medical License ID</label>
                      <Input
                        type="text"
                        required
                        placeholder="e.g. MCI-98765"
                        value={eventLicense}
                        onChange={(e) => setEventLicense(e.target.value)}
                        className="bg-slate-50 border-slate-255 h-10 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Official Email Address</label>
                      <Input
                        type="email"
                        required
                        placeholder="e.g. name@hospital.org"
                        value={eventEmail}
                        onChange={(e) => setEventEmail(e.target.value)}
                        className="bg-slate-50 border-slate-255 h-10 rounded-xl"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={eventLoading}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold h-11 rounded-xl cursor-pointer mt-2"
                    >
                      {eventLoading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Registering...
                        </>
                      ) : (
                        "Confirm Event Pass"
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="h-14 w-14 rounded-full bg-emerald-50 border-2 border-emerald-250 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="h-7 w-7 animate-pulse" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-800">Event Pass Confirmed</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-sans">
                    Registration confirmed for <span className="font-bold">{eventRegisterItem.title}</span>. Your virtual entry pass link (Zoom/Tata Auditorium Hall QR) has been transmitted to <span className="font-bold">{eventEmail}</span>.
                  </p>
                  <Button
                    onClick={resetEventForm}
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

      {/* 6. Become Partner Modal */}
      <AnimatePresence>
        {partnerRequestOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetPartnerForm}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl z-10"
            >
              <button
                onClick={resetPartnerForm}
                className="absolute top-5 right-5 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {!partnerSuccess ? (
                <>
                  <h3 className="font-heading text-xl font-extrabold text-slate-805 leading-tight">
                    Research Partnership
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-sans">
                    Submit an administrative request to collaborate on genomic staging registries or mobile screening partnerships.
                  </p>

                  <form onSubmit={handlePartnerSubmit} className="space-y-4 mt-6 font-sans">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Contact Representative</label>
                      <Input
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        className="bg-slate-50 border-slate-250 h-10 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Institution / Center</label>
                      <Input
                        type="text"
                        required
                        placeholder="e.g. Apex Hospital, Biotech Lab"
                        value={partnerInst}
                        onChange={(e) => setPartnerInst(e.target.value)}
                        className="bg-slate-50 border-slate-250 h-10 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Genomic Staging Domain</label>
                      <select
                        value={partnerArea}
                        onChange={(e) => setPartnerArea(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-250 rounded-xl outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 cursor-pointer appearance-none"
                      >
                        <option value="Genomics">Genomics Registry Integration</option>
                        <option value="Diagnostics">Mobile Diagnostic Camp Logistics</option>
                        <option value="CME">CME Academic Accreditation</option>
                        <option value="Funding">Oncology Grants / NGO Sponsorship</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Message / Request Abstract</label>
                      <textarea
                        required
                        placeholder="Describe your research proposal or project details"
                        value={partnerMsg}
                        onChange={(e) => setPartnerMsg(e.target.value)}
                        className="w-full h-16 px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 cursor-pointer"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={partnerLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl cursor-pointer mt-2"
                    >
                      {partnerLoading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Partnership Request"
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="h-14 w-14 rounded-full bg-emerald-50 border-2 border-emerald-250 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="h-7 w-7 animate-pulse" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-800">Proposal Transmitted</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-sans">
                    Thank you, <span className="font-bold">{partnerName}</span>. Your collaborative staging request for <span className="font-bold">{partnerInst}</span> has been logged. GRS administrative board will reach out to you within 3 business days.
                  </p>
                  <Button
                    onClick={resetPartnerForm}
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

      {/* 7. Become Volunteer Modal */}
      <AnimatePresence>
        {volunteerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetVolunteerForm}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl z-10"
            >
              <button
                onClick={resetVolunteerForm}
                className="absolute top-5 right-5 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-505 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {!volSuccess ? (
                <>
                  <h3 className="font-heading text-xl font-extrabold text-slate-800 leading-tight">
                    Volunteer Specialist Registration
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-sans">
                    Sign up to support rural diagnostics drives or tele-consultations for underprivileged families.
                  </p>

                  <form onSubmit={handleVolunteerSubmit} className="space-y-4 mt-6 font-sans">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Your Name</label>
                      <Input
                        type="text"
                        required
                        placeholder="e.g. Dr. Anita Sen"
                        value={volName}
                        onChange={(e) => setVolName(e.target.value)}
                        className="bg-slate-50 border-slate-250 h-10 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">License ID / Specialization</label>
                      <Input
                        type="text"
                        required
                        placeholder="e.g. MCI-98765 / Diagnostic Radiology"
                        value={volSpec}
                        onChange={(e) => setVolSpec(e.target.value)}
                        className="bg-slate-50 border-slate-250 h-10 rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Email Address</label>
                        <Input
                          type="email"
                          required
                          placeholder="name@gmail.com"
                          value={volEmail}
                          onChange={(e) => setVolEmail(e.target.value)}
                          className="bg-slate-50 border-slate-250 h-10 rounded-xl"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Phone Number</label>
                        <Input
                          type="tel"
                          required
                          placeholder="+91 98765-43210"
                          value={volPhone}
                          onChange={(e) => setVolPhone(e.target.value)}
                          className="bg-slate-50 border-slate-250 h-10 rounded-xl"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={volLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl cursor-pointer mt-2"
                    >
                      {volLoading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Confirm Volunteer Sign-Up"
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="h-14 w-14 rounded-full bg-emerald-50 border-2 border-emerald-250 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="h-7 w-7 animate-pulse" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-805">Volunteer Credentials Received</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-sans">
                    Thank you, <span className="font-bold">{volName}</span>. Your details have been queued. Our clinical campaign coordinator will contact you at <span className="font-bold">{volPhone}</span> to align with upcoming screening camps schedules.
                  </p>
                  <Button
                    onClick={resetVolunteerForm}
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

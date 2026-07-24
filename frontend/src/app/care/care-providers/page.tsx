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
  HeartPulse
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
  phone: string;
  email: string;
  address: string;
  rating: number;
  reviews: number;
  about: string;
  hours: string;
  facilities: string[];
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
const specialistsData: Specialist[] = [
  {
    id: "breast-surgeon",
    name: "Breast Surgeon",
    icon: Stethoscope,
    desc: "A surgical oncologist specializing in removing breast tumors, performing mastectomies, lumpectomies, and node biopsies.",
    role: "Performs precise surgical excisions, designs surgical margins, and coordinates reconstruction.",
    colorClass: "bg-pink-50 border-pink-100 text-pink-600 dark:bg-pink-950/20 dark:border-pink-900/40"
  },
  {
    id: "medical-oncologist",
    name: "Medical Oncologist",
    icon: Pill,
    desc: "A specialist who treats breast cancer using systemic therapies like chemotherapy, targeted therapy, and immunotherapy.",
    role: "Designs chemo regimens, manages treatment side effects, and monitors patient systemic response.",
    colorClass: "bg-purple-50 border-purple-100 text-purple-600 dark:bg-purple-950/20 dark:border-purple-900/40"
  },
  {
    id: "radiation-oncologist",
    name: "Radiation Oncologist",
    icon: Zap,
    desc: "Uses high-energy radiation beams to target and destroy remaining microscopic cancer cells post-surgery.",
    role: "Configures exact radiation dosage mapping and schedules localized radiotherapy cycles.",
    colorClass: "bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900/40"
  },
  {
    id: "plastic-surgeon",
    name: "Plastic & Reconstructive Surgeon",
    icon: Layers,
    desc: "Restores breast shape, symmetry, and appearance using implants or natural tissue flaps after mastectomy.",
    role: "Performs oncoplastic reconstruction, tissue transfer, and aesthetic symmetrical reshaping.",
    colorClass: "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40"
  },
  {
    id: "radiologist",
    name: "Radiologist",
    icon: Activity,
    desc: "An imaging specialist who interprets mammograms, breast ultrasounds, MRIs, and performs image-guided biopsies.",
    role: "Analyzes screening scans, identifies abnormalities, and guides needle localization biopsy procedures.",
    colorClass: "bg-cyan-50 border-cyan-100 text-cyan-600 dark:bg-cyan-950/20 dark:border-cyan-900/40"
  },
  {
    id: "pathologist",
    name: "Pathologist",
    icon: Microscope,
    desc: "Analyzes breast tissue biopsy samples under a microscope to confirm cancer, identify grade, and hormone receptors.",
    role: "Performs immunohistochemistry, determines ER/PR/HER2 status, and provides the diagnostic report.",
    colorClass: "bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-900/40"
  },
  {
    id: "oncology-nurse",
    name: "Oncology Nurse",
    icon: HeartPulse,
    desc: "Provides expert clinical nursing care, administers chemotherapy drugs, and manages symptom support during cycles.",
    role: "Monitors vitals, educates on medication side effects, and offers comforting bedside care.",
    colorClass: "bg-pink-50 border-pink-100 text-pink-600 dark:bg-pink-950/20 dark:border-pink-900/40"
  },
  {
    id: "genetic-counselor",
    name: "Genetic Counselor",
    icon: Dna,
    desc: "Assesses genetic risk profiles (e.g., BRCA1/BRCA2 mutation tests) for patients and their family members.",
    role: "Analyzes hereditary health history, explains risk assessment scores, and assists in gene-preventative plans.",
    colorClass: "bg-violet-50 border-violet-100 text-violet-600 dark:bg-violet-950/20 dark:border-violet-900/40"
  },
  {
    id: "physiotherapist",
    name: "Physiotherapist",
    icon: Sparkles,
    desc: "Helps patients restore arm mobility, prevent lymphedema, and rebuild physical strength after surgery.",
    role: "Designs lymphatic drainage exercises, shoulder mobility programs, and physical recovery tracking.",
    colorClass: "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/40"
  },
  {
    id: "nutritionist",
    name: "Nutritionist / Dietitian",
    icon: Apple,
    desc: "Curates tailored oncology nutritional plans to maintain strength, manage weight, and boost immunity.",
    role: "Develops meal plans for treatment cycles, recommends digestive remedies, and guides post-cancer diets.",
    colorClass: "bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/40"
  },
  {
    id: "psychologist",
    name: "Clinical Psychologist",
    icon: Brain,
    desc: "Supports patients and families coping with the emotional stress, anxiety, and trauma of cancer diagnosis.",
    role: "Conducts individual therapy sessions, grief counseling, and cognitive behavioral therapy (CBT).",
    colorClass: "bg-teal-50 border-teal-100 text-teal-600 dark:bg-teal-950/20 dark:border-teal-900/40"
  },
  {
    id: "palliative-specialist",
    name: "Palliative Care Specialist",
    icon: HeartHandshake,
    desc: "Focuses on optimizing quality of life by managing pain, physical symptoms, and treatment stress.",
    role: "Prescribes advanced symptom relief management, coordinates holistic support, and comfort plans.",
    colorClass: "bg-red-50 border-red-100 text-red-600 dark:bg-red-950/20 dark:border-red-900/40"
  },
  {
    id: "social-worker",
    name: "Social Worker & Navigator",
    icon: HeartHandshake,
    desc: "Guides patients through treatment scheduling, healthcare system navigation, and financial assistance schemes.",
    role: "Helps verify NGO grants, manages hospital insurance claims, and arranges support group logistics.",
    colorClass: "bg-sky-50 border-sky-100 text-sky-600 dark:bg-sky-950/20 dark:border-sky-900/40"
  }
];

const careServicesData: CareService[] = [
  {
    id: "cs-1",
    name: "Apex Comprehensive Cancer Research Institute",
    category: "hospitals",
    specialization: "Surgical, Medical & Radiation Oncology",
    city: "New Delhi",
    phone: "+91 11 4055 9999",
    email: "care@apex-cancer.org",
    address: "Okhla Phase III, Near Main Metro Station, New Delhi",
    rating: 4.9,
    reviews: 248,
    about: "Apex is a state-of-the-art cancer institute equipped with cutting-edge surgical units, advanced linear accelerators, and a highly experienced multidisciplinary tumor board specifically for breast cancers.",
    hours: "Mon - Sat: 08:00 AM - 08:00 PM (Emergency 24/7)",
    facilities: ["Advanced Linear Accelerator (LINAC)", "Dedicated Breast Care Wing", "Chemotherapy Daycare Unit", "Onco-Emergency Care Room", "International Tumor Board Collaboration"]
  },
  {
    id: "cs-2",
    name: "Tata Cancer Care Affiliate Center",
    category: "hospitals",
    specialization: "Multi-Disciplinary Breast Oncology Services",
    city: "Mumbai",
    phone: "+91 22 2417 7000",
    email: "contact@tata-affiliate.in",
    address: "Dr. Ernest Borges Road, Parel, Mumbai",
    rating: 4.8,
    reviews: 512,
    about: "This premier oncology healthcare center collaborates on standardized breast protocols, offering highly subsidized diagnostic packages, genetic risk profiling, and complex reconstructive surgeries.",
    hours: "Mon - Fri: 09:00 AM - 06:00 PM",
    facilities: ["Subsidized Patient Support Scheme", "Comprehensive Breast Mastectomy Wing", "Surgical Navigation Suite", "In-house Clinical Pathology"]
  },
  {
    id: "cs-3",
    name: "Metropolis Breast Diagnostics & Imaging Hub",
    category: "diagnostics",
    specialization: "High-Resolution Mammography & Ultrasounds",
    city: "Gurugram",
    phone: "+91 124 671 2000",
    email: "gurugram@metropolis.com",
    address: "Sector 45, DLF Phase IV Road, Gurugram",
    rating: 4.7,
    reviews: 189,
    about: "Equipped with FDA-approved digital 3D breast mammography and automated breast ultrasound (ABUS) systems, offering precise screening and early-stage nodule analysis.",
    hours: "Daily: 07:00 AM - 09:00 PM",
    facilities: ["3D Digital Mammogram (Tomosynthesis)", "Automated Breast Ultrasound", "Fine Needle Aspiration Biopsy (FNAB)", "Instant Digital Report Portals"]
  },
  {
    id: "cs-4",
    name: "Hindustan Diagnostics & Imaging Center",
    category: "diagnostics",
    specialization: "Hereditary Biomarker & Imaging Services",
    city: "Noida",
    phone: "+91 120 488 1234",
    email: "info@hindustandiagnostics.com",
    address: "Sector 62, Noida",
    rating: 4.6,
    reviews: 132,
    about: "A trusted pathology lab providing swift liquid biopsies, breast tissue markers, and standard diagnostic imaging with highly trained radiologists.",
    hours: "Mon - Sat: 08:00 AM - 07:00 PM",
    facilities: ["Standard Digital Mammography", "Breast Ultrasound (Sonography)", "Pathology Lab Testing", "Ambulance Transfer Support"]
  },
  {
    id: "cs-5",
    name: "Sanjeevani Specialty Breast Care Clinic",
    category: "clinics",
    specialization: "Preventive Care & Primary Consultations",
    city: "Bangalore",
    phone: "+91 80 4911 8888",
    email: "clinic@sanjeevanibreast.org",
    address: "100 Feet Road, Indiranagar, Bangalore",
    rating: 4.9,
    reviews: 320,
    about: "A specialized outpatient clinic focusing strictly on preventative breast health, routine checkups, breast pain consultations, and early lump diagnostic reviews.",
    hours: "Mon - Sat: 10:00 AM - 07:00 PM",
    facilities: ["Clinical Breast Examinations (CBE)", "Symptom & Pain Management Consults", "Second Opinion Consultations", "Breast Health Educational Seminars"]
  },
  {
    id: "cs-6",
    name: "Medanta Chemotherapy Daycare",
    category: "chemotherapy",
    specialization: "Outpatient Infusions & Targeted Therapeutics",
    city: "Gurugram",
    phone: "+91 124 414 1414",
    email: "chemotherapy@medanta.org",
    address: "Sector 38, Gurugram",
    rating: 4.8,
    reviews: 195,
    about: "A patient-centric outpatient daycare facility providing comfortable private infusion suites, scalp cooling therapies to prevent hair loss, and intensive nurse care.",
    hours: "Mon - Sat: 07:30 AM - 08:30 PM",
    facilities: ["Private Infusion Suites", "Scalp Cooling System (Hair Preservation)", "Emergency Intensive Care Support", "Oncology Nutrition Bar"]
  },
  {
    id: "cs-7",
    name: "Apollo Proton & Radiation Center",
    category: "radiation",
    specialization: "Proton Therapy & Stereotactic Radiosurgery",
    city: "Chennai",
    phone: "+91 44 3333 4444",
    email: "radiation@apollo-proton.com",
    address: "Taramani, Chennai",
    rating: 4.9,
    reviews: 147,
    about: "The leading proton therapy center in South Asia, delivering highly targeted radiation that spares healthy tissues near the heart and lungs during left-breast treatments.",
    hours: "Mon - Fri: 08:00 AM - 06:00 PM",
    facilities: ["Proton Beam Radiotherapy", "Stereotactic Body Radiotherapy (SBRT)", "Image-Guided Radiation (IGRT)", "On-site Cardiac Monitoring"]
  },
  {
    id: "cs-8",
    name: "Strand Life Sciences Genetic Lab",
    category: "genetics",
    specialization: "Hereditary Gene Profiling & BRCA1/2 Tests",
    city: "Bangalore",
    phone: "+91 80 4078 9999",
    email: "genetics@strandls.com",
    address: "Hebbal, Bangalore",
    rating: 4.7,
    reviews: 98,
    about: "Leading laboratory for Next-Generation Sequencing (NGS) of BRCA1, BRCA2, and multi-gene panels to evaluate hereditary breast cancer risks.",
    hours: "Mon - Sat: 09:00 AM - 06:00 PM",
    facilities: ["BRCA 1 & BRCA 2 Mutational Analysis", "Multi-Gene Panel Risk Screening", "Post-Test Genetic Counseling Sessions", "Confidential Gene Mapping Registries"]
  },
  {
    id: "cs-9",
    name: "Pink Ribbon Rehab & Lymphedema Clinic",
    category: "rehab",
    specialization: "Post-Surgical Mobilization & Lymphedema Rehab",
    city: "Mumbai",
    phone: "+91 22 6123 4567",
    email: "recovery@pinkribbonrehab.org",
    address: "Bandra West, Mumbai",
    rating: 4.8,
    reviews: 115,
    about: "A specialty rehabilitation center dedicated to restoring arm range-of-motion, treating postsurgical scars, and administering complete decongestive therapy for lymphedema.",
    hours: "Mon - Sat: 09:00 AM - 05:00 PM",
    facilities: ["Complete Decongestive Therapy (CDT)", "Custom Lymphatic Compression Garments", "Shoulder Mobilization Exercises", "Scar Tissue Release Therapies"]
  },
  {
    id: "cs-10",
    name: "Portea Oncology Home Care",
    category: "homecare",
    specialization: "In-Home Nursing & Palliative Comfort Care",
    city: "Hyderabad",
    phone: "+91 40 6000 6000",
    email: "homecare@portea.com",
    address: "Jubilee Hills, Hyderabad",
    rating: 4.6,
    reviews: 142,
    about: "Brings experienced oncology nurses directly to your home for chemo-port flushes, dressing changes, palliative symptom management, and nutritional support.",
    hours: "24/7 Service Coverage",
    facilities: ["In-home Chemo Port Care & Flushes", "Post-Surgical Wound Dressing", "Geriatric Palliative Management", "Home Oxygen & Medical Bed Support"]
  },
  {
    id: "cs-11",
    name: "MindSpace Support & Counseling",
    category: "counseling",
    specialization: "Trauma Coping & Caregiver Psychological Support",
    city: "Kolkata",
    phone: "+91 33 4004 5678",
    email: "support@mindspacekolkata.com",
    address: "Salt Lake, Kolkata",
    rating: 4.9,
    reviews: 167,
    about: "A peaceful therapeutic center offering cognitive behavioral therapy (CBT), cancer acceptance coaching, and support circles for survivors and direct family caregivers.",
    hours: "Mon - Sat: 11:00 AM - 08:00 PM",
    facilities: ["One-on-One Psychological Counseling", "Family & Caregiver Support Circles", "Art & Music Expressive Therapies", "Stress Reduction Workshops"]
  },
  {
    id: "cs-12",
    name: "Karunashraya Palliative Hospice",
    category: "palliative",
    specialization: "Advanced Pain Control & Symptom Management",
    city: "Bangalore",
    phone: "+91 80 2847 6133",
    email: "info@karunashraya.org",
    address: "Marathahalli, Bangalore",
    rating: 4.9,
    reviews: 215,
    about: "India's premier palliative hospice, providing free, compassionate care for advanced-stage cancer patients focusing strictly on pain eradication, dignity, and peace.",
    hours: "24/7 Operations",
    facilities: ["Free In-Patient Comfort Wards", "Home Care Outpatient Units", "Advanced Pharmacological Pain Control", "Spiritual Support and Guidance"]
  }
];

const journeyStepsData: JourneyStep[] = [
  {
    step: "01",
    title: "Self-Examination",
    desc: "Perform monthly breast self-exams to detect unusual lumps, skin dimpling, or nipple changes early.",
    icon: Ribbon
  },
  {
    step: "02",
    title: "Mammography",
    desc: "Schedule annual screenings for women aged 40+, or earlier if high-risk, to detect microscopic changes.",
    icon: Activity
  },
  {
    step: "03",
    title: "Clinical Exam",
    desc: "Visit a gynecologist or breast specialist for a physical evaluation if symptoms or lump arises.",
    icon: User
  },
  {
    step: "04",
    title: "Biopsy & Pathology",
    desc: "Extract tumor cells via needle biopsy to analyze cell types, tumor grade, and hormone receptors.",
    icon: Microscope
  },
  {
    step: "05",
    title: "Treatment Plan",
    desc: "Collaborate with a multidisciplinary tumor board to define chemotherapy, surgery, and radiation stages.",
    icon: Stethoscope
  },
  {
    step: "06",
    title: "Breast Surgery",
    desc: "Remove the tumor (lumpectomy) or the whole breast (mastectomy), often combined with lymph node checks.",
    icon: Layers
  },
  {
    step: "07",
    title: "Chemotherapy",
    desc: "Administer systemic drugs orally or intravenously to target and kill fast-dividing cancer cells.",
    icon: Pill
  },
  {
    step: "08",
    title: "Radiation Therapy",
    desc: "Expose target breast margins to energy beams, destroying microscopic cells remaining after surgery.",
    icon: Zap
  },
  {
    step: "09",
    title: "Hormone Therapy",
    desc: "Block estrogen/HER2 pathways using medication (like Tamoxifen or Herceptin) to prevent recurrence.",
    icon: HeartPulse
  },
  {
    step: "10",
    title: "Rehabilitation",
    desc: "Engage in lymphedema prevention therapy, physical shoulder exercises, and reconstructive healing.",
    icon: Sparkles
  },
  {
    step: "11",
    title: "Follow-up Care",
    desc: "Receive surveillance scans, blood work, and oncological follow-up appointments every 3-6 months.",
    icon: ShieldCheck
  }
];

const supportServicesData: SupportService[] = [
  {
    title: "Emotional Counseling",
    desc: "Professional therapists guiding you through shock, anxiety, and depression to build mental resilience.",
    features: ["One-on-one sessions", "Stress relief therapy", "Caregiver support"],
    icon: Brain,
    gradientClass: "from-pink-500/10 to-rose-500/10 text-pink-600 border-pink-200/50"
  },
  {
    title: "Nutrition Guidance",
    desc: "Tailored dietary advice to maintain cellular strength, digest food easily, and boost immunity.",
    features: ["Cycle-specific meal plans", "Nausea mitigation diets", "Weight management"],
    icon: Apple,
    gradientClass: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200/50"
  },
  {
    title: "Survivorship Programs",
    desc: "Providing transition support, helping survivors return to work, stay healthy, and advocate.",
    features: ["Transition guidance", "Healthy life coaching", "Advocacy meetups"],
    icon: Ribbon,
    gradientClass: "from-purple-500/10 to-indigo-500/10 text-purple-600 border-purple-200/50"
  },
  {
    title: "Financial Assistance",
    desc: "Connecting families to government schemes, healthcare insurance, and verified NGO treatment grants.",
    features: ["NGO subsidy routing", "Insurance facilitation", "Crowdfunding tools"],
    icon: HeartHandshake,
    gradientClass: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200/50"
  },
  {
    title: "Family Support Systems",
    desc: "Counseling spouses, children, and close relatives on how to care for patients without burning out.",
    features: ["Family group therapy", "Youth coping toolkits", "Respite care help"],
    icon: Users2,
    gradientClass: "from-blue-500/10 to-sky-500/10 text-blue-600 border-blue-200/50"
  },
  {
    title: "Fertility Counseling",
    desc: "Expert guidance on egg freezing and reproductive options before starting chemotherapy.",
    features: ["Egg preservation routing", "Hormonal consults", "Family planning advice"],
    icon: Dna,
    gradientClass: "from-pink-500/10 to-purple-500/10 text-pink-600 border-pink-200/50"
  },
  {
    title: "Physical Rehabilitation",
    desc: "Restoring physical upper-body range of motion and checking for postoperative muscular stiffness.",
    features: ["Shoulder exercises", "Lymphedema detection", "Posture alignment"],
    icon: Sparkles,
    gradientClass: "from-cyan-500/10 to-teal-500/10 text-cyan-600 border-cyan-200/50"
  },
  {
    title: "Pain & Symptom Control",
    desc: "Advanced therapeutic techniques to manage severe nausea, fatigue, neuropathy, and cancer pain.",
    features: ["Neuropathy remedies", "Advanced pain blocks", "Nausea management"],
    icon: HeartPulse,
    gradientClass: "from-red-500/10 to-rose-500/10 text-red-600 border-red-200/50"
  },
  {
    title: "Support Groups",
    desc: "Weekly physical and digital peer circles to share cancer stories, exchange recovery advice, and heal.",
    features: ["Survivor-led sessions", "Digital chat forums", "Art therapy events"],
    icon: MessageSquare,
    gradientClass: "from-violet-500/10 to-fuchsia-500/10 text-violet-600 border-violet-200/50"
  },
  {
    title: "Oncology Home Care",
    desc: "Nurses visiting your residence for PICC line dressing, port flushes, injections, and care management.",
    features: ["PICC line flushes", "Injection scheduling", "Vitals checks at home"],
    icon: Home,
    gradientClass: "from-sky-500/10 to-indigo-500/10 text-sky-600 border-indigo-200/50"
  }
];

const patientResourcesData: PatientResource[] = [
  {
    title: "Breast Self-Examination Guide",
    size: "2.4 MB",
    format: "PDF",
    desc: "Visual step-by-step instructions on performing monthly self-exams, showing what to feel and watch for."
  },
  {
    title: "Breast Cancer Treatment Checklist",
    size: "1.8 MB",
    format: "PDF",
    desc: "A workbook to record consultations, chemotherapy cycles, scan dates, and medication dosage calendars."
  },
  {
    title: "Questions to Ask Your Doctor",
    size: "820 KB",
    format: "PDF",
    desc: "A guide detailing critical questions about biopsy reports, surgical margins, and treatment pathways."
  },
  {
    title: "Nutrition & Diet Oncology Guide",
    size: "3.1 MB",
    format: "PDF",
    desc: "Easy recipes, nausea-fighting foods, and dietary protocols compiled by specialized oncology dietitians."
  },
  {
    title: "Post-Surgical Recovery Handbook",
    size: "4.2 MB",
    format: "PDF",
    desc: "Exercises for shoulder mobility, drain bulb records, and lymphedema prevention steps after surgery."
  },
  {
    title: "Mental Wellness & Coping Guide",
    size: "1.5 MB",
    format: "PDF",
    desc: "Mindfulness methods, breathing exercises, and emotional coping pathways for cancer anxiety."
  },
  {
    title: "Survivorship Care & Follow-Up Plan",
    size: "2.0 MB",
    format: "PDF",
    desc: "A guide on routine health check schedules, hormonal therapy control, and living healthy after recovery."
  }
];

const faqsData: FAQItem[] = [
  {
    question: "How do I choose the right breast cancer specialist?",
    answer: "A certified breast surgeon or surgical oncologist should be your first consult for a suspicious lump. When diagnosed, they will coordinate with a medical oncologist and a radiation oncologist. It is ideal to choose specialists who work within a multidisciplinary team or host tumor boards, ensuring all angles of your biology are discussed collectively."
  },
  {
    question: "When should I see a medical oncologist?",
    answer: "You should see a medical oncologist immediately after receiving a tissue biopsy report confirming cancer cells. They will assess hormone receptor parameters (ER, PR, HER2 status) and design any necessary systemic therapies, such as pre-surgery (neoadjuvant) chemotherapy to shrink tumors, or post-surgery (adjuvant) chemotherapy."
  },
  {
    question: "What is the role of a breast surgeon?",
    answer: "A breast surgeon specializes specifically in breast physiology, conservative breast surgeries (lumpectomies), and breast mastectomies. They remove cancer cell margins, evaluate lymph nodes, and coordinate closely with reconstructive surgeons for form restoration."
  },
  {
    question: "Can I get a second opinion?",
    answer: "Yes. Getting a second opinion is a standard and highly encouraged protocol in oncology. It ensures the staging is accurate and validates the proposed treatment plan. Any reputable specialist will gladly support you sharing your pathology slides and imaging records with another center."
  },
  {
    question: "How often should I undergo screening?",
    answer: "For healthy women of average risk, standard guidelines recommend clinical examinations and mammograms annually starting at age 40. If you have a family history of breast cancer (BRCA gene mutations), screening should begin earlier (often at age 25 or 30) using alternate diagnostic methods like breast MRIs."
  },
  {
    question: "What support services are available?",
    answer: "Our network connects you with free patient navigation services, government funding subsidies, emotional counseling, home nursing support (port flushes), post-operative physiotherapy, and weekly survivor-led support groups to guide you through recovery."
  }
];

export default function CareProvidersPage() {
  // ----------------------------------------------------------------------
  // State variables
  // ----------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Selected team specialist for info card
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>("breast-surgeon");

  // Journey step detail view
  const [activeJourneyStep, setActiveJourneyStep] = useState<number>(0);

  // Modals state
  const [detailsModal, setDetailsModal] = useState<CareService | null>(null);
  const [bookingModal, setBookingModal] = useState<CareService | null>(null);

  // Booking Form State
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("09:00 AM");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Help Request Modal State
  const [helpRequestOpen, setHelpRequestOpen] = useState(false);
  const [helpName, setHelpName] = useState("");
  const [helpPhone, setHelpPhone] = useState("");
  const [helpMessage, setHelpMessage] = useState("");
  const [helpSuccess, setHelpSuccess] = useState(false);
  const [helpLoading, setHelpLoading] = useState(false);

  // Download simulation state
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

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone || !bookingDate) {
      alert("Please fill in all details to submit.");
      return;
    }
    setBookingLoading(true);
    setTimeout(() => {
      setBookingLoading(false);
      setBookingSuccess(true);
    }, 1200);
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

  const resetBookingForm = () => {
    setBookingModal(null);
    setBookingName("");
    setBookingPhone("");
    setBookingDate("");
    setBookingTime("09:00 AM");
    setBookingSuccess(false);
  };

  const resetHelpForm = () => {
    setHelpRequestOpen(false);
    setHelpName("");
    setHelpPhone("");
    setHelpMessage("");
    setHelpSuccess(false);
  };

  // Filter logic for care services
  const filteredServices = careServicesData.filter(service => {
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

  // Scroll Helper
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
            src="/images/14.png"
            alt="Doctors caring for patient"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.35] contrast-105 pointer-events-none"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/65 to-pink-950/45 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-95" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10 py-24 text-center sm:text-left">
          <div className="max-w-3xl space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 backdrop-blur-md border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider"
            >
              <Ribbon className="h-4 w-4 text-pink-400 fill-pink-400 animate-pulse" />
              Trusted Care Network
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
            >
              Find the Right Care, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400">
                Every Step of Your Journey.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed font-sans"
            >
              Connect with trusted healthcare providers, breast oncology specialists, diagnostic screening centers, and support networks dedicated to breast cancer recovery and survival.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start pt-2"
            >
              <Button
                onClick={() => scrollToId("care-services-directory")}
                className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-pink-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
              >
                Find a Care Provider
                <ArrowRight className="h-5 w-5 ml-1.5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollToId("support-services-section")}
                className="border-slate-400 text-pink hover:bg-white/10 hover:text-white font-bold px-8 py-6 rounded-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
              >
                Get Support
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          2. WHY CHOOSING THE RIGHT CARE MATTERS
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-10 right-0 w-80 h-80 bg-pink-105/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-80 h-80 bg-purple-105/30 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider border border-pink-100">
              <ShieldCheck className="h-4 w-4" />
              Why Choice Matters
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Coordinated Care Improves Survival Outcomes
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Breast cancer treatment is highly specialized. A coordinated, multidisciplinary medical team ensures custom chemotherapy, precise radiation, and surgical accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Graphics/Stats */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 rounded-3xl bg-pink-50/50 border border-pink-100/40 shadow-xs flex flex-col justify-between"
              >
                <div className="h-12 w-12 rounded-2xl bg-white border border-pink-200 flex items-center justify-center shadow-xs">
                  <Activity className="h-6 w-6 text-pink-600" />
                </div>
                <div className="mt-8">
                  <h4 className="text-4xl font-black text-slate-800 tracking-tight">90%+</h4>
                  <p className="text-xs font-bold text-pink-600 uppercase tracking-widest mt-1">Survival Rate</p>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    With early stage clinical diagnostics and local screenings.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 rounded-3xl bg-purple-50/50 border border-purple-105/40 shadow-xs flex flex-col justify-between"
              >
                <div className="h-12 w-12 rounded-2xl bg-white border border-purple-200 flex items-center justify-center shadow-xs">
                  <Users2 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="mt-8">
                  <h4 className="text-4xl font-black text-slate-800 tracking-tight">30%</h4>
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mt-1">Better Outcome</p>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Observed in patients treated under formal multidisciplinary tumor boards.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 rounded-3xl bg-blue-50/50 border border-blue-105/40 shadow-xs flex flex-col justify-between"
              >
                <div className="h-12 w-12 rounded-2xl bg-white border border-blue-200 flex items-center justify-center shadow-xs">
                  <HeartHandshake className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-8">
                  <h4 className="text-4xl font-black text-slate-800 tracking-tight">24/7</h4>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Patient Support</p>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Continuous navigation mapping support from diagnosis to survivorship.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 rounded-3xl bg-cyan-50/50 border border-cyan-105/40 shadow-xs flex flex-col justify-between"
              >
                <div className="h-12 w-12 rounded-2xl bg-white border border-cyan-200 flex items-center justify-center shadow-xs">
                  <ShieldAlert className="h-6 w-6 text-cyan-600" />
                </div>
                <div className="mt-8">
                  <h4 className="text-4xl font-black text-slate-800 tracking-tight">Zero</h4>
                  <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mt-1">Stigma Care</p>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Compassionate mental counseling focusing strictly on patient comfort.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Information */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800">
                A Unified Front Against Breast Cancer
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-sans">
                Fighting cancer requires more than just a single physician. It calls for an integrated alliance of medical, surgical, and supportive care providers. In modern breast oncology, the key to successful treatment lies in the custom synergy of these specialists.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  {
                    title: "Early Diagnosis and Accurate Staging",
                    desc: "Mammography screening clinics and pathologists work together to recognize cancerous anomalies before they advance."
                  },
                  {
                    title: "Subtle Surgical & Reconstructive Work",
                    desc: "Breast surgeons remove cancer cell margins, while reconstructive surgeons restore alignment, physical form, and self-confidence."
                  },
                  {
                    title: "Holistic Counseling and Rehabilitation",
                    desc: "Mental health therapists and lymphedema physiotherapists help restore functional mobility and clear internal emotional strain."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="h-6 w-6 rounded-full bg-pink-100 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                      <Check className="h-3.5 w-3.5 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm font-heading">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          3. MEET YOUR BREAST CANCER CARE TEAM
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-pink-50/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider border border-purple-100">
              <Users2 className="h-4 w-4" />
              The Care Specialist Team
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Meet Your Multidisciplinary Care Team
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Click on any specialist category below to understand their dedicated responsibilities in your therapeutic journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Specialist Selector List */}
            <div className="lg:col-span-5 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-4 lg:pb-0 scrollbar-none max-h-[500px] lg:overflow-y-auto pr-0 lg:pr-3">
              {specialistsData.map((spec) => {
                const SpecIcon = spec.icon;
                const isSelected = selectedSpecialist === spec.id;
                return (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedSpecialist(spec.id)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl border text-left cursor-pointer transition-all shrink-0 select-none ${isSelected
                      ? "bg-white border-pink-500 text-pink-600 shadow-md scale-[1.02]"
                      : "bg-white border-slate-100 hover:border-slate-350 text-slate-650 shadow-xs"
                      }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? "bg-pink-100 text-pink-600" : "bg-slate-50 text-slate-400"}`}>
                      <SpecIcon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold tracking-tight whitespace-nowrap font-heading">{spec.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Details Card */}
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
                  {/* Decorative background circle */}
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
                      <p className="text-slate-600 text-sm leading-relaxed font-sans">{currentSpecialist.desc}</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 font-heading">Key Responsibilities</h4>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">{currentSpecialist.role}</p>
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

      {/* ----------------------------------------------------------------------
          4. FIND CARE SERVICES (DIRECTORY SECTION)
          ---------------------------------------------------------------------- */}
      <section id="care-services-directory" className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider border border-pink-100">
              <Search className="h-4 w-4" />
              Provider Search
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Verified Breast Cancer Care Directory
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Find hospitals, diagnostics labs, home care nursing services, and mental health counseling support near you. Filter by category or search by city.
            </p>
          </div>

          {/* Interactive Search Panel */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/50 shadow-md mb-12 space-y-6">
            {/* Search inputs row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search Bar */}
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

              {/* City filter drop down */}
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

            {/* Category tabs */}
            <div className="border-t border-slate-200 pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3 font-heading">Filter by Category</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer select-none ${selectedCategory === cat.value
                      ? "bg-pink-600 border-pink-600 text-white shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-350 text-slate-650"
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className="group bg-slate-50 hover:bg-white rounded-3xl p-6 border border-slate-200/40 shadow-xs hover:shadow-xl hover:border-pink-300 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Rating and Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full bg-slate-200/50 text-slate-600 text-[10px] font-bold uppercase tracking-wider group-hover:bg-pink-50 group-hover:text-pink-600 group-hover:border-pink-100 border border-transparent font-heading">
                          {service.category.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-bold text-slate-800">{service.rating}</span>
                          <span className="text-[10px] text-slate-400 font-medium">({service.reviews})</span>
                        </div>
                      </div>

                      {/* Header Info */}
                      <h4 className="font-heading text-lg font-extrabold text-slate-800 group-hover:text-pink-600 transition-colors leading-snug line-clamp-2">
                        {service.name}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5 font-sans">
                        <Stethoscope className="h-3.5 w-3.5 text-pink-500 shrink-0" />
                        {service.specialization}
                      </p>

                      <div className="space-y-2 mt-4 pt-4 border-t border-slate-200/50 text-xs text-slate-500 font-sans">
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

                    {/* CTA Buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-200/50">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDetailsModal(service)}
                        className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer h-9"
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setBookingModal(service)}
                        className="rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold cursor-pointer h-9"
                      >
                        Book Visit
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center space-y-4">
                  <AlertCircle className="h-12 w-12 text-slate-350 mx-auto" />
                  <h3 className="font-heading text-lg font-bold text-slate-700">No Providers Found</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto">
                    We couldn&apos;t find any clinics or diagnostic centers matching &ldquo;{searchQuery}&rdquo;. Try widening your filters or selecting &apos;All Cities&apos;.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedCity("all");
                    }}
                    className="bg-slate-200 hover:bg-slate-350 text-slate-750 font-bold px-5 py-2.5 rounded-xl cursor-pointer"
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
          5. BREAST CANCER TREATMENT JOURNEY TIMELINE
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-purple-950 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider border border-pink-500/20">
              <Activity className="h-4 w-4" />
              Patient Path Roadmap
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Breast Cancer Treatment Journey
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every patient&apos;s timeline is unique, but cancer staging and execution generally follow these 11 milestones. Select a step to read details.
            </p>
          </div>

          {/* Timeline Selector */}
          <div className="relative mb-10 pb-4 overflow-x-auto scrollbar-none">
            {/* Connecting Line (Only visible on md/desktop) */}
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

          {/* Active Step Panel */}
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

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl font-sans">
                {journeyStepsData[activeJourneyStep].desc}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 border-t border-white/10 pt-6">
                <span className="text-xs text-slate-400 font-medium">Want to know what care providers offer this phase?</span>
                <Button
                  size="sm"
                  onClick={() => {
                    const lookup: Record<number, string> = {
                      0: "clinics",
                      1: "diagnostics",
                      2: "clinics",
                      3: "diagnostics",
                      4: "hospitals",
                      5: "hospitals",
                      6: "chemotherapy",
                      7: "radiation",
                      8: "hospitals",
                      9: "rehab",
                      10: "palliative"
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

      {/* ----------------------------------------------------------------------
          6. SUPPORT SERVICES
          ---------------------------------------------------------------------- */}
      <section id="support-services-section" className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider border border-pink-100">
              <HeartHandshake className="h-4 w-4" />
              Integrated Support
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Compassionate Patient Support Services
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
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
                  className={`p-6 rounded-3xl border bg-white ${support.gradientClass} shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}
                >
                  <div className="space-y-4">
                    <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center shadow-xs border border-slate-100">
                      <SupportIcon className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <h4 className="font-heading text-base font-extrabold text-slate-800 leading-tight">{support.title}</h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed font-sans">{support.desc}</p>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-1.5 border-t border-slate-200/50 pt-4 text-[11px] text-slate-500 font-medium font-sans">
                    {support.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-605 shrink-0" />
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

      {/* ----------------------------------------------------------------------
          7. PATIENT RESOURCES
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-gradient-to-tr from-pink-50/40 via-purple-50/15 to-blue-50/30 border-y border-slate-200/55">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
              <FileText className="h-4 w-4" />
              Download Guides
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Downloadable Patient Guides &amp; Handbooks
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-sans">
              Equip yourself with comprehensive health checklists, question catalogs, diagnostic guidelines, and recovery books compiled by top medical specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patientResourcesData.map((res, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider font-heading">
                      {res.format}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold font-sans">{res.size}</span>
                  </div>
                  <h4 className="font-heading text-base font-extrabold text-slate-800 leading-snug group-hover:text-pink-600 transition-colors">
                    {res.title}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-sans">{res.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Button
                    onClick={() => handleDownload(res.title)}
                    className="w-full bg-slate-50 hover:bg-pink-600 text-slate-700 hover:text-white border border-slate-100 text-xs font-bold py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all shadow-2xs"
                  >
                    {downloadingResource === res.title ? (
                      <>
                        <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Downloading...
                      </>
                    ) : downloadedResources[res.title] ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        Downloaded!
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 shrink-0" />
                        Download Resource
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
          8. FREQUENTLY ASKED QUESTIONS
          ---------------------------------------------------------------------- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider border border-pink-100">
              <MessageSquare className="h-4 w-4" />
              FAQ Help Desk
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Care Provider FAQ
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-sans">
              Find instant answers to major patient queries regarding specialist matching, medical opinions, and tumor diagnostics.
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
                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer font-bold text-slate-800 hover:text-pink-600 transition-colors"
                  >
                    <span className="text-sm sm:text-base tracking-tight font-heading leading-tight">{faq.question}</span>
                    <div className="shrink-0 ml-4">
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
                        <div className="px-6 pb-6 pt-1 text-slate-500 text-xs sm:text-sm leading-relaxed border-t border-slate-200/40 font-sans">
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
          9. EMERGENCY & HELPLINE SECTION
          ---------------------------------------------------------------------- */}
      <section id="emergency-helpline-section" className="py-24 bg-gradient-to-r from-red-650 via-rose-600 to-pink-650 text-white relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Texts */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
                <AlertCircle className="h-4 w-4 animate-bounce" />
                Emergency Contact
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Need Immediate Care Assistance?
              </h2>
              <p className="text-rose-100 text-sm sm:text-base leading-relaxed font-sans">
                If you are facing immediate postsurgical complications, severe oncology side-effects, or require diagnostic scheduling help, connect with our support desk instantly.
              </p>

              {/* Direct Info Rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="p-3 rounded-xl bg-white/10 text-white">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-rose-250 uppercase tracking-widest font-bold font-heading">Call Free Helpline</p>
                    <p className="text-lg font-black text-white tracking-tight font-heading">+91 1800-419-5433</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="p-3 rounded-xl bg-white/10 text-white">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-rose-250 uppercase tracking-widest font-bold font-heading">Support Email</p>
                    <p className="text-base font-bold text-white font-heading">caredesk@breastcancer.org</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Buttons Container */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4">
              <a href="tel:+9118004195433" className="w-full">
                <Button className="w-full bg-white hover:bg-slate-100 text-red-600 font-bold py-6 px-6 rounded-2xl shadow-xl transition-all cursor-pointer text-base">
                  <Phone className="h-5 w-5 mr-2 shrink-0" />
                  Call Support Now
                </Button>
              </a>

              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("hospitals");
                  scrollToId("care-services-directory");
                }}
                className="w-full bg-white hover:bg-slate-100 text-red-600 font-bold py-6 px-6 rounded-2xl shadow-xl transition-all cursor-pointer text-base">
                Find Nearest Hospital
              </Button>

              <Button
                onClick={() => setHelpRequestOpen(true)}
                className="w-full bg-red-800/40 hover:bg-red-800/60 border border-white/20 text-white font-bold py-6 px-6 rounded-2xl transition-all cursor-pointer text-base"
              >
                Request Care Assistance
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          10. FINAL CALL TO ACTION (CTA)
          ---------------------------------------------------------------------- */}
      <section className="py-28 bg-slate-950 text-white relative overflow-hidden">
        {/* Background survivor image overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/12.png"
            alt="Breast cancer survivor and nurse smiling"
            className="w-full h-full object-cover object-center filter brightness-[0.25] pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center space-y-8">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider border border-pink-500/20"
          >
            <Heart className="h-4 w-4 text-pink-400 fill-pink-400 animate-pulse" />
            Stand Together
          </motion.div>

          <h2 className="font-heading text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            You Don&apos;t Have to Face <br />
            Breast Cancer Alone.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
            Our network of trusted care providers, oncological clinics, counseling groups, and recovery assets is here to assist you through diagnosis, surgery, treatment, and recovery.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              onClick={() => scrollToId("care-services-directory")}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-pink-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
            >
              Find Care Provider
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToId("emergency-helpline-section")}
              className="w-full sm:w-auto border-slate-500 text-pink-600 to-rose-500 hover:bg-white/10 font-bold px-8 py-6 rounded-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          MODALS / POP-UPS (BOOKING AND DETAILS VISUAL SIMULATORS)
          ---------------------------------------------------------------------- */}

      {/* 1. Care Provider Details Modal */}
      <AnimatePresence>
        {detailsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailsModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setDetailsModal(null)}
                className="absolute top-5 right-5 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <span className="inline-block px-2.5 py-0.5 rounded bg-pink-50 text-pink-600 text-[10px] font-bold uppercase tracking-wider mb-3 font-heading">
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
                  <p className="text-slate-650 text-xs sm:text-sm mt-1 leading-relaxed">
                    {detailsModal.about}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
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
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-pink-500/5 text-pink-700 border border-pink-500/10 text-[10px] font-bold flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="h-3 w-3 text-pink-600" />
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-6 mt-6">
                  <a href={`tel:${detailsModal.phone}`} className="w-full">
                    <Button variant="outline" className="w-full rounded-xl border-slate-200 text-slate-700 font-bold h-11 cursor-pointer">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Provider
                    </Button>
                  </a>
                  <Button
                    onClick={() => {
                      setDetailsModal(null);
                      setBookingModal(detailsModal);
                    }}
                    className="w-full rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold h-11 cursor-pointer"
                  >
                    Book Appointment
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Book Appointment Modal */}
      <AnimatePresence>
        {bookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetBookingForm}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl z-10"
            >
              {/* Close Button */}
              <button
                onClick={resetBookingForm}
                className="absolute top-5 right-5 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {!bookingSuccess ? (
                <>
                  <h3 className="font-heading text-xl font-extrabold text-slate-800 leading-tight">
                    Book Appointment
                  </h3>
                  <p className="text-xs text-slate-550 mt-1 font-sans">
                    Request a consult at <span className="font-bold text-pink-655">{bookingModal.name}</span>.
                  </p>

                  <form onSubmit={handleBookingSubmit} className="space-y-4 mt-6 font-sans">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Patient Name</label>
                      <Input
                        type="text"
                        required
                        placeholder="Enter full name"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        className="bg-slate-55 border-slate-200 h-10 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Phone Number</label>
                      <Input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        className="bg-slate-55 border-slate-200 h-10 rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Preferred Date</label>
                        <Input
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="bg-slate-55 border-slate-200 h-10 rounded-xl cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Preferred Slot</label>
                        <select
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full h-10 px-3 bg-slate-55 border border-slate-200 rounded-xl outline-none focus:border-pink-500 transition-colors text-xs font-semibold text-slate-705 cursor-pointer appearance-none"
                        >
                          <option value="09:00 AM">09:00 AM - 11:00 AM</option>
                          <option value="11:00 AM">11:00 AM - 01:00 PM</option>
                          <option value="02:00 PM">02:00 PM - 04:00 PM</option>
                          <option value="04:00 PM">04:00 PM - 06:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold h-11 rounded-xl cursor-pointer mt-2"
                    >
                      {bookingLoading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Confirm Appointment Request"
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="h-14 w-14 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="h-7 w-7 animate-pulse" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-800">Booking Request Sent</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-sans">
                    Thank you, <span className="font-bold">{bookingName}</span>. Your consultation request for <span className="font-bold">{bookingDate}</span> at {bookingTime} has been transmitted to the provider. The care coordinator will call you back shortly.
                  </p>
                  <Button
                    onClick={resetBookingForm}
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

      {/* 3. Request Assistance Modal */}
      <AnimatePresence>
        {helpRequestOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetHelpForm}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl z-10"
            >
              {/* Close Button */}
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
                  <p className="text-xs text-slate-500 mt-1 font-sans">
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
                        className="bg-slate-55 border-slate-200 h-10 rounded-xl"
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
                        className="bg-slate-55 border-slate-200 h-10 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">Brief Message / Needs</label>
                      <textarea
                        required
                        placeholder="Describe what help you require (e.g. screening camps, diagnostic funding, counseling)"
                        value={helpMessage}
                        onChange={(e) => setHelpMessage(e.target.value)}
                        className="w-full h-20 px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl outline-none focus:border-pink-500 transition-colors text-xs font-semibold text-slate-705 cursor-pointer"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={helpLoading}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11 rounded-xl cursor-pointer mt-2"
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
                  <div className="h-14 w-14 rounded-full bg-emerald-50 border-2 border-emerald-250 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="h-7 w-7 animate-pulse" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-800">Request Received</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-sans">
                    Thank you, <span className="font-bold">{helpName}</span>. Your request has been queued. Our patient counselor will contact you within 24 hours at <span className="font-bold">{helpPhone}</span> to guide you.
                  </p>
                  <Button
                    onClick={resetHelpForm}
                    className="bg-slate-200 hover:bg-slate-350 text-slate-750 font-bold px-6 py-2 rounded-xl cursor-pointer mt-4"
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

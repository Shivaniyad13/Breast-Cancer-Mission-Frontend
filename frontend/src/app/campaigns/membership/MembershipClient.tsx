"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Ribbon,
  Heart,
  Users,
  Award,
  BookOpen,
  Bell,
  Video,
  Activity,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Check,
  Star,
  Info,
  Sparkles,
  ChevronDown,
  Building2,
  Briefcase,
  UploadCloud,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  Stethoscope
} from "lucide-react";
import { applyOrganizationMemberAction, applyCorporatePartnerAction } from "@/app/actions/institution";

// Why Become a Member Cards
const whyBecomeMember = [
  {
    title: "Stay Updated with Campaigns",
    description: "Get real-time updates regarding running crowdfunding drives, diagnostics camps, and volunteer meetups in your region.",
    icon: <Bell className="h-6 w-6 text-primary" />
  },
  {
    title: "Access Exclusive Resources",
    description: "Read peer-reviewed oncology materials, download step-by-step BSE guides, and access preventive wellness publications.",
    icon: <BookOpen className="h-6 w-6 text-primary" />
  },
  {
    title: "Webinar & Event Invitations",
    description: "Receive priority notifications and calendar invites to direct webinar streams hosted by certified oncologists and doctors.",
    icon: <Video className="h-6 w-6 text-primary" />
  },
  {
    title: "Support Women's Health",
    description: "Become an active piece of a community dedicated to lowering breast cancer mortality through early screening advocacy.",
    icon: <Heart className="h-6 w-6 text-primary" />
  }
];

// Membership Benefits List
const membershipBenefits = [
  {
    title: "Access to Awareness Programs",
    description: "Get immediate entry to regional awareness campaigns, distribution kit sessions, and community walks.",
    icon: <Ribbon className="h-5 w-5 text-primary" />
  },
  {
    title: "Early Notification of Events",
    description: "Priority alerts for checkup camps, volunteer assemblies, and localized health seminar dates.",
    icon: <Bell className="h-5 w-5 text-primary" />
  },
  {
    title: "Webinar Participation",
    description: "Join live Q&A sessions with oncologists, radiologists, and mental health counsellors on our webinar streams.",
    icon: <Video className="h-5 w-5 text-primary" />
  },
  {
    title: "Educational Resources",
    description: "Download verified diagnostic posters, flyers, brochures, and home self-examination calendars.",
    icon: <BookOpen className="h-5 w-5 text-primary" />
  },
  {
    title: "Digital Membership Certificate",
    description: "Receive a personalized, verifiably signed digital member certificate of participation (Future Feature).",
    icon: <Award className="h-5 w-5 text-primary" />
  },
  {
    title: "Community Networking",
    description: "Connect with patients, advocates, doctors, and NGO representatives to share support resources.",
    icon: <Users className="h-5 w-5 text-primary" />
  }
];

// FAQ list
const faqsList = [
  {
    q: "Who can become a member?",
    a: "Anyone passionate about women's health and breast cancer awareness is welcome to join. We have categories tailored for community supporters, active volunteers, and licensed healthcare professionals. Organizations can join as Institution Partners."
  },
  {
    q: "Is membership free?",
    a: "Yes, community membership for individuals is completely free. Our goal is to educate the public and lower diagnostic friction, so we encourage open participation."
  },
  {
    q: "How do I participate in campaigns?",
    a: "Once registered, you'll receive regional emails detailing local drives. Volunteers can support camp layouts, distribute Care Kits, and coordinate patient fundraiser links."
  },
  {
    q: "Can I attend webinars after becoming a member?",
    a: "Absolutely. Members receive automatic priority registration options and direct calendar links to all upcoming oncology live streams."
  },
  {
    q: "Will I receive a certificate?",
    a: "Currently, certificates are automatically generated upon scoring 80% on our health quizzes or attending webinars. In the future, we plan to release dedicated digital membership certificates."
  }
];

// Testimonials Placeholders
const testimonialsList = [
  {
    name: "Dr. Shalini Sharma",
    role: "Oncology Specialist",
    review: "Our community connects medical practitioners directly to patients who need early diagnostic counselling. It is a brilliant initiative that bridges crucial gaps in public awareness.",
    initials: "SS"
  },
  {
    name: "Aarav Mehta",
    role: "Lead Volunteer",
    review: "Hosting support walks and health camps is incredibly rewarding. The platform makes volunteering streamlined and keeps our goals completely transparent.",
    initials: "AM"
  },
  {
    name: "Priya Nair",
    role: "Community Member",
    review: "The monthly BSE timers and doctor webinars helped me build body awareness. Being part of this network makes me feel supported and informed.",
    initials: "PN"
  }
];

export default function MembershipClient() {
  const formSectionRef = useRef<HTMLDivElement>(null);

  // Selection workflow: 'individual' | 'institution'
  const [activeWorkflow, setActiveWorkflow] = useState<"individual" | "institution" | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<"NGO" | "CORPORATE" | null>(null);

  // Steps within institution forms
  const [ngoFormStep, setNgoFormStep] = useState(1);
  const [corpFormStep, setCorpFormStep] = useState(1);

  // Submit states for institution forms
  const [ngoSubmitted, setNgoSubmitted] = useState(false);
  const [corpSubmitted, setCorpSubmitted] = useState(false);

  // Individual Form States
  const [individualFormData, setIndividualFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    state: "",
    category: "volunteer", // 'volunteer' or 'professional'
    whyJoin: ""
  });
  const [individualErrors, setIndividualErrors] = useState<Record<string, string>>({});
  const [individualSubmitted, setIndividualSubmitted] = useState(false);

  // File Upload states (states: 'idle', 'uploading', 'success', 'error')
  const [ngoCertificateUpload, setNgoCertificateUpload] = useState({ state: "idle", filename: "", url: "" });
  const [ngoLogoUpload, setNgoLogoUpload] = useState({ state: "idle", filename: "", url: "" });
  const [ngoDocsUpload, setNgoDocsUpload] = useState({ state: "idle", filename: "", url: "" });

  const [corpLogoUpload, setCorpLogoUpload] = useState({ state: "idle", filename: "", url: "" });
  const [corpPolicyUpload, setCorpPolicyUpload] = useState({ state: "idle", filename: "", url: "" });
  const [corpDocsUpload, setCorpDocsUpload] = useState({ state: "idle", filename: "", url: "" });

  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // NGO Form State
  const [ngoData, setNgoData] = useState({
    organizationName: "",
    organizationType: "NGO",
    ngoRegistrationNumber: "",
    yearEstablished: "",
    contactPersonName: "",
    designation: "",
    email: "",
    mobileNumber: "",
    website: "",
    completeAddress: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    numberOfVolunteers: "",
    areasOfWork: "",
    previousExperience: "",
    expectedCollaboration: "",
    isDeclared: false
  });

  // Corporate Form State
  const [corpData, setCorpData] = useState({
    companyName: "",
    industry: "Technology",
    gstNumber: "",
    cinNumber: "",
    contactPersonName: "",
    designation: "",
    email: "",
    mobileNumber: "",
    website: "",
    companyAddress: "",
    state: "",
    city: "",
    pincode: "",
    employeeStrength: "",
    csrBudgetCategory: "Under 5 Lakhs",
    collaborationInterest: [] as string[],
    isDeclared: false
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);

  // File upload logic
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUploadState: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadState({ state: "uploading", filename: file.name, url: "" });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setUploadState({ state: "success", filename: file.name, url: data.url });
      } else {
        setUploadState({ state: "error", filename: file.name, url: "" });
      }
    } catch (err) {
      console.error(err);
      setUploadState({ state: "error", filename: file.name, url: "" });
    }
  };

  const handleNgoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setNgoData(prev => ({ ...prev, [name]: val }));
    if (formErrors[name]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCorpInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setCorpData(prev => ({ ...prev, [name]: val }));
    if (formErrors[name]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleInterestCheckboxChange = (interest: string, checked: boolean) => {
    setCorpData(prev => {
      const current = prev.collaborationInterest;
      const updated = checked
        ? [...current, interest]
        : current.filter(x => x !== interest);
      return { ...prev, collaborationInterest: updated };
    });
  };

  const scrollToForm = (workflow: "individual" | "institution", category?: string) => {
    setActiveWorkflow(workflow);
    if (workflow === "individual" && category) {
      setIndividualFormData(prev => ({ ...prev, category }));
    }
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Individual Form inputs change
  const handleIndividualInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIndividualFormData(prev => ({ ...prev, [name]: value }));
    if (individualErrors[name]) {
      setIndividualErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateIndividualForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!individualFormData.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!individualFormData.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(individualFormData.email)) {
      nextErrors.email = "Please enter a valid email address";
    }
    if (!individualFormData.mobile.trim()) {
      nextErrors.mobile = "Mobile number is required";
    } else if (!/^\+?[1-9]\d{1,14}$/.test(individualFormData.mobile.replace(/[\s-]/g, ""))) {
      nextErrors.mobile = "Please enter a valid mobile number";
    }
    if (!individualFormData.city.trim()) nextErrors.city = "City is required";
    if (!individualFormData.state.trim()) nextErrors.state = "State is required";
    if (!individualFormData.whyJoin.trim()) nextErrors.whyJoin = "Please describe why you want to join";

    setIndividualErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleIndividualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateIndividualForm()) {
      console.log("Submitting Membership Application:", individualFormData);
      setIndividualSubmitted(true);
    }
  };

  const resetIndividualForm = () => {
    setIndividualFormData({
      fullName: "",
      email: "",
      mobile: "",
      city: "",
      state: "",
      category: "volunteer",
      whyJoin: ""
    });
    setIndividualSubmitted(false);
  };

  const handleSelectFlow = (flow: "NGO" | "CORPORATE") => {
    setSelectedFlow(flow);
    setFormErrors({});
  };

  const validateNgoStep = (step: number) => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!ngoData.organizationName.trim()) errs.organizationName = "Organization Name is required";
      if (!ngoData.ngoRegistrationNumber.trim()) errs.ngoRegistrationNumber = "NGO Registration Number is required";
      if (!ngoData.yearEstablished.trim() || isNaN(Number(ngoData.yearEstablished))) {
        errs.yearEstablished = "Please enter a valid establishment year";
      }
    } else if (step === 2) {
      if (!ngoData.contactPersonName.trim()) errs.contactPersonName = "Contact Name is required";
      if (!ngoData.designation.trim()) errs.designation = "Designation is required";
      if (!ngoData.email.trim() || !/\S+@\S+\.\S+/.test(ngoData.email)) {
        errs.email = "Please enter a valid email address";
      }
      if (!ngoData.mobileNumber.trim()) errs.mobileNumber = "Mobile number is required";
    } else if (step === 3) {
      if (!ngoData.completeAddress.trim()) errs.completeAddress = "Address is required";
      if (!ngoData.state.trim()) errs.state = "State is required";
      if (!ngoData.district.trim()) errs.district = "District is required";
      if (!ngoData.city.trim()) errs.city = "City is required";
      if (!ngoData.pincode.trim()) errs.pincode = "Pincode is required";
    } else if (step === 4) {
      if (!ngoData.numberOfVolunteers.trim() || isNaN(Number(ngoData.numberOfVolunteers))) {
        errs.numberOfVolunteers = "Please enter a valid volunteers strength";
      }
      if (!ngoData.areasOfWork.trim()) errs.areasOfWork = "Please outline areas of work";
      if (!ngoData.previousExperience.trim()) errs.previousExperience = "Please outline previous campaign experience";
      if (!ngoData.expectedCollaboration.trim()) errs.expectedCollaboration = "Please describe collaboration expectation";
      if (ngoCertificateUpload.state !== "success") errs.ngoCertificate = "Please upload NGO Registration Certificate";
      if (ngoLogoUpload.state !== "success") errs.ngoLogo = "Please upload Organization Logo";
      if (ngoDocsUpload.state !== "success") errs.supportingDocs = "Please upload Supporting Documents";
      if (!ngoData.isDeclared) errs.isDeclared = "Please agree to the partnership declaration";
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateCorpStep = (step: number) => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!corpData.companyName.trim()) errs.companyName = "Company Name is required";
      if (!corpData.industry.trim()) errs.industry = "Industry selection is required";
      if (!corpData.gstNumber.trim()) errs.gstNumber = "GST Number is required";
    } else if (step === 2) {
      if (!corpData.contactPersonName.trim()) errs.contactPersonName = "Contact Name is required";
      if (!corpData.designation.trim()) errs.designation = "Designation is required";
      if (!corpData.email.trim() || !/\S+@\S+\.\S+/.test(corpData.email)) {
        errs.email = "Please enter a valid email address";
      }
      if (!corpData.mobileNumber.trim()) errs.mobileNumber = "Mobile number is required";
    } else if (step === 3) {
      if (!corpData.companyAddress.trim()) errs.companyAddress = "Company Address is required";
      if (!corpData.state.trim()) errs.state = "State is required";
      if (!corpData.city.trim()) errs.city = "City is required";
      if (!corpData.pincode.trim()) errs.pincode = "Pincode is required";
    } else if (step === 4) {
      if (!corpData.employeeStrength.trim() || isNaN(Number(corpData.employeeStrength))) {
        errs.employeeStrength = "Please enter a valid employee count";
      }
      if (corpData.collaborationInterest.length === 0) {
        errs.collaborationInterest = "Please select at least one collaboration interest";
      }
      if (corpLogoUpload.state !== "success") errs.companyLogo = "Please upload Company Logo";
      if (corpDocsUpload.state !== "success") errs.supportingDocs = "Please upload Supporting Documents";
      if (!corpData.isDeclared) errs.isDeclared = "Please agree to the partnership declaration";
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNgoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateNgoStep(4)) return;

    setIsPending(true);
    const payload = {
      ...ngoData,
      ngoCertificateUrl: ngoCertificateUpload.url,
      organizationLogoUrl: ngoLogoUpload.url,
      supportingDocumentsUrl: ngoDocsUpload.url
    };

    const res = await applyOrganizationMemberAction(payload);
    setIsPending(false);

    if (res.success) {
      setNgoSubmitted(true);
    } else {
      setFormErrors({ submit: res.error || "Failed to submit application." });
    }
  };

  const handleCorpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCorpStep(4)) return;

    setIsPending(true);
    const payload = {
      ...corpData,
      collaborationInterest: corpData.collaborationInterest.join(", "),
      companyLogoUrl: corpLogoUpload.url,
      csrPolicyUrl: corpPolicyUpload.url || null,
      supportingDocumentsUrl: corpDocsUpload.url
    };

    const res = await applyCorporatePartnerAction(payload);
    setIsPending(false);

    if (res.success) {
      setCorpSubmitted(true);
    } else {
      setFormErrors({ submit: res.error || "Failed to submit application." });
    }
  };

  return (
    <div className="flex-1 w-full bg-slate-50 text-slate-800 font-sans selection:bg-pink-100 selection:text-pink-700 overflow-x-hidden relative">

      {/* Decorative background blur blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200/25 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-gradient-to-b from-rose-50/40 via-white to-white py-20 md:py-28 border-b border-rose-100/30 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Hero Left Info */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/75 border border-pink-200/50 text-pink-700 text-xs font-bold uppercase tracking-wider"
              >
                <Users className="h-4 w-4 text-primary animate-pulse" />
                Community & Institutions
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-800 leading-tight"
              >
                Become a Stakeholder  <br />
                <span className="text-primary">Member or Partner</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium"
              >
                Join our mission to spread breast cancer awareness, support early detection, participate in community campaigns, and make a massive social impact.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4"
              >
                <Button
                  onClick={() => scrollToForm("individual", "volunteer")}
                  className="bg-primary hover:bg-primary/95 text-white font-semibold rounded-full shadow-md px-6 py-5 active:scale-95 transition-all cursor-pointer"
                >
                  Join as Individual
                </Button>
                <Button
                  onClick={() => scrollToForm("institution")}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-full shadow-md px-6 py-5 active:scale-95 transition-all cursor-pointer"
                >
                  Become Institution Partner
                </Button>
              </motion.div>
            </div>

            {/* Hero Right Graphic */}
            <div className="lg:col-span-5 relative flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="w-full max-w-sm relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-pink-400/20 to-rose-300/20 rounded-3xl opacity-30 blur-2xl z-0" />
                <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-pink-100/60 shadow-xl bg-white p-2.5 z-10 hover:shadow-2xl transition-all duration-500">
                  <Image
                    src="/images/awareness2.png"
                    alt="Preventive Health and Wellness Member Checkup"
                    fill
                    className="object-cover rounded-2xl"
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority
                  />
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                    <Sparkles className="h-3.5 w-3.5 text-primary fill-primary animate-pulse" />
                    Empowerment
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= WHY BECOME A MEMBER ================= */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-14">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <Info className="h-3.5 w-3.5" /> Core Value
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Why Join Us?
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              We coordinate resource distributions, direct oncology briefings, and early detection camps to support positive health outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyBecomeMember.map((item, idx) => (
              <Card key={idx} className="border-pink-100/50 bg-gradient-to-br from-white to-pink-50/[0.05] shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-6 group hover:border-pink-300">
                <div className="h-12 w-12 rounded-xl bg-pink-50 flex items-center justify-center border border-pink-100/30 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-heading text-xl font-bold mt-5 text-slate-800">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-3 font-medium">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* ================= MEMBERSHIP BENEFITS ================= */}
      <section id="membership-benefits" className="py-20 bg-gradient-to-b from-white to-pink-50/20 border-b border-pink-100/30 scroll-mt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/50 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Perks & Support
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Membership Benefits
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Enjoy exclusive support access while advancing regional diagnostic capabilities and public wellness guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {membershipBenefits.map((benefit, idx) => (
              <Card key={idx} className="border-pink-100/40 bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl flex flex-col justify-between group hover:border-pink-300">
                <CardHeader className="p-6 pb-2">
                  <div className="h-10 w-10 rounded-lg bg-pink-50 flex items-center justify-center border border-pink-100/20 group-hover:scale-105 transition-transform">
                    {benefit.icon}
                  </div>
                  <CardTitle className="font-heading text-lg font-bold mt-4 text-slate-800 group-hover:text-primary transition-colors">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* ================= MEMBERSHIP CATEGORIES ================= */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <Users className="h-3.5 w-3.5" /> Options
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Choose Your Membership Category
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              We have designed membership channels corresponding to your capacity to commit time, funds, or expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1: Institution Member (NEW) */}
            <Card className="border-pink-100/40 bg-gradient-to-br from-white to-pink-50/[0.02] shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between space-y-6 group hover:border-pink-300 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-pink-500 to-purple-600 text-white text-[9px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-bl-xl shadow-xs">
                Partner Hub
              </div>
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-pink-100 to-purple-100 text-primary flex items-center justify-center border border-pink-100/20 mx-auto group-hover:scale-105 transition-transform">
                  <Building2 className="h-7 w-7 text-pink-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">Institution Partner</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                    Specifically for NGOs, Hospitals, Colleges, Corporates, and CSR teams looking to co-organize awareness campaigns and diagnostics drives.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => scrollToForm("institution")}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-full py-5 active:scale-95 transition-all cursor-pointer border-0"
              >
                Register Organization
              </Button>
            </Card>

            {/* Card 2: Volunteer Member (Restored design) */}
            <Card className="border-pink-100/40 bg-gradient-to-br from-white to-pink-50/[0.02] shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between space-y-6 group hover:border-pink-300 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-pink-500 text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
                Popular Choice
              </div>
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-full bg-pink-50 text-primary flex items-center justify-center border border-pink-100/20 mx-auto group-hover:scale-105 transition-transform">
                  <Activity className="h-7 w-7 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">Volunteer Member</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                    For individuals who wish to actively participate in campaigns, coordinate checkup camp logistics, and lead community outreach.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => scrollToForm("individual", "volunteer")}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full py-5 active:scale-95 transition-all cursor-pointer"
              >
                Join Now
              </Button>
            </Card>

            {/* Card 3: Healthcare Expert (Restored design) */}
            <Card className="border-pink-100/40 bg-gradient-to-br from-white to-pink-50/[0.02] shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between space-y-6 group hover:border-pink-300 text-center">
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-full bg-pink-50 text-primary flex items-center justify-center border border-pink-100/20 mx-auto group-hover:scale-105 transition-transform">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">Healthcare Expert</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                    For doctors, nurses, counsellors, and healthcare specialists who want to contribute their expertise and verify content.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => scrollToForm("individual", "professional")}
                className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-full py-5 active:scale-95 transition-all cursor-pointer"
              >
                Join Now
              </Button>
            </Card>

          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-20 bg-gradient-to-b from-white to-pink-50/20 border-b border-pink-100/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/50 text-primary text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="h-3.5 w-3.5" /> Community Feedback
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              What Our Members Say
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Read feedback from individuals and doctors actively using the campaign network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsList.map((test, idx) => (
              <Card key={idx} className="border-pink-100/40 bg-white p-6 rounded-2xl shadow-xs space-y-4 hover:shadow-md transition-shadow relative">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-pink-100 text-primary flex items-center justify-center text-xs font-bold font-heading border border-pink-200/50">
                    {test.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{test.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{test.role}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed italic font-medium">
                  &ldquo;{test.review}&rdquo;
                </p>
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                  ))}
                </div>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* ================= DYNAMIC FORMS SECTION ================= */}
      <section ref={formSectionRef} className="py-20 bg-slate-50 border-t border-pink-100/30 scroll-mt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-8">

          <AnimatePresence mode="wait">
            {!activeWorkflow ? (
              <motion.div
                key="select-workflow-alert"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 p-8 bg-white border border-pink-100 rounded-3xl space-y-4 max-w-xl mx-auto shadow-sm"
              >
                <Award className="h-12 w-12 text-pink-400 mx-auto stroke-[1.2]" />
                <h3 className="font-heading text-2xl font-black text-slate-900">Start Your Membership</h3>
                <p className="text-slate-500 text-sm font-medium">Select a category above or choose an onboarding workflow below to load the registration form.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                  <Button onClick={() => scrollToForm("individual", "volunteer")} className="bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs py-3.5 px-6">Individual Member</Button>
                  <Button onClick={() => scrollToForm("institution")} className="bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl text-xs py-3.5 px-6 border-0">Institution Partner</Button>
                </div>
              </motion.div>
            ) : activeWorkflow === "individual" ? (

              /* ================= RESTORED INDIVIDUAL REGISTRATION FORM ================= */
              <motion.div
                key="individual-registration-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <span className="bg-pink-100 text-pink-700 border border-pink-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
                    <Users className="h-3 w-3" /> Individual Registration Form
                  </span>
                  <h2 className="font-heading text-3xl font-black tracking-tight text-slate-900">
                    Apply for Membership
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm font-medium">Provide your details below to request community member registration.</p>
                </div>

                <Card className="border-pink-100 bg-white shadow-xl rounded-3xl p-6 sm:p-10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-primary" />

                  <AnimatePresence mode="wait">
                    {!individualSubmitted ? (
                      <motion.form
                        key="individual-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleIndividualSubmit}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Full Name */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Full Name</label>
                            <input
                              type="text"
                              name="fullName"
                              value={individualFormData.fullName}
                              onChange={handleIndividualInputChange}
                              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${individualErrors.fullName ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-pink-100"
                                }`}
                              placeholder="Jane Doe"
                            />
                            {individualErrors.fullName && <p className="text-[10px] text-rose-500 font-bold">{individualErrors.fullName}</p>}
                          </div>

                          {/* Email */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email Address</label>
                            <input
                              type="email"
                              name="email"
                              value={individualFormData.email}
                              onChange={handleIndividualInputChange}
                              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${individualErrors.email ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-pink-100"
                                }`}
                              placeholder="jane@example.com"
                            />
                            {individualErrors.email && <p className="text-[10px] text-rose-500 font-bold">{individualErrors.email}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Mobile Number */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Mobile Number</label>
                            <input
                              type="tel"
                              name="mobile"
                              value={individualFormData.mobile}
                              onChange={handleIndividualInputChange}
                              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${individualErrors.mobile ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-pink-100"
                                }`}
                              placeholder="+91 9876543210"
                            />
                            {individualErrors.mobile && <p className="text-[10px] text-rose-500 font-bold">{individualErrors.mobile}</p>}
                          </div>

                          {/* Category Selection */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Membership Category</label>
                            <select
                              name="category"
                              value={individualFormData.category}
                              onChange={handleIndividualInputChange}
                              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-pink-100 bg-white"
                            >
                              <option value="volunteer">Volunteer Member</option>
                              <option value="professional">Healthcare Professional</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* City */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">City</label>
                            <input
                              type="text"
                              name="city"
                              value={individualFormData.city}
                              onChange={handleIndividualInputChange}
                              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${individualErrors.city ? "border-rose-500" : "border-slate-200 focus:border-primary"
                                }`}
                              placeholder="Mumbai"
                            />
                            {individualErrors.city && <p className="text-[10px] text-rose-500 font-bold">{individualErrors.city}</p>}
                          </div>

                          {/* State */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">State</label>
                            <input
                              type="text"
                              name="state"
                              value={individualFormData.state}
                              onChange={handleIndividualInputChange}
                              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${individualErrors.state ? "border-rose-500" : "border-slate-200 focus:border-primary"
                                }`}
                              placeholder="Maharashtra"
                            />
                            {individualErrors.state && <p className="text-[10px] text-rose-500 font-bold">{individualErrors.state}</p>}
                          </div>
                        </div>

                        {/* Why Join */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Why do you want to join?</label>
                          <textarea
                            name="whyJoin"
                            rows={4}
                            value={individualFormData.whyJoin}
                            onChange={handleIndividualInputChange}
                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all resize-none ${individualErrors.whyJoin ? "border-rose-500" : "border-slate-200 focus:border-primary"
                              }`}
                            placeholder="Share your goals or how you would like to contribute..."
                          />
                          {individualErrors.whyJoin && <p className="text-[10px] text-rose-500 font-bold">{individualErrors.whyJoin}</p>}
                        </div>

                        {/* Action Info Note */}
                        <div className="flex gap-2 p-4 rounded-xl bg-slate-50 text-slate-500 border border-slate-100">
                          <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                          <p className="text-[10px] leading-relaxed font-semibold">
                            Your details are kept confidential under platform privacy terms. System processes verify inputs before approval alerts are emailed.
                          </p>
                        </div>

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-xl py-4 active:scale-95 transition-all text-sm uppercase tracking-wider cursor-pointer"
                        >
                          Become a Member
                        </Button>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="success-screen"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-8 space-y-6"
                      >
                        <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-100 animate-bounce">
                          <Check className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-heading text-2xl font-black text-slate-800">Application Submitted!</h3>
                          <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">
                            Thank you, <strong className="text-slate-800">{individualFormData.fullName}</strong>. We have received your request for the <strong className="text-slate-800 uppercase">{individualFormData.category}</strong> membership tier.
                          </p>
                        </div>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Our community coordinators will review your submission and email registration credentials shortly.
                        </p>
                        <div className="pt-4 flex gap-3 justify-center">
                          <Button
                            onClick={resetIndividualForm}
                            className="bg-primary hover:bg-primary/95 text-white font-bold rounded-full py-4 px-6 active:scale-95 transition-all text-xs uppercase"
                          >
                            Submit Another
                          </Button>
                          <Link href="/">
                            <Button
                              variant="outline"
                              className="border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-full py-4 px-6 active:scale-95 transition-all text-xs uppercase"
                            >
                              Return Home
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ) : (

              /* ================= INSTITUTION MEMBER SELECTED: FLOWCHART + BRANCHING FORMS ================= */
              <motion.div
                key="institution-flowchart-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-10"
              >
                {/* flowchart layout */}
                <div className="text-center space-y-3">
                  <span className="bg-pink-100 text-pink-700 border border-pink-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
                    <Building2 className="h-3 w-3" /> Institution Partner Hub
                  </span>
                  <h2 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
                    Become an Institution Partner
                  </h2>
                  <p className="text-slate-500 text-sm font-medium max-w-lg mx-auto">
                    We welcome NGOs, hospitals, educational institutions, trusts, foundations, companies, and CSR teams to spread awareness and coordinate health advocacy camps.
                  </p>
                </div>

                {/* Diagram */}
                <div className="relative max-w-2xl mx-auto pt-2 pb-6 border border-pink-100 bg-white rounded-3xl shadow-xs">

                  {/* Top Node */}
                  <div className="inline-flex flex-col items-center mt-6 p-4 px-6 bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md border border-white/20 select-none">
                    <Building2 className="h-5 w-5 mb-1" />
                    Institution Member
                  </div>

                  {/* Lines */}
                  <div className="w-0.5 h-6 border-l-2 border-dashed border-pink-300 mx-auto" />

                  <div className="inline-block px-4 py-1.5 bg-pink-50 text-pink-700 border border-pink-100 rounded-full font-bold text-[10px] uppercase tracking-wide shadow-xs select-none">
                    Choose Membership Type
                  </div>

                  <div className="w-full relative h-10">
                    <svg className="w-full h-10 text-pink-300 max-w-md mx-auto" viewBox="0 0 400 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M200 0 V20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                      <path d="M100 20 H300" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                      <path d="M100 20 V40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                      <path d="M300 20 V40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                    </svg>
                  </div>

                  {/* Branches selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6 max-w-xl mx-auto text-left">
                    {/* Organization card */}
                    <div
                      onClick={() => handleSelectFlow("NGO")}
                      className={`cursor-pointer rounded-2xl p-4 border flex flex-col justify-between space-y-4 bg-white transition-all shadow-xs group ${selectedFlow === "NGO" ? "border-pink-500 ring-2 ring-pink-100" : "border-slate-100 hover:border-pink-300"
                        }`}
                    >
                      <div className="space-y-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-xs">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <h4 className="font-heading text-sm font-bold text-slate-800 group-hover:text-pink-600 transition-colors">Organization Member</h4>
                        <p className="text-[10.5px] text-slate-500 leading-normal font-medium">For NGOs, Trusts, Foundations, Hospitals, Educational Groups, and Welfare Units.</p>
                      </div>
                      <Button className={`w-full font-bold rounded-lg text-[10px] py-2 h-auto cursor-pointer ${selectedFlow === "NGO" ? "bg-pink-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-pink-50"
                        }`}>
                        Register NGO Flow
                      </Button>
                    </div>

                    {/* Corporate card */}
                    <div
                      onClick={() => handleSelectFlow("CORPORATE")}
                      className={`cursor-pointer rounded-2xl p-4 border flex flex-col justify-between space-y-4 bg-white transition-all shadow-xs group ${selectedFlow === "CORPORATE" ? "border-purple-500 ring-2 ring-purple-100" : "border-slate-100 hover:border-purple-300"
                        }`}
                    >
                      <div className="space-y-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-xs">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <h4 className="font-heading text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors">Corporate Partner</h4>
                        <p className="text-[10.5px] text-slate-500 leading-normal font-medium">For Companies, CSR Teams, Startups, and Healthcare Partnerships.</p>
                      </div>
                      <Button className={`w-full font-bold rounded-lg text-[10px] py-2 h-auto cursor-pointer ${selectedFlow === "CORPORATE" ? "bg-purple-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-purple-50"
                        }`}>
                        Register Corporate
                      </Button>
                    </div>
                  </div>

                </div>

                {/* Sub Forms */}
                <AnimatePresence mode="wait">
                  {selectedFlow === "NGO" ? (

                    /* Organization Member Registration Form */
                    <motion.div
                      key="ngo-sub-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Stepper */}
                      <div className="flex justify-between items-center max-w-xs mx-auto pb-2">
                        {[1, 2, 3, 4].map((step) => (
                          <div key={step} className="flex items-center">
                            <button
                              type="button" onClick={() => step < ngoFormStep && setNgoFormStep(step)}
                              className={`h-6 w-6 rounded-full font-bold text-[10px] flex items-center justify-center transition-all ${ngoFormStep === step
                                ? "bg-pink-600 text-white ring-2 ring-pink-100"
                                : ngoFormStep > step
                                  ? "bg-emerald-500 text-white"
                                  : "bg-white border border-slate-200 text-slate-400"
                                }`}
                            >
                              {ngoFormStep > step ? <Check className="h-3.5 w-3.5" /> : step}
                            </button>
                            {step < 4 && <div className={`w-8 h-0.5 ${ngoFormStep > step ? "bg-emerald-400" : "bg-slate-200"}`} />}
                          </div>
                        ))}
                      </div>

                      <Card className="border-pink-100 bg-white shadow-xl rounded-3xl p-6 sm:p-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-500 to-rose-400" />

                        {!ngoSubmitted ? (
                          <form onSubmit={handleNgoSubmit} className="space-y-6 text-left">

                            {ngoFormStep === 1 && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h3 className="font-heading font-black text-base text-slate-800">Organization profile</h3>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Organization Name</label>
                                    <input
                                      type="text" name="organizationName" value={ngoData.organizationName} onChange={handleNgoInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.organizationName ? "border-rose-500" : "border-slate-200 focus:border-pink-500"}`}
                                      placeholder="Care for All Foundation"
                                    />
                                    {formErrors.organizationName && <p className="text-[10px] text-rose-500 font-bold">{formErrors.organizationName}</p>}
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Organization Type</label>
                                      <select
                                        name="organizationType" value={ngoData.organizationType} onChange={handleNgoInputChange}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none"
                                      >
                                        <option value="NGO">NGO</option>
                                        <option value="Trust">Trust</option>
                                        <option value="Foundation">Foundation</option>
                                        <option value="Educational Institution">Educational Institution</option>
                                        <option value="Hospital">Hospital</option>
                                        <option value="Medical College">Medical College</option>
                                        <option value="Community Group">Community Group</option>
                                        <option value="Social Welfare Organization">Social Welfare Organization</option>
                                      </select>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Year Established</label>
                                      <input
                                        type="text" name="yearEstablished" value={ngoData.yearEstablished} onChange={handleNgoInputChange}
                                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.yearEstablished ? "border-rose-500" : "border-slate-200"}`}
                                        placeholder="2018"
                                      />
                                      {formErrors.yearEstablished && <p className="text-[10px] text-rose-500 font-bold">{formErrors.yearEstablished}</p>}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">NGO Registration / Darpan ID</label>
                                    <input
                                      type="text" name="ngoRegistrationNumber" value={ngoData.ngoRegistrationNumber} onChange={handleNgoInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.ngoRegistrationNumber ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="NGO/2023/00123"
                                    />
                                    {formErrors.ngoRegistrationNumber && <p className="text-[10px] text-rose-500 font-bold">{formErrors.ngoRegistrationNumber}</p>}
                                  </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                  <Button type="button" onClick={() => validateNgoStep(1) && setNgoFormStep(2)} className="bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl px-6 py-3 cursor-pointer">
                                    Next <ChevronRight className="ml-1 h-4 w-4" />
                                  </Button>
                                </div>
                              </motion.div>
                            )}

                            {ngoFormStep === 2 && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h3 className="font-heading font-black text-base text-slate-800">Contact details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-2 col-span-1 sm:col-span-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Contact Person Name</label>
                                    <input
                                      type="text" name="contactPersonName" value={ngoData.contactPersonName} onChange={handleNgoInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.contactPersonName ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="Rajesh Patel"
                                    />
                                    {formErrors.contactPersonName && <p className="text-[10px] text-rose-500 font-bold">{formErrors.contactPersonName}</p>}
                                  </div>

                                  <div className="space-y-2 col-span-1 sm:col-span-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Designation</label>
                                    <input
                                      type="text" name="designation" value={ngoData.designation} onChange={handleNgoInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.designation ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="Managing Trustee"
                                    />
                                    {formErrors.designation && <p className="text-[10px] text-rose-500 font-bold">{formErrors.designation}</p>}
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email Address</label>
                                    <input
                                      type="email" name="email" value={ngoData.email} onChange={handleNgoInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.email ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="contact@foundation.org"
                                    />
                                    {formErrors.email && <p className="text-[10px] text-rose-500 font-bold">{formErrors.email}</p>}
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Mobile Number</label>
                                    <input
                                      type="tel" name="mobileNumber" value={ngoData.mobileNumber} onChange={handleNgoInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.mobileNumber ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="+91 9876543210"
                                    />
                                    {formErrors.mobileNumber && <p className="text-[10px] text-rose-500 font-bold">{formErrors.mobileNumber}</p>}
                                  </div>

                                  <div className="space-y-2 col-span-1 sm:col-span-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Website URL</label>
                                    <input
                                      type="url" name="website" value={ngoData.website} onChange={handleNgoInputChange}
                                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                                      placeholder="https://foundation.org"
                                    />
                                  </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                  <Button type="button" onClick={() => setNgoFormStep(1)} variant="outline" className="border-slate-200 text-slate-600 rounded-xl px-6 py-3 cursor-pointer">
                                    Back
                                  </Button>
                                  <Button type="button" onClick={() => validateNgoStep(2) && setNgoFormStep(3)} className="bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl px-6 py-3 cursor-pointer">
                                    Next <ChevronRight className="ml-1 h-4 w-4" />
                                  </Button>
                                </div>
                              </motion.div>
                            )}

                            {ngoFormStep === 3 && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h3 className="font-heading font-black text-base text-slate-800">Address Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-2 col-span-1 sm:col-span-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Complete Address</label>
                                    <input
                                      type="text" name="completeAddress" value={ngoData.completeAddress} onChange={handleNgoInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.completeAddress ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="Address line 1"
                                    />
                                    {formErrors.completeAddress && <p className="text-[10px] text-rose-500 font-bold">{formErrors.completeAddress}</p>}
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">State</label>
                                    <input
                                      type="text" name="state" value={ngoData.state} onChange={handleNgoInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.state ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="Maharashtra"
                                    />
                                    {formErrors.state && <p className="text-[10px] text-rose-500 font-bold">{formErrors.state}</p>}
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">District</label>
                                    <input
                                      type="text" name="district" value={ngoData.district} onChange={handleNgoInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.district ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="Pune"
                                    />
                                    {formErrors.district && <p className="text-[10px] text-rose-500 font-bold">{formErrors.district}</p>}
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">City</label>
                                    <input
                                      type="text" name="city" value={ngoData.city} onChange={handleNgoInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.city ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="Pune"
                                    />
                                    {formErrors.city && <p className="text-[10px] text-rose-500 font-bold">{formErrors.city}</p>}
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Pincode</label>
                                    <input
                                      type="text" name="pincode" value={ngoData.pincode} onChange={handleNgoInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.pincode ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="411001"
                                    />
                                    {formErrors.pincode && <p className="text-[10px] text-rose-500 font-bold">{formErrors.pincode}</p>}
                                  </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                  <Button type="button" onClick={() => setNgoFormStep(2)} variant="outline" className="border-slate-200 text-slate-600 rounded-xl px-6 py-3 cursor-pointer">
                                    Back
                                  </Button>
                                  <Button type="button" onClick={() => validateNgoStep(3) && setNgoFormStep(4)} className="bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl px-6 py-3 cursor-pointer">
                                    Next <ChevronRight className="ml-1 h-4 w-4" />
                                  </Button>
                                </div>
                              </motion.div>
                            )}

                            {ngoFormStep === 4 && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h3 className="font-heading font-black text-base text-slate-800">Experience & Uploads</h3>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Number of Volunteers</label>
                                      <input
                                        type="text" name="numberOfVolunteers" value={ngoData.numberOfVolunteers} onChange={handleNgoInputChange}
                                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.numberOfVolunteers ? "border-rose-500" : "border-slate-200"}`}
                                        placeholder="25"
                                      />
                                      {formErrors.numberOfVolunteers && <p className="text-[10px] text-rose-500 font-bold">{formErrors.numberOfVolunteers}</p>}
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Areas of Work</label>
                                      <input
                                        type="text" name="areasOfWork" value={ngoData.areasOfWork} onChange={handleNgoInputChange}
                                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.areasOfWork ? "border-rose-500" : "border-slate-200"}`}
                                        placeholder="Healthcare, Rural outreach"
                                      />
                                      {formErrors.areasOfWork && <p className="text-[10px] text-rose-500 font-bold">{formErrors.areasOfWork}</p>}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Previous awareness campaigns</label>
                                    <textarea
                                      name="previousExperience" rows={2} value={ngoData.previousExperience} onChange={handleNgoInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none ${formErrors.previousExperience ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="Summary of previous work..."
                                    />
                                    {formErrors.previousExperience && <p className="text-[10px] text-rose-500 font-bold">{formErrors.previousExperience}</p>}
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Expected Collaboration</label>
                                    <textarea
                                      name="expectedCollaboration" rows={2} value={ngoData.expectedCollaboration} onChange={handleNgoInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none ${formErrors.expectedCollaboration ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="Expected collaboration..."
                                    />
                                    {formErrors.expectedCollaboration && <p className="text-[10px] text-rose-500 font-bold">{formErrors.expectedCollaboration}</p>}
                                  </div>

                                  {/* UPLOADS */}
                                  <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-bold uppercase text-slate-700 tracking-wider">Supporting Scans</span>

                                    <div className="space-y-2">
                                      <span className="text-xs text-slate-600 block">Registration Certificate</span>
                                      <div className="flex items-center gap-3">
                                        <input type="file" id="ngoCertFile" onChange={(e) => handleFileUpload(e, setNgoCertificateUpload)} className="hidden" accept=".pdf,.png,.jpg" />
                                        <label htmlFor="ngoCertFile" className="bg-white border rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-pink-600 cursor-pointer shadow-xs"><UploadCloud className="h-3.5 w-3.5 inline mr-1" /> Choose File</label>
                                        <span className="text-[11px] text-slate-500 truncate max-w-xs">{ngoCertificateUpload.state === "success" ? `✓ ${ngoCertificateUpload.filename}` : ngoCertificateUpload.state === "uploading" ? "Uploading..." : "No file"}</span>
                                      </div>
                                      {formErrors.ngoCertificate && <p className="text-[10px] text-rose-500 font-bold">{formErrors.ngoCertificate}</p>}
                                    </div>

                                    <div className="space-y-2">
                                      <span className="text-xs text-slate-600 block">Organization Logo</span>
                                      <div className="flex items-center gap-3">
                                        <input type="file" id="ngoLogoFile" onChange={(e) => handleFileUpload(e, setNgoLogoUpload)} className="hidden" accept=".png,.jpg" />
                                        <label htmlFor="ngoLogoFile" className="bg-white border rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-pink-600 cursor-pointer shadow-xs"><UploadCloud className="h-3.5 w-3.5 inline mr-1" /> Choose File</label>
                                        <span className="text-[11px] text-slate-500 truncate max-w-xs">{ngoLogoUpload.state === "success" ? `✓ ${ngoLogoUpload.filename}` : "No file"}</span>
                                      </div>
                                      {formErrors.ngoLogo && <p className="text-[10px] text-rose-500 font-bold">{formErrors.ngoLogo}</p>}
                                    </div>

                                    <div className="space-y-2">
                                      <span className="text-xs text-slate-600 block">Supporting Documents</span>
                                      <div className="flex items-center gap-3">
                                        <input type="file" id="ngoDocsFile" onChange={(e) => handleFileUpload(e, setNgoDocsUpload)} className="hidden" accept=".pdf" />
                                        <label htmlFor="ngoDocsFile" className="bg-white border rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-pink-600 cursor-pointer shadow-xs"><UploadCloud className="h-3.5 w-3.5 inline mr-1" /> Choose File</label>
                                        <span className="text-[11px] text-slate-500 truncate max-w-xs">{ngoDocsUpload.state === "success" ? `✓ ${ngoDocsUpload.filename}` : "No file"}</span>
                                      </div>
                                      {formErrors.supportingDocs && <p className="text-[10px] text-rose-500 font-bold">{formErrors.supportingDocs}</p>}
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-2 pt-2">
                                    <input type="checkbox" id="ngoIsDeclared" name="isDeclared" checked={ngoData.isDeclared} onChange={handleNgoInputChange} className="mt-1 h-4 w-4" />
                                    <label htmlFor="ngoIsDeclared" className="text-xs text-slate-500 cursor-pointer">I hereby declare that the details provided are correct and our organization commits to coordinating breast cancer awareness campaigns.</label>
                                  </div>
                                  {formErrors.isDeclared && <p className="text-[10px] text-rose-500 font-bold">{formErrors.isDeclared}</p>}
                                </div>

                                <div className="flex justify-between pt-4 border-t border-slate-100">
                                  <Button type="button" onClick={() => setNgoFormStep(3)} variant="outline" className="border-slate-200 text-slate-600 rounded-xl px-6 py-3 cursor-pointer">
                                    Back
                                  </Button>
                                  <Button type="submit" disabled={isPending} className="bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl px-6 py-3.5 cursor-pointer shadow-md">
                                    {isPending ? "Submitting..." : "Apply for Organization Membership"}
                                  </Button>
                                </div>
                              </motion.div>
                            )}

                          </form>
                        ) : (
                          <div className="text-center py-6 space-y-4">
                            <div className="h-14 w-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto"><Check className="h-7 w-7" /></div>
                            <h3 className="font-heading font-black text-xl text-slate-900">Application Submitted!</h3>
                            <p className="text-xs text-slate-500">Thank you, NGO application for **{ngoData.organizationName}** has been registered. Coordination managers will review details shortly.</p>
                            <Button onClick={() => { setNgoSubmitted(false); setNgoFormStep(1); }} className="bg-pink-600 text-white rounded-xl text-xs py-3 px-6 cursor-pointer">Submit Another</Button>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ) : selectedFlow === "CORPORATE" ? (

                    /* Corporate Partner Registration Form */
                    <motion.div
                      key="corp-sub-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Stepper */}
                      <div className="flex justify-between items-center max-w-xs mx-auto pb-2">
                        {[1, 2, 3, 4].map((step) => (
                          <div key={step} className="flex items-center">
                            <button
                              type="button" onClick={() => step < corpFormStep && setCorpFormStep(step)}
                              className={`h-6 w-6 rounded-full font-bold text-[10px] flex items-center justify-center transition-all ${corpFormStep === step
                                ? "bg-purple-600 text-white ring-2 ring-purple-100"
                                : corpFormStep > step
                                  ? "bg-emerald-500 text-white"
                                  : "bg-white border border-slate-200 text-slate-400"
                                }`}
                            >
                              {corpFormStep > step ? <Check className="h-3.5 w-3.5" /> : step}
                            </button>
                            {step < 4 && <div className={`w-8 h-0.5 ${corpFormStep > step ? "bg-emerald-400" : "bg-slate-200"}`} />}
                          </div>
                        ))}
                      </div>

                      <Card className="border-purple-100 bg-white shadow-xl rounded-3xl p-6 sm:p-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 to-pink-500" />

                        {!corpSubmitted ? (
                          <form onSubmit={handleCorpSubmit} className="space-y-6 text-left">

                            {corpFormStep === 1 && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h3 className="font-heading font-black text-base text-slate-800">Corporate profile</h3>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Company Name</label>
                                    <input
                                      type="text" name="companyName" value={corpData.companyName} onChange={handleCorpInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.companyName ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="Zenith Technologies"
                                    />
                                    {formErrors.companyName && <p className="text-[10px] text-rose-500 font-bold">{formErrors.companyName}</p>}
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Industry</label>
                                      <select
                                        name="industry" value={corpData.industry} onChange={handleCorpInputChange}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none"
                                      >
                                        <option value="Technology">Technology</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Retail">Retail</option>
                                        <option value="Manufacturing">Manufacturing</option>
                                        <option value="Education">Education</option>
                                        <option value="Other">Other</option>
                                      </select>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">GST Number</label>
                                      <input
                                        type="text" name="gstNumber" value={corpData.gstNumber} onChange={handleCorpInputChange}
                                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.gstNumber ? "border-rose-500" : "border-slate-200"}`}
                                        placeholder="27AAAAA1111A1Z1"
                                      />
                                      {formErrors.gstNumber && <p className="text-[10px] text-rose-500 font-bold">{formErrors.gstNumber}</p>}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">CIN Number (Optional)</label>
                                    <input
                                      type="text" name="cinNumber" value={corpData.cinNumber} onChange={handleCorpInputChange}
                                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                                      placeholder="L12345MH2023PLC123456"
                                    />
                                  </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                  <Button type="button" onClick={() => validateCorpStep(1) && setCorpFormStep(2)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl px-6 py-3 cursor-pointer">
                                    Next <ChevronRight className="ml-1 h-4 w-4" />
                                  </Button>
                                </div>
                              </motion.div>
                            )}

                            {corpFormStep === 2 && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h3 className="font-heading font-black text-base text-slate-800">Contact Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-2 col-span-1 sm:col-span-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Contact Person Name</label>
                                    <input
                                      type="text" name="contactPersonName" value={corpData.contactPersonName} onChange={handleCorpInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.contactPersonName ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="Sarah Jenkins"
                                    />
                                    {formErrors.contactPersonName && <p className="text-[10px] text-rose-500 font-bold">{formErrors.contactPersonName}</p>}
                                  </div>

                                  <div className="space-y-2 col-span-1 sm:col-span-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Designation</label>
                                    <input
                                      type="text" name="designation" value={corpData.designation} onChange={handleCorpInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.designation ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="CSR Lead"
                                    />
                                    {formErrors.designation && <p className="text-[10px] text-rose-500 font-bold">{formErrors.designation}</p>}
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email Address</label>
                                    <input
                                      type="email" name="email" value={corpData.email} onChange={handleCorpInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.email ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="sarah@company.com"
                                    />
                                    {formErrors.email && <p className="text-[10px] text-rose-500 font-bold">{formErrors.email}</p>}
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Mobile Number</label>
                                    <input
                                      type="tel" name="mobileNumber" value={corpData.mobileNumber} onChange={handleCorpInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.mobileNumber ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="+91 9999988888"
                                    />
                                    {formErrors.mobileNumber && <p className="text-[10px] text-rose-500 font-bold">{formErrors.mobileNumber}</p>}
                                  </div>

                                  <div className="space-y-2 col-span-1 sm:col-span-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Company Website URL</label>
                                    <input
                                      type="url" name="website" value={corpData.website} onChange={handleCorpInputChange}
                                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                                      placeholder="https://company.com"
                                    />
                                  </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                  <Button type="button" onClick={() => setCorpFormStep(1)} variant="outline" className="border-slate-200 text-slate-600 rounded-xl px-6 py-3 cursor-pointer">
                                    Back
                                  </Button>
                                  <Button type="button" onClick={() => validateCorpStep(2) && setCorpFormStep(3)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl px-6 py-3 cursor-pointer">
                                    Next <ChevronRight className="ml-1 h-4 w-4" />
                                  </Button>
                                </div>
                              </motion.div>
                            )}

                            {corpFormStep === 3 && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h3 className="font-heading font-black text-base text-slate-800">Company Location</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-2 col-span-1 sm:col-span-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Company Address</label>
                                    <input
                                      type="text" name="companyAddress" value={corpData.companyAddress} onChange={handleCorpInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.companyAddress ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="Corporate office HQ Address"
                                    />
                                    {formErrors.companyAddress && <p className="text-[10px] text-rose-500 font-bold">{formErrors.companyAddress}</p>}
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">State</label>
                                    <input
                                      type="text" name="state" value={corpData.state} onChange={handleCorpInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.state ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="Karnataka"
                                    />
                                    {formErrors.state && <p className="text-[10px] text-rose-500 font-bold">{formErrors.state}</p>}
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">City</label>
                                    <input
                                      type="text" name="city" value={corpData.city} onChange={handleCorpInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.city ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="Bengaluru"
                                    />
                                    {formErrors.city && <p className="text-[10px] text-rose-500 font-bold">{formErrors.city}</p>}
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Pincode</label>
                                    <input
                                      type="text" name="pincode" value={corpData.pincode} onChange={handleCorpInputChange}
                                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.pincode ? "border-rose-500" : "border-slate-200"}`}
                                      placeholder="560001"
                                    />
                                    {formErrors.pincode && <p className="text-[10px] text-rose-500 font-bold">{formErrors.pincode}</p>}
                                  </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                  <Button type="button" onClick={() => setCorpFormStep(2)} variant="outline" className="border-slate-200 text-slate-600 rounded-xl px-6 py-3 cursor-pointer">
                                    Back
                                  </Button>
                                  <Button type="button" onClick={() => validateCorpStep(3) && setCorpFormStep(4)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl px-6 py-3 cursor-pointer">
                                    Next <ChevronRight className="ml-1 h-4 w-4" />
                                  </Button>
                                </div>
                              </motion.div>
                            )}

                            {corpFormStep === 4 && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <h3 className="font-heading font-black text-base text-slate-800">CSR & Uploads</h3>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Employee Strength</label>
                                      <input
                                        type="text" name="employeeStrength" value={corpData.employeeStrength} onChange={handleCorpInputChange}
                                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${formErrors.employeeStrength ? "border-rose-500" : "border-slate-200"}`}
                                        placeholder="250"
                                      />
                                      {formErrors.employeeStrength && <p className="text-[10px] text-rose-500 font-bold">{formErrors.employeeStrength}</p>}
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">CSR Budget Category</label>
                                      <select
                                        name="csrBudgetCategory" value={corpData.csrBudgetCategory} onChange={handleCorpInputChange}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none"
                                      >
                                        <option value="Under 5 Lakhs">Under 5 Lakhs</option>
                                        <option value="5-10 Lakhs">5-10 Lakhs</option>
                                        <option value="10-25 Lakhs">10-25 Lakhs</option>
                                        <option value="25-50 Lakhs">25-50 Lakhs</option>
                                        <option value="50+ Lakhs">50+ Lakhs</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Collaboration Interest</label>
                                    <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border rounded-xl">
                                      {["Awareness Campaigns", "Employee Wellness", "Sponsorships", "Screening Camps", "Fundraising"].map((item) => (
                                        <div key={item} className="flex items-center gap-2">
                                          <input
                                            type="checkbox" id={`corp-interest-${item}`}
                                            checked={corpData.collaborationInterest.includes(item)}
                                            onChange={(e) => handleInterestCheckboxChange(item, e.target.checked)}
                                            className="h-4 w-4"
                                          />
                                          <label htmlFor={`corp-interest-${item}`} className="text-xs cursor-pointer select-none font-medium">{item}</label>
                                        </div>
                                      ))}
                                    </div>
                                    {formErrors.collaborationInterest && <p className="text-[10px] text-rose-500 font-bold">{formErrors.collaborationInterest}</p>}
                                  </div>

                                  {/* UPLOADS */}
                                  <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-bold uppercase text-slate-700 tracking-wider">Branding Documents</span>

                                    <div className="space-y-2">
                                      <span className="text-xs text-slate-600 block">Company Logo</span>
                                      <div className="flex items-center gap-3">
                                        <input type="file" id="corpLogoFile" onChange={(e) => handleFileUpload(e, setCorpLogoUpload)} className="hidden" accept=".png,.jpg" />
                                        <label htmlFor="corpLogoFile" className="bg-white border rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-purple-600 cursor-pointer shadow-xs"><UploadCloud className="h-3.5 w-3.5 inline mr-1" /> Choose File</label>
                                        <span className="text-[11px] text-slate-500 truncate max-w-xs">{corpLogoUpload.state === "success" ? `✓ ${corpLogoUpload.filename}` : "No file"}</span>
                                      </div>
                                      {formErrors.companyLogo && <p className="text-[10px] text-rose-500 font-bold">{formErrors.companyLogo}</p>}
                                    </div>

                                    <div className="space-y-2">
                                      <span className="text-xs text-slate-600 block">CSR Policy File (Optional)</span>
                                      <div className="flex items-center gap-3">
                                        <input type="file" id="corpPolicyFile" onChange={(e) => handleFileUpload(e, setCorpPolicyUpload)} className="hidden" accept=".pdf" />
                                        <label htmlFor="corpPolicyFile" className="bg-white border rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-purple-600 cursor-pointer shadow-xs"><UploadCloud className="h-3.5 w-3.5 inline mr-1" /> Choose File</label>
                                        <span className="text-[11px] text-slate-500 truncate max-w-xs">{corpPolicyUpload.state === "success" ? `✓ ${corpPolicyUpload.filename}` : "No file"}</span>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <span className="text-xs text-slate-600 block">Supporting Document</span>
                                      <div className="flex items-center gap-3">
                                        <input type="file" id="corpDocsFile" onChange={(e) => handleFileUpload(e, setCorpDocsUpload)} className="hidden" accept=".pdf" />
                                        <label htmlFor="corpDocsFile" className="bg-white border rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-purple-600 cursor-pointer shadow-xs"><UploadCloud className="h-3.5 w-3.5 inline mr-1" /> Choose File</label>
                                        <span className="text-[11px] text-slate-500 truncate max-w-xs">{corpDocsUpload.state === "success" ? `✓ ${corpDocsUpload.filename}` : "No file"}</span>
                                      </div>
                                      {formErrors.supportingDocs && <p className="text-[10px] text-rose-500 font-bold">{formErrors.supportingDocs}</p>}
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-2 pt-2">
                                    <input type="checkbox" id="corpIsDeclared" name="isDeclared" checked={corpData.isDeclared} onChange={handleCorpInputChange} className="mt-1 h-4 w-4" />
                                    <label htmlFor="corpIsDeclared" className="text-xs text-slate-500 cursor-pointer">I declare that corporate details are correct and we comply with statutory CSR rules.</label>
                                  </div>
                                  {formErrors.isDeclared && <p className="text-[10px] text-rose-500 font-bold">{formErrors.isDeclared}</p>}
                                </div>

                                <div className="flex justify-between pt-4 border-t border-slate-100">
                                  <Button type="button" onClick={() => setCorpFormStep(3)} variant="outline" className="border-slate-200 text-slate-600 rounded-xl px-6 py-3 cursor-pointer">
                                    Back
                                  </Button>
                                  <Button type="submit" disabled={isPending} className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl px-6 py-3.5 cursor-pointer shadow-md">
                                    {isPending ? "Submitting..." : "Become Corporate Partner"}
                                  </Button>
                                </div>
                              </motion.div>
                            )}

                          </form>
                        ) : (
                          <div className="text-center py-6 space-y-4">
                            <div className="h-14 w-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto"><Check className="h-7 w-7" /></div>
                            <h3 className="font-heading font-black text-xl text-slate-900">Application Submitted!</h3>
                            <p className="text-xs text-slate-500">Thank you, corporate application for **{corpData.companyName}** has been registered. Audits will be finalized shortly.</p>
                            <Button onClick={() => { setCorpSubmitted(false); setCorpFormStep(1); }} className="bg-purple-600 text-white rounded-xl text-xs py-3 px-6 cursor-pointer">Submit Another</Button>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="h-3.5 w-3.5" /> FAQ
            </span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Quick answers concerning registration timelines, costs, and partnership guidelines.
            </p>
          </div>

          <div className="space-y-4">
            {faqsList.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={idx} className="border border-pink-100/50 rounded-2xl bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-heading font-bold text-sm sm:text-base text-slate-800 hover:text-primary transition-colors cursor-pointer select-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-pink-50 text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                          {faq.a}
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

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-pink-500 to-rose-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[5%] w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-8 relative z-10">

          <div className="space-y-4">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Together We Can Build a Breast Cancer Aware Community
            </h2>
            <p className="text-pink-100 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
              Join active campaigns, take part in local screening workshops, and participate in direct patient care networks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
              onClick={() => scrollToForm("individual", "volunteer")}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-primary font-bold rounded-full py-6 px-8 shadow-lg active:scale-95 transition-all text-sm uppercase tracking-wider cursor-pointer"
            >
              Join as Volunteer
            </Button>
            <Button
              onClick={() => scrollToForm("institution")}
              variant="outline"
              className="w-full sm:w-auto border-white/40 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full py-6 px-8 active:scale-95 transition-all text-sm uppercase tracking-wider cursor-pointer"
            >
              Become Partner
            </Button>
          </div>

        </div>
      </section>

    </div>
  );
}

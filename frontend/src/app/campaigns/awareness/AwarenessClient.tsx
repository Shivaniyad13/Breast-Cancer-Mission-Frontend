"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Ribbon,
  Heart,
  ShieldCheck,
  Users,
  Award,
  Clock,
  Activity,
  Check,
  CheckCircle,
  Calendar,
  ArrowRight,
  ChevronRight,
  Info,
  X,
  HeartPulse,
  Sparkles,
  MapPin,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Phone,
  Globe,
  Quote,
  Stethoscope,
  GraduationCap,
  Briefcase,
  Footprints,
  Coins,
  Building2,
  HelpCircle,
  Handshake,
  Upload,
  Loader2,
  AlertCircle
} from "lucide-react";
import { submitPartnershipRequest, getApprovedPartnerships } from "@/app/actions/partnerships";

// Reusable animated counter component
function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMilliseconds = duration * 1000;
    const steps = 60;
    const stepTime = totalMilliseconds / steps;
    const increment = Math.ceil(end / steps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration, hasAnimated]);

  return <span ref={elementRef}>{count.toLocaleString()}</span>;
}

// Activity cards data (10 items)
const activitiesData = [
  {
    title: "Awareness Campaigns",
    description: "Spreading critical information about early signs, symptoms, risk factors, and breast health across urban and semi-urban communities.",
    icon: Ribbon,
    color: "from-pink-500 to-rose-500"
  },
  {
    title: "Free Health Check-up Camps",
    description: "Setting up accessible clinics staffed by qualified oncologists and general practitioners to conduct clinical physical evaluations.",
    icon: Stethoscope,
    color: "from-rose-500 to-pink-600"
  },
  {
    title: "Mammography Screening Drives",
    description: "Partnering with state-of-the-art mobile screening vans to offer low-income families and rural women direct access to mammograms.",
    icon: HeartPulse,
    color: "from-pink-600 to-purple-500"
  },
  {
    title: "Community Outreach Programs",
    description: "Collaborating with local community associations, resident clubs, and regional NGOs to distribute bilingual self-check guides.",
    icon: Users,
    color: "from-purple-500 to-indigo-500"
  },
  {
    title: "School & College Sessions",
    description: "Educating young students to dismantle societal stigmas, promote family-wide health awareness, and discuss breast safety lines.",
    icon: GraduationCap,
    color: "from-indigo-500 to-blue-500"
  },
  {
    title: "Corporate Wellness Seminars",
    description: "Engaging corporate workforces with dedicated awareness webinars, custom health packages, and on-site clinical checkup modules.",
    icon: Briefcase,
    color: "from-pink-500 to-violet-500"
  },
  {
    title: "Rural Outreach Initiatives",
    description: "Delivering diagnostic checkups and breast cancer guidance directly to remote villages, ensuring zero language barriers.",
    icon: MapPin,
    color: "from-rose-500 to-purple-600"
  },
  {
    title: "Survivor Support Programs",
    description: "Empowering recovery with survivor-led peer networks, post-operative care consultation, prosthetics coordination, and mental therapy.",
    icon: Heart,
    color: "from-red-500 to-pink-500"
  },
  {
    title: "Pink Ribbon Walks",
    description: "Conducting dynamic community marathons and walkathons to promote health awareness, celebrate survivors, and build solidarity.",
    icon: Footprints,
    color: "from-pink-500 to-rose-400"
  },
  {
    title: "Fundraising & CSR Campaigns",
    description: "Coordinating strategic corporate grants and public donations to directly subsidize cancer treatment bills at partner hospitals.",
    icon: Coins,
    color: "from-amber-500 to-pink-500"
  }
];

// Impact stats data
const impactStats = [
  { value: 55000, suffix: "+", label: "People Reached" },
  { value: 180, suffix: "+", label: "Programs Conducted" },
  { value: 6200, suffix: "+", label: "Free Screenings" },
  { value: 1450, suffix: "+", label: "Volunteers Engaged" },
  { value: 28, suffix: "+", label: "Partner Organizations" },
  { value: 12000, suffix: "+", label: "Lives Impacted" }
];

// Gallery Images mapping (existing project images)
const galleryImages = [
  {
    src: "/images/11.png",
    title: "Hope & Pink Ribbon Campaign",
    description: "Spreading solidarity and distributing diagnostic breast self-exam kits at regional community drives."
  },
  {
    src: "/images/12.png",
    title: "Clinical Mammography Van Setup",
    description: "Partnering with diagnostic clinics to execute mobile breast screening schedules for women over 40."
  },
  {
    src: "/images/13.png",
    title: "Support Group Circle",
    description: "Survivors and medical coordinators coming together to share experiences and build mental resilience."
  },
  {
    src: "/images/14.png",
    title: "Pink Walkathon for Awareness",
    description: "Mobilizing youth networks and regional supporters in a united walkathon to raise clinical funds."
  },
  {
    src: "/images/15.png",
    title: "Expert Oncology Webinar Panel",
    description: "Qualified doctors and oncologists teaching preventive care, cancer staging, and self-checks."
  },
  {
    src: "/images/16.png",
    title: "Volunteer Training Programs",
    description: "Preparing local student leaders and NGO workers to execute breast check camps safely in rural villages."
  },
  {
    src: "/images/17.png",
    title: "Healthy Lifestyle & Risk Reduction",
    description: "Sharing guidelines on nutrition, daily exercise schedules, and self-care routines to control risks."
  }
];

// Timeline journey steps
const timelineSteps = [
  {
    number: "01",
    title: "Planning & Mobilization",
    description: "Partnering with health organizations and identifying regions with low screening density to organize camps."
  },
  {
    number: "02",
    title: "Community Outreach",
    description: "Engaging local clubs, distributing guides, and conducting preliminary registration drives in target clusters."
  },
  {
    number: "03",
    title: "Awareness Sessions",
    description: "Conducting breast self-exam (BSE) tutorials, sharing warning signs, and debunking common cancer myths."
  },
  {
    number: "04",
    title: "Free Screening Camps",
    description: "Organizing mobile mammography drives and physical clinical checkups led by qualified oncologists."
  },
  {
    number: "05",
    title: "Follow-up & Guidance",
    description: "Distributing medical reports, explaining diagnostic markers, and scheduling specialist consultations if needed."
  },
  {
    number: "06",
    title: "Continued Support",
    description: "Guiding patients into treatment pathways, connecting them to survivor networks, and offering financial support."
  }
];

// Static fallback partners (existing items)
const staticPartners = [
  {
    id: "part-1",
    name: "Apollo Proton & Oncology Research Hospital",
    category: "Medical Partner",
    description: "A globally accredited tertiary oncology facility partnering on state-of-the-art targeted radiation and proton treatments.",
    website: "https://apollo-proton.com",
    logoUrl: "/grs-group-logo.jpg"
  },
  {
    id: "part-2",
    name: "Apex Comprehensive Diagnostics & Breast Clinic",
    category: "Medical Partner",
    description: "Provides complimentary automated breast ultrasound screening kits and digital tomosynthesis scans in collaborative outreach drives.",
    website: "https://apex-breastclinic.org",
    logoUrl: ""
  },
  {
    id: "part-3",
    name: "Tata Cancer Care Affiliate Center",
    category: "Medical Partner",
    description: "Subsidizes neoadjuvant chemotherapy cycles and complex double mastectomies for GRS program referrals.",
    website: "https://tata-affiliate.in",
    logoUrl: ""
  },
  {
    id: "part-4",
    name: "Sangini Breast Cancer Support Group",
    category: "NGO Partner",
    description: "Survivor-led NGO providing postoperative emotional counseling, clinical prosthetics distribution, and patient lodging.",
    website: "https://sangini-breastsupport.org",
    logoUrl: "/khushi-logo.jpg"
  },
  {
    id: "part-5",
    name: "Stree Shakti Women Empowerment League",
    category: "NGO Partner",
    description: "Conducts monthly grassroots awareness programs and breast self-examination workshops in rural communities.",
    website: "https://stree-shakti.org",
    logoUrl: ""
  },
  {
    id: "part-6",
    name: "National Institute of Cancer Genomics",
    category: "Research Partner",
    description: "Collaborates on sequencing hereditary BRCA1 & BRCA2 mutations across low-income patient cohorts.",
    website: "https://nicg-research.org",
    logoUrl: ""
  },
  {
    id: "part-7",
    name: "Novartis Biotech CSR Division",
    category: "CSR Partner",
    description: "Sponsors target hormone therapeutics and funds local patient navigation programs through annual CSR grants.",
    website: "https://novartis-csr.com",
    logoUrl: ""
  },
  {
    id: "part-8",
    name: "Microsoft Health Technology Partners",
    category: "Technology Partner",
    description: "Provides cloud database clusters for mobile screening diagnostics and funds AI diagnostic staging projects.",
    website: "https://microsoft.com/health-csr",
    logoUrl: ""
  }
];

export default function AwarenessClient() {
  const [lightboxImage, setLightboxImage] = useState<typeof galleryImages[0] | null>(null);

  // States for Become Our Partner Form Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dbPartners, setDbPartners] = useState<any[]>([]);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "Hospital",
    contactPersonName: "",
    designation: "",
    email: "",
    phone: "",
    website: "",
    city: "",
    state: "",
    country: "",
    logoUrl: "",
    documentUrl: "",
    category: "Medical Partner",
    description: "",
    reason: "",
    termsAccepted: false
  });

  // Fetch approved & published partners on load
  const loadPartners = async () => {
    const res = await getApprovedPartnerships();
    if (res.success && res.partnerships) {
      setDbPartners(res.partnerships);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  // Merge static partners with DB approved partners
  const combinedPartners = [
    ...staticPartners,
    ...dbPartners.map((p) => ({
      id: p.id,
      name: p.organizationName,
      category: p.category,
      description: p.description || "",
      website: p.website || "",
      logoUrl: p.logoUrl || ""
    }))
  ];

  // File upload logic
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isLogo: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isLogo) {
      setUploadingLogo(true);
    } else {
      setUploadingDoc(true);
    }

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: uploadData });
      if (!res.ok) throw new Error("File upload failed.");
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({
          ...prev,
          [isLogo ? "logoUrl" : "documentUrl"]: data.url
        }));
      }
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "Failed to upload file");
    } finally {
      if (isLogo) {
        setUploadingLogo(false);
      } else {
        setUploadingDoc(false);
      }
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    if (!formData.organizationName.trim()) {
      setSubmitError("Organization Name is required.");
      return;
    }
    if (!formData.contactPersonName.trim()) {
      setSubmitError("Contact Person Name is required.");
      return;
    }
    if (!formData.email.trim()) {
      setSubmitError("Email Address is required.");
      return;
    }
    if (!formData.phone.trim()) {
      setSubmitError("Phone Number is required.");
      return;
    }
    if (!formData.termsAccepted) {
      setSubmitError("You must agree to the Terms & Conditions.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitPartnershipRequest(formData);
      if (res.success) {
        setSubmitSuccess(true);
        // Reset form data
        setFormData({
          organizationName: "",
          organizationType: "Hospital",
          contactPersonName: "",
          designation: "",
          email: "",
          phone: "",
          website: "",
          city: "",
          state: "",
          country: "",
          logoUrl: "",
          documentUrl: "",
          category: "Medical Partner",
          description: "",
          reason: "",
          termsAccepted: false
        });
        loadPartners(); // Refresh list
      } else {
        setSubmitError(res.error || "Failed to submit application.");
      }
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to extract initials for fallback logo
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex-1 w-full bg-white text-slate-800 font-sans selection:bg-pink-100 selection:text-pink-700 overflow-x-hidden relative">
      
      {/* Dynamic blurred background visuals for premium feel */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse duration-[8000ms]" />
      <div className="absolute top-1/3 left-5 w-80 h-80 bg-rose-50/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-5 w-96 h-96 bg-pink-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-b from-rose-50/50 via-white to-white py-16 md:py-24 overflow-hidden border-b border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100/60 border border-pink-200/50 text-pink-700 text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Our Activities & Awareness
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-800 leading-[1.1]"
              >
                Creating Awareness, <br />
                <span className="bg-gradient-to-r from-primary via-rose-500 to-pink-600 bg-clip-text text-transparent">
                  Inspiring Hope
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium"
              >
                We are committed to early detection, community outreach, patient support, and active awareness campaigns. Together, we bring breast health guidelines directly to neighborhoods to save lives through early detection.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="pt-4 flex flex-wrap justify-center lg:justify-start gap-4"
              >
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/95 text-white font-bold rounded-full shadow-md shadow-pink-100 hover:shadow-lg hover:shadow-pink-200/50 px-8 py-6 active:scale-95 transition-all text-sm tracking-wide cursor-pointer">
                    Join Our Campaign
                  </Button>
                </Link>
                <Link href="/campaigns/volunteers">
                  <Button variant="outline" className="border-pink-200 text-primary hover:bg-pink-50/60 font-bold rounded-full px-8 py-6 active:scale-95 transition-all text-sm tracking-wide cursor-pointer">
                    Become a Volunteer
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right Column: Creative Media Graphic */}
            <div className="lg:col-span-5 relative flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="w-full max-w-md relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-pink-400/25 to-rose-300/25 rounded-3xl opacity-30 blur-2xl z-0" />
                <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-pink-100/50 shadow-2xl bg-white p-3 z-10 hover:shadow-pink-100/80 transition-shadow duration-500">
                  <Image
                    src="/images/community_walk.png"
                    alt="Creating Awareness Campaign Walk"
                    fill
                    className="object-cover rounded-2xl"
                    sizes="(max-width: 768px) 100vw, 450px"
                    priority
                  />
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-primary flex items-center gap-1.5 border border-pink-100 shadow-md">
                    <Ribbon className="h-4 w-4 text-primary fill-pink-100/50" />
                    Early Detection Saves Lives
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 2. OUR MISSION ================= */}
      <section className="py-20 md:py-28 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" /> Compassion in Action
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Our Core Mission
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              We lead regular health campaigns to dissolve taboos surrounding breast health and connect families with early clinical screening networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-pink-100/60 bg-gradient-to-br from-white to-pink-50/[0.03] shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl p-8 hover:border-pink-300 group">
              <div className="h-14 w-14 rounded-2xl bg-pink-50 text-primary flex items-center justify-center border border-pink-100/40 group-hover:scale-105 transition-transform duration-300">
                <HeartPulse className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl font-bold mt-6 text-slate-800">Early Detection Protocols</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-3 font-medium">
                Early checkups are a key factor in improving survivability. We actively distribute instructions and guides on Breast Self-Examination (BSE) to help women recognize normal changes and request specialist consultations immediately if symptoms emerge.
              </p>
            </Card>

            <Card className="border-pink-100/60 bg-gradient-to-br from-white to-pink-50/[0.03] shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl p-8 hover:border-pink-300 group">
              <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100/40 group-hover:scale-105 transition-transform duration-300">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl font-bold mt-6 text-slate-800">Community Outreach & Care</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-3 font-medium">
                Our campaigns bring breast health diagnostics into local communities and rural villages where resources are scarce. By overcoming linguistic and economic barriers, we ensure that every family receives clinical assessments, guidance, and emotional care.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ================= 3. OUR ACTIVITIES ================= */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-rose-50/30 border-t border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold uppercase tracking-wider">
              <Activity className="h-3.5 w-3.5" /> What We Do
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Our Activities & Initiatives
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              We conduct structured awareness initiatives to reach every segment of society and provide access to vital health resources.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          >
            {activitiesData.map((act, idx) => {
              const IconComponent = act.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="group bg-white/70 backdrop-blur-md border border-white/60 shadow-sm rounded-3xl p-6 hover:shadow-lg hover:border-pink-200 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 cursor-default relative overflow-hidden"
                >
                  {/* Subtle hover gradient circle in background */}
                  <div className={`absolute -right-6 -bottom-6 w-20 h-20 bg-gradient-to-tr ${act.color} opacity-0 group-hover:opacity-5 rounded-full transition-opacity duration-300`} />

                  <div className="space-y-4">
                    <div className={`h-11 w-11 rounded-2xl bg-gradient-to-tr ${act.color} text-white flex items-center justify-center shadow-md shadow-pink-100 group-hover:scale-105 transition-transform duration-300`}>
                      <IconComponent className="h-5.5 w-5.5" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-heading text-base font-bold text-slate-800 group-hover:text-primary transition-colors duration-200">
                        {act.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {act.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ================= 4. OUR IMPACT ================= */}
      <section className="py-20 md:py-28 bg-white border-y border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="h-3.5 w-3.5" /> Metrics of Change
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Our Community Impact
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              We monitor diagnostic and support analytics to verify and optimize the reach of our mobile camps and seminars.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {impactStats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-white to-pink-50/[0.04] border border-pink-100/40 rounded-3xl p-6 text-center space-y-2 shadow-xs hover:shadow-md hover:border-pink-200 transition-all duration-300 relative group"
              >
                <div className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix}
                </div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5. CAMPAIGN GALLERY ================= */}
      <section id="awareness-gallery" className="py-20 md:py-28 bg-white scroll-mt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100/60 text-primary text-xs font-bold uppercase tracking-wider">
              <Award className="h-3.5 w-3.5" /> Visual Moments
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Campaign Gallery
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Explore key moments captured during our health screening drives, walkathons, student rallies, and webinars.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryImages.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                onClick={() => setLightboxImage(img)}
                className="group cursor-pointer bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 relative aspect-square"
              >
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <h4 className="font-heading font-bold text-lg leading-tight translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {img.title}
                  </h4>
                  <p className="text-xs text-pink-55 line-clamp-2 mt-1 translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-75 font-medium">
                    {img.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl relative border border-slate-100 cursor-default"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/50 hover:bg-black/75 text-white border border-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative aspect-[4/3] w-full bg-slate-900">
                <Image
                  src={lightboxImage.src}
                  alt={lightboxImage.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="p-6 space-y-2 bg-white">
                <h3 className="font-heading text-xl font-extrabold text-slate-800">{lightboxImage.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{lightboxImage.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 6. AWARENESS JOURNEY ================= */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-rose-50/30 border-t border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <Calendar className="h-3.5 w-3.5" /> Chronological Path
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              The Awareness Journey
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              We design our community interventions around a structured 6-stage lifecycle to support patients from planning to survivorship care.
            </p>
          </div>

          {/* Timeline Layout */}
          <div className="relative">
            {/* Connection line on desktop */}
            <div className="absolute top-[24px] left-4 right-4 h-0.5 bg-pink-100 z-0 hidden lg:block" />

            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 relative z-10">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="flex lg:flex-col items-center lg:items-start text-left lg:text-center space-y-0 lg:space-y-4 gap-4 lg:gap-0 group">
                  
                  {/* Step Marker */}
                  <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-white border-2 border-pink-200 text-primary font-heading font-black text-lg shadow-sm group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 lg:mx-auto">
                    {step.number}
                  </div>

                  {/* Step Description */}
                  <div className="space-y-2 flex-1 lg:flex-none">
                    <h4 className="font-heading font-bold text-slate-800 text-base leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. VOLUNTEER WITH US ================= */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="border-pink-200/60 bg-gradient-to-br from-white via-pink-50/10 to-rose-50/20 shadow-xl rounded-3xl p-8 md:p-12 relative overflow-hidden group">
            {/* Decorative vector */}
            <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-pink-400/10 rounded-full blur-3xl pointer-events-none group-hover:scale-105 transition-transform duration-700" />
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              <div className="md:col-span-8 space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-primary text-xs font-bold uppercase tracking-wider">
                  <Users className="h-3.5 w-3.5" /> Joint Mission
                </span>
                
                <h3 className="font-heading text-3xl font-black text-slate-800 tracking-tight leading-tight">
                  Volunteer With Us
                </h3>
                
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                  Volunteering with the Breast Cancer Mission offers a direct way to support your local community. Engage in public checkup organization, distribute safety checklists, and assist survivors.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      Our Benefits
                    </h5>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Strategic leadership credentials, healthcare training sessions, and community appreciation.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      Our Responsibilities
                    </h5>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Coordinating walks, managing registry queues, and guiding patient families.
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 flex justify-center md:justify-end">
                <Link href="/campaigns/volunteers">
                  <Button className="bg-primary hover:bg-primary/95 text-white font-bold rounded-full py-6 px-8 shadow-lg shadow-pink-100 hover:shadow-xl active:scale-95 transition-all text-xs uppercase tracking-wider cursor-pointer">
                    Become a Volunteer
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ================= 8. PARTNER ORGANIZATIONS ================= */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-rose-50/30 border-t border-rose-100/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-16">
          
          {/* Enhanced Header Section with Become Our Partner button */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 pb-6 border-b border-pink-50">
            <div className="space-y-3 text-left">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
                <Building2 className="h-3.5 w-3.5" /> Institutional Network
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight animate-fade-in">
                Partner Organizations
              </h2>
              <p className="text-slate-500 text-sm sm:text-base font-medium max-w-xl">
                We collaborate with premier healthcare centers, corporate CSR divisions, and support organizations to expand diagnostic access.
              </p>
            </div>
            <div className="shrink-0">
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-primary hover:bg-primary/95 text-white font-bold rounded-full py-5 px-6 shadow-md hover:shadow-lg hover:shadow-pink-200/40 active:scale-95 transition-all text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Handshake className="h-4.5 w-4.5" /> Become Our Partner
              </Button>
            </div>
          </div>

          {/* Grid Displaying Static and Approved Partners */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {combinedPartners.map((partner, idx) => {
              const initials = getInitials(partner.name);

              return (
                <div
                  key={partner.id || idx}
                  className="bg-white/80 backdrop-blur-sm border border-pink-100/40 hover:border-pink-300 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:shadow-pink-50/40 transition-all duration-300 group cursor-default relative overflow-hidden"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Logo Image or Initials Fallback */}
                    {partner.logoUrl ? (
                      <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-pink-100/80 shadow-xs flex items-center justify-center bg-white shrink-0">
                        <Image
                          src={partner.logoUrl}
                          alt={partner.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-white flex items-center justify-center font-heading font-black text-xl shadow-md shrink-0 group-hover:scale-105 transition-transform duration-200">
                        {initials}
                      </div>
                    )}

                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100/50">
                        {partner.category}
                      </span>
                      <h4 className="font-heading font-black text-slate-800 text-sm leading-tight group-hover:text-primary transition-colors pt-2.5">
                        {partner.name}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3 pt-1">
                        {partner.description}
                      </p>
                    </div>
                  </div>

                  {/* Badge & Official Action Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                      <Check className="h-2.5 w-2.5" /> Official Partner
                    </span>
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                      >
                        Visit <Globe className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= PARTNERSHIP REQUEST FORM MODAL ================= */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto cursor-zoom-out"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl relative border border-slate-100 p-6 md:p-8 cursor-default max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-55 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-primary">
                  <Handshake className="h-6 w-6" />
                  <h3 className="font-heading text-2xl font-black text-slate-800">Become Our Partner</h3>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">
                  Apply to register your entity as an official Breast Cancer Mission partner organization.
                </p>
              </div>

              {submitSuccess ? (
                <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
                  <div className="h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-md">
                    <Check className="h-6 w-6" />
                  </div>
                  <h4 className="font-heading text-lg font-bold text-slate-800">Application Submitted!</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    Thank you for your partnership request. Our team will review your application and contact you shortly.
                  </p>
                  <Button
                    onClick={() => {
                      setIsFormOpen(false);
                      setSubmitSuccess(false);
                    }}
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-2 cursor-pointer font-bold"
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  {submitError && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Section 1: Org details */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-1">1. Organization Profile</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Organization Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.organizationName}
                          onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-primary font-medium"
                          placeholder="e.g. Apollo Diagnostics"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Organization Type *</label>
                        <select
                          value={formData.organizationType}
                          onChange={(e) => setFormData(prev => ({ ...prev, organizationType: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-primary font-medium"
                        >
                          <option>Hospital</option>
                          <option>NGO</option>
                          <option>Diagnostic Center</option>
                          <option>Corporate</option>
                          <option>Research Institute</option>
                          <option>Healthcare Provider</option>
                          <option>CSR Foundation</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Contact info */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-1">2. Primary Contact</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Contact Person Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.contactPersonName}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactPersonName: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-primary font-medium"
                          placeholder="FullName"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Designation</label>
                        <input
                          type="text"
                          value={formData.designation}
                          onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-primary font-medium"
                          placeholder="e.g. Managing Director"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-primary font-medium"
                          placeholder="e.g. contact@org.org"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-primary font-medium"
                          placeholder="Mobile with code"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Location and website */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-1">3. Address & Web Presence</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-primary font-medium"
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">State</label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-primary font-medium"
                          placeholder="State"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Country</label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-primary font-medium"
                          placeholder="Country"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Organization Website</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-primary font-medium"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  {/* Section 4: Category and files */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-1">4. Partnership Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Partnership Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-primary font-medium"
                        >
                          <option>Medical Partner</option>
                          <option>NGO Partner</option>
                          <option>CSR Partner</option>
                          <option>Technology Partner</option>
                          <option>Research Partner</option>
                          <option>Awareness Partner</option>
                          <option>Community Partner</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Organization Logo</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, true)}
                            className="hidden"
                            id="logo-upload-input"
                          />
                          <label
                            htmlFor="logo-upload-input"
                            className="bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0"
                          >
                            {uploadingLogo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                            Upload Logo
                          </label>
                          <span className="text-slate-400 text-[10px] truncate max-w-xs">
                            {formData.logoUrl ? "Uploaded successfully ✔" : "PNG / JPG format"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Supporting Documents (PDF/DOC)</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, false)}
                          className="hidden"
                          id="doc-upload-input"
                        />
                        <label
                          htmlFor="doc-upload-input"
                          className="bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0"
                        >
                          {uploadingDoc ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                          Upload Document
                        </label>
                        <span className="text-slate-400 text-[10px] truncate max-w-xs">
                          {formData.documentUrl ? "Uploaded successfully ✔" : "PDF or DOC format"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Written responses */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-1">5. Statements</h4>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Organization Description</label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-sm focus:outline-primary font-medium"
                        placeholder="Briefly describe your entity's history, field size, and healthcare activities."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Why do you want to partner with us?</label>
                      <textarea
                        rows={3}
                        value={formData.reason}
                        onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-sm focus:outline-primary font-medium"
                        placeholder="Detail your goals for collaboration (e.g. mobile screening sponsorship)."
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="terms-checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                      className="mt-1 h-4 w-4 accent-primary"
                    />
                    <label htmlFor="terms-checkbox" className="text-xs text-slate-500 font-medium leading-relaxed cursor-pointer">
                      I declare that all provided institutional details are accurate. We agree to support GRS Breast Cancer campaigns and adhere to screening quality guidelines. *
                    </label>
                  </div>

                  {/* Form Submission Action */}
                  <div className="pt-4 border-t flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsFormOpen(false)}
                      className="rounded-xl px-5 font-bold cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || uploadingLogo || uploadingDoc}
                      className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-2 cursor-pointer font-bold flex items-center gap-1.5"
                    >
                      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      Submit Application
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 9. CALL TO ACTION ================= */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-pink-500 to-rose-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[5%] w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-8 relative z-10">
          
          <div className="space-y-4">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Support Our Activities Today
            </h2>
            <p className="text-pink-100 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
              Help us expand free mobile mammography camps, schedule diagnostic webinars, and extend financial assistance to patient families in need.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <Link href="/register">
              <Button className="w-full bg-white hover:bg-slate-50 text-primary font-bold rounded-full py-6 px-4 shadow-lg active:scale-95 transition-all text-xs uppercase tracking-wider cursor-pointer">
                Join Campaign
              </Button>
            </Link>
            
            <Link href="/donate">
              <Button className="w-full bg-white hover:bg-slate-50 text-primary font-bold rounded-full py-6 px-4 shadow-lg active:scale-95 transition-all text-xs uppercase tracking-wider cursor-pointer">
                Donate Now
              </Button>
            </Link>

            <Link href="/campaigns/volunteers">
              <Button className="w-full border border-white/40 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full py-6 px-4 active:scale-95 transition-all text-xs uppercase tracking-wider cursor-pointer">
                Volunteer
              </Button>
            </Link>

            <Link href="/webinars">
              <Button className="w-full border border-white/40 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full py-6 px-4 active:scale-95 transition-all text-xs uppercase tracking-wider cursor-pointer">
                Attend Webinars
              </Button>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
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

interface DiagnosisClientProps {
  initialTechnologies: DiagnosisTechnology[];
}

export default function DiagnosisClient({ initialTechnologies }: DiagnosisClientProps) {
  const [technologies] = useState<DiagnosisTechnology[]>(initialTechnologies);
  const [selectedCategory, setSelectedCategory] = useState("All");

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
      // Pause other playing videos
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
            <a href="#showcase">
              <Button size="lg" className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-full px-8 py-6 text-base cursor-pointer shadow-lg shadow-pink-600/20 hover:scale-105 transition-all">
                Explore Diagnosis Methods
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          2. SHOWCASE SECTION (FILTER & GRID)
          ======================================================== */}
      <section id="showcase" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Aesthetic Category Tabs */}
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full">
              Technology Showcase
            </span>
            <h2 className="font-heading text-3xl font-black text-slate-900 mt-2">
              Advanced Clinical Diagnostics
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
              Select a diagnostic category below to view technical overviews, advantages, and specifications.
            </p>
          </div>

          <div className="flex gap-2 p-1.5 bg-white border border-slate-100 rounded-2xl overflow-x-auto max-w-full no-scrollbar shadow-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-950 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Technologies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTechnologies.map(tech => (
              <motion.div
                layout
                key={tech.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-white/80 backdrop-blur-md border border-white/40 shadow-xs hover:shadow-xl hover:border-pink-200 transition-all rounded-3xl overflow-hidden flex flex-col justify-between h-full group">
                  
                  {/* Visual Image / Video Header */}
                  <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group-hover:scale-[1.01] transition-transform duration-300">
                    {tech.introVideoUrl && tech.introVideoUrl.trim() !== "" ? (
                      <div className="relative w-full h-full">
                        <video
                          ref={el => { videoRefs.current[tech.id] = el; }}
                          src={tech.introVideoUrl}
                          className="w-full h-full object-cover"
                          playsInline
                          loop
                          muted
                        />
                        {/* Video Controls overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center justify-between text-white w-full">
                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); togglePlayVideo(tech.id); }}
                                className="h-8 w-8 rounded-full bg-white/20 hover:bg-pink-600 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                              >
                                {playingVideoId === tech.id ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white translate-x-0.5" />}
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); toggleMuteVideo(tech.id); }}
                                className="h-8 w-8 rounded-full bg-white/20 hover:bg-pink-600 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                              >
                                {mutedVideoId === tech.id ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                              </button>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleFullscreen(tech.id); }}
                              className="h-8 w-8 rounded-full bg-white/20 hover:bg-pink-600 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                            >
                              <Maximize className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Floating Play Overlay Badge when not playing */}
                        {playingVideoId !== tech.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
                            <div className="h-10 w-10 rounded-full bg-white/95 text-slate-800 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                              <Video className="h-5 w-5 text-pink-600" />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : tech.imageUrl ? (
                      <img
                        src={tech.imageUrl}
                        alt={tech.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-100">
                        <Stethoscope className="h-12 w-12 text-slate-300 animate-pulse" />
                      </div>
                    )}

                    {/* Category Label Overlay */}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 border border-white/20 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      {tech.category}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                          {tech.name}
                        </h3>
                        {tech.accuracy && (
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md inline-block mt-1">
                            Accuracy: {tech.accuracy}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {tech.shortOverview}
                      </p>

                      {/* Device & Mfg Info */}
                      <div className="text-[11px] space-y-1.5 border-t border-slate-100 pt-3 text-slate-600">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Developer:</span>
                          <span className="font-semibold">{tech.manufacturerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Country:</span>
                          <span>{tech.manufacturerCountry || "Global"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Indications:</span>
                          <span className="text-pink-600 font-semibold">{tech.recommendedGroup}</span>
                        </div>
                      </div>
                    </div>

                    {/* Learn More & Collab CTAs */}
                    <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
                      <Button
                        onClick={() => openDetailsDialog(tech)}
                        className="flex-1 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-bold gap-1 cursor-pointer h-10"
                      >
                        Learn More <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => openCollabDialog(tech.name)}
                        className="border-pink-100 text-pink-600 hover:bg-pink-50 hover:border-pink-200 rounded-xl text-[10px] font-bold px-3 cursor-pointer h-10 shrink-0"
                        title="Interested in collaborating?"
                      >
                        Partner
                      </Button>
                    </div>
                  </div>

                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ========================================================
          3. DIALOG: DETAILED TECHNOLOGY PAGE / DRAWER
          ======================================================== */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="w-full h-full max-w-full max-h-full sm:max-w-4xl sm:max-h-[90vh] sm:w-[calc(100%-2rem)] sm:h-auto overflow-y-auto rounded-none sm:rounded-3xl p-4 sm:p-6 md:p-8">
          {selectedTech && (
            <div className="space-y-8">
              
              {/* Header Showcase Banner */}
              <div className="relative h-48 sm:h-64 md:h-80 w-full rounded-2xl overflow-hidden bg-slate-950 shadow-lg">
                {selectedTech.imageUrl && (
                  <img
                    src={selectedTech.imageUrl}
                    alt={selectedTech.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-8 text-white">
                  <span className="bg-pink-600 border border-pink-500/20 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block w-fit mb-2">
                    {selectedTech.category}
                  </span>
                  <h2 className="font-heading text-lg sm:text-2xl md:text-4xl font-extrabold leading-tight">{selectedTech.name}</h2>
                  {selectedTech.accuracy && (
                    <p className="text-emerald-400 text-xs font-bold mt-1">Diagnostic Accuracy: {selectedTech.accuracy}</p>
                  )}
                </div>
              </div>

              {/* Grid content columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left: General Information */}
                <div className="md:col-span-2 space-y-6 text-xs text-slate-600">
                  <div className="space-y-2">
                    <h3 className="font-heading text-lg font-bold text-slate-800 flex items-center gap-1.5">
                      <Stethoscope className="h-5 w-5 text-pink-500" /> Examination Purpose
                    </h3>
                    <p className="leading-relaxed bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
                      {selectedTech.purpose}
                    </p>
                  </div>

                  {selectedTech.workflow && (
                    <div className="space-y-2">
                      <h3 className="font-heading text-base font-bold text-slate-800">Workflow Description</h3>
                      <p className="leading-relaxed bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
                        {selectedTech.workflow}
                      </p>
                    </div>
                  )}

                  {/* Timeline procedure steps */}
                  {selectedTech.stepByStep && (
                    <div className="space-y-4">
                      <h3 className="font-heading text-base font-bold text-slate-800 flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-pink-500" /> Step-by-Step Procedure
                      </h3>
                      <div className="relative border-l border-dashed border-pink-200 ml-3.5 pl-6 space-y-4">
                        {selectedTech.stepByStep.split("\n").filter(Boolean).map((step, idx) => (
                          <div key={idx} className="relative group">
                            {/* Bullet indicator */}
                            <div className="absolute -left-[30px] top-0 h-4 w-4 rounded-full bg-white border-2 border-pink-500 flex items-center justify-center text-[8px] font-bold text-pink-600 shadow-xs">
                              {idx + 1}
                            </div>
                            <p className="leading-relaxed font-medium text-slate-600">{step.replace(/^\d+\.\s*/, "")}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preparation Guidelines */}
                  {selectedTech.preparation && (
                    <div className="space-y-2">
                      <h3 className="font-heading text-base font-bold text-slate-800">Patient Preparation</h3>
                      <p className="leading-relaxed bg-amber-50/50 text-amber-900 border border-amber-100 p-4 rounded-2xl font-medium">
                        {selectedTech.preparation}
                      </p>
                    </div>
                  )}

                  {/* Duration, Benefits & Risks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedTech.benefits && (
                      <div className="bg-emerald-50/30 border border-emerald-100 p-4 rounded-2xl space-y-1">
                        <strong className="text-emerald-800 block text-xs uppercase tracking-wider">Benefits</strong>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{selectedTech.benefits}</p>
                      </div>
                    )}
                    {selectedTech.risks && (
                      <div className="bg-rose-50/30 border border-rose-100 p-4 rounded-2xl space-y-1">
                        <strong className="text-rose-800 block text-xs uppercase tracking-wider">Risks & Side Effects</strong>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{selectedTech.risks}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Manufacturer Profile & Actions */}
                <div className="space-y-6">
                  
                  {/* Specifications Card */}
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-2xs space-y-3 text-xs">
                    <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Technical Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Exam Duration:</span>
                        <strong className="text-slate-700">{selectedTech.duration || "N/A"}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Target Group:</span>
                        <strong className="text-slate-700">{selectedTech.recommendedGroup}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Developer / Organization Details */}
                  <div className="bg-pink-50/30 border border-pink-100/50 p-5 rounded-2xl shadow-2xs space-y-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-white rounded-lg border border-pink-100 flex items-center justify-center text-pink-500 shrink-0 font-bold">
                        {selectedTech.manufacturerLogoUrl ? (
                          <img src={selectedTech.manufacturerLogoUrl} alt="" className="h-full w-full object-cover rounded-lg" />
                        ) : (
                          <Building className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{selectedTech.manufacturerName}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{selectedTech.manufacturerCountry || "Global HQ"}</span>
                      </div>
                    </div>

                    {selectedTech.manufacturerOverview && (
                      <p className="text-[11px] text-slate-500 leading-relaxed italic">
                        "{selectedTech.manufacturerOverview}"
                      </p>
                    )}

                    <div className="space-y-2 pt-2 border-t border-pink-100/50 text-[11px]">
                      {selectedTech.manufacturerSpecialization && (
                        <div>
                          <span className="text-slate-400 block uppercase tracking-wider text-[9px]">Specialization</span>
                          <strong className="text-slate-700">{selectedTech.manufacturerSpecialization}</strong>
                        </div>
                      )}
                      {selectedTech.manufacturerWebsite && (
                        <a
                          href={selectedTech.manufacturerWebsite}
                          target="_blank"
                          rel="noreferrer"
                          className="text-pink-600 font-bold hover:underline flex items-center gap-1 mt-1.5"
                        >
                          <Globe className="h-3 w-3" /> Visit Developer Site <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>

                    {/* Partnership CTA Button */}
                    <div className="pt-2">
                      <Button
                        onClick={() => {
                          setIsDetailOpen(false);
                          openCollabDialog(selectedTech.name);
                        }}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs gap-1.5 cursor-pointer"
                      >
                        <Building className="h-4 w-4" /> Interested in Collaborating?
                      </Button>
                    </div>
                  </div>

                  {/* Brochure download link */}
                  {selectedTech.brochureUrl && (
                    <a href={selectedTech.brochureUrl} target="_blank" rel="noreferrer" className="block">
                      <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs gap-1.5 cursor-pointer">
                        <Download className="h-4 w-4 text-pink-500" /> Download Brochure
                      </Button>
                    </a>
                  )}
                </div>

              </div>

              {/* FAQs Accordion Section */}
              {selectedTech.faqs && (
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <h3 className="font-heading text-lg font-bold text-slate-800 flex items-center gap-1.5">
                    <HelpCircle className="h-5 w-5 text-pink-500" /> Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    {(typeof selectedTech.faqs === "string" ? JSON.parse(selectedTech.faqs) : selectedTech.faqs).map((faq: FAQItem, fIdx: number) => {
                      const isOpen = openFaqIndex === fIdx;
                      return (
                        <div key={fIdx} className="border border-slate-100 rounded-xl bg-white overflow-hidden transition-all">
                          <button
                            onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                            className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-800 text-xs md:text-sm cursor-pointer hover:bg-slate-50/20"
                          >
                            <span>{faq.q}</span>
                            {isOpen ? <Minus className="h-4 w-4 text-pink-500" /> : <Plus className="h-4 w-4 text-pink-500" />}
                          </button>
                          {isOpen && (
                            <div className="border-t border-slate-50 bg-slate-50/20 p-4 text-xs text-slate-500 leading-relaxed">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Related articles links */}
              {selectedTech.relatedArticles && (
                <div className="border-t border-slate-100 pt-6 space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">References & Related Articles</h4>
                  <div className="flex flex-col gap-2">
                    {(typeof selectedTech.relatedArticles === "string" ? JSON.parse(selectedTech.relatedArticles) : selectedTech.relatedArticles).map((art: ArticleItem, aIdx: number) => (
                      <a
                        key={aIdx}
                        href={art.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-pink-600 hover:text-pink-700 hover:underline flex items-center gap-1.5 font-semibold"
                      >
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" /> {art.title} <ExternalLink className="h-2.5 w-2.5 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter className="border-t border-slate-100 pt-4">
                <Button onClick={() => setIsDetailOpen(false)} className="rounded-xl bg-slate-900 text-white cursor-pointer">
                  Close Specifications
                </Button>
              </DialogFooter>

            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================
          4. DIALOG: COLLABORATION REQUEST FORM
          ======================================================== */}
      <Dialog open={isCollabOpen} onOpenChange={setIsCollabOpen}>
        <DialogContent className="w-full h-full max-w-full max-h-full sm:max-w-2xl sm:max-h-[85vh] sm:w-[calc(100%-2rem)] sm:h-auto overflow-y-auto rounded-none sm:rounded-3xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading font-extrabold text-slate-800 flex items-center gap-2">
              <Building className="h-6 w-6 text-pink-600" />
              Collaboration Proposal
            </DialogTitle>
            <DialogDescription className="text-xs">
              Establish a diagnostic partnership with Breast Cancer Awareness Mission. Submit company profiles, brochures, and contact details to request administrative review.
            </DialogDescription>
          </DialogHeader>

          {/* Form Message */}
          {formMessage && (
            <div className={`p-4 rounded-xl flex items-center gap-3 border ${
              formMessage.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border-emerald-100" 
                : "bg-rose-50 text-rose-800 border-rose-100"
            }`}>
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span className="text-xs font-semibold">{formMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleCollabSubmit} className="space-y-6 pt-4 text-xs">
            {/* 1. Organization & Contact Info */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] text-pink-600 border-b border-slate-100 pb-1.5">
                1. Institutional Details & Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="collab-org">Organization Name *</Label>
                  <Input 
                    id="collab-org" 
                    value={orgName} 
                    onChange={e => setOrgName(e.target.value)} 
                    placeholder="e.g. Apollo Diagnostics Group" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="collab-comp">Company / Division Name *</Label>
                  <Input 
                    id="collab-comp" 
                    value={companyName} 
                    onChange={e => setCompanyName(e.target.value)} 
                    placeholder="e.g. Imaging Systems Division" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="collab-person">Contact Person Name *</Label>
                  <Input 
                    id="collab-person" 
                    value={contactPerson} 
                    onChange={e => setContactPerson(e.target.value)} 
                    placeholder="e.g. Dr. Rajesh Kumar" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="collab-designation">Designation *</Label>
                  <Input 
                    id="collab-designation" 
                    value={designation} 
                    onChange={e => setDesignation(e.target.value)} 
                    placeholder="e.g. Medical Director" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="collab-email">Work Email Address *</Label>
                  <Input 
                    id="collab-email" 
                    type="email"
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="e.g. contact@org.com" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="collab-phone">Phone Number *</Label>
                  <Input 
                    id="collab-phone" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    placeholder="e.g. +91 98765 43210" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="collab-country">Country *</Label>
                  <Input 
                    id="collab-country" 
                    value={country} 
                    onChange={e => setCountry(e.target.value)} 
                    placeholder="e.g. India" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="collab-website">Official Website URL</Label>
                  <Input 
                    id="collab-website" 
                    value={website} 
                    onChange={e => setWebsite(e.target.value)} 
                    placeholder="https://example.com" 
                  />
                </div>
              </div>
            </div>

            {/* 2. Collaboration Scope */}
            <div className="space-y-4 pt-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] text-pink-600 border-b border-slate-100 pb-1.5">
                2. Technology & Partnership Scope
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="collab-tech-name">Machine / Technology Name *</Label>
                  <Input 
                    id="collab-tech-name" 
                    value={collabTechName} 
                    onChange={e => setCollabTechName(e.target.value)} 
                    placeholder="e.g. Philips Elition 3.0T MRI" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="collab-type">Collaboration Type *</Label>
                  <select 
                    id="collab-type"
                    value={collabType} 
                    onChange={e => setCollabType(e.target.value)} 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Equipment Supply">Equipment Supply / Donation</option>
                    <option value="Clinical Trials">Clinical Trials & Validation</option>
                    <option value="Awareness Campaign">Awareness & Screening Campaign Sponsorship</option>
                    <option value="Research & Training">Research & Radiology Staff Training</option>
                    <option value="Other">Other Integration Programs</option>
                  </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="collab-description">Project Collaboration Proposal / Comments *</Label>
                  <Textarea 
                    id="collab-description" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="Describe how your technology can benefit early screening programs or propose integrated activities..." 
                    className="h-24"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 3. Document Attachments */}
            <div className="space-y-4 pt-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] text-pink-600 border-b border-slate-100 pb-1.5">
                3. Upload Credentials & Specifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 relative">
                  <Label className="font-bold block">Upload Technology Brochure (PDF)</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="file" 
                      accept="application/pdf"
                      disabled={uploadingDoc !== null}
                      onChange={e => handleCollabDocUpload(e, "brochure")}
                      className="text-xs bg-white h-9"
                    />
                  </div>
                  {brochureUrl && (
                    <span className="text-[10px] text-emerald-700 font-semibold block flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Brochure attached.
                    </span>
                  )}
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 relative">
                  <Label className="font-bold block">Upload Company Profile (PDF)</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="file" 
                      accept="application/pdf"
                      disabled={uploadingDoc !== null}
                      onChange={e => handleCollabDocUpload(e, "profile")}
                      className="text-xs bg-white h-9"
                    />
                  </div>
                  {companyProfileUrl && (
                    <span className="text-[10px] text-emerald-700 font-semibold block flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Profile attached.
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* Consent checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <input 
                type="checkbox" 
                id="collab-consent" 
                checked={consent} 
                onChange={e => setConsent(e.target.checked)} 
                className="h-4 w-4 mt-0.5 rounded border-slate-300 accent-pink-600 shrink-0"
                required
              />
              <Label htmlFor="collab-consent" className="cursor-pointer font-medium text-slate-500 leading-tight">
                I represent that the information, logo, and brochures uploaded are authorized by our organization and comply with campaign privacy standards. *
              </Label>
            </div>

            <DialogFooter className="border-t border-slate-100 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCollabOpen(false)} className="rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={formPending || uploadingDoc !== null} className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl gap-2 font-bold cursor-pointer">
                {formPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit Collaboration Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}

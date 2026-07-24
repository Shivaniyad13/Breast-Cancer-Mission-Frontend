"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Link2,
  FileImage,
  Upload,
  Loader2,
  Check,
  X,
  FileText,
  HelpCircle,
  Briefcase,
  Globe,
  Settings,
  FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { 
  createDiagnosisTechnology, 
  updateDiagnosisTechnology, 
  deleteDiagnosisTechnology, 
  reorderDiagnosisTechnologies,
  updateCollaborationRequestStatus,
  deleteCollaborationRequest
} from "@/app/actions/diagnosis";

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
  faqs: any; // FAQItem[]
  relatedArticles: any; // ArticleItem[]
  brochureUrl: string | null;
  manufacturerName: string;
  manufacturerLogoUrl: string | null;
  manufacturerOverview: string | null;
  manufacturerWebsite: string | null;
  manufacturerCountry: string | null;
  manufacturerSpecialization: string | null;
  collaborationStatus: string | null;
  isActive: boolean;
  orderIndex: number;
}

interface CollaborationRequest {
  id: string;
  organizationName: string;
  companyName: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  country: string;
  website: string | null;
  technologyName: string;
  collaborationType: string;
  description: string;
  brochureUrl: string | null;
  companyProfileUrl: string | null;
  consent: boolean;
  status: string;
  createdAt: Date;
}

interface AdminDiagnosisDashboardProps {
  initialTechnologies: DiagnosisTechnology[];
  initialRequests: CollaborationRequest[];
}

export default function AdminDiagnosisDashboard({ 
  initialTechnologies, 
  initialRequests 
}: AdminDiagnosisDashboardProps) {
  const [activeTab, setActiveTab] = useState<"tech" | "collab">("tech");
  const [technologies, setTechnologies] = useState<DiagnosisTechnology[]>(initialTechnologies);
  const [requests, setRequests] = useState<CollaborationRequest[]>(initialRequests);

  // Status message
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Dialog Controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<DiagnosisTechnology | null>(null);
  const [isRequestDetailOpen, setIsRequestDetailOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CollaborationRequest | null>(null);

  // Upload progress indicators
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Mammography");
  const [shortOverview, setShortOverview] = useState("");
  const [accuracy, setAccuracy] = useState("");
  const [purpose, setPurpose] = useState("");
  const [advantages, setAdvantages] = useState("");
  const [limitations, setLimitations] = useState("");
  const [recommendedGroup, setRecommendedGroup] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [introVideoUrl, setIntroVideoUrl] = useState("");
  const [animationVideoUrl, setAnimationVideoUrl] = useState("");
  const [explainerVideoUrl, setExplainerVideoUrl] = useState("");
  const [workflow, setWorkflow] = useState("");
  const [stepByStep, setStepByStep] = useState("");
  const [preparation, setPreparation] = useState("");
  const [duration, setDuration] = useState("");
  const [benefits, setBenefits] = useState("");
  const [risks, setRisks] = useState("");
  const [whoShouldTake, setWhoShouldTake] = useState("");
  const [brochureUrl, setBrochureUrl] = useState("");
  
  // Manufacturer Form states
  const [manufacturerName, setManufacturerName] = useState("");
  const [manufacturerLogoUrl, setManufacturerLogoUrl] = useState("");
  const [manufacturerOverview, setManufacturerOverview] = useState("");
  const [manufacturerWebsite, setManufacturerWebsite] = useState("");
  const [manufacturerCountry, setManufacturerCountry] = useState("");
  const [manufacturerSpecialization, setManufacturerSpecialization] = useState("");
  const [collaborationStatus, setCollaborationStatus] = useState("None");
  const [isActive, setIsActive] = useState(true);

  // Lists state
  const [faqsList, setFaqsList] = useState<FAQItem[]>([]);
  const [articlesList, setArticlesList] = useState<ArticleItem[]>([]);

  // Open Form for Create
  const openCreateDialog = () => {
    setEditingTech(null);
    setName("");
    setCategory("Mammography");
    setShortOverview("");
    setAccuracy("");
    setPurpose("");
    setAdvantages("");
    setLimitations("");
    setRecommendedGroup("");
    setImageUrl("");
    setIntroVideoUrl("");
    setAnimationVideoUrl("");
    setExplainerVideoUrl("");
    setWorkflow("");
    setStepByStep("");
    setPreparation("");
    setDuration("");
    setBenefits("");
    setRisks("");
    setWhoShouldTake("");
    setBrochureUrl("");
    setManufacturerName("");
    setManufacturerLogoUrl("");
    setManufacturerOverview("");
    setManufacturerWebsite("");
    setManufacturerCountry("");
    setManufacturerSpecialization("");
    setCollaborationStatus("None");
    setIsActive(true);
    setFaqsList([]);
    setArticlesList([]);
    setIsFormOpen(true);
  };

  // Open Form for Edit
  const openEditDialog = (tech: DiagnosisTechnology) => {
    setEditingTech(tech);
    setName(tech.name);
    setCategory(tech.category);
    setShortOverview(tech.shortOverview);
    setAccuracy(tech.accuracy || "");
    setPurpose(tech.purpose);
    setAdvantages(tech.advantages);
    setLimitations(tech.limitations);
    setRecommendedGroup(tech.recommendedGroup);
    setImageUrl(tech.imageUrl || "");
    setIntroVideoUrl(tech.introVideoUrl || "");
    setAnimationVideoUrl(tech.animationVideoUrl || "");
    setExplainerVideoUrl(tech.explainerVideoUrl || "");
    setWorkflow(tech.workflow || "");
    setStepByStep(tech.stepByStep || "");
    setPreparation(tech.preparation || "");
    setDuration(tech.duration || "");
    setBenefits(tech.benefits || "");
    setRisks(tech.risks || "");
    setWhoShouldTake(tech.whoShouldTake || "");
    setBrochureUrl(tech.brochureUrl || "");
    setManufacturerName(tech.manufacturerName);
    setManufacturerLogoUrl(tech.manufacturerLogoUrl || "");
    setManufacturerOverview(tech.manufacturerOverview || "");
    setManufacturerWebsite(tech.manufacturerWebsite || "");
    setManufacturerCountry(tech.manufacturerCountry || "");
    setManufacturerSpecialization(tech.manufacturerSpecialization || "");
    setCollaborationStatus(tech.collaborationStatus || "None");
    setIsActive(tech.isActive);
    
    // Parse JSON lists safely
    try {
      const parsedFaqs = typeof tech.faqs === "string" ? JSON.parse(tech.faqs) : tech.faqs;
      setFaqsList(Array.isArray(parsedFaqs) ? parsedFaqs : []);
    } catch {
      setFaqsList([]);
    }
    
    try {
      const parsedArticles = typeof tech.relatedArticles === "string" ? JSON.parse(tech.relatedArticles) : tech.relatedArticles;
      setArticlesList(Array.isArray(parsedArticles) ? parsedArticles : []);
    } catch {
      setArticlesList([]);
    }

    setIsFormOpen(true);
  };

  // File Upload Helper
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(fieldName);
    setMessage(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        if (fieldName === "imageUrl") setImageUrl(data.url);
        if (fieldName === "introVideoUrl") setIntroVideoUrl(data.url);
        if (fieldName === "animationVideoUrl") setAnimationVideoUrl(data.url);
        if (fieldName === "explainerVideoUrl") setExplainerVideoUrl(data.url);
        if (fieldName === "brochureUrl") setBrochureUrl(data.url);
        if (fieldName === "manufacturerLogoUrl") setManufacturerLogoUrl(data.url);
        setMessage({ text: `${file.name} uploaded successfully!`, type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to upload file.", type: "error" });
      }
    } catch {
      setMessage({ text: "Upload failed.", type: "error" });
    } finally {
      setUploadingField(null);
    }
  };

  // List Item Management
  const addFaqItem = () => setFaqsList(prev => [...prev, { q: "", a: "" }]);
  const removeFaqItem = (index: number) => setFaqsList(prev => prev.filter((_, i) => i !== index));
  const updateFaqItem = (index: number, key: "q" | "a", val: string) => {
    setFaqsList(prev => prev.map((item, i) => i === index ? { ...item, [key]: val } : item));
  };

  const addArticleItem = () => setArticlesList(prev => [...prev, { title: "", link: "" }]);
  const removeArticleItem = (index: number) => setArticlesList(prev => prev.filter((_, i) => i !== index));
  const updateArticleItem = (index: number, key: "title" | "link", val: string) => {
    setArticlesList(prev => prev.map((item, i) => i === index ? { ...item, [key]: val } : item));
  };

  // Submit Technology Form
  const handleTechSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !shortOverview || !purpose || !advantages || !limitations || !recommendedGroup || !manufacturerName) {
      setMessage({ text: "Please fill in all required fields.", type: "error" });
      return;
    }

    setIsPending(true);
    setMessage(null);

    const payload = {
      name,
      category,
      shortOverview,
      accuracy: accuracy || null,
      purpose,
      advantages,
      limitations,
      recommendedGroup,
      imageUrl: imageUrl || null,
      introVideoUrl: introVideoUrl || null,
      animationVideoUrl: animationVideoUrl || null,
      explainerVideoUrl: explainerVideoUrl || null,
      workflow: workflow || null,
      stepByStep: stepByStep || null,
      preparation: preparation || null,
      duration: duration || null,
      benefits: benefits || null,
      risks: risks || null,
      whoShouldTake: whoShouldTake || null,
      brochureUrl: brochureUrl || null,
      manufacturerName,
      manufacturerLogoUrl: manufacturerLogoUrl || null,
      manufacturerOverview: manufacturerOverview || null,
      manufacturerWebsite: manufacturerWebsite || null,
      manufacturerCountry: manufacturerCountry || null,
      manufacturerSpecialization: manufacturerSpecialization || null,
      collaborationStatus: collaborationStatus || null,
      isActive,
      faqs: faqsList.filter(f => f.q.trim() && f.a.trim()),
      relatedArticles: articlesList.filter(a => a.title.trim() && a.link.trim())
    };

    try {
      if (editingTech) {
        const res = await updateDiagnosisTechnology(editingTech.id, payload);
        if (res.success && res.technology) {
          setTechnologies(prev => prev.map(t => t.id === editingTech.id ? { ...t, ...res.technology } as any : t));
          setIsFormOpen(false);
          setMessage({ text: "Diagnostic technology updated successfully!", type: "success" });
        } else {
          setMessage({ text: res.error || "Failed to update technology.", type: "error" });
        }
      } else {
        const res = await createDiagnosisTechnology(payload);
        if (res.success && res.technology) {
          setTechnologies(prev => [...prev, res.technology as any].sort((a, b) => a.orderIndex - b.orderIndex));
          setIsFormOpen(false);
          setMessage({ text: "New diagnostic technology added successfully!", type: "success" });
        } else {
          setMessage({ text: res.error || "Failed to create technology.", type: "error" });
        }
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An unexpected error occurred.", type: "error" });
    } finally {
      setIsPending(false);
    }
  };

  // Reorder Technologies
  const handleMoveTech = async (index: number, direction: "UP" | "DOWN") => {
    const nextIndex = direction === "UP" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= technologies.length) return;

    setMessage(null);
    const list = [...technologies];
    const temp = list[index];
    list[index] = list[nextIndex];
    list[nextIndex] = temp;

    try {
      const ids = list.map(t => t.id);
      const res = await reorderDiagnosisTechnologies(ids);
      if (res.success) {
        setTechnologies(list.map((item, idx) => ({ ...item, orderIndex: idx })));
        setMessage({ text: "Technologies reordered successfully!", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to save order.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Reordering failed.", type: "error" });
    }
  };

  // Delete Technology
  const handleDeleteTech = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this technology? This action cannot be undone.")) return;
    setMessage(null);
    try {
      const res = await deleteDiagnosisTechnology(id);
      if (res.success) {
        setTechnologies(prev => prev.filter(t => t.id !== id));
        setMessage({ text: "Technology deleted successfully.", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to delete technology.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Delete failed.", type: "error" });
    }
  };

  // Toggle Active State
  const handleToggleActive = async (tech: DiagnosisTechnology) => {
    setMessage(null);
    try {
      const res = await updateDiagnosisTechnology(tech.id, { isActive: !tech.isActive });
      if (res.success && res.technology) {
        setTechnologies(prev => prev.map(t => t.id === tech.id ? { ...t, isActive: res.technology.isActive } as any : t));
        setMessage({ text: `Technology ${!tech.isActive ? 'enabled' : 'disabled'} successfully!`, type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to update state.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Operation failed.", type: "error" });
    }
  };

  // Approve/Reject/Delete Collaboration Request
  const handleRequestStatusChange = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    setMessage(null);
    try {
      const res = await updateCollaborationRequestStatus(id, newStatus);
      if (res.success && res.request) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: res.request.status } as any : r));
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest(prev => prev ? { ...prev, status: res.request.status } : null);
        }
        setMessage({ text: `Request successfully ${newStatus.toLowerCase()}!`, type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to update status.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to update status.", type: "error" });
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collaboration request?")) return;
    setMessage(null);
    try {
      const res = await deleteCollaborationRequest(id);
      if (res.success) {
        setRequests(prev => prev.filter(r => r.id !== id));
        setIsRequestDetailOpen(false);
        setMessage({ text: "Request deleted successfully.", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to delete request.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Delete failed.", type: "error" });
    }
  };

  const openRequestDetail = (req: CollaborationRequest) => {
    setSelectedRequest(req);
    setIsRequestDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab selection */}
      <div className="flex gap-4">
        <Button 
          variant={activeTab === "tech" ? "default" : "outline"}
          onClick={() => setActiveTab("tech")}
          className="rounded-xl"
        >
          Manage Technologies ({technologies.length})
        </Button>
        <Button 
          variant={activeTab === "collab" ? "default" : "outline"}
          onClick={() => setActiveTab("collab")}
          className="rounded-xl"
        >
          Collaboration Requests ({requests.length})
        </Button>
      </div>

      {/* Global Status Message */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-100" 
            : "bg-rose-50 text-rose-800 border-rose-100"
        }`}>
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">{message.text}</span>
        </div>
      )}

      {/* ========================================================
          TAB 1: DIAGNOSTIC TECHNOLOGIES
          ======================================================== */}
      {activeTab === "tech" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-pink-100/50 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Diagnostics Database</h3>
              <p className="text-xs text-muted-foreground">Reorder, configure, enable/disable breast cancer exam technology listings.</p>
            </div>
            <Button onClick={openCreateDialog} className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl gap-2 font-bold cursor-pointer">
              <Plus className="h-4 w-4" /> Add Technology
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {technologies.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                <FolderOpen className="h-12 w-12 text-slate-300 mx-auto mb-2 animate-bounce" />
                <h4 className="font-bold text-slate-700">No technologies found</h4>
                <p className="text-xs text-slate-400 mt-1">Click "Add Technology" to start populating the diagnostic resource page.</p>
              </div>
            ) : (
              technologies.map((tech, idx) => (
                <Card key={tech.id} className="p-4 bg-white border-slate-100 hover:border-pink-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl">
                  <div className="flex gap-4 items-center">
                    <div className="h-12 w-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 font-bold shrink-0">
                      {tech.imageUrl ? (
                        <img src={tech.imageUrl} alt="" className="h-full w-full object-cover rounded-xl" />
                      ) : (
                        "2D"
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-base">{tech.name}</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded-full uppercase">
                          {tech.category}
                        </span>
                        {tech.collaborationStatus && tech.collaborationStatus !== "None" && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                            {tech.collaborationStatus}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {tech.shortOverview}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Developer: <strong className="text-slate-600">{tech.manufacturerName}</strong> ({tech.manufacturerCountry || "Unknown"})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    {/* Active Toggle */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive(tech)}
                      title={tech.isActive ? "Disable (Hide from client)" : "Enable (Show on client)"}
                      className={`h-8 w-8 rounded-lg cursor-pointer ${tech.isActive ? 'text-pink-600 hover:bg-pink-50' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                      {tech.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>

                    {/* Reorder Arrows */}
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={idx === 0}
                        onClick={() => handleMoveTech(idx, "UP")}
                        className="h-8 w-8 rounded-lg cursor-pointer"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={idx === technologies.length - 1}
                        onClick={() => handleMoveTech(idx, "DOWN")}
                        className="h-8 w-8 rounded-lg cursor-pointer"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Edit and Delete */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(tech)}
                      className="h-8 w-8 rounded-lg text-blue-600 border-blue-100 hover:bg-blue-50 cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteTech(tech.id)}
                      className="h-8 w-8 rounded-lg text-rose-600 border-rose-100 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: COLLABORATION REQUESTS
          ======================================================== */}
      {activeTab === "collab" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-pink-100/50 shadow-xs">
            <h3 className="font-bold text-slate-800 text-lg">Healthcare Collaborations Queue</h3>
            <p className="text-xs text-muted-foreground">Verify industry collaboration proposals, check uploaded profiles, and approve/reject request states.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-2 animate-pulse" />
                <h4 className="font-bold text-slate-700">No collaboration requests yet</h4>
                <p className="text-xs text-slate-400 mt-1">Applications submitted by companies on the Diagnosis page will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                      <th className="p-4">Organization / Company</th>
                      <th className="p-4">Contact Person</th>
                      <th className="p-4">Machine / Tech</th>
                      <th className="p-4">Collab Type</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(req => (
                      <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{req.organizationName}</div>
                          <div className="text-[10px] text-slate-400">{req.companyName}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-700">{req.contactPerson}</div>
                          <div className="text-[10px] text-slate-400">{req.designation}</div>
                        </td>
                        <td className="p-4 font-mono font-semibold text-slate-600">{req.technologyName}</td>
                        <td className="p-4 text-slate-500">{req.collaborationType}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                            req.status === "APPROVED" 
                              ? "bg-emerald-100 text-emerald-800"
                              : req.status === "REJECTED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                          <Button
                            variant="outline"
                            onClick={() => openRequestDetail(req)}
                            className="rounded-lg h-7 px-2.5 text-[11px] font-bold cursor-pointer"
                          >
                            Details
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleRequestStatusChange(req.id, "APPROVED")}
                            disabled={req.status === "APPROVED"}
                            className="rounded-lg h-7 px-2 border-emerald-100 text-emerald-700 bg-emerald-50/20 hover:bg-emerald-50 cursor-pointer"
                            title="Approve request"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleRequestStatusChange(req.id, "REJECTED")}
                            disabled={req.status === "REJECTED"}
                            className="rounded-lg h-7 px-2 border-rose-100 text-rose-700 bg-rose-50/20 hover:bg-rose-50 cursor-pointer"
                            title="Reject request"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleDeleteRequest(req.id)}
                            className="rounded-lg h-7 px-2 border-slate-200 text-slate-400 hover:bg-slate-100 cursor-pointer"
                            title="Delete record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL DIALOG: ADD/EDIT TECHNOLOGY FORM
          ======================================================== */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-full h-full max-w-full max-h-full sm:max-w-4xl sm:max-h-[85vh] sm:w-[calc(100%-2rem)] sm:h-auto overflow-y-auto rounded-none sm:rounded-3xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading font-extrabold text-slate-800 flex items-center gap-2">
              <Settings className="h-6 w-6 text-pink-600" />
              {editingTech ? "Modify Diagnostic Technology" : "Register Diagnostic Technology"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Complete the technological, clinical, and manufacturer details. The page dynamically displays this information to educate visitors.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleTechSubmit} className="space-y-6 pt-4 text-xs">
            {/* 1. Basic Metadata */}
            <div className="border-b border-slate-100 pb-4">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-3 text-[10px] text-pink-600">
                1. Basic Info & Classification
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="tech-name">Technology / Machine Name *</Label>
                  <Input 
                    id="tech-name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="e.g. Digital Breast Tomosynthesis" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tech-category">Technology Category *</Label>
                  <select 
                    id="tech-category"
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Mammography">Mammography</option>
                    <option value="3D Mammography">3D Mammography (Tomosynthesis)</option>
                    <option value="Ultrasound">Breast Ultrasound</option>
                    <option value="Breast MRI">Breast MRI</option>
                    <option value="AI Screenings">AI Screenings</option>
                    <option value="Other Scans">Other Technologies (CT/PET/Biopsy)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tech-accuracy">Accuracy Score (If public)</Label>
                  <Input 
                    id="tech-accuracy" 
                    value={accuracy} 
                    onChange={e => setAccuracy(e.target.value)} 
                    placeholder="e.g. 92% sensitivity rate" 
                  />
                </div>
              </div>
            </div>

            {/* 2. Key Text Content */}
            <div className="border-b border-slate-100 pb-4">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-3 text-[10px] text-pink-600">
                2. Educational Overviews
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="tech-short">Short Overview * (Grid preview card snippet)</Label>
                  <Textarea 
                    id="tech-short" 
                    value={shortOverview} 
                    onChange={e => setShortOverview(e.target.value)} 
                    placeholder="Short 2-sentence description of the device and its role..." 
                    className="h-20"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tech-purpose">Clinical Purpose *</Label>
                  <Textarea 
                    id="tech-purpose" 
                    value={purpose} 
                    onChange={e => setPurpose(e.target.value)} 
                    placeholder="Primary diagnostic objective of this examination..." 
                    className="h-20"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tech-advantages">Key Advantages * (Comma/newline separated list)</Label>
                  <Textarea 
                    id="tech-advantages" 
                    value={advantages} 
                    onChange={e => setAdvantages(e.target.value)} 
                    placeholder="Radiation-free, Quick, Comfortable, High Resolution..." 
                    className="h-20"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tech-limitations">Limitations * (Comma/newline separated list)</Label>
                  <Textarea 
                    id="tech-limitations" 
                    value={limitations} 
                    onChange={e => setLimitations(e.target.value)} 
                    placeholder="Lower effectiveness on dense tissue, High cost..." 
                    className="h-20"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 3. Deep Educational Info (Learn More Page Details) */}
            <div className="border-b border-slate-100 pb-4">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-3 text-[10px] text-pink-600">
                3. Examination Workflow & Patient Prep Details (Detailed View)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="tech-recommended">Recommended Patient Group / Age Range *</Label>
                  <Input 
                    id="tech-recommended" 
                    value={recommendedGroup} 
                    onChange={e => setRecommendedGroup(e.target.value)} 
                    placeholder="e.g. Women aged 40-74, or women with dense breasts" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tech-duration">Typical Examination Duration</Label>
                  <Input 
                    id="tech-duration" 
                    value={duration} 
                    onChange={e => setDuration(e.target.value)} 
                    placeholder="e.g. 15 to 20 minutes" 
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="tech-workflow">General Workflow Overview</Label>
                  <Textarea 
                    id="tech-workflow" 
                    value={workflow} 
                    onChange={e => setWorkflow(e.target.value)} 
                    placeholder="Describe the clinical workflow context..." 
                    className="h-16"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="tech-step-by-step">Step-by-step Procedure (One step per line)</Label>
                  <Textarea 
                    id="tech-step-by-step" 
                    value={stepByStep} 
                    onChange={e => setStepByStep(e.target.value)} 
                    placeholder="1. Patient stands in front of machine...\n2. Breast is compressed..." 
                    className="h-24"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tech-prep">Patient Preparation Guidelines</Label>
                  <Textarea 
                    id="tech-prep" 
                    value={preparation} 
                    onChange={e => setPreparation(e.target.value)} 
                    placeholder="e.g. Do not apply perfumes or deodorants prior to scanning..." 
                    className="h-20"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tech-who">Who Should Take This Test?</Label>
                  <Textarea 
                    id="tech-who" 
                    value={whoShouldTake} 
                    onChange={e => setWhoShouldTake(e.target.value)} 
                    placeholder="Describe indications: genetic risk, dense breast, family history..." 
                    className="h-20"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tech-benefits">Clinical Benefits</Label>
                  <Textarea 
                    id="tech-benefits" 
                    value={benefits} 
                    onChange={e => setBenefits(e.target.value)} 
                    placeholder="e.g. High early detection rates, reassurance, non-invasive..." 
                    className="h-20"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tech-risks">Clinical Risks / Side Effects</Label>
                  <Textarea 
                    id="tech-risks" 
                    value={risks} 
                    onChange={e => setRisks(e.target.value)} 
                    placeholder="e.g. Minor discomfort, exposure to radiation, risk of false alarms..." 
                    className="h-20"
                  />
                </div>
              </div>
            </div>

            {/* 4. Media Assets & Uploads */}
            <div className="border-b border-slate-100 pb-4">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-3 text-[10px] text-pink-600">
                4. Media Attachments & Assets
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="flex justify-between items-center">
                    <span>Main Showcase Image URL</span>
                    <span className="text-[10px] text-slate-400 font-normal">Or upload JPG/PNG</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="/images/placeholder.png" />
                    <div className="relative">
                      <Input type="file" accept="image/*" onChange={e => handleFileUpload(e, "imageUrl")} className="absolute inset-0 opacity-0 w-8 h-8 cursor-pointer" />
                      <Button type="button" variant="outline" size="icon" className="h-9 w-9" disabled={uploadingField === "imageUrl"}>
                        {uploadingField === "imageUrl" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="flex justify-between items-center">
                    <span>Introductory Video URL</span>
                    <span className="text-[10px] text-slate-400 font-normal">Or upload MP4</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input value={introVideoUrl} onChange={e => setIntroVideoUrl(e.target.value)} placeholder="/videoplayback.mp4" />
                    <div className="relative">
                      <Input type="file" accept="video/mp4" onChange={e => handleFileUpload(e, "introVideoUrl")} className="absolute inset-0 opacity-0 w-8 h-8 cursor-pointer" />
                      <Button type="button" variant="outline" size="icon" className="h-9 w-9" disabled={uploadingField === "introVideoUrl"}>
                        {uploadingField === "introVideoUrl" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="flex justify-between items-center">
                    <span>Diagnosis Animation Video URL</span>
                    <span className="text-[10px] text-slate-400 font-normal">Or upload MP4</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input value={animationVideoUrl} onChange={e => setAnimationVideoUrl(e.target.value)} placeholder="/animation.mp4" />
                    <div className="relative">
                      <Input type="file" accept="video/mp4" onChange={e => handleFileUpload(e, "animationVideoUrl")} className="absolute inset-0 opacity-0 w-8 h-8 cursor-pointer" />
                      <Button type="button" variant="outline" size="icon" className="h-9 w-9" disabled={uploadingField === "animationVideoUrl"}>
                        {uploadingField === "animationVideoUrl" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="flex justify-between items-center">
                    <span>Educational Explainer Video URL</span>
                    <span className="text-[10px] text-slate-400 font-normal">Or upload MP4</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input value={explainerVideoUrl} onChange={e => setExplainerVideoUrl(e.target.value)} placeholder="/explainer.mp4" />
                    <div className="relative">
                      <Input type="file" accept="video/mp4" onChange={e => handleFileUpload(e, "explainerVideoUrl")} className="absolute inset-0 opacity-0 w-8 h-8 cursor-pointer" />
                      <Button type="button" variant="outline" size="icon" className="h-9 w-9" disabled={uploadingField === "explainerVideoUrl"}>
                        {uploadingField === "explainerVideoUrl" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="flex justify-between items-center">
                    <span>Downloadable Brochure (PDF URL)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Or upload PDF</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input value={brochureUrl} onChange={e => setBrochureUrl(e.target.value)} placeholder="/brochures/device_specs.pdf" />
                    <div className="relative">
                      <Input type="file" accept="application/pdf" onChange={e => handleFileUpload(e, "brochureUrl")} className="absolute inset-0 opacity-0 w-8 h-8 cursor-pointer" />
                      <Button type="button" variant="outline" size="icon" className="h-9 w-9" disabled={uploadingField === "brochureUrl"}>
                        {uploadingField === "brochureUrl" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Dynamic FAQs Builder */}
            <div className="border-b border-slate-100 pb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] text-pink-600">
                  5. Frequently Asked Questions (FAQs)
                </h4>
                <Button type="button" variant="outline" size="sm" onClick={addFaqItem} className="h-7 rounded-lg cursor-pointer">
                  <Plus className="h-3 w-3 mr-1" /> Add FAQ
                </Button>
              </div>
              <div className="space-y-3">
                {faqsList.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start bg-slate-50 p-3 rounded-xl">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input 
                        value={item.q} 
                        onChange={e => updateFaqItem(idx, "q", e.target.value)} 
                        placeholder="Question (e.g. Is it safe during pregnancy?)" 
                        className="bg-white"
                      />
                      <Input 
                        value={item.a} 
                        onChange={e => updateFaqItem(idx, "a", e.target.value)} 
                        placeholder="Response..." 
                        className="bg-white"
                      />
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeFaqItem(idx)} className="h-9 w-9 text-rose-500 hover:bg-rose-50 shrink-0 cursor-pointer">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {faqsList.length === 0 && <p className="text-[11px] text-slate-400 italic">No FAQs added yet.</p>}
              </div>
            </div>

            {/* 6. Dynamic Related Articles Builder */}
            <div className="border-b border-slate-100 pb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] text-pink-600">
                  6. Related Educational Articles
                </h4>
                <Button type="button" variant="outline" size="sm" onClick={addArticleItem} className="h-7 rounded-lg cursor-pointer">
                  <Plus className="h-3 w-3 mr-1" /> Add Article
                </Button>
              </div>
              <div className="space-y-3">
                {articlesList.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start bg-slate-50 p-3 rounded-xl">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input 
                        value={item.title} 
                        onChange={e => updateArticleItem(idx, "title", e.target.value)} 
                        placeholder="Article Title (e.g. WHO Screening Guidelines)" 
                        className="bg-white"
                      />
                      <Input 
                        value={item.link} 
                        onChange={e => updateArticleItem(idx, "link", e.target.value)} 
                        placeholder="Absolute URL Link..." 
                        className="bg-white"
                      />
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeArticleItem(idx)} className="h-9 w-9 text-rose-500 hover:bg-rose-50 shrink-0 cursor-pointer">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {articlesList.length === 0 && <p className="text-[11px] text-slate-400 italic">No articles referenced yet.</p>}
              </div>
            </div>

            {/* 7. Manufacturer Details */}
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-3 text-[10px] text-pink-600">
                7. Developer / Manufacturer Profile
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="mfg-name">Manufacturer Company Name *</Label>
                  <Input 
                    id="mfg-name" 
                    value={manufacturerName} 
                    onChange={e => setManufacturerName(e.target.value)} 
                    placeholder="e.g. Hologic Inc." 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="mfg-specialization">Company Specialization</Label>
                  <Input 
                    id="mfg-specialization" 
                    value={manufacturerSpecialization} 
                    onChange={e => setManufacturerSpecialization(e.target.value)} 
                    placeholder="e.g. Oncology Diagnostic Scanners" 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="mfg-country">Country of Origin</Label>
                  <Input 
                    id="mfg-country" 
                    value={manufacturerCountry} 
                    onChange={e => setManufacturerCountry(e.target.value)} 
                    placeholder="e.g. United States" 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="mfg-website">Official Website URL</Label>
                  <Input 
                    id="mfg-website" 
                    value={manufacturerWebsite} 
                    onChange={e => setManufacturerWebsite(e.target.value)} 
                    placeholder="https://example.com" 
                  />
                </div>
                <div className="space-y-1">
                  <Label className="flex justify-between items-center">
                    <span>Company Logo URL</span>
                    <span className="text-[10px] text-slate-400 font-normal">Or upload logo</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input value={manufacturerLogoUrl} onChange={e => setManufacturerLogoUrl(e.target.value)} placeholder="/logos/hologic.png" />
                    <div className="relative">
                      <Input type="file" accept="image/*" onChange={e => handleFileUpload(e, "manufacturerLogoUrl")} className="absolute inset-0 opacity-0 w-8 h-8 cursor-pointer" />
                      <Button type="button" variant="outline" size="icon" className="h-9 w-9" disabled={uploadingField === "manufacturerLogoUrl"}>
                        {uploadingField === "manufacturerLogoUrl" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="mfg-collab-status">Collaboration Partnership Status</Label>
                  <select 
                    id="mfg-collab-status"
                    value={collaborationStatus} 
                    onChange={e => setCollaborationStatus(e.target.value)} 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="None">No Active Partnership</option>
                    <option value="In Discussion">In Partnership Discussions</option>
                    <option value="Active Partner">Official Active Partner</option>
                  </select>
                </div>
                <div className="space-y-1 md:col-span-3">
                  <Label htmlFor="mfg-overview">Manufacturer Corporate Overview</Label>
                  <Textarea 
                    id="mfg-overview" 
                    value={manufacturerOverview} 
                    onChange={e => setManufacturerOverview(e.target.value)} 
                    placeholder="Short description of the company's oncology focus and history..." 
                    className="h-16"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="tech-active" 
                checked={isActive} 
                onChange={e => setIsActive(e.target.checked)} 
                className="h-4 w-4 rounded border-slate-300 accent-pink-600"
              />
              <Label htmlFor="tech-active" className="cursor-pointer">
                Enable technology immediately (Visible to public screen)
              </Label>
            </div>

            <DialogFooter className="border-t border-slate-100 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl gap-2 font-bold cursor-pointer">
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingTech ? "Save Changes" : "Register Technology"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL DIALOG: COLLABORATION REQUEST DETAILS
          ======================================================== */}
      <Dialog open={isRequestDetailOpen} onOpenChange={setIsRequestDetailOpen}>
        <DialogContent className="w-full h-full max-w-full max-h-full sm:max-w-2xl sm:max-h-[85vh] sm:w-[calc(100%-2rem)] sm:h-auto overflow-y-auto rounded-none sm:rounded-3xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading font-extrabold text-slate-800 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-pink-600" />
              Collaboration Proposal details
            </DialogTitle>
            <DialogDescription className="text-xs">
              Review details submitted by the healthcare organization or medical device manufacturer.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Organization Name</span>
                  <strong className="text-slate-800 text-sm">{selectedRequest.organizationName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Company Division</span>
                  <strong className="text-slate-800 text-sm">{selectedRequest.companyName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Contact Representative</span>
                  <strong className="text-slate-700">{selectedRequest.contactPerson}</strong>
                  <span className="text-[10px] text-slate-500 block">({selectedRequest.designation})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Submission Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[9px] uppercase mt-1 ${
                    selectedRequest.status === "APPROVED" 
                      ? "bg-emerald-100 text-emerald-800"
                      : selectedRequest.status === "REJECTED"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Email Address</span>
                  <a href={`mailto:${selectedRequest.email}`} className="text-pink-600 font-semibold hover:underline block">{selectedRequest.email}</a>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Phone Number</span>
                  <span className="text-slate-700 block">{selectedRequest.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Country</span>
                  <span className="text-slate-700 block">{selectedRequest.country}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Website URL</span>
                  {selectedRequest.website ? (
                    <a href={selectedRequest.website} target="_blank" rel="noreferrer" className="text-pink-600 font-semibold hover:underline block flex items-center gap-1">
                      <Globe className="h-3 w-3" /> Visit Site
                    </a>
                  ) : (
                    <span className="text-slate-400 block italic">Not provided</span>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Machine / Technology Name</span>
                  <strong className="text-slate-700">{selectedRequest.technologyName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Requested Collaboration Mode</span>
                  <span className="text-slate-700 font-semibold">{selectedRequest.collaborationType}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Proposal Description / Comments</span>
                <p className="text-slate-600 mt-1.5 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedRequest.description}
                </p>
              </div>

              {/* Uploaded Documents */}
              <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <FileText className="h-5 w-5 text-pink-500" />
                    <div>
                      <strong className="block text-[11px] text-slate-700">Technology Brochure</strong>
                      <span className="text-[9px] text-slate-400">PDF Document</span>
                    </div>
                  </div>
                  {selectedRequest.brochureUrl ? (
                    <a href={selectedRequest.brochureUrl} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 cursor-pointer">
                        <Link2 className="h-3 w-3" /> View PDF
                      </Button>
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">None uploaded</span>
                  )}
                </div>

                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <FileText className="h-5 w-5 text-pink-500" />
                    <div>
                      <strong className="block text-[11px] text-slate-700">Company Profile</strong>
                      <span className="text-[9px] text-slate-400">PDF Document</span>
                    </div>
                  </div>
                  {selectedRequest.companyProfileUrl ? (
                    <a href={selectedRequest.companyProfileUrl} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 cursor-pointer">
                        <Link2 className="h-3 w-3" /> View PDF
                      </Button>
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">None uploaded</span>
                  )}
                </div>
              </div>

              {/* Moderation Panel */}
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleRequestStatusChange(selectedRequest.id, "APPROVED")}
                    disabled={selectedRequest.status === "APPROVED"}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-1.5 font-bold cursor-pointer"
                  >
                    <Check className="h-4 w-4" /> Approve Proposal
                  </Button>
                  <Button
                    onClick={() => handleRequestStatusChange(selectedRequest.id, "REJECTED")}
                    disabled={selectedRequest.status === "REJECTED"}
                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl gap-1.5 font-bold cursor-pointer"
                  >
                    <X className="h-4 w-4" /> Reject Proposal
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => handleDeleteRequest(selectedRequest.id)}
                  className="rounded-xl border-rose-100 text-rose-600 hover:bg-rose-50 gap-1.5 font-bold cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" /> Delete Record
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

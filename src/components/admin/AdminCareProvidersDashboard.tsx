"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Save,
  X,
  Building2,
  Search,
  Loader2,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Star,
  Globe,
  Clock,
  Info,
} from "lucide-react";
import {
  createCareProvider,
  updateCareProvider,
  deleteCareProvider,
  togglePublishCareProvider,
} from "@/app/actions/careProviders";

export interface CareProviderItem {
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
  sortOrder: number;
  createdAt: any;
  updatedAt: any;
}

interface AdminCareProvidersDashboardProps {
  initialData: CareProviderItem[];
}

const CATEGORY_OPTIONS = [
  { value: "hospitals", label: "Hospitals & Cancer Centers" },
  { value: "diagnostics", label: "Mammography & Diagnostics" },
  { value: "clinics", label: "Screening Clinics" },
  { value: "chemotherapy", label: "Chemotherapy Centers" },
  { value: "radiation", label: "Radiation Centers" },
  { value: "genetics", label: "Genetic Testing" },
  { value: "rehab", label: "Rehabilitation" },
  { value: "homecare", label: "Home Health Care" },
  { value: "counseling", label: "Mental Health Support" },
  { value: "palliative", label: "Palliative Care" },
];

export default function AdminCareProvidersDashboard({ initialData }: AdminCareProvidersDashboardProps) {
  const router = useRouter();
  const [providers, setProviders] = useState<CareProviderItem[]>(initialData || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<CareProviderItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "hospitals",
    specialization: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    hours: "",
    about: "",
    facilitiesText: "",
    rating: 4.8,
    reviews: 12,
    sortOrder: 0,
    isVerified: true,
    isPublished: true,
  });

  // Action Loading & Toast State
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const openAddModal = () => {
    setEditingProvider(null);
    setFormData({
      name: "",
      category: "hospitals",
      specialization: "",
      city: "",
      state: "",
      phone: "",
      email: "",
      address: "",
      website: "",
      hours: "",
      about: "",
      facilitiesText: "",
      rating: 4.8,
      reviews: 12,
      sortOrder: 0,
      isVerified: true,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (provider: CareProviderItem) => {
    setEditingProvider(provider);
    setFormData({
      name: provider.name,
      category: provider.category,
      specialization: provider.specialization,
      city: provider.city,
      state: provider.state || "",
      phone: provider.phone,
      email: provider.email,
      address: provider.address,
      website: provider.website || "",
      hours: provider.hours || "",
      about: provider.about,
      facilitiesText: (provider.facilities || []).join("\n"),
      rating: provider.rating,
      reviews: provider.reviews,
      sortOrder: provider.sortOrder || 0,
      isVerified: provider.isVerified,
      isPublished: provider.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.specialization || !formData.city || !formData.phone || !formData.email || !formData.address || !formData.about) {
      showToast("error", "Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    const facilitiesArray = formData.facilitiesText
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const payload = {
      name: formData.name,
      category: formData.category,
      specialization: formData.specialization,
      city: formData.city,
      state: formData.state || undefined,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      website: formData.website || undefined,
      hours: formData.hours || undefined,
      about: formData.about,
      facilities: facilitiesArray,
      rating: Number(formData.rating) || 0,
      reviews: Number(formData.reviews) || 0,
      sortOrder: Number(formData.sortOrder) || 0,
      isVerified: formData.isVerified,
      isPublished: formData.isPublished,
    };

    try {
      if (editingProvider) {
        const res = await updateCareProvider(editingProvider.id, payload);
        if (res.success && res.data) {
          setProviders((prev) => prev.map((p) => (p.id === editingProvider.id ? res.data : p)));
          showToast("success", "Care provider updated successfully.");
          setIsModalOpen(false);
          router.refresh();
        } else {
          showToast("error", res.error || "Failed to update provider.");
        }
      } else {
        const res = await createCareProvider(payload);
        if (res.success && res.data) {
          setProviders((prev) => [res.data, ...prev]);
          showToast("success", "Care provider created successfully.");
          setIsModalOpen(false);
          router.refresh();
        } else {
          showToast("error", res.error || "Failed to create provider.");
        }
      }
    } catch (err: any) {
      showToast("error", "An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setLoadingId(id);
    try {
      const res = await togglePublishCareProvider(id, !currentStatus);
      if (res.success && res.data) {
        setProviders((prev) => prev.map((p) => (p.id === id ? res.data : p)));
        showToast("success", !currentStatus ? "Provider published." : "Provider hidden from public.");
        router.refresh();
      } else {
        showToast("error", res.error || "Failed to update status.");
      }
    } catch (err) {
      showToast("error", "Error toggling status.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }
    setLoadingId(id);
    try {
      const res = await deleteCareProvider(id);
      if (res.success) {
        setProviders((prev) => prev.filter((p) => p.id !== id));
        showToast("success", "Provider deleted successfully.");
        router.refresh();
      } else {
        showToast("error", res.error || "Failed to delete provider.");
      }
    } catch (err) {
      showToast("error", "Error deleting provider.");
    } finally {
      setLoadingId(null);
    }
  };

  const filteredProviders = providers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold flex items-center gap-2 transition-all ${
            toastMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {toastMessage.text}
        </div>
      )}

      {/* Control Bar: Search, Category Filter & Add Button */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by provider name, city, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 outline-none focus:border-pink-500 transition-colors cursor-pointer"
          >
            <option value="all">All Categories ({providers.length})</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Add Provider Button */}
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Care Provider
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Listed</p>
          <p className="text-2xl font-black text-slate-800 mt-1">{providers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Published</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{providers.filter((p) => p.isPublished).length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hidden / Draft</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{providers.filter((p) => !p.isPublished).length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified</p>
          <p className="text-2xl font-black text-pink-600 mt-1">{providers.filter((p) => p.isVerified).length}</p>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Name & Specialization</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">City</th>
                <th className="py-4 px-4">Contact Phone</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProviders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No care providers found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredProviders.map((provider) => (
                  <tr key={provider.id} className="hover:bg-pink-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-pink-500 shrink-0" />
                        {provider.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{provider.specialization}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
                        {provider.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {provider.city}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-mono text-xs">{provider.phone}</td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                          provider.isPublished
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {provider.isPublished ? "PUBLISHED" : "HIDDEN"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        {/* Toggle Publish */}
                        <button
                          onClick={() => handleTogglePublish(provider.id, provider.isPublished)}
                          disabled={loadingId === provider.id}
                          title={provider.isPublished ? "Hide from public website" : "Publish to public website"}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            provider.isPublished
                              ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                              : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {loadingId === provider.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                          ) : provider.isPublished ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(provider)}
                          title="Edit Care Provider"
                          className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-600 transition-all cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(provider.id, provider.name)}
                          disabled={loadingId === provider.id}
                          title="Delete Care Provider"
                          className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all cursor-pointer"
                        >
                          {loadingId === provider.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredProviders.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-3xl border border-slate-100 text-slate-400 font-medium">
            No care providers found matching your search.
          </div>
        ) : (
          filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
                    {provider.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      provider.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {provider.isPublished ? "PUBLISHED" : "HIDDEN"}
                  </span>
                </div>

                <h4 className="font-heading font-extrabold text-slate-800 text-base">{provider.name}</h4>
                <p className="text-xs text-pink-600 font-semibold">{provider.specialization}</p>

                <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {provider.city} &bull; {provider.address}
                  </p>
                  <p className="flex items-center gap-1.5 font-mono">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    {provider.phone}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleTogglePublish(provider.id, provider.isPublished)}
                  disabled={loadingId === provider.id}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 ${
                    provider.isPublished
                      ? "bg-slate-50 border-slate-200 text-slate-600"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }`}
                >
                  {provider.isPublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {provider.isPublished ? "Hide" : "Publish"}
                </button>

                <button
                  onClick={() => openEditModal(provider)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(provider.id, provider.name)}
                  disabled={loadingId === provider.id}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Care Provider Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-heading text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <Building2 className="h-6 w-6 text-pink-600" />
                {editingProvider ? "Edit Care Provider" : "Add New Care Provider"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Provider Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Comprehensive Cancer Institute"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-pink-500"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specialization */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Specialization <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Surgical, Medical & Radiation Oncology"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, New Delhi"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                {/* State */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">State (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Maharashtra"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Contact Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 22 2417 7000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Contact Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. care@hospital.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Full Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ernest Borges Road, Parel, Mumbai"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                {/* Website */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Website URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="e.g. https://apex-cancer.org"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                {/* Hours */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Operating Hours (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Mon - Sat: 08:00 AM - 08:00 PM"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                {/* About */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    About / Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide a detailed description of services offered, medical team background, and specialties..."
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                {/* Facilities */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Key Facilities (One per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="3D Digital Mammogram&#10;Chemotherapy Daycare Unit&#10;Subsidized Patient Support Scheme"
                    value={formData.facilitiesText}
                    onChange={(e) => setFormData({ ...formData, facilitiesText: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500 font-mono text-xs"
                  />
                </div>

                {/* Rating, Reviews, Sort Order */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Rating (0 - 5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Reviews Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reviews}
                    onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Sort Order (Ascending)</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                {/* Checkboxes */}
                <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isVerified}
                      onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                      className="h-4 w-4 text-pink-600 rounded border-slate-300 focus:ring-pink-500"
                    />
                    Mark as Verified Center
                  </label>

                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="h-4 w-4 text-pink-600 rounded border-slate-300 focus:ring-pink-500"
                    />
                    Publish Immediately
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {editingProvider ? "Save Changes" : "Create Provider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

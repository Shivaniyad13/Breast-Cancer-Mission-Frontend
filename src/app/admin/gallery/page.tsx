"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Upload,
  Loader2,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Image as ImageIcon,
  ShieldCheck,
  Search,
  CheckCircle2,
  X,
  Edit,
  Calendar,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  getAllGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  toggleGalleryItemActive,
} from "@/app/actions/gallery";

const CATEGORIES = ["Walks", "Camps", "Medical", "Outreach", "Research", "Workshops"];

interface GalleryItemData {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
  eventDate?: Date | string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItemData | null>(null);

  // Form State
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("Walks");
  const [eventDate, setEventDate] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);

  // Uploading / Submitting state
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllGalleryItems();
      if (res.success && res.items) {
        setItems(res.items as any);
      } else {
        setError(res.error || "Failed to fetch gallery items.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setImageUrl("");
    setCaption("");
    setCategory("Walks");
    setEventDate("");
    setOrderIndex(0);
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItemData) => {
    setEditingItem(item);
    setImageUrl(item.imageUrl);
    setCaption(item.caption);
    setCategory(item.category);
    setEventDate(
      item.eventDate ? new Date(item.eventDate).toISOString().split("T")[0] : ""
    );
    setOrderIndex(item.orderIndex || 0);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
        showToast("success", "Image uploaded successfully.");
      } else {
        showToast("error", data.error || "Image upload failed.");
      }
    } catch (err: any) {
      showToast("error", "Error uploading file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl || !caption || !category) {
      showToast("error", "Please provide an image, caption, and category.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        const res = await updateGalleryItem(editingItem.id, {
          imageUrl,
          caption,
          category,
          eventDate: eventDate ? eventDate : null,
          orderIndex: Number(orderIndex) || 0,
        });

        if (res.success && res.item) {
          setItems((prev) =>
            prev.map((i) => (i.id === editingItem.id ? (res.item as any) : i))
          );
          showToast("success", "Gallery item updated.");
          setIsModalOpen(false);
        } else {
          showToast("error", res.error || "Failed to update item.");
        }
      } else {
        const res = await createGalleryItem({
          imageUrl,
          caption,
          category,
          eventDate: eventDate ? eventDate : null,
          orderIndex: Number(orderIndex) || 0,
        });

        if (res.success && res.item) {
          setItems((prev) => [res.item as any, ...prev]);
          showToast("success", "Gallery item created.");
          setIsModalOpen(false);
        } else {
          showToast("error", res.error || "Failed to create item.");
        }
      }
    } catch (err: any) {
      showToast("error", "An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await toggleGalleryItemActive(id);
      if (res.success && res.item) {
        setItems((prev) =>
          prev.map((i) => (i.id === id ? (res.item as any) : i))
        );
        showToast("success", res.item.isActive ? "Item activated." : "Item deactivated.");
      } else {
        showToast("error", res.error || "Failed to toggle status.");
      }
    } catch (err) {
      showToast("error", "Error toggling status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, captionText: string) => {
    if (!confirm(`Are you sure you want to delete "${captionText}"?`)) return;

    setActionLoadingId(id);
    try {
      const res = await deleteGalleryItem(id);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        showToast("success", "Gallery item deleted.");
      } else {
        showToast("error", res.error || "Failed to delete item.");
      }
    } catch (err) {
      showToast("error", "Error deleting item.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold flex items-center gap-2 transition-all ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {toast.text}
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 border-b border-pink-100 pb-6">
        <div className="space-y-1">
          <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <ShieldCheck className="h-2.5 w-2.5" /> Command Center
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <ImageIcon className="h-8 w-8 text-primary" /> Event Gallery Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Upload and manage photo gallery items from awareness drives, mobile screening camps, medical conferences, and community workshops.
          </p>
        </div>
      </div>

      {/* Admin tabs navigation */}
      <div className="flex gap-4 border-b border-slate-100 pb-4 text-sm font-semibold overflow-x-auto no-scrollbar whitespace-nowrap">
        <Link href="/admin/analytics" className="text-slate-500 hover:text-primary transition-colors">
          Analytics Overview
        </Link>
        <Link href="/admin/webinars" className="text-slate-500 hover:text-primary transition-colors">
          Webinar Management
        </Link>
        <Link href="/admin/memberships" className="text-slate-500 hover:text-primary transition-colors">
          Institution Memberships
        </Link>
        <Link href="/admin/success-stories" className="text-slate-500 hover:text-primary transition-colors">
          Patient Success Stories
        </Link>
        <Link href="/admin/homepage-widgets" className="text-slate-500 hover:text-primary transition-colors">
          Homepage Widgets
        </Link>
        <Link href="/admin/live-updates" className="text-slate-500 hover:text-primary transition-colors">
          Home Page Live Updates
        </Link>
        <Link href="/admin/diagnosis" className="text-slate-500 hover:text-primary transition-colors">
          Diagnosis & Collaboration
        </Link>
        <Link href="/admin/healthcare-professionals" className="text-slate-500 hover:text-primary transition-colors">
          Healthcare Professionals
        </Link>
        <Link href="/admin/care-providers" className="text-slate-500 hover:text-primary transition-colors">
          Care Directory
        </Link>
        <Link href="/admin/gallery" className="text-primary border-b-2 border-primary pb-4 -mb-[18px] transition-colors">
          Event Gallery
        </Link>
        <Link href="/admin/video-stories" className="text-slate-500 hover:text-primary transition-colors">
          Video Stories
        </Link>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search gallery caption or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 outline-none focus:border-pink-500 transition-colors cursor-pointer"
          >
            <option value="all">All Categories ({items.length})</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Add Item Button */}
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add New Item
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-100">
          <Loader2 className="h-10 w-10 text-pink-600 animate-spin mx-auto" />
          <p className="text-slate-500 text-sm font-semibold">Loading gallery items...</p>
        </div>
      ) : error ? (
        <div className="py-16 text-center space-y-4 bg-rose-50 rounded-3xl border border-rose-200 p-6">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
          <h3 className="font-heading text-lg font-bold text-rose-800">Error Loading Gallery</h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchItems}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-2xl transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className="h-4 w-4" /> Retry Loading
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-100 p-8">
          <ImageIcon className="h-14 w-14 text-slate-300 mx-auto" />
          <h3 className="font-heading text-xl font-extrabold text-slate-700">No Gallery Items Found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {searchQuery || selectedCategory !== "all"
              ? "No items match your filter criteria. Try clearing search filters."
              : "No gallery items yet. Click 'Add New Item' to upload your first event photo."}
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add New Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-pink-200 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        item.isActive ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-200"
                      }`}
                    >
                      {item.isActive ? "ACTIVE" : "HIDDEN"}
                    </span>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-5 space-y-3">
                  <h4 className="font-heading font-extrabold text-slate-800 text-base leading-snug line-clamp-2">
                    {item.caption}
                  </h4>

                  {item.eventDate && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-pink-500" />
                      {new Date(item.eventDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Order: #{item.orderIndex}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(item.id)}
                    disabled={actionLoadingId === item.id}
                    title={item.isActive ? "Hide from public website" : "Show on public website"}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      item.isActive
                        ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                        : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {actionLoadingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    ) : item.isActive ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={() => openEditModal(item)}
                    title="Edit Item"
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-600 transition-all cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.caption)}
                    disabled={actionLoadingId === item.id}
                    title="Delete Item"
                    className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all cursor-pointer"
                  >
                    {actionLoadingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-heading text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <ImageIcon className="h-6 w-6 text-pink-600" />
                {editingItem ? "Edit Gallery Item" : "Add Gallery Item"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Event Image <span className="text-rose-500">*</span>
                </label>

                {imageUrl ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-slate-200 bg-slate-50 group">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-all cursor-pointer"
                      title="Remove Image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 hover:border-pink-400 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50">
                    {isUploading ? (
                      <Loader2 className="h-8 w-8 text-pink-600 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">Click to upload photo</span>
                        <span className="text-[10px] text-slate-400 font-medium">PNG, JPG, WEBP up to 10MB</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Caption */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Caption / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pink Ribbon Awareness Walk 2025"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Category Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-pink-500 cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Date & Order Index */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Event Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Order Index
                  </label>
                  <input
                    type="number"
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {editingItem ? "Save Changes" : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

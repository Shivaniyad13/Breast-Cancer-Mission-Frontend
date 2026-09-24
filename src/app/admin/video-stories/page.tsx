"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";
import Link from "next/link";
import {
  Upload,
  Loader2,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Video,
  Play,
  ExternalLink,
  BadgeCheck,
  ShieldCheck,
  Search,
  CheckCircle2,
  X,
  Edit,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { AdminNavTabs } from "@/components/admin/AdminNavTabs";
import {
  getAllVideoStories,
  createVideoStory,
  updateVideoStory,
  deleteVideoStory,
  toggleVideoStoryActive,
} from "@/app/actions/videoStories";

const CATEGORIES = ["Community Programs", "Partner Interviews", "CSR Activities", "Survivor Stories"];

interface VideoStoryData {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  description?: string | null;
  sourceType: string;
  successStoryId?: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  successStory?: {
    id: string;
    fullName: string;
    roleType: string;
    status: string;
  } | null;
}

export default function AdminVideoStoriesPage() {
  const [stories, setStories] = useState<VideoStoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ADMIN" | "SUCCESS_STORY">("ADMIN");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<VideoStoryData | null>(null);
  const [previewVideo, setPreviewVideo] = useState<VideoStoryData | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Community Programs");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [description, setDescription] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);

  // Uploading / Submitting state
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllVideoStories();
      if (res.success && res.stories) {
        setStories(res.stories as any);
      } else {
        setError(res.error || "Failed to fetch video stories.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const openAddModal = () => {
    setEditingStory(null);
    setTitle("");
    setCategory("Community Programs");
    setVideoUrl("");
    setThumbnailUrl("");
    setDescription("");
    setOrderIndex(0);
    setIsAddModalOpen(true);
  };

  const openEditModal = (story: VideoStoryData) => {
    setEditingStory(story);
    setTitle(story.title);
    setCategory(story.category);
    setVideoUrl(story.videoUrl);
    setThumbnailUrl(story.thumbnailUrl || "");
    setDescription(story.description || "");
    setOrderIndex(story.orderIndex || 0);
    setIsAddModalOpen(true);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVideoUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiClient("/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setVideoUrl(data.url);
        showToast("success", "Video file uploaded successfully.");
      } else {
        showToast("error", data.error || "Video upload failed.");
      }
    } catch (err: any) {
      showToast("error", "Error uploading video file.");
    } finally {
      setIsVideoUploading(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiClient("/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setThumbnailUrl(data.url);
        showToast("success", "Thumbnail image uploaded.");
      } else {
        showToast("error", data.error || "Thumbnail upload failed.");
      }
    } catch (err: any) {
      showToast("error", "Error uploading thumbnail.");
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !videoUrl) {
      showToast("error", "Please provide a title, category, and video file.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingStory) {
        const res = await updateVideoStory(editingStory.id, {
          title,
          category,
          videoUrl,
          thumbnailUrl: thumbnailUrl || null,
          description: description || null,
          orderIndex: Number(orderIndex) || 0,
        });

        if (res.success && res.story) {
          setStories((prev) =>
            prev.map((s) => (s.id === editingStory.id ? (res.story as any) : s))
          );
          showToast("success", "Video story updated.");
          setIsAddModalOpen(false);
        } else {
          showToast("error", res.error || "Failed to update video story.");
        }
      } else {
        const res = await createVideoStory({
          title,
          category,
          videoUrl,
          thumbnailUrl: thumbnailUrl || null,
          description: description || null,
          orderIndex: Number(orderIndex) || 0,
        });

        if (res.success && res.story) {
          setStories((prev) => [res.story as any, ...prev]);
          showToast("success", "Video story created.");
          setIsAddModalOpen(false);
        } else {
          showToast("error", res.error || "Failed to create video story.");
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
      const res = await toggleVideoStoryActive(id);
      if (res.success && res.story) {
        setStories((prev) =>
          prev.map((s) => (s.id === id ? (res.story as any) : s))
        );
        showToast("success", res.story.isActive ? "Video published." : "Video hidden.");
      } else {
        showToast("error", res.error || "Failed to toggle status.");
      }
    } catch (err) {
      showToast("error", "Error toggling status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, storyTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${storyTitle}"?`)) return;

    setActionLoadingId(id);
    try {
      const res = await deleteVideoStory(id);
      if (res.success) {
        setStories((prev) => prev.filter((s) => s.id !== id));
        showToast("success", "Video story deleted/deactivated.");
      } else {
        showToast("error", res.error || "Failed to delete video story.");
      }
    } catch (err) {
      showToast("error", "Error deleting video story.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const adminCount = stories.filter((s) => s.sourceType === "ADMIN").length;
  const successCount = stories.filter((s) => s.sourceType === "SUCCESS_STORY").length;

  const filteredStories = stories.filter((story) => {
    const matchesTab = story.sourceType === activeTab;
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (story.description && story.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
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
            <Video className="h-8 w-8 text-primary" /> Video Stories Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage documentaries, partner interviews, CSR activities, and survivor stories displayed in video galleries.
          </p>
        </div>

        {/* Add New Video Button */}
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          Add New Video
        </button>
      </div>

      {/* Admin tabs navigation */}
      <AdminNavTabs />

      {/* Source Type Filter Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-2 w-full sm:w-auto self-start border border-slate-200/60">
        <button
          onClick={() => setActiveTab("ADMIN")}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "ADMIN"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Video className="h-3.5 w-3.5 text-pink-600" />
          Manual Uploads
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-pink-100 text-pink-700 font-extrabold">
            {adminCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("SUCCESS_STORY")}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "SUCCESS_STORY"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <BadgeCheck className="h-3.5 w-3.5 text-purple-600" />
          From Success Stories
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700 font-extrabold">
            {successCount}
          </span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search video titles or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-colors"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse space-y-4">
              <div className="aspect-[16/10] w-full bg-slate-200 rounded-2xl" />
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-1/2 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-16 text-center space-y-4 bg-rose-50 rounded-3xl border border-rose-200 p-6">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
          <h3 className="font-heading text-lg font-bold text-rose-800">Error Loading Video Stories</h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchStories}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-2xl transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className="h-4 w-4" /> Retry Loading
          </button>
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-100 p-8">
          <Video className="h-14 w-14 text-slate-300 mx-auto" />
          <h3 className="font-heading text-xl font-extrabold text-slate-700">No Video Stories Found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {activeTab === "ADMIN"
              ? "No manual videos yet. Click 'Add New Video' to upload your first documentary or interview."
              : "No approved success stories with video yet. Approve a patient story containing a video to see it here."}
          </p>
          {activeTab === "ADMIN" && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Add New Video
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="group bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-pink-200 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Image + Play Overlay */}
                <div
                  onClick={() => setPreviewVideo(story)}
                  className="aspect-[16/10] w-full overflow-hidden bg-slate-900 relative cursor-pointer group/thumb"
                >
                  {story.thumbnailUrl ? (
                    <img
                      src={story.thumbnailUrl}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500 opacity-90"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400">
                      <Video className="h-12 w-12 text-slate-600" />
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-slate-900/30 group-hover/thumb:bg-slate-900/40 transition-colors flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-white/90 text-pink-600 shadow-lg flex items-center justify-center group-hover/thumb:scale-110 transition-transform">
                      <Play className="h-5 w-5 fill-pink-600 ml-0.5" />
                    </div>
                  </div>

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                      {story.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {story.sourceType === "SUCCESS_STORY" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600 text-white uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <BadgeCheck className="h-3 w-3" /> From Success Story
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        story.isActive ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-200"
                      }`}
                    >
                      {story.isActive ? "ACTIVE" : "HIDDEN"}
                    </span>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-5 space-y-3">
                  <h4 className="font-heading font-extrabold text-slate-800 text-base leading-snug line-clamp-2">
                    {story.title}
                  </h4>

                  {story.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-sans">
                      {story.description}
                    </p>
                  )}

                  {story.successStory && (
                    <p className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100 inline-block">
                      By: {story.successStory.fullName} ({story.successStory.roleType})
                    </p>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Order: #{story.orderIndex}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(story.id)}
                    disabled={actionLoadingId === story.id}
                    title={story.isActive ? "Hide video" : "Publish video"}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      story.isActive
                        ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                        : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {actionLoadingId === story.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    ) : story.isActive ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                  {/* Edit button disabled for SUCCESS_STORY */}
                  {story.sourceType === "ADMIN" && (
                    <button
                      onClick={() => openEditModal(story)}
                      title="Edit Video Story"
                      className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-600 transition-all cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(story.id, story.title)}
                    disabled={actionLoadingId === story.id}
                    title="Delete / Deactivate Video Story"
                    className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all cursor-pointer"
                  >
                    {actionLoadingId === story.id ? (
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

      {/* Modal for Add / Edit Video */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-heading text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <Video className="h-6 w-6 text-pink-600" />
                {editingStory ? "Edit Video Story" : "Add New Video Story"}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Video File Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Video File (MP4/WebM) <span className="text-rose-500">*</span>
                </label>

                {videoUrl ? (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <Video className="h-5 w-5 text-pink-600 shrink-0" />
                      <span className="text-xs font-medium text-slate-700 truncate">{videoUrl}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVideoUrl("")}
                      className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 hover:border-pink-400 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50">
                    {isVideoUploading ? (
                      <Loader2 className="h-6 w-6 text-pink-600 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">Click to upload video file</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      disabled={isVideoUploading}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Cover Thumbnail Image (Optional)
                </label>

                {thumbnailUrl ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-slate-200 bg-slate-50">
                    <img src={thumbnailUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setThumbnailUrl("")}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-all cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 hover:border-pink-400 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50">
                    {isImageUploading ? (
                      <Loader2 className="h-6 w-6 text-pink-600 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">Click to upload thumbnail image</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={isImageUploading}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Video Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GRS Rural Mobile Screening Documentary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief synopsis of the video content..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500 font-sans"
                />
              </div>

              {/* Order Index */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Order Index (Ascending)
                </label>
                <input
                  type="number"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isVideoUploading || isImageUploading}
                  className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {editingStory ? "Save Changes" : "Save Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Lightbox Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-slate-900 rounded-3xl max-w-3xl w-full p-4 sm:p-6 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 block font-heading">
                  {previewVideo.category}
                </span>
                <h3 className="font-heading text-lg font-extrabold text-white leading-tight">
                  {previewVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <video
                controls
                autoPlay
                src={previewVideo.videoUrl}
                className="w-full h-full object-contain"
              />
            </div>

            {previewVideo.description && (
              <p className="text-xs text-slate-300 leading-relaxed font-sans pt-2">
                {previewVideo.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Sparkles,
  AlertCircle,
  Calendar,
  Link2,
  FileImage,
  Upload,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  createHomePageUpdate, 
  updateHomePageUpdate, 
  deleteHomePageUpdate, 
  reorderHomePageUpdates 
} from "@/app/actions/homePageUpdates";

interface HomePageUpdate {
  id: string;
  category: string;
  imageUrl: string | null;
  title: string;
  shortDescription: string;
  detailedContent: string | null;
  eventDate: Date | null;
  destinationLink: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
}

interface AdminHomePageUpdatesDashboardProps {
  initialUpdates: HomePageUpdate[];
}

export default function AdminHomePageUpdatesDashboard({ initialUpdates }: AdminHomePageUpdatesDashboardProps) {
  const [updates, setUpdates] = useState<HomePageUpdate[]>(initialUpdates);
  
  // Dialog controls
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<HomePageUpdate | null>(null);

  // Form states
  const [category, setCategory] = useState("Webinar");
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [detailedContent, setDetailedContent] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [destinationLink, setDestinationLink] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Status message
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // File Upload Helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

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
        setMessage({ text: "Thumbnail uploaded successfully!", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to upload thumbnail.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "An error occurred during file upload.", type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  // Reset form helper
  const resetForm = () => {
    setCategory("Webinar");
    setImageUrl("");
    setTitle("");
    setShortDescription("");
    setDetailedContent("");
    setEventDate("");
    setDestinationLink("");
    setIsActive(true);
  };

  // Submit new update
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);

    try {
      const res = await createHomePageUpdate({
        category,
        imageUrl: imageUrl || undefined,
        title,
        shortDescription,
        detailedContent: detailedContent || undefined,
        eventDate: eventDate ? new Date(eventDate) : null,
        destinationLink: destinationLink || undefined,
        isActive
      });

      if (res.success && res.update) {
        setUpdates(prev => [...prev, res.update as any].sort((a, b) => a.orderIndex - b.orderIndex));
        setIsAddOpen(false);
        resetForm();
        setMessage({ text: "New home page update created successfully!", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to create update.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    } finally {
      setIsPending(false);
    }
  };

  // Open Edit dialog
  const openEditDialog = (update: HomePageUpdate) => {
    setEditingUpdate(update);
    setCategory(update.category);
    setImageUrl(update.imageUrl || "");
    setTitle(update.title);
    setShortDescription(update.shortDescription);
    setDetailedContent(update.detailedContent || "");
    setEventDate(update.eventDate ? new Date(update.eventDate).toISOString().substring(0, 10) : "");
    setDestinationLink(update.destinationLink || "");
    setIsActive(update.isActive);
    setIsEditOpen(true);
  };

  // Submit edit form
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUpdate) return;
    setIsPending(true);
    setMessage(null);

    try {
      const res = await updateHomePageUpdate(editingUpdate.id, {
        category,
        imageUrl: imageUrl || null,
        title,
        shortDescription,
        detailedContent: detailedContent || null,
        eventDate: eventDate ? new Date(eventDate) : null,
        destinationLink: destinationLink || null,
        isActive
      });

      if (res.success && res.update) {
        setUpdates(prev => prev.map(u => u.id === editingUpdate.id ? { ...u, ...res.update } as any : u).sort((a, b) => a.orderIndex - b.orderIndex));
        setIsEditOpen(false);
        resetForm();
        setMessage({ text: "Home page update updated successfully!", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to update details.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    } finally {
      setIsPending(false);
    }
  };

  // Handle Delete update
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Home Page Update?")) return;
    setMessage(null);

    try {
      const res = await deleteHomePageUpdate(id);
      if (res.success) {
        setUpdates(prev => prev.filter(u => u.id !== id));
        setMessage({ text: "Update removed successfully.", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to delete update.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    }
  };

  // Toggle active state
  const handleToggleActive = async (update: HomePageUpdate) => {
    setMessage(null);
    try {
      const res = await updateHomePageUpdate(update.id, { isActive: !update.isActive });
      if (res.success && res.update) {
        setUpdates(prev => prev.map(u => u.id === update.id ? { ...u, isActive: res.update.isActive } as any : u));
        setMessage({ text: `Update ${!update.isActive ? 'enabled' : 'disabled'} successfully!`, type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to toggle status.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    }
  };

  // Reorder: Move item Up or Down in indices
  const handleMove = async (index: number, direction: "UP" | "DOWN") => {
    const nextIndex = direction === "UP" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= updates.length) return;

    setMessage(null);
    const newUpdatesList = [...updates];
    
    // Swap items
    const temp = newUpdatesList[index];
    newUpdatesList[index] = newUpdatesList[nextIndex];
    newUpdatesList[nextIndex] = temp;

    // Call server reorder action
    try {
      const ids = newUpdatesList.map(item => item.id);
      const res = await reorderHomePageUpdates(ids);
      if (res.success) {
        // Apply swap indexes locally
        const updatedList = newUpdatesList.map((item, idx) => ({ ...item, orderIndex: idx }));
        setUpdates(updatedList);
        setMessage({ text: "Updates reordered successfully!", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to apply reordering.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast banner */}
      {message && (
        <div 
          onClick={() => setMessage(null)}
          className={`p-4 rounded-xl flex items-center justify-between cursor-pointer border shadow-sm transition-all animate-in fade-in slide-in-from-top-4 ${
            message.type === "success" 
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/40" 
              : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900/40"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{message.text}</span>
          </div>
          <span className="text-xs opacity-60">Dismiss</span>
        </div>
      )}

      {/* Stats and Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">Active Homepage Slider Updates</h3>
          <p className="text-xs text-muted-foreground">Manage sliding widgets displayed in the right column of the Hero panel.</p>
        </div>

        <Button
          onClick={() => {
            resetForm();
            setIsAddOpen(true);
          }}
          className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold shadow rounded-xl text-xs py-4.5 cursor-pointer flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Homepage Update
        </Button>
      </div>

      {/* Main List Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold">
                <th className="p-4 pl-6 w-16 text-center">Order</th>
                <th className="p-4">Update Details</th>
                <th className="p-4">Destination Link</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {updates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-12 text-muted-foreground">
                    No homepage updates found. Click Add to create one!
                  </td>
                </tr>
              ) : (
                updates.map((update, index) => (
                  <tr key={update.id} className={`hover:bg-slate-50/40 dark:hover:bg-slate-850/30 transition-colors ${!update.isActive && 'opacity-65'}`}>
                    
                    {/* Order index column with move tools */}
                    <td className="p-4 pl-6 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          onClick={() => handleMove(index, "UP")}
                          disabled={index === 0}
                          className="h-5 w-5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-500"
                        >
                          <ArrowUp className="h-3.5 w-3.5 mx-auto" />
                        </button>
                        <span className="text-xs font-black text-slate-700 dark:text-slate-350">{index + 1}</span>
                        <button
                          onClick={() => handleMove(index, "DOWN")}
                          disabled={index === updates.length - 1}
                          className="h-5 w-5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-500"
                        >
                          <ArrowDown className="h-3.5 w-3.5 mx-auto" />
                        </button>
                      </div>
                    </td>

                    {/* Column 2: Info */}
                    <td className="p-4 flex gap-3.5 items-center">
                      {/* Thumbnail preview */}
                      <div className="relative h-12 w-16 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {update.imageUrl ? (
                          <img src={update.imageUrl} alt="thumbnail" className="w-full h-full object-cover" />
                        ) : (
                          <FileImage className="h-5 w-5 text-slate-400" />
                        )}
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-pink-100 dark:bg-pink-950/20 text-pink-700 dark:text-pink-400 px-2 py-0.5 rounded font-black uppercase border border-pink-200/50">
                            {update.category}
                          </span>
                          {update.eventDate && (
                            <span className="text-[9px] text-muted-foreground flex items-center gap-0.5 font-bold">
                              <Calendar className="h-2.5 w-2.5" />
                              {new Date(update.eventDate).toLocaleDateString("en-US")}
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 truncate max-w-sm">
                          {update.title}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate max-w-sm">{update.shortDescription}</p>
                      </div>
                    </td>

                    {/* Column 3: Link details */}
                    <td className="p-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {update.destinationLink ? (
                        <span className="text-xs font-semibold text-pink-600 inline-flex items-center gap-1 leading-none">
                          <Link2 className="h-3 w-3" />
                          {update.destinationLink}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </td>

                    {/* Column 4: Toggle Status */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(update)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-all border ${
                          update.isActive
                            ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200"
                        }`}
                      >
                        {update.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {update.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>

                    {/* Column 5: Edit / Delete */}
                    <td className="p-4 text-right pr-6 space-x-1.5">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(update)}
                        title="Edit Update Card"
                        className="h-8 w-8 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(update.id)}
                        title="Delete Update Card"
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD UPDATE DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Home Page Update</DialogTitle>
            <DialogDescription>Create a new dynamically sliding card widget for the homepage Hero panel.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="addCategory">Category</Label>
                <select
                  id="addCategory"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Webinar">Upcoming Webinar</option>
                  <option value="Campaign">Awareness Campaign</option>
                  <option value="News">Breast Cancer News</option>
                  <option value="Event">Upcoming Event</option>
                  <option value="Announcement">Announcement</option>
                  <option value="Tip">Health Tip</option>
                  <option value="Research">Research & Innovation</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="addDate">Event Date (Optional)</Label>
                <Input
                  id="addDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
            </div>

            {/* Image upload */}
            <div className="space-y-1.5">
              <Label>Thumbnail Image Cover (Optional)</Label>
              <div className="flex gap-4 items-center">
                {imageUrl && (
                  <div className="h-12 w-16 rounded overflow-hidden border border-slate-200 flex-shrink-0">
                    <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="relative flex-1 border-2 border-dashed border-pink-100 rounded-lg p-3 hover:bg-pink-50/10 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-pink-600">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className={`h-4 w-4 ${isUploading && 'animate-bounce'}`} />
                  {isUploading ? "Uploading..." : "Click to upload image file"}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="addTitle">Title</Label>
              <Input
                id="addTitle"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="addShortDesc">Short Description (2-3 lines)</Label>
              <textarea
                id="addShortDesc"
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Explain the update in a few lines..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="addDetailed">Detailed Content (Optional)</Label>
              <textarea
                id="addDetailed"
                rows={5}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Provide detailed content here..."
                value={detailedContent}
                onChange={(e) => setDetailedContent(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="addLink">Explore More Link (Optional)</Label>
              <Input
                id="addLink"
                placeholder="e.g. /webinars or https://example.com"
                value={destinationLink}
                onChange={(e) => setDestinationLink(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="addActive"
                type="checkbox"
                className="h-4.5 w-4.5 rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <Label htmlFor="addActive" className="text-xs font-semibold cursor-pointer select-none">
                Enable update for home page slide loop immediately
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || isUploading} className="bg-pink-600 hover:bg-pink-700 text-white font-bold">
                {isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
                Add Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT UPDATE DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Home Page Update</DialogTitle>
            <DialogDescription>Modify details and click save changes.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="editCategory">Category</Label>
                <select
                  id="editCategory"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Webinar">Upcoming Webinar</option>
                  <option value="Campaign">Awareness Campaign</option>
                  <option value="News">Breast Cancer News</option>
                  <option value="Event">Upcoming Event</option>
                  <option value="Announcement">Announcement</option>
                  <option value="Tip">Health Tip</option>
                  <option value="Research">Research & Innovation</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="editDate">Event Date (Optional)</Label>
                <Input
                  id="editDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
            </div>

            {/* Image upload */}
            <div className="space-y-1.5">
              <Label>Thumbnail Image Cover (Optional)</Label>
              <div className="flex gap-4 items-center">
                {imageUrl && (
                  <div className="h-12 w-16 rounded overflow-hidden border border-slate-200 flex-shrink-0">
                    <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="relative flex-1 border-2 border-dashed border-pink-100 rounded-lg p-3 hover:bg-pink-50/10 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-pink-600">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className={`h-4 w-4 ${isUploading && 'animate-bounce'}`} />
                  {isUploading ? "Uploading..." : "Click to replace image file"}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editTitle">Title</Label>
              <Input
                id="editTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editShortDesc">Short Description (2-3 lines)</Label>
              <textarea
                id="editShortDesc"
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editDetailed">Detailed Content (Optional)</Label>
              <textarea
                id="editDetailed"
                rows={5}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={detailedContent}
                onChange={(e) => setDetailedContent(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editLink">Explore More Link (Optional)</Label>
              <Input
                id="editLink"
                value={destinationLink}
                onChange={(e) => setDestinationLink(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="editActive"
                type="checkbox"
                className="h-4.5 w-4.5 rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <Label htmlFor="editActive" className="text-xs font-semibold cursor-pointer select-none">
                Enable update for home page slide loop immediately
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || isUploading} className="bg-pink-600 hover:bg-pink-700 text-white font-bold">
                {isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}

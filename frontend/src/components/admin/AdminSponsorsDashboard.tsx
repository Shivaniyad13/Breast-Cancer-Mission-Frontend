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
  AlertCircle,
  Link2,
  FileImage,
  Upload,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  createSponsorBanner, 
  updateSponsorBanner, 
  deleteSponsorBanner, 
  reorderSponsorBanners 
} from "@/app/actions/rightSidebarWidgets";

interface SponsorBanner {
  id: string;
  logoUrl: string | null;
  imageUrl: string | null;
  title: string;
  description: string;
  destinationLink: string | null;
  orderIndex: number;
  isActive: boolean;
}

interface AdminSponsorsDashboardProps {
  initialBanners: SponsorBanner[];
}

export default function AdminSponsorsDashboard({ initialBanners }: AdminSponsorsDashboardProps) {
  const [banners, setBanners] = useState<SponsorBanner[]>(initialBanners);
  
  // Dialog controls
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<SponsorBanner | null>(null);

  // Form states
  const [logoUrl, setLogoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [destinationLink, setDestinationLink] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Status message
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Upload Helpers
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    setMessage(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setLogoUrl(data.url);
        setMessage({ text: "Logo uploaded successfully!", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to upload logo.", type: "error" });
      }
    } catch {
      setMessage({ text: "Upload failed.", type: "error" });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBanner(true);
    setMessage(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
        setMessage({ text: "Banner image uploaded successfully!", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to upload banner image.", type: "error" });
      }
    } catch {
      setMessage({ text: "Upload failed.", type: "error" });
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const resetForm = () => {
    setLogoUrl("");
    setImageUrl("");
    setTitle("");
    setDescription("");
    setDestinationLink("");
    setIsActive(true);
  };

  // Submit Add
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);
    try {
      const res = await createSponsorBanner({
        logoUrl: logoUrl || undefined,
        imageUrl: imageUrl || undefined,
        title,
        description,
        destinationLink: destinationLink || undefined,
        isActive
      });
      if (res.success && res.banner) {
        setBanners(prev => [...prev, res.banner as any].sort((a, b) => a.orderIndex - b.orderIndex));
        setIsAddOpen(false);
        resetForm();
        setMessage({ text: "New sponsor spotlight banner added successfully!", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to create banner.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    } finally {
      setIsPending(false);
    }
  };

  // Open Edit
  const openEditDialog = (banner: SponsorBanner) => {
    setEditingBanner(banner);
    setLogoUrl(banner.logoUrl || "");
    setImageUrl(banner.imageUrl || "");
    setTitle(banner.title);
    setDescription(banner.description);
    setDestinationLink(banner.destinationLink || "");
    setIsActive(banner.isActive);
    setIsEditOpen(true);
  };

  // Submit Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    setIsPending(true);
    setMessage(null);
    try {
      const res = await updateSponsorBanner(editingBanner.id, {
        logoUrl: logoUrl || null,
        imageUrl: imageUrl || null,
        title,
        description,
        destinationLink: destinationLink || null,
        isActive
      });
      if (res.success && res.banner) {
        setBanners(prev => prev.map(b => b.id === editingBanner.id ? { ...b, ...res.banner } as any : b).sort((x, y) => x.orderIndex - y.orderIndex));
        setIsEditOpen(false);
        resetForm();
        setMessage({ text: "Sponsor spotlight details updated successfully!", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to update banner.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    } finally {
      setIsPending(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sponsor spotlight banner?")) return;
    setMessage(null);
    try {
      const res = await deleteSponsorBanner(id);
      if (res.success) {
        setBanners(prev => prev.filter(b => b.id !== id));
        setMessage({ text: "Banner deleted successfully.", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to delete banner.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    }
  };

  // Toggle Active status
  const handleToggleActive = async (banner: SponsorBanner) => {
    setMessage(null);
    try {
      const res = await updateSponsorBanner(banner.id, { isActive: !banner.isActive });
      if (res.success && res.banner) {
        setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, isActive: res.banner.isActive } as any : b));
        setMessage({ text: `Banner ${!banner.isActive ? 'enabled' : 'disabled'} successfully!`, type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to toggle status.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    }
  };

  // Reorder
  const handleMove = async (index: number, direction: "UP" | "DOWN") => {
    const nextIndex = direction === "UP" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= banners.length) return;

    setMessage(null);
    const list = [...banners];
    const temp = list[index];
    list[index] = list[nextIndex];
    list[nextIndex] = temp;

    try {
      const ids = list.map(b => b.id);
      const res = await reorderSponsorBanners(ids);
      if (res.success) {
        setBanners(list.map((item, idx) => ({ ...item, orderIndex: idx })));
        setMessage({ text: "Spotlights reordered successfully!", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to apply ordering.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast alert */}
      {message && (
        <div 
          onClick={() => setMessage(null)}
          className={`p-4 rounded-xl flex items-center justify-between cursor-pointer border shadow-sm ${
            message.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{message.text}</span>
          </div>
          <span className="text-xs opacity-60">Dismiss</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl">
        <div>
          <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">Sponsor Spotlight Banners</h3>
          <p className="text-xs text-muted-foreground">Manage logos, titles, short captions, and learn more links inside the top Hero widget.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsAddOpen(true); }} className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs">
          <Plus className="h-4 w-4 mr-1" /> Add Spotlight Banner
        </Button>
      </div>

      {/* Banners List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                <th className="p-4 pl-6 w-16 text-center">Order</th>
                <th className="p-4">Banner Detail</th>
                <th className="p-4">Destination Link</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Action Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-muted-foreground">No sponsor banners found. Click Add to create one!</td>
                </tr>
              ) : (
                banners.map((banner, index) => (
                  <tr key={banner.id} className={`hover:bg-slate-50/40 transition-colors ${!banner.isActive && 'opacity-65'}`}>
                    <td className="p-4 pl-6 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <button onClick={() => handleMove(index, "UP")} disabled={index === 0} className="h-5 w-5 rounded hover:bg-slate-100 disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5 mx-auto" /></button>
                        <span className="text-xs font-black">{index + 1}</span>
                        <button onClick={() => handleMove(index, "DOWN")} disabled={index === banners.length - 1} className="h-5 w-5 rounded hover:bg-slate-100 disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5 mx-auto" /></button>
                      </div>
                    </td>
                    <td className="p-4 flex gap-3.5 items-center">
                      <div className="relative h-12 w-16 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {banner.imageUrl ? <img src={banner.imageUrl} alt="banner" className="w-full h-full object-cover" /> : <FileImage className="h-5 w-5 text-slate-400" />}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-800 truncate max-w-sm">{banner.title}</h4>
                        <p className="text-xs text-muted-foreground truncate max-w-sm">{banner.description}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {banner.destinationLink ? (
                        <span className="text-xs font-semibold text-pink-600 inline-flex items-center gap-1"><Link2 className="h-3 w-3" />{banner.destinationLink}</span>
                      ) : <span className="text-xs text-muted-foreground">None</span>}
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleToggleActive(banner)} className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border ${banner.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-250' : 'bg-slate-100 text-slate-500'}`}>
                        {banner.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {banner.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="p-4 text-right pr-6 space-x-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEditDialog(banner)} className="h-8 w-8 hover:text-blue-600"><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(banner.id)} className="h-8 w-8 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Sponsor Spotlight Banner</DialogTitle>
            <DialogDescription>Create a banner to display inside the Sponsor Spotlight hero widget.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Sponsor Logo Cover (Optional)</Label>
                <div className="flex gap-4 items-center">
                  {logoUrl && <div className="h-10 w-10 rounded-full overflow-hidden border"><img src={logoUrl} alt="preview" className="h-full w-full object-cover" /></div>}
                  <div className="relative flex-1 border border-dashed rounded-lg p-2.5 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-pink-600">
                    <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={isUploadingLogo} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload className="h-4 w-4" />{isUploadingLogo ? "Uploading..." : "Upload Logo"}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Banner Spotlight Image (Optional)</Label>
                <div className="flex gap-4 items-center">
                  {imageUrl && <div className="h-10 w-14 rounded overflow-hidden border"><img src={imageUrl} alt="preview" className="h-full w-full object-cover" /></div>}
                  <div className="relative flex-1 border border-dashed rounded-lg p-2.5 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-pink-600">
                    <input type="file" accept="image/*" onChange={handleBannerUpload} disabled={isUploadingBanner} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload className="h-4 w-4" />{isUploadingBanner ? "Uploading..." : "Upload Image"}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bannerTitle">Campaign / Sponsor Title</Label>
              <Input id="bannerTitle" placeholder="e.g. Free Mammography Checks" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bannerDesc">Short Caption Description (2 lines)</Label>
              <textarea id="bannerDesc" rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bannerLink">Learn More Destination Link (Page or external url)</Label>
              <Input id="bannerLink" placeholder="e.g. /care/partner-organizations or https://example.com" value={destinationLink} onChange={(e) => setDestinationLink(e.target.value)} />
            </div>

            <div className="flex items-center gap-2">
              <input id="bannerActive" type="checkbox" className="h-4.5 w-4.5 rounded border-pink-300 text-pink-600 focus:ring-pink-500" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <Label htmlFor="bannerActive" className="text-xs font-semibold cursor-pointer select-none">Enable spotlight banner immediately</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending || isUploadingLogo || isUploadingBanner} className="bg-pink-600 hover:bg-pink-700 text-white font-bold">
                {isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}Add Banner
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Sponsor Spotlight Banner</DialogTitle>
            <DialogDescription>Modify details and click save changes.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Sponsor Logo (Optional)</Label>
                <div className="flex gap-4 items-center">
                  {logoUrl && <div className="h-10 w-10 rounded-full overflow-hidden border"><img src={logoUrl} alt="preview" className="h-full w-full object-cover" /></div>}
                  <div className="relative flex-1 border border-dashed rounded-lg p-2.5 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-pink-600">
                    <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={isUploadingLogo} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload className="h-4 w-4" />{isUploadingLogo ? "Uploading..." : "Replace Logo"}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Spotlight Image (Optional)</Label>
                <div className="flex gap-4 items-center">
                  {imageUrl && <div className="h-10 w-14 rounded overflow-hidden border"><img src={imageUrl} alt="preview" className="h-full w-full object-cover" /></div>}
                  <div className="relative flex-1 border border-dashed rounded-lg p-2.5 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-pink-600">
                    <input type="file" accept="image/*" onChange={handleBannerUpload} disabled={isUploadingBanner} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload className="h-4 w-4" />{isUploadingBanner ? "Uploading..." : "Replace Image"}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editBannerTitle">Campaign / Sponsor Title</Label>
              <Input id="editBannerTitle" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editBannerDesc">Short Caption Description</Label>
              <textarea id="editBannerDesc" rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editBannerLink">Learn More Destination Link</Label>
              <Input id="editBannerLink" value={destinationLink} onChange={(e) => setDestinationLink(e.target.value)} />
            </div>

            <div className="flex items-center gap-2">
              <input id="editBannerActive" type="checkbox" className="h-4.5 w-4.5 rounded border-pink-300 text-pink-600 focus:ring-pink-500" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <Label htmlFor="editBannerActive" className="text-xs font-semibold cursor-pointer select-none">Enable spotlight banner</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending || isUploadingLogo || isUploadingBanner} className="bg-pink-600 hover:bg-pink-700 text-white font-bold">
                {isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}

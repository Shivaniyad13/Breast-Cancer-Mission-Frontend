"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getDoctorPublicProfile } from "@/app/actions/doctor";
import { 
  Stethoscope, Building2, BookOpen, Video, 
  Calendar, CheckCircle, ExternalLink, X 
} from "lucide-react";
import Link from "next/link";

interface DoctorProfileModalProps {
  doctorIdOrId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DoctorProfileModal({ doctorIdOrId, isOpen, onClose }: DoctorProfileModalProps) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (isOpen && doctorIdOrId) {
      setLoading(true);
      getDoctorPublicProfile(doctorIdOrId)
        .then((data) => {
          setProfile(data);
        })
        .catch((err) => console.error("Error fetching doctor profile:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, doctorIdOrId]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-md rounded-3xl p-0 border border-pink-100 overflow-hidden shadow-2xl">
        <div className="relative bg-gradient-to-r from-pink-600 via-rose-500 to-pink-700 p-6 sm:p-8 text-white">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center shrink-0 shadow-lg text-white font-black text-2xl">
              {profile?.image ? (
                <img src={profile.image} alt={profile.name} className="h-full w-full object-cover rounded-2xl" />
              ) : (
                <Stethoscope className="h-10 w-10 text-white" />
              )}
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-2xl font-black">{profile?.name || "Dr. Medical Specialist"}</h2>
                <span className="bg-emerald-400/30 text-white border border-emerald-200/50 text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-emerald-300" /> Verified Doctor
                </span>
              </div>

              <p className="text-pink-100 font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5" /> {profile?.specialty || "Oncology Specialist"}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-pink-100/90 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-pink-200" /> {profile?.hospitalAffiliation || "Cancer Specialty Hospital"}
                </span>
                <span className="flex items-center gap-1 font-mono font-semibold bg-white/10 px-2 py-0.5 rounded-full text-[10px]">
                  ID: {profile?.doctorId || "DOC-VERIFIED"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs font-semibold animate-pulse">
              Loading doctor credentials and publications...
            </div>
          ) : !profile ? (
            <div className="py-10 text-center text-slate-500 text-xs">
              Doctor profile details not found.
            </div>
          ) : (
            <>
              {/* Bio Section */}
              <div className="space-y-2">
                <h3 className="font-heading text-xs font-black uppercase text-slate-400 tracking-wider">About Doctor</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium bg-pink-50/30 p-4 rounded-2xl border border-pink-100/50">
                  {profile.bio}
                </p>
              </div>

              {/* Published Articles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-heading text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-primary" /> Published Articles ({profile.articles?.length || 0})
                  </h3>
                </div>

                {profile.articles?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No published articles yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profile.articles?.map((art: any) => (
                      <div key={art.id} className="p-3.5 rounded-2xl border border-pink-100/60 bg-white hover:border-pink-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-2">
                        <div>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-pink-50 text-primary rounded-full">
                            {art.category}
                          </span>
                          <h4 className="font-heading text-xs font-bold text-slate-800 line-clamp-2 mt-1.5">
                            {art.title}
                          </h4>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-50">
                          <span>{new Date(art.createdAt).toLocaleDateString()}</span>
                          <Link href={`/learn/articles/${art.slug}`} onClick={onClose} className="text-primary font-bold hover:underline flex items-center gap-0.5">
                            Read <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hosted Webinars */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-heading text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Video className="h-4 w-4 text-primary" /> Hosted Webinars ({profile.webinars?.length || 0})
                  </h3>
                </div>

                {profile.webinars?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No webinars scheduled yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profile.webinars?.map((web: any) => (
                      <div key={web.id} className="p-3.5 rounded-2xl border border-pink-100/60 bg-white hover:border-pink-300 hover:shadow-xs transition-all space-y-2">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full">
                          {web.status}
                        </span>
                        <h4 className="font-heading text-xs font-bold text-slate-800 line-clamp-2">
                          {web.title}
                        </h4>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-50">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(web.date).toLocaleDateString()}</span>
                          <Link href={`/webinars/${web.id}`} onClick={onClose} className="text-primary font-bold hover:underline flex items-center gap-0.5">
                            View <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

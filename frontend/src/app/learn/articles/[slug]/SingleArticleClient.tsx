"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  BookOpen, Calendar, Clock, Stethoscope, 
  Building2, ShieldCheck, Bookmark 
} from "lucide-react";
import DoctorProfileModal from "@/components/doctor/DoctorProfileModal";

interface SingleArticleClientProps {
  article: any;
}

export default function SingleArticleClient({ article }: SingleArticleClientProps) {
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  return (
    <article className="space-y-8">
      {/* Doctor Modal */}
      {article.doctor && (
        <DoctorProfileModal
          doctorIdOrId={article.doctor.doctorId || article.doctor.id}
          isOpen={isDoctorModalOpen}
          onClose={() => setIsDoctorModalOpen(false)}
        />
      )}

      {/* Article Header Card */}
      <Card className="p-6 sm:p-10 rounded-3xl bg-white/90 backdrop-blur-md border border-pink-100 shadow-xl space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-pink-50 text-primary border border-pink-100 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {article.readTime}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl font-black text-slate-800 leading-tight">
            {article.title}
          </h1>

          <p className="text-sm text-slate-500 font-medium italic border-l-2 border-primary pl-3 py-1">
            {article.excerpt}
          </p>
        </div>

        {/* REQUIREMENT 6: WRITTEN BY DR. {NAME} (VERIFIED DOCTOR) */}
        {article.doctor && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50/50 to-pink-50 border border-pink-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Written by:</p>
                <button
                  onClick={() => setIsDoctorModalOpen(true)}
                  className="font-heading font-black text-slate-800 text-sm sm:text-base hover:text-primary transition-colors text-left flex items-center gap-1.5 cursor-pointer group"
                >
                  <span className="group-hover:underline">Dr. {article.doctor.name}</span>
                  <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-0.5">
                    <ShieldCheck className="h-2.5 w-2.5" /> Verified Doctor
                  </span>
                </button>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {article.doctor.specialty} • {article.doctor.hospitalAffiliation}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDoctorModalOpen(true)}
              className="text-xs font-bold text-primary hover:underline bg-white px-4 py-2 rounded-xl border border-pink-100 shadow-2xs shrink-0 cursor-pointer"
            >
              View Doctor Profile →
            </button>
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-100 pt-4">
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Published on {article.publishDate}</span>
        </div>
      </Card>

      {/* Article Content */}
      <Card className="p-6 sm:p-10 rounded-3xl bg-white border border-pink-100 shadow-md">
        <div className="prose prose-pink max-w-none text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
          {article.content}
        </div>
      </Card>
    </article>
  );
}

"use client";

import React from "react";
import Image from "next/image";

export interface CertificateTemplateProps {
  userName: string;
  certificateId: string;
  date: string;
  quizName?: string;
  className?: string;
}

export default function CertificateTemplate({
  userName,
  certificateId,
  date,
  quizName = "Breast Cancer Awareness Quiz",
  className = "",
}: CertificateTemplateProps) {
  return (
    <div className={`w-full flex justify-center items-center ${className}`}>
      {/* Outer Aspect Ratio Wrapper for A4 Landscape (1.414:1 ratio) */}
      <div className="relative w-full max-w-[1000px] aspect-[1.414/1] bg-gradient-to-br from-[#fffbfa] via-[#ffffff] to-[#fff5f7] rounded-sm shadow-2xl overflow-hidden border border-pink-100 flex flex-col justify-between p-6 sm:p-10 md:p-12 text-slate-800 select-none">
        
        {/* Decorative Wavy Side Ribbons / Borders */}
        <div className="absolute top-0 bottom-0 left-0 w-3 md:w-5 bg-gradient-to-b from-[#fce7f3] via-[#f472b6] to-[#db2777] opacity-60 rounded-r-md pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-3 md:w-5 bg-gradient-to-b from-[#db2777] via-[#f472b6] to-[#fce7f3] opacity-60 rounded-l-md pointer-events-none" />

        {/* Outer Fine Double Frame Border */}
        <div className="absolute inset-3 sm:inset-4 md:inset-5 border-2 border-[#f472b6]/40 rounded-sm pointer-events-none" />
        <div className="absolute inset-4 sm:inset-5 md:inset-6 border border-[#c49a45]/50 rounded-sm pointer-events-none" />

        {/* Corner Filigree Ornaments */}
        {/* Top-Left Corner Filigree */}
        <svg className="absolute top-4 left-4 w-10 h-10 text-[#c49a45] opacity-80 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <path d="M10 10 C 40 10, 50 20, 50 50 C 20 50, 10 40, 10 10 Z" strokeWidth="3" />
          <path d="M15 15 C 35 15, 40 25, 40 40" strokeWidth="2" />
          <circle cx="10" cy="10" r="4" fill="currentColor" />
        </svg>

        {/* Top-Right Corner Filigree */}
        <svg className="absolute top-4 right-4 w-10 h-10 text-[#c49a45] opacity-80 pointer-events-none transform scale-x-[-1]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <path d="M10 10 C 40 10, 50 20, 50 50 C 20 50, 10 40, 10 10 Z" strokeWidth="3" />
          <path d="M15 15 C 35 15, 40 25, 40 40" strokeWidth="2" />
          <circle cx="10" cy="10" r="4" fill="currentColor" />
        </svg>

        {/* Bottom-Left Corner Filigree */}
        <svg className="absolute bottom-4 left-4 w-10 h-10 text-[#c49a45] opacity-80 pointer-events-none transform scale-y-[-1]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <path d="M10 10 C 40 10, 50 20, 50 50 C 20 50, 10 40, 10 10 Z" strokeWidth="3" />
          <path d="M15 15 C 35 15, 40 25, 40 40" strokeWidth="2" />
          <circle cx="10" cy="10" r="4" fill="currentColor" />
        </svg>

        {/* Bottom-Right Corner Filigree */}
        <svg className="absolute bottom-4 right-4 w-10 h-10 text-[#c49a45] opacity-80 pointer-events-none transform scale-x-[-1] scale-y-[-1]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <path d="M10 10 C 40 10, 50 20, 50 50 C 20 50, 10 40, 10 10 Z" strokeWidth="3" />
          <path d="M15 15 C 35 15, 40 25, 40 40" strokeWidth="2" />
          <circle cx="10" cy="10" r="4" fill="currentColor" />
        </svg>

        {/* Left Artwork: Pink Ribbon + Female Silhouette Line Art */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-[18%] opacity-85 pointer-events-none hidden sm:block">
          <svg viewBox="0 0 200 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
            {/* Ribbons loops */}
            <path d="M60 220 C40 140 80 40 110 50 C140 60 110 160 150 240 C165 270 180 300 180 300 L140 300 C140 300 115 250 105 230 C95 210 70 230 60 220 Z" fill="url(#pink_ribbon_grad_1)" />
            <path d="M110 50 C80 40 40 140 60 220 L20 280 L60 280 C60 280 80 230 100 170 C120 110 140 60 110 50 Z" fill="url(#pink_ribbon_grad_2)" opacity="0.9" />
            {/* Female silhouette overlay */}
            <path d="M130 90 C120 70 100 65 95 85 C90 105 110 130 100 160 C90 190 70 200 80 240" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
            <defs>
              <linearGradient id="pink_ribbon_grad_1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="50%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#9f1239" />
              </linearGradient>
              <linearGradient id="pink_ribbon_grad_2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#be185d" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Right Artwork: Line-art Woman with Butterflies */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-[18%] opacity-80 pointer-events-none hidden sm:block">
          <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            {/* Woman Profile Line Art */}
            <path d="M100 60 C120 50 140 70 135 90 C130 110 115 120 120 140 C125 160 145 180 140 220 C135 260 100 280 80 290" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M125 80 C135 78 145 85 142 98 C140 110 128 118 132 135" stroke="#ec4899" strokeWidth="1.5" />
            {/* Butterflies */}
            <path d="M50 80 C40 70 30 75 40 85 C30 95 40 100 50 90 C60 100 70 95 60 85 C70 75 60 70 50 80 Z" fill="#f472b6" opacity="0.7" />
            <path d="M160 50 C153 42 145 46 153 54 C145 62 153 66 160 58 C168 66 176 62 168 54 C176 46 168 42 160 50 Z" fill="#ec4899" opacity="0.6" />
            <path d="M30 160 C25 153 19 156 25 162 C19 168 25 171 30 165 C35 171 41 168 35 162 C41 156 35 153 30 160 Z" fill="#f43f5e" opacity="0.6" />
          </svg>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="relative z-10 flex flex-col justify-between h-full space-y-3 sm:space-y-4">
          
          {/* TOP HEADER: LOGOS & SLOGAN */}
          <div className="flex items-center justify-between border-b border-pink-100/60 pb-3 sm:pb-4">
            {/* Top Left Logo: GRS India Group */}
            <div className="flex items-center gap-2">
              <div className="relative w-28 sm:w-36 h-10 sm:h-12">
                <Image
                  src="/grs-group-logo.jpg"
                  alt="GRS India Group"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>

            {/* Top Center: Pink Ribbon Icon & Slogan */}
            <div className="flex flex-col items-center text-center px-2">
              <div className="w-5 h-7 text-[#e11d48] mb-0.5">
                <svg viewBox="0 0 24 32" fill="currentColor">
                  <path d="M12 0C7 0 4 4 4 9C4 13 8 18 12 24C16 18 20 13 20 9C20 4 17 0 12 0ZM12 4C14.2 4 16 5.8 16 8C16 10.2 14.2 12 12 12C9.8 12 8 10.2 8 8C8 5.8 9.8 4 12 4Z" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 sm:w-10 h-[1px] bg-[#e11d48]/40" />
                <span className="text-[9px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#be185d]">
                  Together For Awareness • Together For A Cure
                </span>
                <div className="w-6 sm:w-10 h-[1px] bg-[#e11d48]/40" />
              </div>
            </div>

            {/* Top Right Logo: Khushi Centre */}
            <div className="flex items-center gap-2">
              <div className="relative w-28 sm:w-36 h-10 sm:h-12">
                <Image
                  src="/khushi-logo.jpg"
                  alt="Khushi Centre for Rehabilitation & Research"
                  fill
                  className="object-contain object-right"
                />
              </div>
            </div>
          </div>

          {/* CENTER TITLE & RECIPIENT SECTION */}
          <div className="flex flex-col items-center text-center my-auto space-y-2 sm:space-y-3">
            
            {/* Title: CERTIFICATE */}
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-widest text-[#8b1c43] uppercase drop-shadow-xs">
              Certificate
            </h1>

            {/* Subtitle: OF APPRECIATION with flanked gold rules */}
            <div className="flex items-center justify-center gap-3 w-full max-w-md">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c49a45] to-transparent" />
              <span className="font-serif text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-[#b8860b]">
                Of Appreciation
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c49a45] to-transparent" />
            </div>

            {/* Pink Ribbon Banner: PROUDLY PRESENTED TO */}
            <div className="relative my-1 sm:my-2">
              <div className="bg-gradient-to-r from-[#ec4899] via-[#e0528e] to-[#db2777] text-white font-sans text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] px-8 sm:px-12 py-1 sm:py-1.5 shadow-md clip-ribbon">
                Proudly Presented To
              </div>
            </div>

            {/* RECIPIENT NAME (Cursive / Elegant Script typography) */}
            <div className="pt-1 pb-1 sm:pb-2">
              <span className="font-serif italic text-2xl sm:text-4xl md:text-5xl font-bold text-[#8a1c4a] tracking-wide leading-tight drop-shadow-xs">
                {userName || "Participant Name"}
              </span>
              {/* Gold Flourish Divider */}
              <div className="flex justify-center items-center mt-1 text-[#c49a45]">
                <svg className="w-24 sm:w-36 h-3" viewBox="0 0 150 15" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M0 7.5 C 50 15, 40 0, 75 7.5 C 110 15, 100 0, 150 7.5" />
                  <circle cx="75" cy="7.5" r="2.5" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Sub-description line */}
            <p className="text-[11px] sm:text-xs md:text-sm text-slate-600 font-medium tracking-wide">
              for successfully completing the
            </p>

            {/* QUIZ / PROGRAM TITLE */}
            <h2 className="font-serif text-sm sm:text-lg md:text-xl font-extrabold text-[#8b1c43] tracking-wide">
              {quizName}
            </h2>

            {/* DESCRIPTIVE BODY TEXT */}
            <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 max-w-xl leading-relaxed px-4">
              Your participation demonstrates your commitment to spreading awareness, promoting early detection, and supporting breast cancer education.
            </p>
            <p className="text-[10px] sm:text-xs font-semibold text-[#be185d] pt-0.5">
              Thank you for contributing to a healthier and more informed community.
            </p>
          </div>

          {/* SIGNATURES & CENTRAL GOLD SEAL BADGE */}
          <div className="grid grid-cols-3 items-end pt-3 sm:pt-4 border-t border-pink-100/60">
            
            {/* Left Signature: Santosh Aggarwal */}
            <div className="flex flex-col items-center text-center">
              {/* Simulated Signature Graphics */}
              <div className="h-8 sm:h-10 flex items-center justify-center">
                <span className="font-serif italic text-lg sm:text-xl font-bold text-slate-800 tracking-tighter transform -rotate-3">
                  S. Aggarwal
                </span>
              </div>
              <div className="w-28 sm:w-36 h-[1px] bg-slate-300 my-1" />
              <span className="text-[10px] sm:text-xs font-extrabold text-slate-800 tracking-wider uppercase">
                Santosh Aggarwal
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
                Chairman, GRS India Group
              </span>
            </div>

            {/* Center Metallic Gold Circular Seal Badge */}
            <div className="flex justify-center items-center">
              <div className="relative w-14 sm:w-20 h-14 sm:h-20 rounded-full bg-gradient-to-tr from-[#9a7b2c] via-[#f5d77f] to-[#b8860b] p-1 shadow-lg flex items-center justify-center border border-[#785b18]">
                {/* Serrated Edge Ring */}
                <div className="w-full h-full rounded-full border-2 border-dashed border-[#785b18]/60 bg-gradient-to-br from-[#fef08a] via-[#eab308] to-[#ca8a04] flex flex-col items-center justify-center text-center p-1 shadow-inner">
                  <span className="text-[7px] sm:text-[9px] font-black tracking-tighter text-[#713f12] uppercase leading-none">
                    GRS
                  </span>
                  <span className="text-[6px] sm:text-[7px] font-bold text-[#854d0e] uppercase leading-tight">
                    INDIA GROUP
                  </span>
                  <div className="w-6 h-[1px] bg-[#854d0e] my-0.5" />
                  <span className="text-[5px] sm:text-[6px] font-semibold text-[#a16207] uppercase">
                    SEAL OF EXCELLENCE
                  </span>
                </div>
              </div>
            </div>

            {/* Right Signature: Khushi Centre */}
            <div className="flex flex-col items-center text-center">
              {/* Simulated Signature Graphics */}
              <div className="h-8 sm:h-10 flex items-center justify-center">
                <span className="font-serif italic text-lg sm:text-xl font-bold text-slate-800 tracking-tighter transform rotate-2">
                  Dr. Khushi
                </span>
              </div>
              <div className="w-28 sm:w-36 h-[1px] bg-slate-300 my-1" />
              <span className="text-[10px] sm:text-xs font-extrabold text-slate-800 tracking-wider uppercase">
                Khushi Centre
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
                For Rehabilitation & Research
              </span>
            </div>
          </div>

          {/* BOTTOM FOOTER: CERTIFICATE ID & DATE */}
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-bold text-slate-600 pt-1">
            <div className="flex items-center gap-1">
              <span className="text-[#be185d] font-black uppercase">Certificate ID:</span>
              <span className="font-mono text-slate-800">{certificateId}</span>
            </div>

            {/* Center Decorative Star */}
            <div className="text-[#be185d]">
              ✦ • 🌸 • ✦
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[#be185d] font-black uppercase">Date:</span>
              <span className="text-slate-800">{date}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

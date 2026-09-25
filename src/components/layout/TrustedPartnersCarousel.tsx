"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

interface PartnerOrg {
  id: string;
  logo: string;
}

const TRUSTED_PARTNERS: PartnerOrg[] = [
  { id: "aiims", logo: "/images/partners/aiims.svg" },
  { id: "nci-jhajjar", logo: "/images/partners/nci-jhajjar.svg" },
  { id: "tata-memorial", logo: "/images/partners/tata-memorial.svg" },
  { id: "nhm", logo: "/images/partners/nhm.svg" },
  { id: "mohfw", logo: "/images/partners/mohfw.svg" },
  { id: "icmr", logo: "/images/partners/icmr.svg" },
  { id: "nicpr", logo: "/images/partners/nicpr.svg" },
  {
    id: "indian-cancer-society",
    logo: "/images/partners/indian-cancer-society.svg",
  },
  { id: "cpaa", logo: "/images/partners/cpaa.svg" },
  { id: "uicc", logo: "/images/partners/uicc.svg" },
  { id: "bcna", logo: "/images/partners/bcna.svg" },
  { id: "susan-g-komen", logo: "/images/partners/susan-g-komen.svg" },
  {
    id: "american-cancer-society",
    logo: "/images/partners/american-cancer-society.svg",
  },
  { id: "pink-initiative", logo: "/images/partners/pink-initiative.svg" },
  { id: "cansupport", logo: "/images/partners/cansupport.svg" },
  { id: "tata-hospital", logo: "/images/partners/tata-hospital.svg" },
  { id: "rgci", logo: "/images/partners/rgci.svg" },
  { id: "apollo-cancer", logo: "/images/partners/apollo-cancer.svg" },
  { id: "max-cancer", logo: "/images/partners/max-cancer.svg" },
  { id: "fortis-cancer", logo: "/images/partners/fortis-cancer.svg" },
  { id: "hcg-cancer", logo: "/images/partners/hcg-cancer.svg" },
];

export default function TrustedPartnersCarousel() {
  const duplicatedPartners = [...TRUSTED_PARTNERS, ...TRUSTED_PARTNERS];

  return (
    <section className="py-20 bg-white border-t border-b border-pink-100 overflow-hidden relative">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(219,39,119,0.04)_0%,_transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-10 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 border border-pink-200 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 text-pink-600" />
          Collaborative Healthcare Network
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Trusted Healthcare &amp; Support Organizations
        </h2>

        <p className="text-slate-600 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
          We proudly recognize organizations, hospitals, NGOs, government
          institutions, and healthcare partners working towards breast cancer
          awareness, early detection, treatment, research, and patient support.
        </p>
      </div>

      {/* Marquee */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Track */}
        <div className="animate-partner-marquee flex gap-6 px-4">
          {duplicatedPartners.map((partner, idx) => (
            <div
              key={`${partner.id}-${idx}`}
              className="group relative flex-shrink-0 w-44 h-28 sm:w-52 sm:h-32 bg-white rounded-2xl border border-pink-100 shadow-sm hover:shadow-xl hover:border-pink-300 hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-center p-4"
            >
              <img
                src={partner.logo}
                alt={`${partner.id} logo`}
                className="max-h-16 sm:max-h-20 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
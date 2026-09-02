"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink, ShieldCheck, HeartPulse, Building2, Hospital, Stethoscope, Users } from "lucide-react";

export interface PartnerOrg {
  id: string;
  name: string;
  category: "Government Hospital" | "NGO" | "Research Institute" | "Cancer Hospital" | "Healthcare Partner" | "Support Organization" | "Government Institution";
  logo: string;
  website: string;
  description?: string;
}

export const TRUSTED_PARTNERS: PartnerOrg[] = [
  // Government & Govt Institutions
  {
    id: "aiims",
    name: "AIIMS New Delhi",
    category: "Government Hospital",
    logo: "/images/partners/aiims.svg",
    website: "https://www.aiims.edu",
  },
  {
    id: "nci-jhajjar",
    name: "National Cancer Institute (Jhajjar)",
    category: "Research Institute",
    logo: "/images/partners/nci-jhajjar.svg",
    website: "https://nci.aiims.edu",
  },
  {
    id: "tata-memorial",
    name: "Tata Memorial Centre",
    category: "Cancer Hospital",
    logo: "/images/partners/tata-memorial.svg",
    website: "https://tmc.gov.in",
  },
  {
    id: "nhm",
    name: "National Health Mission (NHM)",
    category: "Government Institution",
    logo: "/images/partners/nhm.svg",
    website: "https://nhm.gov.in",
  },
  {
    id: "mohfw",
    name: "Ministry of Health & Family Welfare",
    category: "Government Institution",
    logo: "/images/partners/mohfw.svg",
    website: "https://mohfw.gov.in",
  },
  {
    id: "icmr",
    name: "Indian Council of Medical Research (ICMR)",
    category: "Research Institute",
    logo: "/images/partners/icmr.svg",
    website: "https://www.icmr.gov.in",
  },
  {
    id: "nicpr",
    name: "NICPR (ICMR)",
    category: "Research Institute",
    logo: "/images/partners/nicpr.svg",
    website: "https://nicpr.icmr.org.in",
  },

  // NGOs & Support Organizations
  {
    id: "indian-cancer-society",
    name: "Indian Cancer Society",
    category: "NGO",
    logo: "/images/partners/indian-cancer-society.svg",
    website: "https://www.indiancancersociety.org",
  },
  {
    id: "cpaa",
    name: "Cancer Patients Aid Association",
    category: "NGO",
    logo: "/images/partners/cpaa.svg",
    website: "https://cancer.org.in",
  },
  {
    id: "uicc",
    name: "UICC (Union Int. Cancer Control)",
    category: "Healthcare Partner",
    logo: "/images/partners/uicc.svg",
    website: "https://www.uicc.org",
  },
  {
    id: "bcna",
    name: "Breast Cancer Network Australia",
    category: "Support Organization",
    logo: "/images/partners/bcna.svg",
    website: "https://www.bcna.org.au",
  },
  {
    id: "susan-g-komen",
    name: "Susan G. Komen Foundation",
    category: "NGO",
    logo: "/images/partners/susan-g-komen.svg",
    website: "https://www.komen.org",
  },
  {
    id: "american-cancer-society",
    name: "American Cancer Society",
    category: "NGO",
    logo: "/images/partners/american-cancer-society.svg",
    website: "https://www.cancer.org",
  },
  {
    id: "pink-initiative",
    name: "Pink Initiative",
    category: "NGO",
    logo: "/images/partners/pink-initiative.svg",
    website: "https://www.pinkinitiative.org",
  },
  {
    id: "cansupport",
    name: "CanSupport India",
    category: "Support Organization",
    logo: "/images/partners/cansupport.svg",
    website: "https://cansupport.org",
  },

  // Hospitals & Cancer Centres
  {
    id: "tata-hospital",
    name: "Tata Memorial Hospital",
    category: "Cancer Hospital",
    logo: "/images/partners/tata-hospital.svg",
    website: "https://tmc.gov.in",
  },
  {
    id: "rgci",
    name: "Rajiv Gandhi Cancer Institute",
    category: "Cancer Hospital",
    logo: "/images/partners/rgci.svg",
    website: "https://www.rgci.org",
  },
  {
    id: "apollo-cancer",
    name: "Apollo Cancer Centres",
    category: "Cancer Hospital",
    logo: "/images/partners/apollo-cancer.svg",
    website: "https://www.apollocancercentres.com",
  },
  {
    id: "max-cancer",
    name: "Max Institute of Cancer Care",
    category: "Cancer Hospital",
    logo: "/images/partners/max-cancer.svg",
    website: "https://www.maxhealthcare.in",
  },
  {
    id: "fortis-cancer",
    name: "Fortis Cancer Institute",
    category: "Cancer Hospital",
    logo: "/images/partners/fortis-cancer.svg",
    website: "https://www.fortishealthcare.com",
  },
  {
    id: "hcg-cancer",
    name: "HCG Cancer Centre",
    category: "Cancer Hospital",
    logo: "/images/partners/hcg-cancer.svg",
    website: "https://www.hcgoncology.com",
  },
];

// Helper to get styled badge colors per category
const getCategoryBadgeStyle = (category: PartnerOrg["category"]) => {
  switch (category) {
    case "Government Hospital":
    case "Government Institution":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "Cancer Hospital":
      return "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800";
    case "NGO":
      return "bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 border-pink-200 dark:border-pink-800";
    case "Research Institute":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    case "Support Organization":
      return "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  }
};

export default function TrustedPartnersCarousel() {
  // Duplicate array for seamless 360 continuous marquee loop
  const duplicatedPartners = [...TRUSTED_PARTNERS, ...TRUSTED_PARTNERS];

  return (
    <section className="py-20 bg-slate-900/5 dark:bg-slate-950/40 border-t border-b border-slate-200/60 dark:border-slate-800/60 overflow-hidden relative">
      {/* Background Subtle Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(219,39,119,0.04)_0%,_transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-10 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/80 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 text-pink-600 dark:text-pink-400" />
          Collaborative Healthcare Network
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Trusted Healthcare &amp; Support Organizations
        </h2>

        <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
          We proudly recognize organizations, hospitals, NGOs, government institutions, and healthcare partners working towards breast cancer awareness, early detection, treatment, research, and patient support.
        </p>
      </div>

      {/* Marquee Carousel Track */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left Fade Gradient Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
        
        {/* Right Fade Gradient Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />

        {/* Marquee Container */}
        <div className="animate-partner-marquee flex gap-6 px-4">
          {duplicatedPartners.map((partner, idx) => (
            <a
              key={`${partner.id}-${idx}`}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              title={`Visit official website of ${partner.name}`}
              className="group relative flex-shrink-0 w-72 sm:w-80 bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-pink-400/80 dark:hover:border-pink-500/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* External Link Icon indicator on hover */}
              <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-pink-600 dark:text-pink-400">
                <ExternalLink className="h-4 w-4" />
              </div>

              {/* Logo Area with Grayscale to Color Transition */}
              <div className="h-20 w-full flex items-center justify-center p-2 mb-3 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="max-h-16 max-w-full object-contain filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  loading="lazy"
                />
              </div>

              {/* Card Details */}
              <div className="space-y-2 text-left">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border tracking-wide uppercase ${getCategoryBadgeStyle(partner.category)}`}>
                  {partner.category}
                </span>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-1">
                  {partner.name}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

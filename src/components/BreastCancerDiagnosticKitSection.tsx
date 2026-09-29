/**
 * Component: BreastCancerDiagnosticKitSection
 * Purpose: Showcase GRS India's handheld multimodal Breast Cancer Diagnostic Kit
 * with dual product images, specifications, and enquiry CTA.
 * Data source: https://grsgroup.in/product/breast-cancer-diagnostic-kit
 */

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  Hospital,
  Leaf,
  Microscope,
  Package,
  Scan,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Stethoscope,
  Users,
  Zap,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BreastCancerDiagnosticKitSection() {
  const enquiryUrl = "#enquiry-form";
  const storeUrl = "https://grsgroup.in/products";
  const productUrl = "https://grsgroup.in/product/breast-cancer-diagnostic-kit";

  // ✅ Dono images — public/images/ folder mein rakho
  const productImages = [
    "/images/kit1.jpg",
    "/images/kit2.jpg"
  ];

  const devices = [
    {
      id: "nir",
      name: "NIR Device (Near-Infrared)",
      icon: Scan,
      color: "emerald",
      description:
        "Uses near-infrared light for non-invasive, real-time vascular imaging to identify tumor-associated blood flow patterns and map deeper tissue structures.",
      audience:
        "Surgeons, physicians, laboratories, diagnostics, clinicians, hospitals, radiologists, and others.",
      points: [
        "Non-invasive & real-time imaging",
        "Vascular pattern identification",
        "Deeper tissue structure mapping",
        "Complementary screening tool"
      ]
    },
    {
      id: "fluorescence",
      name: "Fluorescence Device",
      icon: Zap,
      color: "pink",
      description:
        "Employs targeted fluorescent dyes to achieve high-contrast visualization of malignant tissue, assisting surgeons in real time during procedures.",
      audience: "Surgeons and surgical teams.",
      points: [
        "High-contrast malignant tissue visualization",
        "Real-time surgical guidance",
        "Precise tumor boundary identification",
        "Healthy tissue preservation"
      ]
    },
    {
      id: "spectrometer",
      name: "Spectrometer Device",
      icon: Microscope,
      color: "blue",
      description:
        "Analyzes light absorption, scattering, and emission spectra to identify biochemical and structural changes in tissue composition.",
      audience: "Diagnostic labs, pathologists, and clinicians.",
      points: [
        "Rapid, high-sensitivity tissue characterization",
        "Biochemical & structural analysis",
        "Early detection support",
        "Treatment planning aid"
      ]
    },
    {
      id: "smartphone",
      name: "Smartphone-Based Fluorescence Imaging Device",
      icon: Smartphone,
      color: "amber",
      description:
        "A portable, low-cost, multimodal imaging system using a 3D-printed smartphone mount, blue LED excitation, and an emission filter.",
      audience:
        "Point-of-care screening, field diagnostics, and low-resource settings.",
      points: [
        "Portable & low-cost design",
        "3D-printed smartphone mount",
        "Blue LED excitation",
        "Autofluorescence & fluorescence screening"
      ]
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-emerald-50/40 via-white to-pink-50/30 overflow-hidden relative border-y border-emerald-100/60">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 mb-12 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-extrabold uppercase tracking-wider shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
            Advanced Optical Imaging &amp; Spectroscopy
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            BREAST CANCER DIAGNOSTIC KIT
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-medium max-w-3xl mx-auto leading-relaxed">
            Developed by{" "}
            <strong className="text-slate-900">GRS India Private Limited</strong>{" "}
            — an innovative handheld multimodal kit integrating advanced optical
            imaging and spectroscopy technologies for real-time, non-invasive,
            point-of-care breast cancer screening, tissue characterization, and
            surgical guidance.
          </p>
        </motion.div>

        {/* ===== Main 2-Column Showcase Card ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="bg-white rounded-3xl border border-emerald-100/80 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 max-w-6xl mx-auto overflow-hidden group mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-12">

            {/* LEFT: Dono Images Side-by-Side */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6">

              {/* Dual Image Grid */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {productImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square bg-gradient-to-b from-emerald-50/60 via-white to-pink-50/30 rounded-2xl p-4 border border-emerald-100/60 flex items-center justify-center overflow-hidden"
                  >
                    {/* Image Badge */}
                    <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
                      <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider">
                        View {idx + 1}
                      </span>
                    </div>

                    <Image
                      src={img}
                      alt={`Breast Cancer Diagnostic Kit - View ${idx + 1}`}
                      width={400}
                      height={400}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                  </div>
                ))}
              </div>

              {/* Quick Info Pills */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-md text-center">
                <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Modules
                  </span>
                  <strong className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                    <Package className="h-3.5 w-3.5 text-emerald-600" /> 4 Devices
                  </strong>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-200/60 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">
                    Technology
                  </span>
                  <strong className="text-xs sm:text-sm font-extrabold text-emerald-900 flex items-center justify-center gap-1 mt-0.5">
                    <Activity className="h-3.5 w-3.5 text-emerald-600" /> Optical
                    Imaging
                  </strong>
                </div>
              </div>
            </div>

            {/* RIGHT: Specs & CTA */}
            <div className="lg:col-span-7 space-y-6">

              {/* Title & Category */}
              <div className="space-y-3 border-b border-slate-100 pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-pink-100 text-pink-700 text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider">
                    Medical Diagnostic Equipment
                  </span>
                  <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="h-3 w-3 fill-amber-500 text-amber-500" />{" "}
                    Multimodal Innovation
                  </span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-black text-slate-900">
                  Handheld Multimodal Breast Cancer Diagnostic Kit
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  A portable, point-of-care system integrating NIR imaging,
                  fluorescence visualization, spectroscopy, and smartphone-based
                  screening — designed for real-time clinical decision support.
                </p>

                {/* Price / Enquiry */}
                <div className="flex flex-wrap items-baseline gap-3 pt-2">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-heading">
                    Custom Quote
                  </span>
                  <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider animate-pulse">
                    Enquiry Based
                  </span>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-600" /> Key Benefits
                  &amp; Clinical Value
                </h4>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                  <li className="flex items-start gap-2 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/60">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Real-time, non-invasive screening and tissue
                      characterization.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/60">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Point-of-care deployment — hospitals, clinics, and field
                      settings.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/60">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Surgical guidance for precise tumor excision and margin
                      assessment.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/60">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Multimodal integration — NIR, fluorescence, spectroscopy
                      &amp; smartphone.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Intended Users */}
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-1 text-xs">
                <div className="flex items-center gap-1 text-amber-800 font-extrabold uppercase text-[10px] tracking-wider">
                  <Users className="h-3.5 w-3.5 text-amber-600" /> Intended Users
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Surgeons, radiologists, pathologists, diagnostics labs,
                  hospitals, and point-of-care clinicians.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <a href={enquiryUrl} className="w-full sm:flex-1">
            
                   
                </a>

                <a
                  href={productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-700 font-black text-sm rounded-2xl py-6 px-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group/btn2 cursor-pointer"
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Enquire for Kit
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover/btn2:translate-x-1" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== Device Modules Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 mb-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-extrabold uppercase tracking-wider shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
            4 Integrated Diagnostic Modules
          </div>
          <h3 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Inside the Kit
          </h3>
          <p className="text-slate-500 text-sm font-medium">
            Each module is engineered for a specific clinical workflow — together
            they form a comprehensive breast cancer diagnostic platform.
          </p>
        </motion.div>

        {/* ===== Device Cards (Icons Only) ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto mb-16">
          {devices.map((device, idx) => {
            const Icon = device.icon;
            const colorMap: Record<
              string,
              { bg: string; text: string; border: string; iconBg: string }
            > = {
              emerald: {
                bg: "bg-emerald-50/60",
                text: "text-emerald-800",
                border: "border-emerald-200/60",
                iconBg: "bg-emerald-100"
              },
              pink: {
                bg: "bg-pink-50/60",
                text: "text-pink-800",
                border: "border-pink-200/60",
                iconBg: "bg-pink-100"
              },
              blue: {
                bg: "bg-blue-50/60",
                text: "text-blue-800",
                border: "border-blue-200/60",
                iconBg: "bg-blue-100"
              },
              amber: {
                bg: "bg-amber-50/60",
                text: "text-amber-800",
                border: "border-amber-200/60",
                iconBg: "bg-amber-100"
              }
            };
            const colors = colorMap[device.color];

            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * idx }}
                className={`bg-white rounded-3xl border ${colors.border} shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group`}
              >
                <div className="p-6 sm:p-8 space-y-5">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4">
                    <div className={`${colors.iconBg} p-3 rounded-2xl shrink-0`}>
                      <Icon className={`h-7 w-7 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg sm:text-xl font-black text-slate-900 leading-tight">
                        {device.name}
                      </h3>
                      <p
                        className={`text-[11px] font-bold uppercase tracking-wider ${colors.text} mt-1`}
                      >
                        Integrated Module
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {device.description}
                  </p>

                  {/* Audience */}
                  <div
                    className={`${colors.bg} p-3.5 rounded-xl border ${colors.border}`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                      Intended Users
                    </span>
                    <p className="text-xs font-medium text-slate-700">
                      {device.audience}
                    </p>
                  </div>

                  {/* Key Points */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {device.points.map((point, pIdx) => (
                      <li
                        key={pIdx}
                        className="flex items-start gap-2 text-xs text-slate-600 font-medium"
                      >
                        <CheckCircle2
                          className={`h-3.5 w-3.5 ${colors.text} shrink-0 mt-0.5`}
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ===== Bottom Trust Strip ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs font-bold text-slate-500"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            GRS India Private Limited
          </div>
          <div className="flex items-center gap-1.5">
            <Leaf className="h-4 w-4 text-emerald-600" />
            Make in India
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-emerald-600" />
            Clinical Collaboration Available
          </div>
          <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 underline-offset-4 hover:underline transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View on GRS Store
          </a>
        </motion.div>
      </div>
    </section>
  );
}
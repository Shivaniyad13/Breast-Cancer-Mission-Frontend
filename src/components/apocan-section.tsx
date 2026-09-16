/**
 * Component: ApocanSection
 * Purpose: Showcase APOCAN Advance Capsules with detailed product specifications,
 * pricing, certifications, key benefits, and purchase call-to-actions.
 * Persistent showcase section used on Home page and Treatment page.
 */

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Leaf,
  Star,
  Activity,
  HeartHandshake,
  Package,
  Clock,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ApocanSection() {
  const buyUrl = "https://www.grsgroup.in/product/apocan-advance-capsules";
  const storeUrl = "https://www.grsgroup.in/products";

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-emerald-50/40 via-white to-pink-50/30 overflow-hidden relative border-y border-emerald-100/60">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Badge & Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 mb-12 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-extrabold uppercase tracking-wider shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
            Natural Herbal Dietary Supplement
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            APOCAN ADVANCE CAPSULES
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Formulated by <strong className="text-slate-900">GRS India Pvt Ltd</strong> — A pure blend of traditional Himalayan herbs dedicated to immune support, cellular vitality, and overall wellness.
          </p>
        </motion.div>

        {/* Main 2-Column Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="bg-white rounded-3xl border border-emerald-100/80 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 max-w-6xl mx-auto overflow-hidden group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-12">

            {/* Left Column: Product Image & Badges */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6">
              
              <div className="relative w-full max-w-md aspect-square bg-gradient-to-b from-emerald-50/60 via-white to-pink-50/30 rounded-2xl p-6 border border-emerald-100/60 flex items-center justify-center overflow-hidden">
                {/* 100% Veg Symbol */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                  <div className="h-4 w-4 border-2 border-emerald-600 flex items-center justify-center p-0.5 rounded-2xs">
                    <div className="h-2 w-2 bg-emerald-600 rounded-full" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">100% VEG</span>
                </div>

                {/* Stock Badge */}
                <div className="absolute top-4 right-4 z-10 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> In Stock
                </div>

                {/* Zoomable Image */}
                <Image
                  src="/images/apocan-capsule.jpeg"
                  alt="APOCAN Advance Capsules - GRS India"
                  width={600}
                  height={600}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>

              {/* Pack & Composition Pills */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-md text-center">
                <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Pack Size</span>
                  <strong className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                    <Package className="h-3.5 w-3.5 text-emerald-600" /> 30 Capsules (800 mg)
                  </strong>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-200/60 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Origin</span>
                  <strong className="text-xs sm:text-sm font-extrabold text-emerald-900 flex items-center justify-center gap-1 mt-0.5">
                    <Leaf className="h-3.5 w-3.5 text-emerald-600" /> Himalayan Herbs
                  </strong>
                </div>
              </div>

            </div>

            {/* Right Column: Product Specs, Pricing, Benefits & CTA */}
            <div className="lg:col-span-7 space-y-6">

              {/* Title & Pricing Box */}
              <div className="space-y-3 border-b border-slate-100 pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-pink-100 text-pink-700 text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider">
                    Herbal Dietary Supplement
                  </span>
                  <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Premium Wellness
                  </span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-black text-slate-900">
                  APOCAN Advance Capsules (800 mg)
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Carefully blended from authentic Himalayan herbs to support cellular immunity, metabolic strength, and vital recovery.
                </p>

                {/* Price Display */}
                <div className="flex flex-wrap items-baseline gap-3 pt-2">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-700 font-heading">
                    ₹5,999.00
                  </span>
                  <span className="text-sm sm:text-base text-slate-400 line-through font-bold">
                    MRP ₹14,999.00
                  </span>
                  <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider animate-pulse">
                    60% OFF
                  </span>
                </div>
              </div>

              {/* Certifications Row */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/60">
                <span className="text-slate-400 uppercase text-[10px] font-black tracking-widest block w-full sm:w-auto">Certifications:</span>
                <div className="flex items-center gap-1 text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> FSSAI Registered
                </div>
                <div className="flex items-center gap-1 text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> ISO 9001:2015
                </div>
                <div className="flex items-center gap-1 text-amber-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  <Leaf className="h-3.5 w-3.5 text-amber-600" /> Make in India
                </div>
              </div>

              {/* Key Benefit Bullet Points */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-600" /> Key Benefits & Indications
                </h4>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                  <li className="flex items-start gap-2 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/60">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Supports overall well-being, longevity, and physical vitality.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/60">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Aids healthy metabolism &amp; generates general feel-good factor.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/60">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Promotes cellular health &amp; immune support (NK cells &amp; macrophages).</span>
                  </li>
                  <li className="flex items-start gap-2 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/60">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>100% natural, vegetarian formula with traditional Himalayan jadi-bootis.</span>
                  </li>
                </ul>
              </div>

              {/* Dosage & Storage Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-1">
                  <div className="flex items-center gap-1 text-amber-800 font-extrabold uppercase text-[10px] tracking-wider">
                    <Clock className="h-3.5 w-3.5 text-amber-600" /> Recommended Dosage
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    1 capsule twice a day with water after meals, or as directed by a physician.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/60 space-y-1">
                  <div className="flex items-center gap-1 text-blue-800 font-extrabold uppercase text-[10px] tracking-wider">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-600" /> Storage Instructions
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Store in a cool, dry place away from direct sunlight and moisture.
                  </p>
                </div>
              </div>

              {/* Action Buttons: Buy Now & View All Products */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href={buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1"
                >
                  <Button
                    size="lg"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl py-6 shadow-xl shadow-emerald-600/20 hover:shadow-2xl hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all duration-300 group/btn cursor-pointer"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Buy Now on GRS Store
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </a>

                <a
                  href={storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors py-2 px-3 underline-offset-4 hover:underline"
                >
                  <span>View all products</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}

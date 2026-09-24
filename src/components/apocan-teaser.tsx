/**
 * Component: ApocanTeaser
 * Purpose: A subtle, compact teaser banner on the Home page for APOCAN Advance Capsules.
 * Displays a soft highlight with product title & subtext, leading users to the /treatment page.
 * Does NOT contain prices or sales pitch buttons.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export default function ApocanTeaser() {
  return (
    <section className="py-8 sm:py-10 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/treatment" className="block group">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-emerald-50/70 via-green-50/40 to-pink-50/50 rounded-2xl sm:rounded-3xl border border-emerald-100/90 hover:border-emerald-300 p-4 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
          >
            {/* Soft decorative glow circles */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-200/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-pink-200/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 relative z-10">
              
              {/* Left Side: Thumbnail & Headline */}
              <div className="flex items-center gap-4 sm:gap-6 text-center sm:text-left">
                {/* Product Thumbnail */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl p-2 border border-emerald-100 shadow-2xs shrink-0 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/apocan-capsule.jpeg"
                    alt="APOCAN Advance Capsules"
                    width={100}
                    height={100}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Text & Badges */}
                <div className="space-y-1 sm:space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="inline-flex items-center gap-1 bg-emerald-100/80 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      <Sparkles className="h-3 w-3 text-emerald-600 fill-emerald-600" /> In Focus
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      <Leaf className="h-3 w-3 text-emerald-600" /> Herbal Dietary Supplement
                    </span>
                  </div>

                  <h3 className="font-heading text-lg sm:text-xl font-black text-slate-900 group-hover:text-emerald-900 transition-colors">
                    APOCAN  Capsules
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                    Ayurvedic supportive wellness — formulated by <strong className="text-slate-800">GRS India Pvt Ltd</strong>
                  </p>
                </div>
              </div>

              {/* Right Side: Learn More Action Link */}
              <div className="shrink-0 pt-1 sm:pt-0">
                <span className="inline-flex items-center gap-2 bg-white group-hover:bg-emerald-600 text-emerald-800 group-hover:text-white text-xs sm:text-sm font-extrabold px-4 sm:px-5 py-2.5 rounded-xl border border-emerald-200 group-hover:border-emerald-600 shadow-2xs transition-all duration-300">
                  <span>Explore Treatment Details</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>

            </div>
          </motion.div>
        </Link>

      </div>
    </section>
  );
}

/**
 * Component: ApocanPopup
 * Purpose: One-time per browser session reminder modal showcasing APOCAN Advance Capsules.
 * Utilizes sessionStorage key 'apocan-popup-seen' to ensure it displays only once.
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, X, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ApocanPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const buyUrl = "https://www.grsgroup.in/product/apocan-advance-capsules";

  useEffect(() => {
    // Check if user has already seen the popup in this browser session
    const hasSeen = sessionStorage.getItem("apocan-popup-seen");
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 4000); // Trigger after 4 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("apocan-popup-seen", "true");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          
          {/* Backdrop Click to Close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-emerald-100 shadow-2xl overflow-hidden z-10 space-y-6"
          >
            {/* Top Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 h-8 w-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-100/80 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-emerald-600 fill-emerald-600" /> Special Offer
            </div>

            {/* Content Body */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Product Thumbnail */}
              <div className="relative w-36 h-36 bg-gradient-to-b from-emerald-50 via-white to-pink-50 rounded-2xl p-3 border border-emerald-100 shrink-0 flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/apocan-capsule.jpeg"
                  alt="APOCAN Advance Capsules"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                />
                <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                  60% OFF
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="font-heading text-xl font-black text-slate-900 leading-tight">
                  APOCAN ADVANCE CAPSULES
                </h3>
                
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Support cellular immunity, vitality &amp; wellness with 100% natural Himalayan herbs.
                </p>

                <div className="flex items-baseline justify-center sm:justify-start gap-2 pt-1">
                  <span className="text-xl font-black text-emerald-700 font-heading">
                  
                  </span>
                  <span className="text-xs text-slate-400 line-through font-bold">
                  
                  </span>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-[10px] text-slate-600 font-bold pt-1">
                  <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-600" /> FSSAI Approved</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-blue-600" /> ISO Certified</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2">
              <a
                href={buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className="block w-full"
              >
                <Button
                  size="lg"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl py-3.5 shadow-lg shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Buy Now on GRS Store
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>

              <button
                onClick={handleClose}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-600 font-semibold py-1.5 cursor-pointer"
              >
                Maybe later
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

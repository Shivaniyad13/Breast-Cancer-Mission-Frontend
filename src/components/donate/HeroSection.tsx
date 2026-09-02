'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { HeartPulse, CheckCircle2, ShieldCheck, Sparkles, Ribbon, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
  onDonateClick: () => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onDonateClick }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-700 text-white shadow-2xl p-6 sm:p-10 md:p-14 mb-10">
      {/* Background Decorative Ribbon Shapes & Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/30 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column Text Content */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs sm:text-sm font-medium text-pink-100 shadow-inner"
          >
            <Ribbon className="h-4 w-4 text-pink-200 animate-pulse" />
            <span>Official Breast Cancer  Mission</span>
            <Sparkles className="h-3.5 w-3.5 text-yellow-300 ml-0.5" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
          >
            Together We Can <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-100 to-white">
              Save Lives
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-pink-100/90 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed"
          >
            Support breast cancer awareness, early detection screening camps, patient care, medical guidance, and educational webinars. Every contribution brings hope and saves families.
          </motion.p>

          {/* Impact Bullet Points */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm font-medium text-white/90"
          >
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/15">
              <CheckCircle2 className="h-4 w-4 text-pink-200 flex-shrink-0" />
              <span>Early Screening Camps</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/15">
              <CheckCircle2 className="h-4 w-4 text-pink-200 flex-shrink-0" />
              <span>Patient Assistance</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/15 col-span-2 sm:col-span-1">
              <CheckCircle2 className="h-4 w-4 text-pink-200 flex-shrink-0" />
              <span>100% Verified Impact</span>
            </div>
          </motion.div>

          {/* Call To Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4"
          >
            <Button
              onClick={onDonateClick}
              size="lg"
              className="bg-white text-pink-700 hover:bg-pink-50 hover:text-pink-800 font-bold px-8 py-6 rounded-2xl shadow-xl shadow-pink-900/20 text-base sm:text-lg transition-all duration-300 hover:scale-105"
            >
              <HeartPulse className="h-5 w-5 mr-2 text-rose-600 animate-bounce" />
              Donate Now
            </Button>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-pink-100/80 font-medium">
              <ShieldCheck className="h-4 w-4 text-green-300" />
              <span>Tax Exemption & Secure UPI Transfer</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column Graphic / Card */}
        <div className="lg:col-span-5 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative w-full max-w-sm sm:max-w-md bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl text-white space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30">
                  <Ribbon className="h-7 w-7 text-pink-200" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Why Your Support Matters</h3>
                  <p className="text-xs text-pink-200">Breast Cancer Fighting Mission</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-pink-400/30 text-[11px] font-semibold tracking-wider uppercase border border-pink-300/40">
                Action Today
              </span>
            </div>

            <div className="space-y-3 text-sm text-pink-100/90 leading-relaxed bg-black/10 rounded-2xl p-4 border border-white/10">
              <p className="font-medium text-white">
                Early detection increases 5-year breast cancer survival rates to over <strong className="text-yellow-300 font-bold">98%</strong>.
              </p>
              <p className="text-xs">
                Your donation directly sponsors diagnostic mammograms, awareness rallies in rural districts, and financial aid for underserved patients fighting cancer.
              </p>
            </div>

            <div className="pt-1 border-t border-white/15 flex items-center justify-between text-xs text-pink-200">
              <span>Transparent & Direct Relief</span>
              <button
                onClick={onDonateClick}
                className="inline-flex items-center gap-1 font-semibold text-white hover:underline cursor-pointer"
              >
                <span>Make an Impact</span>
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

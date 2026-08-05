'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  PieChart,
  HelpCircle,
  ChevronDown,
  Lock,
  Eye,
  FileText,
} from 'lucide-react'

const FAQ_ITEMS = [
  {
    question: 'Is my donation secure?',
    answer:
      'Yes, absolutely. All payments are routed via official bank UPI handles with multi-factor authentication. We do not store financial credentials or sensitive banking details.',
  },
  {
    question: 'Can I donate anonymously?',
    answer:
      'Yes. Simply check the "Donate Anonymously" option in the donation form. Your name will be hidden from the public supporters wall and marked as "Anonymous Supporter".',
  },
  {
    question: 'When will my payment be verified?',
    answer:
      'Our team manually cross-verifies every transaction ID and uploaded screenshot within 24 to 48 hours. Once verified, your status changes from Pending to Verified.',
  },
  {
    question: 'Can I upload proof later if I miss it?',
    answer:
      'Yes. If you close the page before attaching your screenshot, you can contact our support team with your unique Transaction ID or reference email to attach proof.',
  },
  {
    question: 'How is my donation used?',
    answer:
      '100% of public contributions directly fund free mammography screening camps, chemotherapy assistance, survivor education kits, and public awareness webinars.',
  },
  {
    question: 'Will I receive confirmation?',
    answer:
      'Yes, immediately upon submitting your transaction details, you receive an instant digital receipt on-screen with print and download support.',
  },
]

const FUND_ALLOCATION = [
  { label: 'Free Screening Camps', percentage: 40, color: 'bg-pink-500', border: 'border-pink-500' },
  { label: 'Patient Treatment Care', percentage: 30, color: 'bg-rose-500', border: 'border-rose-500' },
  { label: 'Educational Webinars', percentage: 20, color: 'bg-purple-600', border: 'border-purple-600' },
  { label: 'Awareness Outreach', percentage: 10, color: 'bg-amber-500', border: 'border-amber-500' },
]

export const TransparencyFaq: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <section className="space-y-12 mb-12">
      {/* Transparency Section */}
      <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-purple-700 rounded-3xl p-6 sm:p-10 text-white shadow-2xl space-y-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wider uppercase">
              <ShieldCheck className="h-4 w-4 text-green-300" />
              100% NGO Transparency Guarantee
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Where Your Donation Goes
            </h2>
            <p className="text-pink-100/90 text-xs sm:text-sm leading-relaxed">
              We ensure every rupee contributed is deployed with strict audit controls directly towards saving women&apos;s lives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center">
              <span className="block text-2xl font-extrabold text-white">100%</span>
              <span className="text-[11px] text-pink-200">Verified Relief</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center">
              <span className="block text-2xl font-extrabold text-yellow-300">24-48h</span>
              <span className="text-[11px] text-pink-200">Audit Window</span>
            </div>
          </div>
        </div>

        {/* Allocation Bar */}
        <div className="space-y-3 bg-black/15 p-5 rounded-2xl border border-white/15">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <PieChart className="h-4 w-4 text-yellow-300" />
            Fund Utilization Breakdown
          </h3>

          <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden flex">
            {FUND_ALLOCATION.map((item) => (
              <div
                key={item.label}
                style={{ width: `${item.percentage}%` }}
                className={`${item.color} h-full transition-all duration-500`}
                title={`${item.label}: ${item.percentage}%`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
            {FUND_ALLOCATION.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="font-semibold text-white/90">
                  {item.label} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Pillars of Trust */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/15 space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Lock className="h-4 w-4 text-pink-200" />
              <span>Secure Banking</span>
            </div>
            <p className="text-xs text-pink-100/80">
              Direct UPI transfers to verified organizational bank accounts with zero intermediary cut.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/15 space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Eye className="h-4 w-4 text-pink-200" />
              <span>Audit Trail</span>
            </div>
            <p className="text-xs text-pink-100/80">
              Every payment generates a unique transaction reference stored securely in our database.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/15 space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm">
              <FileText className="h-4 w-4 text-pink-200" />
              <span>Tax Exemption</span>
            </div>
            <p className="text-xs text-pink-100/80">
              Donations are eligible for tax deductions as per applicable government NGO regulations.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-pink-200 dark:border-pink-800 shadow-xl space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <HelpCircle className="h-7 w-7 text-pink-600 dark:text-pink-400" />
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Have questions about donating? Here is everything you need to know.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={faq.question}
                className="border border-pink-100 dark:border-pink-900/50 rounded-2xl overflow-hidden transition-all bg-pink-50/20 dark:bg-slate-800/40"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-slate-800 dark:text-white text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-pink-500 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-pink-100 dark:border-pink-900/40 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

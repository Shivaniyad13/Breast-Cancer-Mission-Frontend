
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HelpCircle,
  ChevronDown,
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

export const TransparencyFaq: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <section className="mb-8">
      {/* Frequently Asked Questions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-pink-200 dark:border-pink-800 shadow-md space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
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
                      <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-pink-100 dark:border-pink-900/40 pt-3">
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

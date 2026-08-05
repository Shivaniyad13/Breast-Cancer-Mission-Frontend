'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CheckCircle2,
  Ribbon,
  Printer,
  Home,
  RefreshCw,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface SuccessReceiptData {
  id: string
  transactionId: string
  amount: number
  currency?: string
  donorName: string
  donorEmail: string
  purpose?: string
  date: string
  status?: string
}

interface SuccessReceiptProps {
  receipt: SuccessReceiptData
  onDonateAgain: () => void
}

export const SuccessReceipt: React.FC<SuccessReceiptProps> = ({ receipt, onDonateAgain }) => {
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto my-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-pink-200 dark:border-pink-800 shadow-2xl space-y-8 relative overflow-hidden"
    >
      {/* Decorative Ribbon Accent */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600" />

      {/* Header Icon */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-pink-500/30"
        >
          <CheckCircle2 className="h-10 w-10 text-white" />
        </motion.div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Thank You for Saving Lives!
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Your contribution strengthens breast cancer early detection, patient care, and awareness campaigns across communities.
        </p>
      </div>

      {/* Verification Pending Badge */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3">
        <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
        <div>
          <p className="font-bold">Payment Verification Pending</p>
          <p className="text-xs text-amber-700 dark:text-amber-300/90 mt-0.5">
            Your transaction screenshot has been received. Our team will verify the payment within <strong className="font-bold">24-48 hours</strong> and update your status on the supporters wall.
          </p>
        </div>
      </div>

      {/* Printable Receipt Card */}
      <div
        ref={receiptRef}
        className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-4 font-sans print:border-none print:shadow-none"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Ribbon className="h-5 w-5 text-pink-600" />
            <span className="font-bold text-slate-800 dark:text-white text-sm">
              Donation Receipt
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 font-bold text-xs">
            Official Acknowledgment
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Donor Name</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{receipt.donorName}</span>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Donor Email</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
              {receipt.donorEmail}
            </span>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Amount Donated</span>
            <span className="font-extrabold text-rose-600 dark:text-rose-400 text-base">
              ₹{receipt.amount.toLocaleString('en-IN')} {receipt.currency || 'INR'}
            </span>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Purpose</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {receipt.purpose || 'Breast Cancer Awareness'}
            </span>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Reference ID</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
              {receipt.id}
            </span>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Transaction ID</span>
            <span className="font-mono font-bold text-pink-600 dark:text-pink-400 text-xs">
              {receipt.transactionId}
            </span>
          </div>

          <div className="col-span-2">
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Date &amp; Time</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {new Date(receipt.date).toLocaleString('en-IN', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 print:hidden">
        <Button
          type="button"
          onClick={handlePrint}
          variant="outline"
          className="flex-1 border-pink-300 text-pink-700 dark:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-900/30"
        >
          <Printer className="h-4 w-4 mr-2" />
          Download / Print Receipt
        </Button>

        <Button
          type="button"
          onClick={onDonateAgain}
          className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Make Another Donation
        </Button>
      </div>

      <div className="text-center pt-2 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium hover:underline transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </motion.div>
  )
}

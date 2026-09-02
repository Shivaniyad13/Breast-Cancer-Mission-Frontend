'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  HeartPulse,
  Shield,
  User,
  Mail,
  Phone,
  Building2,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Coins,
  HeartHandshake,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface DonationFormData {
  name: string
  email: string
  phone: string
  organization: string
  amount: number
  purpose: string
  message: string
  isAnonymous: boolean
}

interface DonationFormProps {
  initialValues?: Partial<DonationFormData>
  onSubmitForm: (data: DonationFormData) => void
  isSubmitting?: boolean
  error?: string | null
}

const PRESET_AMOUNTS = [250, 500, 1000, 2500, 5000, 10000]

export const DONATION_PURPOSES = [
  'Breast Cancer Awareness',
  'Patient Support',
  'Medical Treatment',
  'Free Screening Camps',
  'Educational Webinars',
  'Research',
  'Community Outreach',
  'General Donation',
]

export const DonationForm: React.FC<DonationFormProps> = ({
  initialValues,
  onSubmitForm,
  isSubmitting = false,
  error,
}) => {
  const initialAmt = initialValues?.amount || 1000
  const isInitialCustom = !PRESET_AMOUNTS.includes(initialAmt)

  const [formData, setFormData] = useState<DonationFormData>({
    name: initialValues?.name || '',
    email: initialValues?.email || '',
    phone: initialValues?.phone || '',
    organization: initialValues?.organization || '',
    amount: initialAmt,
    purpose: initialValues?.purpose || 'Breast Cancer Awareness',
    message: initialValues?.message || '',
    isAnonymous: initialValues?.isAnonymous || false,
  })

  const [isCustom, setIsCustom] = useState<boolean>(isInitialCustom)
  const [customInput, setCustomInput] = useState<string>(isInitialCustom ? initialAmt.toString() : '')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({
        ...prev,
        name: initialValues.name ?? prev.name,
        email: initialValues.email ?? prev.email,
        phone: initialValues.phone ?? prev.phone,
        organization: initialValues.organization ?? prev.organization,
      }))
    }
  }, [initialValues])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.name.trim()) {
      setFormError('Please enter your full name.')
      return
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Please enter a valid email address.')
      return
    }

    if (!formData.amount || formData.amount <= 0) {
      setFormError('Please select or enter a valid donation amount as per your strength.')
      return
    }

    onSubmitForm(formData)
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 border border-pink-200 dark:border-pink-800 shadow-xl relative overflow-hidden">
      {/* Decorative top ribbon gradient line */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-pink-600 dark:text-pink-400 animate-pulse" />
            Make Your Contribution
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fill in your details below to initiate your secure donation.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-pink-500" />
          Direct Relief
        </span>
      </div>

      {(error || formError) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-medium flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping flex-shrink-0" />
          <span>{error || formError}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Donation Amount Selection */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
              1. Select Donation Amount (₹) <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-pink-600 dark:text-pink-400 font-semibold flex items-center gap-1">
              <HeartHandshake className="h-3.5 w-3.5" />
              Donate any amount as per your strength
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
            {PRESET_AMOUNTS.map((amt) => {
              const isSelected = !isCustom && formData.amount === amt
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setIsCustom(false)
                    setCustomInput('')
                    setFormData({ ...formData, amount: amt })
                  }}
                  className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 border cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white border-pink-600 shadow-md scale-105'
                      : 'bg-pink-50/50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-pink-200 dark:border-slate-700 hover:border-pink-400 hover:bg-pink-100/50 dark:hover:bg-slate-700'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              )
            })}

            {/* Custom Amount Tile */}
            <button
              type="button"
              onClick={() => {
                setIsCustom(true)
                if (!customInput && formData.amount) {
                  setCustomInput(formData.amount.toString())
                }
              }}
              className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 border cursor-pointer flex items-center justify-center gap-1 ${
                isCustom
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white border-pink-600 shadow-md scale-105'
                  : 'bg-pink-100/70 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-800 hover:bg-pink-200/70'
              }`}
            >
              <Coins className="h-3.5 w-3.5" />
              <span>Custom</span>
            </button>
          </div>

          {/* Custom Amount Input Field */}
          <div
            className={`p-4 rounded-2xl border transition-all duration-300 ${
              isCustom
                ? 'bg-gradient-to-r from-pink-50/90 via-rose-50/50 to-purple-50/90 dark:from-pink-950/40 dark:via-rose-950/30 dark:to-purple-950/40 border-pink-400 dark:border-pink-600 shadow-md ring-2 ring-pink-400/20'
                : 'bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Coins className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                <span>Custom Amount (Enter as per your capability / strength)</span>
              </label>
              {isCustom && (
                <span className="text-[11px] font-semibold text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/60 px-2 py-0.5 rounded-full border border-pink-300 dark:border-pink-700">
                  Custom Mode Active
                </span>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-600 dark:text-pink-400 font-bold text-xl">
                ₹
              </span>
              <input
                type="number"
                min="1"
                step="any"
                value={isCustom ? customInput : (PRESET_AMOUNTS.includes(formData.amount) ? '' : formData.amount || '')}
                onFocus={() => setIsCustom(true)}
                onChange={(e) => {
                  setIsCustom(true)
                  const val = e.target.value
                  setCustomInput(val)
                  const num = parseFloat(val)
                  setFormData({ ...formData, amount: isNaN(num) ? 0 : num })
                }}
                placeholder="Enter custom amount in INR (e.g. 100, 350, 750, 1500, 20000)"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-pink-300 dark:border-pink-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all shadow-inner"
              />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-pink-500 flex-shrink-0" />
              <span>
                {isCustom && formData.amount > 0
                  ? `Your custom contribution of ₹${formData.amount.toLocaleString('en-IN')} will directly support life-saving breast cancer awareness & care!`
                  : 'Contribute whatever amount you wish. Every single rupee helps save lives!'}
              </span>
            </p>
          </div>
        </div>

        {/* Step 2: Purpose Selection */}
        <div>
          <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
            2. Purpose of Donation <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all cursor-pointer"
          >
            {DONATION_PURPOSES.map((purpose) => (
              <option key={purpose} value={purpose}>
                {purpose}
              </option>
            ))}
          </select>
        </div>

        {/* Step 3: Donor Details */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            3. Donor Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Priya Sharma"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. priya@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +91 9876543210"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Organization / Company (Optional)
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g. Apex Health Corp"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Message of Support / Dedication (Optional)
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <textarea
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Share a message of encouragement for breast cancer patients and survivors..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Anonymous Checkbox */}
          <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-pink-50/70 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-800/60">
            <input
              type="checkbox"
              id="anonymousCheck"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
              className="h-4 w-4 text-pink-600 border-slate-300 rounded focus:ring-pink-500 cursor-pointer"
            />
            <label
              htmlFor="anonymousCheck"
              className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-2 select-none"
            >
              <Shield className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              <span>Make my donation anonymous on the public supporters list</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || formData.amount <= 0}
          className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-6 rounded-2xl shadow-xl shadow-pink-500/25 text-base sm:text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
        >
          <HeartPulse className="h-5 w-5 text-white animate-bounce" />
          <span>Proceed to UPI Payment (₹{formData.amount.toLocaleString('en-IN')})</span>
          <ArrowRight className="h-5 w-5 text-white ml-1" />
        </Button>
      </form>
    </div>
  )
}

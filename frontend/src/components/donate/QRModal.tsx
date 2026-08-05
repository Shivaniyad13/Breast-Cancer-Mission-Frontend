'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from 'qrcode'
import {
  X,
  Copy,
  Check,
  Smartphone,
  Monitor,
  ShieldCheck,
  Loader2,
  Ribbon,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScreenshotUpload } from './ScreenshotUpload'

interface QRModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  purpose: string
  donorName?: string
  donorEmail?: string
  donorPhone?: string
  organization?: string
  message?: string
  isAnonymous?: boolean
  transactionId: string
  onFinalSubmit: (screenshotUrl: string) => Promise<void>
}

export const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  amount,
  purpose,
  transactionId,
  onFinalSubmit,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const [copiedUpi, setCopiedUpi] = useState(false)
  const [copiedTxn, setCopiedTxn] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Read environment variables with fallback
  const rawUpiId = process.env.NEXT_PUBLIC_UPI_ID || '8700805003@upi'
  const rawPayeeName = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || 'KHUSHI CENTRE FOR REHABIITATION AND RESE'

  // Clean parameter values for Official SBI / NPCI URI Format
  const cleanUpiId = rawUpiId.trim()
  const cleanPayeeName = rawPayeeName.trim()
  const formattedAmount = amount && amount > 0 ? Number(amount).toFixed(2) : ''
  const cleanTxnId = (transactionId || `TXNBC${Date.now()}`).replace(/[^a-zA-Z0-9]/g, '')
  const cleanNote = purpose ? `Donation ${purpose.replace(/[^a-zA-Z0-9 ]/g, '')}`.substring(0, 30).trim() : 'Donation'

  // Build NPCI Compliant UPI URI (Mandatory: raw '@' for pa parameter, '%20' for spaces)
  let upiUrl = `upi://pay?pa=${cleanUpiId}&pn=${encodeURIComponent(cleanPayeeName)}`
  if (formattedAmount) {
    upiUrl += `&am=${formattedAmount}`
  }
  upiUrl += `&cu=INR`
  if (cleanNote) {
    upiUrl += `&tn=${encodeURIComponent(cleanNote)}`
  }

  // Log complete debug info whenever modal opens or values update
  useEffect(() => {
    if (!isOpen) return
    console.log('=============== 🎀 NPCI COMPLIANT UPI PAYLOAD LOGS ===============')
    console.log('1. NEXT_PUBLIC_UPI_ID (env):', process.env.NEXT_PUBLIC_UPI_ID)
    console.log('2. NEXT_PUBLIC_UPI_PAYEE_NAME (env):', process.env.NEXT_PUBLIC_UPI_PAYEE_NAME)
    console.log('3. Payee VPA (pa - raw @):', cleanUpiId)
    console.log('4. Payee Name (pn - %20 space):', cleanPayeeName)
    console.log('5. Amount (am):', formattedAmount)
    console.log('6. Currency (cu):', 'INR')
    console.log('7. Note (tn):', cleanNote)
    console.log('8. Reference ID (internal):', cleanTxnId)
    console.log('9. COMPLETE GENERATED UPI URI:', upiUrl)
    console.log('===================================================================')
  }, [isOpen, upiUrl, cleanUpiId, cleanPayeeName, formattedAmount, cleanNote, cleanTxnId])

  // Detect Mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent =
        typeof window !== 'undefined'
          ? window.navigator.userAgent || window.navigator.vendor || (window as unknown as { opera?: string }).opera || ''
          : ''
      const mobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
      )
      setIsMobile(mobile)
    }
    checkMobile()
  }, [])

  // Generate QR code Data URL on client
  useEffect(() => {
    if (!isOpen) return
    QRCode.toDataURL(upiUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#be185d', // Deep pink
        light: '#ffffff',
      },
    })
      .then((url: string) => setQrCodeDataUrl(url))
      .catch((err: unknown) => {
        console.error('Failed to generate QR code:', err)
        // Fallback to QR server API
        setQrCodeDataUrl(
          `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`
        )
      })
  }, [isOpen, upiUrl])

  const copyToClipboard = (text: string, type: 'upi' | 'txn') => {
    navigator.clipboard.writeText(text)
    if (type === 'upi') {
      setCopiedUpi(true)
      setTimeout(() => setCopiedUpi(false), 2000)
    } else {
      setCopiedTxn(true)
      setTimeout(() => setCopiedTxn(false), 2000)
    }
  }

  const handleOpenUpiApp = () => {
    window.location.href = upiUrl
  }

  const handleSubmit = async () => {
    if (!screenshotUrl) {
      setSubmitError('Please upload your payment screenshot before submitting.')
      return
    }
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      await onFinalSubmit(screenshotUrl)
    } catch (err: unknown) {
      console.error('Final submit error:', err)
      const errorMsg = err instanceof Error ? err.message : 'Failed to complete donation. Please try again.'
      setSubmitError(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-pink-200 dark:border-pink-800 shadow-2xl my-8 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-pink-100 dark:border-pink-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md">
                <Ribbon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">
                  UPI Payment & Verification
                </h3>
                <p className="text-xs text-pink-600 dark:text-pink-400 font-medium">
                  {purpose}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6 pt-4 max-h-[75vh] overflow-y-auto pr-1">
            {/* Amount Banner */}
            <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 dark:from-pink-950/40 dark:via-rose-950/40 dark:to-purple-950/40 rounded-2xl p-4 border border-pink-200 dark:border-pink-800/60 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  Donation Amount
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                  ₹{amount.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  Payee Account
                </p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {cleanPayeeName}
                </p>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center space-y-4">
              <div className="relative w-56 h-56 bg-white p-3 rounded-2xl shadow-md border border-pink-200 flex items-center justify-center">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="UPI Payment QR Code"
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <Loader2 className="h-8 w-8 text-pink-600 animate-spin" />
                )}
              </div>

              {/* Dynamic QR Instructions */}
              <div className="text-center space-y-1">
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5">
                  {isMobile ? (
                    <>
                      <Smartphone className="h-4 w-4 text-pink-500" />
                      Scan QR or Tap Below to Open Installed UPI App
                    </>
                  ) : (
                    <>
                      <Monitor className="h-4 w-4 text-pink-500" />
                      Scan with GPay, PhonePe, Paytm, BHIM, or any UPI App
                    </>
                  )}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Transaction will be registered directly under your reference ID.
                </p>
              </div>

              {/* Mobile Deep Link CTA */}
              {isMobile && (
                <Button
                  onClick={handleOpenUpiApp}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm"
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Open Mobile UPI App Now</span>
                </Button>
              )}
            </div>

            {/* UPI & Transaction Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium">UPI ID</span>
                <div className="flex items-center justify-between">
                  <code className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm truncate">
                    {cleanUpiId}
                  </code>
                  <button
                    onClick={() => copyToClipboard(cleanUpiId, 'upi')}
                    className="p-1 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/40 rounded transition-colors"
                  >
                    {copiedUpi ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Transaction ID</span>
                <div className="flex items-center justify-between">
                  <code className="font-mono font-bold text-pink-600 dark:text-pink-400 text-xs truncate">
                    {transactionId}
                  </code>
                  <button
                    onClick={() => copyToClipboard(transactionId, 'txn')}
                    className="p-1 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/40 rounded transition-colors"
                  >
                    {copiedTxn ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Screenshot Upload Requirement */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <ScreenshotUpload
                onUploadSuccess={(url) => {
                  setScreenshotUrl(url)
                  setSubmitError(null)
                }}
                onRemove={() => setScreenshotUrl(null)}
                existingUrl={screenshotUrl}
              />
            </div>

            {submitError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="order-2 sm:order-1 flex-1 border-slate-300 dark:border-slate-700"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !screenshotUrl}
                className="order-1 sm:order-2 flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying &amp; Saving...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>I&apos;ve Paid &amp; Final Submit</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

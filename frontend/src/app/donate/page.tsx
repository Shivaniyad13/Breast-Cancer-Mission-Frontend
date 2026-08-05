'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import {
  createDonationAction,
  getPublicDonationsAction,
  getDonationStatsAction,
} from '@/app/actions/donations'
import { HeroSection } from '@/components/donate/HeroSection'
import { LiveStats } from '@/components/donate/LiveStats'
import { DonationForm, DonationFormData } from '@/components/donate/DonationForm'
import { QRModal } from '@/components/donate/QRModal'
import { SuccessReceipt, SuccessReceiptData } from '@/components/donate/SuccessReceipt'
import { SupportersWall, SupporterItem } from '@/components/donate/SupportersWall'
import { TransparencyFaq } from '@/components/donate/TransparencyFaq'
import { Loader2 } from 'lucide-react'
import { DonationStatus } from '@prisma/client'


export default function DonatePage() {
  const { user } = useAuth()
  const formRef = useRef<HTMLDivElement | null>(null)

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Record<string, number>>({})
  const [supporters, setSupporters] = useState<SupporterItem[]>([])

  // Modal & Form state
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [activeFormData, setActiveFormData] = useState<DonationFormData | null>(null)
  const [currentTxnId, setCurrentTxnId] = useState<string>('')
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Success view state
  const [successReceipt, setSuccessReceipt] = useState<SuccessReceiptData | null>(null)

  // Fetch initial backend stats & supporters
  const loadData = async () => {
    try {
      const [statsRes, supportersRes] = await Promise.all([
        getDonationStatsAction(),
        getPublicDonationsAction({ limit: 100 }),
      ])

      if (statsRes.success) {
        setStats(statsRes as unknown as Record<string, number>)
      }

      if (supportersRes.success && Array.isArray(supportersRes.donations)) {
        setSupporters(supportersRes.donations as unknown as SupporterItem[])
      }
    } catch (err) {
      console.error('Error fetching donation data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Called when user clicks "Proceed to UPI Payment" on DonationForm
  const handleInitiatePayment = (formData: DonationFormData) => {
    setActiveFormData(formData)
    setSubmitError(null)

    // Generate unique alphanumeric NPCI-compliant transaction ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const txnId = `TXNBC${Date.now()}${randomSuffix}`
    setCurrentTxnId(txnId)

    setIsQrModalOpen(true)
  }

  // Called when donor submits final form inside QRModal with uploaded screenshot proof
  const handleFinalSubmit = async (screenshotUrl: string) => {
    if (!activeFormData || !currentTxnId) return

    console.log('Submitting donation with screenshot proof:', screenshotUrl)
    setSubmitError(null)

    const payload = {
      amount: activeFormData.amount,
      donorName: activeFormData.isAnonymous ? 'Anonymous' : activeFormData.name,
      donorEmail: activeFormData.email,
      donorPhone: activeFormData.phone || null,
      message: activeFormData.message || null,
      isAnonymous: activeFormData.isAnonymous,
      paymentGatewayId: currentTxnId,
      currency: 'INR',
      status: DonationStatus.PENDING,
    }

    const result = await createDonationAction(payload)

    if (!result.success || !result.donation) {
      throw new Error(result.error || 'Failed to submit donation to server.')
    }

    // Prepare success receipt data
    const newReceipt: SuccessReceiptData = {
      id: result.donation.id || currentTxnId,
      transactionId: currentTxnId,
      amount: activeFormData.amount,
      currency: 'INR',
      donorName: activeFormData.isAnonymous ? 'Anonymous Supporter' : activeFormData.name,
      donorEmail: activeFormData.email,
      purpose: activeFormData.purpose,
      date: new Date().toISOString(),
      status: 'PENDING',
    }

    setSuccessReceipt(newReceipt)
    setIsQrModalOpen(false)
    setActiveFormData(null)

    // Refresh supporters & stats
    loadData()
  }

  const handleDonateAgain = () => {
    setSuccessReceipt(null)
    setActiveFormData(null)
    setCurrentTxnId('')
    scrollToForm()
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50/50 dark:bg-slate-900">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 shadow-xl flex flex-col items-center space-y-3">
            <Loader2 className="h-10 w-10 text-pink-600 animate-spin" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Loading Secure Donation Portal...
            </p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-pink-50/40 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 selection:bg-pink-500 selection:text-white">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Hero Section */}
          <HeroSection onDonateClick={scrollToForm} />

          {/* Live Statistics Section */}
          <LiveStats stats={stats} uniqueDonorsCount={supporters.length} />

          {/* Main Action Area: Success Receipt OR Donation Form */}
          <div ref={formRef} className="scroll-mt-8">
            {successReceipt ? (
              <SuccessReceipt receipt={successReceipt} onDonateAgain={handleDonateAgain} />
            ) : (
              <div className="max-w-3xl mx-auto">
                <DonationForm
                  initialValues={{
                    name: user?.name || '',
                    email: user?.email || '',
                  }}
                  onSubmitForm={handleInitiatePayment}
                  error={submitError}
                />
              </div>
            )}
          </div>

          {/* Supporters Wall Section */}
          <SupportersWall supporters={supporters} isLoading={loading} />

          {/* Transparency & FAQs Section */}
          <TransparencyFaq />
        </div>

        {/* Glassmorphism Payment QR Modal */}
        {activeFormData && (
          <QRModal
            isOpen={isQrModalOpen}
            onClose={() => setIsQrModalOpen(false)}
            amount={activeFormData.amount}
            purpose={activeFormData.purpose}
            donorName={activeFormData.name}
            donorEmail={activeFormData.email}
            donorPhone={activeFormData.phone}
            organization={activeFormData.organization}
            message={activeFormData.message}
            isAnonymous={activeFormData.isAnonymous}
            transactionId={currentTxnId}
            onFinalSubmit={handleFinalSubmit}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
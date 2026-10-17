'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import {
  createDonationAction,
  getPublicDonationsAction,
  getDonationStatsAction,
  createCashfreeDonationOrderAction,
  verifyCashfreePaymentAction,
} from '@/app/actions/donations'
import { load } from '@cashfreepayments/cashfree-js'
import { HeroSection } from '@/components/donate/HeroSection'
import { LiveStats } from '@/components/donate/LiveStats'
import { DonationForm, DonationFormData } from '@/components/donate/DonationForm'
import { QRModal } from '@/components/donate/QRModal'
import { SuccessReceipt, SuccessReceiptData } from '@/components/donate/SuccessReceipt'
import { SupportersWall, SupporterItem } from '@/components/donate/SupportersWall'
import { TransparencyFaq } from '@/components/donate/TransparencyFaq'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { DonationStatus } from "@/types/enums"


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
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Success view state
  const [successReceipt, setSuccessReceipt] = useState<SuccessReceiptData | null>(null)

  // Supporters Wall display state
  const [showAllSupporters, setShowAllSupporters] = useState(false)
  const INITIAL_SUPPORTERS_COUNT = 3

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

    // Handle return from Cashfree if redirected with order_id in query
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const orderId = params.get('order_id')
      if (orderId) {
        verifyCashfreePaymentAction(orderId)
          .then((res) => {
            if (res.success && (res.verified || res.status === 'SUCCESSFUL')) {
              const donation = res.donation
              setSuccessReceipt({
                id: donation?.id || orderId,
                transactionId: orderId,
                amount: Number(donation?.amount || 0),
                currency: donation?.currency || 'INR',
                donorName: donation?.donorName || 'Generous Supporter',
                donorEmail: donation?.donorEmail || '',
                purpose: donation?.campaign?.title || 'Breast Cancer Care',
                date: donation?.createdAt || new Date().toISOString(),
                status: 'SUCCESSFUL',
              })
              loadData()
              window.history.replaceState({}, '', window.location.pathname)
            }
          })
          .catch((err) => console.error('Redirect verification error:', err))
      }
    }
  }, [])

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleInitiatePayment = async (
    formData: DonationFormData,
    method: 'cashfree' | 'upi' = 'cashfree'
  ) => {
    setActiveFormData(formData)
    setSubmitError(null)

    if (method === 'upi') {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000)
      const txnId = `TXNBC${Date.now()}${randomSuffix}`
      setCurrentTxnId(txnId)
      setIsQrModalOpen(true)
      return
    }

    // Cashfree Checkout Flow
    setIsSubmitting(true)
    try {
      const orderRes = await createCashfreeDonationOrderAction({
        amount: formData.amount,
        donorName: formData.isAnonymous ? 'Anonymous' : formData.name,
        donorEmail: formData.email,
        donorPhone: formData.phone || undefined,
        purpose: formData.purpose,
        message: formData.message || undefined,
        isAnonymous: formData.isAnonymous,
      })

      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.error || 'Failed to initialize Cashfree payment session.')
      }

      const { paymentSessionId, orderId } = orderRes.data

      const mode =
        (process.env.NEXT_PUBLIC_CASHFREE_MODE as 'production' | 'sandbox') || 'production'

      const cashfree = await load({ mode })
      if (!cashfree) {
        throw new Error('Cashfree SDK could not be loaded. Please check your internet connection.')
      }

      await cashfree.checkout({
        paymentSessionId,
        redirectTarget: '_modal',
      })

      // When modal finishes or closes, verify status with server
      const verifyRes = await verifyCashfreePaymentAction(orderId)

      if (verifyRes.success && (verifyRes.verified || verifyRes.status === 'SUCCESSFUL')) {
        const newReceipt: SuccessReceiptData = {
          id: verifyRes.donation?.id || orderId,
          transactionId: orderId,
          amount: formData.amount,
          currency: 'INR',
          donorName: formData.isAnonymous ? 'Anonymous Supporter' : formData.name,
          donorEmail: formData.email,
          purpose: formData.purpose,
          date: new Date().toISOString(),
          status: 'SUCCESSFUL',
        }
        setSuccessReceipt(newReceipt)
        setActiveFormData(null)
        loadData()
      } else {
        console.log('[Cashfree] Modal closed or payment pending verification:', verifyRes)
      }
    } catch (err: any) {
      console.error('Cashfree payment error:', err)
      setSubmitError(err?.message || 'Payment could not be processed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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

    loadData()
  }

  const handleDonateAgain = () => {
    setSuccessReceipt(null)
    setActiveFormData(null)
    setCurrentTxnId('')
    scrollToForm()
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 selection:bg-pink-500 selection:text-white">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Hero Section */}
          <HeroSection onDonateClick={scrollToForm} />

          {/* Live Statistics Section */}
          <LiveStats stats={stats} uniqueDonorsCount={supporters.length} />

          {/* Main Action Area */}
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
                  isSubmitting={isSubmitting}
                  error={submitError}
                />
              </div>
            )}
          </div>

          {/* Supporters Wall Section */}
          <div className="space-y-6">
            <SupportersWall
              supporters={
                showAllSupporters
                  ? supporters
                  : supporters.slice(0, INITIAL_SUPPORTERS_COUNT)
              }
              isLoading={loading}
            />

            {!loading && supporters.length > INITIAL_SUPPORTERS_COUNT && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowAllSupporters((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-pink-300 text-pink-700 font-bold text-sm shadow-md hover:bg-pink-50 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  {showAllSupporters ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      See More ({supporters.length - INITIAL_SUPPORTERS_COUNT} more donors)
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Transparency & FAQs Section */}
          <TransparencyFaq />
        </div>

        {/* QR Modal */}
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
    )
  }
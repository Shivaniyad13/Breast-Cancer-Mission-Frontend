'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Ribbon,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  HeartPulse,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type PopupImage = {
  src: string
  alt: string
}

function isPopupImageList(value: unknown): value is { images: PopupImage[] } {
  if (!value || typeof value !== 'object' || !('images' in value)) return false
  const images = value.images
  return (
    Array.isArray(images) &&
    images.every(
      (image) =>
        image &&
        typeof image === 'object' &&
        'src' in image &&
        typeof image.src === 'string' &&
        'alt' in image &&
        typeof image.alt === 'string'
    )
  )
}

export default function SelfExamReminderModal() {
  const pathname = usePathname()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [popupImages, setPopupImages] = useState<PopupImage[]>([])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)

  // 1. Check Route Exclusions
  const isExcludedPage = React.useMemo(() => {
    if (!pathname) return false
    const lowerPath = pathname.toLowerCase()
    return (
      lowerPath.includes('bse-guide') ||
      lowerPath.includes('self-exam') ||
      lowerPath.includes('self-examination') ||
      lowerPath.startsWith('/login') ||
      lowerPath.startsWith('/register') ||
      lowerPath.startsWith('/signup') ||
      lowerPath.startsWith('/admin') ||
      lowerPath.startsWith('/dashboard')
    )
  }, [pathname])

  // 2. Trigger Popup 6 seconds after opening site (once per browser session)
  useEffect(() => {
    if (isExcludedPage) return

    // Check if user has already seen or closed the popup in this browser session
    const hasSeen = sessionStorage.getItem('hasSeenSelfExamReminder')
    if (hasSeen === 'true') return

    // Show popup 6 seconds after page load
    const timer = setTimeout(() => {
      // Re-verify session storage in case another tab or action set it
      if (sessionStorage.getItem('hasSeenSelfExamReminder') !== 'true') {
        setIsVisible(true)
      }
    }, 6000)

    return () => clearTimeout(timer)
  }, [isExcludedPage])

  useEffect(() => {
    if (isExcludedPage) return

    const controller = new AbortController()

    const loadPopupImages = async () => {
      try {
        const response = await fetch('/api/popup-images', {
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Popup image request failed with status ${response.status}`)
        }

        const data: unknown = await response.json()
        if (!isPopupImageList(data)) {
          throw new Error('Popup image response has an invalid format')
        }

        setPopupImages(data.images)
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Failed to load self-examination popup images:', error)
        }
      }
    }

    void loadPopupImages()
    return () => controller.abort()
  }, [isExcludedPage])

  useEffect(() => {
    if (!isVisible || popupImages.length < 2) return

    const timer = setInterval(() => {
      setActiveImageIndex((index) => (index + 1) % popupImages.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isVisible, popupImages.length])

  // 3. Mark session as seen & close modal
  const handleClose = () => {
    setIsVisible(false)
    sessionStorage.setItem('hasSeenSelfExamReminder', 'true')
  }

  // 4. Navigate to Self Examination page & mark session as seen
  const handleStartExam = () => {
    handleClose()
    router.push('/learn/bse-guide')
  }

  // 5. Accessible Keyboard listener (ESC key closes modal) & Focus Management
  useEffect(() => {
    if (!isVisible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Focus modal container for screen reader / keyboard accessibility
    if (modalRef.current) {
      modalRef.current.focus()
    }

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isVisible])

  if (isExcludedPage || !isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/65 backdrop-blur-md"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="self-exam-modal-headline"
          aria-describedby="self-exam-modal-description"
        >
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            initial={{ scale: 0.9, y: 25, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 25, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative h-[min(90vh,800px)] w-full max-w-5xl overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-pink-200/90 dark:border-pink-900/60 shadow-lg shadow-pink-500/20 outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Accent Gradient Line */}
            <div className="h-2 w-full bg-pink-600" />

            <div
              className={`grid h-[calc(100%-0.5rem)] min-w-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden ${
                popupImages.length
                  ? 'md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:grid-rows-1'
                  : 'md:grid-cols-1 md:grid-rows-1'
              }`}
            >
              {popupImages.length > 0 && (
                <div className="relative aspect-video w-full min-w-0 bg-[#fff9f3] md:aspect-auto md:min-h-0">
                  <Image
                    key={popupImages[activeImageIndex].src}
                    src={popupImages[activeImageIndex].src}
                    alt={popupImages[activeImageIndex].alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-contain"
                  />
                  {popupImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous popup image"
                        onClick={() =>
                          setActiveImageIndex(
                            (index) => (index - 1 + popupImages.length) % popupImages.length
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-800 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next popup image"
                        onClick={() =>
                          setActiveImageIndex((index) => (index + 1) % popupImages.length)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-800 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className="relative min-h-0 min-w-0 overflow-y-auto overflow-x-hidden p-5 sm:p-6">
                {/* Decorative Ambient Radial Glow */}
                <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-pink-400/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-rose-400/15 blur-3xl" />

                {/* Top Right Close Button */}
                <button
                  onClick={handleClose}
                  aria-label="Close self examination reminder"
                  className="absolute top-4 right-4 z-10 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-pink-100/60 dark:hover:bg-slate-800 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="relative z-[1] space-y-5 sm:space-y-6">
              {/* Header Icon & Title */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-600 flex items-center justify-center text-white shadow-md shadow-pink-500/30 ring-4 ring-pink-100 dark:ring-pink-950/60 flex-shrink-0">
                    <Ribbon className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 text-xs font-bold border border-pink-200 dark:border-pink-800">
                    <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                    Health Awareness Initiative
                  </span>
                </div>

                <div>
                  <h2
                    id="self-exam-modal-headline"
                    className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight"
                  >
                    🎀 Early Detection Saves Lives
                  </h2>
                  <p
                    id="self-exam-modal-description"
                    className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mt-2"
                  >
                    Take our FREE Breast Self-Examination today. It only takes a few minutes and may help you recognize early warning signs.
                  </p>
                </div>
              </div>

              {/* Highlights Feature Badges */}
              <div className="grid grid-cols-3 gap-2 py-1">
                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-pink-50/70 dark:bg-slate-800/60 border border-pink-100 dark:border-slate-700/60 text-center">
                  <Clock className="h-4 w-4 text-pink-600 dark:text-pink-400 mb-1" />
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">3-5 Mins</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-pink-50/70 dark:bg-slate-800/60 border border-pink-100 dark:border-slate-700/60 text-center">
                  <CheckCircle2 className="h-4 w-4 text-pink-600 dark:text-pink-400 mb-1" />
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">100% Free</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-pink-50/70 dark:bg-slate-800/60 border border-pink-100 dark:border-slate-700/60 text-center">
                  <HeartPulse className="h-4 w-4 text-pink-600 dark:text-pink-400 mb-1" />
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Private Guide</span>
                </div>
              </div>

              {/* Disclaimer Box */}
              <div className="bg-gradient-to-r from-pink-50/90 to-rose-50/90 dark:from-pink-950/30 dark:to-rose-950/30 border border-pink-200/80 dark:border-pink-800/50 rounded-2xl p-4 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="font-bold text-pink-900 dark:text-pink-200 block mb-0.5">Medical Disclaimer</strong>
                  This self-assessment is for awareness only and is NOT a medical diagnosis. If you notice any unusual symptoms, please consult a qualified healthcare professional immediately.
                </p>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={handleStartExam}
                  className="order-1 sm:order-2 flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 px-5 rounded-2xl shadow-lg shadow-pink-600/30 hover:shadow-pink-600/40 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer "
                >
                  <span>Start Free Self Examination</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="order-2 sm:order-1 sm:w-auto border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold py-3.5 px-5 rounded-2xl cursor-pointer "
                >
                  Maybe Later
                </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

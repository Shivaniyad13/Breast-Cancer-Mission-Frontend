'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Heart,
  Users,
  Award,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  DollarSign,
  User,
  Building2,
  Loader2,
  Sparkles,
  Crown,
  HandHeart,
  Gift,
  Target,
  QrCode,
  Scan,
  X,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Mail,
  ArrowRight,
  Ribbon,
  HeartHandshake,
  Info,
  ChevronLeft,
  ChevronRight,
  Lock,
  Globe,
  Plus,
  Minus,
  FileText,
  Medal,
  Gem,
  Download,
  ShieldCheck,
  Stethoscope,
  CalendarDays,
  UsersRound,
  Microscope,
  BookOpen,
  Ambulance,
  Pill,
  Brain,
  BadgeCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'

// ---------- Types ----------
interface Supporter {
  id: string
  name: string
  organization?: string
  amount: number
  message?: string
  is_anonymous: boolean
  created_at: string
  user_id?: string
  user?: {
    id: string
    name: string
    email: string
    image?: string
  }
}

interface SupportFormData {
  name: string
  email: string
  organization: string
  amount: number
  message: string
  is_anonymous: boolean
}

interface Testimonial {
  name: string
  role: string
  message: string
  rating: number
  image: string
}

interface FAQItem {
  question: string
  answer: string
}

// ---------- Presets ----------
const presetAmounts = [100, 500, 1000, 2500, 5000, 10000]

export default function SupportUsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [supporters, setSupporters] = useState<Supporter[]>([])
  const [stats, setStats] = useState({
    total_donations: 0,
    total_amount: 0,
    top_donation: 0,
    average_donation: 0,
    recent_donations: 0,
  })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const formRef = useRef<HTMLDivElement>(null)

  // Scanner states
  const [showScanner, setShowScanner] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentMessage, setPaymentMessage] = useState('')
  const [qrAmount, setQrAmount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)

  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalSuccessMessage, setModalSuccessMessage] = useState('')

  const [paymentInitiated, setPaymentInitiated] = useState(false)
  const [pendingTxId, setPendingTxId] = useState<string | null>(null)
  const [donationCompleted, setDonationCompleted] = useState(false)

  const [formData, setFormData] = useState<SupportFormData>({
    name: user?.name || '',
    email: user?.email || '',
    organization: '',
    amount: 0,
    message: '',
    is_anonymous: false,
  })

  // UPI details
  const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || '8700805003@upi'
  const UPI_PAYEE_NAME = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || 'KHUSHI CENTRE FOR REHABIITATION AND RESE'

  // ----- Content -----
  const testimonials: Testimonial[] = [
    {
      name: 'Priya Sharma',
      role: 'Mission Bharat Supporter',
      message:
        'Supporting Mission Bharat has been one of the most rewarding decisions. Seeing the impact on communities across India is truly inspiring.',
      rating: 5,
      image: '/images/testimonial-1.jpg',
    },
    {
      name: 'Dr. Meera Reddy',
      role: 'Community Leader',
      message:
        'The transparency and dedication of Mission Bharat is unmatched. Every rupee is accounted for and makes a real difference.',
      rating: 5,
      image: '/images/testimonial-2.jpg',
    },
    {
      name: 'Anita Nair',
      role: 'Regular Donor',
      message:
        'I have been supporting Mission Bharat for over a year now. The regular updates and impact reports give me confidence in their work.',
      rating: 5,
      image: '/images/testimonial-3.jpg',
    },
  ]

  const faqs: FAQItem[] = [
    {
      question: 'How is my donation used?',
      answer:
        'Every rupee goes towards our core mission initiatives. We publish annual reports for full transparency.',
    },
    {
      question: 'Can I volunteer for the mission?',
      answer:
        'Yes! We welcome volunteers for awareness drives, community outreach, and administrative tasks. Visit our "Get Involved" page.',
    },
    {
      question: 'Will I receive a donation receipt?',
      answer:
        'Absolutely. All donations receive an instant 80G tax receipt via email. You can also download it from your donor dashboard.',
    },
    {
      question: 'How can organisations collaborate?',
      answer:
        'We partner with corporates, NGOs, and community groups. Please contact our partnership team for more details.',
    },
  ]

  const missionCards = [
    {
      icon: <Ribbon className="h-8 w-8 text-blue-600" />,
      title: 'Awareness',
      description: 'Spreading awareness about our mission and impact.',
    },
    {
      icon: <UsersRound className="h-8 w-8 text-blue-600" />,
      title: 'Community Building',
      description: 'Building strong communities through engagement.',
    },
    {
      icon: <HeartHandshake className="h-8 w-8 text-blue-600" />,
      title: 'Support Programs',
      description: 'Providing support to those who need it most.',
    },
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: 'Impactful Projects',
      description: 'Driving change through targeted initiatives.',
    },
  ]

  const trustCards = [
    {
      title: 'Transparent Operations',
      description: 'We publish audited financials and project-wise breakdowns regularly.',
      icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
    },
    {
      title: 'Verified Impact',
      description: 'Every project is monitored and evaluated for maximum impact.',
      icon: <BadgeCheck className="h-8 w-8 text-blue-600" />,
    },
    {
      title: 'Community Support',
      description: 'Backed by thousands of supporters who believe in our mission.',
      icon: <Users className="h-8 w-8 text-blue-600" />,
    },
    {
      title: '80G Tax Exemption',
      description: 'All donations are eligible for tax benefits under Section 80G.',
      icon: <FileText className="h-8 w-8 text-blue-600" />,
    },
  ]

  const impactTiers = [
    { amount: 500, label: 'Educational Materials', desc: 'Provides educational resources and materials.' },
    { amount: 1000, label: 'Community Workshop', desc: 'Funds one community awareness workshop.' },
    { amount: 2500, label: 'Support Program', desc: 'Supports a family through our support program.' },
    { amount: 5000, label: 'Community Initiative', desc: 'Funds a complete community initiative.' },
  ]

  // ----- Effects -----
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
      )
      setIsMobile(isMobileDevice)
    }
    checkMobile()
  }, [])

  // Check for payment success from URL
  useEffect(() => {
    const checkPaymentStatus = () => {
      const params = new URLSearchParams(window.location.search)
      const status = params.get('payment_status')
      const txId = params.get('transaction_id')
      if (status === 'success' && txId) {
        setTransactionId(txId)
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
    checkPaymentStatus()
  }, [])

  // Blur/focus – create donation only on return from UPI (mobile)
  useEffect(() => {
    const handleBlur = () => {
      if (paymentInitiated && pendingTxId) {
        sessionStorage.setItem('upi_blur_time', Date.now().toString())
      }
    }

    const handleFocus = () => {
      if (paymentInitiated && pendingTxId && !donationCompleted) {
        const blurTime = sessionStorage.getItem('upi_blur_time')
        if (blurTime) {
          const timeDiff = Date.now() - parseInt(blurTime)
          sessionStorage.removeItem('upi_blur_time')
          if (timeDiff > 3000) {
            setDonationCompleted(true)
            handlePaymentInitiate(pendingTxId)
            setModalSuccess(true)
            setModalSuccessMessage(
              '✅ Thank you for your support! We will review your donation and update it in our supporters list within 24-72 hours.'
            )
            setTimeout(() => {
              setShowScanner(false)
              setQrAmount(0)
              setModalSuccess(false)
              setModalSuccessMessage('')
              setPaymentInitiated(false)
              setPendingTxId(null)
              setPaymentSuccess(true)
              setPaymentMessage(
                '✅ Thank you! We will review your donation and update it in our supporters list within 24-72 hours.'
              )
              setTimeout(() => {
                setPaymentSuccess(false)
                setPaymentMessage('')
              }, 5000)
            }, 3500)
          } else {
            setPaymentInitiated(false)
            setPendingTxId(null)
            setError('Payment cancelled. Please try again.')
            setTimeout(() => setError(''), 3000)
          }
        }
      }
    }

    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
      sessionStorage.removeItem('upi_blur_time')
    }
  }, [paymentInitiated, pendingTxId, donationCompleted])

  // Fetch supporters & stats
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [donationsData, statsData] = await Promise.all([
          api.getDonations({ limit: 100 }),
          api.getDonationStats(),
        ])
        const completedDonations =
          donationsData?.donations?.filter((d: any) => d.payment_status === 'completed') || []
        setSupporters(completedDonations)
        setStats(statsData || {})
      } catch (error) {
        console.error('Error fetching donations:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Auto-slide for testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  // Auto-slide for supporters
  useEffect(() => {
    if (isAutoPlaying && supporters.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(supporters.length / 3))
      }, 4000)
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isAutoPlaying, supporters.length])

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }))
    }
  }, [user])

  // ----- Handlers -----
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const copyUPI = () => {
    navigator.clipboard.writeText(UPI_ID)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateTxId = () => {
    return `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
  }

  const getUpiUrl = (txId: string, amount: number) => {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: UPI_PAYEE_NAME,
      am: amount.toFixed(2),
      cu: 'INR',
      tn: 'Mission Bharat Donation',
      tr: txId,
      tid: txId,
    })
    return `upi://pay?${params.toString()}`
  }

  const handlePaymentInitiate = async (txId: string) => {
    if (submitting) return
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        name: formData.is_anonymous ? 'Anonymous' : formData.name,
        email: formData.email,
        organization: formData.organization || undefined,
        amount: formData.amount,
        message: formData.message || undefined,
        is_anonymous: formData.is_anonymous,
        transaction_id: txId,
        payment_status: 'completed',
      }
      await api.createDonation(payload)

      setFormData((prev) => ({
        ...prev,
        amount: 0,
        message: '',
        organization: '',
      }))

      const [donationsData, statsData] = await Promise.all([
        api.getDonations({ limit: 100 }),
        api.getDonationStats(),
      ])
      const completedDonations =
        donationsData?.donations?.filter((d: any) => d.payment_status === 'completed') || []
      setSupporters(completedDonations)
      setStats(statsData || {})
    } catch (err: any) {
      console.error('Error creating donation:', err)
      setError(err.message || 'Payment failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const openScanner = () => {
    if (formData.amount <= 0) {
      setError('Please select an amount first')
      return
    }
    const newTxId = generateTxId()
    setTransactionId(newTxId)
    setPendingTxId(newTxId)
    setQrAmount(formData.amount)
    setShowScanner(true)
    setError('')
    setModalSuccess(false)
    setModalSuccessMessage('')
    setPaymentInitiated(false)
    setDonationCompleted(false)
    sessionStorage.removeItem('upi_blur_time')
  }

  const handleMobilePayment = () => {
    const txId = transactionId || pendingTxId || generateTxId()
    setTransactionId(txId)
    setPendingTxId(txId)
    setPaymentInitiated(true)
    sessionStorage.removeItem('upi_blur_time')
    const url = getUpiUrl(txId, qrAmount)
    setTimeout(() => {
      window.location.href = url
    }, 300)
  }

  const handleDesktopPayment = () => {
    const txId = transactionId || pendingTxId || generateTxId()
    setTransactionId(txId)
    setPendingTxId(txId)
    setPaymentInitiated(true)
    setDonationCompleted(true)
    handlePaymentInitiate(txId)
    setModalSuccess(true)
    setModalSuccessMessage(
      '✅ Thank you for your support! We will review your donation and update it in our supporters list within 24-72 hours.'
    )
    setTimeout(() => {
      setShowScanner(false)
      setQrAmount(0)
      setModalSuccess(false)
      setModalSuccessMessage('')
      setPaymentInitiated(false)
      setPendingTxId(null)
      setPaymentSuccess(true)
      setPaymentMessage(
        '✅ Thank you! We will review your donation and update it in our supporters list within 24-72 hours.'
      )
      setTimeout(() => {
        setPaymentSuccess(false)
        setPaymentMessage('')
      }, 5000)
    }, 3500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    openScanner()
  }

  // ----- Helpers for UI -----
  const getUniqueSupporters = () => {
    const unique = new Map()
    supporters.forEach((s: any) => {
      if (s.email && !unique.has(s.email)) {
        unique.set(s.email, s)
      } else if (!s.email && !unique.has(s.id)) {
        unique.set(s.id, s)
      }
    })
    return Array.from(unique.values())
  }

  const getTotalRaised = () => {
    return supporters.reduce((sum, s) => sum + s.amount, 0)
  }

  const uniqueSupporters = getUniqueSupporters()
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0)
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null)

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-slate-900">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </ProtectedRoute>
    )
  }

  // ---------- RENDER (Redesigned UI) ----------
  return (
    <ProtectedRoute>
      <div className="flex-1 w-full bg-gradient-to-br from-[#F0F7FF] via-[#E8F0FE] to-[#F5F9FF] selection:bg-blue-200 selection:text-blue-800 overflow-x-hidden">
        {/* ===== HERO SECTION ===== */}
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-indigo-900/75 to-purple-900/60 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent opacity-90" />
            {/* Decorative elements */}
            <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10 py-16 text-center sm:text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-xs border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider"
                >
                  <Heart className="h-4 w-4 text-blue-400 fill-blue-400 animate-pulse" />
                  Support Mission Bharat
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight"
                >
                  Together We Can Build a
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                    Better India.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed font-medium"
                >
                  Mission Bharat is committed to creating positive change through transparency, 
                  accountability, and citizen empowerment. Your support helps us build a stronger, 
                  more inclusive India.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start"
                >
                  <Button
                    onClick={scrollToForm}
                    className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer text-base"
                  >
                    <Heart className="h-5 w-5 mr-2 fill-current" />
                    Support the Mission
                    <ArrowRight className="h-5 w-5 ml-1" />
                  </Button>
                  <a href="#testimonials">
                    <Button
                      variant="outline"
                      className="border-slate-400 text-white hover:bg-white/10 font-bold px-8 py-6 rounded-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer text-base w-full sm:w-auto"
                    >
                      Read Stories
                    </Button>
                  </a>
                </motion.div>
              </div>

              {/* Impact stats */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                {[
                  { label: 'People Impacted', value: '100,000+', desc: 'Across India' },
                  { label: 'Projects Completed', value: '500+', desc: 'Community initiatives' },
                  { label: 'Volunteers', value: '2,500+', desc: 'Dedicated supporters' },
                  { label: 'Partner Organizations', value: '150+', desc: 'Collaborating for impact' },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl text-left"
                  >
                    <p className="text-[10px] text-blue-300 font-bold tracking-widest uppercase">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-black text-white tracking-tight mt-1">{stat.value}</p>
                    <p className="text-[11px] text-slate-300 font-medium leading-tight mt-0.5">
                      {stat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== DONATION FORM SECTION ===== */}
        <section ref={formRef} className="py-16 bg-gradient-to-b from-white to-blue-50/20 relative">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 inline-block shadow-xs">
                🎗 Donate to Support
              </span>
              <h2 className="text-3xl md:text-5xl font-black font-heading text-slate-800 tracking-tight">
                Make a Difference Today
              </h2>
              <p className="text-slate-500 text-sm sm:text-base font-medium">
                Every contribution supports Mission Bharat's initiatives, awareness campaigns, 
                community programs, and research. Join us in building a better India.
              </p>
            </div>

            {/* Donation Tiers */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
              {[
                { amount: 100, name: 'Bronze', emoji: '🥉', bg: 'bg-orange-50/60 border-orange-500 text-orange-950' },
                { amount: 500, name: 'Silver', emoji: '🥈', bg: 'bg-slate-100 border-slate-500 text-slate-950' },
                { amount: 1000, name: 'Gold', emoji: '🥇', bg: 'bg-amber-50/60 border-amber-500 text-amber-950' },
                { amount: 5000, name: 'Diamond', emoji: '💎', bg: 'bg-cyan-50/60 border-cyan-500 text-cyan-950' },
                { amount: 0, name: 'Custom', emoji: '➕', bg: 'bg-blue-50/60 border-blue-500 text-blue-950', isCustom: true },
              ].map((tier) => {
                const isSelected = tier.isCustom
                  ? formData.amount === 0
                  : formData.amount === tier.amount
                const displayAmt = tier.isCustom ? 'Custom' : `₹${tier.amount.toLocaleString()}`
                return (
                  <button
                    key={tier.name}
                    type="button"
                    onClick={() => {
                      if (tier.isCustom) {
                        setFormData({ ...formData, amount: 0 })
                      } else {
                        setFormData({ ...formData, amount: tier.amount })
                      }
                      scrollToForm()
                    }}
                    className={`p-5 rounded-2xl border text-center flex flex-col justify-center items-center gap-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? `${tier.bg} border-2 shadow-md scale-[1.02]`
                        : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <span className="text-2xl">{tier.emoji}</span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {tier.name}
                    </span>
                    <span className="text-xl font-black text-slate-800">{displayAmt}</span>
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* LEFT: Image */}
              <div className="lg:col-span-5 space-y-6 sticky top-24">
                <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl aspect-4/5">
                  <img
                    src="/images/mission-bharat-support.jpg"
                    alt="Mission Bharat Supporters"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-blue-900/10 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Heart className="h-5 w-5 text-blue-400 fill-blue-400" />
                      <span className="text-xs uppercase font-bold tracking-wider">Every Contribution Creates Impact</span>
                    </div>
                    <p className="font-serif italic text-sm md:text-base leading-relaxed">
                      &ldquo;Together, we can build a better India. Your support makes it possible.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT: Form */}
              <div className="lg:col-span-7">
                <div className="bg-white/90 backdrop-blur-xl border border-blue-100/60 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-800 font-heading">
                        Donation Form
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Quick 1-step secure donation.
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100">
                      <ShieldCheck className="h-4 w-4" /> 100% SECURE
                    </span>
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                      {error}
                    </div>
                  )}
                  {paymentSuccess && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {paymentMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full py-3.5 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-sm bg-white"
                          required
                          disabled={submitting}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full py-3.5 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-sm bg-white"
                          required
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        Organization (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full py-3.5 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-sm bg-white"
                        disabled={submitting}
                      />
                    </div>

                    {/* Custom amount */}
                    {formData.amount === 0 && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Specify Custom Amount (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                            ₹
                          </span>
                          <input
                            type="number"
                            placeholder="Enter custom amount"
                            value={formData.amount || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })
                            }
                            className="w-full py-3.5 pl-8 pr-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-sm bg-white"
                            min="1"
                          />
                        </div>
                      </div>
                    )}

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        Message (Optional)
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={2}
                        className="w-full py-3.5 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-sm bg-white resize-none"
                        placeholder="Share your words of support..."
                        disabled={submitting}
                      />
                    </div>

                    {/* Anonymous checkbox */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        checked={formData.is_anonymous}
                        onChange={(e) =>
                          setFormData({ ...formData, is_anonymous: e.target.checked })
                        }
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                        disabled={submitting}
                      />
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Remain Anonymous
                      </label>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={submitting || formData.amount <= 0}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-bold py-6 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-base"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing Donation...
                        </span>
                      ) : (
                        <>
                          <Heart className="h-5 w-5 fill-white text-white" />
                          Donate Now (₹{formData.amount.toLocaleString()})
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/50 flex gap-2.5 text-xs text-slate-500">
                    <Info className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>80G Tax Exemption:</strong> Receipts are generated automatically. Indian
                      tax payers are eligible for 50% deduction under Section 80G.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== OUR MISSION ===== */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Our Mission
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-slate-900">
                Building a Better India Together
              </h2>
              <p className="text-slate-500 text-sm max-w-xl mx-auto">
                We focus on four pillars to drive positive change across communities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {missionCards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center"
                >
                  <div className="p-3 rounded-full bg-blue-100/60 w-fit mx-auto mb-4">
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">{card.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section id="testimonials" className="py-20 bg-gradient-to-b from-slate-900 to-blue-950 text-white relative">
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="text-center space-y-3 mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                <Users className="h-4 w-4" />
                Voices of Support
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Real Stories. <span className="text-blue-400">Real Impact.</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
                Hear from supporters who are part of this mission.
              </p>
            </div>

            <div className="relative bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-lg shadow-2xl overflow-hidden min-h-[380px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonialIdx}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full"
                >
                  <div className="md:col-span-4 flex justify-center">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-blue-400/40 shadow-2xl">
                      <img
                        src={testimonials[activeTestimonialIdx].image}
                        alt={testimonials[activeTestimonialIdx].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-8 space-y-4">
                    <div>
                      <h3 className="font-heading text-2xl font-extrabold text-white">
                        {testimonials[activeTestimonialIdx].name}
                      </h3>
                      <p className="text-sm text-blue-300 font-medium">
                        {testimonials[activeTestimonialIdx].role}
                      </p>
                    </div>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic">
                      &ldquo;{testimonials[activeTestimonialIdx].message}&rdquo;
                    </p>
                    <div className="flex items-center gap-1 text-yellow-400">
                      {'★'.repeat(testimonials[activeTestimonialIdx].rating)}
                      {'☆'.repeat(5 - testimonials[activeTestimonialIdx].rating)}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-4 right-6 flex items-center gap-3">
                <button
                  onClick={() =>
                    setActiveTestimonialIdx(
                      (prev) => (prev - 1 + testimonials.length) % testimonials.length
                    )
                  }
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    setActiveTestimonialIdx((prev) => (prev + 1) % testimonials.length)
                  }
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== HOW YOUR DONATION HELPS ===== */}
        <section className="py-20 bg-blue-50/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Impact Breakdown
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-slate-900">
                How Your Donation Helps
              </h2>
              <p className="text-slate-500 text-sm max-w-xl mx-auto">
                Every contribution, no matter the size, directly supports our mission.
              </p>
            </div>

            <div className="space-y-4">
              {impactTiers.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-6 p-4 rounded-2xl bg-white border border-blue-100/60 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-20 text-center flex-shrink-0">
                    <p className="text-2xl font-black text-blue-600">₹{item.amount}</p>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{item.label}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                  <div className="text-blue-400">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SUPPORTERS LIST ===== */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                Our Community
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-slate-900">
                Our Supporters
              </h2>
              <p className="text-slate-500 text-sm max-w-xl mx-auto">
                {uniqueSupporters.length} supporters have contributed ₹{getTotalRaised().toLocaleString()}
              </p>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {supporters.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Heart className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p>Be the first to support our mission!</p>
                </div>
              ) : (
                uniqueSupporters.map((supporter, index) => {
                  const showName = !supporter.is_anonymous && supporter.name !== 'Anonymous'
                  return (
                    <motion.div
                      key={supporter.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0">
                          {!showName ? (
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                              <Shield className="h-5 w-5 text-slate-500" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                              {supporter.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-800 truncate">
                            {showName ? supporter.name : 'Anonymous Supporter'}
                          </p>
                          {supporter.organization && showName && (
                            <p className="text-xs text-slate-500 truncate">
                              {supporter.organization}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="font-bold text-green-600">₹{supporter.amount.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(supporter.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>
        </section>

        {/* ===== TRUST & FAQ ===== */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-5xl space-y-16">
            <div>
              <div className="text-center space-y-3 mb-12">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  Trust & Transparency
                </span>
                <h2 className="font-heading text-3xl font-extrabold text-slate-900">
                  Why Support Us?
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trustCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col items-center text-center gap-3"
                  >
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shrink-0">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm font-heading">{card.title}</h3>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-center space-y-3 mb-12">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  FAQ
                </span>
                <h2 className="font-heading text-3xl font-extrabold text-slate-900">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3 max-w-3xl mx-auto">
                {faqs.map((faq, idx) => {
                  const isOpen = activeFaqIdx === idx
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-white overflow-hidden"
                    >
                      <button
                        onClick={() => setActiveFaqIdx(isOpen ? null : idx)}
                        className="w-full py-4 px-6 flex justify-between items-center text-left font-bold text-slate-800 text-sm cursor-pointer hover:bg-slate-50"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? (
                          <Minus className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Plus className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 pt-1 text-slate-500 text-xs leading-relaxed border-t border-slate-100">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ===== DISCLAIMER ===== */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 flex gap-3 text-xs text-slate-500 max-w-4xl mx-auto leading-relaxed">
          <ShieldCheck className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <p>
            <strong>Mission Bharat</strong> is dedicated to building a better India through transparency,
            accountability, and citizen empowerment. Every contribution helps create positive change
            and build stronger communities across India.
          </p>
        </div>
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              if (!submitting && !modalSuccess) {
                setShowScanner(false)
                setQrAmount(0)
                setPaymentInitiated(false)
                setPendingTxId(null)
                setDonationCompleted(false)
                sessionStorage.removeItem('upi_blur_time')
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-[380px] bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {modalSuccess ? (
                <div className="py-8 px-4 text-center">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                    Thank You! 🙏
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {modalSuccessMessage}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Closing in a moment...
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      {isMobile ? (
                        <>
                          <Smartphone className="h-5 w-5 text-blue-500" />
                          Pay via UPI
                        </>
                      ) : (
                        <>
                          <Monitor className="h-5 w-5 text-blue-500" />
                          Scan QR with Phone
                        </>
                      )}
                    </h3>
                    <button
                      onClick={() => {
                        if (!submitting) {
                          setShowScanner(false)
                          setQrAmount(0)
                          setPaymentInitiated(false)
                          setPendingTxId(null)
                          setDonationCompleted(false)
                          sessionStorage.removeItem('upi_blur_time')
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      disabled={submitting}
                    >
                      <X className="h-5 w-5 text-slate-500" />
                    </button>
                  </div>

                  <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 dark:text-blue-300 font-bold text-lg">₹{qrAmount}</span>
                      <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">{UPI_PAYEE_NAME}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-1.5">
                      <span className="text-xs text-blue-600 dark:text-blue-400">UPI:</span>
                      <code className="text-xs font-mono bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded text-blue-800 dark:text-blue-200">
                        {UPI_ID}
                      </code>
                      <button
                        onClick={copyUPI}
                        className="p-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-blue-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center mb-4">
                    <div className="aspect-square w-[220px] bg-white dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center border-2 border-slate-200 dark:border-slate-700">
                      {qrAmount > 0 ? (
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                            getUpiUrl(transactionId || pendingTxId || generateTxId(), qrAmount)
                          )}`}
                          alt="UPI QR Code"
                          className="w-full h-full object-contain p-4"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/images/upi-qr-fallback.png'
                          }}
                        />
                      ) : (
                        <div className="text-center">
                          <QrCode className="h-12 w-12 text-slate-400 mx-auto" />
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Select amount
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {isMobile ? (
                      <button
                        onClick={handleMobilePayment}
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-3 rounded-xl text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Smartphone className="h-4 w-4" />
                            Open UPI App
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleDesktopPayment}
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-3 rounded-xl text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            I've Paid
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-3">
                    {isMobile
                      ? 'Click to pay via UPI app. You will be redirected back automatically.'
                      : 'Scan QR with any UPI app on your phone, then click I\'ve Paid'}
                  </p>

                  <div className="flex justify-center mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs py-1.5 h-9 w-full"
                      onClick={() => {
                        if (!submitting) {
                          setShowScanner(false)
                          setQrAmount(0)
                          setPaymentInitiated(false)
                          setPendingTxId(null)
                          setDonationCompleted(false)
                          sessionStorage.removeItem('upi_blur_time')
                        }
                      }}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  )
}
'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Heart, Trophy, TrendingUp, CalendarCheck } from 'lucide-react'

interface StatsData {
  total_donations?: number
  totalDonations?: number
  total_amount?: number
  totalAmount?: number
  top_donation?: number
  highest_donation?: number
  topDonation?: number
  highestDonation?: number
  average_donation?: number
  averageDonation?: number
  recent_donations?: number
  recentDonations?: number
}

interface LiveStatsProps {
  stats: StatsData
  uniqueDonorsCount?: number
}

function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const start = 0
    const end = Math.max(0, value)
    if (start === end) {
      setCount(end)
      return
    }
    const duration = 1200 // ms
    const incrementTime = 30 // ms
    const steps = Math.ceil(duration / incrementTime)
    const stepValue = (end - start) / steps

    let current = start
    const timer = setInterval(() => {
      current += stepValue
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [value])

  return (
    <span>
      {prefix}
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}

export const LiveStats: React.FC<LiveStatsProps> = ({ stats, uniqueDonorsCount }) => {
  const totalDonors = uniqueDonorsCount ?? (stats.totalDonations ?? stats.total_donations ?? 0)
  const totalAmount = stats.totalAmount ?? stats.total_amount ?? 0
  const topDonation = stats.highestDonation ?? stats.topDonation ?? stats.highest_donation ?? stats.top_donation ?? 0
  const avgDonation = stats.averageDonation ?? stats.average_donation ?? 0
  const recentDonations = stats.recentDonations ?? stats.recent_donations ?? 0

  const statCards = [
    {
      id: 'donors',
      label: 'Total Donors',
      value: totalDonors,
      prefix: '',
      suffix: '',
      icon: Users,
      color: 'from-pink-500 to-rose-500',
      bgLight: 'bg-pink-50 dark:bg-pink-950/30',
      borderColor: 'border-pink-200 dark:border-pink-800',
      textColor: 'text-pink-600 dark:text-pink-400',
    },
    {
      id: 'amount',
      label: 'Total Amount Raised',
      value: totalAmount,
      prefix: '₹',
      suffix: '',
      icon: Heart,
      color: 'from-rose-500 to-red-600',
      bgLight: 'bg-rose-50 dark:bg-rose-950/30',
      borderColor: 'border-rose-200 dark:border-rose-800',
      textColor: 'text-rose-600 dark:text-rose-400',
    },
    {
      id: 'top',
      label: 'Largest Donation',
      value: topDonation,
      prefix: '₹',
      suffix: '',
      icon: Trophy,
      color: 'from-amber-500 to-yellow-600',
      bgLight: 'bg-amber-50 dark:bg-amber-950/30',
      borderColor: 'border-amber-200 dark:border-amber-800',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 'avg',
      label: 'Average Support',
      value: avgDonation,
      prefix: '₹',
      suffix: '',
      icon: TrendingUp,
      color: 'from-purple-500 to-indigo-600',
      bgLight: 'bg-purple-50 dark:bg-purple-950/30',
      borderColor: 'border-purple-200 dark:border-purple-800',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      id: 'recent',
      label: 'Recent 30-Day Donors',
      value: recentDonations,
      prefix: '',
      suffix: '+',
      icon: CalendarCheck,
      color: 'from-pink-600 to-purple-600',
      bgLight: 'bg-fuchsia-50 dark:bg-fuchsia-950/30',
      borderColor: 'border-fuchsia-200 dark:border-fuchsia-800',
      textColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    },
  ]

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
          Live Mission Statistics
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Updated Real-Time</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border ${card.borderColor} ${card.bgLight} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2.5 rounded-xl bg-gradient-to-r ${card.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
                <AnimatedCounter value={card.value} prefix={card.prefix} suffix={card.suffix} />
              </p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
                {card.label}
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

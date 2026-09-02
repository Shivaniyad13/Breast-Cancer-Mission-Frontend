'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Trophy, Clock, Shield, Building2 } from 'lucide-react'

export interface SupporterItem {
  id: string
  name?: string
  donorName?: string | null
  email?: string
  donorEmail?: string | null
  organization?: string | null
  amount: number
  message?: string | null
  isAnonymous?: boolean
  is_anonymous?: boolean
  createdAt?: string
  created_at?: string
  user?: {
    id: string
    name: string
    image?: string
  } | null
}

interface SupportersWallProps {
  supporters: SupporterItem[]
  isLoading?: boolean
}

export const SupportersWall: React.FC<SupportersWallProps> = ({
  supporters = [],
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'recent' | 'top'>('recent')

  // Format and parse supporters
  const normalizedSupporters = supporters.map((s) => ({
    id: s.id,
    name:
      s.isAnonymous || s.is_anonymous
        ? 'Anonymous Supporter'
        : s.name || s.donorName || s.user?.name || 'Generous Donor',
    organization: s.organization || null,
    amount: s.amount,
    message: s.message || null,
    isAnonymous: Boolean(s.isAnonymous || s.is_anonymous),
    date: s.createdAt || s.created_at || new Date().toISOString(),
    image: s.user?.image || null,
  }))

  const sortedSupporters = [...normalizedSupporters].sort((a, b) => {
    if (activeTab === 'top') {
      return b.amount - a.amount
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <section className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-1">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            Our Community of Hope
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Honoring every generous soul standing up against breast cancer.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'recent'
                ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Recent Donors</span>
          </button>
          <button
            onClick={() => setActiveTab('top')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'top'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>Top Contributors</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800/60 animate-pulse border border-slate-200 dark:border-slate-700"
            />
          ))}
        </div>
      ) : sortedSupporters.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-pink-50/50 dark:bg-slate-800/40 border border-pink-200 dark:border-pink-900/50">
          <Heart className="h-12 w-12 text-pink-400 mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Be the First Hope Champion
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            No donations recorded yet. Your contribution will inspire hundreds of others to join the mission.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {sortedSupporters.map((supporter, idx) => (
              <motion.div
                key={supporter.id + idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-5 border border-pink-200 dark:border-pink-800/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      {supporter.isAnonymous ? (
                        <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold text-sm">
                          <Shield className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center font-bold text-base shadow-md">
                          {supporter.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-tight">
                          {supporter.name}
                        </h4>
                        {supporter.organization && !supporter.isAnonymous && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3" />
                            <span>{supporter.organization}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="font-extrabold text-rose-600 dark:text-rose-400 text-base sm:text-lg">
                      ₹{supporter.amount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {supporter.message && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-pink-50/50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-pink-100 dark:border-pink-900/40 my-2 leading-relaxed">
                      &quot;{supporter.message}&quot;
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                  <span>Verified Supporter</span>
                  <span>
                    {new Date(supporter.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}

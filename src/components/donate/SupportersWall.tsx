'use client'

import React from 'react'
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
  pagination?: {
    page: number
    pages: number
    total: number
  }
  onPageChange?: (page: number) => void
  sortBy?: 'amount' | 'recent'
  onSortChange?: (sortBy: 'amount' | 'recent') => void
}

export const SupportersWall: React.FC<SupportersWallProps> = ({
  supporters = [],
  isLoading = false,
  pagination,
  onPageChange,
  sortBy = 'recent',
  onSortChange,
}) => {
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

  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-1">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
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
            onClick={() => onSortChange?.('recent')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              sortBy === 'recent'
                ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Recent Donors</span>
          </button>
          <button
            onClick={() => onSortChange?.('amount')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              sortBy === 'amount'
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
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="h-12 bg-slate-100 dark:bg-slate-800 animate-pulse" />
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-14 border-t border-slate-100 dark:border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : normalizedSupporters.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-pink-50/50 dark:bg-slate-800/40 border border-pink-200 dark:border-pink-900/50">
          <Heart className="h-12 w-12 text-pink-400 mx-auto mb-3 " />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Be the First Hope Champion
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            No donations recorded yet. Your contribution will inspire hundreds of others to join the mission.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-pink-200 dark:border-pink-800/60 bg-white dark:bg-slate-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead className="bg-pink-50/70 dark:bg-slate-800/80">
                <tr className="text-xs tracking-wide text-slate-500 dark:text-slate-400">
                  <th className="px-5 py-4 font-bold">Donor</th>
                  <th className="px-5 py-4 font-bold">Amount</th>
                  <th className="px-5 py-4 font-bold">Message</th>
                  <th className="px-5 py-4 font-bold">Date</th>
                  <th className="px-5 py-4 font-bold">Payment</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {normalizedSupporters.map((supporter) => (
                    <motion.tr
                      key={supporter.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="border-t border-slate-100 dark:border-slate-800"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold ${supporter.isAnonymous ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400' : 'bg-pink-600 text-white'}`}>
                            {supporter.isAnonymous
                              ? <Shield className="h-4 w-4" />
                              : supporter.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{supporter.name}</p>
                            {supporter.organization && !supporter.isAnonymous && (
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                <Building2 className="h-3 w-3" />
                                {supporter.organization}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-rose-600 dark:text-rose-400">
                        ₹{supporter.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="max-w-xs px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {supporter.message || '—'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(supporter.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Successful
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {pagination && pagination.pages > 1 && onPageChange && (
            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Page {pagination.page} of {pagination.pages} · {pagination.total.toLocaleString('en-IN')} successful donations
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

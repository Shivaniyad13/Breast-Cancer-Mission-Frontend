"use client";

import React, { useState } from "react";
import {
  Eye,
  Users,
  Video,
  Heart,
  TrendingUp,
  Award,
  BookOpen,
  Play,
  Calendar,
  CheckCircle,
  FileText,
  Percent,
  BarChart3,
  Target,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AnalyticsDashboardProps {
  data: {
    visits: {
      totalVisits: number;
      topPages: Array<{ path: string; views: number }>;
    };
    users: {
      totalUsers: number;
      newUsersThisMonth: number;
      usersByRole: Record<string, number>;
    };
    webinars: {
      totalRegistrations: number;
      totalAttendees: number;
      attendanceRate: number;
      totalCertificatesIssued: number;
      webinarsList: Array<{
        id: string;
        title: string;
        date: string | null;
        status: string;
        maxSeats: number;
        registrationsCount: number;
        attendanceCount: number;
        certificatesCount: number;
      }>;
    };
    videos: {
      totalVideoPlays: number;
      topVideos: Array<{
        videoIdentifier: string;
        title: string;
        category: string;
        playCount: number;
      }>;
    };
    articles: {
      totalArticleViews: number;
      topArticles: Array<{
        id: string;
        title: string;
        slug: string;
        category: string;
        views: number;
        readTime: string;
      }>;
    };
    donations: {
      successfulDonationsCount: number;
      totalDonationAmount: number;
      campaignsList: Array<{
        id: string;
        title: string;
        slug: string;
        status: string;
        fundingGoal: number;
        amountRaised: number;
        donationsCount: number;
      }>;
    };
    individualMembers?: {
      total: number;
      pending: number;
      verified: number;
      rejected: number;
    };
  };
}

export default function AdminAnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const { visits, users, webinars, videos, articles, donations, individualMembers } = data;

  const maxPageViews = visits.topPages.length > 0 ? visits.topPages[0].views : 1;

  return (
    <div className="space-y-8">
      {/* ==================== TOP SUMMARY CARDS ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* Card 1: Website Visits */}
        <Card className="rounded-2xl border-slate-100 bg-gradient-to-br from-white to-blue-50/40 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              Traffic Reach
            </span>
            <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
              <Eye className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-3xl font-extrabold text-slate-900 font-heading">
              {visits.totalVisits.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 font-medium">Total Website Page Visits</p>
          </div>
        </Card>

        {/* Card 2: Registered Users */}
        <Card className="rounded-2xl border-slate-100 bg-gradient-to-br from-white to-purple-50/40 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
              Community Growth
            </span>
            <div className="h-10 w-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-slate-900 font-heading">
                {users.totalUsers.toLocaleString()}
              </p>
              {users.newUsersThisMonth > 0 && (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <ArrowUpRight className="h-3 w-3" />+{users.newUsersThisMonth} this month
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">Total Registered Users</p>
          </div>
        </Card>

        {/* Card 3: Webinar Registrations */}
        <Card className="rounded-2xl border-slate-100 bg-gradient-to-br from-white to-pink-50/40 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
              Events Impact
            </span>
            <div className="h-10 w-10 rounded-xl bg-pink-600/10 flex items-center justify-center text-pink-600">
              <Video className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-slate-900 font-heading">
                {webinars.totalRegistrations.toLocaleString()}
              </p>
              <span className="text-xs font-bold text-pink-600 bg-pink-100/80 px-2 py-0.5 rounded-full">
                {webinars.attendanceRate}% Attendance
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Registrations ({webinars.totalAttendees} attended)
            </p>
          </div>
        </Card>

        {/* Card 4: Successful Donations */}
        <Card className="rounded-2xl border-slate-100 bg-gradient-to-br from-white to-emerald-50/40 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Funds Raised
            </span>
            <div className="h-10 w-10 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-600">
              <Heart className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-3xl font-extrabold text-slate-900 font-heading">
              ₹{donations.totalDonationAmount.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              {donations.successfulDonationsCount} Successful Donations
            </p>
          </div>
        </Card>

        {/* Card 5: Individual Members */}
        {individualMembers && (
          <Card className="rounded-2xl border-slate-100 bg-gradient-to-br from-white to-rose-50/40 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                  Individual Members
                </span>
                <div className="h-10 w-10 rounded-xl bg-rose-600/10 flex items-center justify-center text-rose-600">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-3xl font-extrabold text-slate-900 font-heading">
                  {individualMembers.total.toLocaleString()}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-slate-500 pt-1">
                  <span className="text-amber-600 font-bold">{individualMembers.pending} Pending</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-bold">{individualMembers.verified} Verified</span>
                  <span>•</span>
                  <span className="text-rose-600 font-bold">{individualMembers.rejected} Rejected</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100/60 mt-3">
              <Link
                href="/admin/individual-members"
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
              >
                Manage Members &rarr;
              </Link>
            </div>
          </Card>
        )}

      </div>

      {/* ==================== SECTION 1: WEBSITE VISITS ==================== */}
      <Card className="rounded-2xl border-slate-100 bg-white p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-800 flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" /> SECTION 1: Website Visits &amp; Top Pages
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Lightweight page view distribution tracking public awareness interest.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
            Total Visits: {visits.totalVisits.toLocaleString()}
          </span>
        </div>

        {visits.topPages.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-medium">
            Page visit data is being collected as users browse public pages.
          </div>
        ) : (
          <div className="space-y-3">
            {visits.topPages.map((page, idx) => {
              const pct = Math.round((page.views / maxPageViews) * 100);
              return (
                <div key={page.path} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-800 font-mono">
                      <span className="text-slate-400 font-sans mr-2">#{idx + 1}</span>
                      {page.path === "/" ? "/ (Homepage)" : page.path}
                    </span>
                    <span className="text-slate-600 font-bold">{page.views.toLocaleString()} visits</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ==================== SECTION 2: WEBINAR ENGAGEMENT ==================== */}
      <Card className="rounded-2xl border-slate-100 bg-white p-6 shadow-xs space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-800 flex items-center gap-2">
              <Video className="h-5 w-5 text-pink-600" /> SECTION 2: Webinar Engagement &amp; Attendance
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Registration counts, participant attendance, and verified certificate generation.
            </p>
          </div>
        </div>

        {/* Webinar KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-100 text-slate-800">
            <p className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">Total Registrations</p>
            <p className="text-2xl font-black mt-1">{webinars.totalRegistrations}</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 text-slate-800">
            <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Actual Attendees</p>
            <p className="text-2xl font-black mt-1">{webinars.totalAttendees}</p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-slate-800">
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Attendance Rate</p>
            <p className="text-2xl font-black mt-1">{webinars.attendanceRate}%</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-slate-800">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Certificates Issued</p>
            <p className="text-2xl font-black mt-1">{webinars.totalCertificatesIssued}</p>
          </div>
        </div>

        {/* Webinar Breakdown Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                <th className="py-3 px-4">Webinar Event Title</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Registrations</th>
                <th className="py-3 px-4 text-center">Attendees</th>
                <th className="py-3 px-4 text-center">Attendance %</th>
                <th className="py-3 px-4 text-center">Certificates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {webinars.webinarsList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No webinars created yet.
                  </td>
                </tr>
              ) : (
                webinars.webinarsList.map((webinar) => {
                  const rate =
                    webinar.registrationsCount > 0
                      ? Math.round((webinar.attendanceCount / webinar.registrationsCount) * 100)
                      : 0;

                  return (
                    <tr key={webinar.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">{webinar.title}</td>
                      <td className="py-3 px-4 text-slate-500">
                        {webinar.date
                          ? new Date(webinar.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Scheduled"}
                      </td>
                      <td className="py-3 px-4 text-center font-black text-slate-900">
                        {webinar.registrationsCount} / {webinar.maxSeats}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-purple-700">
                        {webinar.attendanceCount}
                      </td>
                      <td className="py-3 px-4 text-center font-bold">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] ${
                            rate >= 50
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {rate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700">
                        {webinar.certificatesCount}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ==================== SECTION 3: CONTENT & VIDEO ENGAGEMENT ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Articles */}
        <Card className="rounded-2xl border-slate-100 bg-white p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" /> Top Read Awareness Articles
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Educational reading content views (`Article.views`)
              </p>
            </div>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {articles.totalArticleViews.toLocaleString()} Total Reads
            </span>
          </div>

          <div className="space-y-3">
            {articles.topArticles.length === 0 ? (
              <p className="py-6 text-center text-slate-400 text-xs">No published articles available.</p>
            ) : (
              articles.topArticles.map((art, idx) => (
                <div
                  key={art.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="space-y-0.5 pr-2">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{art.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.2 rounded">
                        {art.category}
                      </span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-900 font-heading bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs whitespace-nowrap">
                    {art.views.toLocaleString()} reads
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Video Play Views */}
        <Card className="rounded-2xl border-slate-100 bg-white p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-heading text-base font-bold text-slate-800 flex items-center gap-2">
                <Play className="h-5 w-5 text-pink-600 fill-pink-600" /> Important Video Play Views
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Play counts on survivor stories, explainer &amp; testimonial videos.
              </p>
            </div>
            <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
              {videos.totalVideoPlays.toLocaleString()} Video Plays
            </span>
          </div>

          <div className="space-y-3">
            {videos.topVideos.length === 0 ? (
              <p className="py-6 text-center text-slate-400 text-xs">
                Video play interactions will appear here as users view awareness videos.
              </p>
            ) : (
              videos.topVideos.map((video) => (
                <div
                  key={video.videoIdentifier}
                  className="flex items-center justify-between p-3 rounded-xl bg-pink-50/30 border border-pink-100 hover:bg-pink-50/60 transition-colors"
                >
                  <div className="space-y-0.5 pr-2">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{video.title}</p>
                    <span className="text-[10px] font-bold bg-pink-100 text-pink-700 px-1.5 py-0.2 rounded">
                      {video.category}
                    </span>
                  </div>
                  <span className="text-xs font-black text-pink-700 font-heading bg-white px-2.5 py-1 rounded-lg border border-pink-200 shadow-2xs whitespace-nowrap">
                    {video.playCount.toLocaleString()} plays
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

      </div>

      {/* ==================== SECTION 4: DONATION & CAMPAIGN SUMMARY ==================== */}
      <Card className="rounded-2xl border-slate-100 bg-white p-6 shadow-xs space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-800 flex items-center gap-2">
              <Heart className="h-5 w-5 text-emerald-600 fill-emerald-600" /> SECTION 4: Donation &amp; Campaign Summary
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Metrics from completed/successful transactions and active patient crowdfunding campaigns.
            </p>
          </div>
        </div>

        {/* Donation Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100">
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Total Raised (Cleared)</p>
            <p className="text-2xl font-black text-emerald-950 mt-1">
              ₹{donations.totalDonationAmount.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cyan-50/40 border border-cyan-100">
            <p className="text-[10px] font-bold text-cyan-700 uppercase tracking-wider">Successful Transactions</p>
            <p className="text-2xl font-black text-cyan-950 mt-1">
              {donations.successfulDonationsCount}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Average Donation Size</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              ₹
              {donations.successfulDonationsCount > 0
                ? Math.round(donations.totalDonationAmount / donations.successfulDonationsCount).toLocaleString()
                : 0}
            </p>
          </div>
        </div>

        {/* Active Campaigns List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Patient Crowdfunding Campaigns Progress
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                  <th className="py-3 px-4">Campaign Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Goal Amount</th>
                  <th className="py-3 px-4">Raised Amount</th>
                  <th className="py-3 px-4">Funding Progress</th>
                  <th className="py-3 px-4 text-center">Donors Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {donations.campaignsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No campaigns found.
                    </td>
                  </tr>
                ) : (
                  donations.campaignsList.map((campaign) => {
                    const pct =
                      campaign.fundingGoal > 0
                        ? Math.min(100, Math.round((campaign.amountRaised / campaign.fundingGoal) * 100))
                        : 0;

                    return (
                      <tr key={campaign.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800">{campaign.title}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              campaign.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {campaign.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          ₹{campaign.fundingGoal.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-black text-emerald-700">
                          ₹{campaign.amountRaised.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 min-w-[140px]">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span className="text-slate-500">{pct}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-800">
                          {campaign.donationsCount}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}

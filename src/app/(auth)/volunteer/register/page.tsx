"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUserAction } from "@/app/actions/auth";
import { motion } from "framer-motion";
import { Ribbon, ArrowLeft, Lock, Mail, User, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registerVolunteerAction } from "@/app/actions/volunteerAuth";

export default function VolunteerRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await registerVolunteerAction({
        fullName,
        email,
        password,
        confirmPassword,
      });

      if (!res.success) {
        setError(res.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto sign-in after registration
      const signInRes = await loginUserAction(email, password);

      if (signInRes?.error) {
        // If auto sign-in fails for any reason, redirect to login page
        router.push("/volunteer/login");
      } else {
        router.push("/campaigns/volunteers");
        router.refresh();
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link
          href="/campaigns/volunteers"
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-pink-600 hover:text-pink-700 transition-colors mb-6 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Volunteers
        </Link>

        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Ribbon className="h-8 w-8 text-white" />
          </div>
        </div>

        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Volunteer Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Register to join our volunteer network and access member benefits
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-pink-100/60 hover:border-pink-300 transition-colors"
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-center gap-3 text-red-700 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-pink-500/25 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Create Volunteer Account"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-600">
              Already registered?{" "}
              <Link
                href="/volunteer/login"
                className="font-bold text-pink-600 hover:text-pink-700 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle, Ribbon } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission delay
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      {/* ── SEO Meta ── */}
      <title>Contact Us · Breast Cancer Awareness Mission</title>

      <div className="min-h-screen bg-gradient-to-b from-[#0d1b2a] via-slate-900 to-slate-950 text-white">

        {/* ── Hero Banner ── */}
        <section className="relative overflow-hidden pt-32 pb-20 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(219,39,119,0.15)_0%,_transparent_60%)] pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-300 text-xs font-semibold tracking-wider uppercase mb-6">
              <Ribbon className="h-3.5 w-3.5" />
              Breast Cancer Awareness Mission
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Get In <span className="text-pink-400">Touch</span>
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
              Have a question, want to collaborate, or need support? We're here to help. Reach out and our team will respond within 24 hours.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto">

            {/* ── Left: Contact Info Cards ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Info Card */}
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 backdrop-blur p-7 space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-pink-400">Contact Details</h2>

                <a
                  href="tel:+919350206124"
                  className="flex items-start gap-4 group"
                >
                  <div className="h-10 w-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500/30 transition-colors">
                    <Phone className="h-5 w-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-0.5">Phone</p>
                    <p className="text-white font-medium group-hover:text-pink-300 transition-colors">+91 93502 06124</p>
                  </div>
                </a>

                <a
                  href="mailto:grsindiacorp@gmail.com"
                  className="flex items-start gap-4 group"
                >
                  <div className="h-10 w-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500/30 transition-colors">
                    <Mail className="h-5 w-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-0.5">Email</p>
                    <p className="text-white font-medium group-hover:text-pink-300 transition-colors">grsindiacorp@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-0.5">Head Office</p>
                    <p className="text-white font-medium leading-relaxed">
                      Sector 64, B-14, Noida,<br />Uttar Pradesh, India – 201301
                    </p>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 backdrop-blur p-7 space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-pink-400">Office Hours</h2>
                <div className="space-y-3 text-sm">
                  {[
                    { day: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
                    { day: "Saturday", time: "10:00 AM – 4:00 PM" },
                    { day: "Sunday", time: "Closed" },
                  ].map(({ day, time }) => (
                    <div key={day} className="flex justify-between items-center border-b border-slate-700/50 pb-2 last:border-0 last:pb-0">
                      <span className="text-slate-400">{day}</span>
                      <span className="text-white font-medium">{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collaboration badge */}
              <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-5 text-center space-y-1">
                <p className="text-xs text-pink-400 font-semibold uppercase tracking-widest">In Collaboration With</p>
                <p className="text-white font-bold text-sm">Khushi Centre for Rehabilitation & Research</p>
                <a
                  href="https://khushicentre.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-pink-300 transition-colors"
                >
                  khushicentre.in →
                </a>
              </div>
            </div>

            {/* ── Right: Contact Form ── */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 backdrop-blur p-8">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                    <div className="h-16 w-16 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-pink-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                    <p className="text-slate-400 max-w-sm">
                      Thank you for reaching out. Our team will get back to you at <span className="text-pink-300">{form.email}</span> within 24 hours.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                      className="mt-4 px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-white mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest text-slate-400">Full Name *</label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-600 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/40 transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-slate-400">Email Address *</label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-600 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/40 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-widest text-slate-400">Phone Number</label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 XXXXX XXXXX"
                            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-600 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/40 transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-widest text-slate-400">Subject *</label>
                          <select
                            id="subject"
                            name="subject"
                            required
                            value={form.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-600 text-white text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/40 transition-colors appearance-none"
                          >
                            <option value="" disabled>Select a topic</option>
                            <option value="awareness">Awareness & Education</option>
                            <option value="crowdfunding">Crowdfunding / Donations</option>
                            <option value="webinar">Webinar Inquiry</option>
                            <option value="ngo">NGO / Doctor Partnership</option>
                            <option value="media">Media & Press</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="message" className="text-xs font-semibold uppercase tracking-widest text-slate-400">Message *</label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Tell us how we can help you..."
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-600 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/40 transition-colors resize-none"
                        />
                      </div>

                      <button
                        id="contact-submit-btn"
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-pink-900/30"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import {
  Ribbon,
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  Heart,
} from "lucide-react";

// Inline SVG brand icons (lucide-react removed social brand icons in v0.400+)
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterXIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0d1b2a" />
  </svg>
);

const quickLinks = [
  { label: "Support Patients", href: "/campaigns" },
  { label: "Webinars", href: "/webinars" },
  { label: "About Us", href: "/about" },
  { label: "Self-Examination Guide", href: "/learn/bse-guide" },
  { label: "Contact Us", href: "/contact" },
];

const contactLinks = [
  { label: "Get In Touch", href: "/contact" },
  { label: "Our Mission", href: "/about" },
];

const socialLinks = [
  { icon: FacebookIcon, href: "https://facebook.com", label: "Facebook" },
  { icon: TwitterXIcon, href: "https://twitter.com", label: "Twitter" },
  { icon: LinkedinIcon, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: YoutubeIcon, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{ backgroundColor: "#0d1b2a" }}
      className="relative text-slate-300 overflow-hidden"
    >
      {/* Top pink accent line */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-pink-600 via-pink-400 to-rose-500" />

      {/* Watermark ribbon */}
      <div className="absolute right-10 top-10 opacity-[0.04] pointer-events-none select-none">
        <Ribbon className="w-64 h-64 text-pink-400" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* ── Col 1 · Brand ── */}
          <div className="space-y-5 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-pink-600/20 border border-pink-500/30">
                <Ribbon className="h-5 w-5 text-pink-400" />
              </div>
              <div>
                <p className="font-heading text-[10px] font-bold tracking-[0.2em] uppercase text-pink-400">
                  Breast Cancer
                </p>
                <p className="font-heading text-[10px] font-bold tracking-[0.15em] uppercase text-slate-300">
                  Mission
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              A trusted unified healthcare portal spreading early detection
              knowledge, hosting expert webinars, and coordinating verified
              crowdfunding support for breast cancer patients.
            </p>

            <div className="space-y-2.5">
              <a
                href="tel:+919217396124"
                className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-pink-400 transition-colors group"
              >
                <Phone className="h-4 w-4 text-pink-500 group-hover:scale-110 transition-transform" />
                +91 9217396124
              </a>
              <a
                href="mailto:grsindiacorp@gmail.com"
                className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-pink-400 transition-colors group"
              >
                <Mail className="h-4 w-4 text-pink-500 group-hover:scale-110 transition-transform" />
                grsindiacorp@gmail.com
              </a>
            </div>
          </div>

          {/* ── Col 2 · Quick Links ── */}
          <div className="space-y-5">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-pink-400">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-pink-300 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3 · Contact ── */}
          <div className="space-y-5">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-pink-400">
              Contact
            </h3>
            <ul className="space-y-2.5">
              {contactLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-pink-300 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={scrollToTop}
                  className="text-sm text-slate-400 hover:text-pink-300 hover:translate-x-1 inline-block transition-all duration-200"
                >
                  Back to Top
                </button>
              </li>
            </ul>

            {/* Head office */}
            <div className="pt-3">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-pink-400 mb-2">
                Head Office
              </p>
              <div className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin className="h-4 w-4 text-pink-500 mt-0.5 flex-shrink-0" />
                <span> B-14 Sector 64, Noida, Uttar Pradesh, India – 201301</span>
              </div>
            </div>
          </div>

          {/* ── Col 4 · Collaboration ── */}
          <div className="space-y-5">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-pink-400">
            An Initiative of Khushi Centre for Rehabilitation & Research and GRS India Group
            </h3>

            {/* Khushi Research */}
            <a
              href="https://khushicentre.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-slate-700 hover:border-pink-500/50 bg-slate-800/50 hover:bg-slate-800 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-pink-900/20"
            >
              <div className="flex items-center justify-center h-14 mb-3 rounded-lg bg-white/5 overflow-hidden px-3">
                <img
                  src="/khushi-logo.jpg"
                  alt="Khushi Centre for Rehabilitation & Research"
                  className="max-h-10 w-auto object-contain brightness-110"
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-300 group-hover:text-pink-300 transition-colors leading-snug">
                Khushi Centre for Rehabilitation &amp; Research
              </p>
              <p className="text-[11px] text-slate-500 mt-1 group-hover:text-slate-400 transition-colors">
                Research Partner · khushicentre.in
              </p>
            </a>

            {/* GRS India Group */}
            <a
              href="https://grsindiacorporation.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-slate-700 hover:border-pink-500/50 bg-slate-800/50 hover:bg-slate-800 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-pink-900/20"
            >
              <div className="flex items-center justify-center h-14 mb-3 rounded-lg bg-white/5 overflow-hidden px-3">
                <img
                  src="/grs-group-logo.jpg"
                  alt="GRS India Group"
                  className="max-h-10 w-auto object-contain brightness-110"
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-300 group-hover:text-pink-300 transition-colors leading-snug">
                GRS India Group
              </p>
              <p className="text-[11px] text-slate-500 mt-1 group-hover:text-slate-400 transition-colors">
                Principal Partner · grsindiacorporation.com
              </p>
            </a>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-slate-700/60" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="text-slate-400 font-medium">Breast Cancer Awareness Mission.</span>{" "}
            All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center h-8 w-8 rounded-full border border-slate-700 text-slate-400 hover:border-pink-500 hover:text-pink-400 hover:bg-pink-500/10 transition-all duration-200"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>

          {/* Right links + back-to-top */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-pink-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-pink-400 transition-colors">
              Terms of Use
            </Link>
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex items-center justify-center h-8 w-8 rounded-full bg-pink-600/20 border border-pink-500/40 hover:bg-pink-600/40 hover:border-pink-400 text-pink-400 transition-all duration-200 ml-2"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Made-with-love tag */}
        <p className="mt-5 text-center text-[11px] text-slate-600 flex items-center justify-center gap-1">
          Made with <Heart className="h-3 w-3 text-pink-600 fill-pink-600" /> for breast cancer awareness in India
        </p>
      </div>
    </footer>
  );
}

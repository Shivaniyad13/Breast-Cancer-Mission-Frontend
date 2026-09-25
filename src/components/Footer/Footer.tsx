"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  ShieldCheck,
} from "lucide-react";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterXIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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
    <polygon
      points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
      fill="#ffffff"
    />
  </svg>
);

const quickLinks = [
  { label: "Support Patients", href: "/donate" },
  { label: "Webinars", href: "/webinars" },
  { label: "About", href: "/about" },
  { label: "Self-Examination Guide", href: "/learn/bse-guide" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { icon: FacebookIcon, href: "https://facebook.com", label: "Facebook" },
  { icon: TwitterXIcon, href: "https://twitter.com", label: "Twitter" },
  { icon: LinkedinIcon, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: YoutubeIcon, href: "https://youtube.com", label: "YouTube" },
];

const HEAD_OFFICE_ADDRESS = "B-14 Sector 64, Noida, Uttar Pradesh, India – 201309";
const MAP_EMBED_SRC =
  "https://www.google.com/maps?q=Sector%2064%2C%20Noida%2C%20Uttar%20Pradesh%20201309&output=embed";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative">
      {/* ============ CLINICAL DISCLAIMER SECTION (Top) ============ */}
      <div className="relative bg-gradient-to-r from-pink-50 via-pink-50/70 to-pink-50 border-t border-pink-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-5xl mx-auto flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-pink-100 shadow-sm">
            <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-pink-100 text-pink-600 shrink-0">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong className="text-slate-900 font-bold">
                Clinical Disclaimer:
              </strong>{" "}
              The educational details shared on this portal are designed to
              spread public awareness and must not substitute formal medical
              advice, clinical diagnostics, or professional therapeutic
              guidance. Always seek counsel from a registered physician or
              oncology practitioner regarding symptoms or screenings.
            </p>
          </div>
        </div>
      </div>

      {/* ============ MAIN FOOTER ============ */}
      <div
        className="relative bg-white text-slate-700 border-t border-pink-100"
        style={{
          background:
            "linear-gradient(to bottom, #ffffff 0%, #fff8fb 40%, #fdf2f8 100%)",
        }}
      >
        {/* Top pink accent line */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-pink-300 via-pink-400 to-pink-300" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* ── Col 1 · Brand ── */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-pink-50 border border-pink-100 overflow-hidden p-1 shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="Cancer Mukt Bharat Abhiyan Logo"
                    width={100}
                    height={100}
                    className="h-full w-full object-contain"
                    priority
                  />
                </div>

                <div className="font-heading flex flex-col leading-[1.1] tracking-tight">
                  <span className="text-base sm:text-lg font-bold text-primary">
                    Cancer Mukt
                  </span>
                  <span className="text-base sm:text-lg font-bold text-slate-900">
                    Bharat Abhiyan
                  </span>
                </div>
              </div>

              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                A trusted unified healthcare portal spreading early detection
                knowledge, hosting expert webinars, and coordinating verified
                crowdfunding support for breast cancer patients.
              </p>

              {/* Social media links */}
              <div className="flex items-center gap-3 pt-1">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex items-center justify-center h-9 w-9 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-all duration-200 shadow-sm shadow-pink-500/20"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* ── Col 2 · Quick Links ── */}
            <div className="space-y-5">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-pink-600">
                Quick Links
              </h3>

              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block text-sm font-semibold text-slate-700 hover:text-primary hover:bg-pink-50 rounded-lg px-3 py-1.5 -mx-3 transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={scrollToTop}
                    className="w-full text-left text-sm font-semibold text-slate-700 hover:text-primary hover:bg-pink-50 rounded-lg px-3 py-1.5 -mx-3 transition-colors duration-150 cursor-pointer"
                  >
                    Back to Top
                  </button>
                </li>
              </ul>
            </div>

            {/* ── Col 3 · Location + Contact ── */}
            <div className="space-y-5">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-pink-600">
                Get In Touch
              </h3>

              {/* Map embed */}
              <div className="rounded-xl overflow-hidden border border-pink-100 shadow-sm shadow-pink-900/5 bg-white">
                <iframe
                  title="Cancer Mukt Bharat Abhiyan Location"
                  src={MAP_EMBED_SRC}
                  width="100%"
                  height="180"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block w-full"
                />
              </div>

              {/* Phone & Email */}
              <div className="space-y-2.5">
                <a
                  href="tel:+919217396124"
                  className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 hover:text-primary transition-colors group"
                >
                  <Phone className="h-4 w-4 text-pink-500 group-hover:scale-110 transition-transform" />
                  +91 9217396124
                </a>

                <a
                  href="mailto:admin@cmba.in"
                  className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 hover:text-primary transition-colors group"
                >
                  <Mail className="h-4 w-4 text-pink-500 group-hover:scale-110 transition-transform" />
                  admin@cmba.in
                </a>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                <MapPin className="h-4 w-4 text-pink-500 mt-0.5 flex-shrink-0" />
                <span>{HEAD_OFFICE_ADDRESS}</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-12 border-t border-pink-100" />

          {/* Bottom bar */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs font-medium text-slate-500 text-center sm:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="text-slate-900 font-bold">
                Cancer Mukt Bharat Abhiyan
              </span>{" "}
              All rights reserved.
            </p>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <Link
                href="/privacy"
                className="font-semibold hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="font-semibold hover:text-primary transition-colors"
              >
                Terms of Use
              </Link>

              <button
                onClick={scrollToTop}
                aria-label="Back to top"
                className="flex items-center justify-center h-7 w-7 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition-all duration-200 shadow-sm shadow-pink-500/20 cursor-pointer"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
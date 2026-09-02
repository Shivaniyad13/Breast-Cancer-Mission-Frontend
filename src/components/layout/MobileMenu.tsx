"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  ChevronDown, 
  Ribbon, 
  LogOut, 
  LayoutDashboard 
} from "lucide-react";

interface MobileMenuProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  handleSignOut: () => Promise<void>;
  isCampaignPage?: boolean;
}

export default function MobileMenu({ user, handleSignOut, isCampaignPage = false }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Lock body scrolling when the menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setOpenSection(null);
  };

  return (
    <div className="lg:hidden flex items-center z-50">
      {/* Hamburger Trigger - Styled with 48px touch-friendly target size */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 -mr-3 text-zinc-300 hover:text-white transition-colors cursor-pointer rounded-lg focus:outline-none"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Redesigned Full-screen Mobile Menu Drawer */}
      <div
        className={`fixed inset-x-0 top-0 bottom-0 z-[100] w-full h-[100dvh] border-0 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl transition-all duration-300 flex flex-col justify-between ${
          isOpen ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible"
        }`}
        style={{ backgroundColor: "#ffffff", color: "#1e191c" }}
      >
        <div className="flex flex-col h-full justify-between">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b shrink-0" style={{ borderColor: "#fce7f3" }}>
            {isCampaignPage ? (
              <Link href="/" onClick={closeMenu} className="flex items-center gap-1.5">
                <Ribbon className="h-5 w-5 text-primary animate-pulse" />
                <span className="font-heading text-base font-extrabold tracking-tight text-slate-900">
                  Khushi <span className="text-primary">Centre</span>
                </span>
                <span className="text-pink-600 text-xs font-semibold px-1 border-l border-pink-200">
                  Campaign
                </span>
              </Link>
            ) : (
              <Link href="/" onClick={closeMenu} className="flex items-center gap-1.5">
                <Ribbon className="h-5 w-5 text-primary animate-pulse" />
                <span className="font-heading text-base font-extrabold tracking-tight text-slate-900">
                  Cancer <span className="text-primary">Mission</span>
                </span>
              </Link>
            )}
            
            {/* Close Button - fixed/absolute top-right with 44px+ touch-friendly target */}
            <button
              onClick={closeMenu}
              className="p-3 -mr-3 text-slate-500 hover:text-primary transition-colors cursor-pointer rounded-lg focus:outline-none"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links Scroll Container */}
          <nav className="flex-1 overflow-y-auto py-6 pr-1 space-y-5 my-2 no-scrollbar">
            {isCampaignPage ? (
              <>
                <a
                  href="#hero"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#334155", borderColor: "#fce7f3" }}
                >
                  Home
                </a>
                <a
                  href="#about"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#334155", borderColor: "#fce7f3" }}
                >
                  About
                </a>
                <a
                  href="#breast-cancer-info"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#334155", borderColor: "#fce7f3" }}
                >
                  Breast Cancer
                </a>
                <a
                  href="#doctors"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#334155", borderColor: "#fce7f3" }}
                >
                  Doctors
                </a>
                <a
                  href="#research"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#334155", borderColor: "#fce7f3" }}
                >
                  Research
                </a>
                <a
                  href="#events"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#334155", borderColor: "#fce7f3" }}
                >
                  Events
                </a>
                <a
                  href="#volunteer"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#334155", borderColor: "#fce7f3" }}
                >
                  Volunteer
                </a>
                <Link
                  href="/donate"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#334155", borderColor: "#fce7f3" }}
                >
                  Donate
                </Link>
                <a
                  href="#contact"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#334155", borderColor: "#fce7f3" }}
                >
                  Contact
                </a>
              </>
            ) : (
              <>
                {/* Home */}
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#334155", borderColor: "#fce7f3" }}
                >
                  Home
                </Link>

                {/* Campaign Section */}
                <div>
                  <button
                    onClick={() => toggleSection("campaign")}
                    className="flex items-center justify-between w-full text-base font-semibold py-2.5 text-left border-b cursor-pointer"
                    style={{ color: "#334155", borderColor: "#fce7f3" }}
                  >
                    <span>Campaign</span>
                    <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${openSection === "campaign" ? "rotate-180 text-primary" : ""}`} />
                  </button>
                  {openSection === "campaign" && (
                    <div className="pl-4 mt-2 space-y-2 border-l-2 animate-in fade-in duration-200" style={{ borderColor: "#f472b6" }}>
                      <Link href="/campaigns/education" onClick={closeMenu} className="block text-sm py-2 transition-colors font-medium text-slate-600 hover:text-pink-600">Education</Link>
                      <Link href="/campaigns/awareness" onClick={closeMenu} className="block text-sm py-2 transition-colors font-medium text-slate-600 hover:text-pink-600">Our Activities</Link>
                      <Link href="/campaigns/membership" onClick={closeMenu} className="block text-sm py-2 transition-colors font-medium text-slate-600 hover:text-pink-600">Membership</Link>
                      <Link href="/campaigns/volunteers" onClick={closeMenu} className="block text-sm py-2 transition-colors font-medium text-slate-600 hover:text-pink-600">Volunteers</Link>
                    </div>
                  )}
                </div>

                {/* Care Section */}
                <div>
                  <button
                    onClick={() => toggleSection("care")}
                    className="flex items-center justify-between w-full text-base font-semibold py-2.5 text-left border-b cursor-pointer"
                    style={{ color: "#334155", borderColor: "#fce7f3" }}
                  >
                    <span>Care</span>
                    <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${openSection === "care" ? "rotate-180 text-primary" : ""}`} />
                  </button>
                  {openSection === "care" && (
                    <div className="pl-4 mt-2 space-y-2 border-l-2 animate-in fade-in duration-200" style={{ borderColor: "#f472b6" }}>
                      <Link href="/care/care-providers" onClick={closeMenu} className="block text-sm py-2 transition-colors font-medium text-slate-600 hover:text-pink-600">Care Providers</Link>
                      <Link href="/care/healthcare-professionals" onClick={closeMenu} className="block text-sm py-2 transition-colors font-medium text-slate-600 hover:text-pink-600">Healthcare Professionals</Link>
                      <Link href="/care/partner-organizations" onClick={closeMenu} className="block text-sm py-2 transition-colors font-medium text-slate-600 hover:text-pink-600">Partner Organizations</Link>
                    </div>
                  )}
                </div>

                {/* Cure Section */}
                <div>
                  <button
                    onClick={() => toggleSection("cure")}
                    className="flex items-center justify-between w-full text-base font-semibold py-2.5 text-left border-b cursor-pointer"
                    style={{ color: "#334155", borderColor: "#fce7f3" }}
                  >
                    <span>Cure</span>
                    <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${openSection === "cure" ? "rotate-180 text-primary" : ""}`} />
                  </button>
                  {openSection === "cure" && (
                    <div className="pl-4 mt-2 space-y-2 border-l-2 animate-in fade-in duration-200" style={{ borderColor: "#f472b6" }}>
                      <Link href="/diagnosis" onClick={closeMenu} className="block text-sm py-2 transition-colors font-medium text-slate-600 hover:text-pink-600">Diagnosis</Link>
                      <Link href="/treatment" onClick={closeMenu} className="block text-sm py-2 transition-colors font-medium text-slate-600 hover:text-pink-600">Treatment</Link>
                    </div>
                  )}
                </div>

                {/* About Us */}
                <Link
                  href="/about"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#334155", borderColor: "#fce7f3" }}
                >
                  About Us
                </Link>

                {/* Contact Us */}
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#334155", borderColor: "#fce7f3" }}
                >
                  Contact Us
                </Link>
              </>
            )}
          </nav>

          {/* Footer Actions / User Session Info - shrink-0 */}
          <div className="pt-6 border-t bg-pink-50/60 rounded-2xl p-4 shrink-0" style={{ borderColor: "#fce7f3" }}>
            {user ? (
              <div className="space-y-4">
                <div className="flex flex-col bg-white rounded-xl p-3 border border-pink-100">
                  <span className="text-sm font-bold text-slate-900 truncate">{user.name || user.email}</span>
                  <span className="text-[10px] font-black text-primary uppercase tracking-wider mt-0.5">{user.role}</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <Link href="/dashboard" onClick={closeMenu} className="w-full">
                    <Button variant="outline" className="w-full h-11 text-sm border-pink-200 text-slate-800 hover:text-primary hover:bg-pink-100 bg-white">
                      <LayoutDashboard className="h-4 w-4 mr-2 text-primary" /> Dashboard
                    </Button>
                  </Link>
                  <form action={async () => {
                    await handleSignOut();
                    closeMenu();
                  }} className="w-full m-0">
                    <Button type="submit" variant="destructive" className="w-full h-11 text-sm">
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Link href="/login" onClick={closeMenu} className="flex-1 w-full">
                    <Button variant="ghost" className="w-full h-11 text-sm font-bold border rounded-xl hover:bg-pink-100" style={{ color: "#1e191c", borderColor: "#fbcfe8", backgroundColor: "#ffffff" }}>
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={closeMenu} className="flex-1 w-full">
                    <Button className="w-full h-11 text-sm bg-primary text-white font-bold hover:bg-primary/90 rounded-xl border-0 shadow-md shadow-pink-600/20">
                      Get Started
                    </Button>
                  </Link>
                </div>
                <Link href="/donate" onClick={closeMenu} className="w-full">
                  <Button className="w-full h-11 text-sm bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl border-0 shadow-md shadow-pink-600/20">
                    Donate Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

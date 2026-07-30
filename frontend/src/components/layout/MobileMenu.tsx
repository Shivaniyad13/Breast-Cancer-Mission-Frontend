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
        style={{ backgroundColor: "#09090b", color: "#ffffff" }}
      >
        <div className="flex flex-col h-full justify-between">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b shrink-0" style={{ borderColor: "#18181b" }}>
            {isCampaignPage ? (
              <Link href="/" onClick={closeMenu} className="flex items-center gap-1.5">
                <Ribbon className="h-5 w-5 text-primary animate-pulse" />
                <span className="font-heading text-base font-extrabold tracking-tight text-white">
                  Khushi <span className="text-primary">Centre</span>
                </span>
                <span className="text-zinc-400 text-xs font-semibold px-1 border-l border-zinc-800" style={{ borderColor: "#27272a" }}>
                  Campaign
                </span>
              </Link>
            ) : (
              <Link href="/" onClick={closeMenu} className="flex items-center gap-1.5">
                <Ribbon className="h-5 w-5 text-primary animate-pulse" />
                <span className="font-heading text-base font-extrabold tracking-tight text-white">
                  Cancer <span className="text-primary">Mission</span>
                </span>
              </Link>
            )}
            
            {/* Close Button - fixed/absolute top-right with 44px+ touch-friendly target */}
            <button
              onClick={closeMenu}
              className="p-3 -mr-3 text-zinc-400 hover:text-primary transition-colors cursor-pointer rounded-lg focus:outline-none"
              aria-label="Close menu"
              style={{ color: "#a1a1aa" }}
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
                  style={{ color: "#e4e4e7", borderColor: "#18181b" }}
                >
                  Home
                </a>
                <a
                  href="#about"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#e4e4e7", borderColor: "#18181b" }}
                >
                  About
                </a>
                <a
                  href="#breast-cancer-info"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#e4e4e7", borderColor: "#18181b" }}
                >
                  Breast Cancer
                </a>
                <a
                  href="#doctors"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#e4e4e7", borderColor: "#18181b" }}
                >
                  Doctors
                </a>
                <a
                  href="#research"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#e4e4e7", borderColor: "#18181b" }}
                >
                  Research
                </a>
                <a
                  href="#events"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#e4e4e7", borderColor: "#18181b" }}
                >
                  Events
                </a>
                <a
                  href="#volunteer"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#e4e4e7", borderColor: "#18181b" }}
                >
                  Volunteer
                </a>
                <Link
                  href="/donate"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#e4e4e7", borderColor: "#18181b" }}
                >
                  Donate
                </Link>
                <a
                  href="#contact"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#e4e4e7", borderColor: "#18181b" }}
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
                  style={{ color: "#e4e4e7", borderColor: "#18181b" }}
                >
                  Home
                </Link>

                {/* Campaign Section */}
                <div>
                  <button
                    onClick={() => toggleSection("campaign")}
                    className="flex items-center justify-between w-full text-base font-semibold py-2.5 text-left border-b cursor-pointer"
                    style={{ color: "#e4e4e7", borderColor: "#18181b" }}
                  >
                    <span>Campaign</span>
                    <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${openSection === "campaign" ? "rotate-180" : ""}`} />
                  </button>
                  {openSection === "campaign" && (
                    <div className="pl-4 mt-2 space-y-2 border-l-2 animate-in fade-in duration-200" style={{ borderColor: "rgba(236,72,153,0.2)" }}>
                      <Link href="/campaigns/education" onClick={closeMenu} className="block text-sm py-2 transition-colors hover:text-white" style={{ color: "#a1a1aa" }}>Education</Link>
                      <Link href="/campaigns/awareness" onClick={closeMenu} className="block text-sm py-2 transition-colors hover:text-white" style={{ color: "#a1a1aa" }}>Our Activities</Link>
                      <Link href="/campaigns/membership" onClick={closeMenu} className="block text-sm py-2 transition-colors hover:text-white" style={{ color: "#a1a1aa" }}>Membership</Link>
                      <Link href="/campaigns/volunteers" onClick={closeMenu} className="block text-sm py-2 transition-colors hover:text-white" style={{ color: "#a1a1aa" }}>Volunteers</Link>
                    </div>
                  )}
                </div>

                {/* Care Section */}
                <div>
                  <button
                    onClick={() => toggleSection("care")}
                    className="flex items-center justify-between w-full text-base font-semibold py-2.5 text-left border-b cursor-pointer"
                    style={{ color: "#e4e4e7", borderColor: "#18181b" }}
                  >
                    <span>Care</span>
                    <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${openSection === "care" ? "rotate-180" : ""}`} />
                  </button>
                  {openSection === "care" && (
                    <div className="pl-4 mt-2 space-y-2 border-l-2 animate-in fade-in duration-200" style={{ borderColor: "rgba(236,72,153,0.2)" }}>
                      <Link href="/care/care-providers" onClick={closeMenu} className="block text-sm py-2 transition-colors hover:text-white" style={{ color: "#a1a1aa" }}>Care Providers</Link>
                      <Link href="/care/healthcare-professionals" onClick={closeMenu} className="block text-sm py-2 transition-colors hover:text-white" style={{ color: "#a1a1aa" }}>Healthcare Professionals</Link>
                      <Link href="/care/partner-organizations" onClick={closeMenu} className="block text-sm py-2 transition-colors hover:text-white" style={{ color: "#a1a1aa" }}>Partner Organizations</Link>
                    </div>
                  )}
                </div>

                {/* Cure Section */}
                <div>
                  <button
                    onClick={() => toggleSection("cure")}
                    className="flex items-center justify-between w-full text-base font-semibold py-2.5 text-left border-b cursor-pointer"
                    style={{ color: "#e4e4e7", borderColor: "#18181b" }}
                  >
                    <span>Cure</span>
                    <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${openSection === "cure" ? "rotate-180" : ""}`} />
                  </button>
                  {openSection === "cure" && (
                    <div className="pl-4 mt-2 space-y-2 border-l-2 animate-in fade-in duration-200" style={{ borderColor: "rgba(236,72,153,0.2)" }}>
                      <Link href="/diagnosis" onClick={closeMenu} className="block text-sm py-2 transition-colors hover:text-white" style={{ color: "#a1a1aa" }}>Diagnosis</Link>
                      <Link href="/treatment" onClick={closeMenu} className="block text-sm py-2 transition-colors hover:text-white" style={{ color: "#a1a1aa" }}>Treatment</Link>
                    </div>
                  )}
                </div>

                {/* About Us */}
                <Link
                  href="/about"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#e4e4e7", borderColor: "#18181b" }}
                >
                  About Us
                </Link>

                {/* Contact Us */}
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="block text-base font-semibold py-2.5 transition-colors border-b"
                  style={{ color: "#e4e4e7", borderColor: "#18181b" }}
                >
                  Contact Us
                </Link>
              </>
            )}
          </nav>

          {/* Footer Actions / User Session Info - shrink-0 */}
          <div className="pt-6 border-t bg-zinc-950 shrink-0" style={{ borderColor: "#18181b" }}>
            {user ? (
              <div className="space-y-4">
                <div className="flex flex-col bg-zinc-900 rounded-xl p-3">
                  <span className="text-sm font-bold text-white truncate">{user.name || user.email}</span>
                  <span className="text-[10px] font-black text-primary uppercase tracking-wider mt-0.5">{user.role}</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <Link href="/dashboard" onClick={closeMenu} className="w-full">
                    <Button variant="outline" className="w-full h-11 text-sm border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 bg-transparent">
                      <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
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
                    <Button variant="ghost" className="w-full h-11 text-sm font-bold hover:text-white hover:bg-zinc-900 border" style={{ color: "#e4e4e7", borderColor: "#18181b", backgroundColor: "transparent" }}>
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={closeMenu} className="flex-1 w-full">
                    <Button className="w-full h-11 text-sm bg-primary text-white font-bold hover:bg-primary/90 border-0">
                      Get Started
                    </Button>
                  </Link>
                </div>
                <Link href="/donate" onClick={closeMenu} className="w-full">
                  <Button className="w-full h-11 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold border-0">
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

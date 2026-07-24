"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  ChevronDown, 
  Ribbon, 
  Heart, 
  ShieldCheck, 
  User, 
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
}

export default function MobileMenu({ user, handleSignOut }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setOpenSection(null);
  };

  return (
    <div className="md:hidden flex items-center z-50">
      {/* Hamburger Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -mr-2 text-foreground/80 hover:text-primary transition-colors cursor-pointer"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white dark:bg-slate-900 border-l border-border p-6 shadow-2xl transition-all duration-300 flex flex-col justify-between ${
          isOpen ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible"
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <Link href="/" onClick={closeMenu} className="flex items-center gap-1.5">
              <Ribbon className="h-5 w-5 text-primary animate-pulse" />
              <span className="font-heading text-sm font-bold tracking-tight text-foreground">
                Cancer <span className="text-primary">Mission</span>
              </span>
            </Link>
            <button
              onClick={closeMenu}
              className="p-2 -mr-2 text-foreground/70 hover:text-primary transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-4 pt-6">
            {/* Home */}
            <Link
              href="/"
              onClick={closeMenu}
              className="block text-sm font-semibold text-foreground/90 hover:text-primary py-1.5 transition-colors border-b border-border/40"
            >
              Home
            </Link>

            {/* Campaign Section */}
            <div>
              <button
                onClick={() => toggleSection("campaign")}
                className="flex items-center justify-between w-full text-sm font-semibold text-foreground/90 hover:text-primary py-1.5 text-left border-b border-border/40 cursor-pointer"
              >
                <span>Campaign</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openSection === "campaign" ? "rotate-180" : ""}`} />
              </button>
              {openSection === "campaign" && (
                <div className="pl-4 mt-2 space-y-2 border-l border-pink-500/20">
                  <Link href="/campaigns/education" onClick={closeMenu} className="block text-xs text-muted-foreground hover:text-primary py-1">Education</Link>
                  <Link href="/campaigns/awareness" onClick={closeMenu} className="block text-xs text-muted-foreground hover:text-primary py-1">Awareness</Link>
                  <Link href="/campaigns/membership" onClick={closeMenu} className="block text-xs text-muted-foreground hover:text-primary py-1">Membership</Link>
                  <Link href="/campaigns/volunteers" onClick={closeMenu} className="block text-xs text-muted-foreground hover:text-primary py-1">Volunteers</Link>
                </div>
              )}
            </div>

            {/* Care Section */}
            <div>
              <button
                onClick={() => toggleSection("care")}
                className="flex items-center justify-between w-full text-sm font-semibold text-foreground/90 hover:text-primary py-1.5 text-left border-b border-border/40 cursor-pointer"
              >
                <span>Care</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openSection === "care" ? "rotate-180" : ""}`} />
              </button>
              {openSection === "care" && (
                <div className="pl-4 mt-2 space-y-2 border-l border-pink-500/20">
                  <Link href="/care/care-providers" onClick={closeMenu} className="block text-xs text-muted-foreground hover:text-primary py-1">Care Providers</Link>
                  <Link href="/care/healthcare-professionals" onClick={closeMenu} className="block text-xs text-muted-foreground hover:text-primary py-1">Healthcare Professionals</Link>
                  <Link href="/care/partner-organizations" onClick={closeMenu} className="block text-xs text-muted-foreground hover:text-primary py-1">Partner Organizations</Link>
                </div>
              )}
            </div>

            {/* Cure Section */}
            <div>
              <button
                onClick={() => toggleSection("cure")}
                className="flex items-center justify-between w-full text-sm font-semibold text-foreground/90 hover:text-primary py-1.5 text-left border-b border-border/40 cursor-pointer"
              >
                <span>Cure</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openSection === "cure" ? "rotate-180" : ""}`} />
              </button>
              {openSection === "cure" && (
                <div className="pl-4 mt-2 space-y-2 border-l border-pink-500/20">
                  <Link href="/diagnosis" onClick={closeMenu} className="block text-xs text-muted-foreground hover:text-primary py-1">Diagnosis</Link>
                  <Link href="/treatment" onClick={closeMenu} className="block text-xs text-muted-foreground hover:text-primary py-1">Treatment</Link>
                </div>
              )}
            </div>

            {/* Contact Us */}
            <Link
              href="/contact"
              onClick={closeMenu}
              className="block text-sm font-semibold text-foreground/90 hover:text-primary py-1.5 transition-colors border-b border-border/40"
            >
              Contact Us
            </Link>

            {/* Donate Now Button */}
            <Link href="/donate" onClick={closeMenu} className="block pt-2">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase shadow-sm">
                Donate Now
              </Button>
            </Link>

            {/* About Us */}
            <Link
              href="/about"
              onClick={closeMenu}
              className="block text-sm font-semibold text-foreground/90 hover:text-primary py-1.5 transition-colors border-b border-border/40"
            >
              About Us
            </Link>
          </nav>
        </div>

        {/* Footer / User Session Info */}
        <div className="pt-6 border-t border-border">
          {user ? (
            <div className="space-y-4">
              <div className="flex flex-col bg-muted/50 rounded-xl p-3">
                <span className="text-xs font-bold text-foreground truncate">{user.name || user.email}</span>
                <span className="text-[9px] font-black text-primary uppercase tracking-wider mt-0.5">{user.role}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/dashboard" onClick={closeMenu} className="w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                    <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
                  </Button>
                </Link>
                <form action={handleSignOut} className="w-full m-0">
                  <Button type="submit" variant="destructive" size="sm" className="w-full text-xs gap-1.5">
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link href="/login" onClick={closeMenu}>
                <Button variant="ghost" size="sm" className="w-full text-xs font-bold">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={closeMenu}>
                <Button size="sm" className="w-full text-xs bg-primary text-white font-bold">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MobileMenu from "@/components/layout/MobileMenu";
import {
  getCurrentUserAction,
  logoutUserAction,
} from "@/app/actions/auth";

/* ── Hover dropdown (pure CSS, opens on hover) ── */
function HoverDropdown({
  label,
  items,
  width = "w-48",
  href,
}: {
  label: string;
  items: { label: string; href: string }[];
  width?: string;
  href?: string;
}) {
  return (
    <div className="relative group">
      {href ? (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-pink-700 cursor-pointer select-none outline-none"
        >
          {label}
          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
        </Link>
      ) : (
        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-pink-700 cursor-pointer select-none outline-none"
        >
          {label}
          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
        </button>
      )}

      {/* pt-2 creates an invisible bridge so hover doesn't break between trigger and menu */}
      <div
        className={`absolute top-full left-0 pt-2 z-50 ${width} opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out`}
      >
        <div className="bg-white border border-pink-100 rounded-xl shadow-lg p-1.5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-pink-50 focus:bg-pink-50 hover:text-pink-700 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const campaignItems = [
  { label: "Delhi University Event", href: "/campaigns/delhi-university" },
  { label: "Education", href: "/campaigns/education" },
  { label: "Our Activities", href: "/campaigns/awareness" },
  { label: "Membership", href: "/campaigns/membership" },
  { label: "Volunteers", href: "/campaigns/volunteers" },
];

const careItems = [
  { label: "Care Providers", href: "/care/care-providers" },
  { label: "Healthcare Professionals", href: "/care/healthcare-professionals" },
  { label: "Partner Organizations", href: "/care/partner-organizations" },
];

const cureItems = [
  { label: "Diagnosis", href: "/diagnosis" },
  { label: "Treatment", href: "/treatment" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isCampaignPage = pathname?.startsWith("/campaigns/breast-cancer");
  const [isScrolled, setIsScrolled] = useState(false);

  const [user, setUser] = useState<{
    name?: string | null;
    email?: string | null;
    role?: string;
  } | undefined>(undefined);

  // Loading state — isse LOGIN / Get Started ka flash nahi hoga
  const [authLoading, setAuthLoading] = useState(true);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auth fetch — pathname change pe bhi refetch hoga
  useEffect(() => {
    let mounted = true;
    setAuthLoading(true);

    getCurrentUserAction()
      .then((sessionData) => {
        if (!mounted) return;
        if (sessionData?.userId) {
          setUser({
            name: sessionData.fullName || sessionData.user?.name || "User",
            email: sessionData.user?.email || "",
            role: sessionData.role,
          });
        } else {
          setUser(undefined);
        }
      })
      .catch(() => {
        if (mounted) setUser(undefined);
      })
      .finally(() => {
        if (mounted) setAuthLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [pathname]);

  // 👇 UPDATED: Sign out with proper error handling
  const handleSignOut = async () => {
    console.log("🔴 Sign out clicked");

    try {
      await logoutUserAction();
      console.log("✅ logoutUserAction complete");
    } catch (err) {
      console.error("❌ logout error:", err);
    }

    setUser(undefined);

    console.log("➡️ Redirecting to /");
    window.location.replace("/");
  };

  const headerClass = isCampaignPage
    ? `fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 h-20 ${isScrolled
      ? "bg-white/90 border-b border-pink-100 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/80 text-slate-800"
      : "bg-transparent border-b border-transparent text-slate-800"
    }`
    : "fixed top-0 left-0 right-0 w-full z-50 h-20 border-b border-pink-100 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 text-slate-800";

  return (
    <header className={headerClass}>
      <div className="container mx-auto relative flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Branding */}
        <div className="flex items-center gap-2 z-10">
          {isCampaignPage ? (
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center gap-1 bg-pink-50 px-2 sm:px-3 py-1.5 rounded-xl border border-pink-200 shadow-xs">
                <Image
                  src="/logo.png"
                  alt="Khushi Centre Logo"
                  width={80}
                  height={80}
                  className="h-5 w-5 sm:h-6 sm:w-6 object-contain shrink-0"
                  priority
                />
                <span className="font-heading text-xs sm:text-sm font-bold tracking-tight text-slate-900">
                  Khushi <span className="text-primary">Centre</span>
                </span>
                <span className="text-pink-600 text-[11px] sm:text-xs font-semibold px-1.5 border-l border-pink-200 hidden min-[360px]:inline-block">
                  Campaign
                </span>
              </div>
              <span className="hidden xl:inline-block text-[11px] text-pink-700 font-bold bg-pink-100/60 px-2 py-1 rounded-md">
                An Initiative by Khushi Centre
              </span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-1.5">
              <Image
                src="/logo.png"
                alt="Cancer Mukt Bharat Abhiyan Logo"
                width={80}
                height={80}
                className="h-8 w-auto sm:h-10 md:h-12 object-contain shrink-0"
                priority
              />
              <span className="font-heading flex flex-col leading-[1.1] tracking-tight whitespace-nowrap text-sm sm:text-base md:text-lg font-bold">
                <span className="text-primary">Cancer Mukt</span>
                <span className="text-slate-900">Bharat Abhiyan</span>
              </span>
            </Link>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-3 lg:gap-5 xl:gap-7 absolute left-1/2 -translate-x-1/2 z-0">
          {isCampaignPage ? (
            <>
              <a href="#hero" className="text-[13px] font-medium text-slate-600 hover:text-pink-700 transition-colors">Home</a>
              <a href="#about" className="text-[13px] font-medium text-slate-600 hover:text-pink-700 transition-colors">About</a>
              <a href="#breast-cancer-info" className="text-[13px] font-medium text-slate-600 hover:text-pink-700 transition-colors">Breast Cancer</a>
              <a href="#doctors" className="text-[13px] font-medium text-slate-600 hover:text-pink-700 transition-colors">Doctors</a>
              <a href="#research" className="text-[13px] font-medium text-slate-600 hover:text-pink-700 transition-colors">Research</a>
              <a href="#events" className="text-[13px] font-medium text-slate-600 hover:text-pink-700 transition-colors">Events</a>
              <a href="#volunteer" className="text-[13px] font-medium text-slate-600 hover:text-pink-700 transition-colors">Volunteer</a>
              <Link href="/donate" className="text-[13px] font-medium text-slate-600 hover:text-pink-700 transition-colors">Support</Link>
              <a href="#contact" className="text-[13px] font-medium text-slate-600 hover:text-pink-700 transition-colors">Contact</a>
            </>
          ) : (
            <>
              <Link href="/" className="text-sm font-medium text-slate-600 transition-colors hover:text-pink-700">Home</Link>

              {/* Hover dropdowns — open on hover, no click needed */}
              <HoverDropdown label="Campaign" href="/campaigns/delhi-university" items={campaignItems} width="w-56" />
              <HoverDropdown label="Care" items={careItems} width="w-56" />
              <HoverDropdown label="Cure" items={cureItems} width="w-48" />

              <Link href="/donate" className="flex items-center">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-pink-300 text-pink-700 bg-pink-50/60 hover:bg-pink-100 hover:text-pink-800 font-medium transition-colors cursor-pointer rounded-lg h-9 px-4"
                >
                  Support Us
                </Button>
              </Link>

              <Link href="/about" className="text-sm font-medium text-slate-600 transition-colors hover:text-pink-700">About</Link>
              <Link href="/contact" className="text-sm font-medium text-slate-600 transition-colors hover:text-pink-700">Contact</Link>
            </>
          )}
        </nav>

        {/* Right — Auth */}
        <div className="flex items-center gap-4 z-10">
          <div className="hidden lg:flex items-center gap-4">
            {authLoading ? (
              // Loading skeleton — LOGIN / Get Started ka flash rokta hai
              <div className="h-10 w-32 bg-slate-100 animate-pulse rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="relative inline-flex items-center justify-center h-10 rounded-full px-3 text-sm font-semibold text-slate-700 hover:bg-pink-50 hover:text-pink-700 border border-pink-200 cursor-pointer transition-colors bg-white select-none">
                  {user.name || user.email}
                  <span className="ml-2 text-[11px] bg-pink-50 text-pink-700 border border-pink-100 px-1.5 py-0.5 rounded-md font-semibold ">
                    {user.role}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-white border-pink-100 text-slate-800 shadow-lg"
                  align="end"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal text-slate-500">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-slate-900">{user.name}</p>
                        <p className="text-xs leading-none text-slate-500">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-pink-100" />
                  <DropdownMenuItem className="hover:bg-pink-50 focus:bg-pink-50 cursor-pointer">
                    <Link href="/dashboard" className="w-full block text-slate-800">Dashboard</Link>
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem className="hover:bg-pink-50 focus:bg-pink-50 cursor-pointer">
                      <Link href="/admin" className="text-primary font-medium w-full block">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-pink-100" />
                  <DropdownMenuItem
                    className="hover:bg-pink-50 focus:bg-pink-50 cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => handleSignOut()}
                  >
                    <span className="w-full text-left font-medium cursor-pointer text-sm text-rose-600">
                      Sign Out
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-pink-700 hover:bg-pink-50 h-10 px-4 font-medium text-sm"
                  >
                    Login
                  </Button>
                </Link>
                {isCampaignPage ? (
                  <Link href="/register">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-pink-200 text-pink-700 hover:bg-pink-50 h-10 px-4 font-medium text-sm bg-white"
                    >
                      Register
                    </Button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-pink-700 text-white font-medium shadow-sm h-10 px-5"
                    >
                      Sign Up
                    </Button>
                  </Link>
                )}
              </>
            )}

            {isCampaignPage && !authLoading && (
              <Link href="/donate">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm px-5 py-2 h-10 shadow-sm">
                  Donate Now
                </Button>
              </Link>
            )}
          </div>

          <MobileMenu
            user={user ? { name: user.name, email: user.email, role: user.role } : undefined}
            handleSignOut={handleSignOut}
            isCampaignPage={isCampaignPage}
          />
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-300/70 to-transparent" />
    </header>
  );
}
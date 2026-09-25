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

export default function Navbar() {
  const pathname = usePathname();
  const isCampaignPage = pathname?.startsWith("/campaigns/breast-cancer");
  const [isScrolled, setIsScrolled] = useState(false);

  const [user, setUser] = useState<{
    name?: string | null;
    email?: string | null;
    role?: string;
  } | undefined>(undefined);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auth fetch via server action (no cookies, no /api route)
  useEffect(() => {
    let mounted = true;
    getCurrentUserAction()
      .then((sessionData) => {
        if (!mounted || !sessionData?.userId) return;
        setUser({
          name: sessionData.fullName || sessionData.user?.name || "User",
          email: sessionData.user?.email || "",
          role: sessionData.role,
        });
      })
      .catch(() => {
        /* ignore */
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    await logoutUserAction();
    setUser(undefined);
    window.location.href = "/";
  };

  const headerClass = isCampaignPage
    ? `fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 h-20 ${
        isScrolled
          ? "bg-white/95 border-b border-pink-100 shadow-md backdrop-blur supports-[backdrop-filter]:bg-white/90 text-slate-800"
          : "bg-transparent border-b border-transparent text-slate-800"
      }`
    : "fixed top-0 left-0 right-0 w-full z-50 h-20 border-b border-pink-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 text-slate-800 shadow-xs";

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
                <span className="font-heading text-xs sm:text-sm font-extrabold tracking-tight text-slate-900">
                  Khushi <span className="text-primary">Centre</span>
                </span>
                <span className="text-pink-600 text-[10px] sm:text-xs font-semibold px-1.5 border-l border-pink-200 hidden min-[360px]:inline-block">
                  Campaign
                </span>
              </div>
              <span className="hidden xl:inline-block text-[10px] text-pink-700 font-bold tracking-wider uppercase bg-pink-100/60 px-2 py-1 rounded-md">
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
              <span className="font-heading text-sm sm:text-base md:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                Cancer Mukt Bharat <span className="text-primary">Abhiyan</span>
              </span>
            </Link>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-3 lg:gap-5 xl:gap-7 absolute left-1/2 -translate-x-1/2 z-0">
          {isCampaignPage ? (
            <>
              <a href="#hero" className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-primary transition-colors">Home</a>
              <a href="#about" className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-primary transition-colors">About</a>
              <a href="#breast-cancer-info" className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-primary transition-colors">Breast Cancer</a>
              <a href="#doctors" className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-primary transition-colors">Doctors</a>
              <a href="#research" className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-primary transition-colors">Research</a>
              <a href="#events" className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-primary transition-colors">Events</a>
              <a href="#volunteer" className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-primary transition-colors">Volunteer</a>
              <Link href="/donate" className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-primary transition-colors">Donate</Link>
              <a href="#contact" className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-primary transition-colors">Contact</a>
            </>
          ) : (
            <>
              <Link href="/" className="text-sm font-semibold text-slate-700 transition-colors hover:text-primary">Home</Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold text-slate-700 transition-colors hover:text-primary cursor-pointer select-none outline-none">
                  Campaign <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white border-pink-100 text-slate-800 shadow-xl shadow-pink-900/10">
                  <DropdownMenuItem className="hover:bg-pink-50 focus:bg-pink-50 hover:text-primary cursor-pointer">
                    <Link href="/campaigns/education" className="w-full block">Education</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-pink-50 focus:bg-pink-50 hover:text-primary cursor-pointer">
                    <Link href="/campaigns/awareness" className="w-full block">Our Activities</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-pink-50 focus:bg-pink-50 hover:text-primary cursor-pointer">
                    <Link href="/campaigns/membership" className="w-full block">Membership</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-pink-50 focus:bg-pink-50 hover:text-primary cursor-pointer">
                    <Link href="/campaigns/volunteers" className="w-full block">Volunteers</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold text-slate-700 transition-colors hover:text-primary cursor-pointer select-none outline-none">
                  Care <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border-pink-100 text-slate-800 shadow-xl shadow-pink-900/10">
                  <DropdownMenuItem className="hover:bg-pink-50 focus:bg-pink-50 hover:text-primary cursor-pointer">
                    <Link href="/care/care-providers" className="w-full block">Care Providers</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-pink-50 focus:bg-pink-50 hover:text-primary cursor-pointer">
                    <Link href="/care/healthcare-professionals" className="w-full block">Healthcare Professionals</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-pink-50 focus:bg-pink-50 hover:text-primary cursor-pointer">
                    <Link href="/care/partner-organizations" className="w-full block">Partner Organizations</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold text-slate-700 transition-colors hover:text-primary cursor-pointer select-none outline-none">
                  Cure <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white border-pink-100 text-slate-800 shadow-xl shadow-pink-900/10">
                  <DropdownMenuItem className="hover:bg-pink-50 focus:bg-pink-50 hover:text-primary cursor-pointer">
                    <Link href="/diagnosis" className="w-full block">Diagnosis</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-pink-50 focus:bg-pink-50 hover:text-primary cursor-pointer">
                    <Link href="/treatment" className="w-full block">Treatment</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/donate" className="flex items-center">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white font-semibold transition-all duration-300 active:scale-95 cursor-pointer rounded-lg h-9 px-4 bg-transparent"
                >
                  Donate Now
                </Button>
              </Link>

              <Link href="/about" className="text-sm font-semibold text-slate-700 transition-colors hover:text-primary">About Us</Link>
              <Link href="/contact" className="text-sm font-semibold text-slate-700 transition-colors hover:text-primary">Contact Us</Link>
            </>
          )}
        </nav>

        {/* Right — Auth */}
        <div className="flex items-center gap-4 z-10">
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="relative inline-flex items-center justify-center h-10 rounded-full px-3 text-sm font-semibold text-slate-700 hover:bg-pink-50 hover:text-pink-700 border border-pink-200 cursor-pointer transition-colors bg-transparent select-none">
                  {user.name || user.email}
                  <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    {user.role}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-white border-pink-100 text-slate-800 shadow-xl shadow-pink-900/10"
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
                    onSelect={() => handleSignOut()}
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
                    className="text-slate-700 hover:text-pink-600 hover:bg-pink-50 h-10 px-4 font-semibold uppercase tracking-wider text-xs"
                  >
                    Login
                  </Button>
                </Link>
                {isCampaignPage ? (
                  <Link href="/register">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-pink-300 text-slate-700 hover:bg-pink-50 h-10 px-4 font-semibold uppercase tracking-wider text-xs bg-transparent"
                    >
                      Register
                    </Button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/95 text-white font-bold shadow-md shadow-pink-600/20 transition-transform active:scale-95 h-10 px-4"
                    >
                      Get Started
                    </Button>
                  </Link>
                )}
              </>
            )}

            {isCampaignPage && (
              <Link href="/donate">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase px-4 py-2 h-10 shadow-md shadow-pink-600/20">
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

      <div className="h-[2px] w-full bg-gradient-to-r from-pink-500/40 via-pink-400 to-pink-500/40 shadow-[0_1px_10px_rgba(236,72,153,0.3)]" />
    </header>
  );
}
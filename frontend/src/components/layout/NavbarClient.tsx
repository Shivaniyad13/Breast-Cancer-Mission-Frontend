"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Ribbon, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MobileMenu from "./MobileMenu";

interface NavbarClientProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  handleSignOut: () => Promise<void>;
}

export default function NavbarClient({ user, handleSignOut }: NavbarClientProps) {
  const pathname = usePathname();
  const isCampaignPage = pathname?.startsWith("/campaigns/breast-cancer");

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine navbar container classes
  const headerClass = isCampaignPage
    ? `fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 h-20 ${
        isScrolled
          ? "bg-black/95 border-b border-zinc-800 shadow-md backdrop-blur supports-[backdrop-filter]:bg-black/90 text-white"
          : "bg-transparent border-b border-transparent text-white"
      }`
    : "fixed top-0 left-0 right-0 w-full z-50 h-20 border-b border-zinc-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/90 text-white";

  return (
    <header className={headerClass}>
      <div className="container mx-auto relative flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Branding - Left aligned */}
        <div className="flex items-center gap-2 z-10">
          {isCampaignPage ? (
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center gap-1 bg-zinc-950/80 px-2 sm:px-3 py-1.5 rounded-xl border border-primary/20 shadow-xs">
                <Ribbon className="h-4.5 w-4.5 text-primary animate-pulse shrink-0" />
                <span className="font-heading text-xs sm:text-sm font-extrabold tracking-tight text-white">
                  Khushi <span className="text-primary">Centre</span>
                </span>
                <span className="text-zinc-400 text-[10px] sm:text-xs font-semibold px-1.5 border-l border-zinc-800 hidden min-[360px]:inline-block">
                  Campaign
                </span>
              </div>
              <span className="hidden xl:inline-block text-[10px] text-zinc-400 font-bold tracking-wider uppercase bg-zinc-900/60 px-2 py-1 rounded-md">
                An Initiative by Khushi Centre
              </span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-1.5">
              <Ribbon className="h-5 w-5 sm:h-6 sm:w-6 text-primary animate-pulse shrink-0" />
              <span className="font-heading text-sm sm:text-base md:text-lg font-bold tracking-tight text-white whitespace-nowrap">
                Breast Cancer <span className="text-primary">Mission </span>
              </span>
            </Link>
          )}
        </div>

        {/* Desktop Nav Links - Centered */}
        <nav className="hidden lg:flex items-center gap-3 lg:gap-5 xl:gap-7 absolute left-1/2 -translate-x-1/2 z-0">
          {isCampaignPage ? (
            <>
              <a href="#hero" className="text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-primary transition-colors">Home</a>
              <a href="#about" className="text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-primary transition-colors">About</a>
              <a href="#breast-cancer-info" className="text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-primary transition-colors">Breast Cancer</a>
              <a href="#doctors" className="text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-primary transition-colors">Doctors</a>
              <a href="#research" className="text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-primary transition-colors">Research</a>
              <a href="#events" className="text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-primary transition-colors">Events</a>
              <a href="#volunteer" className="text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-primary transition-colors">Volunteer</a>
              <Link href="/donate" className="text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-primary transition-colors">Donate</Link>
              <a href="#contact" className="text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-primary transition-colors">Contact</a>
            </>
          ) : (
            <>
              {/* Home - direct link */}
              <Link
                href="/"
                className="text-sm font-semibold text-zinc-300 transition-colors hover:text-primary"
              >
                Home
              </Link>

              {/* Campaign Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold text-zinc-300 transition-colors hover:text-primary cursor-pointer select-none outline-none">
                  Campaign <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-zinc-950 border-zinc-800 text-white">
                  <DropdownMenuItem className="hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer">
                    <Link href="/campaigns/education" className="w-full block">Education</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer">
                    <Link href="/campaigns/awareness" className="w-full block">Our Activities</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer">
                    <Link href="/campaigns/membership" className="w-full block">Membership</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer">
                    <Link href="/campaigns/volunteers" className="w-full block">Volunteers</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Care Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold text-zinc-300 transition-colors hover:text-primary cursor-pointer select-none outline-none">
                  Care <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-zinc-950 border-zinc-800 text-white">
                  <DropdownMenuItem className="hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer">
                    <Link href="/care/care-providers" className="w-full block">Care Providers</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer">
                    <Link href="/care/healthcare-professionals" className="w-full block">Healthcare Professionals</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer">
                    <Link href="/care/partner-organizations" className="w-full block">Partner Organizations</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cure Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold text-zinc-300 transition-colors hover:text-primary cursor-pointer select-none outline-none">
                  Cure <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-zinc-950 border-zinc-800 text-white">
                  <DropdownMenuItem className="hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer">
                    <Link href="/diagnosis" className="w-full block">Diagnosis</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer">
                    <Link href="/treatment" className="w-full block">Treatment</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Donate Link Styled as Button with Green Hover Effect */}
              <Link href="/donate" className="flex items-center">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-emerald-500 text-emerald-450 hover:bg-emerald-500 hover:text-black font-semibold transition-all duration-300 active:scale-95 cursor-pointer rounded-lg h-9 px-4 bg-transparent"
                >
                  Donate Now
                </Button>
              </Link>

              {/* About Us Link */}
              <Link
                href="/about"
                className="text-sm font-semibold text-zinc-300 transition-colors hover:text-primary"
              >
                About Us
              </Link>

              {/* Contact Us Link */}
              <Link
                href="/contact"
                className="text-sm font-semibold text-zinc-300 transition-colors hover:text-primary"
              >
                Contact Us
              </Link>
            </>
          )}
        </nav>

        {/* Dynamic Auth State Controls - Right aligned */}
        <div className="flex items-center gap-4 z-10">
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="relative inline-flex items-center justify-center h-10 rounded-full px-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-900 hover:text-white border border-zinc-800 cursor-pointer transition-colors bg-transparent select-none">
                  {user.name || user.email}
                  <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    {user.role}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-zinc-950 border-zinc-800 text-white" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal text-zinc-400">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">{user.name}</p>
                        <p className="text-xs leading-none text-zinc-400">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem className="hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer">
                    <Link href="/dashboard" className="w-full block">Dashboard</Link>
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem className="hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer">
                      <Link href="/admin" className="text-primary font-medium w-full block">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem className="hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer text-destructive focus:text-destructive">
                    <form action={handleSignOut} className="w-full m-0 p-0">
                      <button className="w-full text-left font-medium cursor-pointer border-0 bg-transparent p-0 m-0 text-sm text-rose-500" type="submit">
                        Sign Out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-900 h-10 px-4 font-semibold uppercase tracking-wider text-xs">
                    Login
                  </Button>
                </Link>
                {isCampaignPage ? (
                  <Link href="/register">
                    <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-200 hover:bg-zinc-900 h-10 px-4 font-semibold uppercase tracking-wider text-xs bg-transparent">
                      Register
                    </Button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <Button size="sm" className="bg-primary hover:bg-primary/95 text-white font-semibold shadow-sm transition-transform active:scale-95 h-10 px-4">
                      Get Started
                    </Button>
                  </Link>
                )}
              </>
            )}

            {isCampaignPage && (
              <Link href="/donate">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase px-4 py-2 h-10 shadow-md shadow-emerald-600/10">
                  Donate Now
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu trigger and drawer */}
          <MobileMenu 
            user={user ? { name: user.name, email: user.email, role: user.role } : undefined} 
            handleSignOut={handleSignOut} 
            isCampaignPage={isCampaignPage}
          />
        </div>
      </div>
      {/* Sleek light accent transition line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-pink-500/40 via-pink-100 to-pink-500/40 shadow-[0_1px_10px_rgba(255,255,255,0.3)]" />
    </header>
  );
}

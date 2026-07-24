import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Ribbon, ChevronDown } from "lucide-react";
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

export default async function Navbar() {
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    // Suppress dynamic page pre-rendering errors during next build phase
  }
  const user = session?.user;

  // Sign out server action
  const handleSignOut = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto relative flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - Left aligned */}
        <div className="flex items-center gap-2 z-10">
          <Link href="/" className="flex items-center gap-2">
            <Ribbon className="h-6 w-6 text-primary animate-pulse" />
            <span className="font-heading text-lg font-bold tracking-tight text-foreground">
              Breast Cancer <span className="text-primary">Mission </span>
            </span>
          </Link>
        </div>

        {/* Desktop Nav Links - Centered */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-6 xl:gap-8 absolute left-1/2 -translate-x-1/2 z-0">
          {/* Home - direct link */}
          <Link
            href="/"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            Home
          </Link>

          {/* Campaign Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary cursor-pointer select-none outline-none">
              Campaign <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem>
                <Link href="/campaigns/education" className="w-full block">Education</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/campaigns/awareness" className="w-full block">Awareness</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/campaigns/membership" className="w-full block">Membership</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/campaigns/volunteers" className="w-full block">Volunteers</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Care Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary cursor-pointer select-none outline-none">
              Care <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem>
                <Link href="/care/care-providers" className="w-full block">Care Providers</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/care/healthcare-professionals" className="w-full block">Healthcare Professionals</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/care/partner-organizations" className="w-full block">Partner Organizations</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cure Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary cursor-pointer select-none outline-none">
              Cure <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem>
                <Link href="/diagnosis" className="w-full block">Diagnosis</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/treatment" className="w-full block">Treatment</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Donate Link Styled as Button with Green Hover Effect */}
          <Link href="/donate" className="flex items-center">
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white font-semibold transition-all duration-300 active:scale-95 cursor-pointer rounded-lg h-9 px-4"
            >
              Donate Now
            </Button>
          </Link>

          {/* About Us Link */}
          <Link
            href="/about"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            About Us
          </Link>

          {/* Contact Us Link */}
          <Link
            href="/contact"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            Contact Us
          </Link>
        </nav>

        {/* Dynamic Auth State Controls - Right aligned */}
        <div className="flex items-center gap-4 z-10">
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="relative inline-flex items-center justify-center h-9 rounded-full px-3 text-sm font-semibold hover:bg-accent hover:text-accent-foreground border border-border cursor-pointer transition-colors bg-transparent select-none">
                  {user.name || user.email}
                  <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    {user.role}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/dashboard" className="cursor-pointer w-full block">Dashboard</Link>
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem>
                      <Link href="/admin" className="cursor-pointer text-primary font-medium w-full block">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <form action={handleSignOut} className="w-full m-0 p-0">
                      <button className="w-full text-left text-destructive font-medium cursor-pointer border-0 bg-transparent p-0 m-0 text-sm" type="submit">
                        Sign Out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-primary hover:bg-primary/95 text-white font-medium shadow-sm transition-transform active:scale-95">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu trigger and drawer */}
          <MobileMenu user={user ? { name: user.name, email: user.email, role: user.role } : undefined} handleSignOut={handleSignOut} />
        </div>
      </div>
    </header>
  );
}

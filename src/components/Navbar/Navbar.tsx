"use client";

import { useState, useEffect } from "react";
import NavbarClient from "./NavbarClient";
import { handleSignOut } from "@/actions/auth-actions";

export default function Navbar() {
  const [user, setUser] = useState<{
    name?: string | null;
    email?: string | null;
    role?: string;
  } | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && data?.user) {
          setUser({
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
          });
        }
      })
      .catch(() => {
        // silently ignore
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Optionally show a skeleton while loading, or just render without user
  return <NavbarClient user={user} handleSignOut={handleSignOut} />;
}

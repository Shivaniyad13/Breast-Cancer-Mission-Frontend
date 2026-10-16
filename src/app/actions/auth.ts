"use server";

import { apiClient } from "@/lib/apiClient";
import { cookies } from "next/headers";

/**
 * Registers a user via Express backend without creating an authenticated session.
 */
export async function registerUserAction(data: FormData) {
  try {
    const res = await apiClient("/auth/register", {
      method: "POST",
      body: data,
    });

    const resData = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { error: resData.message || resData.error || "Registration failed." };
    }

    return {
      success: true,
      message: resData.message || resData.data?.message,
      isDoctor: resData.data?.isDoctor,
    };
  } catch (error: unknown) {
    console.error("registerUserAction error:", error);
    return { error: "An unexpected error occurred during registration. Please try again later." };
  }
}

/**
 * Logs in user via Express backend. Sets HttpOnly token cookie upon success.
 */
export async function loginUserAction(email: string, password: string) {
  try {
    const res = await apiClient("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const resData = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { error: resData.message || resData.error || "Invalid email address or password." };
    }

    const token = resData.data?.token;
    if (token) {
      const cookieStore = await cookies();
      cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return { success: true, user: resData.data?.user };
  } catch (error: unknown) {
    console.error("loginUserAction error:", error);
    return { error: "An error occurred during login. Please try again." };
  }
}

/**
 * Logs out user via Express backend. Removes HttpOnly token cookie.
 * 👇 FIXED: Backend call PEHLE, cookie delete BAAD ME
 */
export async function logoutUserAction() {
  // 1. Backend call PEHLE — token abhi cookie me hai
  try {
    await apiClient("/auth/logout", { method: "POST" });
  } catch (err) {
    console.error("Backend logout failed (ignored):", err);
  }

  // 2. Ab cookie delete karo — reliable method
  try {
    const cookieStore = await cookies();
    cookieStore.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
  } catch (err) {
    console.error("Cookie clear failed:", err);
  }

  return { success: true };
}

/**
 * Retrieves the current authenticated user session via Express backend.
 */
export async function getCurrentUserAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const res = await apiClient("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      cookieStore.delete("token");
      return null;
    }

    const resData = await res.json();
    return resData.data?.user ? resData.data : null;
  } catch (error) {
    console.error("getCurrentUserAction error:", error);
    return null;
  }
}
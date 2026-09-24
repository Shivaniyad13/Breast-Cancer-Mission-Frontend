import { NextResponse } from "next/server";
import { apiClient } from "@/lib/apiClient";

export async function POST(req: Request) {
  try {
    const { token, password, newPassword } = await req.json();
    const pass = password || newPassword;

    if (!token || !pass || pass.length < 6) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const res = await apiClient("/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: pass }),
    });

    const resData = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: resData.message || resData.error || "Reset link is invalid or has expired." },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, message: resData.message });
  } catch (err) {
    console.error("reset-password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
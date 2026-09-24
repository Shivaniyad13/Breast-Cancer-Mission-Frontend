import { NextResponse } from "next/server";
import { apiClient } from "@/lib/apiClient";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const res = await apiClient("/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const resData = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: resData.message || resData.error || "Server error" },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, message: resData.message });
  } catch (err) {
    console.error("forgot-password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
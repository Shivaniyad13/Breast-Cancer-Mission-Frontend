import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password || password.length < 8) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const record = await db.passwordResetToken.findUnique({ where: { token } });

    if (!record || record.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { id: record.userId },
      data: { passwordHash: hashed },
    });

    await db.passwordResetToken.delete({ where: { token } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("reset-password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
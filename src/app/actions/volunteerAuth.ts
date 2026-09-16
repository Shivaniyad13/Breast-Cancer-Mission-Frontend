"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function registerVolunteerAction(input: z.infer<typeof registerSchema>) {
  try {
    const validation = registerSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues.map((e) => e.message).join(", "),
      };
    }

    const { fullName, email, password } = validation.data;
    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already registered
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Email is already registered. Please sign in instead.",
      };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with role VOLUNTEER
    const newUser = await db.user.create({
      data: {
        name: fullName.trim(),
        email: normalizedEmail,
        passwordHash,
        role: "VOLUNTEER",
      },
    });

    // Auto-link any guest VolunteerApplication submitted with the same email
    await db.volunteerApplication.updateMany({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
        userId: null,
      },
      data: {
        userId: newUser.id,
      },
    });

    return {
      success: true,
      userId: newUser.id,
    };
  } catch (error: any) {
    console.error("Error in registerVolunteerAction:", error);
    return {
      success: false,
      error: error.message || "Registration failed. Please try again.",
    };
  }
}

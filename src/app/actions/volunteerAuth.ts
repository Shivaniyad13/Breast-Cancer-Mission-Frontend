"use server";

import { z } from "zod";
import { apiClient } from "@/lib/apiClient";

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

    const response = await apiClient("/volunteers/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        email: normalizedEmail,
        password,
      }),
    });

    const resData = await response.json();

    if (!response.ok || !resData.success) {
      return {
        success: false,
        error: resData.message || resData.error || "Registration failed. Please try again.",
      };
    }

    const userId = resData.data?.userId;

    return {
      success: true,
      userId,
    };
  } catch (error: any) {
    console.error("Error in registerVolunteerAction:", error);
    return {
      success: false,
      error: error.message || "Registration failed. Please try again.",
    };
  }
}

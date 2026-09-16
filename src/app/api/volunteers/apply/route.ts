import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/auth";

const applySchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  city: z.string().min(1, "City is required"),
  age: z.coerce.number().min(16, "Must be at least 16").max(100, "Must be 100 or younger"),
  occupation: z.string().min(1, "Occupation is required"),
  interest: z.string().min(1, "Interest is required"),
  availability: z.string().min(1, "Availability is required"),
  motivation: z.string().min(1, "Motivation is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = applySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const session = await auth();
    const userId = session?.user?.id || null;

    const data = validation.data;

    const application = await db.volunteerApplication.create({
      data: {
        userId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        age: data.age,
        occupation: data.occupation,
        interest: data.interest,
        availability: data.availability,
        motivation: data.motivation,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { id: application.id },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/volunteers/apply:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit volunteer application",
      },
      { status: 500 }
    );
  }
}

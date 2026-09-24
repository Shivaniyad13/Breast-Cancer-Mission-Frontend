"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/apiClient";

// Helper for general user auth
async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: Please log in to proceed.");
  }
  return session.user;
}

export async function generateQuizCertificateAction(score: number) {
  try {
    const user = await requireUser();

    if (score < 8) {
      return { success: false, error: "Score must be at least 80% (8/10) to earn a certificate." };
    }

    const res = await apiClient("/certificates/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        score,
      }),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return { success: false, error: resData.message || "Failed to generate quiz certificate." };
    }

    const { certificateId, certificateNumber, isExisting } = resData.data;

    revalidatePath("/dashboard");
    return {
      success: true,
      certificateId,
      certificateNumber,
      message: isExisting ? "Certificate already earned!" : undefined,
    };
  } catch (error: any) {
    console.error("Quiz certificate generation error:", error);
    return { success: false, error: error.message || "Failed to generate quiz certificate." };
  }
}

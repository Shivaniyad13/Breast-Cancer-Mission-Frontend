"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendAdminRegistrationAlert, sendResearchPartnerStatusEmail } from "@/lib/email";

// ----------------------------------------------------------------------
// Helper for Admin authorization
// ----------------------------------------------------------------------
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privilege required.");
  }
  return session.user;
}

// ----------------------------------------------------------------------
// PUBLIC SUBMISSION ACTIONS
// ----------------------------------------------------------------------

export async function submitArticle(data: {
  title: string;
  category: string;
  publishDate?: string;
  journal?: string;
  summary: string;
  conclusions?: string;
  authors: string;
  institution?: string;
  email?: string;
  documentUrl?: string;
  externalUrl?: string;
}) {
  try {
    const article = await db.healthcareResearchArticle.create({
      data: {
        title: data.title,
        category: data.category || "General",
        publishDate: data.publishDate || new Date().toISOString().split("T")[0],
        journal: data.journal || "Submitted Research",
        summary: data.summary,
        conclusions: data.conclusions || data.summary,
        authors: data.authors,
        institution: data.institution || null,
        email: data.email || null,
        documentUrl: data.documentUrl || null,
        externalUrl: data.externalUrl || null,
        status: "PENDING" as any,
        isPublished: false,
      },
    });

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: article };
  } catch (error: any) {
    console.error("Error submitting article:", error);
    return { success: false, error: error.message || "Failed to submit article" };
  }
}

export async function submitResource(data: {
  title: string;
  category?: string;
  desc: string;
  fileUrl: string;
  size?: string;
  format?: string;
  author?: string;
  email?: string;
}) {
  try {
    const resource = await db.professionalResource.create({
      data: {
        title: data.title,
        category: data.category || "General Resource",
        desc: data.desc,
        fileUrl: data.fileUrl,
        size: data.size || "PDF",
        format: data.format || "PDF",
        author: data.author || null,
        email: data.email || null,
        status: "PENDING" as any,
        isPublished: false,
      },
    });

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: resource };
  } catch (error: any) {
    console.error("Error submitting resource:", error);
    return { success: false, error: error.message || "Failed to submit resource" };
  }
}

export async function submitPartnerRequest(data: {
  applicantName: string;
  email: string;
  phone?: string;
  institution: string;
  organizationType?: string;
  researchArea: string;
  proposal: string;
  website?: string;
  documentUrl?: string;
}) {
  try {
    const partnerReq = await db.researchPartnerRequest.create({
      data: {
        applicantName: data.applicantName,
        email: data.email,
        phone: data.phone || "",
        institution: data.institution,
        organizationType: data.organizationType || "Academic",
        researchArea: data.researchArea,
        proposal: data.proposal,
        website: data.website || null,
        documentUrl: data.documentUrl || null,
        status: "PENDING" as any,
      },
    });

    try {
      await sendAdminRegistrationAlert({
        type: "Research Partner Request",
        applicantName: data.applicantName,
        applicantEmail: data.email,
        role: `Research Partner (${data.institution})`,
        details: `Research Area: ${data.researchArea}`,
      });
    } catch (e) {
      console.error("[SMTP] Failed to send admin alert for research partner request:", e);
    }

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: partnerReq };
  } catch (error: any) {
    console.error("Error submitting partner request:", error);
    return { success: false, error: error.message || "Failed to submit partner request" };
  }
}

// ----------------------------------------------------------------------
// PUBLIC FETCH ACTION - Only APPROVED + isPublished=true
// ----------------------------------------------------------------------

export async function getHealthcarePortalContent() {
  try {
    const [articles, resources, partners] = await Promise.all([
      db.healthcareResearchArticle.findMany({
        where: { isPublished: true, status: "APPROVED" as any },
        orderBy: { createdAt: "desc" },
      }),
      db.professionalResource.findMany({
        where: { isPublished: true, status: "APPROVED" as any },
        orderBy: { createdAt: "desc" },
      }),
      db.researchPartner.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      success: true,
      data: {
        articles,
        resources,
        partners,
      },
    };
  } catch (error: any) {
    console.error("Error fetching healthcare portal content:", error);
    return { success: false, error: error.message, data: { articles: [], resources: [], partners: [] } };
  }
}

// ----------------------------------------------------------------------
// ADMIN FETCH ACTION - Returns ALL submissions for moderation
// ----------------------------------------------------------------------

export async function getAllHealthcareAdminData() {
  try {
    await requireAdmin();

    const [articles, resources, partnerRequests, volunteerRequests] = await Promise.all([
      db.healthcareResearchArticle.findMany({
        orderBy: { createdAt: "desc" },
      }),
      db.professionalResource.findMany({
        orderBy: { createdAt: "desc" },
      }),
      db.researchPartnerRequest.findMany({
        orderBy: { createdAt: "desc" },
      }),
      db.volunteerDoctorRequest.findMany({
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      success: true,
      data: {
        articles,
        resources,
        partnerRequests,
        volunteerRequests,
      },
    };
  } catch (error: any) {
    console.error("Error fetching admin healthcare data:", error);
    return {
      success: false,
      error: error.message,
      data: { articles: [], resources: [], partnerRequests: [], volunteerRequests: [] },
    };
  }
}

// ----------------------------------------------------------------------
// ADMIN APPROVE / REJECT ACTIONS
// ----------------------------------------------------------------------

export async function approveResearchArticle(id: string) {
  try {
    await requireAdmin();

    const article = await db.healthcareResearchArticle.update({
      where: { id },
      data: {
        status: "APPROVED" as any,
        isPublished: true,
      },
    });

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: article };
  } catch (error: any) {
    console.error("Error approving article:", error);
    return { success: false, error: error.message };
  }
}

export async function rejectResearchArticle(id: string) {
  try {
    await requireAdmin();

    const article = await db.healthcareResearchArticle.update({
      where: { id },
      data: {
        status: "REJECTED" as any,
        isPublished: false,
      },
    });

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: article };
  } catch (error: any) {
    console.error("Error rejecting article:", error);
    return { success: false, error: error.message };
  }
}

export async function approveResource(id: string) {
  try {
    await requireAdmin();

    const resource = await db.professionalResource.update({
      where: { id },
      data: {
        status: "APPROVED" as any,
        isPublished: true,
      },
    });

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: resource };
  } catch (error: any) {
    console.error("Error approving resource:", error);
    return { success: false, error: error.message };
  }
}

export async function rejectResource(id: string) {
  try {
    await requireAdmin();

    const resource = await db.professionalResource.update({
      where: { id },
      data: {
        status: "REJECTED" as any,
        isPublished: false,
      },
    });

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: resource };
  } catch (error: any) {
    console.error("Error rejecting resource:", error);
    return { success: false, error: error.message };
  }
}

export async function approveResearchPartnerRequest(id: string) {
  try {
    const admin = await requireAdmin();

    const existingReq = await db.researchPartnerRequest.findUnique({
      where: { id },
    });

    const oldStatus = existingReq?.status;

    const req = await db.researchPartnerRequest.update({
      where: { id },
      data: {
        status: "APPROVED" as any,
        reviewedAt: new Date(),
        reviewedBy: admin.email || admin.id,
      },
    });

    // Create entry in ResearchPartner table so it appears on public page
    await db.researchPartner.create({
      data: {
        requestId: req.id,
        name: req.applicantName,
        institution: req.institution,
        website: req.website || null,
        researchArea: req.researchArea,
        description: req.proposal,
        isPublished: true,
      },
    });

    // Duplicate email protection: send only if status transitioned to APPROVED
    if (oldStatus !== "APPROVED" && req.email) {
      try {
        await sendResearchPartnerStatusEmail({
          to: req.email,
          applicantName: req.applicantName,
          institution: req.institution,
          status: "APPROVED",
        });
      } catch (e) {
        console.error("[SMTP] Failed to send research partner approval email:", e);
      }
    }

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: req };
  } catch (error: any) {
    console.error("Error approving research partner request:", error);
    return { success: false, error: error.message };
  }
}

export async function rejectResearchPartnerRequest(id: string, reason?: string) {
  try {
    const admin = await requireAdmin();

    const existingReq = await db.researchPartnerRequest.findUnique({
      where: { id },
    });

    const oldStatus = existingReq?.status;
    const oldReason = existingReq?.rejectionReason;
    const trimmedReason = reason?.trim();

    const req = await db.researchPartnerRequest.update({
      where: { id },
      data: {
        status: "REJECTED" as any,
        reviewedAt: new Date(),
        reviewedBy: admin.email || admin.id,
        rejectionReason: trimmedReason || null,
      },
    });

    // Duplicate email protection: send only if status or reason changed
    if ((oldStatus !== "REJECTED" || oldReason !== trimmedReason) && req.email) {
      try {
        await sendResearchPartnerStatusEmail({
          to: req.email,
          applicantName: req.applicantName,
          institution: req.institution,
          status: "REJECTED",
          rejectionReason: trimmedReason,
        });
      } catch (e) {
        console.error("[SMTP] Failed to send research partner rejection email:", e);
      }
    }

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: req };
  } catch (error: any) {
    console.error("Error rejecting research partner request:", error);
    return { success: false, error: error.message };
  }
}

export async function approveVolunteerDoctorRequest(id: string) {
  try {
    const admin = await requireAdmin();

    const req = await db.volunteerDoctorRequest.update({
      where: { id },
      data: {
        status: "APPROVED" as any,
        reviewedAt: new Date(),
        reviewedBy: admin.email || admin.id,
      },
    });

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: req };
  } catch (error: any) {
    console.error("Error approving volunteer doctor request:", error);
    return { success: false, error: error.message };
  }
}

export async function rejectVolunteerDoctorRequest(id: string) {
  try {
    const admin = await requireAdmin();

    const req = await db.volunteerDoctorRequest.update({
      where: { id },
      data: {
        status: "REJECTED" as any,
        reviewedAt: new Date(),
        reviewedBy: admin.email || admin.id,
      },
    });

    revalidatePath("/care/healthcare-professionals");
    revalidatePath("/admin/healthcare-professionals");

    return { success: true, data: req };
  } catch (error: any) {
    console.error("Error rejecting volunteer doctor request:", error);
    return { success: false, error: error.message };
  }
}

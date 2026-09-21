"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role, VerificationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { 
  sendInstitutionalApplicationStatusEmail, 
  sendUserRegistrationEmail, 
  sendAdminRegistrationAlert 
} from "@/lib/email";

// Helper for admin auth check
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privilege required.");
  }
  return session.user;
}

// 1. Submit Organization Member Application
export async function applyOrganizationMemberAction(data: any) {
  try {
    const {
      organizationName,
      organizationType,
      ngoRegistrationNumber,
      yearEstablished,
      contactPersonName,
      designation,
      email,
      mobileNumber,
      website,
      completeAddress,
      state,
      district,
      city,
      pincode,
      numberOfVolunteers,
      areasOfWork,
      previousExperience,
      expectedCollaboration,
      ngoCertificateUrl,
      organizationLogoUrl,
      supportingDocumentsUrl,
      isDeclared
    } = data;

    if (
      !organizationName ||
      !organizationType ||
      !ngoRegistrationNumber ||
      !yearEstablished ||
      !contactPersonName ||
      !designation ||
      !email ||
      !mobileNumber ||
      !completeAddress ||
      !state ||
      !district ||
      !city ||
      !pincode ||
      !numberOfVolunteers ||
      !areasOfWork ||
      !previousExperience ||
      !expectedCollaboration ||
      !ngoCertificateUrl ||
      !organizationLogoUrl ||
      !supportingDocumentsUrl ||
      !isDeclared
    ) {
      return { error: "Please enter all required fields and upload files." };
    }

    const application = await db.organizationMember.create({
      data: {
        organizationName,
        organizationType,
        ngoRegistrationNumber,
        yearEstablished: parseInt(yearEstablished),
        contactPersonName,
        designation,
        email,
        mobileNumber,
        website: website || null,
        completeAddress,
        state,
        district,
        city,
        pincode,
        numberOfVolunteers: parseInt(numberOfVolunteers),
        areasOfWork,
        previousExperience,
        expectedCollaboration,
        ngoCertificateUrl,
        organizationLogoUrl,
        supportingDocumentsUrl,
        isDeclared: !!isDeclared,
        status: VerificationStatus.PENDING
      }
    });

    // Send SMTP email notifications safely
    try {
      await sendUserRegistrationEmail({
        to: email,
        userName: contactPersonName,
        role: `Organization Member (${organizationName})`,
        verificationStatus: "PENDING",
      });

      await sendAdminRegistrationAlert({
        type: "Organization Membership Application",
        applicantName: `${contactPersonName} (${organizationName})`,
        applicantEmail: email,
        role: "Organization Member",
        details: `NGO Reg: ${ngoRegistrationNumber} | City: ${city}, ${state} | Volunteers: ${numberOfVolunteers}`
      });
    } catch (emailErr) {
      console.error("Non-fatal organization application email error:", emailErr);
    }

    return { success: true, applicationId: application.id };
  } catch (error: any) {
    console.error("applyOrganizationMemberAction error:", error);
    return { error: error.message || "An unexpected database error occurred." };
  }
}

// 2. Submit Corporate Partner Application
export async function applyCorporatePartnerAction(data: any) {
  try {
    const {
      companyName,
      industry,
      gstNumber,
      cinNumber,
      contactPersonName,
      designation,
      email,
      mobileNumber,
      website,
      companyAddress,
      state,
      city,
      pincode,
      employeeStrength,
      csrBudgetCategory,
      collaborationInterest,
      companyLogoUrl,
      csrPolicyUrl,
      supportingDocumentsUrl,
      isDeclared
    } = data;

    if (
      !companyName ||
      !industry ||
      !gstNumber ||
      !contactPersonName ||
      !designation ||
      !email ||
      !mobileNumber ||
      !companyAddress ||
      !state ||
      !city ||
      !pincode ||
      !employeeStrength ||
      !csrBudgetCategory ||
      !collaborationInterest ||
      !companyLogoUrl ||
      !supportingDocumentsUrl ||
      !isDeclared
    ) {
      return { error: "Please enter all required fields and upload files." };
    }

    const application = await db.corporatePartner.create({
      data: {
        companyName,
        industry,
        gstNumber,
        cinNumber: cinNumber || null,
        contactPersonName,
        designation,
        email,
        mobileNumber,
        website: website || null,
        companyAddress,
        state,
        city,
        pincode,
        employeeStrength: parseInt(employeeStrength),
        csrBudgetCategory,
        collaborationInterest,
        companyLogoUrl,
        csrPolicyUrl: csrPolicyUrl || null,
        supportingDocumentsUrl,
        isDeclared: !!isDeclared,
        status: VerificationStatus.PENDING
      }
    });

    // Send SMTP email notifications safely
    try {
      await sendUserRegistrationEmail({
        to: email,
        userName: contactPersonName,
        role: `Corporate Partner (${companyName})`,
        verificationStatus: "PENDING",
      });

      await sendAdminRegistrationAlert({
        type: "Corporate Partner Application",
        applicantName: `${contactPersonName} (${companyName})`,
        applicantEmail: email,
        role: "Corporate Partner",
        details: `GST: ${gstNumber} | Industry: ${industry} | CSR Category: ${csrBudgetCategory}`
      });
    } catch (emailErr) {
      console.error("Non-fatal corporate partner application email error:", emailErr);
    }

    return { success: true, applicationId: application.id };
  } catch (error: any) {
    console.error("applyCorporatePartnerAction error:", error);
    return { error: error.message || "An unexpected database error occurred." };
  }
}

// 3. Get all Organization applications (Admin)
export async function getOrganizationApplicationsAction() {
  await requireAdmin();
  return await db.organizationMember.findMany({
    orderBy: { createdAt: "desc" }
  });
}

// 4. Get all Corporate applications (Admin)
export async function getCorporateApplicationsAction() {
  await requireAdmin();
  return await db.corporatePartner.findMany({
    orderBy: { createdAt: "desc" }
  });
}

// 5. Update Organization Member Status (Admin)
export async function updateOrganizationApplicationStatusAction(
  id: string,
  status: "VERIFIED" | "REJECTED",
  remarks: string
) {
  await requireAdmin();

  try {
    const app = await db.organizationMember.findUnique({ where: { id } });
    if (!app) {
      return { error: "Application not found." };
    }

    const statusChanged = app.status !== status;

    await db.organizationMember.update({
      where: { id },
      data: { status, remarks }
    });

    let generatedPassword = "";

    if (status === "VERIFIED") {
      // Find or create User
      let user = await db.user.findUnique({ where: { email: app.email } });
      
      if (!user) {
        generatedPassword = Math.random().toString(36).slice(-8) + "GRS!";
        const passwordHash = await bcrypt.hash(generatedPassword, 10);
        
        user = await db.user.create({
          data: {
            name: app.contactPersonName,
            email: app.email,
            passwordHash,
            role: Role.ORGANIZATION_MEMBER
          }
        });
      } else {
        // Upgrade existing user role if not admin
        if (user.role !== Role.ADMIN) {
          user = await db.user.update({
            where: { email: app.email },
            data: { role: Role.ORGANIZATION_MEMBER }
          });
        }
      }
    }

    // Send SMTP status email strictly when status changes
    if (statusChanged) {
      try {
        await sendInstitutionalApplicationStatusEmail({
          to: app.email,
          recipientName: app.contactPersonName,
          entityName: app.organizationName,
          entityType: "Organization Member",
          status,
          remarks,
          loginEmail: app.email,
          loginPassword: generatedPassword || undefined,
        });
      } catch (emailErr) {
        console.error("Non-fatal organization status email error:", emailErr);
      }
    }

    revalidatePath("/admin/memberships");
    return { success: true };
  } catch (error: any) {
    console.error("updateOrganizationApplicationStatusAction error:", error);
    return { error: error.message || "Failed to update application status." };
  }
}

// 6. Update Corporate Partner Status (Admin)
export async function updateCorporateApplicationStatusAction(
  id: string,
  status: "VERIFIED" | "REJECTED",
  remarks: string
) {
  await requireAdmin();

  try {
    const app = await db.corporatePartner.findUnique({ where: { id } });
    if (!app) {
      return { error: "Application not found." };
    }

    const statusChanged = app.status !== status;

    await db.corporatePartner.update({
      where: { id },
      data: { status, remarks }
    });

    let generatedPassword = "";

    if (status === "VERIFIED") {
      // Find or create User
      let user = await db.user.findUnique({ where: { email: app.email } });
      
      if (!user) {
        generatedPassword = Math.random().toString(36).slice(-8) + "GRS!";
        const passwordHash = await bcrypt.hash(generatedPassword, 10);
        
        user = await db.user.create({
          data: {
            name: app.contactPersonName,
            email: app.email,
            passwordHash,
            role: Role.CORPORATE_PARTNER
          }
        });
      } else {
        // Upgrade existing user role if not admin
        if (user.role !== Role.ADMIN) {
          user = await db.user.update({
            where: { email: app.email },
            data: { role: Role.CORPORATE_PARTNER }
          });
        }
      }
    }

    // Send SMTP status email strictly when status changes
    if (statusChanged) {
      try {
        await sendInstitutionalApplicationStatusEmail({
          to: app.email,
          recipientName: app.contactPersonName,
          entityName: app.companyName,
          entityType: "Corporate Partner",
          status,
          remarks,
          loginEmail: app.email,
          loginPassword: generatedPassword || undefined,
        });
      } catch (emailErr) {
        console.error("Non-fatal corporate status email error:", emailErr);
      }
    }

    revalidatePath("/admin/memberships");
    return { success: true };
  } catch (error: any) {
    console.error("updateCorporateApplicationStatusAction error:", error);
    return { error: error.message || "Failed to update application status." };
  }
}


"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role, VerificationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Helper for admin auth check
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privilege required.");
  }
  return session.user;
}

// Mock email helper that writes files to public/mock-emails
async function sendMockEmail(to: string, subject: string, body: string) {
  console.log(`[MOCK EMAIL SENT to ${to}]`);
  console.log(`Subject: ${subject}`);
  console.log(`Body:\n${body}`);

  try {
    const logDir = path.join(process.cwd(), "public", "mock-emails");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const cleanEmail = to.replace(/[^a-zA-Z0-9]/g, "_");
    const filepath = path.join(logDir, `${Date.now()}-${cleanEmail}.txt`);
    fs.writeFileSync(filepath, `To: ${to}\nSubject: ${subject}\n\n${body}`);
  } catch (error) {
    console.error("Failed to write mock email file:", error);
  }
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

    await db.organizationMember.update({
      where: { id },
      data: { status, remarks }
    });

    if (status === "VERIFIED") {
      // Find or create User
      let user = await db.user.findUnique({ where: { email: app.email } });
      let generatedPassword = "";
      
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

      // Send approved email
      const emailBody = `
Dear ${app.contactPersonName},

We are pleased to inform you that your application for Organization Membership with Breast Cancer Awareness Mission has been APPROVED!

Details:
Organization Name: ${app.organizationName}
NGO Registration: ${app.ngoRegistrationNumber}
Status: Approved
Remarks: ${remarks || "None"}

Your login details for the Institution Dashboard are:
Portal Link: http://localhost:3000/login
Email: ${app.email}
${generatedPassword ? `Password: ${generatedPassword}\n(Note: Please change your password after logging in.)` : "Password: Use your existing account password."}

Thank you for partnering with us to spread breast cancer awareness.

Warm regards,
Command Center Team
      `.trim();
      await sendMockEmail(app.email, `Partnership Approved: ${app.organizationName}`, emailBody);
    } else {
      // Send rejected email
      const emailBody = `
Dear ${app.contactPersonName},

Thank you for your interest in collaborating with the Breast Cancer Awareness Mission. 

After reviewing your application for ${app.organizationName}, we regret to inform you that we cannot approve your Organization Membership at this time.

Remarks / Reasons for Rejection:
${remarks || "Verification requirements not met."}

If you believe this was an error or would like to submit additional information, please contact us at support@grsawareness.org.

Warm regards,
Command Center Team
      `.trim();
      await sendMockEmail(app.email, `Partnership Application Status Updates`, emailBody);
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

    await db.corporatePartner.update({
      where: { id },
      data: { status, remarks }
    });

    if (status === "VERIFIED") {
      // Find or create User
      let user = await db.user.findUnique({ where: { email: app.email } });
      let generatedPassword = "";
      
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

      // Send approved email
      const emailBody = `
Dear ${app.contactPersonName},

We are pleased to inform you that your application for Corporate Partnership with Breast Cancer Awareness Mission has been APPROVED!

Details:
Company Name: ${app.companyName}
GST Number: ${app.gstNumber}
Status: Approved
Remarks: ${remarks || "None"}

Your login details for the Institution Dashboard are:
Portal Link: http://localhost:3000/login
Email: ${app.email}
${generatedPassword ? `Password: ${generatedPassword}\n(Note: Please change your password after logging in.)` : "Password: Use your existing account password."}

Thank you for partnering with us to spread breast cancer awareness through corporate initiatives.

Warm regards,
Command Center Team
      `.trim();
      await sendMockEmail(app.email, `Partnership Approved: ${app.companyName}`, emailBody);
    } else {
      // Send rejected email
      const emailBody = `
Dear ${app.contactPersonName},

Thank you for your interest in collaborating with the Breast Cancer Awareness Mission. 

After reviewing your application for ${app.companyName}, we regret to inform you that we cannot approve your Corporate Partnership at this time.

Remarks / Reasons for Rejection:
${remarks || "Verification requirements not met."}

If you believe this was an error or would like to submit additional information, please contact us at support@grsawareness.org.

Warm regards,
Command Center Team
      `.trim();
      await sendMockEmail(app.email, `Partnership Application Status Updates`, emailBody);
    }

    revalidatePath("/admin/memberships");
    return { success: true };
  } catch (error: any) {
    console.error("updateCorporateApplicationStatusAction error:", error);
    return { error: error.message || "Failed to update application status." };
  }
}

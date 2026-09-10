"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { Role, VerificationStatus } from "@prisma/client";

export interface RegisterInput {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  phoneNumber?: string;
  docLicense?: string;
  docAffiliation?: string;
  docSpecialty?: string;
  ngoRegNum?: string;
  tax80g?: boolean;
  nationalId?: string;
}

export async function registerUserAction(data: RegisterInput) {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      phoneNumber, 
      docLicense, 
      docAffiliation, 
      docSpecialty, 
      ngoRegNum, 
      tax80g, 
      nationalId 
    } = data;

    if (!name || !email || !password || !role) {
      return { error: "Please enter all required fields." };
    }

    if (role === Role.ADMIN || role === "ADMIN") {
      return { error: "Registration as an Administrator is not allowed." };
    }

    const existingUser = await db.user.findUnique({

      where: { email },
    });

    if (existingUser) {
      return { error: "A user with this email address already exists." };
    }

    if (role === Role.DOCTOR || role === "DOCTOR") {
      const licenseTrimmed = docLicense?.trim();
      const affiliationTrimmed = docAffiliation?.trim();
      const specialtyTrimmed = docSpecialty?.trim();

      if (!licenseTrimmed || licenseTrimmed.length < 3) {
        return { error: "A valid Medical License / Registration Number (minimum 3 characters) is required for Doctor registration." };
      }
      if (!affiliationTrimmed) {
        return { error: "Hospital / Clinic Affiliation is required for Doctor registration." };
      }
      if (!specialtyTrimmed) {
        return { error: "Medical Specialty is required for Doctor registration." };
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role as Role,
      },
    });

    // Handle role verification queues
    let verificationStatus: VerificationStatus = VerificationStatus.UNVERIFIED;
    if (role === Role.DOCTOR || role === Role.NGO_REP || role === "DOCTOR" || role === "NGO_REP") {
      verificationStatus = VerificationStatus.PENDING;
    }

    await db.profile.create({
      data: {
        userId: user.id,
        phoneNumber: phoneNumber || null,
        verificationStatus,
        
        // Doctor details
        medicalLicenseNumber: (role === Role.DOCTOR || role === "DOCTOR") ? docLicense?.trim() || null : null,
        hospitalAffiliation: (role === Role.DOCTOR || role === "DOCTOR") ? docAffiliation?.trim() || null : null,
        specialty: (role === Role.DOCTOR || role === "DOCTOR") ? docSpecialty?.trim() || null : null,
        
        // NGO details
        ngoRegistrationNumber: (role === Role.NGO_REP || role === "NGO_REP") ? ngoRegNum?.trim() || null : null,
        taxExemptionStatus80G: (role === Role.NGO_REP || role === "NGO_REP") ? !!tax80g : false,
        
        // Patient details
        nationalIdNumber: (role === Role.PATIENT || role === "PATIENT") ? nationalId?.trim() || null : null,
      },
    });

    // Create Doctor profile entry if role is DOCTOR
    if (role === Role.DOCTOR || role === "DOCTOR") {
      const doctorIdString = "DOC-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      await db.doctor.create({
        data: {
          userId: user.id,
          doctorId: doctorIdString,
          medicalLicenseNumber: docLicense?.trim() || null,
          hospitalAffiliation: docAffiliation?.trim() || null,
          specialty: docSpecialty?.trim() || "Oncology",
          verificationStatus: VerificationStatus.PENDING,
        },
      });

      return { 
        success: true, 
        isDoctor: true,
        message: "Your doctor account has been created successfully. Your professional credentials are pending verification by our administration team." 
      };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Registration error details:", error);
    return { error: "An unexpected error occurred during registration. Please try again later." };
  }
}

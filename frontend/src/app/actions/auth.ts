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

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "A user with this email address already exists." };
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
    if (role === Role.DOCTOR || role === Role.NGO_REP) {
      verificationStatus = VerificationStatus.PENDING;
    }

    await db.profile.create({
      data: {
        userId: user.id,
        phoneNumber: phoneNumber || null,
        verificationStatus,
        
        // Doctor details
        medicalLicenseNumber: role === Role.DOCTOR ? docLicense : null,
        hospitalAffiliation: role === Role.DOCTOR ? docAffiliation : null,
        specialty: role === Role.DOCTOR ? docSpecialty : null,
        
        // NGO details
        ngoRegistrationNumber: role === Role.NGO_REP ? ngoRegNum : null,
        taxExemptionStatus80G: role === Role.NGO_REP ? !!tax80g : false,
        
        // Patient details
        nationalIdNumber: role === Role.PATIENT ? nationalId : null,
      },
    });

    // Create Doctor profile entry if role is DOCTOR
    if (role === Role.DOCTOR) {
      const doctorIdString = "DOC-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      await db.doctor.create({
        data: {
          userId: user.id,
          doctorId: doctorIdString,
          medicalLicenseNumber: docLicense || null,
          hospitalAffiliation: docAffiliation || null,
          specialty: docSpecialty || "Oncology",
          verificationStatus,
        },
      });
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Registration error details:", error);
    return { error: "An unexpected error occurred during registration. Please try again later." };
  }
}

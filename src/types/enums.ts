export type Role =
  | "USER"
  | "ADMIN"
  | "NGO_REP"
  | "DOCTOR"
  | "PATIENT"
  | "VOLUNTEER"
  | "DONOR"
  | "ORGANIZATION_MEMBER"
  | "CORPORATE_PARTNER";

export const Role = {
  USER: "USER",
  ADMIN: "ADMIN",
  NGO_REP: "NGO_REP",
  DOCTOR: "DOCTOR",
  PATIENT: "PATIENT",
  VOLUNTEER: "VOLUNTEER",
  DONOR: "DONOR",
  ORGANIZATION_MEMBER: "ORGANIZATION_MEMBER",
  CORPORATE_PARTNER: "CORPORATE_PARTNER",
} as const;

export type VerificationStatus = "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";

export const VerificationStatus = {
  UNVERIFIED: "UNVERIFIED",
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
} as const;

export type DonationStatus = "PENDING" | "SUCCESSFUL" | "COMPLETED" | "FAILED" | "REFUNDED";

export const DonationStatus = {
  PENDING: "PENDING",
  SUCCESSFUL: "SUCCESSFUL",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

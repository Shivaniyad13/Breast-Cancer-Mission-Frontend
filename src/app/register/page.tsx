"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { registerUserAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Eye, EyeOff } from "lucide-react";

type RegistrationField =
  | "name"
  | "email"
  | "password"
  | "phoneNumber"
  | "role"
  | "ngoRegNum"
  | "qualificationFile"
  | "organizationProofFile"
  | "aadhaarNumber"
  | "panNumber";

type RegistrationFieldErrors = Partial<Record<RegistrationField, string>>;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return <p id={id} role="alert" className="text-xs font-medium text-destructive">{message}</p>;
}

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("Registration successful! Redirecting to login page...");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<RegistrationFieldErrors>({});

  const clearFieldError = (field: RegistrationField) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const phoneNumber = String(formData.get("phoneNumber") || "").trim();
    const aadhaarNumber = String(formData.get("aadhaarNumber") || "").trim();
    const panNumber = String(formData.get("panNumber") || "").trim().toUpperCase();
    const nextFieldErrors: RegistrationFieldErrors = {};

    if (!name) {
      nextFieldErrors.name = "Enter your full name.";
    } else if (name.length < 2) {
      nextFieldErrors.name = "Enter at least 2 characters.";
    } else if (/\d/.test(name)) {
      nextFieldErrors.name = "Numbers are not allowed in your name.";
    } else if (!/^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u.test(name)) {
      nextFieldErrors.name = "Use letters, spaces, periods, apostrophes, or hyphens only.";
    }

    if (!email) {
      nextFieldErrors.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextFieldErrors.email = "Enter a valid email address, for example name@example.com.";
    }

    if (!password) {
      nextFieldErrors.password = "Enter a password.";
    } else if (password.length < 6) {
      nextFieldErrors.password = "Password must be at least 6 characters.";
    }

    if (!phoneNumber) {
      nextFieldErrors.phoneNumber = "Enter your 10-digit phone number.";
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      nextFieldErrors.phoneNumber = /\D/.test(phoneNumber)
        ? "Use digits only for the phone number."
        : "Enter exactly 10 digits for the phone number.";
    }

    if (!role) {
      nextFieldErrors.role = "Please select an account type.";
    }

    if (role === "NGO_REP" && !String(data.ngoRegNum || "").trim()) {
      nextFieldErrors.ngoRegNum = "Enter your NGO registration or Darpan ID.";
    }

    const validateDocumentFile = (field: RegistrationField, message: string) => {
      const file = formData.get(field);
      if (!(file instanceof File) || file.size === 0) {
        nextFieldErrors[field] = message;
      } else if (!["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        nextFieldErrors[field] = "Choose a PDF, JPG, PNG, or WEBP file.";
      } else if (file.size > 5 * 1024 * 1024) {
        nextFieldErrors[field] = "File must be 5 MB or smaller.";
      }
    };

    if (role === "DOCTOR") {
      validateDocumentFile("qualificationFile", "Upload your medical degree or doctorate certificate.");
    }
    if (role === "HEALTHCARE_PROVIDER") {
      validateDocumentFile("qualificationFile", "Upload a professional degree or recognized certification.");
    }
    if (role === "NGO_REP") {
      validateDocumentFile("organizationProofFile", "Upload your NGO registration certificate or organization proof.");
    }
    if (role === "GOVERNMENT_ORG") {
      validateDocumentFile("organizationProofFile", "Upload an official government authorization or registration proof.");
    }

    if (role === "PATIENT" || role === "BENEFICIARY" || role === "DOCTOR") {
      if (!aadhaarNumber) {
        nextFieldErrors.aadhaarNumber = "Enter your 12-digit Aadhaar number.";
      } else if (/\D/.test(aadhaarNumber)) {
        nextFieldErrors.aadhaarNumber = "Aadhaar can contain digits only.";
      } else if (!/^\d{12}$/.test(aadhaarNumber)) {
        nextFieldErrors.aadhaarNumber = "Aadhaar must contain exactly 12 digits.";
      }

      if (role === "DOCTOR" && !panNumber) {
        nextFieldErrors.panNumber = "Enter your PAN number.";
      } else if (panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber)) {
        nextFieldErrors.panNumber = "Enter PAN as 5 letters, 4 digits, then 1 letter (for example, ABCDE1234F).";
      }
    }

    if (fieldErrors.phoneNumber === "Use digits only for the phone number.") {
      nextFieldErrors.phoneNumber = fieldErrors.phoneNumber;
    }
    if (fieldErrors.aadhaarNumber === "Aadhaar can contain digits only.") {
      nextFieldErrors.aadhaarNumber = fieldErrors.aadhaarNumber;
    }
    if (fieldErrors.panNumber === "Use letters and digits only for PAN.") {
      nextFieldErrors.panNumber = fieldErrors.panNumber;
    }

    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) {
      setLoading(false);
      return;
    }

    formData.set("tax80g", String(formData.get("tax80g") === "on"));
    formData.set("role", role);
    formData.set("name", name);
    formData.set("email", email);
    formData.set("aadhaarNumber", aadhaarNumber);
    formData.set("panNumber", panNumber);

    const res = await registerUserAction(formData);

    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      if (res.message) {
        setSuccessMessage(res.message);
      }
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3500);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-lg border-border bg-card/60 backdrop-blur-md shadow-xl transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <Image src="/logo.png" alt="Cancer Mukt Bharat Abhiyan" width={64} height={64} className="h-16 w-16 object-contain" priority />
          </div>
          <CardTitle className="font-heading text-3xl font-bold tracking-tight">Create an Account</CardTitle>
          <CardDescription>
            Join the Breast Cancer Awareness Campaign Network
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-md bg-emerald-500/10 text-emerald-600 text-sm font-medium border border-emerald-500/20 leading-relaxed">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Jane Doe"
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  onChange={(event) => {
                    if (/\d/.test(event.currentTarget.value)) {
                      setFieldErrors((current) => ({ ...current, name: "Numbers are not allowed in your name." }));
                    } else {
                      clearFieldError("name");
                    }
                  }}
                  className={`bg-background/80 ${fieldErrors.name ? "border-destructive" : ""}`}
                />
                <FieldError id="name-error" message={fieldErrors.name} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  onChange={() => clearFieldError("email")}
                  className={`bg-background/80 ${fieldErrors.email ? "border-destructive" : ""}`}
                />
                <FieldError id="email-error" message={fieldErrors.email} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 🔐 PASSWORD with show/hide toggle */}
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                    onChange={() => clearFieldError("password")}
                    className={`bg-background/80 pr-10 ${fieldErrors.password ? "border-destructive" : ""}`}
                  />
                  <FieldError id="password-error" message={fieldErrors.password} />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  inputMode="numeric"
                  required
                  maxLength={10}
                  placeholder="9999999999"
                  aria-invalid={!!fieldErrors.phoneNumber}
                  aria-describedby={fieldErrors.phoneNumber ? "phoneNumber-error" : undefined}
                  onChange={(event) => {
                    const containsInvalidCharacters = /\D/.test(event.currentTarget.value);
                    event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 10);
                    if (containsInvalidCharacters) {
                      setFieldErrors((current) => ({ ...current, phoneNumber: "Use digits only for the phone number." }));
                    } else {
                      clearFieldError("phoneNumber");
                    }
                  }}
                  className={`bg-background/80 ${fieldErrors.phoneNumber ? "border-destructive" : ""}`}
                />
                <FieldError id="phoneNumber-error" message={fieldErrors.phoneNumber} />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="role">I want to register as a</Label>
              <Select value={role} onValueChange={(val) => {
                setRole(val || "");
                setFieldErrors({});
              }}>
                <SelectTrigger aria-invalid={!!fieldErrors.role} aria-describedby={fieldErrors.role ? "role-error" : undefined} className="bg-background/80 w-full">
                  <SelectValue placeholder="Select account type">
                    {role ? (role === "NGO_REP" ? "NGO" : role.replaceAll("_", " ")) : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent sideOffset={4} className="min-w-[var(--anchor-width)] max-w-none">
                  <SelectItem value="PATIENT" className="whitespace-nowrap">Patient</SelectItem>
                  <SelectItem value="DOCTOR" className="whitespace-nowrap">Doctor</SelectItem>
                  <SelectItem value="HEALTHCARE_PROVIDER" className="whitespace-nowrap">Healthcare Provider</SelectItem>
                  <SelectItem value="NGO_REP" className="whitespace-nowrap">NGO</SelectItem>
                  <SelectItem value="GOVERNMENT_ORG" className="whitespace-nowrap">Government Organization</SelectItem>
                </SelectContent>
              </Select>
              <FieldError id="role-error" message={fieldErrors.role} />
            </div>

            {role === "DOCTOR" && (
              <div className="space-y-4 p-4 rounded-lg bg-accent/40 border border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="text-sm font-semibold text-primary">Doctor Verification Details</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="qualificationFile">Medical Degree / Doctorate Certificate</Label>
                    <Input id="qualificationFile" name="qualificationFile" type="file" accept=".pdf,image/jpeg,image/png,image/webp" aria-invalid={!!fieldErrors.qualificationFile} aria-describedby={fieldErrors.qualificationFile ? "qualificationFile-error" : undefined} onChange={() => clearFieldError("qualificationFile")} className={`bg-background/80 ${fieldErrors.qualificationFile ? "border-destructive" : ""}`} />
                    <FieldError id="qualificationFile-error" message={fieldErrors.qualificationFile} />
                  </div>
                </div>
              </div>
            )}

            {role === "HEALTHCARE_PROVIDER" && (
              <div className="space-y-3 p-4 rounded-lg bg-accent/40 border border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="text-sm font-semibold text-primary">Professional Verification</h4>
                <p className="text-xs text-muted-foreground">Submit a professional degree, license, or recognized healthcare certification.</p>
                <div className="space-y-1">
                  <Label htmlFor="qualificationFile">Degree or Certification</Label>
                  <Input id="qualificationFile" name="qualificationFile" type="file" accept=".pdf,image/jpeg,image/png,image/webp" aria-invalid={!!fieldErrors.qualificationFile} aria-describedby={fieldErrors.qualificationFile ? "qualificationFile-error" : undefined} onChange={() => clearFieldError("qualificationFile")} className={`bg-background/80 ${fieldErrors.qualificationFile ? "border-destructive" : ""}`} />
                  <FieldError id="qualificationFile-error" message={fieldErrors.qualificationFile} />
                </div>
              </div>
            )}

            {role === "GOVERNMENT_ORG" && (
              <div className="space-y-3 p-4 rounded-lg bg-accent/40 border border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="text-sm font-semibold text-primary">Organization Verification</h4>
                <p className="text-xs text-muted-foreground">Submit an official government authorization letter, registration document, or organization proof.</p>
                <div className="space-y-1">
                  <Label htmlFor="organizationProofFile">Government Organization Proof</Label>
                  <Input id="organizationProofFile" name="organizationProofFile" type="file" accept=".pdf,image/jpeg,image/png,image/webp" aria-invalid={!!fieldErrors.organizationProofFile} aria-describedby={fieldErrors.organizationProofFile ? "organizationProofFile-error" : undefined} onChange={() => clearFieldError("organizationProofFile")} className={`bg-background/80 ${fieldErrors.organizationProofFile ? "border-destructive" : ""}`} />
                  <FieldError id="organizationProofFile-error" message={fieldErrors.organizationProofFile} />
                </div>
              </div>
            )}

            {role === "NGO_REP" && (
              <div className="space-y-4 p-4 rounded-lg bg-accent/40 border border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="text-sm font-semibold text-primary">NGO Credentials</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="ngoRegNum">NGO Registration / Darpan ID</Label>
                    <Input id="ngoRegNum" name="ngoRegNum" placeholder="NGO/2026/00123" aria-invalid={!!fieldErrors.ngoRegNum} aria-describedby={fieldErrors.ngoRegNum ? "ngoRegNum-error" : undefined} onChange={() => clearFieldError("ngoRegNum")} className={`bg-background/80 ${fieldErrors.ngoRegNum ? "border-destructive" : ""}`} />
                    <FieldError id="ngoRegNum-error" message={fieldErrors.ngoRegNum} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="organizationProofFile">NGO Registration Certificate / Organization Proof</Label>
                    <Input id="organizationProofFile" name="organizationProofFile" type="file" accept=".pdf,image/jpeg,image/png,image/webp" aria-invalid={!!fieldErrors.organizationProofFile} aria-describedby={fieldErrors.organizationProofFile ? "organizationProofFile-error" : undefined} onChange={() => clearFieldError("organizationProofFile")} className={`bg-background/80 ${fieldErrors.organizationProofFile ? "border-destructive" : ""}`} />
                    <FieldError id="organizationProofFile-error" message={fieldErrors.organizationProofFile} />
                  </div>
                  <div className="flex items-center space-x-2 py-2">
                    <input type="checkbox" id="tax80g" name="tax80g" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <Label htmlFor="tax80g" className="text-sm cursor-pointer select-none">We provide tax benefits under Section 80G</Label>
                  </div>
                </div>
              </div>
            )}

            {(role === "PATIENT" || role === "DOCTOR") && (
              <div className="space-y-4 p-4 rounded-lg bg-accent/40 border border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="text-sm font-semibold text-primary">{role === "DOCTOR" ? "Identity Verification" : "Identity Details"}</h4>
                <div className="space-y-1">
                  <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                  <Input
                    id="aadhaarNumber"
                    name="aadhaarNumber"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={12}
                    placeholder="12-digit Aadhaar number"
                    aria-invalid={!!fieldErrors.aadhaarNumber}
                    aria-describedby={fieldErrors.aadhaarNumber ? "aadhaarNumber-error" : undefined}
                    onChange={(event) => {
                      const containsInvalidCharacters = /\D/.test(event.currentTarget.value);
                      event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 12);
                      if (containsInvalidCharacters) {
                        setFieldErrors((current) => ({ ...current, aadhaarNumber: "Aadhaar can contain digits only." }));
                      } else {
                        clearFieldError("aadhaarNumber");
                      }
                    }}
                    className={`bg-background/80 ${fieldErrors.aadhaarNumber ? "border-destructive" : ""}`}
                  />
                  <FieldError id="aadhaarNumber-error" message={fieldErrors.aadhaarNumber} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="panNumber">PAN Number{role === "PATIENT" ? " (Optional)" : ""}</Label>
                  <Input
                    id="panNumber"
                    name="panNumber"
                    type="text"
                    autoComplete="off"
                    required={role === "DOCTOR"}
                    pattern="^[A-Z]{5}[0-9]{4}[A-Z]$"
                    title="PAN must use 5 letters, 4 digits, and 1 letter (for example, ABCDE1234F)"
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    aria-invalid={!!fieldErrors.panNumber}
                    aria-describedby={fieldErrors.panNumber ? "panNumber-error" : undefined}
                    onChange={(event) => {
                      const containsInvalidCharacters = /[^A-Za-z0-9]/.test(event.currentTarget.value);
                      event.currentTarget.value = event.currentTarget.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
                      if (containsInvalidCharacters) {
                        setFieldErrors((current) => ({ ...current, panNumber: "Use letters and digits only for PAN." }));
                      } else {
                        clearFieldError("panNumber");
                      }
                    }}
                    className={`bg-background/80 ${fieldErrors.panNumber ? "border-destructive" : ""}`}
                  />
                  <FieldError id="panNumber-error" message={fieldErrors.panNumber} />
                </div>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/95 text-white py-6 text-base font-semibold shadow-md transition-all active:scale-98">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 py-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
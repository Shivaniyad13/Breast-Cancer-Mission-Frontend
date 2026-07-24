"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUserAction, RegisterInput } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ribbon, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("VOLUNTEER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as unknown as RegisterInput;
    
    // Process checkbox manually
    data.tax80g = formData.get("tax80g") === "on";
    data.role = role;

    const res = await registerUserAction(data);

    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-lg border-border bg-card/60 backdrop-blur-md shadow-xl transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <Ribbon className="h-10 w-10 text-primary animate-pulse" />
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
            <div className="mb-4 p-3 rounded-md bg-emerald-500/10 text-emerald-600 text-sm font-medium border border-emerald-500/20">
              Registration successful! Redirecting to login page...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="Jane Doe" required className="bg-background/80" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="jane@example.com" required className="bg-background/80" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required className="bg-background/80" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" name="phoneNumber" placeholder="+91 99999 99999" className="bg-background/80" />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="role">I want to register as a</Label>
              <Select value={role} onValueChange={(val) => setRole(val || "VOLUNTEER")}>
                <SelectTrigger className="bg-background/80">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VOLUNTEER">Volunteer / Learner</SelectItem>
                  <SelectItem value="DONOR">Donor</SelectItem>
                  <SelectItem value="PATIENT">Patient / Beneficiary</SelectItem>
                  <SelectItem value="DOCTOR">Medical Professional / Doctor</SelectItem>
                  <SelectItem value="NGO_REP">NGO Representative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Doctor Fields */}
            {role === "DOCTOR" && (
              <div className="space-y-4 p-4 rounded-lg bg-accent/40 border border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="text-sm font-semibold text-primary">Doctor Verification Details</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="docLicense">Medical License Number (MCI/State Registry)</Label>
                    <Input id="docLicense" name="docLicense" placeholder="MCI-12345" required className="bg-background/80" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="docAffiliation">Hospital Affiliation / Clinic Name</Label>
                    <Input id="docAffiliation" name="docAffiliation" placeholder="Apollo Hospital" required className="bg-background/80" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="docSpecialty">Medical Specialty</Label>
                    <Input id="docSpecialty" name="docSpecialty" placeholder="Surgical Oncologist" required className="bg-background/80" />
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic NGO Fields */}
            {role === "NGO_REP" && (
              <div className="space-y-4 p-4 rounded-lg bg-accent/40 border border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="text-sm font-semibold text-primary">NGO Credentials</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="ngoRegNum">NGO Registration / Darpan ID</Label>
                    <Input id="ngoRegNum" name="ngoRegNum" placeholder="NGO/2026/00123" required className="bg-background/80" />
                  </div>
                  <div className="flex items-center space-x-2 py-2">
                    <input type="checkbox" id="tax80g" name="tax80g" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <Label htmlFor="tax80g" className="text-sm cursor-pointer select-none">We provide tax benefits under Section 80G</Label>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Patient Fields */}
            {role === "PATIENT" && (
              <div className="space-y-4 p-4 rounded-lg bg-accent/40 border border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="text-sm font-semibold text-primary">Patient Identity Identification</h4>
                <div className="space-y-1">
                  <Label htmlFor="nationalId">National Identity ID (e.g. Aadhaar / PAN)</Label>
                  <Input id="nationalId" name="nationalId" placeholder="1234-5678-9012" required className="bg-background/80" />
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

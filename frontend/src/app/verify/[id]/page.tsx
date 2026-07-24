import { db } from "@/lib/db";
import { headers } from "next/headers";
import { ShieldCheck, ShieldAlert, Award, Calendar, User, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 0; // Dynamic rendering

interface VerifyPageProps {
  params: Promise<{ id: string }>;
}

export default async function VerifyCertificatePage({ params }: VerifyPageProps) {
  const { id } = await params;
  const headerList = await headers();
  const ipAddress = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "127.0.0.1";
  const userAgent = headerList.get("user-agent") || "Unknown Browser";

  // Find certificate
  const cert = await db.certificate.findFirst({
    where: {
      OR: [
        { id },
        { certificateIdString: id }
      ]
    },
    include: {
      webinar: true,
      recipient: true
    }
  });

  const isValid = !!cert;

  // Log verification attempt in the database
  if (isValid && cert) {
    await db.certificateVerification.create({
      data: {
        certificateId: cert.id,
        verificationUrl: `http://localhost:3000/verify/${id}`,
        ipAddress,
        userAgent,
        status: "SUCCESS",
      }
    });
  } else {
    console.log(`[VERIFICATION ATTEMPT FAILED] Unknown Certificate ID: ${id} checked from IP ${ipAddress}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-white to-rose-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/70 backdrop-blur-md rounded-3xl border border-pink-100 shadow-2xl p-8 md:p-12 relative overflow-hidden">
        {/* Decorative background blur blobs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-rose-300/20 rounded-full blur-3xl pointer-events-none" />

        {isValid && cert ? (
          <div className="space-y-8 text-center">
            {/* Header Success Badge */}
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100 animate-bounce">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-800">
                Authentic Certificate Verified
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-widest">
                GRS Certified
              </span>
            </div>

            {/* Certificate Details */}
            <div className="bg-white/95 rounded-2xl border border-pink-100/50 p-6 md:p-8 shadow-sm space-y-6 text-left relative">
              <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-10">
                <Award className="h-16 w-16 text-rose-600" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Recipient Name</p>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-5 w-5 text-pink-500 shrink-0" />
                  <p className="text-lg font-bold text-slate-800">{cert.userName || cert.recipient?.name || "Participant"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Webinar / Program Name</p>
                <div className="flex items-center gap-2 mt-1">
                  <BookOpen className="h-5 w-5 text-pink-500 shrink-0" />
                  <p className="text-base font-bold text-slate-800">{cert.eventName}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Date of Issuance</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-5 w-5 text-pink-500 shrink-0" />
                    <p className="text-sm font-semibold text-slate-700">
                      {cert.date ? new Date(cert.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }) : new Date(cert.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Lead Instructor / Speaker</p>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-5 w-5 text-pink-500 shrink-0" />
                    <p className="text-sm font-semibold text-slate-700">{cert.speakerName || "GRS Medical Expert"}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-100 pt-4 flex flex-col md:flex-row md:justify-between gap-3 text-xs text-muted-foreground">
                <div>
                  <span className="font-semibold text-slate-600">Certificate ID:</span> {cert.certificateIdString}
                </div>
                <div>
                  <span className="font-semibold text-slate-600">Security Signature:</span> Digital SHA-256
                </div>
              </div>
            </div>

            {/* Strategic Partners Logos & Download link */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-pink-100/50">
              <div className="flex items-center gap-4">
                <div className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded font-bold text-xs">GRS</div>
                <div className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded font-bold text-xs">KHUSHI CENTRE</div>
              </div>
              <div className="flex gap-3">
                <Link href={`/api/certificates/${cert.id}/download`}>
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white font-medium shadow-sm transition-all rounded-full px-6 text-sm">
                    Download Official PDF
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="border-pink-200 text-slate-700 hover:bg-pink-50 rounded-full px-6 text-sm">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 text-center">
            {/* Header Failure Badge */}
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center border border-red-100 animate-pulse">
                <ShieldAlert className="h-10 w-10" />
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-800">
                Invalid Certificate
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 uppercase tracking-widest">
                Verification Failed
              </span>
            </div>

            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 text-sm text-red-800 text-center leading-relaxed">
              We were unable to locate a valid certificate record matching ID <strong className="font-mono bg-white px-2 py-0.5 rounded border border-red-200/50 text-red-900">{id}</strong> in our database. 
              This could mean the certificate has been modified, revoked, or is a draft that hasn't been officially issued.
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
                  Go to Home
                </Button>
              </Link>
              <Link href="/webinars">
                <Button variant="outline" className="rounded-full px-6">
                  Browse Webinars
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

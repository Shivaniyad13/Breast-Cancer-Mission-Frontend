import { redirect } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { Ribbon, ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { apiClient } from "@/lib/apiClient";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

export default async function VolunteerCertificatePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/volunteer/login?callbackUrl=/campaigns/volunteers/certificate");
  }

  let volunteer: { id: string; fullName: string; status: string } | null = null;
  let cert: { id: string; certificateCode: string; issuedAt: string } | null = null;

  try {
    const res = await apiClient(`/volunteers/certificate?userId=${session.user.id}`);
    if (res.ok) {
      const body = await res.json();
      if (body.success && body.data) {
        volunteer = body.data.volunteer;
        cert = body.data.certificate;
      }
    }
  } catch (error) {
    console.error("Error fetching volunteer certificate:", error);
  }

  if (!volunteer || (volunteer.status !== "VERIFIED" && (volunteer.status as any) !== "APPROVED")) {
    redirect("/campaigns/volunteers");
  }

  if (!cert) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-lg border border-pink-100 text-center space-y-4">
          <div className="h-14 w-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mx-auto">
            <Ribbon className="h-7 w-7" />
          </div>
          <h2 className="font-heading text-xl font-bold text-slate-800">
            Certificate Being Prepared
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Your certificate is being prepared. Check back soon.
          </p>
          <Link
            href="/campaigns/volunteers"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Volunteers
          </Link>
        </div>
      </div>
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verifyUrl = `${appUrl}/verify/${cert.certificateCode}`;

  let qrDataUrl = "";
  try {
    qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 200,
      margin: 1,
      color: { dark: "#be185d", light: "#ffffff" },
    });
  } catch (err) {
    console.error("Error generating QR code:", err);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12 px-4 relative">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Print Bar */}
        <div className="flex items-center justify-between no-print">
          <Link
            href="/campaigns/volunteers"
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-pink-600 transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Volunteers
          </Link>
          <PrintButton />
        </div>

        {/* Printable Certificate Frame */}
        <div className="bg-white rounded-3xl border-4 border-double border-pink-200 p-8 sm:p-14 shadow-xl relative overflow-hidden cert-print-clean">
          
          {/* Decorative background blur circles */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-pink-100/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-rose-100/40 rounded-full blur-3xl pointer-events-none" />

          {/* Watermark Ribbon */}
          <Ribbon className="absolute bottom-6 left-6 h-40 w-40 text-pink-200/20 pointer-events-none stroke-[1]" />

          <div className="relative z-10 text-center space-y-6">
            
            {/* Ribbon Badge Icon */}
            <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto shadow-inner">
              <Ribbon className="h-8 w-8 text-pink-600" />
            </div>

            {/* Certificate Title */}
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
                Certificate of Volunteer Service
              </h1>
              <p className="text-sm text-slate-500 mt-6 italic">
                This certifies that
              </p>
            </div>

            {/* Volunteer Name */}
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-pink-600 tracking-tight">
              {volunteer.fullName}
            </h2>

            {/* Citation Text */}
            <p className="max-w-xl mx-auto text-sm text-slate-600 leading-relaxed font-medium">
              has successfully completed the volunteer orientation and contributed to our breast cancer awareness mission.
            </p>

            {/* Footer Details & QR Verification */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-12 pt-8 border-t border-pink-100">
              <div className="text-left space-y-2">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Issued On
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {new Date(cert.issuedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Certificate Code
                  </span>
                  <span className="font-mono text-xs text-slate-500">
                    {cert.certificateCode}
                  </span>
                </div>
              </div>

              {/* QR Code Block */}
              {qrDataUrl && (
                <div className="flex flex-col items-center">
                  <img
                    src={qrDataUrl}
                    alt="Verify QR Code"
                    className="w-28 h-28 rounded-lg border border-pink-100 p-1 bg-white shadow-sm"
                  />
                  <span className="text-[10px] text-slate-400 text-center mt-2 font-medium">
                    Scan to verify
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

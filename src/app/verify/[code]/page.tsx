import Link from "next/link";
import { Ribbon, ArrowLeft, ShieldCheck, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { db } from "@/lib/db";

const interestToRole: Record<string, string> = {
  outreach: "Community Outreach Volunteer",
  camps: "Health Camp Volunteer",
  events: "Campaign Coordinator",
  media: "Media Advocate",
  fundraising: "Fundraising Volunteer",
  workshops: "Workshop Presenter",
};

export default async function VerifyCertificatePage(
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;
  const code = params.code;

  let cert = null;
  try {
    cert = await db.volunteerCertificate.findUnique({
      where: { certificateCode: code },
      include: {
        volunteer: {
          select: {
            fullName: true,
            city: true,
            interest: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center px-4">
        
        {/* Back Link */}
        <Link
          href="/campaigns/volunteers"
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-pink-600 hover:text-pink-700 transition-colors mb-6 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Volunteers
        </Link>

        {/* Case 1: Certificate Not Found */}
        {!cert ? (
          <div>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <XCircle className="h-9 w-9 text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Certificate Not Found
            </h1>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-mono font-bold">
              Code: {code}
            </div>

            <div className="mt-6 bg-white/90 backdrop-blur-md p-8 shadow-xl rounded-2xl border border-pink-100/60 text-center space-y-4">
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                We couldn't find a certificate with this code. Please verify the code and try again.
              </p>
              <Link
                href="/campaigns/volunteers"
                className="inline-flex justify-center items-center w-full py-3 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-pink-500/20"
              >
                Return to Volunteer Center
              </Link>
            </div>
          </div>
        ) : cert.revokedAt ? (
          /* Case 2: Certificate Revoked */
          <div>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <AlertTriangle className="h-9 w-9 text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Certificate Revoked
            </h1>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-mono font-bold">
              Code: {code}
            </div>

            <div className="mt-6 bg-white/90 backdrop-blur-md p-8 shadow-xl rounded-2xl border border-pink-100/60 text-center space-y-4">
              <p className="text-amber-800 text-xs sm:text-sm font-semibold">
                This certificate has been revoked by the issuing authority.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-4 border-t border-slate-100">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Name
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {cert.volunteer?.fullName || "Volunteer"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Revoked On
                  </span>
                  <span className="text-sm font-bold text-amber-700">
                    {new Date(cert.revokedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Case 3: Valid Certificate */
          <div>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="h-9 w-9 text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Valid Certificate
            </h1>
            <p className="text-slate-500 text-xs font-medium mt-1">
              This certificate was officially issued by our organization.
            </p>

            <div className="mt-6 bg-white/90 backdrop-blur-md p-8 shadow-xl rounded-2xl border border-pink-100/60">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Name
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {cert.volunteer?.fullName || "Volunteer"}
                  </span>
                </div>

                {cert.volunteer?.city && (
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                      City
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {cert.volunteer.city}
                    </span>
                  </div>
                )}

                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Role
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {interestToRole[cert.volunteer?.interest || ""] || "Volunteer"}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Issued On
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {new Date(cert.issuedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="col-span-1 sm:col-span-2 pt-3 border-t border-slate-100">
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Certificate Code
                  </span>
                  <span className="font-mono text-xs font-bold text-pink-700">
                    {cert.certificateCode}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back to Home Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { registerForWebinarAction, getOrCreateWebinarByTitleAction } from "@/app/actions/webinars";
import { ShieldCheck, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";

interface UserSession {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
}

interface WebinarRegisterButtonProps {
  webinarId: string;
  webinarTitle: string;
  currentUser?: UserSession | null;
  buttonText?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function WebinarRegisterButton({
  webinarId,
  webinarTitle,
  currentUser,
  buttonText = "Register Seat",
  className,
  variant = "default",
  size = "sm",
}: WebinarRegisterButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resolvedWebinarId, setResolvedWebinarId] = useState(webinarId);
  const [resolvedWebinarTitle, setResolvedWebinarTitle] = useState(webinarTitle);

  // Form states
  const [name, setName] = useState(currentUser?.name || "");
  const [email] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [occupation, setOccupation] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [reason, setReason] = useState("");
  const [agree, setAgree] = useState(false);

  const handleClick = async () => {
    if (!currentUser) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setIsOpen(true);
    setIsSuccess(false);
    setErrorMsg("");

    // If it's a static card from the campaigns page, resolve it to a database webinar
    if (webinarId === "look-up-by-title") {
      setIsPending(true);
      try {
        const res = await getOrCreateWebinarByTitleAction(webinarTitle);
        if (res.success && res.webinarId) {
          setResolvedWebinarId(res.webinarId);
          setResolvedWebinarTitle(res.webinarTitle);
        } else {
          setErrorMsg("Could not link to a valid webinar. Please try again.");
        }
      } catch (e: any) {
        setErrorMsg(e.message || "Failed to resolve webinar details.");
      } finally {
        setIsPending(false);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      alert("You must agree to attend the webinar.");
      return;
    }

    if (!name || !phone || !gender || !age || !city || !state || !occupation || !emergencyContact || !reason) {
      alert("All fields are required.");
      return;
    }

    setIsPending(true);
    setErrorMsg("");

    try {
      const res = await registerForWebinarAction(resolvedWebinarId, {
        name,
        email,
        phone,
        gender,
        age: Number(age),
        city,
        state,
        occupation,
        emergencyContact,
        reason,
      });

      if (res.success) {
        setIsSuccess(true);
        router.refresh();
      } else {
        setErrorMsg(res.message || "Registration failed.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Button onClick={handleClick} variant={variant} size={size} className={className}>
        {buttonText}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white/90 backdrop-blur-md border border-pink-100 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200 text-slate-700">
            
            {/* Close Button */}
            {!isPending && (
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-primary hover:bg-pink-50 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}

            {isSuccess ? (
              /* Success Screen */
              <div className="text-center space-y-6 py-6">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 stroke-[1.5] animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-2xl font-black text-slate-800">✅ Registration Successful</h3>
                  <p className="text-xs text-muted-foreground">You have successfully registered for</p>
                  <p className="font-heading text-lg font-bold text-primary px-4 py-2 bg-pink-50 rounded-2xl inline-block max-w-full truncate">
                    {resolvedWebinarTitle}
                  </p>
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  <Button 
                    onClick={() => { setIsOpen(false); router.push("/dashboard"); }} 
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-md py-2.5"
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => { setIsOpen(false); router.push("/webinars"); }} 
                    className="w-full border-pink-200 text-slate-700 hover:bg-pink-50 rounded-xl py-2.5 font-bold"
                  >
                    Browse More Webinars
                  </Button>
                </div>
              </div>
            ) : (
              /* Form Screen */
              <div className="space-y-4">
                <div className="border-b border-pink-50 pb-3">
                  <h3 className="font-heading text-xl font-black text-slate-800">Register for Webinar</h3>
                  <p className="text-xs text-muted-foreground mt-1">Fill in the fields below to secure your seat for: <span className="font-semibold text-primary">{resolvedWebinarTitle}</span></p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-500 font-semibold flex items-center gap-1.5 animate-in shake">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {isPending && webinarId === "look-up-by-title" ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-xs text-muted-foreground font-semibold">Linking to campaign event...</p>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4 text-xs font-semibold">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Shivani Yadav"
                          className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary/50 text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider">Email *</label>
                        <input
                          type="email"
                          required
                          readOnly
                          value={email}
                          placeholder="e.g. email@example.com"
                          className="w-full bg-slate-50 border border-border/80 rounded-xl px-3.5 py-2.5 text-slate-500 cursor-not-allowed outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider">Mobile Number *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary/50 text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider">Gender *</label>
                        <select
                          required
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3 py-2.5 outline-none focus:border-primary/50 text-slate-800 text-xs"
                        >
                          <option value="">Select Gender</option>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider">Age *</label>
                        <input
                          type="number"
                          required
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="e.g. 24"
                          className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary/50 text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider">City *</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Delhi"
                          className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary/50 text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider">State *</label>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="e.g. Delhi"
                          className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary/50 text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider">Occupation *</label>
                        <input
                          type="text"
                          required
                          value={occupation}
                          onChange={(e) => setOccupation(e.target.value)}
                          placeholder="e.g. Student"
                          className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary/50 text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider">Emergency Contact (Mobile / Relation) *</label>
                      <input
                        type="text"
                        required
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        placeholder="e.g. 9876543211 (Mother)"
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary/50 text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider">Why do you want to attend? *</label>
                      <textarea
                        required
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Share your goals or queries..."
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary/50 text-slate-800 font-medium"
                      />
                    </div>

                    <div className="flex items-start gap-2 pt-2 text-[11px] text-slate-600">
                      <input
                        type="checkbox"
                        id="agree-checkbox"
                        required
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-0.5 accent-primary h-3.5 w-3.5 shrink-0"
                      />
                      <label htmlFor="agree-checkbox" className="leading-tight cursor-pointer font-bold select-none">
                        I agree to attend this webinar.
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isPending}
                        className="border-pink-200 text-slate-700 hover:bg-pink-50 rounded-xl px-5 py-2 h-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-primary hover:bg-primary/95 text-white font-bold rounded-xl px-6 py-2 h-auto shadow-md"
                      >
                        {isPending ? (
                          <span className="flex items-center gap-1">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Registering...
                          </span>
                        ) : (
                          "Register"
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

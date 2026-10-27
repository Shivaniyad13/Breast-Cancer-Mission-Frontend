import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  ExternalLink,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cancer Mukt Delhi University Abhiyan | Campaign Event",
  description:
    "Join Cancer Mukt Delhi University Abhiyan on 31 October 2026 at the University of Delhi.",
};

const registrationUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSdQ8wrh2SRpPUxF6GOginPFVeSPIDeIoiNq8trduB5IOPAmJw/viewform";

const guests = [
  {
    title: "CHIEF GUEST   ",
    name: "Dr. Rashmi Singh, IAS",
    role: "Secretary-Dept. of Women & Child Development, Govt. of NCT of Delhi",
    image: "/Rashmi%20singh.jpg",
  },
  {
    title: "GUEST OF HONOUR",
    name: "Prof. Balaram Pani",
    role: "Dean of colleges, University of Delhi",
    image: "/dean-colleges.jpg",
  },
  {
    title: "CHAIRPERSON",
    name: "Prof. G. K. Rath",
    role: "Advisor-Dept. of Atomic Energy; Founder & former Head- National Cancer Institute, AIIMS Delhi; Patron & Chief R&D-CMBA",
    image: "/Prof.%20G.K%20rath.jpeg",
  },
  {
    title: "CO-CHAIR",
    name: "Dr. Anurag Srivastava",
    role: "Breast cancer expert & surgical oncologist; Chairman-KCCR; former Head of Surgery-AIIMS",
    image: "/Anurag%20Srivastava.jpg",
  },
  {
    title: "HEAD OF DEPARTMENT",
    name: "Prof. Neena Pandey",
    role: "Head, Department of Social Work, University of Delhi",
    image: "/Neena%20Pandey.jpg",
  },
  {
    title: "MANAGING TRUSTEE",
    name: "Saket Mani Trivedi",
    role: "Founder and Convener- CMBA, Secretary-Mission Bharat, Mentor- AIM & ATL, NITI Aayog.",
    image: "/photo_square.png",
  },
];

export default function DelhiUniversityCampaignPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-pink-50 text-slate-800">

      {/* ─────────────── SECTION 1 : HERO ─────────────── */}
      <section className="relative overflow-hidden border-b border-pink-100 bg-white">
        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-pink-100/70 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-rose-100/70 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <div className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-pink-700">
              Be a part of the movement – Register now!
            </div>
            <h1 className="font-heading text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Cancer Mukt Delhi University Abhiyan
              <span className="mt-3 block text-xl font-semibold italic text-rose-800 sm:text-2xl">
                “Leaving No Woman Behind”
              </span>
            </h1>
            <p className="mt-5 text-base font-semibold text-rose-800">
              Theme: Healthy Women • Healthy Families • Healthy Bharat
            </p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
              Khushi Centre for Rehabilitation &amp; Research, in collaboration
              with the Department of Social Work, University of Delhi, invites
              you to be a part of this impactful initiative dedicated to
              building a healthier and cancer-aware society.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-pink-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-700"
              >
                Register now <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-6 max-w-2xl text-base font-semibold text-rose-800">
              Your participation can make a difference. Together, let’s leave no woman behind!
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl shadow-pink-200/70">
              <Image
                src="/images/awareness3.png"
                alt="Community members coming together for breast cancer awareness"
                width={1024}
                height={1024}
                className="aspect-[4/3] w-full object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-pink-100 bg-white/95 p-4 shadow-xl backdrop-blur sm:left-8 sm:right-8">
              <p className="text-center text-sm font-extrabold text-rose-800 sm:text-base">
                Healthy Women <span className="text-pink-500">•</span> Healthy
                Families <span className="text-pink-500">•</span> Healthy Bharat
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── SECTION 2 : GUESTS & PATRONS ─────────────── */}
      <section className="border-b border-pink-100 bg-gradient-to-b from-white to-pink-50/70 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-center font-serif text-3xl font-bold text-rose-900 sm:text-4xl">
            Our Distinguished Guests &amp; Patrons
          </h1>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guests.map((guest) => (
              <article
                key={guest.name}
                className="rounded-2xl border border-pink-200 bg-white p-5 shadow-md shadow-pink-900/10"
              >
                <p className="text-xs font-bold text-pink-600">{guest.title}</p>
                <div className="mt-4 flex items-center gap-4">
                  <Image
                    src={guest.image}
                    alt={guest.name}
                    width={96}
                    height={96}
                    className="h-24 w-24 shrink-0 rounded-full border-4 border-pink-300 object-cover"
                  />
                  <h2 className="font-serif text-xl font-bold leading-tight text-blue-950">
                    {guest.name}
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-5 text-blue-950">{guest.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── SECTION 3 : DATE / TIME / VENUE ─────────────── */}
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:px-8">
        <div className="flex gap-4 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
          <CalendarDays className="mt-1 h-6 w-6 shrink-0 text-pink-600" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-pink-600">Date</p>
            <p className="mt-1 font-bold">Saturday, 31st October 2026</p>
          </div>
        </div>
        <div className="flex gap-4 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
          <Clock3 className="mt-1 h-6 w-6 shrink-0 text-pink-600" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-pink-600">Time</p>
            <p className="mt-1 font-bold">2:30 PM – 5:30 PM</p>
          </div>
        </div>
        <div className="flex gap-4 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
          <MapPin className="mt-1 h-6 w-6 shrink-0 text-pink-600" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-pink-600">Venue</p>
            <p className="mt-1 font-bold">Dr. B.R. Ambedkar Auditorium</p>
            <p className="mt-1 text-sm text-slate-600">Department of Social Work, University of Delhi, North Campus, Delhi</p>
          </div>
        </div>
      </section>

      {/* ─────────────── SECTION 4 : LOGOS & LINKS ─────────────── */}
      <section className="border-t border-pink-100 bg-white py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <Image src="/images/khushi-logo.jpg" alt="Khushi Centre for Rehabilitation and Research" width={180} height={80} className="h-14 w-auto object-contain" />
            <Image src="/images/mission-bharat.png" alt="Mission Bharat" width={180} height={80} className="h-14 w-auto object-contain" />
          </div>
          <div className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm font-semibold text-pink-700">
            <a href="https://khushicentre.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-pink-900">
              Know more about Khushi Centre <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a href="https://missionbharat.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-pink-900">
              Know more about Mission Bharat <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <Link href="/campaigns/awareness" className="text-sm font-semibold text-slate-500 hover:text-pink-700">
            ← Back to campaign activities
          </Link>
        </div>
      </section>

    </main>
  );
}
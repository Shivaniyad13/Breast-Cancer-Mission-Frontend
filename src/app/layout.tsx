import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

// export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: " Cancer Mukt Bharat Abhiyan",
  description:
    "Connecting patients, doctors, NGOs, and donors. Early diagnosis guides and verified crowdfunding support.",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

import LayoutWrapper from "@/components/layout/LayoutWrapper";
import PageViewTracker from "@/components/PageViewTracker/PageViewTracker";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`min-h-full ${inter.variable} ${lora.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-background text-foreground">
        <PageViewTracker />
        <LayoutWrapper navbar={<Navbar />} footer={<Footer />}>
          {children}
        </LayoutWrapper>
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
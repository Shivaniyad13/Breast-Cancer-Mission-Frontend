import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
// export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: " Cancer Mukt Bharat Platform",
  description:
    "A centralized campaign ecosystem connecting patients, doctors, NGOs, and donors. Supporting early diagnosis guides and verified crowdfunding.",
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
    <html lang="en" className="min-h-full">
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
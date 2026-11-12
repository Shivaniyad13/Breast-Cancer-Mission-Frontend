"use client";

import React from "react";
import dynamic from "next/dynamic";

const SelfExamReminderModal = dynamic(
  () => import("@/components/self-exam/SelfExamReminderModal"),
  { ssr: false }
);

export default function LayoutWrapper({
  children,
  navbar,
  footer,
}: {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <>
      {navbar}
      <main className="flex-1 flex flex-col pt-20">{children}</main>
      {footer}
      <SelfExamReminderModal />
    </>
  );
}


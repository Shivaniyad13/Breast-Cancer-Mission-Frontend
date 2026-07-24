import { Metadata } from "next";
import AwarenessClient from "./AwarenessClient";

export const metadata: Metadata = {
  title: "Breast Cancer Awareness | Breast Cancer Awareness Mission",
  description: "Creating awareness today can save lives tomorrow. Discover why early detection and community participation matter, view local drives, watch screening guides, and get active wellness tips.",
};

export default function AwarenessPage() {
  return <AwarenessClient />;
}

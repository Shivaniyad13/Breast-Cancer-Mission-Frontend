import { Metadata } from "next";
import MembershipClient from "./MembershipClient";

export const metadata: Metadata = {
  title: "Become a Community Member | Breast Cancer Awareness Mission",
  description: "Join the Breast Cancer Awareness Mission community. Choose your membership category, access campaigns benefits, join webinar streams, and participate in health advocacy drives.",
};

export default function MembershipPage() {
  return <MembershipClient />;
}

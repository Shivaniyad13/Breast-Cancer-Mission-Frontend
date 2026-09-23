import { Metadata } from "next";
import MembershipClient from "../campaigns/membership/MembershipClient";

export const metadata: Metadata = {
  title: "Become a Community Member | Cancer Mukt Bharat Abhiyan",
  description: "Join the Breast Cancer Awareness Mission community. Choose your membership category, submit community feedback, access resources, and join awareness drives.",
};

export default function MembershipPage() {
  return <MembershipClient />;
}

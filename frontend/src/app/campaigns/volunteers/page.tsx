import { Metadata } from "next";
import VolunteersClient from "./VolunteersClient";

export const metadata: Metadata = {
  title: "Become a Volunteer | Breast Cancer Awareness Mission",
  description: "Join our active volunteer network. Spreading breast cancer awareness, coordinating checkup camps, and supporting recovery group campaigns to save lives.",
};

export default function VolunteersPage() {
  return <VolunteersClient />;
}

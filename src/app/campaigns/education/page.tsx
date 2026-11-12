import { Metadata } from "next";
import EducationClient from "./EducationClient";

export const metadata: Metadata = {
  title: "Breast & Cervical Cancer Education | Breast Cancer Awareness Mission",
  description: "Learn basic information about breast and cervical cancer, possible warning signs, prevention, screening, and early care.",
};

export default function EducationPage() {
  return <EducationClient />;
}

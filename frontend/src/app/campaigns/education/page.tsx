import { Metadata } from "next";
import EducationClient from "./EducationClient";

export const metadata: Metadata = {
  title: "Breast Cancer Education | Breast Cancer Awareness Mission",
  description: "Knowledge is the first step toward prevention and early detection. Learn about types of breast cancer, symptoms, risk factors, self-examination, screening tests, and watch educational videos.",
};

export default function EducationPage() {
  return <EducationClient />;
}

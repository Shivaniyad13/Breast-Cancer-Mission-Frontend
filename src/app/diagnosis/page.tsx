import { Metadata } from "next";
import { getDiagnosisTechnologies } from "@/app/actions/diagnosis";
import DiagnosisClient from "./DiagnosisClient";

export const metadata: Metadata = {
  title: "Breast Cancer Diagnosis Technologies & Collaboration",
  description: "Explore the latest diagnostic technologies used worldwide for early breast cancer detection. We create partnerships with manufacturers, clinics, and healthcare centers to offer early screening guidelines.",
  keywords: "Breast Cancer Diagnosis, Mammography, 3D Tomosynthesis, Breast Ultrasound, Breast MRI, ABUS, Healthcare Collaboration",
};

export const revalidate = 0; // Real-time diagnostic database updates

export default async function DiagnosisPage() {
  const result = await getDiagnosisTechnologies(true);
  const technologies = result.success && result.technologies ? result.technologies : [];

  return <DiagnosisClient initialTechnologies={technologies as any} />;
}

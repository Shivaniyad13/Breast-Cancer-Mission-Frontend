import { getHealthcarePortalContent } from "@/app/actions/healthcareProfessionals";
import HealthcareProfessionalsClient from "./HealthcareProfessionalsClient";

export const revalidate = 0;

export default async function Page() {
  const result = await getHealthcarePortalContent();
  return <HealthcareProfessionalsClient initialData={result.success ? result.data : {}} />;
}

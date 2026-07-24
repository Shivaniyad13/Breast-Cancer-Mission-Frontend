"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Helper for admin auth validation
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin privilege required.");
  }
  return session.user;
}

// Initial seed technologies for breast cancer diagnosis
const SEED_TECHNOLOGIES = [
  {
    name: "Digital Mammography (2D Mammogram)",
    category: "Mammography",
    shortOverview: "Standard X-ray screening that creates flat, 2D projection images of breast tissue. Highly effective for identifying microcalcifications.",
    accuracy: "84% overall sensitivity",
    purpose: "Routine early screening and detection of microcalcifications.",
    advantages: "Widely available, cost-effective, proven track record in reducing mortality rates.",
    limitations: "Less effective in dense breast tissue; involves small radiation dose; physical compression required.",
    recommendedGroup: "Women aged 40-74 at average risk for breast cancer.",
    imageUrl: "/images/mammography_screening.png",
    introVideoUrl: "/videoplayback.mp4",
    animationVideoUrl: "",
    explainerVideoUrl: "",
    workflow: "Mammograms compress breast tissue to minimize X-ray scattering and optimize image resolution. The technician takes two standard views of each breast.",
    stepByStep: "1. The patient stands in front of the X-ray machine.\n2. A specialized technologist positions one breast on a detector plate.\n3. A compression paddle gently but firmly presses down to flatten breast tissue.\n4. You must hold your breath for a few seconds while the X-ray image is captured.\n5. The process is repeated for the other breast and from a side angle.",
    preparation: "Do not apply deodorant, perfume, lotion, or powder under your arms or on your breasts on the day of the exam, as these substances can mimic calcium deposits.",
    duration: "10 to 15 minutes",
    benefits: "Identifies early breast cancer up to two years before a lump can be physically felt, dramatically increasing treatment options and success rates.",
    risks: "Minimal exposure to low-dose radiation; small chance of false positives leading to follow-up testing.",
    whoShouldTake: "Recommended annually or biennially for women over 40, or earlier for women with genetic predisposition.",
    faqs: [
      {
        q: "Why is breast compression necessary?",
        a: "Compression is essential to flatten the breast tissue to a uniform thickness, reducing radiation dose and creating a clearer image by keeping the tissue still."
      },
      {
        q: "Can I wear deodorant to my mammogram?",
        a: "No. Deodorants and powders contain metals like aluminum that can show up as white spots (calcifications) on the mammogram, leading to false results."
      }
    ],
    relatedArticles: [
      { title: "American Cancer Society Screening Guidelines", link: "https://www.cancer.org" },
      { title: "Understanding Breast Density & Mammography Results", link: "https://www.breastcancer.org" }
    ],
    brochureUrl: "",
    manufacturerName: "Hologic Inc.",
    manufacturerLogoUrl: "",
    manufacturerOverview: "A global healthcare leader specializing in women's health, famous for pioneering digital mammography.",
    manufacturerWebsite: "https://www.hologic.com",
    manufacturerCountry: "United States",
    manufacturerSpecialization: "Digital Mammography & 3D Tomosynthesis Systems",
    collaborationStatus: "Active Partner",
    isActive: true,
    orderIndex: 0
  },
  {
    name: "3D Mammography (Digital Breast Tomosynthesis)",
    category: "3D Mammography",
    shortOverview: "Advanced imaging technology that takes multiple X-rays from different angles to construct a detailed 3D slice-by-slice model of the breast.",
    accuracy: "92% overall sensitivity (increases detection by 40%)",
    purpose: "Enhanced screening, especially useful for dense breast tissue.",
    advantages: "Reduces false positive callbacks by 15-40%; detects small tumors otherwise hidden in dense tissue.",
    limitations: "Slightly higher radiation dose than standard 2D; not yet available in all smaller clinics.",
    recommendedGroup: "Women of all ages, particularly recommended for those with dense breasts or elevated risk.",
    imageUrl: "/images/3d_tomosynthesis.png",
    introVideoUrl: "/videoplayback.mp4",
    animationVideoUrl: "",
    explainerVideoUrl: "",
    workflow: "The X-ray tube moves in a small arc around the breast, taking multiple low-dose projection images which are reconstructed mathematically into 1mm slices.",
    stepByStep: "1. Positioned similarly to a standard mammogram.\n2. The breast is compressed under standard pressure.\n3. The X-ray arm sweeps in an arc over the head, taking multiple brief exposures in a few seconds.\n4. The raw images are synthesized into high-definition 3D layers.",
    preparation: "Avoid using deodorants, powders, body lotions, or perfumes in the underarm or breast areas prior to your screening.",
    duration: "15 minutes",
    benefits: "Significant reduction in false recall rates, higher cancer detection rates, and better visual mapping of complex internal structures.",
    risks: "Slightly longer scanning sweep, minimal exposure to ionizing radiation.",
    whoShouldTake: "Highly recommended for women with dense breast tissue or those with a strong family history of breast cancer.",
    faqs: [
      {
        q: "What is the main difference between 2D and 3D mammograms?",
        a: "A 2D mammogram provides two flat views of the breast, while 3D mammogram takes images from multiple angles to slice through dense overlap, uncovering hidden abnormalities."
      }
    ],
    relatedArticles: [
      { title: "3D Mammography vs 2D Mammography: Study Outcomes", link: "https://www.ncbi.nlm.nih.gov" }
    ],
    brochureUrl: "",
    manufacturerName: "GE HealthCare",
    manufacturerLogoUrl: "",
    manufacturerOverview: "A leading global medical technology and digital solutions innovator specializing in high-end medical imaging platforms.",
    manufacturerWebsite: "https://www.gehealthcare.com",
    manufacturerCountry: "United States",
    manufacturerSpecialization: "3D Tomosynthesis & Ultrasound Systems",
    collaborationStatus: "In Discussion",
    isActive: true,
    orderIndex: 1
  },
  {
    name: "Automated Breast Ultrasound (ABUS)",
    category: "Ultrasound",
    shortOverview: "A radiation-free automated scanning system designed to screen dense breasts in combination with standard mammography.",
    accuracy: "Highly sensitive when combined with mammography (up to 95%)",
    purpose: "Supplementary screening tool for women with dense breast tissue.",
    advantages: "Entirely radiation-free; highly comfortable; automated scan reduces human error from manual probe handling.",
    limitations: "Cannot detect microcalcifications; must be used alongside a mammogram rather than as a replacement.",
    recommendedGroup: "Women with dense breast tissue (BI-RADS category C or D).",
    imageUrl: "/images/abus_system.png",
    introVideoUrl: "/videoplayback.mp4",
    animationVideoUrl: "",
    explainerVideoUrl: "",
    workflow: "A large automated transducer scan panel is positioned on the breast, using high-frequency sound waves to capture complete 3D volumes of breast tissue.",
    stepByStep: "1. The patient lies comfortably on their back.\n2. A clear lotion is applied to the breast to transmit sound waves.\n3. The technician places the automated scanner gently on the breast.\n4. The machine performs a steady automated sweeping motion across the tissue.\n5. Custom software processes the data into volumetric slices.",
    preparation: "No specific restrictions; comfortable two-piece clothing is recommended.",
    duration: "15 to 20 minutes",
    benefits: "Significantly improves detection of invasive cancers in dense breasts that might be invisible on standard mammography.",
    risks: "No known risks. It does not use radiation and is safe during pregnancy.",
    whoShouldTake: "Women with dense breast tissue as an adjunct to regular screening mammograms.",
    faqs: [
      {
        q: "Can ABUS replace a mammogram?",
        a: "No. ABUS is a supplementary test. Mammography is still required because it is superior at detecting calcifications, which are often the earliest signs of cancer."
      }
    ],
    relatedArticles: [
      { title: "The Role of Ultrasound in Dense Breast Screening", link: "https://www.densebreast-info.org" }
    ],
    brochureUrl: "",
    manufacturerName: "Siemens Healthineers",
    manufacturerLogoUrl: "",
    manufacturerOverview: "A pioneer in healthcare innovation offering state-of-the-art diagnostic imaging and clinical lab instruments worldwide.",
    manufacturerWebsite: "https://www.siemens-healthineers.com",
    manufacturerCountry: "Germany",
    manufacturerSpecialization: "High-Resolution Ultrasound, MRI, & Clinical Systems",
    collaborationStatus: "Active Partner",
    isActive: true,
    orderIndex: 2
  },
  {
    name: "Breast MRI (Magnetic Resonance Imaging)",
    category: "Breast MRI",
    shortOverview: "Premium diagnostic scan utilizing powerful magnets and radio waves to generate detailed, multi-angle 3D images of soft tissues.",
    accuracy: "Up to 98% sensitivity (highly sensitive, lower specificity)",
    purpose: "Staging confirmed cancer, scanning high-risk mutation carriers, or checking breast implants.",
    advantages: "Extremely high sensitivity; radiation-free; provides exceptional detail of soft tissue margins.",
    limitations: "Expensive; high rate of false positives leading to unnecessary biopsies; requires intravenous contrast injection (gadolinium).",
    recommendedGroup: "Women with BRCA1/BRCA2 gene mutations, strong family history, or confirmed diagnosis.",
    imageUrl: "/images/breast_mri.png",
    introVideoUrl: "/videoplayback.mp4",
    animationVideoUrl: "",
    explainerVideoUrl: "",
    workflow: "The patient lies face down inside a cylindrical MRI scanner with their breasts placed in cushioned openings containing signal coils.",
    stepByStep: "1. An IV line is inserted into the patient's arm to deliver the contrast agent.\n2. The patient lies prone on the specialized MRI table.\n3. The table slides into the magnetic tube.\n4. The scanner takes multiple sets of images (requires staying completely still).\n5. Contrast is injected midway to highlight vascular patterns around tumors.",
    preparation: "Remove all metal objects. Notify the technician if you have a pacemaker, implants, kidney problems, or claustrophobia.",
    duration: "30 to 45 minutes",
    benefits: "Excellent for surgical planning, identifying cancer spread, and diagnosing high-risk patients whose mammograms look normal.",
    risks: "Minor risk of reaction to contrast dye; feeling of claustrophobia.",
    whoShouldTake: "High-risk women (lifetime risk >20%) or patients preparing for breast surgery.",
    faqs: [
      {
        q: "Does a breast MRI hurt?",
        a: "The scan itself is painless, though lying still on the table and having an IV inserted for contrast can cause mild discomfort. The machine also makes loud clicking noises."
      }
    ],
    relatedArticles: [
      { title: "When is a Breast MRI Recommended?", link: "https://www.mayoclinic.org" }
    ],
    brochureUrl: "",
    manufacturerName: "Philips Healthcare",
    manufacturerLogoUrl: "",
    manufacturerOverview: "A global health technology leader focused on improving health outcomes across the care continuum.",
    manufacturerWebsite: "https://www.philips.com",
    manufacturerCountry: "Netherlands",
    manufacturerSpecialization: "Diagnostic MRI and Advanced Digital Imaging",
    collaborationStatus: "In Discussion",
    isActive: true,
    orderIndex: 3
  },
  {
    name: "AI-Assisted Breast Screening Systems",
    category: "AI Screenings",
    shortOverview: "Cutting-edge artificial intelligence platforms integrated with imaging systems to analyze scans, highlight abnormalities, and gauge breast cancer risk.",
    accuracy: "Assists radiologists, reducing diagnostic errors by up to 30%",
    purpose: "Radiology workflow enhancement, double-reading support, and early lesion highlighting.",
    advantages: "Filters out clear cases quickly, focuses human expertise on suspicious zones, detects patterns invisible to the naked eye.",
    limitations: "Requires high-performance IT infrastructure; must be validated by a certified radiologist; algorithm bias must be monitored.",
    recommendedGroup: "Radiology departments and clinical centers seeking to optimize diagnostic speed and accuracy.",
    imageUrl: "/images/ai_screening.png",
    introVideoUrl: "/videoplayback.mp4",
    animationVideoUrl: "",
    explainerVideoUrl: "",
    workflow: "Deep learning neural networks scan mammogram DICOM files, compare pixel densities against millions of database cases, and flag high-probability regions.",
    stepByStep: "1. The standard mammogram is taken as usual.\n2. The digital mammogram file is sent to the local AI server.\n3. The AI algorithm processes the scan within seconds, highlighting suspicious microcalcifications or masses.\n4. The system assigns a risk score and presents flagged areas to the radiologist for review.",
    preparation: "No additional preparation beyond standard mammography guidelines.",
    duration: "Instant processing (<1 minute)",
    benefits: "Drastically shortens reading backlog, boosts screening confidence, and flags micro-lumps at earlier, treatable stages.",
    risks: "Risk of over-reliance by clinicians; potential for false positives on borderline scans.",
    whoShouldTake: "Clinics using AI double-read systems for patient screening.",
    faqs: [
      {
        q: "Is the AI making the final diagnosis?",
        a: "No. The AI acts as a smart assistant or 'second reader.' The final diagnosis and medical report are always verified and signed off by a human radiologist."
      }
    ],
    relatedArticles: [
      { title: "Artificial Intelligence in Breast Cancer Screening: The Future", link: "https://www.radiologyinfo.org" }
    ],
    brochureUrl: "",
    manufacturerName: "Lunit INSIGHT",
    manufacturerLogoUrl: "",
    manufacturerOverview: "A premier medical AI software company developing state-of-the-art deep learning tools for oncology diagnostics.",
    manufacturerWebsite: "https://www.lunit.io",
    manufacturerCountry: "South Korea",
    manufacturerSpecialization: "Oncology Artificial Intelligence Solutions",
    collaborationStatus: "Active Partner",
    isActive: true,
    orderIndex: 4
  }
];

// Helper to ensure database has technologies seeded
async function ensureSeedTechnologies() {
  try {
    const count = await db.diagnosisTechnology.count();
    if (count === 0) {
      for (const tech of SEED_TECHNOLOGIES) {
        await db.diagnosisTechnology.create({
          data: {
            ...tech,
            faqs: tech.faqs as any,
            relatedArticles: tech.relatedArticles as any
          }
        });
      }
      console.log("Diagnostic technologies seeded successfully.");
    }
  } catch (error) {
    console.error("Failed to seed diagnostic technologies:", error);
  }
}

// 1. Get technologies
export async function getDiagnosisTechnologies(activeOnly = true) {
  try {
    await ensureSeedTechnologies();
    const whereClause = activeOnly ? { isActive: true } : {};
    const technologies = await db.diagnosisTechnology.findMany({
      where: whereClause,
      orderBy: { orderIndex: "asc" }
    });
    return { success: true, technologies };
  } catch (error: any) {
    console.error("Error in getDiagnosisTechnologies:", error);
    return { success: false, error: error.message || "Failed to retrieve technologies" };
  }
}

// 2. Get single technology
export async function getDiagnosisTechnology(id: string) {
  try {
    const technology = await db.diagnosisTechnology.findUnique({
      where: { id }
    });
    if (!technology) {
      return { success: false, error: "Technology not found." };
    }
    return { success: true, technology };
  } catch (error: any) {
    console.error("Error in getDiagnosisTechnology:", error);
    return { success: false, error: error.message || "Failed to retrieve technology" };
  }
}

// 3. Create technology (Admin)
export async function createDiagnosisTechnology(data: {
  name: string;
  category: string;
  shortOverview: string;
  accuracy?: string | null;
  purpose: string;
  advantages: string;
  limitations: string;
  recommendedGroup: string;
  imageUrl?: string | null;
  introVideoUrl?: string | null;
  animationVideoUrl?: string | null;
  explainerVideoUrl?: string | null;
  workflow?: string | null;
  stepByStep?: string | null;
  preparation?: string | null;
  duration?: string | null;
  benefits?: string | null;
  risks?: string | null;
  whoShouldTake?: string | null;
  faqs?: Array<{ q: string; a: string }> | null;
  relatedArticles?: Array<{ title: string; link: string }> | null;
  brochureUrl?: string | null;
  manufacturerName: string;
  manufacturerLogoUrl?: string | null;
  manufacturerOverview?: string | null;
  manufacturerWebsite?: string | null;
  manufacturerCountry?: string | null;
  manufacturerSpecialization?: string | null;
  collaborationStatus?: string | null;
  isActive?: boolean;
}) {
  try {
    await requireAdmin();
    
    // Find next orderIndex
    const lastTech = await db.diagnosisTechnology.findFirst({
      orderBy: { orderIndex: "desc" }
    });
    const orderIndex = lastTech ? lastTech.orderIndex + 1 : 0;

    const newTech = await db.diagnosisTechnology.create({
      data: {
        ...data,
        isActive: data.isActive ?? true,
        orderIndex,
        faqs: (data.faqs || []) as any,
        relatedArticles: (data.relatedArticles || []) as any
      }
    });

    revalidatePath("/diagnosis");
    revalidatePath("/admin/diagnosis");
    return { success: true, technology: newTech };
  } catch (error: any) {
    console.error("Error in createDiagnosisTechnology:", error);
    return { success: false, error: error.message || "Failed to create technology" };
  }
}

// 4. Update technology (Admin)
export async function updateDiagnosisTechnology(
  id: string,
  data: Partial<{
    name: string;
    category: string;
    shortOverview: string;
    accuracy: string | null;
    purpose: string;
    advantages: string;
    limitations: string;
    recommendedGroup: string;
    imageUrl: string | null;
    introVideoUrl: string | null;
    animationVideoUrl: string | null;
    explainerVideoUrl: string | null;
    workflow: string | null;
    stepByStep: string | null;
    preparation: string | null;
    duration: string | null;
    benefits: string | null;
    risks: string | null;
    whoShouldTake: string | null;
    faqs: Array<{ q: string; a: string }>;
    relatedArticles: Array<{ title: string; link: string }>;
    brochureUrl: string | null;
    manufacturerName: string;
    manufacturerLogoUrl: string | null;
    manufacturerOverview: string | null;
    manufacturerWebsite: string | null;
    manufacturerCountry: string | null;
    manufacturerSpecialization: string | null;
    collaborationStatus: string | null;
    isActive: boolean;
  }>
) {
  try {
    await requireAdmin();

    const updated = await db.diagnosisTechnology.update({
      where: { id },
      data: {
        ...data,
        faqs: data.faqs ? (data.faqs as any) : undefined,
        relatedArticles: data.relatedArticles ? (data.relatedArticles as any) : undefined
      }
    });

    revalidatePath("/diagnosis");
    revalidatePath("/admin/diagnosis");
    return { success: true, technology: updated };
  } catch (error: any) {
    console.error("Error in updateDiagnosisTechnology:", error);
    return { success: false, error: error.message || "Failed to update technology" };
  }
}

// 5. Delete technology (Admin)
export async function deleteDiagnosisTechnology(id: string) {
  try {
    await requireAdmin();
    await db.diagnosisTechnology.delete({
      where: { id }
    });
    revalidatePath("/diagnosis");
    revalidatePath("/admin/diagnosis");
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteDiagnosisTechnology:", error);
    return { success: false, error: error.message || "Failed to delete technology" };
  }
}

// 6. Reorder technologies (Admin)
export async function reorderDiagnosisTechnologies(ids: string[]) {
  try {
    await requireAdmin();
    await db.$transaction(
      ids.map((id, index) =>
        db.diagnosisTechnology.update({
          where: { id },
          data: { orderIndex: index }
        })
      )
    );
    revalidatePath("/diagnosis");
    revalidatePath("/admin/diagnosis");
    return { success: true };
  } catch (error: any) {
    console.error("Error in reorderDiagnosisTechnologies:", error);
    return { success: false, error: error.message || "Failed to reorder technologies" };
  }
}

// 7. Submit collaboration request (Public)
export async function submitCollaborationRequest(data: {
  organizationName: string;
  companyName: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  country: string;
  website?: string;
  technologyName: string;
  collaborationType: string;
  description: string;
  brochureUrl?: string;
  companyProfileUrl?: string;
  consent: boolean;
}) {
  try {
    if (!data.consent) {
      throw new Error("Consent is required to submit a collaboration request.");
    }

    const newRequest = await db.collaborationRequest.create({
      data: {
        organizationName: data.organizationName,
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        designation: data.designation,
        email: data.email,
        phone: data.phone,
        country: data.country,
        website: data.website || null,
        technologyName: data.technologyName,
        collaborationType: data.collaborationType,
        description: data.description,
        brochureUrl: data.brochureUrl || null,
        companyProfileUrl: data.companyProfileUrl || null,
        consent: data.consent,
        status: "PENDING"
      }
    });

    // Simulate sending email to administration and to submitter
    console.log(`[Email Simulation] Collaboration request saved. Status: PENDING.`);
    console.log(`To: ${data.email} | Subject: Collaboration Request Confirmation`);
    console.log(`To: grsindiacorp@gmail.com | Subject: New Collaboration Request from ${data.organizationName}`);

    revalidatePath("/admin/diagnosis");
    return { success: true, requestId: newRequest.id };
  } catch (error: any) {
    console.error("Error in submitCollaborationRequest:", error);
    return { success: false, error: error.message || "Failed to submit request" };
  }
}

// 8. Get collaboration requests (Admin)
export async function getCollaborationRequests() {
  try {
    await requireAdmin();
    const requests = await db.collaborationRequest.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { success: true, requests };
  } catch (error: any) {
    console.error("Error in getCollaborationRequests:", error);
    return { success: false, error: error.message || "Failed to retrieve requests" };
  }
}

// 9. Update collaboration request status (Admin)
export async function updateCollaborationRequestStatus(id: string, status: "PENDING" | "APPROVED" | "REJECTED") {
  try {
    await requireAdmin();
    const updated = await db.collaborationRequest.update({
      where: { id },
      data: { status }
    });
    
    // Simulate status update email notification
    console.log(`[Email Simulation] Collaboration request status updated to ${status}.`);
    console.log(`To: ${updated.email} | Subject: Collaboration Request Status Update`);

    revalidatePath("/admin/diagnosis");
    return { success: true, request: updated };
  } catch (error: any) {
    console.error("Error in updateCollaborationRequestStatus:", error);
    return { success: false, error: error.message || "Failed to update status" };
  }
}

// 10. Delete collaboration request (Admin)
export async function deleteCollaborationRequest(id: string) {
  try {
    await requireAdmin();
    await db.collaborationRequest.delete({
      where: { id }
    });
    revalidatePath("/admin/diagnosis");
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteCollaborationRequest:", error);
    return { success: false, error: error.message || "Failed to delete request" };
  }
}

const { PrismaClient, Role, VerificationStatus } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const databaseUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_RJ9ANnk4VMEU@ep-bold-sky-ayhd61tw.c-5.us-east-2.aws.neon.tech/neondb?sslmode=verify-full";

const pool = new Pool({
  connectionString: databaseUrl,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting Neon database seeding...");

  // 1. Seed Admin User
  const adminEmail = "admin@grsawareness.org";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("Admin@12345", 10);
    const adminUser = await prisma.user.create({
      data: {
        name: "GRS Admin",
        email: adminEmail,
        passwordHash,
        role: Role.ADMIN,
        profile: {
          create: {
            verificationStatus: VerificationStatus.VERIFIED,
          },
        },
      },
    });
    console.log("Admin user created successfully:", adminUser.email);
  } else {
    console.log("Admin user already exists.");
  }

  // 2. Seed Home Page Updates
  const homeUpdatesCount = await prisma.homePageUpdate.count();
  if (homeUpdatesCount === 0) {
    await prisma.homePageUpdate.createMany({
      data: [
        {
          category: "Webinar",
          imageUrl: "/images/cancer_research.png",
          title: "Advances in Early Breast Cancer Staging",
          shortDescription: "Join Dr. Jyoti Bajpai for a virtual panel discussion on non-invasive screening technologies and clinical outcomes.",
          detailedContent: "Comprehensive analysis of modern diagnostic technologies, self-exam protocols, and financial aid systems.",
          eventDate: new Date("2026-08-15T10:00:00Z"),
          destinationLink: "/webinars",
          orderIndex: 1,
          isActive: true,
        },
        {
          category: "Campaign",
          imageUrl: "/images/awareness1.png",
          title: "Mobile Mammography Outreach Drive 2026",
          shortDescription: "Deploying 12 state-of-the-art mobile testing vans across rural districts to provide free clinical checkups.",
          detailedContent: "Direct hospital payout coordination ensures your donation builds hope.",
          eventDate: new Date("2026-09-01T09:00:00Z"),
          destinationLink: "/campaigns/breast-cancer",
          orderIndex: 2,
          isActive: true,
        },
      ],
    });
    console.log("Home Page Updates seeded.");
  }

  // 3. Seed Sponsor Banners
  const sponsorCount = await prisma.sponsorBanner.count();
  if (sponsorCount === 0) {
    await prisma.sponsorBanner.createMany({
      data: [
        {
          logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/1200px-SBI-logo.svg.png",
          imageUrl: "/images/awareness1.png",
          title: "State Bank of India CSR Partnership",
          description: "Sponsoring 500+ free mammograms for rural underprivileged women in 2026.",
          destinationLink: "/care/partner-organizations",
          orderIndex: 1,
          isActive: true,
        },
      ],
    });
    console.log("Sponsor Banners seeded.");
  }

  // 4. Seed Celebrity Testimonials
  const celebrityCount = await prisma.celebrityTestimonial.count();
  if (celebrityCount === 0) {
    await prisma.celebrityTestimonial.createMany({
      data: [
        {
          videoUrl: "/videoplayback.mp4",
          thumbnailUrl: "/images/volunteers.png",
          name: "Vidya Balan",
          profession: "Actress & Women's Health Advocate",
          duration: "2:45",
          quote: "Early detection is not just a medical procedure; it is a pledge of love to your family.",
          description: "National Ambassador for Breast Cancer Mission Platform.",
          orderIndex: 1,
          isActive: true,
        },
      ],
    });
    console.log("Celebrity Testimonials seeded.");
  }

  // 5. Seed Live Updates
  const liveUpdatesCount = await prisma.liveUpdate.count();
  if (liveUpdatesCount === 0) {
    await prisma.liveUpdate.createMany({
      data: [
        {
          category: "Webinar",
          imageUrl: "/images/cancer_research.png",
          title: "Clinical Physical Exam Protocols",
          shortDescription: "Live interactive clinical training session for oncology nurses & healthcare volunteers.",
          fullDescription: "Learn clinical physical screening techniques, patient counseling, and early diagnostic referral protocols.",
          eventDate: new Date("2026-08-20T14:00:00Z"),
          eventTime: "2:00 PM - 4:00 PM IST",
          venue: "Virtual Live Stream (Zoom)",
          speakerName: "Dr. Jyoti Bajpai",
          registrationLink: "/webinars",
          isFeatured: true,
          isActive: true,
          orderIndex: 1,
        },
      ],
    });
    console.log("Live Updates seeded.");
  }

  // 6. Seed Success Stories
  const storiesCount = await prisma.successStory.count();
  if (storiesCount === 0) {
    await prisma.successStory.createMany({
      data: [
        {
          fullName: "Shagufta Ali",
          email: "shagufta@example.com",
          mobileNumber: "9876543210",
          city: "New Delhi",
          state: "Delhi",
          age: 36,
          roleType: "Patient",
          storyTitle: "From Stage II Diagnosis to Full Recovery",
          completeStory: "Diagnosed at 35, Shagufta was terrified she wouldn't see her two young daughters grow up. Through the Breast Cancer Mission Platform, her surgery and chemotherapy cost was fully funded.",
          videoUrl: "/videoplayback.mp4",
          imageUrls: ["/images/Cancer Patients.jpg"],
          treatmentHospital: "AIIMS Delhi",
          consent: true,
          status: "VERIFIED",
        },
        {
          fullName: "Lakshmi Devi",
          email: "lakshmi@example.com",
          mobileNumber: "9876543211",
          city: "Gurugram",
          state: "Haryana",
          age: 49,
          roleType: "Patient",
          storyTitle: "Saved by a Free Rural Screening Camp",
          completeStory: "Lakshmi felt a lump but delayed consulting due to financial constraints. A mobile screening camp detected her tumor in Stage III and immediately enrolled her in emergency radiation therapy.",
          videoUrl: "/videoplayback.mp4",
          imageUrls: ["/images/Cancer Patients1.jpg"],
          treatmentHospital: "Medanta Gurugram",
          consent: true,
          status: "VERIFIED",
        },
      ],
    });
    console.log("Success Stories seeded.");
  }

  // 7. Seed Diagnosis Technologies
  const techCount = await prisma.diagnosisTechnology.count();
  if (techCount === 0) {
    await prisma.diagnosisTechnology.createMany({
      data: [
        {
          name: "Digital 3D Mammography (DBT)",
          category: "Radiological Imaging",
          shortOverview: "Advanced three-dimensional breast imaging providing higher accuracy for dense tissue.",
          accuracy: "96.4%",
          purpose: "Primary early detection screening & micro-calcification evaluation",
          advantages: "Higher lesion detection\nLower recall rates\nClear 3D slice visualization",
          limitations: "Higher initial equipment cost\nRequires specialized radiologist review",
          recommendedGroup: "Women aged 40+ or high risk family history",
          imageUrl: "/images/cancer_research.png",
          introVideoUrl: "/videoplayback.mp4",
          workflow: "Patient Positioning -> 3D Low-Dose Scan -> AI Analysis -> Radiologist Verification",
          duration: "15-20 Minutes",
          benefits: "Detects tumors 2-3 years before physical palpation.",
          faqs: [{ q: "Is radiation safe?", a: "Yes, low-dose radiation complies with international safety standards." }],
          manufacturerName: "Hologic / Siemens Healthineers",
          isActive: true,
          orderIndex: 1,
        },
      ],
    });
    console.log("Diagnosis Technologies seeded.");
  }

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

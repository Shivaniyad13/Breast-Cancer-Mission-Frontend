process.env.DATABASE_URL = "postgresql://postgres:Post%40321@localhost:5432/grs_awareness?schema=public";
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Success stories count:", await prisma.successStory.count());
  console.log("Sponsor banners count:", await prisma.sponsorBanner.count());
  console.log("Celebrity testimonials count:", await prisma.celebrityTestimonial.count());
  console.log("Live updates count:", await prisma.liveUpdate.count());
  console.log("Diagnosis technologies count:", await prisma.diagnosisTechnology.count());
  console.log("Collaboration requests count:", await prisma.collaborationRequest.count());
}
main().catch(console.error).finally(() => prisma.$disconnect());

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Prisma Client using pg driver adapter
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Configure CORS
app.use(cors());
app.use(express.json());

// Resolve public folder paths dynamically
const frontendPublicDir = path.resolve(__dirname, "../../frontend/public");
const backendPublicDir = path.resolve(__dirname, "../public");
const publicDir = fs.existsSync(frontendPublicDir) ? frontendPublicDir : backendPublicDir;
const uploadDir = path.join(publicDir, "uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExt = path.extname(file.originalname) || ".pdf";
    const baseName = file.originalname
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "_");
    cb(null, `${baseName}-${uniqueSuffix}${fileExt}`);
  },
});

const upload = multer({ storage });

// 1. Health check API
app.get("/api/health", async (req, res) => {
  try {
    // Ping the database
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "OK",
      uptime: process.uptime(),
      database: "CONNECTED",
      timestamp: new Date(),
    });
  } catch (error: any) {
    console.error("Healthcheck database connection error:", error);
    res.status(500).json({
      status: "ERROR",
      database: "DISCONNECTED",
      error: error.message || error,
    });
  }
});

// 2. Upload file API
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ url: fileUrl });
  } catch (error: any) {
    console.error("Upload API error:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
});

// 3. Download certificate API
app.get("/api/certificates/:id/download", async (req, res) => {
  try {
    const { id } = req.params;

    // Search for certificate by ID or string representation
    const cert = await prisma.certificate.findFirst({
      where: {
        OR: [
          { id },
          { certificateIdString: id },
        ],
      },
    });

    if (!cert) {
      return res.status(404).send("Certificate not found");
    }

    const filePath = path.join(publicDir, cert.pdfStorageUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("PDF file not found on disk");
    }

    res.download(filePath, `${cert.certificateIdString}.pdf`, (err) => {
      if (err) {
        console.error("Error during certificate download:", err);
        if (!res.headersSent) {
          res.status(500).send("Error downloading file");
        }
      }
    });
  } catch (error: any) {
    console.error("Download certificate error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`[BACKEND SERVER] Running on port ${PORT}`);
  console.log(`[BACKEND SERVER] Upload path resolved to: ${uploadDir}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down backend server...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("Backend server offline.");
    process.exit(0);
  });
});

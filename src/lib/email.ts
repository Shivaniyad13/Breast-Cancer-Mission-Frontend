import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  // Dev fallback — agar SMTP setup nahi hai toh console mein URL print hoga
  if (!process.env.SMTP_HOST) {
    console.log("\n════════════════════════════════════════════");
    console.log("📧 PASSWORD RESET LINK (DEV MODE)");
    console.log(`To: ${to}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log("════════════════════════════════════════════\n");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@yourdomain.com",
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color: #db2777;">Reset Your Password</h2>
        <p>We received a request to reset your password. Click below to set a new one.</p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 24px;background:#db2777;color:#fff;
                  border-radius:8px;text-decoration:none;font-weight:600;">
          Reset Password
        </a>
        <p style="color:#666;font-size:12px;margin-top:24px;">
          This link expires in 30 minutes. If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  });
}
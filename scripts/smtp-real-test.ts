import nodemailer from "nodemailer";

async function main() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || `"Cancer Mukt Bharat Abhiyan" <${user}>`;

  console.log("=== SMTP CONFIGURATION CHECK ===");
  console.log("SMTP_HOST:", host);
  console.log("SMTP_PORT:", port);
  console.log("SMTP_USER:", user);
  console.log("SMTP_PASS (length):", pass ? pass.length : 0);
  console.log("SMTP_FROM:", from);
  console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
  console.log("===============================\n");

  if (!host || !user || !pass) {
    console.error("ERROR: Missing SMTP host, user, or pass in environment!");
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  console.log("Verifying SMTP transporter connection...");
  try {
    const verifyResult = await transporter.verify();
    console.log("✅ SMTP Verify Result:", verifyResult);
  } catch (verifyError: any) {
    console.error("❌ SMTP Verify Failed!");
    console.error("Full Error Object:", verifyError);
    console.error("Error Code:", verifyError.code);
    console.error("Command:", verifyError.command);
    console.error("Response Code:", verifyError.responseCode);
    console.error("Response:", verifyError.response);
    process.exit(1);
  }

  const recipients = ["shivanig39aiml@gmail.com", "breastcancermission3@gmail.com"];

  for (const recipient of recipients) {
    console.log(`\nSending test email to ${recipient}...`);
    try {
      const info = await transporter.sendMail({
        from,
        to: recipient,
        subject: "SMTP Real End-to-End Test Verification",
        html: `<p>This is a real SMTP end-to-end verification test message for <b>${recipient}</b>.</p>`,
      });
      console.log(`✅ Test email sent to ${recipient}`);
      console.log("Message ID:", info.messageId);
      console.log("Accepted:", info.accepted);
      console.log("Rejected:", info.rejected);
      console.log("Response:", info.response);
    } catch (sendError: any) {
      console.error(`❌ Failed to send test email to ${recipient}:`, sendError);
      console.error("Full Error Object:", sendError);
    }
  }
}

main().catch((err) => {
  console.error("Unhandled script error:", err);
  process.exit(1);
});

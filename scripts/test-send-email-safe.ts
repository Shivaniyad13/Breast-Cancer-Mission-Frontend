import { sendEmailSafe } from "../src/lib/email";

async function main() {
  console.log("Testing sendEmailSafe()...");
  const ok = await sendEmailSafe({
    to: "shivanig39aiml@gmail.com",
    subject: "sendEmailSafe real test",
    html: "<b>ok</b>",
  });
  console.log("sendEmailSafe returned:", ok);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error in test-send-email-safe:", err);
  process.exit(1);
});

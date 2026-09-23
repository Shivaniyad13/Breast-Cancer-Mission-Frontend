import {
  sendPasswordResetEmail,
  sendUserRegistrationEmail,
  sendAdminRegistrationAlert,
  sendDoctorVerificationStatusEmail,
  sendArticleStatusEmail,
  sendWebinarApprovalStatusEmail,
  sendWebinarRegistrationConfirmationEmail,
  sendWebinarReminderEmail,
  sendWebinarScheduleUpdateEmail,
  sendVolunteerStatusEmail,
  sendVolunteerEventApplicationEmail,
  sendPartnershipStatusEmail,
  sendResearchPartnerStatusEmail,
  sendCollaborationStatusEmail,
  sendSuccessStoryStatusEmail,
  sendDonationReceiptEmail,
  sendDonationPendingEmail,
  sendDonationStatusEmail,
  sendInstitutionalApplicationStatusEmail,
  sendIndividualMemberStatusEmail,
} from "../src/lib/email";

interface TestResult {
  num: number;
  workflow: string;
  triggered: boolean;
  from: string;
  to: string;
  serverLog: string;
  notes: string;
}

const results: TestResult[] = [];
let testCounter = 1;

const USER_EMAIL = "shivanig39aiml@gmail.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "breastcancermission3@gmail.com";
const SMTP_FROM = process.env.SMTP_FROM || `"Cancer Mukt Bharat Abhiyan" <${process.env.SMTP_USER}>`;

async function runTest(
  workflowName: string,
  from: string,
  to: string,
  fn: () => Promise<void>
) {
  const currentNum = testCounter++;
  console.log(`\n--- Running Flow #${currentNum}: ${workflowName} ---`);
  let serverLog = "UNKNOWN";
  let triggered = false;

  // Intercept console.log and console.error to capture server log line
  const origLog = console.log;
  const origErr = console.error;
  let capturedLog = "";

  console.log = (...args: any[]) => {
    origLog(...args);
    const msg = args.join(" ");
    if (msg.includes("[SMTP SUCCESS]") || msg.includes("[SMTP ERROR]") || msg.includes("DEV MODE")) {
      capturedLog = msg;
    }
  };
  console.error = (...args: any[]) => {
    origErr(...args);
    const msg = args.join(" ");
    if (msg.includes("[SMTP SUCCESS]") || msg.includes("[SMTP ERROR]") || msg.includes("DEV MODE")) {
      capturedLog = msg;
    }
  };

  try {
    await fn();
    triggered = true;
    serverLog = capturedLog || "[SMTP SUCCESS]";
    results.push({
      num: currentNum,
      workflow: workflowName,
      triggered: true,
      from,
      to,
      serverLog,
      notes: "Email accepted by SMTP server",
    });
  } catch (err: any) {
    serverLog = capturedLog || `[SMTP ERROR]: ${err.message}`;
    results.push({
      num: currentNum,
      workflow: workflowName,
      triggered: false,
      from,
      to,
      serverLog,
      notes: `Failed: ${err.message}`,
    });
  } finally {
    console.log = origLog;
    console.error = origErr;
  }
}

async function main() {
  console.log("==================================================");
  console.log("STARTING REAL WORKFLOW E2E SMTP TESTING");
  console.log(`User Email: ${USER_EMAIL}`);
  console.log(`Admin Email: ${ADMIN_EMAIL}`);
  console.log("==================================================");

  // 4a. Registration & Admin Alert
  await runTest(
    "4a. User Registration Confirmation",
    SMTP_FROM,
    USER_EMAIL,
    () => sendUserRegistrationEmail({ to: USER_EMAIL, userName: "Shivani G", role: "VOLUNTEER" })
  );

  await runTest(
    "4a. Doctor Registration (Pending)",
    SMTP_FROM,
    USER_EMAIL,
    () => sendUserRegistrationEmail({ to: USER_EMAIL, userName: "Dr. Shivani G", role: "DOCTOR", verificationStatus: "PENDING" })
  );

  await runTest(
    "4a. Admin Registration Alert",
    SMTP_FROM,
    ADMIN_EMAIL,
    () => sendAdminRegistrationAlert({ type: "Doctor Registration", applicantName: "Dr. Shivani G", applicantEmail: USER_EMAIL, role: "DOCTOR", details: "New doctor registration requiring review" })
  );

  // 4b. Forgot password
  await runTest(
    "4b. Forgot Password Reset Link",
    SMTP_FROM,
    USER_EMAIL,
    () => sendPasswordResetEmail(USER_EMAIL, "https://breast-cancer-mission.vercel.app/reset-password?token=test-token-123")
  );

  // 4c. Doctor flows
  await runTest(
    "4c. Doctor Article Submission (Admin Alert)",
    SMTP_FROM,
    ADMIN_EMAIL,
    () => sendAdminRegistrationAlert({ type: "Medical Article Submission", applicantName: "Dr. Shivani G", applicantEmail: USER_EMAIL, role: "Oncologist", details: "Article: Understanding Early Stage Mammography" })
  );

  await runTest(
    "4c. Doctor Article Approval",
    SMTP_FROM,
    USER_EMAIL,
    () => sendArticleStatusEmail({ to: USER_EMAIL, doctorName: "Shivani G", articleTitle: "Understanding Early Stage Mammography", articleSlug: "understanding-early-mammography", status: "APPROVED" })
  );

  await runTest(
    "4c. Doctor Article Rejection",
    SMTP_FROM,
    USER_EMAIL,
    () => sendArticleStatusEmail({ to: USER_EMAIL, doctorName: "Shivani G", articleTitle: "Draft Article on Clinical Care", status: "REJECTED", rejectionReason: "Needs additional clinical citations." })
  );

  await runTest(
    "4c. Doctor Paid Webinar Submission (Admin Alert)",
    SMTP_FROM,
    ADMIN_EMAIL,
    () => sendAdminRegistrationAlert({ type: "Paid Webinar Submission", applicantName: "Dr. Shivani G", applicantEmail: USER_EMAIL, role: "DOCTOR", details: "Webinar: Advances in Early Screening Technologies" })
  );

  await runTest(
    "4c. Doctor Webinar Approval",
    SMTP_FROM,
    USER_EMAIL,
    () => sendWebinarApprovalStatusEmail({ to: USER_EMAIL, doctorName: "Shivani G", webinarTitle: "Advances in Early Screening Technologies", status: "APPROVED" })
  );

  await runTest(
    "4c. Doctor Webinar Rejection",
    SMTP_FROM,
    USER_EMAIL,
    () => sendWebinarApprovalStatusEmail({ to: USER_EMAIL, doctorName: "Shivani G", webinarTitle: "Experimental Screening Methods", status: "REJECTED", rejectionReason: "Schedule conflict with national conference." })
  );

  // 4d. Webinar user flows
  await runTest(
    "4d. Webinar User Registration Confirmation",
    SMTP_FROM,
    USER_EMAIL,
    () => sendWebinarRegistrationConfirmationEmail({ to: USER_EMAIL, userName: "Shivani G", webinarTitle: "Breast Cancer Awareness Webinar", date: "2026-10-15", startTime: "10:00 AM", durationMinutes: 60, meetingLink: "https://meet.google.com/abc-defg-hij" })
  );

  await runTest(
    "4d. Webinar Broadcast Reminder",
    SMTP_FROM,
    USER_EMAIL,
    () => sendWebinarReminderEmail({ to: USER_EMAIL, userName: "Shivani G", webinarTitle: "Breast Cancer Awareness Webinar", date: "2026-10-15", startTime: "10:00 AM", meetingLink: "https://meet.google.com/abc-defg-hij" })
  );

  await runTest(
    "4d. Webinar Schedule Update",
    SMTP_FROM,
    USER_EMAIL,
    () => sendWebinarScheduleUpdateEmail({ to: USER_EMAIL, userName: "Shivani G", webinarTitle: "Breast Cancer Awareness Webinar", date: "2026-10-16", startTime: "11:00 AM", changeType: "UPDATED" })
  );

  await runTest(
    "4d. Webinar Cancellation Notice",
    SMTP_FROM,
    USER_EMAIL,
    () => sendWebinarScheduleUpdateEmail({ to: USER_EMAIL, userName: "Shivani G", webinarTitle: "Breast Cancer Awareness Webinar", changeType: "CANCELLED" })
  );

  // 4e. Volunteer flows
  await runTest(
    "4e. Volunteer Registration (Pending)",
    SMTP_FROM,
    USER_EMAIL,
    () => sendVolunteerStatusEmail({ to: USER_EMAIL, volunteerName: "Shivani G", status: "PENDING" })
  );

  await runTest(
    "4e. Volunteer Application Admin Alert",
    SMTP_FROM,
    ADMIN_EMAIL,
    () => sendAdminRegistrationAlert({ type: "Volunteer Application", applicantName: "Shivani G", applicantEmail: USER_EMAIL, role: "Community Outreach Volunteer" })
  );

  await runTest(
    "4e. Volunteer Application Approved (Verified)",
    SMTP_FROM,
    USER_EMAIL,
    () => sendVolunteerStatusEmail({ to: USER_EMAIL, volunteerName: "Shivani G", status: "VERIFIED", certificateCode: "VOL-2026-SHIVANI" })
  );

  await runTest(
    "4e. Volunteer Application Rejected",
    SMTP_FROM,
    USER_EMAIL,
    () => sendVolunteerStatusEmail({ to: USER_EMAIL, volunteerName: "Shivani G", status: "REJECTED", rejectionReason: "Location outside campaign coverage." })
  );

  await runTest(
    "4e. Volunteer Event Application Confirmation",
    SMTP_FROM,
    USER_EMAIL,
    () => sendVolunteerEventApplicationEmail({ to: USER_EMAIL, volunteerName: "Shivani G", eventTitle: "Pink Ribbon Campus Drive 2026" })
  );

  // 4f. Partnership / Research / Diagnosis / Success Story / Institutional / Individual
  await runTest(
    "4f. Awareness Partnership Submit (Admin Alert)",
    SMTP_FROM,
    ADMIN_EMAIL,
    () => sendAdminRegistrationAlert({ type: "Awareness Partnership Request", applicantName: "Shivani G", applicantEmail: USER_EMAIL, role: "Partner Liaison", details: "Organization: Health Outreach Foundation" })
  );

  await runTest(
    "4f. Awareness Partnership Approved",
    SMTP_FROM,
    USER_EMAIL,
    () => sendPartnershipStatusEmail({ to: USER_EMAIL, contactPersonName: "Shivani G", organizationName: "Health Outreach Foundation", status: "APPROVED" })
  );

  await runTest(
    "4f. Awareness Partnership Rejected",
    SMTP_FROM,
    USER_EMAIL,
    () => sendPartnershipStatusEmail({ to: USER_EMAIL, contactPersonName: "Shivani G", organizationName: "Health Outreach Foundation", status: "REJECTED", remarks: "Duplicate entity application." })
  );

  await runTest(
    "4f. Research Partner Approved",
    SMTP_FROM,
    USER_EMAIL,
    () => sendResearchPartnerStatusEmail({ to: USER_EMAIL, applicantName: "Shivani G", institution: "AIIMS Research Lab", status: "APPROVED" })
  );

  await runTest(
    "4f. Research Partner Rejected",
    SMTP_FROM,
    USER_EMAIL,
    () => sendResearchPartnerStatusEmail({ to: USER_EMAIL, applicantName: "Shivani G", institution: "AIIMS Research Lab", status: "REJECTED", rejectionReason: "Scope outside current research protocol." })
  );

  await runTest(
    "4f. MedTech Diagnosis Collaboration Approved",
    SMTP_FROM,
    USER_EMAIL,
    () => sendCollaborationStatusEmail({ to: USER_EMAIL, contactPerson: "Shivani G", companyName: "OncoTech Solutions", technologyName: "AI Screening Suite", status: "APPROVED" })
  );

  await runTest(
    "4f. MedTech Diagnosis Collaboration Rejected",
    SMTP_FROM,
    USER_EMAIL,
    () => sendCollaborationStatusEmail({ to: USER_EMAIL, contactPerson: "Shivani G", companyName: "OncoTech Solutions", technologyName: "AI Screening Suite", status: "REJECTED", rejectionReason: "Trial phase incomplete." })
  );

  await runTest(
    "4f. Patient Success Story Published",
    SMTP_FROM,
    USER_EMAIL,
    () => sendSuccessStoryStatusEmail({ to: USER_EMAIL, fullName: "Shivani G", storyTitle: "My Journey to Recovery & Hope", status: "VERIFIED" })
  );

  await runTest(
    "4f. Patient Success Story Unapproved",
    SMTP_FROM,
    USER_EMAIL,
    () => sendSuccessStoryStatusEmail({ to: USER_EMAIL, fullName: "Shivani G", storyTitle: "Unverified Claims Draft", status: "REJECTED" })
  );

  await runTest(
    "4f. Institutional Member Approved",
    SMTP_FROM,
    USER_EMAIL,
    () => sendInstitutionalApplicationStatusEmail({ to: USER_EMAIL, recipientName: "Shivani G", entityName: "Care Cancer NGO", entityType: "Organization Member", status: "VERIFIED" })
  );

  await runTest(
    "4f. Individual Member Approved",
    SMTP_FROM,
    USER_EMAIL,
    () => sendIndividualMemberStatusEmail({ to: USER_EMAIL, memberName: "Shivani G", status: "VERIFIED" })
  );

  // 4g. Donation flows
  await runTest(
    "4g. Donation Pending (Donor Acknowledgment)",
    SMTP_FROM,
    USER_EMAIL,
    () => sendDonationPendingEmail({ to: USER_EMAIL, donorName: "Shivani G", amount: 5000, currency: "INR", transactionId: "TXN-2026-987654", campaignTitle: "Free Mammography Camp" })
  );

  await runTest(
    "4g. Donation Pending (Admin Alert)",
    SMTP_FROM,
    ADMIN_EMAIL,
    () => sendAdminRegistrationAlert({ type: "Donation Submitted for Verification", applicantName: "Shivani G", applicantEmail: USER_EMAIL, role: "Donor", details: "Amount: ₹5,000 | Ref: TXN-2026-987654" })
  );

  await runTest(
    "4g. Donation Payment Confirmed & 80G Tax Receipt",
    SMTP_FROM,
    USER_EMAIL,
    () => sendDonationReceiptEmail({ to: USER_EMAIL, donorName: "Shivani G", amount: 5000, currency: "INR", transactionId: "TXN-2026-987654", campaignTitle: "Free Mammography Camp", donationDate: "2026-09-23 16:40 IST" })
  );

  await runTest(
    "4g. Donation Payment Failed Notice",
    SMTP_FROM,
    USER_EMAIL,
    () => sendDonationStatusEmail({ to: USER_EMAIL, donorName: "Shivani G", amount: 5000, currency: "INR", transactionId: "TXN-2026-000000", status: "FAILED", reason: "Bank verification mismatch." })
  );

  await runTest(
    "4g. Donation Refund Processed Notice",
    SMTP_FROM,
    USER_EMAIL,
    () => sendDonationStatusEmail({ to: USER_EMAIL, donorName: "Shivani G", amount: 5000, currency: "INR", transactionId: "TXN-2026-987654", status: "REFUNDED", reason: "Requested by donor within 24 hours." })
  );

  console.log("\n==================================================");
  console.log("SUMMARY RESULTS TABLE");
  console.log("==================================================");
  console.table(results);

  process.exit(0);
}

main().catch((err) => {
  console.error("Workflow E2E Test execution error:", err);
  process.exit(1);
});

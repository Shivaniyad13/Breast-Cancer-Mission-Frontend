import nodemailer from "nodemailer";

/**
 * Gets Nodemailer Transporter instance configured via environment variables.
 * Returns null if SMTP configuration is incomplete.
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

/**
 * Renders a clean, responsive HTML email template with Cancer Mukt Bharat Abhiyan branding.
 */
export function renderEmailLayout(options: {
  title: string;
  greeting?: string;
  contentHtml: string;
  statusBadge?: { text: string; color: "green" | "red" | "amber" | "blue" };
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  const badgeColors = {
    green: { bg: "#dcfce7", text: "#15803d", border: "#86efac" },
    red: { bg: "#fee2e2", text: "#b91c1c", border: "#fca5a5" },
    amber: { bg: "#fef3c7", text: "#b45309", border: "#fde68a" },
    blue: { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" },
  };

  const badge = options.statusBadge ? badgeColors[options.statusBadge.color] : null;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${options.title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              
              <!-- Header Bar -->
              <tr>
                <td style="background-color: #0f172a; padding: 24px 32px; text-align: left; border-bottom: 3px solid #db2777;">
                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td>
                        <span style="color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">Cancer Mukt Bharat Abhiyan</span>
                        <span style="display: block; color: #db2777; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px;">Early Detection & Support Network</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Main Content Body -->
              <tr>
                <td style="padding: 32px; text-align: left; color: #334155; font-size: 15px; line-height: 1.6;">
                  ${options.greeting ? `<h2 style="color: #0f172a; font-size: 18px; font-weight: 700; margin: 0 0 16px 0;">${options.greeting}</h2>` : ""}
                  
                  ${badge
      ? `<div style="margin-bottom: 20px;">
                           <span style="display: inline-block; background-color: ${badge.bg}; color: ${badge.text}; border: 1px solid ${badge.border}; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
                             ${options.statusBadge?.text}
                           </span>
                         </div>`
      : ""
    }

                  ${options.contentHtml}

                  ${options.ctaLabel && options.ctaUrl
      ? `<div style="margin-top: 28px; margin-bottom: 12px; text-align: left;">
                           <a href="${options.ctaUrl}" style="display: inline-block; background-color: #db2777; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; text-decoration: none; border-radius: 8px; box-shadow: 0 2px 4px rgba(219, 39, 119, 0.25);">
                             ${options.ctaLabel}
                           </a>
                         </div>`
      : ""
    }
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #f1f5f9; text-align: center; color: #64748b; font-size: 12px; line-height: 1.5;">
                  <p style="margin: 0 0 4px 0; font-weight: 600; color: #475569;">Breast Cancer Awareness & Patient Support Mission</p>
                  <p style="margin: 0;">This is an automated notification from the Cancer Mukt Bharat Abhiyan Platform.</p>
                  <p style="margin: 8px 0 0 0; color: #94a3b8;">© 2026 Cancer Mukt Bharat Abhiyan. All rights reserved.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Safe email dispatcher. Logs errors server-side and never throws to caller.
 */
export async function sendEmailSafe(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  try {
    const transporter = getTransporter();
    const from = process.env.SMTP_FROM || `"Cancer Mukt Bharat Abhiyan" <${process.env.SMTP_USER || "noreply@breastcancermission.org"}>`;

    if (!transporter) {
      console.log("\n════════════════════════════════════════════");
      console.log("📧 EMAIL (DEV MODE / SMTP UNCONFIGURED)");
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log("════════════════════════════════════════════\n");
      return true;
    }

    await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log(`[SMTP SUCCESS] Email sent to ${options.to} (${options.subject})`);
    return true;
  } catch (error) {
    console.error(`[SMTP ERROR] Failed to send email to ${options.to}:`, error);
    return false;
  }
}

/**
 * PRESERVED: Password Reset Email Functionality
 */
export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const html = renderEmailLayout({
    title: "Reset Your Password",
    greeting: "Password Reset Request",
    contentHtml: `
      <p>We received a request to reset your password for your Cancer Mukt Bharat Abhiyan account.</p>
      <p>Click the button below to set a new password. This link will expire in 30 minutes.</p>
      <p style="color: #64748b; font-size: 13px; margin-top: 16px;">If you did not request a password reset, please ignore this email.</p>
    `,
    ctaLabel: "Reset Password",
    ctaUrl: resetUrl,
  });

  await sendEmailSafe({
    to,
    subject: "Reset your Cancer Mukt Bharat Abhiyan password",
    html,
  });
}

/**
 * User Registration Confirmation Email
 */
export async function sendUserRegistrationEmail(options: {
  to: string;
  userName: string;
  role: string;
  verificationStatus?: string;
  details?: string;
}) {
  const isPending = options.verificationStatus === "PENDING";

  const contentHtml = `
    <p>Welcome to the <strong>Cancer Mukt Bharat Abhiyan Platform</strong>. Your account has been registered successfully.</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Account Name:</td>
        <td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-align: right;">${options.userName}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Registered Role:</td>
        <td style="padding: 8px 0; color: #db2777; font-weight: 600; text-align: right;">${options.role}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Status:</td>
        <td style="padding: 8px 0; color: ${isPending ? "#b45309" : "#15803d"}; font-weight: 700; text-align: right;">
          ${isPending ? "PENDING VERIFICATION" : "ACTIVE"}
        </td>
      </tr>
    </table>
    ${isPending
      ? `<p style="background-color: #fef3c7; border: 1px solid #fde68a; padding: 12px 16px; border-radius: 8px; color: #92400e; font-size: 13px;">
             <strong>Next Steps:</strong> Your professional credentials have been submitted and are currently awaiting review by our administration team. You will receive an email update once verification is completed.
           </p>`
      : `<p>You can now sign in to your dashboard to access campaigns, webinars, and health resources.</p>`
    }
  `;

  const html = renderEmailLayout({
    title: "Registration Confirmation",
    greeting: `Welcome, ${options.userName}!`,
    statusBadge: isPending
      ? { text: "Pending Admin Review", color: "amber" }
      : { text: "Account Active", color: "green" },
    contentHtml,
    ctaLabel: "Sign In to Portal",
    ctaUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/login",
  });

  await sendEmailSafe({
    to: options.to,
    subject: `Registration Confirmation - Cancer Mukt Bharat Abhiyan`,
    html,
  });
}

/**
 * Admin Alert for New Submissions / Registrations
 */
export async function sendAdminRegistrationAlert(options: {
  type: string;
  applicantName: string;
  applicantEmail: string;
  role: string;
  details?: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "breastcancermission3@gmail.com";

  const contentHtml = `
    <p>A new application requiring administration review has been submitted to the Cancer Mukt Bharat Abhiyan platform.</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Application Type:</td>
        <td style="padding: 8px 0; color: #0f172a; font-weight: 700; text-align: right;">${options.type}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Applicant Name:</td>
        <td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-align: right;">${options.applicantName}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Applicant Email:</td>
        <td style="padding: 8px 0; color: #db2777; font-weight: 600; text-align: right;">${options.applicantEmail}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Role / Category:</td>
        <td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-align: right;">${options.role}</td>
      </tr>
    </table>
    ${options.details ? `<p style="font-size: 13px; color: #475569; background: #f8fafc; padding: 12px; border-radius: 6px;">${options.details}</p>` : ""}
    <p>Please log in to the Admin Panel to review and verify this application.</p>
  `;

  const html = renderEmailLayout({
    title: "New Application Pending Review",
    greeting: "Admin Notification",
    statusBadge: { text: "Action Required", color: "blue" },
    contentHtml,
    ctaLabel: "Open Admin Panel",
    ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin`,
  });

  await sendEmailSafe({
    to: adminEmail,
    subject: `[ADMIN ALERT] New ${options.type}: ${options.applicantName}`,
    html,
  });
}

/**
 * Doctor Professional Verification Status Email (Approval / Rejection)
 */
export async function sendDoctorVerificationStatusEmail(options: {
  to: string;
  doctorName: string;
  status: "VERIFIED" | "REJECTED";
  rejectionReason?: string;
}) {
  const isApproved = options.status === "VERIFIED";

  const contentHtml = isApproved
    ? `
      <p>We are pleased to inform you that your medical credentials have been <strong>verified and approved</strong> by our administration team.</p>
      <p>Your Doctor Profile is now fully active. You have full access to create medical articles, host awareness webinars, and interact with healthcare networks.</p>
    `
    : `
      <p>Thank you for submitting your professional details to the Cancer Mukt Bharat Abhiyan platform.</p>
      <p>After reviewing your application, our administration team has updated your verification status to <strong>REJECTED</strong>.</p>
      <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <strong style="color: #991b1b; display: block; margin-bottom: 4px;">Reason for Rejection:</strong>
        <span style="color: #7f1d1d; font-size: 14px;">${options.rejectionReason || "Credentials could not be verified with provided registration numbers."}</span>
      </div>
      <p>You can log in to your Doctor Dashboard at any time to review and resubmit updated verification details.</p>
    `;

  const html = renderEmailLayout({
    title: `Doctor Verification ${isApproved ? "Approved" : "Declined"}`,
    greeting: `Dear Dr. ${options.doctorName},`,
    statusBadge: isApproved
      ? { text: "Doctor Profile Verified", color: "green" }
      : { text: "Verification Declined", color: "red" },
    contentHtml,
    ctaLabel: isApproved ? "Access Doctor Dashboard" : "Update Credentials",
    ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
  });

  await sendEmailSafe({
    to: options.to,
    subject: `Doctor Credentials Verification ${isApproved ? "Approved" : "Status Update"} - Cancer Mukt Bharat Abhiyan`,
    html,
  });
}

/**
 * Doctor Resubmission Notification Alert
 */
export async function sendDoctorResubmissionAlert(options: {
  doctorName: string;
  doctorEmail: string;
  specialty?: string;
}) {
  // Send alert to admin
  await sendAdminRegistrationAlert({
    type: "Doctor Credentials Resubmission",
    applicantName: options.doctorName,
    applicantEmail: options.doctorEmail,
    role: `Doctor (${options.specialty || "Oncology"})`,
    details: "The doctor has updated and resubmitted their professional credentials for admin review.",
  });

  // Send receipt to Doctor
  const html = renderEmailLayout({
    title: "Credentials Resubmitted",
    greeting: `Dear Dr. ${options.doctorName},`,
    statusBadge: { text: "Under Review", color: "amber" },
    contentHtml: `
      <p>Your updated professional credentials have been received and submitted to the administration queue.</p>
      <p>Our team will review your updated license details shortly and notify you via email.</p>
    `,
  });

  await sendEmailSafe({
    to: options.doctorEmail,
    subject: "Doctor Verification Resubmitted - Cancer Mukt Bharat Abhiyan",
    html,
  });
}

/**
 * Institutional Application Status Email (NGO / Corporate Partner)
 */
export async function sendInstitutionalApplicationStatusEmail(options: {
  to: string;
  recipientName: string;
  entityName: string;
  entityType: "Organization Member" | "Corporate Partner";
  status: "VERIFIED" | "REJECTED";
  remarks?: string;
  loginEmail?: string;
  loginPassword?: string;
}) {
  const isApproved = options.status === "VERIFIED";

  const contentHtml = isApproved
    ? `
      <p>We are pleased to inform you that your application for <strong>${options.entityType}</strong> for <strong>${options.entityName}</strong> has been <strong>APPROVED</strong>!</p>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px;">Your Portal Login Credentials:</h4>
        <p style="margin: 4px 0;"><strong>Portal URL:</strong> <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login" style="color: #db2777;">Login Page</a></p>
        <p style="margin: 4px 0;"><strong>Email:</strong> ${options.loginEmail || options.to}</p>
        ${options.loginPassword ? `<p style="margin: 4px 0;"><strong>Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${options.loginPassword}</code> (Please change after logging in)</p>` : "<p style='margin: 4px 0; color: #64748b;'><em>Use your existing account password to sign in.</em></p>"}
      </div>
      ${options.remarks ? `<p style="font-size: 13px; color: #475569;"><strong>Admin Remarks:</strong> ${options.remarks}</p>` : ""}
    `
    : `
      <p>Thank you for your application for <strong>${options.entityType}</strong> for <strong>${options.entityName}</strong>.</p>
      <p>After careful review, our administration team is unable to approve your application at this time.</p>
      <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <strong style="color: #991b1b; display: block; margin-bottom: 4px;">Administration Remarks / Reason:</strong>
        <span style="color: #7f1d1d; font-size: 14px;">${options.remarks || "Verification criteria not met."}</span>
      </div>
    `;

  const html = renderEmailLayout({
    title: `${options.entityType} Application ${isApproved ? "Approved" : "Declined"}`,
    greeting: `Dear ${options.recipientName},`,
    statusBadge: isApproved
      ? { text: "Application Approved", color: "green" }
      : { text: "Application Declined", color: "red" },
    contentHtml,
    ctaLabel: isApproved ? "Sign In to Portal" : undefined,
    ctaUrl: isApproved ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login` : undefined,
  });

  await sendEmailSafe({
    to: options.to,
    subject: `Partnership Application ${isApproved ? "Approved" : "Status Update"}: ${options.entityName}`,
    html,
  });
}

/**
 * Individual Membership Application Status Email
 */
export async function sendIndividualMemberStatusEmail(options: {
  to: string;
  memberName: string;
  status: "VERIFIED" | "REJECTED";
  remarks?: string;
}) {
  const isApproved = options.status === "VERIFIED";

  const contentHtml = isApproved
    ? `
      <p>Congratulations! Your application for <strong>Individual Membership</strong> with the Cancer Mukt Bharat Abhiyan has been <strong>APPROVED</strong>.</p>
      <p>You are now a verified member of our awareness network. Thank you for standing with us in early detection and community support.</p>
      ${options.remarks ? `<p style="font-size: 13px; color: #475569;"><strong>Admin Remarks:</strong> ${options.remarks}</p>` : ""}
    `
    : `
      <p>Thank you for applying for Individual Membership with the Cancer Mukt Bharat Abhiyan.</p>
      <p>After reviewing your submission, our team is unable to approve your membership request at this time.</p>
      ${options.remarks ? `<div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 12px 16px; margin: 16px 0; border-radius: 4px; color: #7f1d1d; font-size: 14px;"><strong>Remarks:</strong> ${options.remarks}</div>` : ""}
    `;

  const html = renderEmailLayout({
    title: `Individual Membership ${isApproved ? "Approved" : "Status Update"}`,
    greeting: `Dear ${options.memberName},`,
    statusBadge: isApproved
      ? { text: "Membership Verified", color: "green" }
      : { text: "Membership Declined", color: "red" },
    contentHtml,
  });

  await sendEmailSafe({
    to: options.to,
    subject: `Individual Membership ${isApproved ? "Approved" : "Status Update"} - Cancer Mukt Bharat Abhiyan`,
    html,
  });
}

/**
 * PHASE 2: Doctor Article Status Email (Approval / Rejection)
 */
export async function sendArticleStatusEmail(options: {
  to: string;
  doctorName: string;
  articleTitle: string;
  articleSlug?: string;
  status: "APPROVED" | "PUBLISHED" | "REJECTED";
  rejectionReason?: string;
}) {
  const isApproved = options.status === "APPROVED" || options.status === "PUBLISHED";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const contentHtml = isApproved
    ? `
      <p>Your medical resource article titled <strong>"${options.articleTitle}"</strong> has been reviewed and <strong>APPROVED</strong> by our clinical moderation team.</p>
      <p>It is now published on the public Cancer Mukt Bharat Abhiyan Healthcare Portal for patients and medical professionals.</p>
    `
    : `
      <p>Thank you for submitting your article <strong>"${options.articleTitle}"</strong>.</p>
      <p>Our clinical moderation team reviewed your submission and marked it as <strong>REVISION REQUIRED / REJECTED</strong>.</p>
      <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <strong style="color: #991b1b; display: block; margin-bottom: 4px;">Editor / Admin Notes:</strong>
        <span style="color: #7f1d1d; font-size: 14px;">${options.rejectionReason || "Content does not meet current publishing guidelines."}</span>
      </div>
      <p>You can edit and resubmit your draft at any time from your Doctor Dashboard.</p>
    `;

  const html = renderEmailLayout({
    title: `Article ${isApproved ? "Approved & Published" : "Status Update"}`,
    greeting: `Dear Dr. ${options.doctorName},`,
    statusBadge: isApproved
      ? { text: "Article Published", color: "green" }
      : { text: "Revision Required", color: "red" },
    contentHtml,
    ctaLabel: isApproved && options.articleSlug ? "View Article Online" : "Open Doctor Dashboard",
    ctaUrl: isApproved && options.articleSlug ? `${baseUrl}/learn/articles/${options.articleSlug}` : `${baseUrl}/dashboard`,
  });

  await sendEmailSafe({
    to: options.to,
    subject: `Medical Article ${isApproved ? "Approved" : "Status Update"}: "${options.articleTitle}"`,
    html,
  });
}

/**
 * PHASE 2: Doctor Paid Webinar Moderation Email (Approval / Rejection)
 */
export async function sendWebinarApprovalStatusEmail(options: {
  to: string;
  doctorName: string;
  webinarTitle: string;
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
  webinarId?: string;
}) {
  const isApproved = options.status === "APPROVED";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const contentHtml = isApproved
    ? `
      <p>Great news! Your paid webinar session <strong>"${options.webinarTitle}"</strong> has been <strong>APPROVED</strong> by platform administration.</p>
      <p>Your event is now live and listed in the public webinar schedule for user registrations.</p>
    `
    : `
      <p>Thank you for submitting your webinar session <strong>"${options.webinarTitle}"</strong>.</p>
      <p>Our platform administration team reviewed your submission and marked it as <strong>REJECTED</strong>.</p>
      <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <strong style="color: #991b1b; display: block; margin-bottom: 4px;">Reason for Rejection:</strong>
        <span style="color: #7f1d1d; font-size: 14px;">${options.rejectionReason || "Pricing or schedule criteria not met."}</span>
      </div>
    `;

  const html = renderEmailLayout({
    title: `Webinar Session ${isApproved ? "Approved" : "Status Update"}`,
    greeting: `Dear Dr. ${options.doctorName},`,
    statusBadge: isApproved
      ? { text: "Webinar Approved", color: "green" }
      : { text: "Webinar Rejected", color: "red" },
    contentHtml,
    ctaLabel: "Go to Webinars Dashboard",
    ctaUrl: `${baseUrl}/dashboard`,
  });

  await sendEmailSafe({
    to: options.to,
    subject: `Webinar Session ${isApproved ? "Approved" : "Status Update"}: "${options.webinarTitle}"`,
    html,
  });
}

/**
 * PHASE 2: Webinar User Registration Confirmation Email
 */
export async function sendWebinarRegistrationConfirmationEmail(options: {
  to: string;
  userName: string;
  webinarTitle: string;
  date: string;
  startTime?: string;
  time?: string;
  durationMinutes?: number;
  duration?: string;
  meetingLink?: string;
  webinarId?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const displayTime = options.time || options.startTime || "";
  const displayDuration = options.duration || (options.durationMinutes ? `${options.durationMinutes} minutes` : "");

  const contentHtml = `
    <p>You have successfully registered for the live awareness webinar <strong>"${options.webinarTitle}"</strong>.</p>
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px;">Webinar Details:</h4>
      <p style="margin: 4px 0;"><strong>Event:</strong> ${options.webinarTitle}</p>
      <p style="margin: 4px 0;"><strong>Date:</strong> ${options.date}</p>
      ${displayTime ? `<p style="margin: 4px 0;"><strong>Time:</strong> ${displayTime}</p>` : ""}
      ${displayDuration ? `<p style="margin: 4px 0;"><strong>Duration:</strong> ${displayDuration}</p>` : ""}
      ${options.meetingLink ? `<p style="margin: 8px 0 0 0;"><strong>Meeting Link:</strong> <a href="${options.meetingLink}" style="color: #db2777; font-weight: 600;">${options.meetingLink}</a></p>` : ""}
    </div>
    <p style="font-size: 13px; color: #64748b;">Attending 80% or more of this session makes you eligible to receive an official Certificate of Participation.</p>
  `;

  const html = renderEmailLayout({
    title: "Webinar Registration Confirmed",
    greeting: `Hello ${options.userName},`,
    statusBadge: { text: "Seat Confirmed", color: "green" },
    contentHtml,
    ctaLabel: options.webinarId ? "View Webinar Page" : "Open Dashboard",
    ctaUrl: options.webinarId ? `${baseUrl}/webinars/${options.webinarId}` : `${baseUrl}/dashboard`,
  });

  await sendEmailSafe({
    to: options.to,
    subject: `Webinar Registration Confirmed: "${options.webinarTitle}"`,
    html,
  });
}

/**
 * PHASE 2: Webinar Broadcast Reminder Email
 */
export async function sendWebinarReminderEmail(options: {
  to: string;
  userName: string;
  webinarTitle: string;
  date: string;
  startTime?: string;
  time?: string;
  meetingLink?: string;
  webinarId?: string;
}) {
  const displayTime = options.time || options.startTime || "";

  const contentHtml = `
    <p>This is a reminder that the live webinar <strong>"${options.webinarTitle}"</strong> is starting soon.</p>
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 4px 0;"><strong>Session:</strong> ${options.webinarTitle}</p>
      <p style="margin: 4px 0;"><strong>Date & Time:</strong> ${options.date}${displayTime ? ` at ${displayTime}` : ""}</p>
      ${options.meetingLink ? `<p style="margin: 8px 0 0 0;"><strong>Join Link:</strong> <a href="${options.meetingLink}" style="color: #db2777; font-weight: 600;">Join Live Session</a></p>` : ""}
    </div>
    <p>Please log in a few minutes early to ensure your audio and video connections are working properly.</p>
  `;

  const html = renderEmailLayout({
    title: "Webinar Reminder",
    greeting: `Hello ${options.userName},`,
    statusBadge: { text: "Starting Soon", color: "blue" },
    contentHtml,
    ctaLabel: "Join Session",
    ctaUrl: options.meetingLink || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
  });

  await sendEmailSafe({
    to: options.to,
    subject: `[REMINDER] Live Webinar Starting Soon: "${options.webinarTitle}"`,
    html,
  });
}

/**
 * PHASE 2: Webinar Schedule Update / Cancellation Email
 */
export async function sendWebinarScheduleUpdateEmail(options: {
  to: string;
  userName: string;
  webinarTitle: string;
  date?: string;
  startTime?: string;
  time?: string;
  meetingLink?: string;
  changeType?: "UPDATED" | "CANCELLED";
  changeSummary?: string;
  webinarId?: string;
}) {
  const isCancelled = options.changeType === "CANCELLED" || (options.changeSummary && options.changeSummary.includes("CANCELLED"));
  const displayTime = options.time || options.startTime || "Updated";

  const contentHtml = isCancelled
    ? `
      <p>We regret to inform you that the webinar <strong>"${options.webinarTitle}"</strong> has been <strong>CANCELLED</strong>.</p>
      <p>We apologize for any inconvenience caused. Please check our webinar catalog for upcoming sessions.</p>
    `
    : `
      <p>The details or schedule for the webinar <strong>"${options.webinarTitle}"</strong> have been updated by the organizer.</p>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>New Schedule:</strong> ${options.date || "Updated"} at ${displayTime}</p>
        ${options.meetingLink ? `<p style="margin: 4px 0;"><strong>Meeting Link:</strong> ${options.meetingLink}</p>` : ""}
      </div>
    `;

  const html = renderEmailLayout({
    title: `Webinar ${isCancelled ? "Cancelled" : "Schedule Updated"}`,
    greeting: `Hello ${options.userName},`,
    statusBadge: isCancelled
      ? { text: "Webinar Cancelled", color: "red" }
      : { text: "Schedule Updated", color: "amber" },
    contentHtml,
  });

  await sendEmailSafe({
    to: options.to,
    subject: `[NOTICE] Webinar ${isCancelled ? "Cancelled" : "Updated"}: "${options.webinarTitle}"`,
    html,
  });
}

/**
 * PHASE 2: Volunteer Application Status Email (Approval / Rejection)
 */
export async function sendVolunteerStatusEmail(options: {
  to: string;
  volunteerName: string;
  status: "VERIFIED" | "REJECTED" | "PENDING";
  rejectionReason?: string;
  certificateCode?: string;
}) {
  const isApproved = options.status === "VERIFIED";
  const isPending = options.status === "PENDING";

  const contentHtml = isApproved
    ? `
      <p>Congratulations! Your application to join the <strong>Cancer Mukt Bharat Abhiyan Volunteer Network</strong> has been <strong>APPROVED</strong>.</p>
      <p>Thank you for offering your time and dedication to support early detection, community outreach, and patient assistance.</p>
      ${options.certificateCode
      ? `<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
               <p style="margin: 0; color: #0f172a; font-weight: 600;">Official Volunteer Badge / Certificate Code:</p>
               <code style="display: inline-block; background: #e2e8f0; color: #0f172a; padding: 6px 12px; border-radius: 6px; font-weight: 700; margin-top: 6px; font-size: 16px;">${options.certificateCode}</code>
             </div>`
      : ""
    }
    `
    : isPending
      ? `
      <p>Thank you for submitting your volunteer application to the <strong>Cancer Mukt Bharat Abhiyan Volunteer Network</strong>.</p>
      <p>Our volunteer coordination team is reviewing your details and will get in touch with you shortly.</p>
    `
      : `
      <p>Thank you for your interest in volunteering with the Cancer Mukt Bharat Abhiyan.</p>
      <p>After reviewing your submission, our coordination team is unable to approve your application at this time.</p>
      <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <strong style="color: #991b1b; display: block; margin-bottom: 4px;">Reason:</strong>
        <span style="color: #7f1d1d; font-size: 14px;">${options.rejectionReason || "Verification criteria not met."}</span>
      </div>
    `;

  const html = renderEmailLayout({
    title: `Volunteer Application ${isApproved ? "Approved" : isPending ? "Received" : "Status Update"}`,
    greeting: `Dear ${options.volunteerName},`,
    statusBadge: isApproved
      ? { text: "Volunteer Verified", color: "green" }
      : isPending
        ? { text: "Application Received", color: "blue" }
        : { text: "Application Declined", color: "red" },
    contentHtml,
    ctaLabel: isApproved ? "Access Volunteer Portal" : undefined,
    ctaUrl: isApproved ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard` : undefined,
  });

  await sendEmailSafe({
    to: options.to,
    subject: `Volunteer Application ${isApproved ? "Approved" : "Status Update"} - Cancer Mukt Bharat Abhiyan`,
    html,
  });
}

/**
 * PHASE 2: Volunteer Event Application Email
 */
export async function sendVolunteerEventApplicationEmail(options: {
  to: string;
  volunteerName: string;
  eventTitle: string;
}) {
  const contentHtml = `
    <p>Your application to participate in the volunteer initiative <strong>"${options.eventTitle}"</strong> has been received.</p>
    <p>Our volunteer event coordinator will review campaign requirements and update your assignment status shortly.</p>
  `;

  const html = renderEmailLayout({
    title: "Event Application Submitted",
    greeting: `Hello ${options.volunteerName},`,
    statusBadge: { text: "Application Received", color: "blue" },
    contentHtml,
  });

  await sendEmailSafe({
    to: options.to,
    subject: `Volunteer Event Application: "${options.eventTitle}"`,
    html,
  });
}

/**
 * PHASE 2: Awareness Partnership Status Email
 */
export async function sendPartnershipStatusEmail(options: {
  to: string;
  contactPersonName: string;
  organizationName: string;
  status: "APPROVED" | "REJECTED" | "PENDING";
  remarks?: string;
}) {
  const isApproved = options.status === "APPROVED";

  const contentHtml = isApproved
    ? `
      <p>We are thrilled to partner with <strong>${options.organizationName}</strong> in our mission for breast cancer awareness and early detection.</p>
      <p>Your partnership application has been <strong>APPROVED</strong> and published on our active awareness directory.</p>
      ${options.remarks ? `<p style="font-size: 13px; color: #475569;"><strong>Notes from Administration:</strong> ${options.remarks}</p>` : ""}
    `
    : `
      <p>Thank you for submitting a partnership proposal for <strong>${options.organizationName}</strong>.</p>
      <p>After review, our campaign committee is unable to approve this partnership request at present.</p>
      ${options.remarks ? `<div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 12px 16px; margin: 16px 0; border-radius: 4px; color: #7f1d1d; font-size: 14px;"><strong>Remarks:</strong> ${options.remarks}</div>` : ""}
    `;

  const html = renderEmailLayout({
    title: `Partnership Application ${isApproved ? "Approved" : "Status Update"}`,
    greeting: `Dear ${options.contactPersonName},`,
    statusBadge: isApproved
      ? { text: "Partnership Approved", color: "green" }
      : { text: "Application Declined", color: "red" },
    contentHtml,
  });

  await sendEmailSafe({
    to: options.to,
    subject: `Awareness Partnership ${isApproved ? "Approved" : "Status Update"}: ${options.organizationName}`,
    html,
  });
}

/**
 * PHASE 2: Research Partner Request Status Email
 */
export async function sendResearchPartnerStatusEmail(options: {
  to: string;
  applicantName: string;
  institution: string;
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
}) {
  const isApproved = options.status === "APPROVED";

  const contentHtml = isApproved
    ? `
      <p>We are pleased to inform you that your research collaboration request representing <strong>${options.institution}</strong> has been <strong>APPROVED</strong>.</p>
      <p>Your institution is now listed on the Healthcare Professionals Clinical Research Network.</p>
    `
    : `
      <p>Thank you for submitting a clinical research partnership request representing <strong>${options.institution}</strong>.</p>
      <p>After evaluation, our research review board has marked your request as <strong>REJECTED</strong>.</p>
      ${options.rejectionReason ? `<div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 12px 16px; margin: 16px 0; border-radius: 4px; color: #7f1d1d; font-size: 14px;"><strong>Reason:</strong> ${options.rejectionReason}</div>` : ""}
    `;

  const html = renderEmailLayout({
    title: `Research Partner Request ${isApproved ? "Approved" : "Status Update"}`,
    greeting: `Dear ${options.applicantName},`,
    statusBadge: isApproved
      ? { text: "Research Partner Approved", color: "green" }
      : { text: "Request Declined", color: "red" },
    contentHtml,
  });

  await sendEmailSafe({
    to: options.to,
    subject: `Research Partner Request ${isApproved ? "Approved" : "Status Update"} - ${options.institution}`,
    html,
  });
}

/**
 * PHASE 2: Diagnosis Collaboration Email
 */
export async function sendCollaborationStatusEmail(options: {
  to: string;
  contactPerson: string;
  companyName: string;
  technologyName: string;
  status: "APPROVED" | "REJECTED" | "PENDING";
  rejectionReason?: string;
}) {
  const isApproved = options.status === "APPROVED";

  const contentHtml = isApproved
    ? `
      <p>We are pleased to inform you that your collaboration proposal for <strong>${options.technologyName}</strong> (${options.companyName}) has been <strong>APPROVED</strong>.</p>
      <p>Our MedTech team will reach out to discuss technical integration and clinical display parameters.</p>
    `
    : `
      <p>Thank you for submitting a diagnostic collaboration proposal for <strong>${options.technologyName}</strong> (${options.companyName}).</p>
      <p>After review, our technology evaluation panel has marked your request as <strong>REJECTED</strong>.</p>
      ${options.rejectionReason ? `<div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 12px 16px; margin: 16px 0; border-radius: 4px; color: #7f1d1d; font-size: 14px;"><strong>Reason:</strong> ${options.rejectionReason}</div>` : ""}
    `;

  const html = renderEmailLayout({
    title: `Collaboration Proposal ${isApproved ? "Approved" : "Status Update"}`,
    greeting: `Dear ${options.contactPerson},`,
    statusBadge: isApproved
      ? { text: "Collaboration Approved", color: "green" }
      : { text: "Proposal Declined", color: "red" },
    contentHtml,
  });

  await sendEmailSafe({
    to: options.to,
    subject: `MedTech Collaboration ${isApproved ? "Approved" : "Status Update"}: ${options.technologyName}`,
    html,
  });
}

/**
 * PHASE 2: Patient Success Story Status Email
 */
export async function sendSuccessStoryStatusEmail(options: {
  to: string;
  fullName: string;
  storyTitle: string;
  status: "VERIFIED" | "REJECTED";
}) {
  const isApproved = options.status === "VERIFIED";

  const contentHtml = isApproved
    ? `
      <p>Thank you for sharing your journey with the Cancer Mukt Bharat Abhiyan. Your story <strong>"${options.storyTitle}"</strong> has been verified and <strong>PUBLISHED</strong> on our inspiring Survivor Stories wall.</p>
      <p>Your bravery and hope will inspire countless patients and families facing similar challenges.</p>
    `
    : `
      <p>Thank you for submitting your story <strong>"${options.storyTitle}"</strong>.</p>
      <p>Our content moderation team reviewed your submission and marked it as <strong>DECLINED / UNAPPROVED</strong> at this time.</p>
    `;

  const html = renderEmailLayout({
    title: `Success Story ${isApproved ? "Published" : "Status Update"}`,
    greeting: `Dear ${options.fullName},`,
    statusBadge: isApproved
      ? { text: "Story Published", color: "green" }
      : { text: "Story Unapproved", color: "red" },
    contentHtml,
    ctaLabel: isApproved ? "View Story Wall" : undefined,
    ctaUrl: isApproved ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/success-stories` : undefined,
  });

  await sendEmailSafe({
    to: options.to,
    subject: `Patient Success Story ${isApproved ? "Published" : "Status Update"}: "${options.storyTitle}"`,
    html,
  });
}

/**
 * PHASE 3: Donation Payment Confirmed & Official 80G Tax Receipt Email
 */
export async function sendDonationReceiptEmail(options: {
  to: string;
  donorName: string;
  amount: number;
  currency?: string;
  transactionId: string;
  campaignTitle?: string;
  donationDate: string;
  isAnonymous?: boolean;
}) {
  const currencySymbol = options.currency === "USD" ? "$" : "₹";
  const formattedAmount = `${currencySymbol}${options.amount.toLocaleString("en-IN")}`;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const contentHtml = `
    <p>Thank you for your generous contribution to the <strong>Cancer Mukt Bharat Abhiyan & Early Detection Network</strong>.</p>
    <p>Your payment has been successfully confirmed and verified. Below is your official donation receipt and 80G tax exemption details.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px;">Official Donation Receipt Details</h4>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Donor Name:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 700; text-align: right;">${options.isAnonymous ? "Anonymous Supporter" : options.donorName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Donation Amount:</td>
          <td style="padding: 6px 0; color: #db2777; font-weight: 700; font-size: 16px; text-align: right;">${formattedAmount}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Transaction Ref ID:</td>
          <td style="padding: 6px 0; color: #0f172a; font-family: monospace; font-weight: 700; text-align: right;">${options.transactionId}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Purpose / Initiative:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${options.campaignTitle || "General Patient Care & Screening Mission"}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Date & Time:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${options.donationDate}</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 16px; margin: 16px 0; color: #166534; font-size: 13px; line-height: 1.5;">
      <strong style="display: block; font-size: 14px; margin-bottom: 4px; color: #15803d;">80G Tax Benefit Exemption Notice</strong>
      This contribution is eligible for 50% tax deduction under Section 80G of the Indian Income Tax Act, 1961.<br>
      <strong>Registration No:</strong> TRUST/80G/2026/GRS-KHUSHI | <strong>PAN:</strong> AAATK9821F
    </div>

    <p>Your support directly enables life-saving early mammography screenings and patient medical assistance.</p>
  `;

  const html = renderEmailLayout({
    title: "Donation Payment Receipt",
    greeting: `Dear ${options.donorName},`,
    statusBadge: { text: "Payment Confirmed & 80G Receipt Issued", color: "green" },
    contentHtml,
    ctaLabel: "View Donor Dashboard",
    ctaUrl: `${baseUrl}/dashboard`,
  });

  await sendEmailSafe({
    to: options.to,
    subject: `Donation Receipt & 80G Tax Confirmation [Ref: ${options.transactionId}] - Cancer Mukt Bharat Abhiyan`,
    html,
  });
}

/**
 * PHASE 3: Donation Pending Verification Acknowledgment Email
 */
export async function sendDonationPendingEmail(options: {
  to: string;
  donorName: string;
  amount: number;
  currency?: string;
  transactionId: string;
  campaignTitle?: string;
}) {
  const currencySymbol = options.currency === "USD" ? "$" : "₹";
  const formattedAmount = `${currencySymbol}${options.amount.toLocaleString("en-IN")}`;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const contentHtml = `
    <p>Thank you for initiating a donation of <strong>${formattedAmount}</strong> to the <strong>Cancer Mukt Bharat Abhiyan</strong>.</p>
    <p>We have received your transaction reference and screenshot proof. Our administration team is currently verifying the payment with our banking partner.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 4px 0;"><strong>Transaction Reference:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${options.transactionId}</code></p>
      <p style="margin: 4px 0;"><strong>Amount:</strong> ${formattedAmount}</p>
      <p style="margin: 4px 0;"><strong>Status:</strong> PENDING VERIFICATION</p>
    </div>

    <p style="font-size: 13px; color: #64748b;">As soon as verification is complete, your official 80G tax receipt will be delivered to your email.</p>
  `;

  const html = renderEmailLayout({
    title: "Donation Submitted for Verification",
    greeting: `Dear ${options.donorName},`,
    statusBadge: { text: "Verification Pending", color: "amber" },
    contentHtml,
    ctaLabel: "Open Dashboard",
    ctaUrl: `${baseUrl}/dashboard`,
  });

  await sendEmailSafe({
    to: options.to,
    subject: `Donation Initiated [Ref: ${options.transactionId}] - Verification Pending`,
    html,
  });
}

/**
 * PHASE 3: Donation Status Update Email (FAILED / REFUNDED)
 */
export async function sendDonationStatusEmail(options: {
  to: string;
  donorName: string;
  amount: number;
  currency?: string;
  transactionId: string;
  status: "FAILED" | "REFUNDED";
  reason?: string;
}) {
  const isRefunded = options.status === "REFUNDED";
  const currencySymbol = options.currency === "USD" ? "$" : "₹";
  const formattedAmount = `${currencySymbol}${options.amount.toLocaleString("en-IN")}`;

  const contentHtml = isRefunded
    ? `
      <p>This is to confirm that a refund of <strong>${formattedAmount}</strong> for donation transaction reference <strong>${options.transactionId}</strong> has been successfully processed.</p>
      <p>The refunded amount will be credited back to your original payment method within 5-7 business days.</p>
      ${options.reason ? `<p style="font-size: 13px; color: #475569;"><strong>Notes:</strong> ${options.reason}</p>` : ""}
    `
    : `
      <p>We were unable to verify or complete your donation transaction of <strong>${formattedAmount}</strong> (Ref: <strong>${options.transactionId}</strong>).</p>
      <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <strong style="color: #991b1b; display: block; margin-bottom: 4px;">Status Reason:</strong>
        <span style="color: #7f1d1d; font-size: 14px;">${options.reason || "Payment confirmation timed out or transaction proof could not be verified."}</span>
      </div>
      <p>If your account was debited, please contact our support desk with your bank reference details.</p>
    `;

  const html = renderEmailLayout({
    title: `Donation ${isRefunded ? "Refund Processed" : "Payment Issue"}`,
    greeting: `Dear ${options.donorName},`,
    statusBadge: isRefunded
      ? { text: "Refund Processed", color: "blue" }
      : { text: "Payment Unverified", color: "red" },
    contentHtml,
  });

  await sendEmailSafe({
    to: options.to,
    subject: `Donation ${isRefunded ? "Refund Processed" : "Status Notice"} [Ref: ${options.transactionId}]`,
    html,
  });
}



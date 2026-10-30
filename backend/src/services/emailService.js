const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || "smtp.gmail.com",
  port:   parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.EMAIL_FROM || '"El-Olam International School" <noreply@elolam.edu.gh>';

// ── SEND GENERIC EMAIL ────────────────────────────────────────────────────────
const sendEmail = async ({ to, subject, html, text }) => {
  if (!process.env.SMTP_USER) {
    console.log(`📧 [DEV] Email to ${to}: ${subject}`);
    return;
  }
  await transporter.sendMail({ from: FROM, to, subject, html, text });
};

// ── WELCOME EMAIL ─────────────────────────────────────────────────────────────
const sendWelcomeEmail = async ({ to, name, role, email, password }) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:30px;border-radius:10px;">
      <div style="background:linear-gradient(135deg,#1490C0,#29B6E8);padding:24px;border-radius:8px;text-align:center;margin-bottom:24px;">
        <h1 style="color:#FFD03A;margin:0;font-size:22px;">EL-OLAM INTERNATIONAL SCHOOL</h1>
        <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-style:italic;">"Home Away from Home"</p>
      </div>
      <h2 style="color:#0F2132;">Welcome, ${name}! 👋</h2>
      <p style="color:#4A6478;">Your <strong>${role}</strong> account has been created on the El-Olam School Management System.</p>
      <div style="background:#E3F4FC;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0;color:#0F2132;"><strong>Login Email:</strong> ${email}</p>
        <p style="margin:8px 0 0;color:#0F2132;"><strong>Temporary Password:</strong> ${password}</p>
      </div>
      <p style="color:#F04E4E;font-size:13px;">⚠️ Please change your password after your first login.</p>
      <p style="color:#4A6478;">If you have questions, contact the school office at <a href="mailto:info@elolam.edu.gh">info@elolam.edu.gh</a></p>
    </div>`;
  await sendEmail({ to, subject: "Welcome to El-Olam School Management System", html });
};

// ── FEE REMINDER EMAIL ────────────────────────────────────────────────────────
const sendFeeReminder = async ({ to, parentName, studentName, amount, dueDate, term }) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:30px;border-radius:10px;">
      <div style="background:linear-gradient(135deg,#1FA85C,#2EC97A);padding:20px;border-radius:8px;text-align:center;margin-bottom:20px;">
        <h2 style="color:#fff;margin:0;">Fee Payment Reminder</h2>
      </div>
      <p>Dear <strong>${parentName}</strong>,</p>
      <p>This is a reminder that school fees for <strong>${studentName}</strong> (${term}) are outstanding.</p>
      <div style="background:#FFF8DC;border-radius:8px;padding:16px;margin:16px 0;border-left:4px solid #E6B800;">
        <p style="margin:0;"><strong>Amount Due:</strong> ₵${Number(amount).toLocaleString()}</p>
        <p style="margin:8px 0 0;"><strong>Due Date:</strong> ${dueDate}</p>
      </div>
      <p>Please visit the school office or make payment via Mobile Money to avoid any disruption.</p>
      <p>Thank you for your continued support.</p>
      <p style="color:#8AA0B0;font-size:12px;">El-Olam International School · info@elolam.edu.gh</p>
    </div>`;
  await sendEmail({ to, subject: `Fee Payment Reminder — ${studentName} (${term})`, html });
};

// ── PAYMENT RECEIPT EMAIL ─────────────────────────────────────────────────────
const sendPaymentReceipt = async ({ to, parentName, studentName, amount, receiptNumber, term, method, paidAt }) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:30px;border-radius:10px;">
      <div style="background:linear-gradient(135deg,#1FA85C,#2EC97A);padding:20px;border-radius:8px;text-align:center;margin-bottom:20px;">
        <h2 style="color:#fff;margin:0;">✅ Payment Confirmed</h2>
      </div>
      <p>Dear <strong>${parentName}</strong>,</p>
      <p>We have received your payment for <strong>${studentName}</strong>.</p>
      <div style="background:#E4F9EE;border-radius:8px;padding:16px;margin:16px 0;border-left:4px solid #2EC97A;">
        <p style="margin:0;"><strong>Receipt No:</strong> ${receiptNumber}</p>
        <p style="margin:6px 0;"><strong>Amount Paid:</strong> ₵${Number(amount).toLocaleString()}</p>
        <p style="margin:6px 0;"><strong>Term:</strong> ${term}</p>
        <p style="margin:6px 0;"><strong>Method:</strong> ${method}</p>
        <p style="margin:6px 0 0;"><strong>Date:</strong> ${paidAt}</p>
      </div>
      <p>Please keep this email as your payment receipt. Thank you!</p>
      <p style="color:#8AA0B0;font-size:12px;">El-Olam International School · info@elolam.edu.gh</p>
    </div>`;
  await sendEmail({ to, subject: `Payment Receipt — ${receiptNumber}`, html });
};

// ── NOTICE EMAIL ──────────────────────────────────────────────────────────────
const sendNoticeEmail = async ({ to, noticeTitle, noticeBody }) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:30px;border-radius:10px;">
      <div style="background:linear-gradient(135deg,#E6B800,#FFD03A);padding:20px;border-radius:8px;text-align:center;margin-bottom:20px;">
        <h2 style="color:#0B2640;margin:0;">📢 School Notice</h2>
      </div>
      <h3 style="color:#0F2132;">${noticeTitle}</h3>
      <p style="color:#4A6478;line-height:1.7;">${noticeBody}</p>
      <p style="color:#8AA0B0;font-size:12px;margin-top:24px;">El-Olam International School · "Home Away from Home"</p>
    </div>`;
  await sendEmail({ to, subject: `[El-Olam] ${noticeTitle}`, html });
};

module.exports = { sendEmail, sendWelcomeEmail, sendFeeReminder, sendPaymentReceipt, sendNoticeEmail };

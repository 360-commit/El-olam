/**
 * SMS Service — Hubtel (Ghana's leading SMS provider)
 * Docs: https://developers.hubtel.com
 *
 * TODO: Replace with your Hubtel credentials in .env
 * Alternative: Twilio (works globally) — swap the sendSMS function below
 */

const sendSMS = async ({ to, message }) => {
  if (!process.env.HUBTEL_CLIENT_ID || !process.env.HUBTEL_CLIENT_SECRET) {
    // Dev mode — just log
    console.log(`📱 [DEV SMS] To: ${to} → ${message}`);
    return { success: true, dev: true };
  }

  try {
    // Format Ghana phone: strip leading 0 or +233, re-add 233
    const formatted = to.replace(/^\+?233|^0/, "233");

    const response = await fetch(
      `https://smsc.hubtel.com/v1/messages/send?clientsecret=${process.env.HUBTEL_CLIENT_SECRET}&clientid=${process.env.HUBTEL_CLIENT_ID}&from=${encodeURIComponent(process.env.HUBTEL_SENDER_ID || "ElOlam")}&to=${formatted}&content=${encodeURIComponent(message)}`,
      { method: "GET" }
    );

    const data = await response.json();
    if (data.status !== 0) throw new Error(data.message || "SMS failed");
    return { success: true, messageId: data.messageId };
  } catch (err) {
    console.error("SMS Error:", err.message);
    return { success: false, error: err.message };
  }
};

// ── TEMPLATE: Attendance Absence Alert ────────────────────────────────────────
const sendAbsenceAlert = (parentPhone, studentName, date) =>
  sendSMS({
    to: parentPhone,
    message: `El-Olam School: ${studentName} was ABSENT on ${date}. Please contact the school office if this is unexpected. Tel: ${process.env.SCHOOL_PHONE || "+233200000000"}`,
  });

// ── TEMPLATE: Fee Reminder ────────────────────────────────────────────────────
const sendFeeReminderSMS = (parentPhone, studentName, amount, dueDate) =>
  sendSMS({
    to: parentPhone,
    message: `El-Olam School: Dear parent, ${studentName}'s school fees of GHS ${amount} are due on ${dueDate}. Please pay promptly. Thank you.`,
  });

// ── TEMPLATE: New Notice ──────────────────────────────────────────────────────
const sendNoticeSMS = (phone, title) =>
  sendSMS({
    to: phone,
    message: `El-Olam School Notice: "${title}". Log in to the school app for full details. www.elolam.edu.gh`,
  });

// ── TEMPLATE: Payment Confirmed ───────────────────────────────────────────────
const sendPaymentConfirmed = (parentPhone, studentName, amount, receipt) =>
  sendSMS({
    to: parentPhone,
    message: `El-Olam School: Payment of GHS ${amount} received for ${studentName}. Receipt No: ${receipt}. Thank you!`,
  });

module.exports = { sendSMS, sendAbsenceAlert, sendFeeReminderSMS, sendNoticeSMS, sendPaymentConfirmed };

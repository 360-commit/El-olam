const prisma = require("../config/db");
const { initializePayment, verifyPayment } = require("../services/paystackService");
const { sendPaymentReceipt } = require("../services/emailService");
const { sendPaymentConfirmed } = require("../services/smsService");
const { generateReceipt } = require("../utils/helpers");
const { success, created, notFound, badRequest, error } = require("../utils/response");

// ── INITIALIZE ONLINE PAYMENT ─────────────────────────────────────────────────
const initOnlinePayment = async (req, res) => {
  try {
    const { feeId } = req.body;

    const fee = await prisma.fee.findUnique({
      where: { id: feeId },
      include: {
        student: {
          include: {
            user:    { select: { email: true } },
            parents: { include: { parent: { include: { user: { select: { email: true } } } } } },
          },
        },
      },
    });

    if (!fee) return notFound(res, "Fee record not found.");

    const outstanding = fee.amountDue - fee.amountPaid;
    if (outstanding <= 0) return badRequest(res, "No outstanding balance for this fee.");

    const reference  = `ELOLAM-${fee.studentId.slice(0, 8).toUpperCase()}-${Date.now()}`;
    const payerEmail = fee.student.parents[0]?.parent?.user?.email || fee.student.user?.email;

    if (!payerEmail) return badRequest(res, "No email address found for this student/parent.");

    const result = await initializePayment({
      email:    payerEmail,
      amount:   outstanding,
      reference,
      metadata: { feeId, studentId: fee.studentId, term: fee.term, academicYear: fee.academicYear },
    });

    created(res, {
      authorization_url: result.authorization_url,
      reference:         result.reference,
      amount:            outstanding,
      studentName:       `${fee.student.firstName} ${fee.student.lastName}`,
    }, "Payment initialized. Redirect user to authorization_url.");
  } catch (err) {
    error(res, err.message);
  }
};

// ── VERIFY & RECORD PAYMENT CALLBACK ─────────────────────────────────────────
const verifyOnlinePayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const verification = await verifyPayment(reference);
    if (!verification.paid) return badRequest(res, "Payment not confirmed by PayStack.");

    // Extract feeId from metadata (passed in ref or use lookup)
    const meta = verification.metadata || {};
    const feeId = meta.feeId || req.body.feeId;

    if (!feeId) return badRequest(res, "Fee ID missing. Cannot record payment.");

    const fee = await prisma.fee.findUnique({
      where: { id: feeId },
      include: {
        student: {
          include: {
            parents: { include: { parent: { include: { user: { select: { email: true } } } } } },
            user: { select: { email: true } },
          },
        },
      },
    });

    if (!fee) return notFound(res, "Fee not found.");

    // Check not already recorded
    const existing = await prisma.payment.findUnique({ where: { reference } });
    if (existing) return success(res, { payment: existing }, "Payment already recorded.");

    const receiptNumber = generateReceipt();
    const newPaid       = fee.amountPaid + verification.amount;
    const newStatus     = newPaid >= fee.amountDue ? "PAID" : "PARTIAL";

    const [payment] = await prisma.$transaction([
      prisma.payment.create({
        data: {
          feeId,
          amount:       verification.amount,
          method:       "PAYSTACK",
          reference,
          paystackRef:  reference,
          receiptNumber,
          paidAt:       new Date(verification.paidAt || Date.now()),
          notes:        `PayStack payment via ${verification.channel}`,
        },
      }),
      prisma.fee.update({
        where: { id: feeId },
        data:  { amountPaid: newPaid, status: newStatus },
      }),
    ]);

    // Send receipt emails
    const parentEmail = fee.student.parents[0]?.parent?.user?.email;
    if (parentEmail) {
      await sendPaymentReceipt({
        to:           parentEmail,
        parentName:   fee.student.parents[0]?.parent?.firstName || "Parent",
        studentName:  `${fee.student.firstName} ${fee.student.lastName}`,
        amount:       verification.amount,
        receiptNumber,
        term:         fee.term,
        method:       "PayStack",
        paidAt:       new Date().toLocaleDateString("en-GB"),
      }).catch(() => {}); // don't fail if email fails
    }

    success(res, { payment, receiptNumber, newStatus }, "Payment recorded successfully.");
  } catch (err) {
    error(res, err.message);
  }
};

module.exports = { initOnlinePayment, verifyOnlinePayment };

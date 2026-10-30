const prisma = require("../config/db");
const { success, created, notFound, badRequest, error } = require("../utils/response");

// ── FEE SUMMARY (Dashboard) ───────────────────────────────────────────────────
const getFeeSummary = async (req, res) => {
  try {
    const { term = "TERM_2", academicYear = "2024" } = req.query;

    const structures = await prisma.feeStructure.findMany({ where: { term, academicYear } });

    const summaries = await Promise.all(
      structures.map(async (fs) => {
        const fees = await prisma.fee.findMany({ where: { feeStructureId: fs.id } });
        const students = fees.length;
        const collected = fees.reduce((sum, f) => sum + f.amountPaid, 0);
        const expected  = fees.reduce((sum, f) => sum + f.amountDue, 0);
        return {
          class: fs.classLevel.replace(/_/g, " "),
          classLevel: fs.classLevel,
          termFee: fs.amount,
          students,
          collected,
          expected,
          outstanding: expected - collected,
          percent: expected > 0 ? Math.round((collected / expected) * 100) : 0,
        };
      })
    );

    const totals = summaries.reduce((acc, s) => ({
      collected:   acc.collected   + s.collected,
      expected:    acc.expected    + s.expected,
      outstanding: acc.outstanding + s.outstanding,
    }), { collected: 0, expected: 0, outstanding: 0 });

    success(res, { summaries, totals, term, academicYear });
  } catch (err) { error(res, err.message); }
};

// ── GET STUDENT FEE ───────────────────────────────────────────────────────────
const getStudentFee = async (req, res) => {
  try {
    const fees = await prisma.fee.findMany({
      where: { studentId: req.params.studentId },
      include: { feeStructure: true, payments: { orderBy: { paidAt: "desc" } } },
      orderBy: { createdAt: "desc" },
    });
    success(res, { fees });
  } catch (err) { error(res, err.message); }
};

// ── RECORD PAYMENT ────────────────────────────────────────────────────────────
const recordPayment = async (req, res) => {
  try {
    const { feeId, amount, method, reference, notes } = req.body;

    const fee = await prisma.fee.findUnique({ where: { id: feeId } });
    if (!fee) return notFound(res, "Fee record not found.");

    const remaining = fee.amountDue - fee.amountPaid;
    if (amount > remaining + 0.01) return badRequest(res, `Amount exceeds outstanding balance of ₵${remaining.toFixed(2)}`);

    const payment = await prisma.payment.create({
      data: {
        feeId, amount: parseFloat(amount), method,
        reference: reference || `PAY-${Date.now()}`,
        notes: notes || null,
        recordedBy: req.user?.id,
      },
    });

    const newPaid = fee.amountPaid + parseFloat(amount);
    const newStatus = newPaid >= fee.amountDue ? "PAID" : newPaid > 0 ? "PARTIAL" : "PENDING";

    const updatedFee = await prisma.fee.update({
      where: { id: feeId },
      data: { amountPaid: newPaid, status: newStatus },
    });

    created(res, { payment, fee: updatedFee }, "Payment recorded successfully.");
  } catch (err) { error(res, err.message); }
};

// ── GET ALL OVERDUE FEES ──────────────────────────────────────────────────────
const getOverdueFees = async (req, res) => {
  try {
    const fees = await prisma.fee.findMany({
      where: { status: { in: ["PENDING", "PARTIAL"] }, dueDate: { lt: new Date() } },
      include: {
        student: { select: { firstName: true, lastName: true, rollNumber: true, classLevel: true } },
        feeStructure: true,
      },
      orderBy: { dueDate: "asc" },
    });
    success(res, { fees, total: fees.length });
  } catch (err) { error(res, err.message); }
};

// ── CREATE FEE STRUCTURE ──────────────────────────────────────────────────────
const createFeeStructure = async (req, res) => {
  try {
    const { classLevel, term, academicYear, amount, dueDate, description } = req.body;
    const fs = await prisma.feeStructure.create({
      data: { classLevel, term, academicYear, amount: parseFloat(amount), dueDate: new Date(dueDate), description },
    });
    created(res, { feeStructure: fs }, "Fee structure created.");
  } catch (err) { error(res, err.message); }
};

module.exports = { getFeeSummary, getStudentFee, recordPayment, getOverdueFees, createFeeStructure };

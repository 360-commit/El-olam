const prisma = require("../config/db");
const { success, notFound, error } = require("../utils/response");

// ── GET ALL PARENTS ───────────────────────────────────────────────────────────
const getParents = async (req, res) => {
  try {
    const parents = await prisma.parent.findMany({
      include: {
        user:     { select: { email: true } },
        children: {
          include: {
            student: { select: { firstName: true, lastName: true, rollNumber: true, classLevel: true } },
          },
        },
      },
      orderBy: { firstName: "asc" },
    });
    success(res, { parents, total: parents.length });
  } catch (err) { error(res, err.message); }
};

// ── GET PARENT WITH CHILDREN ──────────────────────────────────────────────────
const getParent = async (req, res) => {
  try {
    const parent = await prisma.parent.findUnique({
      where: { id: req.params.id },
      include: {
        user:     { select: { email: true, lastLoginAt: true } },
        children: {
          include: {
            student: {
              include: {
                fees:       { where: { term: "TERM_2", academicYear: "2024" } },
                attendance: { where: { term: "TERM_2", academicYear: "2024" }, select: { status: true } },
                results:    { where: { term: "TERM_2", academicYear: "2024" }, include: { subject: { select: { name: true } } } },
              },
            },
          },
        },
      },
    });
    if (!parent) return notFound(res, "Parent not found.");
    success(res, { parent });
  } catch (err) { error(res, err.message); }
};

// ── GET MY CHILDREN (for logged-in parent) ────────────────────────────────────
const getMyChildren = async (req, res) => {
  try {
    const parent = await prisma.parent.findUnique({
      where: { userId: req.user.id },
      include: {
        children: {
          include: {
            student: {
              include: {
                classroom:  { select: { name: true } },
                fees:       { where: { term: "TERM_2", academicYear: "2024" } },
                attendance: { where: { term: "TERM_2", academicYear: "2024" }, select: { status: true } },
                results:    { where: { term: "TERM_2", academicYear: "2024" }, include: { subject: { select: { name: true } } } },
              },
            },
          },
        },
      },
    });

    if (!parent) return notFound(res, "Parent profile not found.");

    const children = parent.children.map((sp) => {
      const s = sp.student;
      const attPct = s.attendance.length > 0
        ? Math.round((s.attendance.filter((a) => ["PRESENT","LATE"].includes(a.status)).length / s.attendance.length) * 100)
        : 0;
      const fee = s.fees[0];
      return {
        id:         s.id,
        name:       `${s.firstName} ${s.lastName}`,
        roll:       s.rollNumber,
        class:      s.classLevel,
        className:  s.classroom?.name || s.classLevel,
        attendance: attPct,
        fee: fee ? { due: fee.amountDue, paid: fee.amountPaid, status: fee.status } : null,
        results: s.results.map((r) => ({ subject: r.subject.name, score: r.totalScore, grade: r.grade })),
      };
    });

    success(res, { children, total: children.length });
  } catch (err) { error(res, err.message); }
};

module.exports = { getParents, getParent, getMyChildren };

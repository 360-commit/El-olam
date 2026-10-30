const prisma = require("../config/db");
const { success, created, notFound, badRequest, error } = require("../utils/response");

const calcGrade = (score) => {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
};

// ── GET CLASS RESULTS ─────────────────────────────────────────────────────────
const getClassResults = async (req, res) => {
  try {
    const { classLevel, term = "TERM_2", academicYear = "2024" } = req.query;

    const students = await prisma.student.findMany({
      where: { ...(classLevel && { classLevel }), isActive: true },
      include: {
        results: {
          where: { term, academicYear },
          include: { subject: { select: { name: true, code: true } } },
        },
      },
      orderBy: { firstName: "asc" },
    });

    const data = students.map((s) => {
      const total = s.results.reduce((sum, r) => sum + (r.totalScore || 0), 0);
      const avg = s.results.length > 0 ? Math.round(total / s.results.length) : 0;
      return {
        studentId:  s.id,
        name:       `${s.firstName} ${s.lastName}`,
        rollNumber: s.rollNumber,
        classLevel: s.classLevel,
        results:    s.results,
        average:    avg,
        grade:      calcGrade(avg),
      };
    });

    success(res, { data, term, academicYear, total: data.length });
  } catch (err) { error(res, err.message); }
};

// ── ENTER / UPDATE RESULT ─────────────────────────────────────────────────────
const upsertResult = async (req, res) => {
  try {
    const { studentId, subjectId, term = "TERM_2", academicYear = "2024", classTest = 0, midTerm = 0, endOfTerm, remarks } = req.body;

    const total = ((parseFloat(classTest) * 0.20) + (parseFloat(midTerm) * 0.30) + (parseFloat(endOfTerm) * 0.50));

    const result = await prisma.result.upsert({
      where: { studentId_subjectId_term_academicYear: { studentId, subjectId, term, academicYear } },
      create: {
        studentId, subjectId, term, academicYear,
        teacherId:  req.user?.id || null,
        classTest:  parseFloat(classTest),
        midTerm:    parseFloat(midTerm),
        endOfTerm:  parseFloat(endOfTerm),
        totalScore: parseFloat(total.toFixed(2)),
        grade:      calcGrade(total),
        remarks:    remarks || null,
      },
      update: {
        classTest:  parseFloat(classTest),
        midTerm:    parseFloat(midTerm),
        endOfTerm:  parseFloat(endOfTerm),
        totalScore: parseFloat(total.toFixed(2)),
        grade:      calcGrade(total),
        remarks:    remarks || null,
        teacherId:  req.user?.id || null,
      },
    });

    created(res, { result }, "Result saved successfully.");
  } catch (err) { error(res, err.message); }
};

// ── BULK ENTER RESULTS ────────────────────────────────────────────────────────
const bulkUpsertResults = async (req, res) => {
  try {
    const { results } = req.body;
    if (!Array.isArray(results)) return badRequest(res, "results must be an array.");

    const ops = results.map(({ studentId, subjectId, term, academicYear, classTest = 0, midTerm = 0, endOfTerm, remarks }) => {
      const total = ((parseFloat(classTest) * 0.20) + (parseFloat(midTerm) * 0.30) + (parseFloat(endOfTerm) * 0.50));
      return prisma.result.upsert({
        where: { studentId_subjectId_term_academicYear: { studentId, subjectId, term: term || "TERM_2", academicYear: academicYear || "2024" } },
        create: { studentId, subjectId, term: term || "TERM_2", academicYear: academicYear || "2024", classTest: parseFloat(classTest), midTerm: parseFloat(midTerm), endOfTerm: parseFloat(endOfTerm), totalScore: parseFloat(total.toFixed(2)), grade: calcGrade(total), remarks: remarks || null, teacherId: req.user?.id || null },
        update: { classTest: parseFloat(classTest), midTerm: parseFloat(midTerm), endOfTerm: parseFloat(endOfTerm), totalScore: parseFloat(total.toFixed(2)), grade: calcGrade(total), remarks: remarks || null },
      });
    });

    const saved = await prisma.$transaction(ops);
    success(res, { saved: saved.length }, `${saved.length} results saved successfully.`);
  } catch (err) { error(res, err.message); }
};

// ── GET STUDENT REPORT CARD ───────────────────────────────────────────────────
const getReportCard = async (req, res) => {
  try {
    const { term = "TERM_2", academicYear = "2024" } = req.query;
    const student = await prisma.student.findUnique({
      where: { id: req.params.studentId },
      include: {
        results: { where: { term, academicYear }, include: { subject: true } },
        attendance: { where: { term, academicYear }, select: { status: true } },
        classroom: { select: { name: true } },
        parents: { include: { parent: { select: { firstName: true, lastName: true, phone: true } } } },
      },
    });

    if (!student) return notFound(res, "Student not found.");

    const totalScore = student.results.reduce((sum, r) => sum + (r.totalScore || 0), 0);
    const average    = student.results.length > 0 ? Math.round(totalScore / student.results.length) : 0;
    const attTotal   = student.attendance.length;
    const attPresent = student.attendance.filter((a) => ["PRESENT","LATE"].includes(a.status)).length;

    success(res, {
      student: { id: student.id, name: `${student.firstName} ${student.lastName}`, rollNumber: student.rollNumber, classLevel: student.classLevel, class: student.classroom?.name },
      term, academicYear,
      results: student.results,
      summary: { average, overallGrade: calcGrade(average), totalSubjects: student.results.length },
      attendance: { total: attTotal, present: attPresent, percent: attTotal > 0 ? Math.round((attPresent / attTotal) * 100) : 0 },
      parents: student.parents.map((sp) => sp.parent),
    });
  } catch (err) { error(res, err.message); }
};

module.exports = { getClassResults, upsertResult, bulkUpsertResults, getReportCard };

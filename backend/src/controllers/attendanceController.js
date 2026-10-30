const prisma = require("../config/db");
const { success, created, notFound, badRequest, error } = require("../utils/response");

// ── GET TODAY'S ATTENDANCE SUMMARY ────────────────────────────────────────────
const getTodaySummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await prisma.attendance.groupBy({
      by: ["status"],
      where: { date: today },
      _count: { status: true },
    });

    const summary = { PRESENT: 0, ABSENT: 0, LATE: 0, LEAVE: 0 };
    records.forEach((r) => { summary[r.status] = r._count.status; });

    const total = Object.values(summary).reduce((a, b) => a + b, 0);
    const totalStudents = await prisma.student.count({ where: { isActive: true } });

    success(res, {
      date: today.toISOString().split("T")[0],
      summary,
      total,
      totalStudents,
      notMarked: totalStudents - total,
      attendanceRate: total > 0 ? Math.round(((summary.PRESENT + summary.LATE) / totalStudents) * 100) : 0,
    });
  } catch (err) { error(res, err.message); }
};

// ── GET WEEKLY SUMMARY ────────────────────────────────────────────────────────
const getWeeklySummary = async (req, res) => {
  try {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    monday.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      const records = await prisma.attendance.groupBy({
        by: ["status"],
        where: { date: { gte: d, lt: new Date(d.getTime() + 86400000) } },
        _count: { status: true },
      });

      const summary = { PRESENT: 0, ABSENT: 0, LATE: 0, LEAVE: 0 };
      records.forEach((r) => { summary[r.status] = r._count.status; });

      days.push({
        date: d.toISOString().split("T")[0],
        day: ["Mon", "Tue", "Wed", "Thu", "Fri"][i],
        ...summary,
      });
    }

    success(res, { week: days });
  } catch (err) { error(res, err.message); }
};

// ── MARK ATTENDANCE (Bulk) ────────────────────────────────────────────────────
const markAttendance = async (req, res) => {
  try {
    const { date, records, term = "TERM_2", academicYear = "2024" } = req.body;
    // records = [{ studentId, status, remarks }]

    if (!Array.isArray(records) || records.length === 0)
      return badRequest(res, "Attendance records array is required.");

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const upsertOps = records.map((r) =>
      prisma.attendance.upsert({
        where: { studentId_date: { studentId: r.studentId, date: attendanceDate } },
        create: { studentId: r.studentId, date: attendanceDate, status: r.status, term, academicYear, markedBy: req.user?.id, remarks: r.remarks || null },
        update: { status: r.status, remarks: r.remarks || null, markedBy: req.user?.id },
      })
    );

    const results = await prisma.$transaction(upsertOps);

    success(res, { marked: results.length, date: attendanceDate.toISOString().split("T")[0] }, "Attendance marked successfully.");
  } catch (err) { error(res, err.message); }
};

// ── GET STUDENT ATTENDANCE ────────────────────────────────────────────────────
const getStudentAttendance = async (req, res) => {
  try {
    const { term = "TERM_2", academicYear = "2024" } = req.query;
    const records = await prisma.attendance.findMany({
      where: { studentId: req.params.studentId, term, academicYear },
      orderBy: { date: "desc" },
    });

    const total   = records.length;
    const present = records.filter((r) => r.status === "PRESENT" || r.status === "LATE").length;
    const absent  = records.filter((r) => r.status === "ABSENT").length;
    const percent = total > 0 ? Math.round((present / total) * 100) : 0;

    success(res, { records, summary: { total, present, absent, percent } });
  } catch (err) { error(res, err.message); }
};

// ── GET CLASS ATTENDANCE (by classLevel) ──────────────────────────────────────
const getClassAttendance = async (req, res) => {
  try {
    const { classLevel, date } = req.query;
    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const students = await prisma.student.findMany({
      where: { classLevel, isActive: true },
      include: {
        attendance: {
          where: { date: attendanceDate },
          select: { status: true, remarks: true },
        },
      },
      orderBy: { firstName: "asc" },
    });

    const data = students.map((s) => ({
      studentId:  s.id,
      name:       `${s.firstName} ${s.lastName}`,
      rollNumber: s.rollNumber,
      status:     s.attendance[0]?.status || "NOT_MARKED",
      remarks:    s.attendance[0]?.remarks || null,
    }));

    success(res, { date: attendanceDate.toISOString().split("T")[0], classLevel, students: data });
  } catch (err) { error(res, err.message); }
};

module.exports = { getTodaySummary, getWeeklySummary, markAttendance, getStudentAttendance, getClassAttendance };

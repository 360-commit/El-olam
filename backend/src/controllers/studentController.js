const prisma = require("../config/db");
const { success, created, notFound, badRequest, error, paginated } = require("../utils/response");

// ── GET ALL STUDENTS ──────────────────────────────────────────────────────────
const getStudents = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", classLevel, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName:  { contains: search, mode: "insensitive" } },
          { rollNumber:{ contains: search, mode: "insensitive" } },
        ],
      }),
      ...(classLevel && { classLevel }),
      ...(status !== undefined && { isActive: status === "active" }),
    };

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where, skip, take: parseInt(limit),
        orderBy: { firstName: "asc" },
        include: {
          classroom: { select: { name: true, level: true } },
          fees: { where: { term: "TERM_2", academicYear: "2024" }, select: { amountDue: true, amountPaid: true, status: true } },
          attendance: { where: { term: "TERM_2", academicYear: "2024" }, select: { status: true } },
          user: { select: { email: true, lastLoginAt: true } },
        },
      }),
      prisma.student.count({ where }),
    ]);

    const enriched = students.map((s) => {
      const totalDays = s.attendance.length;
      const presentDays = s.attendance.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;
      const attPct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

      const fee = s.fees[0] || null;
      return {
        ...s,
        attendancePercent: attPct,
        feeStatus: fee?.status || "PENDING",
        feePaid: fee?.amountPaid || 0,
        feeDue: fee?.amountDue || 0,
      };
    });

    paginated(res, enriched, { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) });
  } catch (err) {
    error(res, err.message);
  }
};

// ── GET SINGLE STUDENT ────────────────────────────────────────────────────────
const getStudent = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { email: true, lastLoginAt: true } },
        classroom: true,
        parents: { include: { parent: { include: { user: { select: { email: true } } } } } },
        fees: { include: { feeStructure: true, payments: true } },
        results: { include: { subject: true }, orderBy: { createdAt: "desc" } },
        attendance: { orderBy: { date: "desc" }, take: 60 },
        libraryLoans: { include: { book: true }, orderBy: { borrowedAt: "desc" }, take: 10 },
      },
    });
    if (!student) return notFound(res, "Student not found.");
    success(res, { student });
  } catch (err) {
    error(res, err.message);
  }
};

// ── CREATE STUDENT ────────────────────────────────────────────────────────────
const createStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, password, rollNumber, classLevel, dateOfBirth, gender, address, parentEmail } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return badRequest(res, "Email already in use.");

    const roll = await prisma.student.findUnique({ where: { rollNumber } });
    if (roll) return badRequest(res, "Roll number already exists.");

    const bcrypt = require("bcryptjs");
    const passwordHash = await bcrypt.hash(password || "student123", 12);

    const classroom = await prisma.classRoom.findFirst({ where: { level: classLevel } });

    const user = await prisma.user.create({
      data: {
        email, passwordHash, role: "STUDENT",
        student: {
          create: {
            firstName, lastName, rollNumber, classLevel,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            gender: gender || null,
            address: address || null,
            classRoomId: classroom?.id || null,
          },
        },
      },
      include: { student: true },
    });

    created(res, { student: user.student }, "Student enrolled successfully.");
  } catch (err) {
    error(res, err.message);
  }
};

// ── UPDATE STUDENT ────────────────────────────────────────────────────────────
const updateStudent = async (req, res) => {
  try {
    const { firstName, lastName, classLevel, dateOfBirth, gender, address, isActive } = req.body;
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) return notFound(res, "Student not found.");

    let classRoomId = student.classRoomId;
    if (classLevel && classLevel !== student.classLevel) {
      const room = await prisma.classRoom.findFirst({ where: { level: classLevel } });
      classRoomId = room?.id || null;
    }

    const updated = await prisma.student.update({
      where: { id: req.params.id },
      data: {
        ...(firstName    && { firstName }),
        ...(lastName     && { lastName  }),
        ...(classLevel   && { classLevel, classRoomId }),
        ...(dateOfBirth  && { dateOfBirth: new Date(dateOfBirth) }),
        ...(gender       && { gender }),
        ...(address      && { address }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    success(res, { student: updated }, "Student updated successfully.");
  } catch (err) {
    error(res, err.message);
  }
};

// ── DELETE (ARCHIVE) STUDENT ──────────────────────────────────────────────────
const deleteStudent = async (req, res) => {
  try {
    await prisma.student.update({ where: { id: req.params.id }, data: { isActive: false } });
    await prisma.user.update({
      where: { id: (await prisma.student.findUnique({ where: { id: req.params.id }, select: { userId: true } }))?.userId },
      data: { isActive: false },
    });
    success(res, {}, "Student archived successfully.");
  } catch (err) {
    error(res, err.message);
  }
};

// ── GET STUDENT RESULTS SUMMARY ───────────────────────────────────────────────
const getStudentResults = async (req, res) => {
  try {
    const { term = "TERM_2", academicYear = "2024" } = req.query;
    const results = await prisma.result.findMany({
      where: { studentId: req.params.id, term, academicYear },
      include: { subject: true },
      orderBy: { subject: { name: "asc" } },
    });

    const totalScore = results.reduce((sum, r) => sum + (r.totalScore || 0), 0);
    const average = results.length > 0 ? Math.round(totalScore / results.length) : 0;

    success(res, { results, average, total: results.length });
  } catch (err) {
    error(res, err.message);
  }
};

module.exports = { getStudents, getStudent, createStudent, updateStudent, deleteStudent, getStudentResults };

const prisma = require("../config/db");
const { success, created, notFound, badRequest, error, paginated } = require("../utils/response");

const getTeachers = async (req, res) => {
  try {
    const { search = "", classLevel } = req.query;
    const where = {
      isActive: true,
      ...(search && { OR: [{ firstName: { contains: search, mode: "insensitive" } }, { lastName: { contains: search, mode: "insensitive" } }] }),
      ...(classLevel && { classLevel }),
    };
    const teachers = await prisma.teacher.findMany({
      where, orderBy: { firstName: "asc" },
      include: { user: { select: { email: true } }, classes: { select: { name: true, level: true } } },
    });
    success(res, { teachers, total: teachers.length });
  } catch (err) { error(res, err.message); }
};

const getTeacher = async (req, res) => {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { email: true, lastLoginAt: true } },
        classes: { include: { students: { select: { id: true, firstName: true, lastName: true, rollNumber: true } } } },
        timetableSlots: { include: { subject: true, classroom: true } },
      },
    });
    if (!teacher) return notFound(res, "Teacher not found.");
    success(res, { teacher });
  } catch (err) { error(res, err.message); }
};

const createTeacher = async (req, res) => {
  try {
    const { firstName, lastName, email, password, subject, classLevel, phone, qualification, experience } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return badRequest(res, "Email already registered.");

    const bcrypt = require("bcryptjs");
    const passwordHash = await bcrypt.hash(password || "teacher123", 12);

    const user = await prisma.user.create({
      data: {
        email, passwordHash, role: "TEACHER",
        teacher: {
          create: { firstName, lastName, subject, classLevel: classLevel || null, phone: phone || null, qualification: qualification || null, experience: experience || 0 },
        },
      },
      include: { teacher: true },
    });
    created(res, { teacher: user.teacher }, "Teacher created successfully.");
  } catch (err) { error(res, err.message); }
};

const updateTeacher = async (req, res) => {
  try {
    const { firstName, lastName, subject, classLevel, phone, qualification, experience, isActive } = req.body;
    const updated = await prisma.teacher.update({
      where: { id: req.params.id },
      data: {
        ...(firstName     && { firstName }),
        ...(lastName      && { lastName  }),
        ...(subject       && { subject   }),
        ...(classLevel    && { classLevel}),
        ...(phone         && { phone     }),
        ...(qualification && { qualification }),
        ...(experience !== undefined && { experience: parseInt(experience) }),
        ...(isActive !== undefined   && { isActive }),
      },
    });
    success(res, { teacher: updated }, "Teacher updated.");
  } catch (err) { error(res, err.message); }
};

const getTeacherStudents = async (req, res) => {
  try {
    const teacher = await prisma.teacher.findUnique({ where: { id: req.params.id }, select: { classLevel: true } });
    if (!teacher) return notFound(res, "Teacher not found.");

    const students = await prisma.student.findMany({
      where: { classLevel: teacher.classLevel, isActive: true },
      include: {
        attendance: { where: { term: "TERM_2", academicYear: "2024" }, select: { status: true } },
        results: { where: { term: "TERM_2", academicYear: "2024" }, include: { subject: true } },
      },
      orderBy: { firstName: "asc" },
    });
    success(res, { students, total: students.length });
  } catch (err) { error(res, err.message); }
};

module.exports = { getTeachers, getTeacher, createTeacher, updateTeacher, getTeacherStudents };

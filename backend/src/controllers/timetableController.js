const prisma = require("../config/db");
const { success, created, notFound, error } = require("../utils/response");

const DAY_NAMES = { 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday" };

const getTimetable = async (req, res) => {
  try {
    const { classLevel, term = "TERM_2", academicYear = "2024" } = req.query;

    const classroom = classLevel
      ? await prisma.classRoom.findFirst({ where: { level: classLevel } })
      : null;

    const slots = await prisma.timetableSlot.findMany({
      where: {
        term, academicYear,
        ...(classroom && { classRoomId: classroom.id }),
      },
      include: {
        subject:   { select: { name: true, code: true } },
        teacher:   { select: { firstName: true, lastName: true } },
        classroom: { select: { name: true, level: true } },
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    // Group by day
    const grouped = {};
    for (let d = 1; d <= 5; d++) {
      grouped[DAY_NAMES[d]] = slots.filter((s) => s.dayOfWeek === d).map((s) => ({
        id:       s.id,
        time:     `${s.startTime}–${s.endTime}`,
        subject:  s.subject.name,
        teacher:  s.teacher ? `${s.teacher.firstName} ${s.teacher.lastName}` : "—",
        class:    s.classroom.name,
      }));
    }

    success(res, { timetable: grouped, classLevel: classLevel || "ALL", term, academicYear });
  } catch (err) { error(res, err.message); }
};

const createSlot = async (req, res) => {
  try {
    const { classRoomId, subjectId, teacherId, dayOfWeek, startTime, endTime, term, academicYear } = req.body;

    // Conflict check: same teacher, same day, overlapping time
    const conflict = await prisma.timetableSlot.findFirst({
      where: {
        teacherId, dayOfWeek: parseInt(dayOfWeek), term, academicYear,
        OR: [
          { startTime: { lte: startTime }, endTime: { gt: startTime } },
          { startTime: { lt: endTime },    endTime: { gte: endTime } },
        ],
      },
    });
    if (conflict) return res.status(409).json({ success: false, message: "Teacher has a scheduling conflict at this time." });

    const slot = await prisma.timetableSlot.create({
      data: { classRoomId, subjectId, teacherId: teacherId || null, dayOfWeek: parseInt(dayOfWeek), startTime, endTime, term, academicYear },
      include: { subject: true, teacher: { select: { firstName: true, lastName: true } }, classroom: true },
    });
    created(res, { slot }, "Timetable slot created.");
  } catch (err) { error(res, err.message); }
};

const deleteSlot = async (req, res) => {
  try {
    await prisma.timetableSlot.delete({ where: { id: req.params.id } });
    success(res, {}, "Slot removed.");
  } catch (err) { error(res, err.message); }
};

module.exports = { getTimetable, createSlot, deleteSlot };

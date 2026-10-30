const prisma = require("../config/db");
const { success, error } = require("../utils/response");

const getAdminStats = async (req, res) => {
  try {
    const { term = "TERM_2", academicYear = "2024" } = req.query;

    const [
      totalStudents,
      totalTeachers,
      totalParents,
      activeNotices,
      feeSummary,
      todayAttendance,
      recentNotices,
      upcomingEvents,
    ] = await Promise.all([
      prisma.student.count({ where: { isActive: true } }),
      prisma.teacher.count({ where: { isActive: true } }),
      prisma.parent.count(),
      prisma.notice.count({ where: { isActive: true } }),

      // Fee totals
      prisma.fee.aggregate({
        where: { term, academicYear },
        _sum: { amountDue: true, amountPaid: true },
      }),

      // Today's attendance
      prisma.attendance.groupBy({
        by: ["status"],
        where: {
          date: (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })(),
        },
        _count: { status: true },
      }),

      // Recent 3 notices
      prisma.notice.findMany({
        where: { isActive: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: { id: true, title: true, priority: true, publishedAt: true, type: true },
      }),

      // Upcoming events
      prisma.event.findMany({
        where: { eventDate: { gte: new Date() } },
        orderBy: { eventDate: "asc" },
        take: 5,
      }),
    ]);

    // Attendance map
    const attMap = { PRESENT: 0, ABSENT: 0, LATE: 0, LEAVE: 0 };
    todayAttendance.forEach((r) => { attMap[r.status] = r._count.status; });

    const totalFeesDue      = feeSummary._sum.amountDue  || 0;
    const totalFeesCollected = feeSummary._sum.amountPaid || 0;
    const totalFeesOutstanding = totalFeesDue - totalFeesCollected;

    // Avg attendance this week per student
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);

    const weekAtt = await prisma.attendance.groupBy({
      by: ["status"],
      where: { date: { gte: weekStart } },
      _count: { status: true },
    });
    const weekAttMap = { PRESENT: 0, ABSENT: 0, LATE: 0, LEAVE: 0 };
    weekAtt.forEach((r) => { weekAttMap[r.status] = r._count.status; });
    const weekTotal = Object.values(weekAttMap).reduce((a, b) => a + b, 0);
    const weekPresentRate = weekTotal > 0
      ? Math.round(((weekAttMap.PRESENT + weekAttMap.LATE) / weekTotal) * 100)
      : 0;

    // Class-level student counts
    const classBreakdown = await prisma.student.groupBy({
      by: ["classLevel"],
      where: { isActive: true },
      _count: { classLevel: true },
      orderBy: { classLevel: "asc" },
    });

    success(res, {
      overview: {
        totalStudents,
        totalTeachers,
        totalParents,
        activeNotices,
      },
      fees: {
        totalDue:        totalFeesDue,
        totalCollected:  totalFeesCollected,
        totalOutstanding: totalFeesOutstanding,
        collectionRate:  totalFeesDue > 0 ? Math.round((totalFeesCollected / totalFeesDue) * 100) : 0,
      },
      attendance: {
        today:           attMap,
        weeklyRate:      weekPresentRate,
      },
      classBreakdown:    classBreakdown.map((c) => ({ class: c.classLevel.replace(/_/g, " "), count: c._count.classLevel })),
      recentNotices,
      upcomingEvents,
    });
  } catch (err) {
    error(res, err.message);
  }
};

module.exports = { getAdminStats };

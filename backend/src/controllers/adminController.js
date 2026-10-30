const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAdminStats = async (req, res) => {
  try {
    const stats = {
      studentCount: await prisma.student.count(),
      teacherCount: await prisma.teacher.count(),
      parentCount: await prisma.parent.count(),
      classRoomCount: await prisma.classRoom.count(),
      attendanceCount: await prisma.attendance.count(),
      feeCount: await prisma.fee.count(),
      paymentCount: await prisma.payment.count(),
      noticeCount: await prisma.notice.count(),
      eventCount: await prisma.event.count(),
    };
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAdminStats,
  // Add other admin-specific functions here
};
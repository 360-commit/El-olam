const prisma = require("../config/db");
const { success, created, notFound, badRequest, error } = require("../utils/response");

const getNotices = async (req, res) => {
  try {
    const { priority, type, role } = req.query;
    const where = {
      isActive: true,
      ...(priority && { priority: priority.toUpperCase() }),
      ...(type     && { type:     type.toUpperCase()     }),
      ...(role     && { targetRoles: { has: role.toUpperCase() } }),
    };
    const notices = await prisma.notice.findMany({
      where, orderBy: { publishedAt: "desc" },
      include: { author: { select: { firstName: true, lastName: true } } },
    });
    success(res, { notices, total: notices.length });
  } catch (err) { error(res, err.message); }
};

const getNotice = async (req, res) => {
  try {
    const notice = await prisma.notice.findUnique({ where: { id: req.params.id }, include: { author: { select: { firstName: true, lastName: true } } } });
    if (!notice) return notFound(res, "Notice not found.");
    success(res, { notice });
  } catch (err) { error(res, err.message); }
};

const createNotice = async (req, res) => {
  try {
    const { title, body, type, priority, targetRoles, expiresAt } = req.body;

    // Get teacher profile if author is a teacher
    let authorId = null;
    if (req.user.role === "TEACHER") {
      const t = await prisma.teacher.findUnique({ where: { userId: req.user.id }, select: { id: true } });
      authorId = t?.id;
    }

    const notice = await prisma.notice.create({
      data: {
        title, body,
        type:        (type     || "GENERAL").toUpperCase(),
        priority:    (priority || "LOW").toUpperCase(),
        targetRoles: targetRoles || ["STUDENT", "TEACHER", "PARENT"],
        expiresAt:   expiresAt ? new Date(expiresAt) : null,
        authorId,
      },
    });
    created(res, { notice }, "Notice published successfully.");
  } catch (err) { error(res, err.message); }
};

const updateNotice = async (req, res) => {
  try {
    const { title, body, type, priority, targetRoles, isActive, expiresAt } = req.body;
    const notice = await prisma.notice.update({
      where: { id: req.params.id },
      data: {
        ...(title       && { title }),
        ...(body        && { body  }),
        ...(type        && { type: type.toUpperCase() }),
        ...(priority    && { priority: priority.toUpperCase() }),
        ...(targetRoles && { targetRoles }),
        ...(isActive !== undefined && { isActive }),
        ...(expiresAt   && { expiresAt: new Date(expiresAt) }),
      },
    });
    success(res, { notice }, "Notice updated.");
  } catch (err) { error(res, err.message); }
};

const deleteNotice = async (req, res) => {
  try {
    await prisma.notice.update({ where: { id: req.params.id }, data: { isActive: false } });
    success(res, {}, "Notice removed.");
  } catch (err) { error(res, err.message); }
};

module.exports = { getNotices, getNotice, createNotice, updateNotice, deleteNotice };

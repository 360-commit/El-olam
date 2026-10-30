const prisma = require("../config/db");
const { success, created, notFound, error } = require("../utils/response");

const getEvents = async (req, res) => {
  try {
    const { upcoming } = req.query;
    const events = await prisma.event.findMany({
      where: upcoming === "true" ? { eventDate: { gte: new Date() } } : {},
      orderBy: { eventDate: "asc" },
    });
    success(res, { events, total: events.length });
  } catch (err) { error(res, err.message); }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, eventDate, endDate, location, type, color } = req.body;
    const event = await prisma.event.create({
      data: { title, description, eventDate: new Date(eventDate), endDate: endDate ? new Date(endDate) : null, location, type: type || "general", color: color || "#29B6E8" },
    });
    created(res, { event }, "Event created.");
  } catch (err) { error(res, err.message); }
};

const updateEvent = async (req, res) => {
  try {
    const { title, description, eventDate, endDate, location, type, color } = req.body;
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        ...(title       && { title }),
        ...(description && { description }),
        ...(eventDate   && { eventDate: new Date(eventDate) }),
        ...(endDate     && { endDate:   new Date(endDate) }),
        ...(location    && { location }),
        ...(type        && { type }),
        ...(color       && { color }),
      },
    });
    success(res, { event }, "Event updated.");
  } catch (err) { error(res, err.message); }
};

const deleteEvent = async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    success(res, {}, "Event deleted.");
  } catch (err) { error(res, err.message); }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };

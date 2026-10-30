const express = require("express");
const router  = express.Router();
const { body } = require("express-validator");
const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/eventController");
const { protect, restrictTo } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.use(protect);

router.get("/",       getEvents);
router.post("/",      restrictTo("ADMIN"), [ body("title").notEmpty(), body("eventDate").isISO8601() ], validate, createEvent);
router.put("/:id",    restrictTo("ADMIN"), updateEvent);
router.delete("/:id", restrictTo("ADMIN"), deleteEvent);

module.exports = router;

const express = require("express");
const router  = express.Router();
const { body } = require("express-validator");
const { getTimetable, createSlot, deleteSlot } = require("../controllers/timetableController");
const { protect, restrictTo } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.use(protect);

router.get("/",          getTimetable);
router.post("/",         restrictTo("ADMIN"),
  [ body("classRoomId").notEmpty(), body("subjectId").notEmpty(), body("dayOfWeek").isInt({ min: 1, max: 5 }), body("startTime").notEmpty(), body("endTime").notEmpty(), body("term").notEmpty(), body("academicYear").notEmpty() ],
  validate, createSlot
);
router.delete("/:id",    restrictTo("ADMIN"), deleteSlot);

module.exports = router;

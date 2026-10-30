const express = require("express");
const router  = express.Router();
const { body } = require("express-validator");
const { getTodaySummary, getWeeklySummary, markAttendance, getStudentAttendance, getClassAttendance } = require("../controllers/attendanceController");
const { protect, restrictTo } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.use(protect);

router.get("/today",                    restrictTo("ADMIN","TEACHER"), getTodaySummary);
router.get("/weekly",                   restrictTo("ADMIN","TEACHER"), getWeeklySummary);
router.get("/class",                    restrictTo("ADMIN","TEACHER"), getClassAttendance);
router.get("/student/:studentId",       getStudentAttendance);
router.post("/mark",                    restrictTo("ADMIN","TEACHER"),
  [ body("records").isArray({ min: 1 }), body("records.*.studentId").notEmpty(), body("records.*.status").isIn(["PRESENT","ABSENT","LATE","LEAVE"]) ],
  validate, markAttendance
);

module.exports = router;

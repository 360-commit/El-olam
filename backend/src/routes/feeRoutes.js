const express = require("express");
const router  = express.Router();
const { body } = require("express-validator");
const { getFeeSummary, getStudentFee, recordPayment, getOverdueFees, createFeeStructure } = require("../controllers/feeController");
const { protect, restrictTo } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.use(protect);

router.get("/summary",             restrictTo("ADMIN"), getFeeSummary);
router.get("/overdue",             restrictTo("ADMIN"), getOverdueFees);
router.get("/student/:studentId",  getStudentFee);
router.post("/payment",            restrictTo("ADMIN"),
  [ body("feeId").notEmpty(), body("amount").isFloat({ min: 1 }), body("method").notEmpty() ],
  validate, recordPayment
);
router.post("/structure",          restrictTo("ADMIN"),
  [ body("classLevel").notEmpty(), body("term").notEmpty(), body("academicYear").notEmpty(), body("amount").isFloat({ min: 1 }), body("dueDate").isISO8601() ],
  validate, createFeeStructure
);

module.exports = router;

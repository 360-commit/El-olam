const express = require("express");
const router  = express.Router();
const { body } = require("express-validator");
const { getClassResults, upsertResult, bulkUpsertResults, getReportCard } = require("../controllers/resultController");
const { protect, restrictTo } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.use(protect);

router.get("/",                            restrictTo("ADMIN","TEACHER"), getClassResults);
router.post("/",                           restrictTo("ADMIN","TEACHER"),
  [ body("studentId").notEmpty(), body("subjectId").notEmpty(), body("endOfTerm").isFloat({ min: 0, max: 100 }) ],
  validate, upsertResult
);
router.post("/bulk",                       restrictTo("ADMIN","TEACHER"),
  [ body("results").isArray({ min: 1 }) ],
  validate, bulkUpsertResults
);
router.get("/report-card/:studentId",      getReportCard);

module.exports = router;

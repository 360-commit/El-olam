const express = require("express");
const router  = express.Router();
const { body } = require("express-validator");
const { initOnlinePayment, verifyOnlinePayment } = require("../controllers/paymentController");
const { protect, restrictTo } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.use(protect);

// Initialize PayStack payment (parent/admin triggers this)
router.post("/initialize",
  [ body("feeId").notEmpty().withMessage("feeId is required") ],
  validate,
  initOnlinePayment
);

// Callback verification after PayStack redirect
router.get("/verify/:reference", verifyOnlinePayment);

module.exports = router;

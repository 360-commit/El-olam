const express = require("express");
const router  = express.Router();
const { getAdminStats } = require("../controllers/dashboardController");
const { protect, restrictTo } = require("../middleware/auth");

router.use(protect);
router.get("/stats", restrictTo("ADMIN"), getAdminStats);

module.exports = router;

const express = require("express");
const router  = express.Router();
const { getParents, getParent, getMyChildren } = require("../controllers/parentController");
const { protect, restrictTo } = require("../middleware/auth");

router.use(protect);

router.get("/",          restrictTo("ADMIN"), getParents);
router.get("/my-children", restrictTo("PARENT"), getMyChildren);
router.get("/:id",       restrictTo("ADMIN","PARENT"), getParent);

module.exports = router;

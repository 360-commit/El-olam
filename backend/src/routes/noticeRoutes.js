const express = require("express");
const router  = express.Router();
const { body } = require("express-validator");
const { getNotices, getNotice, createNotice, updateNotice, deleteNotice } = require("../controllers/noticeController");
const { protect, restrictTo } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.use(protect);

router.get("/",        getNotices);
router.get("/:id",     getNotice);
router.post("/",       restrictTo("ADMIN","TEACHER"),
  [ body("title").notEmpty(), body("body").notEmpty() ],
  validate, createNotice
);
router.put("/:id",     restrictTo("ADMIN"), updateNotice);
router.delete("/:id",  restrictTo("ADMIN"), deleteNotice);

module.exports = router;

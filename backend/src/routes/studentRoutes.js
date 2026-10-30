const express = require("express");
const router  = express.Router();
const { body } = require("express-validator");
const { getStudents, getStudent, createStudent, updateStudent, deleteStudent, getStudentResults } = require("../controllers/studentController");
const { protect, restrictTo } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.use(protect);

router.get("/",    restrictTo("ADMIN","TEACHER"), getStudents);
router.post("/",   restrictTo("ADMIN"),
  [ body("firstName").notEmpty(), body("lastName").notEmpty(), body("email").isEmail(), body("rollNumber").notEmpty(), body("classLevel").notEmpty() ],
  validate, createStudent
);

router.get("/:id",        getStudent);
router.put("/:id",        restrictTo("ADMIN"), updateStudent);
router.delete("/:id",     restrictTo("ADMIN"), deleteStudent);
router.get("/:id/results", getStudentResults);

module.exports = router;

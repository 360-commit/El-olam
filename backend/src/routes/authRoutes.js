const express = require("express");
const router  = express.Router();
const { body } = require("express-validator");
const { register, login, refreshToken, logout, getMe, changePassword } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.post("/register",
  [ body("email").isEmail(), body("password").isLength({ min: 6 }), body("firstName").notEmpty(), body("lastName").notEmpty(), body("role").isIn(["ADMIN","TEACHER","STUDENT","PARENT"]) ],
  validate, register
);

router.post("/login",
  [ body("email").isEmail(), body("password").notEmpty() ],
  validate, login
);

router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

router.get("/me", protect, getMe);
router.put("/change-password", protect,
  [ body("currentPassword").notEmpty(), body("newPassword").isLength({ min: 6 }) ],
  validate, changePassword
);

module.exports = router;

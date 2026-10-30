const express = require("express");
const router  = express.Router();
const { body } = require("express-validator");
const { getBooks, addBook, borrowBook, returnBook, getOverdueLoans } = require("../controllers/libraryController");
const { protect, restrictTo } = require("../middleware/auth");
const validate = require("../middleware/validate");

router.use(protect);

router.get("/",                  getBooks);
router.post("/",                 restrictTo("ADMIN"), [ body("title").notEmpty(), body("author").notEmpty() ], validate, addBook);
router.get("/overdue",           restrictTo("ADMIN"), getOverdueLoans);
router.post("/borrow",           restrictTo("ADMIN","TEACHER"), [ body("bookId").notEmpty(), body("studentId").notEmpty() ], validate, borrowBook);
router.put("/return/:loanId",    restrictTo("ADMIN","TEACHER"), returnBook);

module.exports = router;

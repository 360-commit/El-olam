const prisma = require("../config/db");
const { success, created, notFound, badRequest, error } = require("../utils/response");

const getBooks = async (req, res) => {
  try {
    const { search = "", genre } = req.query;
    const books = await prisma.libraryBook.findMany({
      where: {
        ...(search && { OR: [{ title: { contains: search, mode: "insensitive" } }, { author: { contains: search, mode: "insensitive" } }] }),
        ...(genre  && { genre }),
      },
      include: { loans: { where: { returnedAt: null }, select: { id: true } } },
      orderBy: { title: "asc" },
    });

    const enriched = books.map((b) => ({
      ...b,
      borrowedCount: b.loans.length,
      availableCopies: b.totalCopies - b.loans.length,
    }));

    success(res, { books: enriched, total: enriched.length });
  } catch (err) { error(res, err.message); }
};

const addBook = async (req, res) => {
  try {
    const { title, author, isbn, genre, targetClass, totalCopies } = req.body;
    const book = await prisma.libraryBook.create({ data: { title, author, isbn, genre, targetClass, totalCopies: parseInt(totalCopies) || 1 } });
    created(res, { book }, "Book added to library.");
  } catch (err) { error(res, err.message); }
};

const borrowBook = async (req, res) => {
  try {
    const { bookId, studentId, dueDate } = req.body;

    const book = await prisma.libraryBook.findUnique({ where: { id: bookId }, include: { loans: { where: { returnedAt: null } } } });
    if (!book) return notFound(res, "Book not found.");

    const available = book.totalCopies - book.loans.length;
    if (available <= 0) return badRequest(res, "No copies available for borrowing.");

    // Check student doesn't already have this book
    const existing = book.loans.find((l) => l.studentId === studentId);
    if (existing) return badRequest(res, "Student already has this book borrowed.");

    const loan = await prisma.libraryLoan.create({
      data: { bookId, studentId, dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 86400000) },
      include: { book: { select: { title: true } }, student: { select: { firstName: true, lastName: true, rollNumber: true } } },
    });
    created(res, { loan }, "Book borrowed successfully.");
  } catch (err) { error(res, err.message); }
};

const returnBook = async (req, res) => {
  try {
    const loan = await prisma.libraryLoan.findUnique({ where: { id: req.params.loanId } });
    if (!loan) return notFound(res, "Loan record not found.");
    if (loan.returnedAt) return badRequest(res, "Book already returned.");

    const updated = await prisma.libraryLoan.update({
      where: { id: req.params.loanId },
      data: { returnedAt: new Date(), isOverdue: loan.dueDate < new Date() },
    });
    success(res, { loan: updated }, "Book returned successfully.");
  } catch (err) { error(res, err.message); }
};

const getOverdueLoans = async (req, res) => {
  try {
    const loans = await prisma.libraryLoan.findMany({
      where: { returnedAt: null, dueDate: { lt: new Date() } },
      include: {
        book:    { select: { title: true, author: true } },
        student: { select: { firstName: true, lastName: true, rollNumber: true, classLevel: true } },
      },
      orderBy: { dueDate: "asc" },
    });
    success(res, { loans, total: loans.length });
  } catch (err) { error(res, err.message); }
};

module.exports = { getBooks, addBook, borrowBook, returnBook, getOverdueLoans };

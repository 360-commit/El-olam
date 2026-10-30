const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // Prisma errors
  if (err.code === "P2002") {
    return res.status(409).json({ success: false, message: "Duplicate entry — this record already exists." });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ success: false, message: "Record not found." });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;

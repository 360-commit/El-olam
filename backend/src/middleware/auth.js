const { verifyToken } = require("../utils/jwt");
const { unauthorized, forbidden } = require("../utils/response");
const prisma = require("../config/db");

/**
 * Protect route — requires valid JWT
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return unauthorized(res, "No token provided. Please log in.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user)       return unauthorized(res, "User no longer exists.");
    if (!user.isActive) return unauthorized(res, "Your account has been deactivated.");

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError")  return unauthorized(res, "Invalid token.");
    if (err.name === "TokenExpiredError")  return unauthorized(res, "Token expired. Please log in again.");
    return unauthorized(res, "Authentication failed.");
  }
};

/**
 * Restrict to specific roles
 * Usage: restrictTo("ADMIN", "TEACHER")
 */
const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return forbidden(res, "You do not have permission to perform this action.");
  }
  next();
};

module.exports = { protect, restrictTo };

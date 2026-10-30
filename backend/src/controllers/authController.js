const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const prisma = require("../config/db");
const { signToken, signRefreshToken, verifyRefreshToken } = require("../utils/jwt");
const { success, created, badRequest, unauthorized, error } = require("../utils/response");

// ── REGISTER ──────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, classLevel, subject, rollNumber } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return badRequest(res, "Email already registered.");

    const passwordHash = await bcrypt.hash(password, 12);

    const userData = {
      email, passwordHash,
      role: role.toUpperCase(),
    };

    // Build role-specific nested create
    if (role.toUpperCase() === "ADMIN") {
      userData.admin = { create: { firstName, lastName } };
    } else if (role.toUpperCase() === "TEACHER") {
      userData.teacher = { create: { firstName, lastName, subject: subject || "General", classLevel: classLevel || null } };
    } else if (role.toUpperCase() === "STUDENT") {
      if (!rollNumber) return badRequest(res, "Roll number is required for students.");
      userData.student = {
        create: { firstName, lastName, rollNumber, classLevel: classLevel || "GRADE_1" },
      };
    } else if (role.toUpperCase() === "PARENT") {
      userData.parent = { create: { firstName, lastName, phone: req.body.phone || "" } };
    }

    const user = await prisma.user.create({
      data: userData,
      select: { id: true, email: true, role: true, createdAt: true },
    });

    created(res, { user }, "Account created successfully.");
  } catch (err) {
    error(res, err.message);
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        admin:   { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        teacher: { select: { id: true, firstName: true, lastName: true, subject: true, classLevel: true, avatarUrl: true } },
        student: { select: { id: true, firstName: true, lastName: true, rollNumber: true, classLevel: true, avatarUrl: true } },
        parent:  { select: { id: true, firstName: true, lastName: true, phone: true, avatarUrl: true } },
      },
    });

    if (!user) return unauthorized(res, "Invalid email or password.");
    if (!user.isActive) return unauthorized(res, "Account is deactivated. Contact administration.");

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return unauthorized(res, "Invalid email or password.");

    // Get profile data
    const profile = user.admin || user.teacher || user.student || user.parent;
    const fullName = profile ? `${profile.firstName} ${profile.lastName}` : email;

    // Generate tokens
    const payload = { id: user.id, role: user.role, email: user.email };
    const accessToken  = signToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    success(res, {
      accessToken,
      refreshToken,
      user: {
        id:         user.id,
        email:      user.email,
        role:       user.role,
        name:       fullName,
        avatar:     profile?.avatarUrl || null,
        profileId:  profile?.id,
        classLevel: profile?.classLevel || null,
        subject:    profile?.subject || null,
        rollNumber: profile?.rollNumber || null,
      },
    }, "Login successful.");
  } catch (err) {
    error(res, err.message);
  }
};

// ── REFRESH TOKEN ─────────────────────────────────────────────────────────────
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) return badRequest(res, "Refresh token required.");

    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored) return unauthorized(res, "Invalid refresh token.");
    if (stored.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { token } });
      return unauthorized(res, "Refresh token expired. Please log in again.");
    }

    const decoded = verifyRefreshToken(token);
    const newAccessToken = signToken({ id: decoded.id, role: decoded.role, email: decoded.email });

    success(res, { accessToken: newAccessToken }, "Token refreshed.");
  } catch (err) {
    unauthorized(res, "Invalid refresh token.");
  }
};

// ── LOGOUT ────────────────────────────────────────────────────────────────────
const logout = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    if (token) {
      await prisma.refreshToken.deleteMany({ where: { token } });
    }
    success(res, {}, "Logged out successfully.");
  } catch (err) {
    error(res, err.message);
  }
};

// ── GET ME ────────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        admin:   true,
        teacher: true,
        student: { include: { classroom: true } },
        parent:  { include: { children: { include: { student: true } } } },
      },
    });
    const { passwordHash, ...safeUser } = user;
    success(res, { user: safeUser });
  } catch (err) {
    error(res, err.message);
  }
};

// ── CHANGE PASSWORD ───────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) return badRequest(res, "Current password is incorrect.");

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    success(res, {}, "Password changed successfully.");
  } catch (err) {
    error(res, err.message);
  }
};

module.exports = { register, login, refreshToken, logout, getMe, changePassword };

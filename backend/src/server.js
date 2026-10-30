require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const morgan     = require("morgan");
const compression = require("compression");
const rateLimit  = require("express-rate-limit");

const errorHandler = require("./middleware/errorHandler");

// ── ROUTES ────────────────────────────────────────────────────────────────────
const authRoutes       = require("./routes/authRoutes");
const studentRoutes    = require("./routes/studentRoutes");
const teacherRoutes    = require("./routes/teacherRoutes");
const feeRoutes        = require("./routes/feeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const resultRoutes     = require("./routes/resultRoutes");
const noticeRoutes     = require("./routes/noticeRoutes");
const timetableRoutes  = require("./routes/timetableRoutes");
const libraryRoutes    = require("./routes/libraryRoutes");
const dashboardRoutes  = require("./routes/dashboardRoutes");
const paymentRoutes    = require("./routes/paymentRoutes");
const eventRoutes      = require("./routes/eventRoutes");
const parentRoutes     = require("./routes/parentRoutes");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── SECURITY MIDDLEWARE ───────────────────────────────────────────────────────
app.use(helmet());
app.use(compression());

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL      || "http://localhost:3000",
  process.env.CLIENT_URL_PROD || "https://app.elolam.edu.gh",
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error(`CORS: ${origin} not allowed`));
  },
  credentials: true,
}));

// Rate limiting — global
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { success: false, message: "Too many requests. Please try again later." },
}));

// Stricter rate limit on auth
app.use("/api/auth", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many login attempts. Try again in 15 minutes." },
}));

// ── BODY PARSERS ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── LOGGING ───────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "El-Olam International School API is running",
    school:  "El-Olam International School",
    motto:   "Home Away from Home",
    version: "1.0.0",
    env:     process.env.NODE_ENV,
    docs:    "/api/docs",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// ── API ROUTES ────────────────────────────────────────────────────────────────
app.use("/api/auth",        authRoutes);
app.use("/api/students",    studentRoutes);
app.use("/api/teachers",    teacherRoutes);
app.use("/api/fees",        feeRoutes);
app.use("/api/attendance",  attendanceRoutes);
app.use("/api/results",     resultRoutes);
app.use("/api/notices",     noticeRoutes);
app.use("/api/timetable",   timetableRoutes);
app.use("/api/library",     libraryRoutes);
app.use("/api/dashboard",   dashboardRoutes);
app.use("/api/payments",    paymentRoutes);
app.use("/api/events",      eventRoutes);
app.use("/api/parents",     parentRoutes);

// ── API DOCS (placeholder) ────────────────────────────────────────────────────
app.get("/api/docs", (req, res) => {
  res.json({
    title:   "El-Olam School API Documentation",
    version: "1.0.0",
    baseUrl: `http://localhost:${PORT}/api`,
    endpoints: {
      auth:       { base: "/auth",       methods: ["POST /register","POST /login","POST /refresh-token","POST /logout","GET /me","PUT /change-password"] },
      students:   { base: "/students",   methods: ["GET /","POST /","GET /:id","PUT /:id","DELETE /:id","GET /:id/results"] },
      teachers:   { base: "/teachers",   methods: ["GET /","POST /","GET /:id","PUT /:id","GET /:id/students"] },
      fees:       { base: "/fees",       methods: ["GET /summary","GET /overdue","GET /student/:id","POST /payment","POST /structure"] },
      attendance: { base: "/attendance", methods: ["GET /today","GET /weekly","GET /class","GET /student/:id","POST /mark"] },
      results:    { base: "/results",    methods: ["GET /","POST /","POST /bulk","GET /report-card/:studentId"] },
      notices:    { base: "/notices",    methods: ["GET /","POST /","GET /:id","PUT /:id","DELETE /:id"] },
      timetable:  { base: "/timetable",  methods: ["GET /","POST /","DELETE /:id"] },
      library:    { base: "/library",    methods: ["GET /","POST /","GET /overdue","POST /borrow","PUT /return/:loanId"] },
      dashboard:  { base: "/dashboard",  methods: ["GET /stats"] },
    },
  });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found.` });
});

// ── GLOBAL ERROR HANDLER ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── START ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  🏫 El-Olam International School API");
  console.log(`  🚀 Server running on port ${PORT}`);
  console.log(`  🌍 ENV: ${process.env.NODE_ENV || "development"}`);
  console.log(`  📍 http://localhost:${PORT}`);
  console.log(`  📚 Docs: http://localhost:${PORT}/api/docs`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
});

module.exports = app;

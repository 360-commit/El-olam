/**
 * El-Olam Backend Utility Helpers
 */

// ── GRADE CALCULATOR ──────────────────────────────────────────────────────────
const calcGrade = (score) => {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
};

// ── RESULT TOTAL (weighted) ───────────────────────────────────────────────────
// Class Test: 20%, Mid-Term: 30%, End-of-Term: 50%
const calcTotal = (classTest = 0, midTerm = 0, endOfTerm = 0) =>
  parseFloat(
    (parseFloat(classTest) * 0.20 +
     parseFloat(midTerm)   * 0.30 +
     parseFloat(endOfTerm) * 0.50).toFixed(2)
  );

// ── ATTENDANCE PERCENTAGE ─────────────────────────────────────────────────────
const calcAttendancePct = (records = []) => {
  if (!records.length) return 0;
  const present = records.filter((r) => r.status === "PRESENT" || r.status === "LATE").length;
  return Math.round((present / records.length) * 100);
};

// ── FORMAT CURRENCY (GHS) ─────────────────────────────────────────────────────
const formatGHS = (amount) => `₵${Number(amount).toLocaleString("en-GH", { minimumFractionDigits: 2 })}`;

// ── PAGINATE QUERY ────────────────────────────────────────────────────────────
const getPagination = (page = 1, limit = 20) => ({
  skip: (parseInt(page) - 1) * parseInt(limit),
  take: parseInt(limit),
});

const buildPaginationMeta = (total, page, limit) => ({
  total,
  page:  parseInt(page),
  limit: parseInt(limit),
  pages: Math.ceil(total / limit),
  hasNext: parseInt(page) * parseInt(limit) < total,
  hasPrev: parseInt(page) > 1,
});

// ── GENERATE RECEIPT NUMBER ───────────────────────────────────────────────────
const generateReceipt = () =>
  `RCP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

// ── ROLL NUMBER GENERATOR ─────────────────────────────────────────────────────
const generateRollNumber = (classLevel, sequence) => {
  const prefixes = {
    DAY_CARE:         "DC",
    CRECHE:           "CR",
    PLAY_CLASS:       "PC",
    KINDERGARTEN:     "KG",
    NURSERY:          "NR",
    LEARNING_TO_READ: "LR",
    GRADE_1:          "G1",
    GRADE_2:          "G2",
    GRADE_3:          "G3",
    GRADE_4:          "G4",
    GRADE_5:          "G5",
    GRADE_6:          "G6",
  };
  const prefix = prefixes[classLevel] || "ST";
  return `${prefix}-${String(sequence).padStart(3, "0")}`;
};

// ── CLASS LEVEL DISPLAY LABEL ─────────────────────────────────────────────────
const classLevelLabel = (level) =>
  level?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || level;

// ── CURRENT TERM HELPER ───────────────────────────────────────────────────────
const getCurrentTerm = () => {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 1  && month <= 3)  return "TERM_1";
  if (month >= 4  && month <= 7)  return "TERM_2";
  return "TERM_3";
};

const getCurrentAcademicYear = () => String(new Date().getFullYear());

// ── SANITISE STRING ───────────────────────────────────────────────────────────
const sanitise = (str) => (str || "").trim().replace(/\s+/g, " ");

module.exports = {
  calcGrade,
  calcTotal,
  calcAttendancePct,
  formatGHS,
  getPagination,
  buildPaginationMeta,
  generateReceipt,
  generateRollNumber,
  classLevelLabel,
  getCurrentTerm,
  getCurrentAcademicYear,
  sanitise,
};

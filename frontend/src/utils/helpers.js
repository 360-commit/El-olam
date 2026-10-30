// ─── GRADE CALCULATOR ────────────────────────────────────────────────────────
export const getGrade = (score) => {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
};

export const getAverage = (scores) =>
  Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

// ─── ATTENDANCE STATUS ───────────────────────────────────────────────────────
export const getAttStatus = (pct) => {
  if (pct >= 90) return { label: "Excellent", color: "#2EC97A" };
  if (pct >= 75) return { label: "Good",      color: "#E6B800" };
  return { label: "Needs Improvement", color: "#F04E4E" };
};

// ─── FEE STATUS ──────────────────────────────────────────────────────────────
export const getFeeStatus = (paid, total) => {
  const pct = Math.round((paid / total) * 100);
  if (pct >= 100) return { label: "Fully Paid",       color: "#2EC97A", pct };
  if (pct >= 50)  return { label: "Partial Payment",  color: "#FF8040", pct };
  return             { label: "Outstanding",           color: "#F04E4E", pct };
};

// ─── FORMAT CURRENCY ─────────────────────────────────────────────────────────
export const formatGHS = (amount) => `₵${Number(amount).toLocaleString()}`;

// ─── INITIALS ────────────────────────────────────────────────────────────────
export const getInitials = (name) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

// ─── PRIORITY COLOR ──────────────────────────────────────────────────────────
export const getPriorityColor = (priority) => {
  if (priority === "high")   return "#F04E4E";
  if (priority === "medium") return "#E6B800";
  return "#29B6E8";
};

// ─── DATE HELPERS ────────────────────────────────────────────────────────────
export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export const getCurrentGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

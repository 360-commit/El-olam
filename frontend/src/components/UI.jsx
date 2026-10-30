import { C } from "../data/constants";

// ─── AVATAR ───────────────────────────────────────────────────────────────────
export const Av = ({ init, sz = 42, bg = C.sky, fc = C.white, fs = 14 }) => (
  <div style={{
    width: sz, height: sz, borderRadius: "50%", background: bg,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: fc, fontWeight: 800, fontSize: fs,
    fontFamily: "'Poppins',sans-serif", flexShrink: 0, letterSpacing: "0.5px",
  }}>{init}</div>
);

// ─── BADGE ────────────────────────────────────────────────────────────────────
export const Bdg = ({ lbl, col = C.sky, bg }) => (
  <span style={{
    background: bg || col + "1E", color: col, fontSize: 10, fontWeight: 700,
    padding: "2px 9px", borderRadius: 20, fontFamily: "'Poppins',sans-serif",
  }}>{lbl}</span>
);

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
export const Bar = ({ v, max = 100, col = C.green, h = 7 }) => (
  <div style={{ background: C.border, borderRadius: 99, height: h, overflow: "hidden" }}>
    <div style={{
      width: `${Math.min(100, (v / max) * 100)}%`, height: "100%",
      background: col, borderRadius: 99, transition: "width 0.7s ease",
    }} />
  </div>
);

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
export const SH = ({ title, action, onAction }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 13 }}>
    <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 800, color: C.text }}>{title}</span>
    {action && (
      <button onClick={onAction} style={{
        background: "none", border: "none", color: C.sky,
        fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: 0,
      }}>{action} →</button>
    )}
  </div>
);

// ─── ICON ─────────────────────────────────────────────────────────────────────
export const Ic = ({ n, s = 20, c = "currentColor" }) => {
  const icons = {
    home:     <path d="M3 12L12 3l9 9M5 10v10h5v-6h4v6h5V10" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
    users:    <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /><circle cx="9" cy="7" r="4" fill="none" stroke={c} strokeWidth="2" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /></>,
    teacher:  <><circle cx="12" cy="8" r="4" fill="none" stroke={c} strokeWidth="2" /><path d="M20 21a8 8 0 10-16 0" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /></>,
    fees:     <><rect x="2" y="5" width="20" height="14" rx="2" fill="none" stroke={c} strokeWidth="2" /><path d="M2 10h20" fill="none" stroke={c} strokeWidth="2" /></>,
    cal:      <><rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke={c} strokeWidth="2" /><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>,
    bell:     <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /></>,
    eye:      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke={c} strokeWidth="2" /><circle cx="12" cy="12" r="3" fill="none" stroke={c} strokeWidth="2" /></>,
    eyeoff:   <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /></>,
    lock:     <><rect x="3" y="11" width="18" height="11" rx="2" fill="none" stroke={c} strokeWidth="2" /><path d="M7 11V7a5 5 0 0110 0v4" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /></>,
    mail:     <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke={c} strokeWidth="2" /><path d="M22 6l-10 7L2 6" fill="none" stroke={c} strokeWidth="2" /></>,
    arrow:    <path d="M9 18l6-6-6-6" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
    back:     <path d="M15 18l-6-6 6-6" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
    check:    <path d="M20 6L9 17l-5-5" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />,
    book:     <><path d="M4 19.5A2.5 2.5 0 016.5 17H20" fill="none" stroke={c} strokeWidth="2" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" fill="none" stroke={c} strokeWidth="2" /></>,
    notice:   <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="none" stroke={c} strokeWidth="2" /><path d="M14 2v6h6M9 13h6M9 17h4" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /></>,
    logout:   <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>,
    settings: <><circle cx="12" cy="12" r="3" fill="none" stroke={c} strokeWidth="2" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" fill="none" stroke={c} strokeWidth="2" /></>,
    search:   <><circle cx="11" cy="11" r="8" fill="none" stroke={c} strokeWidth="2" /><path d="M21 21l-4.35-4.35" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /></>,
    phone:    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" />,
    trophy:   <><path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /><path d="M18 2H6v7a6 6 0 0012 0V2z" fill="none" stroke={c} strokeWidth="2" /></>,
    chart:    <><path d="M18 20V10M12 20V4M6 20v-6" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /></>,
    star:     <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={c} stroke={c} strokeWidth="1" strokeLinejoin="round" />,
    edit:     <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" fill="none" stroke={c} strokeWidth="2" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke={c} strokeWidth="2" /></>,
    add:      <><circle cx="12" cy="12" r="10" fill="none" stroke={c} strokeWidth="2" /><path d="M12 8v8M8 12h8" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none">{icons[n]}</svg>;
};

// ─── CARD ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.white, borderRadius: 16, padding: 16,
    border: `1px solid ${C.border}`, boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    ...style,
  }}>{children}</div>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export const StatCard = ({ icon, label, value, sub, iconBg, iconColor }) => (
  <div style={{
    background: C.white, borderRadius: 16, padding: "14px 12px",
    border: `1px solid ${C.border}`, boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    display: "flex", flexDirection: "column", gap: 8,
  }}>
    <div style={{
      width: 38, height: 38, borderRadius: 11, background: iconBg || C.skyLight,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Ic n={icon} s={19} c={iconColor || C.sky} />
    </div>
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.text, fontFamily: "'Poppins',sans-serif", lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 11, color: C.textMid, fontFamily: "'Nunito',sans-serif", marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: C.textLight, fontFamily: "'Nunito',sans-serif", marginTop: 1 }}>{sub}</div>}
    </div>
  </div>
);

// ─── BACK BUTTON ──────────────────────────────────────────────────────────────
export const BackBtn = ({ onBack, accentColor = C.sky, lightColor = C.skyLight }) => (
  <button onClick={onBack} style={{
    background: lightColor, border: "none", borderRadius: 10, padding: "8px 14px",
    fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700,
    color: accentColor, cursor: "pointer", marginBottom: 16,
    display: "flex", alignItems: "center", gap: 5,
  }}>
    <Ic n="back" s={14} c={accentColor} /> Back
  </button>
);

import { useState } from "react";
import { C, STUDENTS, TEACHERS, FEES_DATA, ATT_WEEK, NOTICES, TIMETABLE, SCORES, SUBJECTS6, CLASSES, SCHOOL } from "../data/constants";
import { Av, Bdg, Bar, SH, Ic, BackBtn } from "./UI";
import { getGrade, getAverage, formatGHS } from "../utils/helpers";

// ── HOME ────────────────────────────────────────────────────────────────────
export const AdminHome = ({ user, onNav }) => {
  const totalDue = FEES_DATA.reduce((a, b) => a + (b.termFee * b.students - b.collected), 0);
  const totalCol = FEES_DATA.reduce((a, b) => a + b.collected, 0);
  const maxBar   = Math.max(...ATT_WEEK.map((d) => d.present));

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg,${C.skyDark} 0%,${C.sky} 70%,#60D4F7 100%)`, borderRadius: "0 0 28px 28px", padding: "18px 18px 26px", marginBottom: 18, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Good Morning 👋</p>
            <h1 style={{ margin: "1px 0 3px", fontFamily: "'Poppins',sans-serif", fontSize: 19, fontWeight: 900, color: C.white }}>{user.name}</h1>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.18)", borderRadius: 20, padding: "3px 10px" }}>
              <Ic n="star" s={10} c={C.yellow} />
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 10, color: C.white, fontWeight: 700 }}>School Administrator</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
            <button onClick={() => onNav("notice")} style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <Ic n="bell" s={17} c={C.white} />
              <div style={{ position: "absolute", top: 3, right: 3, width: 9, height: 9, borderRadius: "50%", background: C.yellow, border: "2px solid " + C.sky }} />
            </button>
            <Av init={user.avatar} sz={44} bg="rgba(255,255,255,0.25)" fc={C.white} />
          </div>
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {[
            { v: STUDENTS.length, l: "Students",   c: C.yellow },
            { v: TEACHERS.length, l: "Teachers",   c: "rgba(255,255,255,0.9)" },
            { v: "92%",           l: "Attendance", c: "rgba(255,255,255,0.9)" },
            { v: formatGHS(totalCol), l: "Collected", c: C.yellow },
          ].map((s) => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "10px 14px", flexShrink: 0 }}>
              <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 900, color: s.c }}>{s.v}</p>
              <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* Quick Access */}
        <SH title="Quick Access" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 9, marginBottom: 20 }}>
          {[
            { i: "users",    l: "Students",   n: "students",  bg: C.skyLight,      c: C.sky       },
            { i: "teacher",  l: "Teachers",   n: "teachers",  bg: C.yellowLight,   c: C.yellowDark },
            { i: "fees",     l: "Fees",       n: "fees",      bg: C.greenLight,    c: C.green     },
            { i: "cal",      l: "Attendance", n: "attend",    bg: "#F0EEFF",       c: C.purple    },
            { i: "trophy",   l: "Results",    n: "results",   bg: "#FFF0E8",       c: C.orange    },
            { i: "book",     l: "Timetable",  n: "timetable", bg: C.skyLight,      c: C.sky       },
            { i: "notice",   l: "Notices",    n: "notice",    bg: C.yellowLight,   c: C.yellowDark },
            { i: "settings", l: "Settings",   n: "settings",  bg: C.greenLight,    c: C.green     },
          ].map((q) => (
            <button key={q.n} onClick={() => onNav(q.n)} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "11px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: q.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic n={q.i} s={18} c={q.c} /></div>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 9, fontWeight: 700, color: C.textMid }}>{q.l}</span>
            </button>
          ))}
        </div>

        {/* Attendance Chart */}
        <div style={{ background: C.white, borderRadius: 18, padding: 16, marginBottom: 18, border: `1px solid ${C.border}`, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <SH title="Weekly Attendance" action="Details" onAction={() => onNav("attend")} />
          <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 64, marginBottom: 8 }}>
            {ATT_WEEK.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", borderRadius: "5px 5px 0 0", height: `${(d.present / maxBar) * 52}px`, background: `linear-gradient(to top,${C.skyDark},${C.sky})`, transition: "height 0.5s" }} />
                <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 9, color: C.textLight }}>{d.day}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: C.textMid }}>Avg: <b>119 / 130</b> students present</span>
            <Bdg lbl="91.5%" col={C.green} />
          </div>
        </div>

        {/* Fee Collection */}
        <div style={{ background: C.white, borderRadius: 18, padding: 16, marginBottom: 18, border: `1px solid ${C.border}`, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <SH title="Fee Collection" action="View All" onAction={() => onNav("fees")} />
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, background: C.greenLight, borderRadius: 12, padding: "10px 12px" }}>
              <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 9, color: C.textMid }}>COLLECTED</p>
              <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 17, fontWeight: 900, color: C.green }}>{formatGHS(totalCol)}</p>
            </div>
            <div style={{ flex: 1, background: "#FFF0F0", borderRadius: 12, padding: "10px 12px" }}>
              <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 9, color: C.textMid }}>OUTSTANDING</p>
              <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 17, fontWeight: 900, color: C.red }}>{formatGHS(totalDue)}</p>
            </div>
          </div>
          {FEES_DATA.slice(0, 4).map((f) => {
            const pct = Math.round((f.collected / (f.termFee * f.students)) * 100);
            return (
              <div key={f.class} style={{ marginBottom: 9 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 600, color: C.text }}>{f.class}</span>
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700, color: pct >= 90 ? C.green : pct >= 70 ? C.yellowDark : C.red }}>{pct}%</span>
                </div>
                <Bar v={f.collected} max={f.termFee * f.students} col={pct >= 90 ? C.green : pct >= 70 ? C.yellowDark : C.sky} />
              </div>
            );
          })}
        </div>

        {/* Notices */}
        <SH title="Recent Notices" action="View All" onAction={() => onNav("notice")} />
        {NOTICES.slice(0, 3).map((n) => (
          <div key={n.id} onClick={() => onNav("notice")} style={{ background: C.white, borderRadius: 14, padding: "12px 14px", marginBottom: 10, border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.04)", borderLeft: `3px solid ${n.priority === "high" ? C.red : n.priority === "medium" ? C.yellow : C.sky}` }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700, color: C.text }}>{n.title}</p>
              <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 10, color: C.textLight }}>{n.date}</p>
            </div>
            <Ic n="arrow" s={14} c={C.textLight} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ── STUDENTS ────────────────────────────────────────────────────────────────
export const AdminStudents = () => {
  const [search, setSearch] = useState("");
  const [cf, setCf] = useState("All");
  const [sel, setSel] = useState(null);
  const list = STUDENTS.filter((s) => (cf === "All" || s.class === cf) && s.name.toLowerCase().includes(search.toLowerCase()));

  if (sel) return (
    <div style={{ padding: "0 16px 20px" }}>
      <BackBtn onBack={() => setSel(null)} />
      <div style={{ background: `linear-gradient(135deg,${C.sky},${C.skyDark})`, borderRadius: 20, padding: 20, marginBottom: 14, display: "flex", gap: 14, alignItems: "center" }}>
        <Av init={sel.av} sz={60} bg="rgba(255,255,255,0.25)" fc={C.white} fs={22} />
        <div>
          <h3 style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 16, fontWeight: 800, color: C.white }}>{sel.name}</h3>
          <p style={{ margin: "2px 0", fontFamily: "'Nunito',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{sel.class} · {sel.roll}</p>
          <Bdg lbl="Active" col={C.white} bg="rgba(255,255,255,0.2)" />
        </div>
      </div>
      {[{ l: "Parent", v: sel.parent }, { l: "Phone", v: sel.phone }, { l: "Date of Birth", v: sel.dob }].map((r) => (
        <div key={r.l} style={{ background: C.white, borderRadius: 13, padding: "12px 16px", marginBottom: 10, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: C.textMid }}>{r.l}</span>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700, color: C.text }}>{r.v}</span>
        </div>
      ))}
      <div style={{ background: C.white, borderRadius: 13, padding: 16, marginBottom: 10, border: `1px solid ${C.border}` }}>
        <p style={{ margin: "0 0 10px", fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 800, color: C.text }}>Fee Overview</p>
        {[{ l: "Term Fee", v: formatGHS(sel.fee), c: C.text }, { l: "Paid", v: formatGHS(sel.paid), c: C.green }, { l: "Balance", v: formatGHS(sel.fee - sel.paid), c: sel.fee - sel.paid > 0 ? C.red : C.green }].map((r) => (
          <div key={r.l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: C.textMid }}>{r.l}</span>
            <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: r.c }}>{r.v}</span>
          </div>
        ))}
        <Bar v={sel.paid} max={sel.fee} col={sel.paid === sel.fee ? C.green : C.sky} />
        <p style={{ margin: "5px 0 0", fontFamily: "'Nunito',sans-serif", fontSize: 10, color: C.textLight, textAlign: "right" }}>{Math.round((sel.paid / sel.fee) * 100)}% paid</p>
      </div>
      <div style={{ background: C.white, borderRadius: 13, padding: 16, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 800, color: C.text }}>Attendance</p>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 22, fontWeight: 900, color: sel.att >= 90 ? C.green : sel.att >= 75 ? C.yellowDark : C.red }}>{sel.att}%</span>
        </div>
        <Bar v={sel.att} max={100} col={sel.att >= 90 ? C.green : sel.att >= 75 ? C.yellowDark : C.red} />
      </div>
    </div>
  );

  return (
    <div style={{ padding: "0 16px 20px" }}>
      <div style={{ position: "relative", marginBottom: 12 }}>
        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}><Ic n="search" s={15} c={C.textLight} /></div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students…"
          style={{ width: "100%", padding: "11px 12px 11px 36px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontFamily: "'Nunito',sans-serif", fontSize: 13, color: C.text, outline: "none" }} />
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, marginBottom: 14 }}>
        {["All", ...CLASSES].map((c) => (
          <button key={c} onClick={() => setCf(c)} style={{ background: cf === c ? C.sky : C.white, color: cf === c ? C.white : C.textMid, border: `1.5px solid ${cf === c ? C.sky : C.border}`, borderRadius: 20, padding: "5px 13px", fontFamily: "'Poppins',sans-serif", fontSize: 10, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {list.map((s) => (
          <div key={s.id} onClick={() => setSel(s)} style={{ background: C.white, borderRadius: 14, padding: "13px 14px", border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
            <Av init={s.av} sz={44} bg={C.sky} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: C.text }}>{s.name}</p>
              <p style={{ margin: "2px 0 0", fontFamily: "'Nunito',sans-serif", fontSize: 11, color: C.textMid }}>{s.class} · {s.roll}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <Bdg lbl={`${s.att}%`} col={s.att >= 90 ? C.green : s.att >= 75 ? C.yellowDark : C.red} />
              <p style={{ margin: "4px 0 0", fontFamily: "'Nunito',sans-serif", fontSize: 10, color: s.paid === s.fee ? C.green : C.red }}>{s.paid === s.fee ? "Fees Paid" : "Owes " + formatGHS(s.fee - s.paid)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── TEACHERS ────────────────────────────────────────────────────────────────
export const AdminTeachers = () => {
  const [sel, setSel] = useState(null);
  if (sel) return (
    <div style={{ padding: "0 16px 20px" }}>
      <BackBtn onBack={() => setSel(null)} accentColor={C.yellowDark} lightColor={C.yellowLight} />
      <div style={{ background: `linear-gradient(135deg,${C.yellowDark},${C.yellow})`, borderRadius: 20, padding: 20, marginBottom: 14, display: "flex", gap: 14, alignItems: "center" }}>
        <Av init={sel.av} sz={60} bg="rgba(255,255,255,0.3)" fc={C.navy} fs={22} />
        <div>
          <h3 style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 16, fontWeight: 800, color: C.navy }}>{sel.name}</h3>
          <p style={{ margin: "2px 0", fontFamily: "'Nunito',sans-serif", fontSize: 12, color: "rgba(0,0,0,0.6)" }}>{sel.subject}</p>
          <Bdg lbl={`${sel.exp} yrs experience`} col={C.navy} bg="rgba(255,255,255,0.35)" />
        </div>
      </div>
      {[{ l: "Class", v: sel.class }, { l: "Email", v: sel.email }, { l: "Phone", v: sel.phone }, { l: "Status", v: "Active" }].map((r) => (
        <div key={r.l} style={{ background: C.white, borderRadius: 13, padding: "12px 16px", marginBottom: 10, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: C.textMid }}>{r.l}</span>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700, color: C.text }}>{r.v}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ padding: "0 16px 20px" }}>
      <div style={{ background: `linear-gradient(135deg,${C.yellowDark},${C.yellow})`, borderRadius: 18, padding: 16, marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 11, color: "rgba(0,0,0,0.5)" }}>Total Teachers</p>
          <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 28, fontWeight: 900, color: C.navy }}>{TEACHERS.length}</p>
        </div>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}><Ic n="teacher" s={24} c={C.navy} /></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {TEACHERS.map((t) => (
          <div key={t.id} onClick={() => setSel(t)} style={{ background: C.white, borderRadius: 16, padding: 14, border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
            <Av init={t.av} sz={46} bg={C.yellowDark} fc={C.white} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: C.text }}>{t.name}</p>
              <p style={{ margin: "2px 0 0", fontFamily: "'Nunito',sans-serif", fontSize: 11, color: C.textMid }}>{t.subject} · {t.class}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <Bdg lbl="Active" col={C.green} />
              <p style={{ margin: "4px 0 0", fontFamily: "'Nunito',sans-serif", fontSize: 10, color: C.textLight }}>{t.exp}y exp</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── FEES ────────────────────────────────────────────────────────────────────
export const AdminFees = () => {
  const tc = FEES_DATA.reduce((a, b) => a + b.collected, 0);
  const te = FEES_DATA.reduce((a, b) => a + b.termFee * b.students, 0);
  return (
    <div style={{ padding: "0 16px 20px" }}>
      <div style={{ background: `linear-gradient(135deg,${C.green},${C.greenDark})`, borderRadius: 20, padding: 18, marginBottom: 16 }}>
        <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.8)" }}>Total Collected · Term 2</p>
        <p style={{ margin: "4px 0 8px", fontFamily: "'Poppins',sans-serif", fontSize: 26, fontWeight: 900, color: C.white }}>{formatGHS(tc)}</p>
        <Bar v={tc} max={te} col="rgba(255,255,255,0.8)" h={8} />
        <p style={{ margin: "6px 0 0", fontFamily: "'Nunito',sans-serif", fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{Math.round((tc / te) * 100)}% of {formatGHS(te)} expected</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FEES_DATA.map((f) => {
          const due = f.termFee * f.students - f.collected;
          const pct = Math.round((f.collected / (f.termFee * f.students)) * 100);
          return (
            <div key={f.class} style={{ background: C.white, borderRadius: 14, padding: 14, border: `1px solid ${C.border}`, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: C.text }}>{f.class}</p>
                  <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 10, color: C.textLight }}>{f.students} students · {formatGHS(f.termFee)}/term</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Bdg lbl={`${pct}%`} col={pct >= 90 ? C.green : pct >= 70 ? C.yellowDark : C.red} />
                  {due > 0 && <p style={{ margin: "3px 0 0", fontFamily: "'Nunito',sans-serif", fontSize: 10, color: C.red }}>{formatGHS(due)} due</p>}
                </div>
              </div>
              <Bar v={f.collected} max={f.termFee * f.students} col={pct >= 90 ? C.green : pct >= 70 ? C.yellowDark : C.sky} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── ATTENDANCE ──────────────────────────────────────────────────────────────
export const AdminAttend = () => (
  <div style={{ padding: "0 16px 20px" }}>
    <div style={{ background: `linear-gradient(135deg,${C.purple},#5A4BA8)`, borderRadius: 20, padding: 18, marginBottom: 18 }}>
      <p style={{ margin: "0 0 4px", fontFamily: "'Nunito',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.8)" }}>Today's Overview</p>
      <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
        {[{ l: "Present", v: 118, c: "rgba(255,255,255,0.95)" }, { l: "Absent", v: 12, c: C.yellow }, { l: "Leave", v: 5, c: "rgba(255,255,255,0.6)" }].map((x) => (
          <div key={x.l}>
            <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 24, fontWeight: 900, color: x.c }}>{x.v}</p>
            <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 10, color: "rgba(255,255,255,0.65)" }}>{x.l}</p>
          </div>
        ))}
      </div>
    </div>
    <SH title="Student Attendance" />
    {STUDENTS.map((s) => (
      <div key={s.id} style={{ background: C.white, borderRadius: 13, padding: "12px 14px", marginBottom: 9, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Av init={s.av} sz={34} bg={C.purple} fc={C.white} fs={11} />
            <div>
              <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700, color: C.text }}>{s.name}</p>
              <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 10, color: C.textLight }}>{s.class}</p>
            </div>
          </div>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 900, color: s.att >= 90 ? C.green : s.att >= 75 ? C.yellowDark : C.red }}>{s.att}%</span>
        </div>
        <Bar v={s.att} max={100} col={s.att >= 90 ? C.green : s.att >= 75 ? C.yellowDark : C.red} h={5} />
      </div>
    ))}
  </div>
);

// ── RESULTS ─────────────────────────────────────────────────────────────────
export const AdminResults = () => (
  <div style={{ padding: "0 16px 20px" }}>
    <div style={{ background: `linear-gradient(135deg,${C.orange},#C44A00)`, borderRadius: 20, padding: 18, marginBottom: 18 }}>
      <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 800, color: C.white }}>End of Term Results</p>
      <p style={{ margin: "2px 0 0", fontFamily: "'Nunito',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.75)" }}>All Students · Term 2, 2024</p>
    </div>
    {STUDENTS.map((s) => {
      const sc = SCORES[s.av] || [70, 75, 80, 65, 72, 68];
      const avg = getAverage(sc);
      const grade = getGrade(avg);
      return (
        <div key={s.id} style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Av init={s.av} sz={38} bg={C.orange} fc={C.white} fs={13} />
              <div>
                <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700, color: C.text }}>{s.name}</p>
                <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 10, color: C.textLight }}>{s.class} · Avg: {avg}%</p>
              </div>
            </div>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: avg >= 80 ? C.greenLight : avg >= 70 ? C.yellowLight : "#FFF0F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 900, fontFamily: "'Poppins',sans-serif", color: avg >= 80 ? C.green : avg >= 70 ? C.yellowDark : C.red }}>{grade}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
            {SUBJECTS6.map((sub, i) => (
              <div key={sub} style={{ background: C.bg, borderRadius: 8, padding: "6px 8px" }}>
                <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 9, color: C.textLight }}>{sub}</p>
                <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: sc[i] >= 70 ? C.text : C.red }}>{sc[i]}%</p>
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

// ── TIMETABLE ───────────────────────────────────────────────────────────────
export const AdminTimetable = () => {
  const [day, setDay] = useState("Monday");
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const tt = TIMETABLE[day] || TIMETABLE["Monday"];
  return (
    <div style={{ padding: "0 16px 20px" }}>
      <div style={{ background: `linear-gradient(135deg,${C.sky},${C.skyDark})`, borderRadius: 20, padding: 18, marginBottom: 18 }}>
        <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 800, color: C.white }}>Class Timetable</p>
        <p style={{ margin: "2px 0 0", fontFamily: "'Nunito',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.75)" }}>Grade 3 · Term 2, 2024</p>
      </div>
      <div style={{ display: "flex", gap: 7, marginBottom: 18, overflowX: "auto" }}>
        {days.map((d) => (
          <button key={d} onClick={() => setDay(d)} style={{ flexShrink: 0, background: day === d ? C.sky : C.white, color: day === d ? C.white : C.textMid, border: `1.5px solid ${day === d ? C.sky : C.border}`, borderRadius: 12, padding: "9px 14px", fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>{d.slice(0, 3)}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {tt.map((t, i) => (
          <div key={i} style={{ background: t.col, borderRadius: 13, padding: "11px 13px", display: "flex", alignItems: "center", gap: 12, border: `1px solid ${t.tc}22` }}>
            <div style={{ width: 64, flexShrink: 0 }}><p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 9, fontWeight: 800, color: t.tc }}>{t.time}</p></div>
            <div style={{ width: 2, height: 34, background: t.tc, borderRadius: 2, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700, color: C.text }}>{t.sub}</p>
              <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 11, color: C.textMid }}>{t.teacher}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── NOTICES ─────────────────────────────────────────────────────────────────
export const AdminNotice = () => {
  const [sel, setSel] = useState(null);
  const pc = { high: C.red, medium: C.yellowDark, low: C.sky };
  if (sel) return (
    <div style={{ padding: "0 16px 20px" }}>
      <BackBtn onBack={() => setSel(null)} accentColor={C.yellowDark} lightColor={C.yellowLight} />
      <div style={{ background: C.white, borderRadius: 20, padding: 20, border: `1px solid ${C.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
        <Bdg lbl={sel.priority + " priority"} col={pc[sel.priority]} />
        <h2 style={{ margin: "10px 0 6px", fontFamily: "'Poppins',sans-serif", fontSize: 17, fontWeight: 800, color: C.text }}>{sel.title}</h2>
        <p style={{ margin: "0 0 14px", fontFamily: "'Nunito',sans-serif", fontSize: 11, color: C.textLight }}>{sel.date}</p>
        <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 13, color: C.textMid, lineHeight: 1.7 }}>{sel.body}</p>
      </div>
    </div>
  );
  return (
    <div style={{ padding: "0 16px 20px" }}>
      <div style={{ background: `linear-gradient(135deg,${C.yellowDark},${C.yellow})`, borderRadius: 20, padding: 18, marginBottom: 18 }}>
        <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 20, fontWeight: 900, color: C.navy }}>Notice Board</p>
        <p style={{ margin: "2px 0 0", fontFamily: "'Nunito',sans-serif", fontSize: 11, color: "rgba(0,0,0,0.55)" }}>School Announcements</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {NOTICES.map((n) => (
          <div key={n.id} onClick={() => setSel(n)} style={{ background: C.white, borderRadius: 16, padding: 16, border: `1px solid ${C.border}`, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderLeft: `4px solid ${pc[n.priority]}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <Bdg lbl={n.type} col={pc[n.priority]} />
              <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 10, color: C.textLight }}>{n.date}</span>
            </div>
            <p style={{ margin: "0 0 4px", fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 800, color: C.text }}>{n.title}</p>
            <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 11, color: C.textMid, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{n.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── SETTINGS ────────────────────────────────────────────────────────────────
export const AdminSettings = ({ user, onLogout }) => (
  <div style={{ padding: "0 16px 20px" }}>
    <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyMid})`, borderRadius: 20, padding: 22, marginBottom: 20, textAlign: "center" }}>
      <div style={{ width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
        <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 30, fontWeight: 900, color: C.yellow }}>E</span>
      </div>
      <h2 style={{ margin: "0 0 3px", fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 900, color: C.white }}>EL-OLAM INTERNATIONAL SCHOOL</h2>
      <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>"Home Away from Home"</p>
    </div>
    <div style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 14, border: `1px solid ${C.border}` }}>
      <p style={{ margin: "0 0 12px", fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 800, color: C.text }}>Admin Profile</p>
      {[{ l: "Name", v: user.name }, { l: "Email", v: user.email }, { l: "Role", v: "School Administrator" }, { l: "School", v: SCHOOL.name }, { l: "Term", v: `${SCHOOL.currentTerm} · ${SCHOOL.academicYear}` }].map((r) => (
        <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: C.textMid }}>{r.l}</span>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700, color: C.text, maxWidth: "55%", textAlign: "right" }}>{r.v}</span>
        </div>
      ))}
    </div>
    <div style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 14, border: `1px solid ${C.border}` }}>
      <p style={{ margin: "0 0 10px", fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 800, color: C.text }}>All Classes</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {CLASSES.map((c) => <Bdg key={c} lbl={c} col={C.sky} />)}
      </div>
    </div>
    <button onClick={onLogout} style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", cursor: "pointer", background: "#FFF0F0", fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 800, color: C.red, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
      <Ic n="logout" s={17} c={C.red} /> Sign Out
    </button>
  </div>
);

import { C, STUDENTS, NOTICES, TIMETABLE, SCORES, SUBJECTS6 } from "../data/constants";
import { Av, Bdg, Bar, SH, Ic } from "./UI";
import { getGrade, getAverage, formatGHS } from "../utils/helpers";
import { AdminTimetable, AdminNotice } from "./AdminDashboard";

export default function StudentDashboard({ user, subPage, onNav }) {
  // In production: fetch student data by user.id from API
  const me = STUDENTS[0]; // Demo: Amara Osei
  const sc = SCORES[me.av] || [70, 75, 80, 65, 72, 68];
  const avg = getAverage(sc);
  const grade = getGrade(avg);

  // ── MY GRADES ────────────────────────────────────────────────────────────
  if (subPage === "s-grades") return (
    <div style={{ padding: "0 16px 20px" }}>
      <div style={{ background: `linear-gradient(135deg,${C.green},${C.greenDark})`, borderRadius: 20, padding: 18, marginBottom: 16 }}>
        <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.8)" }}>End of Term 2 · My Report</p>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, fontFamily: "'Poppins',sans-serif", color: C.white }}>{grade}</div>
          <div>
            <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 22, fontWeight: 900, color: C.white }}>{avg}%</p>
            <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.75)" }}>Overall Average</p>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SUBJECTS6.map((sub, i) => (
          <div key={sub} style={{ background: C.white, borderRadius: 13, padding: "13px 15px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: C.text }}>{sub}</span>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 900, color: sc[i] >= 70 ? C.green : C.red }}>{sc[i]}%</span>
            </div>
            <Bar v={sc[i]} max={100} col={sc[i] >= 80 ? C.green : sc[i] >= 60 ? C.sky : C.red} />
            <p style={{ margin: "4px 0 0", fontFamily: "'Nunito',sans-serif", fontSize: 10, color: C.textLight }}>Grade: {getGrade(sc[i])}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // ── MY FEES ──────────────────────────────────────────────────────────────
  if (subPage === "s-fees") return (
    <div style={{ padding: "0 16px 20px" }}>
      <div style={{ background: `linear-gradient(135deg,${C.sky},${C.skyDark})`, borderRadius: 20, padding: 20, marginBottom: 16 }}>
        <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.8)" }}>My Fee Statement · Term 2</p>
        <p style={{ margin: "6px 0 2px", fontFamily: "'Poppins',sans-serif", fontSize: 26, fontWeight: 900, color: C.white }}>{formatGHS(me.fee)}</p>
        <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Total Term Fee</p>
      </div>
      {[
        { l: "Amount Paid",    v: formatGHS(me.paid),            c: C.green                               },
        { l: "Balance Due",    v: formatGHS(me.fee - me.paid),  c: me.fee - me.paid > 0 ? C.red : C.green },
        { l: "Status",         v: me.paid === me.fee ? "Fully Paid" : "Partial Payment", c: me.paid === me.fee ? C.green : C.orange },
      ].map((r) => (
        <div key={r.l} style={{ background: C.white, borderRadius: 13, padding: "13px 16px", marginBottom: 10, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: C.textMid }}>{r.l}</span>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 800, color: r.c }}>{r.v}</span>
        </div>
      ))}
      <div style={{ background: C.white, borderRadius: 13, padding: 16, border: `1px solid ${C.border}` }}>
        <p style={{ margin: "0 0 8px", fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700, color: C.text }}>Payment Progress</p>
        <Bar v={me.paid} max={me.fee} col={me.paid === me.fee ? C.green : C.sky} h={10} />
        <p style={{ margin: "5px 0 0", fontFamily: "'Nunito',sans-serif", fontSize: 11, color: C.textMid, textAlign: "right" }}>{Math.round((me.paid / me.fee) * 100)}% paid</p>
      </div>
    </div>
  );

  if (subPage === "s-timetable") return <AdminTimetable />;
  if (subPage === "s-notice")    return <AdminNotice />;

  // ── STUDENT HOME ─────────────────────────────────────────────────────────
  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ background: `linear-gradient(135deg,${C.greenDark} 0%,${C.green} 70%,#6EEAA8 100%)`, borderRadius: "0 0 28px 28px", padding: "18px 18px 26px", marginBottom: 18, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.75)" }}>Good Morning 🌟</p>
            <h1 style={{ margin: "1px 0 3px", fontFamily: "'Poppins',sans-serif", fontSize: 19, fontWeight: 900, color: C.white }}>{me.name}</h1>
            <div style={{ display: "inline-flex", gap: 5, background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "3px 10px", alignItems: "center" }}>
              <Ic n="book" s={10} c={C.white} />
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 10, fontWeight: 700, color: C.white }}>{me.class} · Roll {me.roll}</span>
            </div>
          </div>
          <Av init={user.avatar} sz={46} bg="rgba(255,255,255,0.25)" fc={C.white} />
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
          {[
            { v: `${me.att}%`,                              l: "Attendance" },
            { v: grade,                                      l: "My Grade"   },
            { v: me.paid === me.fee ? "Paid" : "Pending",   l: "Fees"       },
          ].map((s) => (
            <div key={s.l} style={{ flex: 1, background: "rgba(255,255,255,0.2)", borderRadius: 13, padding: "9px 10px", textAlign: "center" }}>
              <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 16, fontWeight: 900, color: C.white }}>{s.v}</p>
              <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 9, color: "rgba(255,255,255,0.7)" }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* Quick Access */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, marginBottom: 20 }}>
          {[
            { i: "trophy", l: "My Grades",  n: "s-grades",    bg: C.greenLight,  c: C.green      },
            { i: "fees",   l: "My Fees",    n: "s-fees",      bg: C.skyLight,    c: C.sky        },
            { i: "book",   l: "Timetable",  n: "s-timetable", bg: C.yellowLight, c: C.yellowDark  },
            { i: "notice", l: "Notices",    n: "s-notice",    bg: "#F0EEFF",     c: C.purple     },
          ].map((q) => (
            <button key={q.n} onClick={() => onNav(q.n)} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 15, padding: "16px 12px", display: "flex", alignItems: "center", gap: 11, cursor: "pointer", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: q.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ic n={q.i} s={20} c={q.c} /></div>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 800, color: C.text }}>{q.l}</span>
            </button>
          ))}
        </div>

        {/* Subjects preview */}
        <div style={{ background: C.white, borderRadius: 18, padding: 16, marginBottom: 18, border: `1px solid ${C.border}`, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <SH title="My Subjects" action="View All" onAction={() => onNav("s-grades")} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {SUBJECTS6.map((sub, i) => (
              <div key={sub} style={{ background: C.bg, borderRadius: 10, padding: "9px 8px", textAlign: "center" }}>
                <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 9, color: C.textLight }}>{sub}</p>
                <p style={{ margin: "3px 0 0", fontFamily: "'Poppins',sans-serif", fontSize: 17, fontWeight: 900, color: sc[i] >= 70 ? C.green : C.red }}>{sc[i]}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance ring */}
        <div style={{ background: C.white, borderRadius: 18, padding: 16, marginBottom: 18, border: `1px solid ${C.border}`, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <SH title="My Attendance" />
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: `conic-gradient(${C.green} ${me.att * 3.6}deg, ${C.border} 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 900, color: C.green }}>{me.att}%</span>
              </div>
            </div>
            <div>
              <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 900, color: me.att >= 90 ? C.green : me.att >= 75 ? C.yellowDark : C.red }}>
                {me.att >= 90 ? "Excellent" : me.att >= 75 ? "Good" : "Needs Improvement"}
              </p>
              <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 12, color: C.textMid }}>Attendance · Term 2, 2024</p>
            </div>
          </div>
        </div>

        {/* Notices */}
        <SH title="School Notices" action="View All" onAction={() => onNav("s-notice")} />
        {NOTICES.slice(0, 3).map((n) => (
          <div key={n.id} onClick={() => onNav("s-notice")} style={{ background: C.white, borderRadius: 13, padding: "12px 14px", marginBottom: 9, border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 11, borderLeft: `3px solid ${n.priority === "high" ? C.red : n.priority === "medium" ? C.yellow : C.sky}` }}>
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
}

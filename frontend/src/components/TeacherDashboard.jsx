import { C, STUDENTS, NOTICES, TIMETABLE, SCORES, SUBJECTS6 } from "../data/constants";
import { Av, Bdg, Bar, SH, Ic } from "./UI";
import { getGrade, getAverage } from "../utils/helpers";
import { AdminTimetable, AdminNotice } from "./AdminDashboard";

export default function TeacherDashboard({ user, subPage, onNav }) {
  const myStudents = STUDENTS.filter((s) => s.class === user.class);

  // ── MY CLASS ──────────────────────────────────────────────────────────────
  if (subPage === "t-students") return (
    <div style={{ padding: "0 16px 20px" }}>
      <SH title={`${user.class} · ${myStudents.length} Students`} />
      {myStudents.map((s) => (
        <div key={s.id} style={{ background: C.white, borderRadius: 14, padding: "13px 14px", marginBottom: 10, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <Av init={s.av} sz={44} bg={C.yellowDark} fc={C.white} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: C.text }}>{s.name}</p>
            <p style={{ margin: "2px 0 0", fontFamily: "'Nunito',sans-serif", fontSize: 11, color: C.textMid }}>{s.roll}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <Bdg lbl={`${s.att}%`} col={s.att >= 90 ? C.green : s.att >= 75 ? C.yellowDark : C.red} />
            <p style={{ margin: "4px 0 0", fontFamily: "'Nunito',sans-serif", fontSize: 10, color: C.textLight }}>attendance</p>
          </div>
        </div>
      ))}
    </div>
  );

  // ── GRADE ENTRY ──────────────────────────────────────────────────────────
  if (subPage === "t-grades") return (
    <div style={{ padding: "0 16px 20px" }}>
      <div style={{ background: `linear-gradient(135deg,${C.green},${C.greenDark})`, borderRadius: 20, padding: 18, marginBottom: 18 }}>
        <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 17, fontWeight: 800, color: C.white }}>Grade Entry</p>
        <p style={{ margin: "2px 0 0", fontFamily: "'Nunito',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.75)" }}>{user.class} · Term 2, 2024</p>
      </div>
      {myStudents.map((s) => {
        const sc = SCORES[s.av] || [70, 75, 80, 65, 72, 68];
        const avg = getAverage(sc);
        const grade = getGrade(avg);
        return (
          <div key={s.id} style={{ background: C.white, borderRadius: 14, padding: 14, marginBottom: 11, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Av init={s.av} sz={36} bg={C.green} fc={C.white} fs={12} />
                <div>
                  <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700, color: C.text }}>{s.name}</p>
                  <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 10, color: C.textLight }}>Avg: {avg}%</p>
                </div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: avg >= 80 ? C.greenLight : avg >= 70 ? C.yellowLight : "#FFF0F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, fontFamily: "'Poppins',sans-serif", color: avg >= 80 ? C.green : avg >= 70 ? C.yellowDark : C.red }}>{grade}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 5 }}>
              {SUBJECTS6.map((sub, i) => (
                <div key={sub} style={{ background: C.bg, borderRadius: 7, padding: "5px 7px" }}>
                  <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 9, color: C.textLight }}>{sub}</p>
                  <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 700, color: (sc[i] || 70) >= 70 ? C.text : C.red }}>{sc[i] || 70}%</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (subPage === "t-timetable") return <AdminTimetable />;
  if (subPage === "t-notice")    return <AdminNotice />;

  // ── TEACHER HOME ─────────────────────────────────────────────────────────
  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ background: `linear-gradient(135deg,${C.yellowDark} 0%,${C.yellow} 70%,#FFE87A 100%)`, borderRadius: "0 0 28px 28px", padding: "18px 18px 26px", marginBottom: 18, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 12, color: "rgba(0,0,0,0.55)" }}>Welcome back 👋</p>
            <h1 style={{ margin: "1px 0 3px", fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 900, color: C.navy }}>{user.name}</h1>
            <div style={{ display: "inline-flex", gap: 5, background: "rgba(255,255,255,0.35)", borderRadius: 20, padding: "3px 10px", alignItems: "center" }}>
              <Ic n="book" s={10} c={C.navy} />
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 10, fontWeight: 700, color: C.navy }}>{user.class} · {user.subject}</span>
            </div>
          </div>
          <Av init={user.avatar} sz={46} bg="rgba(255,255,255,0.35)" fc={C.navy} />
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 9 }}>
          {[{ v: myStudents.length, l: "My Students" }, { v: "92%", l: "Attendance" }, { v: "Term 2", l: "Current Term" }].map((s) => (
            <div key={s.l} style={{ flex: 1, background: "rgba(255,255,255,0.3)", borderRadius: 13, padding: "9px 10px", textAlign: "center" }}>
              <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 16, fontWeight: 900, color: C.navy }}>{s.v}</p>
              <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 9, color: "rgba(0,0,0,0.5)" }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, marginBottom: 20 }}>
          {[
            { i: "users",   l: "My Class",  n: "t-students", bg: C.skyLight,    c: C.sky       },
            { i: "trophy",  l: "Grades",    n: "t-grades",   bg: C.greenLight,  c: C.green     },
            { i: "book",    l: "Timetable", n: "t-timetable",bg: C.yellowLight, c: C.yellowDark },
            { i: "notice",  l: "Notices",   n: "t-notice",   bg: "#F0EEFF",     c: C.purple    },
          ].map((q) => (
            <button key={q.n} onClick={() => onNav(q.n)} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 15, padding: "16px 12px", display: "flex", alignItems: "center", gap: 11, cursor: "pointer", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: q.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ic n={q.i} s={20} c={q.c} /></div>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 800, color: C.text }}>{q.l}</span>
            </button>
          ))}
        </div>

        <SH title="My Students" action="View All" onAction={() => onNav("t-students")} />
        {myStudents.slice(0, 4).map((s) => (
          <div key={s.id} style={{ background: C.white, borderRadius: 13, padding: "11px 13px", marginBottom: 9, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 11 }}>
            <Av init={s.av} sz={40} bg={C.yellowDark} fc={C.white} fs={13} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700, color: C.text }}>{s.name}</p>
              <Bar v={s.att} max={100} col={s.att >= 90 ? C.green : s.att >= 75 ? C.yellowDark : C.red} h={5} />
            </div>
            <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 900, color: s.att >= 90 ? C.green : s.att >= 75 ? C.yellowDark : C.red }}>{s.att}%</span>
          </div>
        ))}

        <div style={{ marginTop: 16 }}>
          <SH title="Today's Schedule" />
          {(TIMETABLE["Monday"] || []).slice(0, 4).map((t, i) => (
            <div key={i} style={{ background: t.col, borderRadius: 12, padding: "10px 13px", marginBottom: 8, display: "flex", alignItems: "center", gap: 11 }}>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 9, fontWeight: 800, color: t.tc, width: 68, flexShrink: 0 }}>{t.time}</span>
              <div style={{ width: 2, height: 30, background: t.tc, borderRadius: 2, flexShrink: 0 }} />
              <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700, color: C.text }}>{t.sub}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <SH title="Latest Notices" />
          {NOTICES.slice(0, 3).map((n) => (
            <div key={n.id} onClick={() => onNav("t-notice")} style={{ background: C.white, borderRadius: 13, padding: "12px 14px", marginBottom: 9, border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 11, borderLeft: `3px solid ${n.priority === "high" ? C.red : n.priority === "medium" ? C.yellow : C.sky}` }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 12, fontWeight: 700, color: C.text }}>{n.title}</p>
                <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 10, color: C.textLight }}>{n.date}</p>
              </div>
              <Ic n="arrow" s={14} c={C.textLight} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

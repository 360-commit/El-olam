import { useState, useEffect } from "react";
import { C } from "./data/constants";
import { Ic } from "./components/UI";
import LoginScreen from "./components/Login";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import {
  AdminHome, AdminStudents, AdminTeachers, AdminFees,
  AdminAttend, AdminResults, AdminTimetable, AdminNotice, AdminSettings,
} from "./components/AdminDashboard";

/* ─── GLOBAL STYLES ───────────────────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @keyframes spin    { to { transform: rotate(360deg); } }
    @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes slideIn { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    ::-webkit-scrollbar { width: 0; height: 0; }
    body { margin: 0; background: #0B2640; font-family: 'Poppins', sans-serif; }
  `}</style>
);

/* ─── NAV CONFIGS ─────────────────────────────────────────────────────────── */
const ADMIN_NAV = [
  { key: "home",     icon: "home",    label: "Home"     },
  { key: "students", icon: "users",   label: "Students" },
  { key: "fees",     icon: "fees",    label: "Fees"     },
  { key: "attend",   icon: "cal",     label: "Attend"   },
  { key: "settings", icon: "settings",label: "Profile"  },
];
const TEACHER_NAV = [
  { key: "home",        icon: "home",    label: "Home"      },
  { key: "t-students",  icon: "users",   label: "My Class"  },
  { key: "t-grades",    icon: "trophy",  label: "Grades"    },
  { key: "t-timetable", icon: "book",    label: "Timetable" },
  { key: "t-notice",    icon: "notice",  label: "Notices"   },
];
const STUDENT_NAV = [
  { key: "home",        icon: "home",   label: "Home"      },
  { key: "s-grades",    icon: "trophy", label: "Grades"    },
  { key: "s-fees",      icon: "fees",   label: "My Fees"   },
  { key: "s-timetable", icon: "book",   label: "Timetable" },
  { key: "s-notice",    icon: "notice", label: "Notices"   },
];

const PAGE_TITLES = {
  home: "Dashboard", students: "Students", teachers: "Teachers",
  fees: "Fee Management", attend: "Attendance", results: "Academic Results",
  timetable: "Timetable", notice: "Notice Board", settings: "Profile & Settings",
  "t-students": "My Class", "t-grades": "Grade Entry",
  "t-timetable": "Timetable", "t-notice": "Notices",
  "s-grades": "My Grades", "s-fees": "My Fees",
  "s-timetable": "Timetable", "s-notice": "Notices",
};

/* ─── ROLE APP ────────────────────────────────────────────────────────────── */
function RoleApp({ user, onLogout }) {
  const [page, setPage] = useState("home");

  const accentColor =
    user.role === "admin"   ? C.sky       :
    user.role === "teacher" ? C.yellowDark : C.green;

  const nav =
    user.role === "admin"   ? ADMIN_NAV   :
    user.role === "teacher" ? TEACHER_NAV : STUDENT_NAV;

  const renderPage = () => {
    if (user.role === "admin") {
      if (page === "home")      return <AdminHome user={user} onNav={setPage} />;
      if (page === "students")  return <AdminStudents />;
      if (page === "teachers")  return <AdminTeachers />;
      if (page === "fees")      return <AdminFees />;
      if (page === "attend")    return <AdminAttend />;
      if (page === "results")   return <AdminResults />;
      if (page === "timetable") return <AdminTimetable />;
      if (page === "notice")    return <AdminNotice />;
      if (page === "settings")  return <AdminSettings user={user} onLogout={onLogout} />;
    }
    if (user.role === "teacher") {
      return <TeacherDashboard user={user} subPage={page} onNav={setPage} />;
    }
    if (user.role === "student") {
      return <StudentDashboard user={user} subPage={page} onNav={setPage} />;
    }
    return null;
  };

  const isHome = page === "home";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C.bg, position: "relative" }}>
      {/* Top bar (sub-pages only) */}
      {!isHome && (
        <div style={{ background: C.white, padding: "12px 16px 10px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 11, flexShrink: 0, zIndex: 10 }}>
          <button onClick={() => setPage("home")} style={{ width: 34, height: 34, borderRadius: 10, background: C.bg, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic n="back" s={15} c={accentColor} />
          </button>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 800, color: C.text, flex: 1 }}>
            {PAGE_TITLES[page] || "Page"}
          </span>
          <button onClick={() => setPage(user.role === "admin" ? "notice" : user.role === "teacher" ? "t-notice" : "s-notice")}
            style={{ width: 34, height: 34, borderRadius: 10, background: C.bg, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <Ic n="bell" s={17} c={C.textMid} />
            <div style={{ position: "absolute", top: 5, right: 5, width: 8, height: 8, borderRadius: "50%", background: C.red }} />
          </button>
        </div>
      )}

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {renderPage()}
      </div>

      {/* Bottom Nav */}
      <div style={{ background: C.white, borderTop: `1px solid ${C.border}`, display: "flex", flexShrink: 0, boxShadow: "0 -3px 16px rgba(0,0,0,0.07)", zIndex: 20 }}>
        {nav.map((n) => {
          const active = page === n.key;
          return (
            <button key={n.key} onClick={() => setPage(n.key)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "9px 0 7px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ width: 34, height: 34, borderRadius: 11, background: active ? accentColor : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>
                <Ic n={n.icon} s={18} c={active ? C.white : C.textLight} />
              </div>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 9, fontWeight: active ? 800 : 500, color: active ? accentColor : C.textLight }}>
                {n.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── PHONE FRAME ─────────────────────────────────────────────────────────── */
function PhoneFrame({ children }) {
  return (
    <div style={{
      width: 375,
      borderRadius: 50,
      border: "10px solid #1A1A2E",
      boxShadow: "0 0 0 2px #333350, 0 40px 100px rgba(0,0,0,0.55), inset 0 0 0 1px #444",
      background: "#1A1A2E",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      maxHeight: "88vh",
    }}>
      {/* Status Bar */}
      <div style={{ background: "#1A1A2E", padding: "12px 28px 6px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: C.white, fontSize: 12, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>9:41</span>
        <div style={{ width: 90, height: 26, borderRadius: 20, background: "#111", border: "2px solid #333", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2A2A3E" }} />
        </div>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
            {[3, 5, 7, 9].map((h, i) => (
              <div key={i} style={{ width: 3, height: h, background: C.white, borderRadius: 1 }} />
            ))}
          </div>
          <div style={{ width: 14, height: 9, border: `2px solid ${C.white}`, borderRadius: 3, position: "relative" }}>
            <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 2, height: 4, background: C.white, borderRadius: 1 }} />
            <div style={{ position: "absolute", left: 1, top: 1, bottom: 1, width: "70%", background: C.white, borderRadius: 1 }} />
          </div>
        </div>
      </div>

      {/* Screen Content */}
      <div style={{ flex: 1, background: C.bg, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
        {children}
      </div>

      {/* Home Bar */}
      <div style={{ background: "#1A1A2E", padding: "8px 0 14px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: 100, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.3)" }} />
      </div>
    </div>
  );
}

/* ─── ROOT APP ────────────────────────────────────────────────────────────── */
export default function App() {
  const [user, setUser]       = useState(null);
  const [screen, setScreen]   = useState("login");
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap";
    link.rel  = "stylesheet";
    document.head.appendChild(link);
    link.onload = () => setFontsReady(true);
    setTimeout(() => setFontsReady(true), 800); // fallback
  }, []);

  const handleLogin  = (u) => { setUser(u);   setScreen("app");   };
  const handleLogout = ()  => { setUser(null); setScreen("login"); };

  const accentColor =
    !user            ? C.sky       :
    user.role === "admin"   ? C.sky       :
    user.role === "teacher" ? C.yellowDark : C.green;

  if (!fontsReady) {
    return (
      <>
        <GlobalStyle />
        <div style={{ minHeight: "100vh", background: "#0B2640", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: `linear-gradient(135deg,${C.sky},${C.skyDark})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: C.yellow, fontSize: 28, fontWeight: 900, fontFamily: "sans-serif" }}>E</span>
          </div>
          <div style={{ width: 20, height: 20, borderRadius: "50%", border: `3px solid rgba(255,255,255,0.2)`, borderTopColor: C.sky, animation: "spin 0.8s linear infinite" }} />
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0D1B2A 0%,#1A2E45 50%,#0D2B40 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "28px 20px 40px",
        fontFamily: "'Poppins',sans-serif",
      }}>
        {/* Top label */}
        <div style={{ marginBottom: 20, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "7px 16px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, fontWeight: 600, letterSpacing: "0.4px" }}>
              EL-OLAM INTERNATIONAL SCHOOL · School Management App
            </span>
          </div>
        </div>

        {/* Role hint pills */}
        {screen === "login" && (
          <div style={{ marginBottom: 18, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            {[{ r: "Admin", c: C.sky }, { r: "Teacher", c: C.yellowDark }, { r: "Student", c: C.green }].map(({ r, c }) => (
              <div key={r} style={{ background: `${c}22`, border: `1px solid ${c}44`, borderRadius: 20, padding: "4px 13px", color: c, fontFamily: "'Poppins',sans-serif", fontSize: 10, fontWeight: 700 }}>{r}</div>
            ))}
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, marginLeft: 2 }}>← select role to log in</span>
          </div>
        )}

        {/* Phone Emulator */}
        <PhoneFrame>
          {screen === "login"
            ? <LoginScreen onLogin={handleLogin} />
            : <RoleApp user={user} onLogout={handleLogout} />
          }
        </PhoneFrame>

        {/* Footer info */}
        <div style={{ marginTop: 22, textAlign: "center" }}>
          {user ? (
            <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: accentColor }} />
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>
                Signed in as <b style={{ color: "rgba(255,255,255,0.75)" }}>{user.name}</b> · {user.role}
              </span>
              <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "4px 11px", color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>
                Switch Role
              </button>
            </div>
          ) : (
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>Select a role and sign in to explore the app</span>
          )}
        </div>
      </div>
    </>
  );
}

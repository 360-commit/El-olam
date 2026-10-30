import { useState } from "react";
import { C, DEMO_USERS } from "../data/constants";
import { Ic } from "./UI";

export default function LoginScreen({ onLogin }) {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const HINTS = {
    admin:   { email: "admin@elolam.edu.gh",   pass: "admin123"   },
    teacher: { email: "grace@elolam.edu.gh",   pass: "teacher123" },
    student: { email: "amara@elolam.edu.gh",   pass: "student123" },
  };

  const selectRole = (r) => {
    setRole(r); setErr("");
    setEmail(HINTS[r].email);
    setPass(HINTS[r].pass);
  };

  const doLogin = () => {
    setErr("");
    // TODO: Replace with real API call: POST /api/auth/login { email, password, role }
    const user = Object.values(DEMO_USERS).find(
      (u) => u.email === email && u.pass === pass && u.role === role
    );
    if (!user) { setErr("Invalid credentials. Please check your email & password."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(user); }, 1200);
  };

  const roleCards = [
    { key: "admin",   label: "Admin",   sub: "Full access",         bg: `linear-gradient(135deg,${C.skyDark},${C.sky})`,     icon: "settings" },
    { key: "teacher", label: "Teacher", sub: "Class management",    bg: `linear-gradient(135deg,${C.yellowDark},${C.yellow})`, icon: "teacher"  },
    { key: "student", label: "Student", sub: "My profile & grades", bg: `linear-gradient(135deg,${C.greenDark},${C.green})`,   icon: "book"     },
  ];

  return (
    <div style={{
      minHeight: "100%", display: "flex", flexDirection: "column", overflowY: "auto",
      background: `linear-gradient(160deg,${C.navy} 0%,${C.navyMid} 55%,${C.skyDark} 100%)`,
    }}>
      {/* School Header */}
      <div style={{ padding: "40px 24px 24px", textAlign: "center" }}>
        <div style={{
          width: 72, height: 72, borderRadius: 22, margin: "0 auto 14px",
          background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 34, fontWeight: 900, fontFamily: "'Poppins',sans-serif", color: C.yellow }}>E</span>
        </div>
        <h1 style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 17, fontWeight: 900, color: C.white, letterSpacing: "0.5px" }}>
          EL-OLAM INTERNATIONAL
        </h1>
        <p style={{ margin: "3px 0 0", fontFamily: "'Nunito',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>
          "Home Away from Home"
        </p>
      </div>

      {/* White Login Card */}
      <div style={{
        flex: 1, background: C.white, borderRadius: "28px 28px 0 0",
        padding: "28px 20px 32px", display: "flex", flexDirection: "column",
      }}>
        <h2 style={{ margin: "0 0 4px", fontFamily: "'Poppins',sans-serif", fontSize: 20, fontWeight: 900, color: C.text }}>
          Welcome Back 👋
        </h2>
        <p style={{ margin: "0 0 22px", fontFamily: "'Nunito',sans-serif", fontSize: 13, color: C.textMid }}>
          Select your role to continue
        </p>

        {/* Role Selector */}
        <div style={{ display: "flex", gap: 9, marginBottom: 22 }}>
          {roleCards.map((r) => (
            <button key={r.key} onClick={() => selectRole(r.key)} style={{
              flex: 1, border: `2px solid ${role === r.key ? "transparent" : C.border}`,
              borderRadius: 16, padding: "11px 6px", cursor: "pointer", textAlign: "center",
              background: role === r.key ? r.bg : C.white,
              boxShadow: role === r.key ? "0 6px 20px rgba(0,0,0,0.18)" : "none",
              transition: "all 0.2s",
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, margin: "0 auto 6px",
                background: role === r.key ? "rgba(255,255,255,0.25)" : C.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Ic n={r.icon} s={17} c={role === r.key ? C.white : C.textMid} />
              </div>
              <p style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 800, color: role === r.key ? C.white : C.text }}>{r.label}</p>
              <p style={{ margin: 0, fontFamily: "'Nunito',sans-serif", fontSize: 9, color: role === r.key ? "rgba(255,255,255,0.75)" : C.textLight }}>{r.sub}</p>
            </button>
          ))}
        </div>

        {role && (
          <div>
            {/* Demo hint */}
            <div style={{ background: C.bg, borderRadius: 10, padding: "8px 12px", marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
              <Ic n="check" s={14} c={C.green} />
              <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: C.textMid }}>
                Demo credentials pre-filled · just tap <b>Sign In</b>
              </span>
            </div>

            {/* Email */}
            <label style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700, color: C.textMid, display: "block", marginBottom: 6 }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }}>
                <Ic n="mail" s={16} c={C.textLight} />
              </div>
              <input value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "13px 13px 13px 40px", border: `1.5px solid ${C.border}`, borderRadius: 13, fontFamily: "'Nunito',sans-serif", fontSize: 13, color: C.text, outline: "none" }} />
            </div>

            {/* Password */}
            <label style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700, color: C.textMid, display: "block", marginBottom: 6 }}>
              PASSWORD
            </label>
            <div style={{ position: "relative", marginBottom: err ? 12 : 20 }}>
              <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }}>
                <Ic n="lock" s={16} c={C.textLight} />
              </div>
              <input value={pass} onChange={(e) => setPass(e.target.value)} type={showPass ? "text" : "password"}
                style={{ width: "100%", padding: "13px 44px 13px 40px", border: `1.5px solid ${C.border}`, borderRadius: 13, fontFamily: "'Nunito',sans-serif", fontSize: 13, color: C.text, outline: "none" }} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <Ic n={showPass ? "eyeoff" : "eye"} s={17} c={C.textLight} />
              </button>
            </div>

            {err && (
              <div style={{ background: "#FFF0F0", border: "1px solid #FFCCCC", borderRadius: 10, padding: "9px 12px", marginBottom: 14, fontFamily: "'Nunito',sans-serif", fontSize: 12, color: C.red }}>
                {err}
              </div>
            )}

            <button onClick={doLogin} style={{
              width: "100%", padding: "15px", borderRadius: 14, border: "none", cursor: "pointer",
              background: `linear-gradient(135deg,${C.skyDark},${C.sky})`,
              fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 800, color: C.white,
              boxShadow: `0 8px 24px ${C.sky}55`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {loading
                ? <div style={{ width: 20, height: 20, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.3)", borderTopColor: C.white, animation: "spin 0.8s linear infinite" }} />
                : <>Sign In <Ic n="arrow" s={17} c={C.white} /></>
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

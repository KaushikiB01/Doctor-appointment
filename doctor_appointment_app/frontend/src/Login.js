import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "./api";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const persistSession = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setIsLoggedIn(true);
  };

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isRegister) {
        if (!name.trim() || !email.trim() || !password.trim()) {
          setLoading(false);
          return alert("Please fill all fields");
        }
        const res = await axios.post(`${API_URL}/register`, {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim(),
        });
        persistSession(res.data);
      } else {
        if (!email.trim() || !password.trim()) { setLoading(false); return alert("Please fill all fields"); }
        const res = await axios.post(`${API_URL}/login`, {
          email: email.trim().toLowerCase(),
          password: password.trim(),
        });
        persistSession(res.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || "An error occurred");
    }
    setLoading(false);
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setName(""); setEmail(""); setPassword("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--surface-0)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Grid bg */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }}/>

      {/* Ambient glow */}
      <div style={{
        position: "fixed",
        top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }}/>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 420, position: "relative", zIndex: 1,
        background: "var(--surface-1)",
        border: "1px solid var(--border-muted)",
        borderRadius: 24,
        padding: 36,
        boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(34,211,238,0.06)",
        animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}>

        {/* Logo mark */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px",
            background: "linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 40px rgba(34,211,238,0.35)",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28, margin: "0 0 6px",
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}>
            Medi<span style={{ color: "var(--accent-cyan)" }}>Slot</span>
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)" }}>
            {isRegister ? "Create your patient account" : "Sign in to your account"}
          </p>
        </div>

        {/* Toggle tabs */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          background: "var(--surface-0)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 10, padding: 4, marginBottom: 24,
        }}>
          {[{ label: "Sign In", val: false }, { label: "Register", val: true }].map(({ label, val }) => (
            <button key={label} onClick={() => { setIsRegister(val); setName(""); setEmail(""); setPassword(""); }}
              style={{
                padding: "8px 0",
                borderRadius: 8, border: "none", cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
                fontSize: 13, fontWeight: 600,
                transition: "all 0.15s",
                background: isRegister === val ? "var(--surface-3)" : "transparent",
                color: isRegister === val ? "var(--text-primary)" : "var(--text-tertiary)",
                borderColor: isRegister === val ? "var(--border-muted)" : "transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {isRegister && (
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 8 }}>
                Full Name
              </label>
              <input type="text" placeholder="e.g. John Doe" value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                style={{
                  width: "100%", background: "var(--surface-0)",
                  border: "1px solid var(--border-muted)", borderRadius: 10,
                  padding: "11px 14px", color: "var(--text-primary)",
                  fontFamily: "DM Sans, sans-serif", fontSize: 14,
                  outline: "none", boxSizing: "border-box", transition: "all 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--accent-cyan)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-cyan-dim)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--border-muted)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 8 }}>
              Email Address
            </label>
            <input type="email" placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              style={{
                width: "100%", background: "var(--surface-0)",
                border: "1px solid var(--border-muted)", borderRadius: 10,
                padding: "11px 14px", color: "var(--text-primary)",
                fontFamily: "DM Sans, sans-serif", fontSize: 14,
                outline: "none", boxSizing: "border-box", transition: "all 0.2s",
              }}
              onFocus={(e) => { e.target.style.borderColor = "var(--accent-cyan)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-cyan-dim)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--border-muted)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 8 }}>
              Password
            </label>
            <input type="password" placeholder="••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              style={{
                width: "100%", background: "var(--surface-0)",
                border: "1px solid var(--border-muted)", borderRadius: 10,
                padding: "11px 14px", color: "var(--text-primary)",
                fontFamily: "DM Sans, sans-serif", fontSize: 14,
                outline: "none", boxSizing: "border-box", transition: "all 0.2s",
              }}
              onFocus={(e) => { e.target.style.borderColor = "var(--accent-cyan)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-cyan-dim)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--border-muted)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <button
            onClick={handleAuth}
            disabled={loading}
            style={{
              marginTop: 8,
              width: "100%", padding: "13px 0",
              background: "linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%)",
              color: "#fff", fontWeight: 700, fontSize: 15,
              border: "none", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "DM Sans, sans-serif",
              letterSpacing: "-0.01em",
              opacity: loading ? 0.75 : 1,
              transition: "all 0.2s",
              boxShadow: "0 4px 20px rgba(14,165,233,0.3)",
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.boxShadow = "0 6px 28px rgba(14,165,233,0.45)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(14,165,233,0.3)"; }}
          >
            {loading ? "Please wait…" : (isRegister ? "Create Account" : "Sign In")}
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }}/>
          <span style={{ fontSize: 12, color: "var(--text-tertiary)", fontWeight: 500 }}>or</span>
          <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }}/>
        </div>

        <button onClick={switchMode} style={{
          width: "100%", padding: "11px 0",
          background: "var(--surface-0)",
          border: "1px solid var(--border-muted)",
          borderRadius: 10, cursor: "pointer",
          fontFamily: "DM Sans, sans-serif",
          fontSize: 14, fontWeight: 600, color: "var(--text-secondary)",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.color = "var(--text-primary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-muted)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          {isRegister ? "Already have an account? Sign In" : "New here? Create Account"}
        </button>
      </div>
    </div>
  );
}

export default Login;
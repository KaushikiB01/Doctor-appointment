import React from "react";

const Icon = {
  User: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Mail: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Badge: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
};

const PatientProfile = ({ currentUser }) => {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 28px 80px", position: "relative", zIndex: 1 }}>
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 42, margin: "0 0 12px", color: "var(--text-primary)" }}>
          My Profile
        </h1>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 16 }}>
          Manage your account details and view your information.
        </p>
      </div>

      <div className="card-glass" style={{
        padding: "40px", display: "flex", flexDirection: "column", gap: 32,
        alignItems: "center", textAlign: "center"
      }}>
        {/* Avatar */}
        <div style={{
          width: 96, height: 96, borderRadius: "50%",
          background: "var(--grad-cta)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 40, fontWeight: 700,
          boxShadow: "0 10px 30px rgba(34,211,238,0.3)"
        }}>
          {currentUser?.name?.charAt(0).toUpperCase()}
        </div>

        {/* Info Grid */}
        <div style={{ width: "100%", textAlign: "left", display: "grid", gap: 24, marginTop: 10 }}>
          
          <div style={{
            background: "var(--surface-3)", padding: "16px 20px", borderRadius: 12,
            border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 16
          }}>
            <div style={{ color: "var(--accent-cyan)", background: "var(--accent-cyan-dim)", padding: 10, borderRadius: 10 }}>
              <Icon.User />
            </div>
            <div>
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-tertiary)", fontWeight: 700, marginBottom: 4 }}>Full Name</div>
              <div style={{ fontSize: 18, color: "var(--text-primary)", fontWeight: 600 }}>{currentUser.name}</div>
            </div>
          </div>

          <div style={{
            background: "var(--surface-3)", padding: "16px 20px", borderRadius: 12,
            border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 16
          }}>
            <div style={{ color: "var(--accent-emerald)", background: "rgba(16,185,129,0.15)", padding: 10, borderRadius: 10 }}>
              <Icon.Mail />
            </div>
            <div>
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-tertiary)", fontWeight: 700, marginBottom: 4 }}>Email Address</div>
              <div style={{ fontSize: 18, color: "var(--text-primary)", fontWeight: 600 }}>{currentUser.email}</div>
            </div>
          </div>

          <div style={{
            background: "var(--surface-3)", padding: "16px 20px", borderRadius: 12,
            border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 16
          }}>
            <div style={{ color: "var(--accent-amber)", background: "rgba(245,158,11,0.15)", padding: 10, borderRadius: 10 }}>
              <Icon.Badge />
            </div>
            <div>
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-tertiary)", fontWeight: 700, marginBottom: 4 }}>Account Role</div>
              <div style={{ fontSize: 18, color: "var(--text-primary)", fontWeight: 600, textTransform: "capitalize" }}>{currentUser.role}</div>
            </div>
          </div>

        </div>

        <div style={{ marginTop: 20, fontSize: 14, color: "var(--text-tertiary)" }}>
          More profile settings coming soon.
        </div>
      </div>
    </main>
  );
};

export default PatientProfile;

function DoctorCard({ doctor, onDelete, onEdit, onToggle, onBook, currentUser }) {
  const palettes = [
    { from: "#0ea5e9", to: "#22d3ee" },
    { from: "#8b5cf6", to: "#a78bfa" },
    { from: "#10b981", to: "#34d399" },
    { from: "#f59e0b", to: "#fbbf24" },
    { from: "#ec4899", to: "#f472b6" },
  ];

  const getPalette = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return palettes[Math.abs(hash) % palettes.length];
  };

  const palette = getPalette(doctor.name || "D");
  const initial = (doctor.name || "D").charAt(0).toUpperCase();
  const isAdmin = currentUser?.role === "admin";

  return (
    <div style={{
      background: "var(--surface-2)",
      border: "1px solid var(--border-subtle)",
      borderRadius: 18,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
      position: "relative",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.borderColor = "var(--border-muted)";
      e.currentTarget.style.boxShadow = `0 8px 40px rgba(0,0,0,0.4), 0 0 30px rgba(${palette.from === "#0ea5e9" ? "14,165,233" : "34,211,238"},0.08)`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "";
      e.currentTarget.style.borderColor = "var(--border-subtle)";
      e.currentTarget.style.boxShadow = "";
    }}>

      {/* Top gradient bar */}
      <div style={{
        height: 3,
        background: `linear-gradient(90deg, ${palette.from}, ${palette.to})`,
        flexShrink: 0,
      }}/>

      {/* Card body */}
      <div style={{ padding: "20px 20px 0", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          {/* Avatar */}
          <div style={{
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            background: `linear-gradient(135deg, ${palette.from}22, ${palette.to}22)`,
            border: `1px solid ${palette.from}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 700,
            color: palette.from,
            letterSpacing: "-0.01em",
          }}>
            {initial}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              margin: 0, fontSize: 16, fontWeight: 700,
              color: "var(--text-primary)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              letterSpacing: "-0.01em",
            }}>
              {doctor.name}
            </h3>
            <p style={{
              margin: "3px 0 0", fontSize: 13,
              color: "var(--text-secondary)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {doctor.specialization}
            </p>
          </div>

          {/* Availability dot */}
          <div style={{ flexShrink: 0 }}>
            {doctor.available ? (
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: 20, padding: "3px 9px",
                fontSize: 10, fontWeight: 700,
                color: "var(--accent-emerald)",
                letterSpacing: "0.05em", textTransform: "uppercase",
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "var(--accent-emerald)",
                  boxShadow: "0 0 6px rgba(16,185,129,0.7)",
                  animation: "pulse 2s ease infinite",
                }}/>
                Available
              </div>
            ) : (
              <div style={{
                background: "rgba(244,63,94,0.08)",
                border: "1px solid rgba(244,63,94,0.2)",
                borderRadius: 20, padding: "3px 9px",
                fontSize: 10, fontWeight: 700,
                color: "var(--accent-rose)",
                letterSpacing: "0.05em", textTransform: "uppercase",
              }}>
                Unavailable
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1px 1fr",
          background: "var(--surface-3)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 10, marginBottom: 14, overflow: "hidden",
        }}>
          <div style={{ padding: "10px 14px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 3 }}>
              Fee
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              ₹{doctor.fees || 0}
            </div>
          </div>

          <div style={{ background: "var(--border-subtle)" }}/>

          <div style={{ padding: "10px 14px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 5 }}>
              Schedule
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {doctor.availableDays && doctor.availableDays.length > 0 ? (
                doctor.availableDays.slice(0, 4).map((day) => (
                  <span key={day} style={{
                    background: "var(--surface-4)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 5,
                    padding: "1px 6px",
                    fontSize: 9, fontWeight: 700,
                    color: "var(--text-secondary)",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                  }}>
                    {day}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: 12, color: "var(--text-tertiary)", fontStyle: "italic" }}>TBD</span>
              )}
              {doctor.availableDays?.length > 4 && (
                <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text-tertiary)", padding: "1px 0" }}>
                  +{doctor.availableDays.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}/>

        {/* Actions */}
        <div style={{ padding: "14px 0", borderTop: "1px solid var(--border-subtle)" }}>
          {currentUser?.role === "patient" && (
            <button
              onClick={() => onBook(doctor)}
              disabled={!doctor.available}
              style={{
                width: "100%",
                padding: "11px 0",
                borderRadius: 10,
                border: "none",
                cursor: doctor.available ? "pointer" : "not-allowed",
                fontFamily: "DM Sans, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                transition: "all 0.2s ease",
                background: doctor.available
                  ? `linear-gradient(135deg, ${palette.from}, ${palette.to})`
                  : "var(--surface-3)",
                color: doctor.available ? "#fff" : "var(--text-tertiary)",
                boxShadow: doctor.available
                  ? `0 4px 16px ${palette.from}33`
                  : "none",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => {
                if (doctor.available) e.currentTarget.style.opacity = "0.88";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {doctor.available ? "Book Appointment" : "Currently Unavailable"}
            </button>
          )}

          {isAdmin && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={() => onToggle(doctor._id)}
                style={{
                  width: "100%", padding: "10px 0",
                  background: "var(--surface-3)",
                  border: "1px solid var(--border-muted)",
                  borderRadius: 10,
                  color: "var(--text-secondary)",
                  fontSize: 13, fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                  transition: "all 0.15s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-4)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--surface-3)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Toggle Availability
              </button>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button
                  onClick={() => onEdit(doctor)}
                  style={{
                    padding: "9px 0",
                    background: "rgba(14,165,233,0.08)",
                    border: "1px solid rgba(14,165,233,0.2)",
                    borderRadius: 8,
                    color: "#38bdf8",
                    fontSize: 13, fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "DM Sans, sans-serif",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(14,165,233,0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(14,165,233,0.08)"; }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Remove Dr. ${doctor.name}?`)) onDelete(doctor._id);
                  }}
                  style={{
                    padding: "9px 0",
                    background: "rgba(244,63,94,0.08)",
                    border: "1px solid rgba(244,63,94,0.2)",
                    borderRadius: 8,
                    color: "var(--accent-rose)",
                    fontSize: 13, fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "DM Sans, sans-serif",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244,63,94,0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(244,63,94,0.08)"; }}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorCard;
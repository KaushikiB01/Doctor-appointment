import React from "react";
import DoctorCard from "./DoctorCard";

const Icon = {
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  Clock: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
};

const PatientDashboard = ({ 
  searchTerm, setSearchTerm, 
  filterSpecialization, setFilterSpecialization, 
  filteredDoctors, bookings,
  currentUser,
  setBookingDoctor, handleDelete, handleEdit, handleToggleAvailability
}) => {
  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 28px 80px", position: "relative", zIndex: 1 }}>
      
      {/* Hero header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 40, height: 1, background: "var(--accent-cyan)", opacity: 0.5 }}/>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-cyan)" }}>
            Find a specialist
          </span>
        </div>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 48,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          color: "var(--text-primary)",
          margin: 0,
        }}>
          Expert care,<br/>
          <span style={{ color: "var(--accent-cyan)" }}>on your schedule.</span>
        </h1>
        <p style={{ marginTop: 16, fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 520 }}>
          Browse top-rated specialists and book appointments instantly — no waiting rooms, no hassle.
        </p>
      </div>

      {/* ── Search + Filter bar ── */}
      <div style={{
        display: "flex", gap: 12, flexWrap: "wrap",
        marginBottom: 36,
        background: "var(--surface-1)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 14,
        padding: "14px 16px",
        alignItems: "center",
      }}>
        {/* Search */}
        <div style={{ flex: "1 1 240px", position: "relative", minWidth: 200 }}>
          <div style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            color: "var(--text-tertiary)", pointerEvents: "none",
          }}>
            <Icon.Search />
          </div>
          <input
            type="text"
            placeholder="Search by name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: 38 }}
          />
        </div>

        {/* Specialization filter */}
        <div style={{ flex: "0 0 220px", position: "relative" }}>
          <select
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
            className="input-field"
            style={{ paddingRight: 36, cursor: "pointer" }}
          >
            <option value="">All Specializations</option>
            {["Cardiologist","Dermatologist","Neurologist","Orthopedic","Pediatrician","General Physician"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            color: "var(--text-tertiary)", pointerEvents: "none",
          }}>
            <Icon.ChevronDown />
          </div>
        </div>

        {/* Count badge */}
        <div style={{
          marginLeft: "auto",
          fontSize: 13,
          color: "var(--text-tertiary)",
          whiteSpace: "nowrap",
        }}>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{filteredDoctors.length}</span>
          {" "}specialist{filteredDoctors.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Doctor grid ── */}
      {filteredDoctors.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 20px",
          background: "var(--surface-1)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 16,
        }}>
          <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.4 }}>🔍</div>
          <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 600 }}>No specialists found</h3>
          <p style={{ color: "var(--text-secondary)", margin: "0 0 24px" }}>
            Try adjusting your search or clearing the filters.
          </p>
          {(searchTerm || filterSpecialization) && (
            <button className="btn-ghost" onClick={() => { setSearchTerm(""); setFilterSpecialization(""); }}>
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {filteredDoctors.map((doc, i) => (
            <div key={doc._id} className="card-in" style={{ animationDelay: `${i * 0.06}s` }}>
              <DoctorCard
                doctor={doc}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onToggle={handleToggleAvailability}
                onBook={setBookingDoctor}
                currentUser={currentUser}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Bookings section ── */}
      {bookings.length > 0 && (
        <div style={{ marginTop: 72 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 32, margin: 0, letterSpacing: "-0.02em",
              }}>Your Appointments</h2>
              <p style={{ margin: "6px 0 0", color: "var(--text-secondary)", fontSize: 14 }}>
                Upcoming and recent bookings
              </p>
            </div>
            <div style={{
              background: "var(--accent-cyan-dim)",
              border: "1px solid var(--accent-cyan-glow)",
              borderRadius: 20, padding: "4px 14px",
              fontSize: 13, fontWeight: 700,
              color: "var(--accent-cyan)",
            }}>
              {bookings.length} total
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card" style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 14,
                padding: "18px 18px 18px 28px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 4 }}>For</div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{booking.patientName || booking.patientId?.name || "Family Member"}</div>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 5,
                    background: "var(--surface-3)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 8, padding: "5px 10px",
                    fontSize: 13, fontWeight: 600, color: "var(--accent-cyan)",
                  }}>
                    <Icon.Clock /> {booking.time || "Time TBD"}
                  </div>
                </div>

                <div style={{
                  borderTop: "1px solid var(--border-subtle)",
                  paddingTop: 12,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Doctor</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>Dr. {booking.doctorId?.name || "Unknown"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Date</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{booking.date}</div>
                  </div>
                </div>

                {/* Status Box */}
                <div style={{ 
                  marginTop: 14, padding: "8px", borderRadius: 8,
                  fontSize: 12, fontWeight: 600,
                  display: "flex", justifyContent: "center",
                  background: booking.status === "Confirmed" ? "rgba(16,185,129,0.1)" : (booking.status === "Cancelled" ? "rgba(244,63,94,0.1)" : "rgba(245,158,11,0.1)"),
                  color: booking.status === "Confirmed" ? "var(--accent-emerald)" : (booking.status === "Cancelled" ? "var(--accent-rose)" : "var(--accent-amber)")
                }}>
                  Status: {booking.status || "Scheduled"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default PatientDashboard;

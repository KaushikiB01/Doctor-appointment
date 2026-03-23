import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "./api";
import toast from "react-hot-toast";

const Icon = {
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
};

const DoctorDashboard = ({ currentUser, bookings, fetchBookings }) => {
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/bookings/${id}/status`, { status }, {
        headers: { authorization: `Bearer ${token}` }
      });
      await fetchBookings();
      toast.success(`Appointment ${status.toLowerCase()}`);
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingBookings = bookings.filter(b => b.status === "Scheduled");
  const pastOrRespondedBookings = bookings.filter(b => b.status !== "Scheduled");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { authorization: `Bearer ${token}` } : {};
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 28px 80px", position: "relative", zIndex: 1 }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 42,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          color: "var(--text-primary)",
          margin: 0,
        }}>
          Welcome, Dr. <span style={{ color: "var(--accent-cyan)" }}>{currentUser.name}</span>
        </h1>
        <p style={{ marginTop: 12, fontSize: 16, color: "var(--text-secondary)" }}>
          Here is your schedule and patient queue for today.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
        
        {/* Pending Requests Section */}
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            New Requests
            <span style={{ 
              background: "var(--accent-rose)", color: "#fff", 
              fontSize: 12, padding: "2px 8px", borderRadius: 12, fontWeight: 700 
            }}>
              {pendingBookings.length}
            </span>
          </h2>

          {pendingBookings.length === 0 ? (
            <div className="card-glass" style={{ padding: 40, textAlign: "center", color: "var(--text-tertiary)" }}>
              No pending appointment requests.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {pendingBookings.map(booking => (
                <div key={booking._id} className="card-glass" style={{ padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                        Patient
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 600 }}>{booking.patientName || booking.patientId?.name || "Unknown"}</div>
                    </div>
                    <div style={{
                      background: "rgba(245, 158, 11, 0.15)",
                      color: "var(--accent-amber)",
                      padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600
                    }}>
                      Pending
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: 14 }}>
                      <Icon.Calendar /> <span style={{ fontWeight: 500 }}>{booking.date}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: 14 }}>
                      <Icon.Clock /> <span style={{ fontWeight: 500 }}>{booking.time || "N/A"}</span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <button 
                      onClick={() => handleStatusUpdate(booking._id, "Confirmed")}
                      disabled={updatingId === booking._id}
                      style={{
                        background: "rgba(16,185,129,0.15)", color: "var(--accent-emerald)",
                        border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10,
                        padding: "10px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        cursor: "pointer", transition: "all 0.2s"
                      }}
                      onMouseOver={e => e.currentTarget.style.background = "rgba(16,185,129,0.25)"}
                      onMouseOut={e => e.currentTarget.style.background = "rgba(16,185,129,0.15)"}
                    >
                      <Icon.Check /> Accept
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(booking._id, "Cancelled")}
                      disabled={updatingId === booking._id}
                      style={{
                        background: "rgba(244,63,94,0.15)", color: "var(--accent-rose)",
                        border: "1px solid rgba(244,63,94,0.3)", borderRadius: 10,
                        padding: "10px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        cursor: "pointer", transition: "all 0.2s"
                      }}
                      onMouseOver={e => e.currentTarget.style.background = "rgba(244,63,94,0.25)"}
                      onMouseOut={e => e.currentTarget.style.background = "rgba(244,63,94,0.15)"}
                    >
                      <Icon.X /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actioned Bookings Section */}
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Your Schedule</h2>
          {pastOrRespondedBookings.length === 0 ? (
            <div className="card-glass" style={{ padding: 40, textAlign: "center", color: "var(--text-tertiary)" }}>
              No confirmed appointments yet.
            </div>
          ) : (
             <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pastOrRespondedBookings.map(booking => (
                <div key={booking._id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "var(--surface-2)", border: "1px solid var(--border-subtle)",
                  padding: "16px 24px", borderRadius: 12
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <div style={{ width: 60 }}>
                      <div style={{ fontSize: 13, color: "var(--text-tertiary)", fontWeight: 600 }}>{booking.date.split('-')[1]}/{booking.date.split('-')[2]}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--accent-cyan)" }}>{booking.time || "N/A"}</div>
                    </div>
                    <div style={{ width: 1, height: 30, background: "var(--border-subtle)" }} />
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600 }}>{booking.patientName || booking.patientId?.name || "Unknown Patient"}</div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Patient ID: {booking.patientId?._id?.slice(-6) || "N/A"}</div>
                    </div>
                  </div>
                  
                  <div style={{
                    padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: booking.status === "Confirmed" ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.1)",
                    color: booking.status === "Confirmed" ? "var(--accent-emerald)" : "var(--accent-rose)",
                    border: `1px solid ${booking.status === "Confirmed" ? "rgba(16,185,129,0.2)" : "rgba(244,63,94,0.2)"}`
                  }}>
                    {booking.status}
                  </div>
                </div>
              ))}
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;

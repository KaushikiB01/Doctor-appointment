import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import DoctorCard from "./DoctorCard";
import "./App.css";
import Login from "./Login";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "./api";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 10; hour <= 21; hour++) {
    for (let minute of ["00", "30"]) {
      if (hour === 21 && minute === "30") break;
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour;
      slots.push(`${displayHour}:${minute} ${period}`);
    }
  }
  return slots;
};

/* ── tiny icon helpers ── */
const Icon = {
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
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
  Logout: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Clock: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  User: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  X: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  ),
};

function App() {
  const [doctors, setDoctors] = useState([]);
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("");
  const [fees, setFees] = useState("");
  const [availableDays, setAvailableDays] = useState([]);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookings, setBookings] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(() => {
    const s = localStorage.getItem("user");
    return s ? JSON.parse(s) : null;
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { authorization: `Bearer ${token}` } : {};
  };

  const fetchBookings = useCallback(async () => {
    try {
      if (!currentUser) return;
      const res = await axios.get(`${API_URL}/bookings`, {
        params: { role: currentUser.role, userId: currentUser.id, doctorId: currentUser.doctorId },
        headers: { "Cache-Control": "no-cache" },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  }, [currentUser]);

  const fetchDoctors = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/doctors`);
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  }, []);

  useEffect(() => {
    if (currentUser) { fetchDoctors(); fetchBookings(); }
  }, [currentUser, fetchDoctors, fetchBookings]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/doctors/${id}`, { headers: getAuthHeaders() });
      await fetchDoctors();
      toast.success("Doctor removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setName(doctor.name);
    setSpecialization(doctor.specialization);
    setFees(doctor.fees || "");
    setAvailableDays(doctor.availableDays || []);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!name || !specialization) return toast.error("Please fill all fields");
    try {
      if (editingDoctor) {
        await axios.put(`${API_URL}/doctors/${editingDoctor._id}`,
          { name, specialization, fees, availableDays },
          { headers: getAuthHeaders() });
        toast.success("Profile updated");
      } else {
        await axios.post(`${API_URL}/doctors/add`,
          { name, specialization, fees, availableDays },
          { headers: getAuthHeaders() });
        toast.success("Doctor added");
      }
      setName(""); setSpecialization(""); setFees(""); setAvailableDays([]);
      setEditingDoctor(null); setIsModalOpen(false);
      await fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      await axios.put(`${API_URL}/doctors/toggle/${id}`, {}, { headers: getAuthHeaders() });
      await fetchDoctors();
      toast.success("Availability updated");
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterSpecialization === "" || doc.specialization === filterSpecialization)
  );

  if (!isLoggedIn || !currentUser) {
    return (
      <Login
        setIsLoggedIn={(status) => {
          setIsLoggedIn(status);
          const s = localStorage.getItem("user");
          if (s) setCurrentUser(JSON.parse(s));
        }}
      />
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setCurrentUser(null);
    toast.success("Signed out");
  };

  const handleBooking = async () => {
    if (!patientName || !date || !time) return toast.error("Fill all booking details");
    if (date < getTodayDate()) return toast.error("Cannot book a past date");
    try {
      await axios.post(`${API_URL}/appointments`, {
        doctorId: bookingDoctor._id,
        patientName,
        patientId: currentUser.id,
        date,
        time,
      });
      await fetchBookings();
      toast.success("Appointment confirmed");
      setBookingDoctor(null); setPatientName(""); setDate(""); setTime("");
    } catch {
      toast.error("Booking failed");
    }
  };

  const openAddModal = () => {
    setEditingDoctor(null); setName(""); setSpecialization(""); setFees(""); setAvailableDays([]);
    setIsModalOpen(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-0)", color: "var(--text-primary)" }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--surface-3)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-muted)",
            borderRadius: "10px",
            fontSize: "14px",
            fontFamily: "DM Sans, sans-serif",
          },
        }}
      />

      {/* Ambient orbs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div className="animate-blob" style={{
          position: "absolute", top: "-15%", right: "-8%",
          width: 600, height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
          animationDelay: "0s",
        }}/>
        <div className="animate-blob" style={{
          position: "absolute", bottom: "-20%", left: "-10%",
          width: 700, height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)",
          animationDelay: "4s",
        }}/>
        {/* Subtle grid */}
        <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.4 }}/>
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(8,12,20,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "0 28px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "var(--grad-cta)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(34,211,238,0.3)",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <span style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 22,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}>
            Medi<span style={{ color: "var(--accent-cyan)" }}>Slot</span>
          </span>
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {currentUser?.role === "admin" && (
            <button onClick={openAddModal} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px" }}>
              <Icon.Plus /> Add Doctor
            </button>
          )}

          {/* User chip */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "var(--surface-2)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 10, padding: "7px 14px",
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: "var(--grad-cta)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0,
            }}>
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{currentUser?.name}</div>
              <div style={{ fontSize: 11, color: "var(--accent-cyan)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {currentUser?.role}
              </div>
            </div>
          </div>

          <button onClick={handleLogout} className="btn-ghost" style={{
            display: "flex", alignItems: "center", gap: 7, padding: "9px 14px",
          }}>
            <Icon.Logout /> Sign out
          </button>
        </div>
      </nav>

      {/* ── MAIN ── */}
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
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 4 }}>Patient</div>
                      <div style={{ fontSize: 16, fontWeight: 600 }}>{booking.patientName}</div>
                    </div>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: "var(--surface-3)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: 8, padding: "5px 10px",
                      fontSize: 13, fontWeight: 600, color: "var(--accent-cyan)",
                    }}>
                      <Icon.Clock /> {booking.time}
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
                      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{booking.doctorId?.name || "Unknown"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Date</div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{booking.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── ADD/EDIT DOCTOR MODAL ── */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>

            {/* Close */}
            <button onClick={() => setIsModalOpen(false)} style={{
              position: "absolute", top: 20, right: 20,
              background: "var(--surface-3)",
              border: "1px solid var(--border-muted)",
              borderRadius: 8, width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "var(--text-secondary)",
            }}>
              <Icon.X />
            </button>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "var(--accent-cyan-dim)",
                border: "1px solid var(--accent-cyan-glow)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 26, margin: "0 0 6px",
                letterSpacing: "-0.02em",
              }}>
                {editingDoctor ? "Edit Specialist" : "Add Specialist"}
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)" }}>
                {editingDoctor ? "Update the doctor's profile information." : "Fill in the details to onboard a new specialist."}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label className="label-field">Full Name</label>
                <input type="text" placeholder="e.g. Dr. Sarah Jenkins" value={name}
                  onChange={(e) => setName(e.target.value)} className="input-field" />
              </div>

              <div>
                <label className="label-field">Specialization</label>
                <input type="text" placeholder="e.g. Cardiologist" value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)} className="input-field" />
              </div>

              <div>
                <label className="label-field">Consultation Fee (₹)</label>
                <input type="number" placeholder="e.g. 500" value={fees}
                  onChange={(e) => setFees(e.target.value)} className="input-field" />
              </div>

              <div>
                <label className="label-field">Available Days</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => {
                    const checked = availableDays.includes(day);
                    return (
                      <label key={day} style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                        width: 52, padding: "10px 8px",
                        background: checked ? "var(--accent-cyan-dim)" : "var(--surface-0)",
                        border: `1px solid ${checked ? "var(--accent-cyan-glow)" : "var(--border-subtle)"}`,
                        borderRadius: 10, cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", color: checked ? "var(--accent-cyan)" : "var(--text-secondary)" }}>
                          {day}
                        </span>
                        <input type="checkbox" checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) setAvailableDays([...availableDays, day]);
                            else setAvailableDays(availableDays.filter((d) => d !== day));
                          }}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost" style={{ flex: 1, padding: "12px 0" }}>
                Cancel
              </button>
              <button onClick={handleSubmit} className="btn-primary" style={{ flex: 1, padding: "12px 0" }}>
                {editingDoctor ? "Save changes" : "Create profile"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BOOK APPOINTMENT MODAL ── */}
      {bookingDoctor && (
        <div className="modal-overlay" onClick={() => setBookingDoctor(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>

            <button onClick={() => setBookingDoctor(null)} style={{
              position: "absolute", top: 20, right: 20,
              background: "var(--surface-3)",
              border: "1px solid var(--border-muted)",
              borderRadius: 8, width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "var(--text-secondary)",
            }}>
              <Icon.X />
            </button>

            <div style={{ marginBottom: 28 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16,
              }}>
                <Icon.Calendar />
              </div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
                Book Appointment
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)" }}>
                with <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{bookingDoctor.name}</span>
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label className="label-field">Patient Name</label>
                <input type="text" placeholder="e.g. John Doe" value={patientName}
                  onChange={(e) => setPatientName(e.target.value)} className="input-field" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label className="label-field">Date</label>
                  <input type="date" value={date} min={getTodayDate()}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-field"
                    style={{ colorScheme: "dark" }}
                  />
                </div>

                <div style={{ position: "relative" }}>
                  <label className="label-field">Time</label>
                  <select value={time} onChange={(e) => setTime(e.target.value)}
                    className="input-field" style={{ paddingRight: 32, cursor: "pointer" }}>
                    <option value="" disabled>Select time</option>
                    {generateTimeSlots().map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  <div style={{
                    position: "absolute", right: 12, bottom: 12,
                    color: "var(--text-tertiary)", pointerEvents: "none",
                  }}>
                    <Icon.ChevronDown />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button onClick={() => setBookingDoctor(null)} className="btn-ghost" style={{ flex: 1, padding: "12px 0" }}>
                Cancel
              </button>
              <button onClick={handleBooking} style={{
                flex: 1, padding: "12px 0",
                background: "var(--grad-success)",
                color: "#fff", fontWeight: 700,
                border: "none", borderRadius: 10,
                cursor: "pointer", fontSize: 14,
                fontFamily: "DM Sans, sans-serif",
                transition: "all 0.2s",
                boxShadow: "0 4px 20px rgba(16,185,129,0.25)",
              }}>
                Confirm booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
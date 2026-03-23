import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "./api";
import toast from "react-hot-toast";

const Icon = {
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Save: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
    </svg>
  )
};

const DoctorProfile = ({ currentUser, doctorData, fetchDoctors }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Doctor form state
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [fees, setFees] = useState("");
  const [availableDays, setAvailableDays] = useState([]);

  useEffect(() => {
    if (doctorData) {
      setName(doctorData.name);
      setSpecialization(doctorData.specialization);
      setFees(doctorData.fees);
      setAvailableDays(doctorData.availableDays || []);
    }
  }, [doctorData]);

  const handleSave = async () => {
    if (!doctorData) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/doctors/${doctorData._id}`, {
        name, specialization, fees, availableDays
      }, {
        headers: { authorization: `Bearer ${token}` }
      });
      toast.success("Profile successfully updated");
      setIsEditing(false);
      await fetchDoctors();
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  if (!doctorData) {
    return (
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 28px", textAlign: "center" }}>
        <h2 style={{ color: "var(--text-secondary)" }}>Loading doctor profile...</h2>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 28px 80px", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
        <div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 42, margin: "0 0 12px", color: "var(--text-primary)" }}>
            Professional Profile
          </h1>
          <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 16 }}>
            Manage your professional details and availability schedule.
          </p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="btn-ghost" style={{ display: "flex", gap: 8, alignItems: "center", background: "var(--surface-2)" }}>
            <Icon.Edit /> Edit Profile
          </button>
        ) : (
          <button onClick={handleSave} className="btn-primary" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Icon.Save /> Save Changes
          </button>
        )}
      </div>

      <div className="card-glass" style={{ padding: "40px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          <div>
            <label className="label-field">Full Name (Display Title)</label>
            {isEditing ? (
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" />
            ) : (
              <div style={{ fontSize: 18, color: "var(--text-primary)", fontWeight: 600 }}>{name}</div>
            )}
          </div>

          <div style={{ height: 1, background: "var(--border-subtle)" }} />

          <div>
            <label className="label-field">Medical Specialization</label>
            {isEditing ? (
              <input type="text" value={specialization} onChange={e => setSpecialization(e.target.value)} className="input-field" />
            ) : (
              <div style={{ fontSize: 18, color: "var(--text-primary)", fontWeight: 600 }}>{specialization}</div>
            )}
          </div>

          <div style={{ height: 1, background: "var(--border-subtle)" }} />

          <div>
            <label className="label-field">Consultation Fee (₹)</label>
            {isEditing ? (
              <input type="number" value={fees} onChange={e => setFees(e.target.value)} className="input-field" />
            ) : (
              <div style={{ fontSize: 18, color: "var(--text-primary)", fontWeight: 600 }}>₹{fees || 0}</div>
            )}
          </div>

          <div style={{ height: 1, background: "var(--border-subtle)" }} />

          <div>
            <label className="label-field">Available Days</label>
            {isEditing ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => {
                  const checked = availableDays.includes(day);
                  return (
                    <label key={day} style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                      width: 56, padding: "10px 8px",
                      background: checked ? "var(--accent-cyan-dim)" : "var(--surface-0)",
                      border: `1px solid ${checked ? "var(--accent-cyan-glow)" : "var(--border-subtle)"}`,
                      borderRadius: 10, cursor: "pointer", transition: "all 0.15s ease",
                    }}>
                      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", color: checked ? "var(--accent-cyan)" : "var(--text-secondary)" }}>
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
            ) : (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                {availableDays.length > 0 ? availableDays.map(day => (
                  <span key={day} style={{
                    background: "var(--surface-3)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontSize: 13, fontWeight: 700,
                    color: "var(--text-secondary)",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                  }}>
                    {day}
                  </span>
                )) : <span style={{ color: "var(--text-tertiary)", fontStyle: "italic" }}>No days scheduled</span>}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
};

export default DoctorProfile;

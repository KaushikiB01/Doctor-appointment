require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("DB Error:", err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'doctor', 'patient'], default: 'patient' }
});

const User = mongoose.model("User", userSchema);

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  email: String,
  specialization: String,
  fees: { type: Number, default: 0 },
  availableDays: { type: [String], default: [] },
  available: { type: Boolean, default: true }
});

const Doctor = mongoose.model("Doctor", doctorSchema);
const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  patientName: String,
  date: String,
  time: String,
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
const bookingSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  patientName: String,
  date: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: "Access denied" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

app.post("/api/doctors/add",verifyToken, async (req, res) => {
  try {
    const { name, email, specialization, fees, availableDays } = req.body;
    
    // Create User for Doctor
    const hashedPassword = await bcrypt.hash("doctor123", 10);
    // Use an email if provided, otherwise generate one for fallback
    const doctorEmail = email || `${name.replace(/\s+/g, '').toLowerCase()}@medislot.com`;
    
    let user = await User.findOne({ email: doctorEmail });
    if (!user) {
      user = new User({ name, email: doctorEmail, password: hashedPassword, role: "doctor" });
      await user.save();
    }

    const newDoctor = new Doctor({
      userId: user._id,
      name,
      email: doctorEmail,
      specialization,
      fees,
      availableDays
    });
    await newDoctor.save();
    
    res.json({ message: "Doctor added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding doctor" });
  }
});

app.get("/api/doctors", async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
});
app.delete("/api/doctors/:id", verifyToken,async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting doctor" });
  }
});
app.put("/api/doctors/toggle/:id",verifyToken, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    doctor.available = !doctor.available;
    await doctor.save();
    res.json({ message: "Availability updated" });
  } catch (error) {
    res.status(500).json({ error: "Error updating availability" });
  }
});
app.put("/api/doctors/:id", verifyToken, async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ error: "Error updating doctor" });
  }
});
app.post("/api/appointments", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.json({ message: "Appointment booked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Booking failed" });
  }
});
app.post("/api/bookings", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.json({ message: "Booking successful" });
  } catch (err) {
    res.status(500).json({ error: "Booking failed" });
  }
});
app.get("/api/bookings", async (req, res) => {
  try {
    const { role, userId, doctorId } = req.query;
    let query = {};

    if (role === 'patient' && userId) {
      query = { patientId: userId };
    } else if (role === 'doctor' && doctorId) {
      query = { doctorId };
    }
    const bookings = await Booking.find(query).populate("doctorId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Error fetching bookings" });
  }
});
const ADMIN_EMAIL = "admin@medislot.com";
const ADMIN_PASSWORD = "123456"; // simple for now

app.post("/api/register", async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role: "patient" });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "10h" }
    );

    res.json({
      message: "Registered successfully",
      token,
      user: {
        id: newUser._id,
        role: newUser.role,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin", name: "Admin" }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "10h" });
    return res.json({ token, user: { role: "admin", name: "Admin", email } });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    let extraData = {};
    if (user.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: user._id });
      if (doctor) extraData.doctorId = doctor._id;
    }

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name, ...extraData }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "10h" });
    res.json({ token, user: { id: user._id, role: user.role, name: user.name, email, ...extraData } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

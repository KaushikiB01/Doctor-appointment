const express = require("express");
const Doctor = require("../models/Doctor");

const router = express.Router();

// Add doctor
router.post("/add", async (req, res) => {
  const doctor = new Doctor(req.body);
  await doctor.save();
  res.json({ message: "Doctor added" });
});

// Get all doctors
router.get("/", async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
});
router.delete("/:id", async (req, res) => {
  console.log("DELETE HIT:", req.params.id);

  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ message: "Doctor deleted" });
});

module.exports = router;
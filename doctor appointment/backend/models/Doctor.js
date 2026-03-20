const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  experience: Number,
  available: Boolean,
});
module.exports = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
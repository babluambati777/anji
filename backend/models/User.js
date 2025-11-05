const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], required: true },
  speciality: { type: String }, // For doctors
  degree: { type: String }, // For doctors
  experience: { type: String }, // For doctors
  about: { type: String }, // For doctors
  fees: { type: Number }, // For doctors
  address: { line1: String, line2: String }, // For doctors
  image: { type: String }, // For doctors
  available: { type: Boolean, default: true }, // For doctors
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);

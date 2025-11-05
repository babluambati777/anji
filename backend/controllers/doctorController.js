const Appointment = require('../models/Appointment');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get doctor appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const { docId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(docId)) {
      return res.json({ success: false, message: 'Invalid doctor ID' });
    }
    const appointments = await Appointment.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, ...updates } = req.body;
    if (!mongoose.Types.ObjectId.isValid(docId)) {
      return res.json({ success: false, message: 'Invalid doctor ID' });
    }
    await User.findByIdAndUpdate(docId, updates);
    res.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get doctor earnings
const getDoctorEarnings = async (req, res) => {
  try {
    const { docId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(docId)) {
      return res.json({ success: false, message: 'Invalid doctor ID' });
    }
    const appointments = await Appointment.find({ docId, isCompleted: true });
    const earnings = appointments.reduce((sum, app) => sum + app.amount, 0);
    res.json({ success: true, earnings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = { getDoctorAppointments, updateDoctorProfile, getDoctorEarnings };

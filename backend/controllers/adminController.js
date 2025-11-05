const User = require('../models/User');
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    res.json({ success: true, doctors });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const image = req.file ? req.file.filename : null;
    const doctor = new User({
      name,
      email,
      password: hashedPassword,
      role: 'doctor',
      speciality,
      degree,
      experience,
      about,
      fees: Number(fees),
      address: JSON.parse(address),
      image,
    });
    await doctor.save();
    res.json({ success: true, message: 'Doctor added' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update doctor
const updateDoctor = async (req, res) => {
  try {
    const { docId, email, ...updates } = req.body;
    if (!mongoose.Types.ObjectId.isValid(docId)) {
      return res.json({ success: false, message: 'Invalid doctor ID' });
    }
    const doctor = await User.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: 'Doctor not found' });
    }
    if (email && email !== doctor.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.json({ success: false, message: 'Email already exists' });
      }
    }
    await User.findByIdAndUpdate(docId, updates);
    res.json({ success: true, message: 'Doctor updated' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(docId)) {
      return res.json({ success: false, message: 'Invalid doctor ID' });
    }
    const doctor = await User.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: 'Doctor not found' });
    }
    await User.findByIdAndDelete(docId);
    res.json({ success: true, message: 'Doctor deleted' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({}).populate('userId', 'name email').populate('docId', 'name speciality');
    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Approve/reject appointment
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body; // status: 'approved' or 'rejected'
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.json({ success: false, message: 'Invalid appointment ID' });
    }
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: 'Appointment not found' });
    }
    await Appointment.findByIdAndUpdate(appointmentId, { isCompleted: status === 'approved' });
    res.json({ success: true, message: `Appointment ${status}` });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' });
    res.json({ success: true, patients });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Deactivate patient
const deactivatePatient = async (req, res) => {
  try {
    const { patientId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.json({ success: false, message: 'Invalid patient ID' });
    }
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.json({ success: false, message: 'Patient not found' });
    }
    await User.findByIdAndUpdate(patientId, { available: false });
    res.json({ success: true, message: 'Patient deactivated' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete patient
const deletePatient = async (req, res) => {
  try {
    const { patientId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.json({ success: false, message: 'Invalid patient ID' });
    }
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.json({ success: false, message: 'Patient not found' });
    }
    await User.findByIdAndDelete(patientId);
    res.json({ success: true, message: 'Patient deleted' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.json({ success: false, message: 'Invalid appointment ID' });
    }
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: 'Appointment not found' });
    }
    await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });
    res.json({ success: true, message: 'Appointment cancelled' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get stats
const getStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAppointments = await Appointment.countDocuments({});
    const totalEarnings = await Appointment.aggregate([
      { $match: { isCompleted: true } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    res.json({
      success: true,
      stats: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        totalEarnings: totalEarnings[0]?.total || 0,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  getAllPatients,
  deactivatePatient,
  deletePatient,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getStats,
};

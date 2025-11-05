const Appointment = require('../models/Appointment');
const User = require('../models/User');
const mongoose = require('mongoose');
const doctors = require('../doctorsData');

// Get all doctors (public)
const getDoctors = async (req, res) => {
  try {
    const dbDoctors = await User.find({ role: 'doctor' });
    const allDoctors = dbDoctors.length > 0 ? dbDoctors : doctors;
    // Prepend backend URL to relative image paths
    allDoctors.forEach(doc => {
      if (doc.image && doc.image.startsWith('/images')) {
        doc.image = `${req.protocol}://${req.get('host')}${doc.image}`;
      }
    });
    console.log('Returning doctors:', allDoctors.length);
    res.json({ success: true, doctors: allDoctors });
  } catch (error) {
    console.log('Error in getDoctors:', error);
    res.json({ success: false, message: error.message });
  }
};

// Book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ success: false, message: 'Invalid user ID' });
    }
    const userData = await User.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: 'Invalid user ID' });
    }

    let docData = null;
    if (mongoose.Types.ObjectId.isValid(docId)) {
      docData = await User.findById(docId);
    }
    if (!docData) {
      // If not found in DB, search in doctorsData
      docData = doctors.find(doc => doc._id === docId);
    }
    if (!docData) {
      return res.json({ success: false, message: 'Invalid doctor ID' });
    }
    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor not available' });
    }
    const appointment = new Appointment({
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData,
      amount: docData.fees,
      date: Date.now(),
    });
    await appointment.save();
    res.json({ success: true, message: 'Appointment booked' });
  } catch (error) {
    console.error('Booking error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Get user appointments
const getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('getUserAppointments called with userId:', userId);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid userId:', userId);
      return res.json({ success: false, message: 'Invalid user ID' });
    }
    const appointments = await Appointment.find({ userId }).populate('docId', 'name speciality image');
    console.log('Found appointments:', appointments.length, 'for user:', userId);
    res.json({ success: true, appointments });
  } catch (error) {
    console.error('Error in getUserAppointments:', error);
    res.json({ success: false, message: error.message });
  }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ success: false, message: 'Invalid user ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.json({ success: false, message: 'Invalid appointment ID' });
    }
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: 'Appointment not found' });
    }
    if (appointment.userId.toString() !== userId) {
      return res.json({ success: false, message: 'Unauthorized' });
    }
    await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });
    res.json({ success: true, message: 'Appointment cancelled' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = { getDoctors, bookAppointment, getUserAppointments, cancelAppointment };

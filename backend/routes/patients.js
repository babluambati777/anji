const express = require('express');
const { getDoctors, bookAppointment, getUserAppointments, cancelAppointment } = require('../controllers/patientController');
const { authUser } = require('../middleware/auth');
const router = express.Router();

router.get('/doctors', getDoctors);
router.post('/book-appointment', authUser, bookAppointment);
router.get('/appointments', authUser, getUserAppointments);
router.post('/cancel-appointment', authUser, cancelAppointment);

module.exports = router;

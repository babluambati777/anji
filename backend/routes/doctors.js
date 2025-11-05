const express = require('express');
const { getDoctorAppointments, updateDoctorProfile, getDoctorEarnings } = require('../controllers/doctorController');
const { authDoctor } = require('../middleware/auth');
const router = express.Router();

router.get('/appointments', authDoctor, getDoctorAppointments);
router.put('/profile', authDoctor, updateDoctorProfile);
router.get('/earnings', authDoctor, getDoctorEarnings);

module.exports = router;

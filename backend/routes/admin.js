const express = require('express');
const {
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
} = require('../controllers/adminController');
const { authAdmin } = require('../middleware/auth');
const multer = require('multer');
const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.get('/doctors', authAdmin, getAllDoctors);
router.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);
router.put('/update-doctor', authAdmin, updateDoctor);
router.delete('/delete-doctor', authAdmin, deleteDoctor);
router.get('/patients', authAdmin, getAllPatients);
router.put('/deactivate-patient', authAdmin, deactivatePatient);
router.delete('/delete-patient', authAdmin, deletePatient);
router.get('/appointments', authAdmin, getAllAppointments);
router.put('/appointment-status', authAdmin, updateAppointmentStatus);
router.put('/cancel-appointment', authAdmin, cancelAppointment);
router.get('/stats', authAdmin, getStats);

module.exports = router;

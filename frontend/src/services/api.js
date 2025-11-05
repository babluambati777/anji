import axios from 'axios';

const API_BASE_URL = 'https://anji-07m5.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Auth APIs
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// Patient APIs
export const getDoctors = () => api.get('/patients/doctors');
export const bookAppointment = (data, token) => api.post('/patients/book-appointment', data, { headers: { token } });
export const getUserAppointments = (token) => api.get('/patients/appointments', { headers: { token } });
export const cancelAppointment = (data, token) => api.post('/patients/cancel-appointment', data, { headers: { token } });

// Doctor APIs
export const getDoctorAppointments = (dtoken) => api.get('/doctors/appointments', { headers: { dtoken } });
export const updateDoctorProfile = (data, dtoken) => api.put('/doctors/profile', data, { headers: { dtoken } });
export const getDoctorEarnings = (dtoken) => api.get('/doctors/earnings', { headers: { dtoken } });

// Admin APIs
export const getAllDoctors = (atoken) => api.get('/admin/doctors', { headers: { atoken } });
export const addDoctor = (formData, atoken) => api.post('/admin/add-doctor', formData, { headers: { atoken, 'Content-Type': 'multipart/form-data' } });
export const updateDoctor = (data, atoken) => api.put('/admin/update-doctor', data, { headers: { atoken } });
export const deleteDoctor = (data, atoken) => api.delete('/admin/delete-doctor', { data, headers: { atoken } });
export const getAllPatients = (atoken) => api.get('/admin/patients', { headers: { atoken } });
export const deactivatePatient = (data, atoken) => api.put('/admin/deactivate-patient', data, { headers: { atoken } });
export const deletePatient = (data, atoken) => api.delete('/admin/delete-patient', { data, headers: { atoken } });
export const getAllAppointments = (atoken) => api.get('/admin/appointments', { headers: { atoken } });
export const updateAppointmentStatus = (data, atoken) => api.put('/admin/appointment-status', data, { headers: { atoken } });
export const cancelAppointmentAdmin = (data, atoken) => api.put('/admin/cancel-appointment', data, { headers: { atoken } });
export const getStats = (atoken) => api.get('/admin/stats', { headers: { atoken } });

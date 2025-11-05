import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { addDoctor, cancelAppointmentAdmin, deactivatePatient, deleteDoctor, deletePatient, getAllAppointments, getAllDoctors, getAllPatients, getStats, updateAppointmentStatus, updateDoctor } from '../services/api';

const AdminDashboard = () => {
  const { token } = useContext(AppContext);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showEditDoctor, setShowEditDoctor] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorData, setDoctorData] = useState({
    name: '',
    email: '',
    password: '',
    speciality: '',
    degree: '',
    experience: '',
    about: '',
    fees: '',
    address: { line1: '', line2: '' },
    image: null,
  });

  const fetchData = async () => {
    try {
      const [docRes, patRes, appRes, statRes] = await Promise.all([
        getAllDoctors(token),
        getAllPatients(token),
        getAllAppointments(token),
        getStats(token)
      ]);

      if (docRes.data.success) setDoctors(docRes.data.doctors);
      if (patRes.data.success) setPatients(patRes.data.patients);
      if (appRes.data.success) setAppointments(appRes.data.appointments);
      if (statRes.data.success) setStats(statRes.data.stats);
    } catch {
      toast.error('Failed to load data');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleAppointmentStatus = async (appointmentId, status) => {
    try {
      const { data } = await updateAppointmentStatus({ appointmentId, status }, token);
      if (data.success) {
        toast.success(`Appointment ${status}`);
        setAppointments(appointments.map(app => app._id === appointmentId ? { ...app, isCompleted: status === 'approved' } : app));
        // Refresh the appointments list
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Update appointment status error:', error);
      toast.error('Update failed');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const { data } = await cancelAppointmentAdmin({ appointmentId }, token);
      if (data.success) {
        toast.success('Appointment cancelled');
        setAppointments(appointments.map(app => app._id === appointmentId ? { ...app, cancelled: true } : app));
        // Refresh the appointments list
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Cancel appointment error:', error);
      toast.error('Cancel failed');
    }
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setDoctorData({
      name: doctor.name,
      email: doctor.email,
      password: '',
      speciality: doctor.speciality,
      degree: doctor.degree,
      experience: doctor.experience,
      about: doctor.about,
      fees: doctor.fees,
      address: doctor.address,
      image: null,
    });
    setShowEditDoctor(true);
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('docId', editingDoctor._id);
    formData.append('name', doctorData.name);
    formData.append('email', doctorData.email);
    if (doctorData.password) formData.append('password', doctorData.password);
    formData.append('speciality', doctorData.speciality);
    formData.append('degree', doctorData.degree);
    formData.append('experience', doctorData.experience);
    formData.append('about', doctorData.about);
    formData.append('fees', doctorData.fees);
    formData.append('address', JSON.stringify(doctorData.address));
    if (doctorData.image) formData.append('image', doctorData.image);

    try {
      const { data } = await updateDoctor(formData, token);
      if (data.success) {
        toast.success('Doctor updated successfully');
        setDoctors(doctors.map(doc => doc._id === editingDoctor._id ? { ...doc, ...doctorData } : doc));
        setShowEditDoctor(false);
        setEditingDoctor(null);
        // Refresh the doctors list
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Update doctor error:', error);
      toast.error('Failed to update doctor');
    }
  };

  const handleDeleteDoctor = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      const { data } = await deleteDoctor({ docId }, token);
      if (data.success) {
        toast.success('Doctor deleted');
        setDoctors(doctors.filter(doc => doc._id !== docId));
        // Refresh the doctors list
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleDeactivatePatient = async (patientId) => {
    try {
      const { data } = await deactivatePatient({ patientId }, token);
      if (data.success) {
        toast.success('Patient deactivated');
        setPatients(patients.map(pat => pat._id === patientId ? { ...pat, available: false } : pat));
        // Refresh the patients list
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Deactivate failed');
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      const { data } = await deletePatient({ patientId }, token);
      if (data.success) {
        toast.success('Patient deleted');
        setPatients(patients.filter(pat => pat._id !== patientId));
        // Refresh the patients list
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', doctorData.name);
    formData.append('email', doctorData.email);
    formData.append('password', doctorData.password);
    formData.append('speciality', doctorData.speciality);
    formData.append('degree', doctorData.degree);
    formData.append('experience', doctorData.experience);
    formData.append('about', doctorData.about);
    formData.append('fees', doctorData.fees);
    formData.append('address', JSON.stringify(doctorData.address));
    if (doctorData.image) formData.append('image', doctorData.image);

    try {
      const { data } = await addDoctor(formData, token);
      if (data.success) {
        toast.success('Doctor added successfully');
        setDoctorData({
          name: '',
          email: '',
          password: '',
          speciality: '',
          degree: '',
          experience: '',
          about: '',
          fees: '',
          address: { line1: '', line2: '' },
          image: null,
        });
        setShowAddDoctor(false);
        // Refresh the doctors list
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Add doctor error:', error);
      toast.error('Failed to add doctor');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="m-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddDoctor(!showAddDoctor)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showAddDoctor ? 'Cancel' : 'Add Doctor'}
          </button>
        </div>
      </div>

      {showAddDoctor && (
        <div className="bg-white p-6 rounded shadow-md mb-5">
          <h2 className="text-xl font-semibold mb-4">Add New Doctor</h2>
          <form onSubmit={handleAddDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={doctorData.name}
              onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={doctorData.email}
              onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={doctorData.password}
              onChange={(e) => setDoctorData({ ...doctorData, password: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Speciality"
              value={doctorData.speciality}
              onChange={(e) => setDoctorData({ ...doctorData, speciality: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Degree"
              value={doctorData.degree}
              onChange={(e) => setDoctorData({ ...doctorData, degree: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Experience"
              value={doctorData.experience}
              onChange={(e) => setDoctorData({ ...doctorData, experience: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Fees"
              value={doctorData.fees}
              onChange={(e) => setDoctorData({ ...doctorData, fees: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Address Line 1"
              value={doctorData.address.line1}
              onChange={(e) => setDoctorData({ ...doctorData, address: { ...doctorData.address, line1: e.target.value } })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Address Line 2"
              value={doctorData.address.line2}
              onChange={(e) => setDoctorData({ ...doctorData, address: { ...doctorData.address, line2: e.target.value } })}
              className="border p-2 rounded"
            />
            <textarea
              placeholder="About"
              value={doctorData.about}
              onChange={(e) => setDoctorData({ ...doctorData, about: e.target.value })}
              className="border p-2 rounded col-span-1 md:col-span-2"
              rows="3"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setDoctorData({ ...doctorData, image: e.target.files[0] })}
              className="border p-2 rounded col-span-1 md:col-span-2"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 col-span-1 md:col-span-2"
            >
              Add Doctor
            </button>
          </form>
        </div>
      )}

      {showEditDoctor && (
        <div className="bg-white p-6 rounded shadow-md mb-5">
          <h2 className="text-xl font-semibold mb-4">Edit Doctor</h2>
          <form onSubmit={handleUpdateDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={doctorData.name}
              onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={doctorData.email}
              onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="New Password (leave empty to keep current)"
              value={doctorData.password}
              onChange={(e) => setDoctorData({ ...doctorData, password: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Speciality"
              value={doctorData.speciality}
              onChange={(e) => setDoctorData({ ...doctorData, speciality: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Degree"
              value={doctorData.degree}
              onChange={(e) => setDoctorData({ ...doctorData, degree: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Experience"
              value={doctorData.experience}
              onChange={(e) => setDoctorData({ ...doctorData, experience: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Fees"
              value={doctorData.fees}
              onChange={(e) => setDoctorData({ ...doctorData, fees: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Address Line 1"
              value={doctorData.address.line1}
              onChange={(e) => setDoctorData({ ...doctorData, address: { ...doctorData.address, line1: e.target.value } })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Address Line 2"
              value={doctorData.address.line2}
              onChange={(e) => setDoctorData({ ...doctorData, address: { ...doctorData.address, line2: e.target.value } })}
              className="border p-2 rounded"
            />
            <textarea
              placeholder="About"
              value={doctorData.about}
              onChange={(e) => setDoctorData({ ...doctorData, about: e.target.value })}
              className="border p-2 rounded col-span-1 md:col-span-2"
              rows="3"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setDoctorData({ ...doctorData, image: e.target.files[0] })}
              className="border p-2 rounded col-span-1 md:col-span-2"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 col-span-1 md:col-span-2"
            >
              Update Doctor
            </button>
            <button
              type="button"
              onClick={() => setShowEditDoctor(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 col-span-1 md:col-span-2"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.doctor_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{stats.totalDoctors}</p>
            <p className="text-gray-400">Doctors</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.appointments_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{stats.totalAppointments}</p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.patients_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{stats.totalPatients}</p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.earning_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">${stats.totalEarnings}</p>
            <p className="text-gray-400">Earnings</p>
          </div>
        </div>
      </div>

      {/* Doctors List */}
      <div className="bg-white mt-10">
        <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold">All Doctors</p>
        </div>
        <div className="pt-4 border border-t-0">
          {doctors.slice(0, 5).map((item, index) => (
            <div className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100" key={index}>
              <img className="rounded-full w-10" src={item.image || assets.doc1} alt="" />
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">{item.name}</p>
                <p className="text-gray-600">{item.speciality}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditDoctor(item)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteDoctor(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white mt-10">
        <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold">All Patients</p>
        </div>
        <div className="pt-4 border border-t-0">
          {patients.slice(0, 5).map((item, index) => (
            <div className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100" key={index}>
              <img className="rounded-full w-10" src={assets.profile_pic} alt="" />
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">{item.name}</p>
                <p className="text-gray-600">{item.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDeactivatePatient(item._id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  disabled={!item.available}
                >
                  {item.available ? 'Deactivate' : 'Deactivated'}
                </button>
                <button
                  onClick={() => handleDeletePatient(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white mt-10">
        <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold">All Appointments</p>
        </div>
        <div className="pt-4 border border-t-0">
          {appointments.slice(0, 5).map((item, index) => (
            <div className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100" key={index}>
              <img className="rounded-full w-10" src={item.docData?.image || assets.doc1} alt="" />
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">{item.docData?.name}</p>
                <p className="text-gray-600">Booking on {item.slotDate}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAppointmentStatus(item._id, 'approved')}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  disabled={item.cancelled || item.isCompleted}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAppointmentStatus(item._id, 'rejected')}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  disabled={item.cancelled || item.isCompleted}
                >
                  Reject
                </button>
                <button
                  onClick={() => handleCancelAppointment(item._id)}
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                  disabled={item.cancelled}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
